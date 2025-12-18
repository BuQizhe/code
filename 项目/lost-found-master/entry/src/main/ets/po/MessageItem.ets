export interface MessageItem {
  id: string;
  avatar: string;
  title: string;
  preview: string;
  time: string;
  unreadCount?: number;
  type: 'comment' | 'private' | 'system';
  senderId?: string;
}