// src/simulation/core/simulationLoop.js
import { DT } from "./constants";
import { calculateGravity } from "../physics/gravity";
import { calculateDrag, calculateAirDensity } from "../physics/drag";
import { calculateAcceleration } from "../physics/acceleration";
import { updateVelocity } from "../physics/velocity";
import { updatePosition } from "../physics/position";
import { updateFuel, updateFuelMass } from "../systems/fuelSystem";
import { calculateTotalMass } from "../systems/massSystem";
import { calculateThrust } from "../systems/thurustSystem";
import { logState } from "../telemetry/dataLogger";
import { detectEvents } from "../events/eventDetector";

const MAX_HEIGHT = 100_000; // 100 km — Karman line

export function stepSimulation(state) {
  const prevState = { ...state };
  let newState = { ...state };

  // 1. Process Logic based on current state
  switch (state.state) {
    case "idle":
      break;

    case "countdown":
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
      const thrust = calculateThrust(newState.thrust, fuel, timeSinceLaunch);
      const drag = calculateDrag(newState.velocity, newState.dragCoefficient, currentAirDensity);
      
      const acceleration = calculateAcceleration(thrust, gravity, drag, totalMass);

      newState.velocity = updateVelocity(newState.velocity, acceleration, DT);
      const rawHeight = updatePosition(newState.height, newState.velocity, DT);
      
      newState.height = rawHeight > MAX_HEIGHT ? MAX_HEIGHT : rawHeight;
      newState.fuel = fuel;
      newState.fuelMass = fuelMass;
      newState.totalMass = totalMass;
      newState.mass = totalMass; // backward compatibility
      newState.acceleration = acceleration;
      newState.time += DT;

      if (newState.fuel <= 0) {
        newState.fuel = 0;
        newState.state = "burnout";
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
      newState.time += DT;

      if (newState.height <= 0 && newState.velocity <= 0) {
        newState.state = "landed";
      }
      break;
    }

    case "landed":
      break;
  }

  // 2. Continuous Event Detection (Apogee detection etc.)
  newState.events = detectEvents(prevState, newState, newState.events || []);

  // 3. Global Telemetry Logging
  logState(newState);

  return newState;
}