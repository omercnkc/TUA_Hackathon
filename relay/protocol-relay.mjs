import { WebSocketServer } from "ws";

const port = Number(process.env.TUA_RELAY_PORT || 8787);
const wss = new WebSocketServer({ port });

wss.on("connection", (socket) => {
  socket.on("message", (raw) => {
    for (const client of wss.clients) {
      if (client === socket || client.readyState !== client.OPEN) {
        continue;
      }

      client.send(raw.toString());
    }
  });
});

console.log(`TUA protocol relay listening on ws://0.0.0.0:${port}`);
