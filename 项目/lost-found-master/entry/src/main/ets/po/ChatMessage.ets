export interface ChatMessage {
  id: string;
  content: string;
  time: string;
  isSent: boolean; // true表示自己发送的，false表示对方发送的
}