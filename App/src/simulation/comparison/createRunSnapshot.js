export function createRunSnapshot({ state, history, events, analysis }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    settings: {
      fuel: state.fuel,
      mass: state.mass,
      thrust: state.thrust,
      burnRate: state.burnRate,
      dragCoefficient: state.dragCoefficient
    },
    analysis,
    events,
    history
  };
}
