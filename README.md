* 模擬使用者在聊天室時，可知道自己是哪一個使用者
* 思路
  * 透過設計message物件，建立一個type屬性，透過type判斷需要執行哪些相對應的動作
* 學習
  * Object.key(物件)
    * 回傳一個由該物件的key值所組成的array
  * 條件運算子
    * (條件) ? {符合的話回傳此值} : {不符合的話回傳此值}
  * 利用時間戳記當作每個user的ID
    * userID = new Date().getTime().toString();
  * WebSocket事件
    * open
    * message
    * close
* 使用套件及環境
  * VS code
  * node.js
  * ws
