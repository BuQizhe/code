// 发布相关的社区信息接口（保持API字段名）
export interface PostCommunityInfo {
  communityId: string;
  communityName: string;
  communityType: string;
  memberCount?: number;
}

// 发布信息接口
export interface PostInfo {
  postId: string;
  itemName: string;
  itemDescription?: string;
  images?: string[];
  postType: string;
  lostTime?: string;
  lostLocation: string;
  contact?: string;
  storageLocation?: string;
  publisherId: string;
  communityId: string;
  status: string;
  publishTime?: string;
}

export interface SearchResponse {
  searchKeyword: string;
  filterCondition: string;
  searchResults: PostInfo[];
}