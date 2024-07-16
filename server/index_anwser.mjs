import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// 建立一個全域變數clients，記錄所有連線進來的用戶
const clients = {};

// 目標: 當有使用者連線時(觸發connection事件)
// -> 發送一流水編號為使用者作區分
wss.on("connection", (connection) => {
  console.log("新使用者已連線!!");

  connection.on("message", (message) => {
    console.log(`收到訊息 => ${message}`);

    // 將message訊息轉換成物件使用
    const parseMsg = JSON.parse(message);
    // 再透過轉換後的parseMsg物件內的type屬性，來判斷該執行哪個程式
    if (parseMsg.type === "register") {
      // 取出userID
      //   console.log(clients);

      const userID = parseMsg.userID;
      // 在clients物件中以使用者流水編號為屬性名建立物件
      // 內容為目前的連線物件
      clients[userID] = connection;
      // 在目前連線物件多增加一個userID屬性備用
      connection.userID = userID;
      //   console.log(connection);
      //   console.log(clients);

      // 設定廣播的對象，目前為無差別式廣播，包含自己
      // Object.keys()，將記錄所有用戶的clients物件的KEY值轉為陣列，放在變數otherClients
      // 其實取出來的就是用戶的ID，因為前面是用userID去當作屬性名稱建立物件的
      const otherClients = Object.keys(clients);
      // console.log(otherClients);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "registered", otherClients }));
        }
      });
      return;
    }

    if (parseMsg.type === "message") {
    }
  });
  connection.on("close", () => {
    console.log("使用者已離開");
    // 之前有增加userID的屬性，所以可以透過該屬性取得斷線的用戶ID
    let dsID = connection.userID;
    // 如果有取得使用者ID的畫，就從clients物件中刪除對應的連線資料
    if (connection.userID) {
      delete clients[connection.userID];
    }
    const otherClients = Object.keys(clients);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "disconnected",
            otherClients,
            disconnectedID: dsID,
          })
        );
      }
    });
  });
});
