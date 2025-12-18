// 项目作者：杨钰然
import { router } from '@kit.ArkUI';
import { MessageItem } from "../po/MessageItem"
import { HeaderBar, BottomTabBar, NavigationUtils } from '../components/CommonComponents';
import { HttpUtils } from '../utils/HttpUtils';
import { ApiResponse, ApiNotificationData, NotificationListResponse, MarkReadRequest } from '../po/CommonTypes';


@Entry
@Component
struct MessagePage {
  @State currentTab: number = 0;
  @State messages: MessageItem[] = [];
  @State isLoading: boolean = false;
  
  // API配置
  private baseUrl: string = 'http://rap2api.taobao.org/app/mock/323891';
  private currentUserId: string = 'user_12345'; // 当前用户ID，实际应用中应从用户状态获取
  
  private tabs: string[] = ['全部', '评论', '私信'];
  
  // 页面初始化
  aboutToAppear(): void {
    this.loadNotifications();
  }
  
  // 加载消息通知列表
  async loadNotifications(): Promise<void> {
    try {
      this.isLoading = true;
      const url = `${this.baseUrl}/api/notification/list?userId=${this.currentUserId}`;
      const response = await HttpUtils.get(url);
      const apiResponse = JSON.parse(response as string) as ApiResponse<NotificationListResponse>;
      
      if (apiResponse.code === 200 && apiResponse.data) {
        this.messages = apiResponse.data.messageList.map((notification: ApiNotificationData) => {
          return {
            id: notification.messageId,
            avatar: this.getAvatarByType(notification.messageType),
            title: this.getTitleByType(notification.messageType, notification.content, notification.senderName),
            preview: notification.content,
            time: this.formatTime(notification.sendTime),
            unreadCount: notification.isRead ? 0 : 1,
            type: this.mapMessageType(notification.messageType),
            senderId: notification.senderId
          } as MessageItem;
        });
      } else {
        console.error('获取消息通知失败:', apiResponse.message);
      }
    } catch (error) {
      console.error('加载消息通知出错:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  // 根据消息类型获取头像
  private getAvatarByType(messageType: string): string {
    switch (messageType) {
      case '评论':
        return '💬';
      case '私信':
        return '📩';
      default:
        return '🔔';
    }
  }
  
  // 根据消息类型和内容生成标题
  private getTitleByType(messageType: string, _content: string, senderName?: string): string {
    switch (messageType) {
      case '评论':
        return '评论通知';
      case '私信':
        return senderName || '私信消息';
      default:
        return '系统通知';
    }
  }
  
  // 映射消息类型
  private mapMessageType(messageType: string): 'comment' | 'private' | 'system' {
    switch (messageType) {
      case '评论':
        return 'comment';
      case '私信':
        return 'private';
      default:
        return 'system';
    }
  }
  
  // 格式化时间
  private formatTime(timeStr: string): string {
    const messageTime = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - messageTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) {
      return '刚刚';
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return messageTime.toLocaleDateString();
    }
  }
  
  // 标记消息已读
  async markAsRead(messageId: string): Promise<void> {
    try {
      const url = `${this.baseUrl}/api/notification/read`;
      const data: MarkReadRequest = { messageId };
      const response = await HttpUtils.post(url, data);
      const apiResponse = JSON.parse(response as string) as ApiResponse<object>;
      
      if (apiResponse.code === 200) {
        // 更新本地消息状态
        const updatedMessages: MessageItem[] = [];
        for (const msg of this.messages) {
          if (msg.id === messageId) {
            updatedMessages.push({
              id: msg.id,
              avatar: msg.avatar,
              title: msg.title,
              preview: msg.preview,
              time: msg.time,
              unreadCount: 0,
              type: msg.type,
              senderId: msg.senderId
            });
          } else {
            updatedMessages.push(msg);
          }
        }
        this.messages = updatedMessages;
      } else {
        console.error('标记已读失败:', apiResponse.message);
      }
    } catch (error) {
      console.error('标记已读出错:', error);
    }
  }
  
  // 根据当前标签筛选消息
  getFilteredMessages(): MessageItem[] {
    if (this.currentTab === 0) {
      return this.messages; // 全部
    } else if (this.currentTab === 1) {
      return this.messages.filter(msg => msg.type === 'comment'); // 评论
    } else {
      return this.messages.filter(msg => msg.type === 'private'); // 私信
    }
  }

  build() {
    Column() {
      // 头部导航 - 使用CommonComponents
      HeaderBar({
        title: '消息',
        showBack: false,
        showAction: true,
        actionText: '👤',
        onAction: () => {
          router.pushUrl({ url: 'pages/ProfilePage' });
        }
      })
        .margin({ top: 0 })

      // 内容区域
      Column() {
        // 筛选标签
        Row() {
          ForEach(this.tabs, (tab: string, index: number) => {
            Text(tab)
              .fontSize(14)
              .fontColor(index === this.currentTab ? '#667eea' : '#666666')
              .fontWeight(index === this.currentTab ? FontWeight.Medium : FontWeight.Normal)
              .padding({ top: 8, bottom: 8 })
              .layoutWeight(1)
              .textAlign(TextAlign.Center)
              .backgroundColor(index === this.currentTab ? Color.White : Color.Transparent)
              .borderRadius(6)
              .onClick(() => {
                this.currentTab = index;
                // 切换标签时可以选择性刷新数据
                // this.loadNotifications();
              })
          })
        }
        .width('100%')
        .backgroundColor('#f8f9fa')
        .borderRadius(8)
        .padding(4)
        .margin({ left: 20, right: 20, top: 20, bottom: 0 })

        // 消息列表
        if (this.isLoading && this.messages.length === 0) {
          // 加载状态
          Column() {
            Text('加载中...')
              .fontSize(16)
              .fontColor('#999999')
              .margin({ top: 50 })
          }
          .width('100%')
          .justifyContent(FlexAlign.Center)
        } else if (this.getFilteredMessages().length === 0) {
          // 空状态
          Column() {
            Text('暂无消息')
              .fontSize(16)
              .fontColor('#999999')
              .margin({ top: 50 })
          }
          .width('100%')
          .justifyContent(FlexAlign.Center)
        } else {
          List() {
            ForEach(this.getFilteredMessages(), (message: MessageItem) => {
            ListItem() {
              Row() {
                // 头像
                if (message.avatar === '🔔') {
                  Text(message.avatar)
                    .fontSize(20)
                    .width(40)
                    .height(40)
                    .borderRadius(20)
                    .backgroundColor('#667eea')
                    .fontColor(Color.White)
                    .textAlign(TextAlign.Center)
                    .margin({ right: 12 })
                } else {
                  Text(message.avatar)
                    .fontSize(16)
                    .fontColor(Color.White)
                    .width(40)
                    .height(40)
                    .borderRadius(20)
                    .backgroundColor('#667eea')
                    .textAlign(TextAlign.Center)
                    .margin({ right: 12 })
                }
                
                // 消息内容
                Column() {
                  Text(message.title)
                    .fontSize(16)
                    .fontWeight(FontWeight.Medium)
                    .fontColor('#333333')
                    .alignSelf(ItemAlign.Start)
                    .margin({ bottom: 4 })
                  
                  Text(message.preview)
                    .fontSize(14)
                    .fontColor('#666666')
                    .alignSelf(ItemAlign.Start)
                    .maxLines(1)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)
                
                // 右侧时间和未读标识
                Column() {
                  Text(message.time)
                    .fontSize(12)
                    .fontColor('#999999')
                    .alignSelf(ItemAlign.End)
                  
                  if (message.unreadCount && message.unreadCount > 0) {
                    Text(message.unreadCount.toString())
                      .fontSize(12)
                      .fontColor(Color.White)
                      .backgroundColor('#dc3545')
                      .borderRadius(10)
                      .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                      .margin({ top: 8 })
                      .alignSelf(ItemAlign.End)
                  }
                }
                .alignItems(HorizontalAlign.End)
              }
              .width('100%')
              .padding(16)
              .alignItems(VerticalAlign.Center)
              .onClick(() => {
                // 标记消息已读
                if (message.unreadCount && message.unreadCount > 0) {
                  this.markAsRead(message.id);
                }
                
                if (message.type === 'private') {
                  // 跳转到私信详情页
                  router.pushUrl({ 
                    url: 'pages/ChatPage',
                    params: {
                      contactName: message.title,
                      contactAvatar: message.title ? message.title.charAt(0) : '用',
                      otherUserId: message.senderId || 'unknown_user'
                    }
                  });
                } else if (message.type === 'comment') {
                  // 跳转到评论详情页
                  router.pushUrl({
                    url: 'pages/DetailPage',
                    params: {
                      postId: 'post_2134'
                    }
                  });
                } else {
                  console.log(`点击消息: ${message.title}`);
                }
              })
            }
            .backgroundColor(Color.White)
            .border({ width: { bottom: 1 }, color: '#eeeeee' })
          })
          }
          .width('100%')
          .height('100%')
          .layoutWeight(1)
          .scrollBar(BarState.Off)
        }
      }
      .layoutWeight(1)
      .backgroundColor('#f8f9fa')

      // 底部导航 - 使用CommonComponents
      BottomTabBar({
        currentIndex: 2,
        onTabClick: (index: number) => {
          NavigationUtils.handleTabNavigation(index, 2);
        }
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f8f9fa')
  }
}