// 项目作者：杨钰然
import { router } from '@kit.ArkUI';
import { HeaderBar, BottomTabBar, NavigationUtils } from "../components/CommonComponents"
import { UserInfo, ApiUserInfo } from "../po/UserInfo"
import { HttpUtils } from "../utils/HttpUtils"
import { ApiResponse } from "../po/CommonTypes"
import { API_BASE_URL } from '../utils/Common';


@Entry
@Component
struct ProfilePage {
  @State userInfo: UserInfo = {
    avatar: '👤',
    username: '加载中...',
    phone: '加载中...',
    joinDate: '加载中...',
    publishCount: 5,
    foundCount: 3
  };
  
  @State searchingCount: number = 3;
  @State foundCount: number = 5;
  @State helpOthersCount: number = 2;
  @State isLoading: boolean = true;
  @State errorMessage: string = '';
  
  // 组件初始化时获取用户信息
  aboutToAppear() {
    this.loadUserProfile();
  }
  
  // 获取用户信息
  private async loadUserProfile() {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      // 模拟用户ID，实际应用中应该从登录状态获取
      const userId = 'user_12345';
      const url = `${API_BASE_URL}/api/user/profile?userId=${userId}`;
      
      const response = await HttpUtils.get(url);
      const apiResponse: ApiResponse<ApiUserInfo> = JSON.parse(response);
      
      if (apiResponse.code === 200 && apiResponse.data) {
        const userData = apiResponse.data;
        this.userInfo = {
          avatar: userData.avatar || '👤',
          username: userData.username || '未知用户',
          phone: userData.phone || '未绑定',
          joinDate: userData.registerTime ? userData.registerTime.split(' ')[0] : '未知',
          publishCount: this.userInfo.publishCount, // 保持模拟数据
          foundCount: this.userInfo.foundCount // 保持模拟数据
        };
      } else {
        this.errorMessage = apiResponse.message || '获取用户信息失败';
        console.error('获取用户信息失败:', apiResponse.message);
      }
    } catch (error) {
      this.errorMessage = '网络请求失败';
      console.error('获取用户信息失败:', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 头部导航 - 使用CommonComponents
      HeaderBar({
        title: '个人中心',
        showBack: false,
        showAction: false
      })
        .margin({ top: 0 })

      // 内容区域
      Scroll() {
        Column() {
          // 用户信息卡片
          Column() {
            if (this.isLoading) {
              // 加载状态
              Column() {
                Text('⏳')
                  .fontSize(32)
                  .margin({ bottom: 10 })
                Text('加载用户信息中...')
                  .fontSize(16)
                  .fontColor('#666666')
              }
              .width('100%')
              .height(150)
              .justifyContent(FlexAlign.Center)
            } else if (this.errorMessage) {
              // 错误状态
              Column() {
                Text('❌')
                  .fontSize(32)
                  .margin({ bottom: 10 })
                Text(this.errorMessage)
                  .fontSize(14)
                  .fontColor('#dc3545')
                  .textAlign(TextAlign.Center)
                  .margin({ bottom: 10 })
                Button('重新加载')
                  .fontSize(14)
                  .backgroundColor('#667eea')
                  .borderRadius(6)
                  .onClick(() => {
                    this.loadUserProfile();
                  })
              }
              .width('100%')
              .height(150)
              .justifyContent(FlexAlign.Center)
            } else {
              // 正常显示用户信息
              Column() {
                // 头像
                Stack() {
                  Circle({ width: 80, height: 80 })
                    .fill($r('sys.color.glass_material_outline_secondary'))
                    .border({ width: 2, color: '#ddd', style: BorderStyle.Dashed })
                  
                  if (this.userInfo.avatar.startsWith('http')) {
                    // 如果是网络图片URL，这里可以使用Image组件
                    // 由于ArkTS限制，暂时显示默认头像
                    Text('👤')
                      .fontSize(32)
                      .fontColor('#999999')
                  } else {
                    Text(this.userInfo.avatar)
                      .fontSize(32)
                      .fontColor('#999999')
                  }
                }
                .margin({ bottom: 15 })
                
                // 用户名
                Text(this.userInfo.username)
                  .fontSize(20)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#333333')
                  .margin({ bottom: 5 })
                
                // 手机号
                Text(`手机号：${this.userInfo.phone}`)
                  .fontSize(14)
                  .fontColor('#666666')
                  .margin({ bottom: 5 })
                
                // 注册时间
                Text(`注册时间：${this.userInfo.joinDate}`)
                  .fontSize(14)
                  .fontColor('#666666')
              }
            }
          }
          .width('100%')
          .backgroundColor(Color.White)
          .borderRadius(12)
          .padding(16)
          .margin({ bottom: 16 })
          .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })

          // 我发布的求助统计卡片
          Column() {
            Row() {
              Text('我发布的求助')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .fontColor('#333333')
                .layoutWeight(1)
              
              // Text('查看全部 >')
              //   .fontSize(14)
              //   .fontColor('#667eea')
              //   .onClick(() => {
              //     console.log('查看全部求助');
              //   })
            }
            .width('100%')
            .margin({ bottom: 15 })
            
            // 统计数据
            Row() {
              Column() {
                Text(this.searchingCount.toString())
                  .fontSize(24)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#667eea')
                Text('寻物中')
                  .fontSize(14)
                  .fontColor('#666666')
                  .margin({ top: 4 })
              }
              .layoutWeight(1)
              
              Column() {
                Text(this.foundCount.toString())
                  .fontSize(24)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#28a745')
                Text('已找到')
                  .fontSize(14)
                  .fontColor('#666666')
                  .margin({ top: 4 })
              }
              .layoutWeight(1)
              
              Column() {
                Text(this.helpOthersCount.toString())
                  .fontSize(24)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#ffc107')
                Text('帮助他人')
                  .fontSize(14)
                  .fontColor('#666666')
                  .margin({ top: 4 })
              }
              .layoutWeight(1)
            }
            .width('100%')
          }
          .width('100%')
          .backgroundColor(Color.White)
          .borderRadius(12)
          .padding(16)
          .margin({ bottom: 16 })
          .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })

