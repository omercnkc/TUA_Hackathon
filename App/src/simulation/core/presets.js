export const simulationPresets = {
  default: {
    fuel: 100,
    mass: 1000,
    thrust: 15000,
    burnRate: 1,
    dragCoefficient: 0.02
  },

  lightRocket: {
    fuel: 80,
    mass: 700,
    thrust: 14000,
    burnRate: 1.2,
    dragCoefficient: 0.018
  },

  heavyRocket: {
    fuel: 160,
    mass: 1800,
    thrust: 22000,
    burnRate: 1.6,
    dragCoefficient: 0.03
  },

  highThrust: {
    fuel: 120,
    mass: 1000,
    thrust: 26000,
    burnRate: 2.2,
    dragCoefficient: 0.022
  }
};