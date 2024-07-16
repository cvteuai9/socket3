import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const clients = {};

wss.on("connection", (connection) => {
  console.log("新的使用者已連線");

  connection.on("message", (message) => {
    const msg = JSON.parse(message);
    if (msg.type === "register") {
      const { userID } = msg;
      clients[userID] = connection;
      connection.userID = userID;
      const otherClients = Object.keys(clients);
      wss.clients.forEach((client) => {
        let toClientParams = {
          type: "registered",
          otherClients,
        };
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(toClientParams));
        }
      });
    }

    if (msg.type === "message") {
    }
  });

  connection.on("close", () => {
    console.log("使用者已離線");
    let dsID = connection.userID;
    if (dsID) {
      delete clients[dsID];
    }
    const otherClients = Object.keys(clients);
    wss.clients.forEach((client) => {
      let toClientParams = {
        type: "disconnected",
        otherClients,
      };
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(toClientParams));
      }
    });
  });
});
