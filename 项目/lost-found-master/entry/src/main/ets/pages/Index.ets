// 项目作者：杨钰然
import { router } from '@kit.ArkUI';
import { HeaderBar } from '../components/CommonComponents';
import { HttpUtils } from '../utils/HttpUtils';
import { ApiResponse } from '../po/CommonTypes';

// 登录响应数据接口
interface LoginData {
  userId: string;
  username: string;
  phone: string;
  avatar: string;
  registerTime: string;
}

interface LoginRequest extends Record<string, string | number | object> {
  username: string;
  password: string;
}

@Entry
@Component
struct Index {
  @State username: string = '';
  @State password: string = '';
  @State isLoading: boolean = false;
  @State errorMessage: string = '';
  @State usernameError: string = '';
  @State passwordError: string = '';

  // 验证用户名
  validateUsername(value: string): string {
    if (!value.trim()) {
      return '请输入用户名';
    }
    if (value.trim().length < 3) {
      return '用户名长度不能少于3位';
    }
    return '';
  }

  // 验证密码
  validatePassword(value: string): string {
    if (!value.trim()) {
      return '请输入密码';
    }
    if (value.length < 3) {
      return '密码长度不能少于3位';
    }
    return '';
  }

  // 登录方法
  async login() {
    // 验证输入
    this.usernameError = this.validateUsername(this.username);
    this.passwordError = this.validatePassword(this.password);
    
    if (this.usernameError || this.passwordError) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const url = 'http://rap2api.taobao.org/app/mock/323891/api/user/login';
      const loginData: LoginRequest = {
        username: this.username,
        password: this.password
      };
      
      const response = await HttpUtils.post(url, loginData);
      const result = JSON.parse(response) as ApiResponse<LoginData>;
      
      if (result.code === 200 && result.data) {
        console.log('登录成功:', result.data);
        // 可以在这里保存用户信息到本地存储
        // 跳转到主页
        router.pushUrl({ url: 'pages/MainPage' }).catch(() => {
          // TODO: Implement error handling.
        });
      } else {
        this.errorMessage = result.message || '登录失败';
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      this.errorMessage = '网络请求失败，请检查网络连接';
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 头部导航 - 使用CommonComponents
      HeaderBar({
        title: '登录',
        showBack: false,
        showAction: false
      })
        .margin({ top: 0 })

      // 内容区域
      Column() {
        // 欢迎区域
        Column() {
          Text('📱')
            .fontSize(64)
            .fontColor('#667eea')
            .margin({ bottom: 20 })
          
          Text('欢迎使用')
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#333333')
            .margin({ bottom: 10 })
          
          Text('连接社区，寻找失物')
            .fontSize(16)
            .fontColor('#666666')
        }
        .margin({ top: 40, bottom: 40 })

        // 表单区域
        Column() {
          // 用户名输入
          Column() {
            Text('用户名')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#555555')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            TextInput({ placeholder: '请输入用户名' })
              .width('100%')
              .height(48)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: this.usernameError ? '#ff4444' : '#dddddd' })
              .onChange((value: string) => {
                this.username = value;
                this.usernameError = this.validateUsername(value);
              })
            
            // 用户名错误提示
            if (this.usernameError) {
              Text(this.usernameError)
                .fontSize(12)
                .fontColor('#ff4444')
                .alignSelf(ItemAlign.Start)
                .margin({ top: 5 })
            }
          }
          .width('100%')
          .margin({ bottom: 20 })

          // 密码输入
          Column() {
            Text('密码')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#555555')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            TextInput({ placeholder: '请输入密码' })
              .width('100%')
              .height(48)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: this.passwordError ? '#ff4444' : '#dddddd' })
              .type(InputType.Password)
              .onChange((value: string) => {
                this.password = value;
                this.passwordError = this.validatePassword(value);
              })
            
            // 密码错误提示
            if (this.passwordError) {
              Text(this.passwordError)
                .fontSize(12)
                .fontColor('#ff4444')
                .alignSelf(ItemAlign.Start)
                .margin({ top: 5 })
            }
          }
          .width('100%')
          .margin({ bottom: 30 })

          // 错误提示
          if (this.errorMessage) {
            Text(this.errorMessage)
              .fontSize(14)
              .fontColor('#ff4444')
              .width('100%')
              .textAlign(TextAlign.Center)
              .margin({ bottom: 15 })
          }

          // 登录按钮
          Button(this.isLoading ? '登录中...' : '登录')
            .width('100%')
            .height(48)
            .fontSize(16)
            .fontColor(Color.White)
            .linearGradient({
              angle: 135,
              colors: [['#667eea', 0], ['#764ba2', 1]]
            })
            .borderRadius(8)
            .margin({ bottom: 10 })
            .enabled(!this.isLoading)
            .onClick(() => {
              this.login();
            })

          // 注册按钮
          Button('注册账号')
            .width('100%')
            .height(48)
            .fontSize(16)
            .fontColor('#6c757d')
            .backgroundColor('#f8f9fa')
            .borderRadius(8)
            .border({ width: 1, color: '#dee2e6' })
            .onClick(() => {
              // 跳转注册页面
              router.pushUrl({ url: 'pages/RegisterPage' }).catch(() => {
                // TODO: Implement error handling.
              });
            })
        }
        .width('100%')
      }
      .layoutWeight(1)
      .padding(20)
      .backgroundColor('#f5f5f5')
    }
    .width('100%')
    .height('100%')
  }
}