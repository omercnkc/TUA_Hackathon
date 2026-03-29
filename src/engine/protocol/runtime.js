import { HOST_ROLES } from "./messages";

function createInstanceId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `instance-${Math.random().toString(36).slice(2, 10)}`;
}

function resolvePathRole(pathname) {
  if (pathname.endsWith("/engine.html") || pathname.endsWith("\\engine.html")) {
    return HOST_ROLES.ENGINE;
  }

  if (pathname.endsWith("/hud.html") || pathname.endsWith("\\hud.html")) {
    return HOST_ROLES.HUD;
  }

  return HOST_ROLES.UI;
}

function resolveHostRole(params) {
  const requestedRole = params.get("host");
  const validRoles = new Set(Object.values(HOST_ROLES));
  if (validRoles.has(requestedRole)) {
    return requestedRole;
  }

  return resolvePathRole(window.location.pathname);
}

export function getProtocolRuntime() {
  const params = new URLSearchParams(window.location.search);
  const hostRole = resolveHostRole(params);
  const requestedTransport = params.get("transport");
  const transportType = requestedTransport || "ws";

  return {
    hostRole,
    transportType,
    relayUrl: params.get("relay") || "ws://localhost:8787",
    sessionId: params.get("session") || "default",
    channelName: `TUA_SIMULATION_PROTOCOL_${params.get("session") || "default"}`,
    instanceId: createInstanceId()
  };
}
