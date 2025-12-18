export interface ItemData {
  id: string;
  title: string;
  category: string;
  location: string;
  time: string;
  description: string;
  contactInfo: string;
  images: string[];
  type: '寻物' | '寻主';
  publisher: string;
  status?: '寻找中' | '已找到'; // 状态：searching(寻找中/待认领) | found(已找到/已认领)
}