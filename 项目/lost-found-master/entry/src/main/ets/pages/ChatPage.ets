// 项目作者：杨钰然
import { router } from '@kit.ArkUI';
import { ChatMessage } from "../po/ChatMessage"
import { HeaderBar } from "../components/CommonComponents"
import { HttpUtils } from "../utils/HttpUtils"
import { ApiResponse, ApiMessageData, SendMessageRequest, SendMessageResponse } from '../po/CommonTypes';


@Entry
@Component
struct ChatPage {
  @State contactName: string = '王同学';
  @State contactAvatar: string = '王';
  @State inputText: string = '';
  @State messages: ChatMessage[] = [];
  @State currentUserId: string = 'user_12345'; // 当前用户ID
  @State otherUserId: string = 'user_67890'; // 对方用户ID
  private baseUrl: string = 'http://rap2api.taobao.org/app/mock/323891';

  aboutToAppear() {
    // 获取路由参数
    const params = router.getParams();
    if (params) {
      this.contactName = Reflect.get(params, 'contactName') as string || '王同学';
      this.contactAvatar = Reflect.get(params, 'contactAvatar') as string || '王';
      // 兼容旧的receiverId参数和新的otherUserId参数
      this.otherUserId = Reflect.get(params, 'otherUserId') as string || 
                        Reflect.get(params, 'receiverId') as string || 
                        'user_67890';
    }
    // 加载对话历史
    this.loadConversation();
  }

  // 加载对话历史
  async loadConversation() {
    try {
      const url = `${this.baseUrl}/api/message/conversation?userId=${this.currentUserId}&otherUserId=${this.otherUserId}`;
      const response = await HttpUtils.get(url);
      const apiResponse: ApiResponse<ApiMessageData[]> = JSON.parse(response);
      
      if (apiResponse.code === 200 && apiResponse.data) {
        this.messages = apiResponse.data.map((msg: ApiMessageData): ChatMessage => {
          return {
            id: msg.messageId,
            content: msg.content,
            time: this.formatTime(msg.sendTime),
            isSent: msg.senderId === this.currentUserId
          };
        });
      } else {
        console.error('获取对话历史失败:', apiResponse.message);
      }
    } catch (error) {
      console.error('加载对话历史出错:', error);
    }
  }

  // 格式化时间
  formatTime(timeStr: string): string {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return timeStr;
    }
  }

  // 发送消息
  async sendMessage() {
    if (this.inputText.trim()) {
      const content = this.inputText.trim();
      this.inputText = ''; // 先清空输入框
      
      // 先添加到本地显示
      const tempMessage: ChatMessage = {
        id: Date.now().toString(),
        content: content,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isSent: true
      };
      this.messages.push(tempMessage);
      
      try {
        // 发送到服务器
        const url = `${this.baseUrl}/api/message/send`;
        const requestData: SendMessageRequest = {
          content: content,
          senderId: this.currentUserId,
          receiverId: this.otherUserId,
          images: []
        };
        
        const response = await HttpUtils.post(url, requestData);
        const apiResponse: ApiResponse<SendMessageResponse> = JSON.parse(response);
        
        if (apiResponse.code === 200 && apiResponse.data) {
          console.log('消息发送成功:', apiResponse.data);
          // 更新消息ID为服务器返回的ID
          const lastIndex = this.messages.length - 1;
          if (lastIndex >= 0) {
            this.messages[lastIndex].id = apiResponse.data.messageId;
          }
        } else {
          console.error('发送消息失败:', apiResponse.message);
          // 发送失败，可以在这里添加重试逻辑或错误提示
        }
      } catch (error) {
        console.error('发送消息出错:', error);
        // 发送失败，可以在这里添加重试逻辑或错误提示
      }
    }
  }

  build() {
    Column() {
      // 头部导航 - 使用CommonComponents
      HeaderBar({
        title: this.contactName,
        showBack: true,
        showAction: false,
        onBack: () => {
          router.back();
        }
      })

      // 聊天内容区域
      Column() {
        // 消息列表
        Scroll() {
          Column() {
            ForEach(this.messages, (message: ChatMessage) => {
              if (message.isSent) {
                // 自己发送的消息（右侧）
                Row() {
                  Column() {
                    Stack() {
                      Text(message.content)
                        .fontSize(16)
                        .fontColor(Color.White)
                        .padding(10)
                        .maxLines(10)
                        .textAlign(TextAlign.Start)
                    }
                    .backgroundColor('#667eea')
                    .borderRadius(15)
                    
                    Text(message.time)
                      .fontSize(12)
                      .fontColor('#999999')
                      .margin({ top: 5 })
                      .alignSelf(ItemAlign.End)
                  }
                  .alignItems(HorizontalAlign.End)
                  .margin({ right: 10 })
                  .constraintSize({ maxWidth: '70%' })
                }
                .width('100%')
                .justifyContent(FlexAlign.End)
                .margin({ bottom: 15 })
              } else {
                // 对方发送的消息（左侧）
                Row() {
                  // 头像
                  Text(this.contactAvatar)
                    .fontSize(16)
                    .fontColor(Color.White)
                    .width(36)
                    .height(36)
                    .borderRadius(18)
                    .backgroundColor('#667eea')
                    .textAlign(TextAlign.Center)
                    .margin({ right: 10 })
                  
                  Column() {
                    Stack() {
                      Text(message.content)
                        .fontSize(16)
                        .fontColor('#333333')
                        .padding(10)
                        .maxLines(10)
                        .textAlign(TextAlign.Start)
                    }
                    .backgroundColor($r('sys.color.glass_material_outline_secondary'))
                    .borderRadius(15)
                    
                    Text(message.time)
                      .fontSize(12)
                      .fontColor('#999999')
                      .margin({ top: 5 })
                      .alignSelf(ItemAlign.Start)
                  }
                  .alignItems(HorizontalAlign.Start)
                  .constraintSize({ maxWidth: '70%' })
                }
                .width('100%')
                .justifyContent(FlexAlign.Start)
                .alignItems(VerticalAlign.Top)
                .margin({ bottom: 15 })
              }
            })
          }
          .width('100%')
          .padding({ left: 15, right: 15, top: 20 })
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
        .backgroundColor('#f8f9fa')
        
        // 输入框区域
        Row() {
          TextInput({ placeholder: '输入消息...', text: this.inputText })
            .layoutWeight(1)
            .height(40)
            .fontSize(16)
            .borderRadius(20)
            .backgroundColor(Color.White)
            .border({ width: 1, color: '#dddddd' })
            .padding({ left: 15, right: 15 })
            .onChange((value: string) => {
              this.inputText = value;
            })
            .onSubmit(() => {
              this.sendMessage();
            })
          
          Button('发送')
            .fontSize(16)
            .fontColor(Color.White)
            .backgroundColor('#667eea')
            .borderRadius(20)
            .padding({ left: 20, right: 20, top: 10, bottom: 10 })
            .margin({ left: 10 })
            .onClick(() => {
              this.sendMessage();
            })
        }
        .width('100%')
        .padding({ left: 15, right: 15, top: 15, bottom: 15 })
        .backgroundColor(Color.White)
        .border({ width: { top: 1 }, color: '#eeeeee' })
      }
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f8f9fa')
  }
}