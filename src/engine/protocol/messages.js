export const PROTOCOL_NAME = "TUA_SIMULATION_PROTOCOL";
export const PROTOCOL_VERSION = "2.0.0";

export const HOST_ROLES = {
  ENGINE: "engine",
  UI: "ui",
  HUD: "hud"
};

export const MESSAGE_TYPES = {
  HELLO: "HELLO",
  STATE_SNAPSHOT: "STATE_SNAPSHOT",
  COMMAND: "COMMAND"
};

export const COMMAND_TYPES = {
  START_COUNTDOWN: "START_COUNTDOWN",
  RESET_SIMULATION: "RESET_SIMULATION",
  APPLY_SETTINGS: "APPLY_SETTINGS",
  SET_SCENARIO: "SET_SCENARIO",
  CLEAR_RUN_HISTORY: "CLEAR_RUN_HISTORY",
  CLEAR_SESSION: "CLEAR_SESSION",
  TOGGLE_PAUSE: "TOGGLE_PAUSE",
  SET_SIMULATION_SPEED: "SET_SIMULATION_SPEED",
  STEP_ONCE: "STEP_ONCE"
};

function createEnvelope(runtime, type, payload = {}) {
  return {
    protocol: PROTOCOL_NAME,
    version: PROTOCOL_VERSION,
    type,
    sessionId: runtime.sessionId,
    timestamp: Date.now(),
    source: {
      id: runtime.instanceId,
      role: runtime.hostRole
    },
    payload
  };
}

export function createHelloMessage(runtime) {
  return createEnvelope(runtime, MESSAGE_TYPES.HELLO, {
    transport: runtime.transportType
  });
}

export function createSnapshotMessage(runtime, snapshot) {
  return createEnvelope(runtime, MESSAGE_TYPES.STATE_SNAPSHOT, snapshot);
}

export function createCommandMessage(runtime, command, payload = null) {
  return createEnvelope(runtime, MESSAGE_TYPES.COMMAND, {
    command,
    payload
  });
}

export function isProtocolMessage(message) {
  return Boolean(
    message &&
    message.protocol === PROTOCOL_NAME &&
    typeof message.type === "string" &&
    message.source &&
    typeof message.source.id === "string"
  );
}
