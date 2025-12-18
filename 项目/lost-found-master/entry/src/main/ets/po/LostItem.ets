export interface LostItem {
  id: string;
  title: string;
  category: string;
  location: string;
  time: string;
  originalTimestamp: number;
  image: string;
  type: '寻物' | '寻主';
  status?: '寻找中' | '已找到'; // 状态：searching(寻找中/待认领) | found(已找到/已认领)
  description?: string; // 详细描述
  contactInfo?: string; // 联系方式
  images?: string[]; // 图片数组
  publisher?: string; // 发布者
}