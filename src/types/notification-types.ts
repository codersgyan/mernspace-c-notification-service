export interface Message {
  to: string;
  text: string;
  html?: string;
  subject?: string;
}

export interface NotificationTransport {
  send(message: Message): Promise<void>;
}
