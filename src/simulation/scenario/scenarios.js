export const simulationScenarios = {
  reach50km: {
    id: "reach50km",
    name: "Reach 50km Altitude",
    description: "Rocket must reach at least 50,000 meters.",
    targetAltitude: 50000
  },

  reach100km: {
    id: "reach100km",
    name: "Reach 100km Altitude",
    description: "Rocket must reach at least 100,000 meters.",
    targetAltitude: 100000
  },

  heavyPayload: {
    id: "heavyPayload",
    name: "Heavy Payload Mission",
    description: "Rocket must carry heavy mass and still reach 30,000 meters.",
    targetAltitude: 30000,
    minimumMass: 1500
  },

  fuelEfficiency: {
    id: "fuelEfficiency",
    name: "Fuel Efficiency Mission",
    description: "Rocket must reach 40,000 meters with at least 20 fuel remaining.",
    targetAltitude: 40000,
    minimumRemainingFuel: 20
  }
};
