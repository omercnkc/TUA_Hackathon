const history = [];
let frameCounter = 0;

const SAMPLE_EVERY = 10;
const MAX_HISTORY_POINTS = 2400;

export function logState(state) {
  frameCounter += 1;
  if (frameCounter % SAMPLE_EVERY !== 0) {
    return;
  }

  history.push({
    time: parseFloat(state.time.toFixed(2)),
    height: parseFloat(state.height.toFixed(1)),
    velocity: parseFloat(state.velocity.toFixed(2)),
    acceleration: parseFloat(state.acceleration.toFixed(2)),
    fuel: parseFloat(state.fuel.toFixed(2)),
    fuelMass: parseFloat(state.fuelMass?.toFixed(2) || 0),
    totalMass: parseFloat(state.totalMass?.toFixed(2) || 0),
    currentThrust: parseFloat(state.currentThrust?.toFixed(2) || 0),
    thrustPhase: state.thrustPhase || "idle",
    state: state.state || ""
  });

  if (history.length > MAX_HISTORY_POINTS) {
    history.splice(0, history.length - MAX_HISTORY_POINTS);
  }
}

export function getHistory() {
  return history.slice();
}

export function getHistoryRef() {
  return history;
}

export function resetLogger() {
  history.length = 0;
  frameCounter = 0;
}
