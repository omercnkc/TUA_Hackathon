export function createBroadcastChannelTransport(runtime) {
  const channel = new BroadcastChannel(runtime.channelName);
  const messageListeners = new Set();
  const statusListeners = new Set();

  const status = {
    connected: true,
    transport: "broadcast",
    relayUrl: null
  };

  const handleMessage = (event) => {
    messageListeners.forEach((listener) => listener(event.data));
  };

  channel.addEventListener("message", handleMessage);

  return {
    send(message) {
      channel.postMessage(message);
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
      channel.removeEventListener("message", handleMessage);
      channel.close();
      statusListeners.forEach((listener) => listener({ ...status, connected: false }));
    }
  };
}
