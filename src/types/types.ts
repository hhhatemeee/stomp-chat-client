export type Message = {
  receiverName?: string;
  senderName: string;
  message: string;
  date: string;
};

export const enum StatusType {
  JOIN = "JOIN",
  MESSAGE = "MESSAGE",
}

export type ResponseBody = {
  senderName: string;
  receiverName: string;
  message: string;
  date: string;
  status: StatusType;
};

export type ChatType = {
  name: string;
  messages: Message[];
};

export type PublicChat = { PUBLIC: Message[] };
