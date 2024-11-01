export enum SocketEvent {
  SEND_MESSAGE = "sendMessage",
  SEND_MESSAGE_SUCCESS = "sendMessageSuccess",
}

export interface SocketError {
  type: string;
  message: string;
}
