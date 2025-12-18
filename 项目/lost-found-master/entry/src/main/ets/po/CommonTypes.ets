// 通用API响应接口
export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

// 统一的社区信息接口
export interface CommunityInfo {
  id: string;
  name: string;
  type: string;
  memberCount: number;
  isAdmin: boolean;
  isJoined: boolean;
  address?: string;
}

// API返回的社区信息接口（用于API数据转换）
export interface ApiCommunityInfo {
  communityId: string;
  communityName: string;
  communityType: string;
  memberCount?: number;
  isAdmin?: boolean;
  isJoined?: boolean;
  address?: string;
  id?: string;
  name?: string;
  type?: string;
}

// 创建社区响应数据接口
export interface CreateCommunityResponse {
  communityId: string;
  communityName: string;
  communityType: string;
  address: string;
  creatorId: string;
  createTime: string;
}

// 创建社区请求接口
export interface CreateRequestInfo extends Record<string, string | number | object> {
  communityName: string;
  communityType: string;
  address: string;
  creatorId: string;
}

// 加入社区请求接口
export interface JoinRequestInfo extends Record<string, string | number | object> {
  userId: string;
  communityId: string;
}

// 创建评论请求接口
export interface CreateCommentRequest extends Record<string, string | number | object> {
  id: string | number | object;
  content: string;
  images: string[];
  commenterId: string;
  postId: string;
}

// 创建认领请求接口
export interface CreateClaimRequest extends Record<string, string | number | object> {
  claimerId: string;
  postId: string;
  claimerPhone: string;
}

// API返回的评论数据接口（用于API数据转换）
export interface ApiCommentData {
  commentId: string;
  commenterName: string;
  content: string;
  createTime: string;
  commenterAvatar?: string;
  postId?: string;
  images?: string[];
  commenterId?: string;
}

// API返回的物品数据接口（用于API数据转换）
export interface ApiItemData {
  postId: string;
  itemName: string;
  itemDescription: string;
  lostLocation: string;
  lostTime: string;
  contact: string;
  images: string[];
  postType: string;
  publisherId: string;
  status: string;
  communityId: string;
  storageLocation?: string;
  category?: string;
}

// 定义发布请求数据接口
export interface PublishRequestData extends Record<string, string | number | object> {
  itemName: string;
  itemDescription: string;
  images: string[];
  postType: string;
  lostTime: string;
  lostLocation: string;
  contact: string;
  publisherId: string;
  communityId: string;
}

// 私信相关接口
// API返回的私信数据接口
export interface ApiMessageData {
  messageId: string;
  content: string;
  sendTime: string;
  senderId: string;
  receiverId: string;
  images?: string[];
}

// 发送私信请求接口
export interface SendMessageRequest extends Record<string, string | number | object> {
  content: string;
  senderId: string;
  receiverId: string;
  images: string[];
}

// 发送私信响应接口
export interface SendMessageResponse {
  messageId: string;
  sendTime: string;
}

// 消息通知相关接口
// API返回的消息通知数据接口
export interface ApiNotificationData {
  messageId: string;
  messageType: string;
  receiverId: string;
  senderId?: string;
  senderName?: string;
  content: string;
  sendTime: string;
  isRead: boolean;
}

// 获取消息通知列表响应接口
export interface NotificationListResponse {
  messageList: ApiNotificationData[];
  messageCategory: string[];
  unreadCount: number;
}

// 标记消息已读请求接口
export interface MarkReadRequest extends Record<string, string | number | object> {
  messageId: string;
}