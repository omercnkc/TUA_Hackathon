// src/simulation/telemery/dataLogger.js
// Global singleton history. Her 10 frame'de bir kayıt alır → 6 kayıt/saniye.

const history = [];
let frameCounter = 0;
const SAMPLE_EVERY = 10; // Her 10 simülasyon adımında 1 kayıt

export function logState(state) {
  frameCounter++;
  if (frameCounter % SAMPLE_EVERY !== 0) return; // throttle

  history.push({
    time:         parseFloat(state.time.toFixed(2)),
    height:       parseFloat(state.height.toFixed(1)),
    velocity:     parseFloat(state.velocity.toFixed(2)),
    acceleration: parseFloat(state.acceleration.toFixed(2)),
    fuel:         parseFloat(state.fuel.toFixed(2)),
    state:        state.state || "",
  });
}

export function getHistory() {
  // Kopya döndür → React mutable array sorununu önler
  return history.slice();
}

export function getHistoryRef() {
  // Referans – sadece analiz için kullan
  return history;
}

export function resetLogger() {
  history.length = 0;
  frameCounter = 0;
}