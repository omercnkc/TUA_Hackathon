export function createSessionSnapshot(state) {
  return {
    settings: {
      fuel: state.fuel,
      fuelMass: state.fuelMass,
      dryMass: state.dryMass,
      totalMass: state.totalMass,
      mass: state.mass,
      thrust: state.thrust,
      burnRate: state.burnRate,
      dragCoefficient: state.dragCoefficient,
      thrustCurve: state.thrustCurve
    },
    activeScenario: state.activeScenario || null,
    simulationSpeed: state.simulationSpeed ?? 1
  };
}
