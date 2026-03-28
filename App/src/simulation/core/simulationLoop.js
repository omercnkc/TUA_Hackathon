// src/simulation/core/simulationLoop.js
// history artık state içinde TAŞINMIYOR.
// Sadece dataLogger global'ine yazılıyor.
// useSimulation/App bu veriyi ihtiyaç duyduğunda getHistory() ile alır.

import { DT } from "./constants";
import { calculateGravity } from "../physics/gravity";
import { calculateDrag, calculateAirDensity } from "../physics/drag";
import { calculateAcceleration } from "../physics/acceleration";
import { updateVelocity } from "../physics/velocity";
import { updatePosition } from "../physics/position";
import { updateFuel } from "../systems/fuelSystem";
import { calculateThrust } from "../systems/thurustSystem";
import { logState, getHistory } from "../telemetry/dataLogger";

const MAX_HEIGHT = 100_000; // 100 km — Kármán çizgisi

export function stepSimulation(state) {
  let newState = { ...state };

  switch (newState.state) {

    case "idle":
      return newState;

    case "countdown": {
      newState.countdown -= DT;
      newState.time += DT;

      if (newState.countdown <= 0) {
        newState.countdown = 0;
        newState.state = "launch";
        newState.launchStartTime = newState.time;
      }

      logState(newState); // throttled — her 10 frame'de 1
      return newState;
    }

    case "launch": {
      const currentAirDensity = calculateAirDensity(newState.height);

      const timeSinceLaunch = newState.launchStartTime !== null
        ? newState.time - newState.launchStartTime
        : 0;

      const thrust       = calculateThrust(newState.thrust, newState.fuel, timeSinceLaunch);
      const gravity      = calculateGravity(newState.mass);
      const drag         = calculateDrag(newState.velocity, newState.dragCoefficient, currentAirDensity);
      const acceleration = calculateAcceleration(thrust, gravity, drag, newState.mass);

      const velocity  = updateVelocity(newState.velocity, acceleration, DT);
      const rawHeight = updatePosition(newState.height, velocity, DT);
      const height    = rawHeight > MAX_HEIGHT ? MAX_HEIGHT : rawHeight;
      const fuel      = updateFuel(newState.fuel, newState.burnRate, DT);

      newState.height       = height;
      newState.velocity     = velocity;
      newState.acceleration = acceleration;
      newState.fuel         = fuel;
      newState.time        += DT;

      logState(newState);

      if (fuel <= 0) newState.state = "burnout";
      return newState;
    }

    case "burnout": {
      const currentAirDensity = calculateAirDensity(newState.height);
      const drag         = calculateDrag(newState.velocity, newState.dragCoefficient, currentAirDensity);
      const gravity      = calculateGravity(newState.mass);
      const acceleration = calculateAcceleration(0, gravity, drag, newState.mass);

      const v = updateVelocity(newState.velocity, acceleration, DT);
      const h = updatePosition(newState.height, v, DT);

      newState.height       = h > 0 ? h : 0;
      newState.velocity     = v;
      newState.acceleration = acceleration;
      newState.time        += DT;

      logState(newState);

      if (newState.height <= 0) newState.state = "idle";
      return newState;
    }

    default:
      return newState;
  }
}