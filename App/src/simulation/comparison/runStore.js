import {
  saveRunsToStorage,
  loadRunsFromStorage,
  clearRunsFromStorage
} from "../persistence/storage";

const runs = loadRunsFromStorage();

export function saveRun(run) {
  runs.push(run);
  saveRunsToStorage(runs);
}

export function getRuns() {
  return runs;
}

export function resetRuns() {
  runs.length = 0;
  clearRunsFromStorage();
}

export function replaceRuns(newRuns) {
  runs.length = 0;
  runs.push(...newRuns);
  saveRunsToStorage(runs);
}
