// src/simulation/core/simulationState.js

export const initialState = {
  state: "idle",        // "idle" | "countdown" | "launch" | "burnout"
  countdown: 5,

  height: 0,
  velocity: 0,
  acceleration: 0,

  fuel: 100,
  mass: 1000,
  thrust: 15000,
  burnRate: 2,

  dragCoefficient: 0.02,

  time: 0,
  launchStartTime: null,

  events: []
};