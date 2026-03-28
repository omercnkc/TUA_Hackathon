export const simulationPresets = {
  default: {
    fuel: 100,
    fuelMass: 100,
    dryMass: 900,
    thrust: 15000,
    burnRate: 1,
    dragCoefficient: 0.02
  },

  lightRocket: {
    fuel: 80,
    fuelMass: 80,
    dryMass: 620,
    thrust: 14000,
    burnRate: 1.2,
    dragCoefficient: 0.018
  },

  heavyRocket: {
    fuel: 160,
    fuelMass: 160,
    dryMass: 1640,
    thrust: 22000,
    burnRate: 1.6,
    dragCoefficient: 0.03
  },

  highThrust: {
    fuel: 120,
    fuelMass: 120,
    dryMass: 880,
    thrust: 26000,
    burnRate: 2.2,
    dragCoefficient: 0.022
  }
};