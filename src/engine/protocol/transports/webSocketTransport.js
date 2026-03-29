import { MESSAGE_TYPES } from "../messages";

const MAX_QUEUED_MESSAGES = 50;

export function createWebSocketTransport(runtime) {
  const messageListeners = new Set();
  const statusListeners = new Set();
  const queue = [];

  let socket = null;
  let reconnectTimer = null;
  let isClosed = false;
  let latestSnapshot = null;
  let status = {
    connected: false,
    transport: "ws",
    relayUrl: runtime.relayUrl
  };

  const notifyStatus = (patch) => {
    status = { ...status, ...patch };
    statusListeners.forEach((listener) => listener(status));
  };

  const flushQueue = () => {
    if (latestSnapshot && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(latestSnapshot);
      latestSnapshot = null;
    }

    while (queue.length > 0 && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(queue.shift());
    }
  };

  const connect = () => {
    socket = new WebSocket(runtime.relayUrl);

    socket.addEventListener("open", () => {
      notifyStatus({ connected: true });
      flushQueue();
    });

    socket.addEventListener("message", (event) => {
      try {
        const parsed = JSON.parse(event.data);
        messageListeners.forEach((listener) => listener(parsed));
      } catch (error) {
        console.warn("Protocol relay message parse failed", error);
      }
    });

    socket.addEventListener("close", () => {
      notifyStatus({ connected: false });

      if (!isClosed) {
        reconnectTimer = window.setTimeout(connect, 1500);
      }
    });

    socket.addEventListener("error", () => {
      notifyStatus({ connected: false });
    });
  };

  connect();

  return {
    send(message) {
      const serialized = JSON.stringify(message);

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(serialized);
        return;
      }

      if (message?.type === MESSAGE_TYPES.STATE_SNAPSHOT) {
        latestSnapshot = serialized;
        return;
      }

      if (queue.length >= MAX_QUEUED_MESSAGES) {
        queue.shift();
      }

      queue.push(serialized);
    },
    subscribe(listener) {
      messageListeners.add(listener);
      return () => messageListeners.delete(listener);
    },
    subscribeStatus(listener) {
      statusListeners.add(listener);
      listener(status);
      return () => statusListeners.delete(listener);
    },
    close() {
      isClosed = true;
      latestSnapshot = null;
      queue.length = 0;
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
      if (socket) {
        socket.close();
      }
      notifyStatus({ connected: false });
    }
  };
}
