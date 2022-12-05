import SockJS from "sockjs-client";
import { Client, over } from "stompjs";

const enum StatusType {
  JOIN = "JOIN",
  MESSAGE = "MESSAGE",
}

type UserData = { receivername: string; connected: boolean; username: string };
type PublicMessage = {
  senderName: string;
  message: string;
  date?: Date;
};

type ResponseBody = {
  senderName: string;
  receiverName: string;
  message: string;
  date: Date;
  status: StatusType;
};

export type ChatType = Record<string, PublicMessage[]>;

export class StompService {
  private sock: WebSocket;
  static stompClient: Client | null = null;
  private chats: ChatType = { PUBLIC: [] };
  static userData: UserData | null = null;

  constructor(url: string) {
    this.sock = new SockJS(url);
  }

  async connect(userData: UserData) {
    StompService.stompClient = over(this.sock);
    StompService.userData = { ...userData };
    StompService.stompClient.connect({}, this.onConnected);
  }

  private userJoin() {
    if (StompService.stompClient && StompService.userData) {
      const chatMessage = {
        senderName: StompService.userData?.username,
        status: "JOIN",
      };
      StompService.stompClient.send(
        "/chatroom/public",
        {},
        JSON.stringify(chatMessage)
      );
    }
  }

  private onConnected = () => {
    if (StompService.stompClient && StompService.userData) {
      StompService.stompClient.subscribe(
        "/chatroom/public",
        this.onMessageReceived
      );
      StompService.stompClient.subscribe(
        "/app/message",
        this.onMessageReceived
      );
      StompService.stompClient.subscribe(
        "/user/" + StompService.userData.username + "/private"
      );
      this.userJoin();
    }
  };

  getChats = () => {
    console.log(this.chats);
    return this.chats;
  };

  sendMessage(message: string) {
    if (StompService.stompClient && StompService.userData) {
      const chatMessage = {
        senderName: StompService.userData.username,
        status: "MESSAGE",
        message,
      };
      StompService.stompClient.send(
        "/app/message",
        {},
        JSON.stringify(chatMessage)
      );
    }
  }
  private onMessageReceived = (payload: { body: string }) => {
    const payloadData: ResponseBody = JSON.parse(payload.body);
    console.log(payloadData);
    switch (payloadData.status) {
      case "JOIN":
        if (!this.chats[payloadData.senderName]) {
          this.chats = { ...this.chats, [payloadData.senderName]: [] };
          console.log(this.chats);
        }
        break;
      case "MESSAGE":
        this.chats = {
          ...this.chats,
          PUBLIC: [
            ...this.chats["PUBLIC"],
            {
              message: payloadData.message,
              senderName: payloadData.senderName,
            },
          ],
        };
        // publicChats.push(payloadData);
        // setPublicChats([...publicChats]);
        break;
    }
  };
}