          // 功能菜单卡片
          Column() {
            // 编辑个人信息
            // Row() {
            //   Text('📝 编辑个人信息')
            //     .fontSize(16)
            //     .fontColor('#333333')
            //     .layoutWeight(1)
            // }
            // .width('100%')
            // .padding({ top: 10, bottom: 10 })
            // .border({ width: { bottom: 1 }, color: '#eee' })
            // .onClick(() => {
            //   console.log('编辑个人信息');
            // })
            
            // 我的社区
            Row() {
              Text('🏘️ 我的社区')
                .fontSize(16)
                .fontColor('#333333')
                .layoutWeight(1)
            }
            .width('100%')
            .padding({ top: 10, bottom: 10 })
            .border({ width: { bottom: 1 }, color: '#eee' })
            .onClick(() => {
              router.pushUrl({ url: 'pages/CommunityPage' });
            })
            
            // 设置
            // Row() {
            //   Text('⚙️ 设置')
            //     .fontSize(16)
            //     .fontColor('#333333')
            //     .layoutWeight(1)
            // }
            // .width('100%')
            // .padding({ top: 10, bottom: 10 })
            // .border({ width: { bottom: 1 }, color: '#eee' })
            // .onClick(() => {
            //   console.log('设置');
            // })
          }
          .width('100%')
          .backgroundColor(Color.White)
          .borderRadius(12)
          .padding(16)
          .margin({ bottom: 16 })
          .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })

          // 退出登录按钮
          Button('退出登录')
            .width('100%')
            .height(48)
            .fontSize(16)
            .fontColor('#6c757d')
            .backgroundColor('#f8f9fa')
            .border({ width: 1, color: '#dee2e6' })
            .borderRadius(8)
            .margin({ bottom: 20 })
            .onClick(() => {
              router.pushUrl({ url: 'pages/Index' });
            })
        }
        .width('100%')
        .padding(20)
      }
      .layoutWeight(1)
      .backgroundColor('#f5f5f5')
      .scrollBar(BarState.Off)

      // 底部导航 - 使用CommonComponents
      BottomTabBar({
        currentIndex: 3,
        onTabClick: (index: number) => {
          NavigationUtils.handleTabNavigation(index, 3);
        }
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }
}
