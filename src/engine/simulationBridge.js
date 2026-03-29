/**
 * SimulationBridge handles communication between different instances of the application.
 * It uses the native BroadcastChannel API for fast, low-latency sync between tabs/hosts.
 */

const CHANNEL_NAME = "TUA_SIMULATION_PROTOCOL_v1";
const channel = new BroadcastChannel(CHANNEL_NAME);

export const SimulationBridge = {
  /**
   * Sends the current simulation state to all other instances.
   */
  broadcastState: (state) => {
    channel.postMessage({
      type: "SYNC_STATE",
      payload: state
    });
  },

  /**
   * Broadcasts a command (like Ignition or Reset) to the master engine.
   */
  broadcastCommand: (cmd, data = null) => {
    channel.postMessage({
      type: "EXECUTE_COMMAND",
      command: cmd,
      data: data
    });
  },

  /**
   * Subscribes to messages from other instances.
   */
  subscribe: (callback) => {
    const handler = (event) => {
      callback(event.data);
    };
    channel.addEventListener("message", handler);
    return () => channel.removeEventListener("message", handler);
  }
};
