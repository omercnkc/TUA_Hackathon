export function createRunSnapshot({
  state,
  history,
  events,
  analysis
}) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    settings: {
      fuel: state.fuel,
      fuelMass: state.fuelMass,
      dryMass: state.dryMass,
      totalMass: state.totalMass,
      thrust: state.thrust,
      burnRate: state.burnRate,
      dragCoefficient: state.dragCoefficient,
      thrustCurve: state.thrustCurve
    },
    analysis,
    events,
    history,
    scenario: state.activeScenario || null,
    scenarioResult: state.scenarioResult || null
  };
}
