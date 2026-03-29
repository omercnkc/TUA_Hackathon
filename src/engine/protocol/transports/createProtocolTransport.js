import { createBroadcastChannelTransport } from "./broadcastChannelTransport";
import { createWebSocketTransport } from "./webSocketTransport";

function createNoopTransport() {
  return {
    send() {},
    subscribe() {
      return () => {};
    },
    subscribeStatus(listener) {
      listener({ connected: true, transport: "none", relayUrl: null });
      return () => {};
    },
    close() {}
  };
}

export function createProtocolTransport(runtime) {
  if (runtime.transportType === "broadcast") {
    return createBroadcastChannelTransport(runtime);
  }

  if (runtime.transportType === "ws") {
    return createWebSocketTransport(runtime);
  }

  return createNoopTransport();
}
