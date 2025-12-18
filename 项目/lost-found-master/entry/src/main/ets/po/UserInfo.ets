export interface UserInfo {
  avatar: string;
  username: string;
  phone: string;
  joinDate: string;
  publishCount: number;
  foundCount: number;
}

// API返回的用户信息接口
export interface ApiUserInfo {
  userId: string;
  username: string;
  phone: string;
  avatar: string;
  registerTime: string;
}