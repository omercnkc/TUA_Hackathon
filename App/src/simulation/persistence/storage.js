const RUNS_STORAGE_KEY = "rocket-sim-runs";
const SESSION_STORAGE_KEY = "rocket-sim-session";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function saveRunsToStorage(runs) {
  try {
    localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(runs));
  } catch (error) {
    console.error("Failed to save runs to storage:", error);
  }
}

export function loadRunsFromStorage() {
  try {
    const raw = localStorage.getItem(RUNS_STORAGE_KEY);
    if (!raw) return [];
    return safeParse(raw, []);
  } catch (error) {
    console.error("Failed to load runs from storage:", error);
    return [];
  }
}

export function clearRunsFromStorage() {
  try {
    localStorage.removeItem(RUNS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear runs from storage:", error);
  }
}

export function saveSessionToStorage(session) {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save session to storage:", error);
  }
}

export function loadSessionFromStorage() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return safeParse(raw, null);
  } catch (error) {
    console.error("Failed to load session from storage:", error);
    return null;
  }
}

export function clearSessionFromStorage() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear session from storage:", error);
  }
}
