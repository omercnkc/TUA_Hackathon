const runs = [];

export function saveRun(run) {
  runs.push(run);
}

export function getRuns() {
  return runs;
}

export function resetRuns() {
  runs.length = 0;
}
