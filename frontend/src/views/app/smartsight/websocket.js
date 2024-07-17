import moment from "moment";
import ReconnectingWebSocket from "reconnecting-websocket";
import WS from "ws";
import { darsaURL } from "../../../constants/defaultValues";
class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
    let lastTransmit = moment();
  }

  connect(facid, token) {
    if (facid !== undefined && token !== undefined) {
      console.log(facid);
      console.log(token);
      const options = {
        WebSocket: WS, // custom WebSocket constructor
        connectionTimeout: 1000,
        maxRetries: 10,
      };

      const path = `ws://${darsaURL}/ws/facility/${facid}/?token=${token}`;
      this.socketRef = new WebSocket(path, [], options);
      this.socketRef.onopen = () => {
        console.log("WebSocket open");
      };

      this.socketRef.onmessage = (e) => {
        console.log(e.data);

        // this.socketNewMessage(e.data);
      };
      this.socketRef.onerror = (e) => {
        console.log(e.message);
      };
      this.socketRef.onclose = () => {
        console.log("WebSocket closed let's reopen");
        this.connect();
      };
    }
  }

  disconnect() {
    this.socketRef.close();
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === "messages") {
      this.callbacks[command](parsedData.messages);
    }
    if (command === "new_message") {
      this.callbacks[command](parsedData.message);
    }
  }

  fetchMessages(username, chatId) {
    this.sendMessage({
      command: "fetch_messages",
      username: username,
      chatId: chatId,
    });
  }

  newChatMessage(message) {
    this.sendMessage({
      command: "new_message",
      from: message.from,
      message: message.content,
      chatId: message.chatId,
    });
  }

  addCallbacks(messagesCallback, newMessageCallback) {
    this.callbacks["messages"] = messagesCallback;
    this.callbacks["new_message"] = newMessageCallback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

  state() {
    return this.socketRef.readyState;
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
