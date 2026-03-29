import { getProtocolRuntime } from "./protocol/runtime";
import {
  createCommandMessage,
  createHelloMessage,
  createSnapshotMessage,
  isProtocolMessage
} from "./protocol/messages";
import { createProtocolTransport } from "./protocol/transports/createProtocolTransport";

const runtime = getProtocolRuntime();
const transport = createProtocolTransport(runtime);
const messageListeners = new Set();
const statusListeners = new Set();

let currentStatus = {
  connected: runtime.transportType === "none",
  transport: runtime.transportType,
  relayUrl: runtime.relayUrl,
  lastMessageAt: null,
  lastSnapshotAt: null
};

const updateStatus = (patch) => {
  currentStatus = { ...currentStatus, ...patch };
  statusListeners.forEach((listener) => listener(currentStatus));
};

transport.subscribeStatus((status) => {
  updateStatus(status);
});

transport.subscribe((message) => {
  if (!isProtocolMessage(message)) {
    return;
  }

  if (message.sessionId !== runtime.sessionId || message.source.id === runtime.instanceId) {
    return;
  }

  updateStatus({
    lastMessageAt: message.timestamp || Date.now(),
    lastSnapshotAt: message.type === "STATE_SNAPSHOT"
      ? message.timestamp || Date.now()
      : currentStatus.lastSnapshotAt
  });

  messageListeners.forEach((listener) => listener(message));
});

if (runtime.transportType !== "none") {
  transport.send(createHelloMessage(runtime));
}

export const SimulationBridge = {
  runtime,
  subscribe(listener) {
    messageListeners.add(listener);
    return () => messageListeners.delete(listener);
  },
  subscribeStatus(listener) {
    statusListeners.add(listener);
    listener(currentStatus);
    return () => statusListeners.delete(listener);
  },
  getStatus() {
    return currentStatus;
  },
  broadcastState(snapshot) {
    transport.send(createSnapshotMessage(runtime, snapshot));
  },
  broadcastCommand(command, payload = null) {
    transport.send(createCommandMessage(runtime, command, payload));
  },
  announcePresence() {
    transport.send(createHelloMessage(runtime));
  },
  close() {
    transport.close();
  }
};
