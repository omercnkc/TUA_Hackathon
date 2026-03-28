export function collectTelemetry(state) {
  return {
    height: state.height,
    velocity: state.velocity,
    acceleration: state.acceleration,
    fuel: state.fuel,
    time: state.time,
    maxHeight: state.maxHeight,
    impactVelocity: state.impactVelocity,
    flightTime: state.flightTime,
    state: state.state
  };
}