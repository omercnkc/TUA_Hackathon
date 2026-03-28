// src/simulation/core/simulationLoop.js
import { DT } from "./constants";
import { calculateGravity } from "../physics/gravity";
import { calculateDrag, calculateAirDensity } from "../physics/drag";
import { calculateAcceleration } from "../physics/acceleration";
import { updateVelocity } from "../physics/velocity";
import { updatePosition } from "../physics/position";
import { updateFuel, updateFuelMass } from "../systems/fuelSystem";
import { calculateTotalMass } from "../systems/massSystem";
import { calculateThrustState } from "../systems/thrustSystem";
import { logState } from "../telemetry/dataLogger";
import { detectEvents } from "../events/eventDetector";

const MAX_HEIGHT = 100_000; // 100 km — Karman line

export function stepSimulation(state) {
  const prevState = { ...state };
  let newState = { ...state };

  // 1. Process Logic based on current state
  switch (state.state) {
    case "idle":
      newState.currentThrust = 0;
      newState.thrustPhase = "idle";
      break;

    case "countdown":
      newState.currentThrust = 0;
      newState.thrustPhase = "idle";
      newState.countdown -= DT;
      newState.time += DT;
      if (newState.countdown <= 0) {
        newState.countdown = 0;
        newState.state = "launch";
        newState.launchStartTime = newState.time;
      }
      break;

    case "launch": {
      const fuel = updateFuel(newState.fuel, newState.burnRate, DT);
      const fuelMass = updateFuelMass(newState.fuelMass, newState.burnRate, DT);
      const totalMass = calculateTotalMass(newState.dryMass, fuelMass);

      const currentAirDensity = calculateAirDensity(newState.height);
      const gravity = calculateGravity(totalMass);
      
      const timeSinceLaunch = newState.launchStartTime !== null ? newState.time - newState.launchStartTime : 0;
      
      const thrustState = calculateThrustState(
        newState.thrust,
        fuel,
        timeSinceLaunch,
        newState.thrustCurve
      );

      const thrust = thrustState.currentThrust;
      const drag = calculateDrag(newState.velocity, newState.dragCoefficient, currentAirDensity);
      
      const acceleration = calculateAcceleration(thrust, gravity, drag, totalMass);

      // Launchpad support logic: don't fall below ground if thrust < gravity during ramp-up
      if (newState.height <= 0.01 && acceleration <= 0) {
        newState.velocity = 0;
        newState.acceleration = 0; 
      } else {
        newState.velocity = updateVelocity(newState.velocity, acceleration, DT);
      }

      const rawHeight = updatePosition(newState.height, newState.velocity, DT);
      newState.height = Math.max(0, rawHeight > MAX_HEIGHT ? MAX_HEIGHT : rawHeight);
      
      newState.fuel = fuel;
      newState.fuelMass = fuelMass;
      newState.totalMass = totalMass;
      newState.mass = totalMass; // backward compatibility
      newState.acceleration = acceleration;
      newState.currentThrust = thrust;
      newState.thrustPhase = thrustState.phase;
      newState.time += DT;

      // Only transition to burnout if fuel is gone OR motor profile explicitly ended (e.g. tail-off finished)
      // Removed the 'thrust <= 0' check because it breaks the start of ramp-up.
      if (newState.fuel <= 0 || thrustState.phase === "burnout") {
        newState.fuel = Math.max(0, newState.fuel);
        newState.state = "burnout";
        newState.currentThrust = 0;
        newState.thrustPhase = "burnout";
      }
      break;
    }

    case "burnout": {
      const totalMass = calculateTotalMass(newState.dryMass, newState.fuelMass);
      const currentAirDensity = calculateAirDensity(newState.height);
      const gravity = calculateGravity(totalMass);
      const drag = calculateDrag(newState.velocity, newState.dragCoefficient, currentAirDensity);
      
      const acceleration = calculateAcceleration(0, gravity, drag, totalMass);

      newState.velocity = updateVelocity(newState.velocity, acceleration, DT);
      const h = updatePosition(newState.height, newState.velocity, DT);
      
      newState.height = h > 0 ? h : 0;
      newState.totalMass = totalMass;
      newState.mass = totalMass; // backward compatibility
      newState.acceleration = acceleration;
      newState.currentThrust = 0;
      newState.thrustPhase = "burnout";
      newState.time += DT;

      // Ensure we don't land at the very start of burnout if burnout starts at t=0 (ramp up issue)
      // but only if we have been in burnout/falling for a moment or height was significant
      if (newState.height <= 0 && newState.velocity <= 0) {
        newState.state = "landed";
      }
      break;
    }

    case "landed":
      newState.currentThrust = 0;
      newState.thrustPhase = "idle";
      break;
  }

  // 2. Continuous Event Detection (Apogee detection etc.)
  newState.events = detectEvents(prevState, newState, newState.events || []);

  // 3. Global Telemetry Logging
  logState(newState);

  return newState;
}