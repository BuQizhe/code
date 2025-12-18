// 项目作者：杨钰然
import { router } from '@kit.ArkUI';
import { HeaderBar } from '../components/CommonComponents';

@Entry
@Component
struct RegisterPage {
  @State username: string = '';
  @State phoneNumber: string = '';
  @State password: string = '';
  @State confirmPassword: string = '';
  @State avatar: string = '';
  @State errorMessage: string = '';
  @State usernameError: string = '';
  @State phoneError: string = '';
  @State passwordError: string = '';
  @State confirmPasswordError: string = '';
  @State isLoading: boolean = false;

  // 验证用户名
  validateUsername(value: string): string {
    if (!value.trim()) {
      return '请输入用户名';
    }
    if (value.trim().length < 3) {
      return '用户名长度不能少于3位';
    }
    if (value.trim().length > 20) {
      return '用户名长度不能超过20位';
    }
    return '';
  }

  // 验证手机号
  validatePhone(value: string): string {
    if (!value.trim()) {
      return '请输入手机号';
    }
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(value.trim())) {
      return '请输入正确的手机号格式';
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
    if (value.length > 20) {
      return '密码长度不能超过20位';
    }
    return '';
  }

  // 验证确认密码
  validateConfirmPassword(value: string): string {
    if (!value.trim()) {
      return '请确认密码';
    }
    if (value !== this.password) {
      return '两次输入的密码不一致';
    }
    return '';
  }

  // 注册方法
  async register() {
    // 验证所有输入
    this.usernameError = this.validateUsername(this.username);
    this.phoneError = this.validatePhone(this.phoneNumber);
    this.passwordError = this.validatePassword(this.password);
    this.confirmPasswordError = this.validateConfirmPassword(this.confirmPassword);
    
    if (this.usernameError || this.phoneError || this.passwordError || this.confirmPasswordError) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // 注册请求
      await new Promise<string>(resolve => setTimeout(resolve, 1000));
      
      // 注册成功后跳转到主页
      router.pushUrl({ url: 'pages/MainPage' });
    } catch (error) {
      console.error('注册请求失败:', error);
      this.errorMessage = '注册失败，请稍后重试';
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 头部导航 - 使用CommonComponents
      HeaderBar({
        title: '注册',
        showBack: true,
        onBack: () => {
          router.back();
        },
        showAction: false,
        actionText: '👤',
        onAction: () => {
          router.pushUrl({ url: 'pages/ProfilePage' });
        }
      })
        .margin({ top: 0 })

      // 内容区域
      Column() {
        // 头像上传
        Column() {
          Stack() {
            Circle({ width: 80, height: 80 })
              .fill($r('sys.color.glass_material_outline_secondary'))
              .border({ width: 2, color: '#dddddd', style: BorderStyle.Dashed })
            
            Text('📷')
              .fontSize(24)
              .fontColor('#999999')
          }
          .margin({ bottom: 20 })
          .onClick(() => {
            console.log('头像上传点击');
          })
        }
        .margin({ top: 20, bottom: 20 })

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

          // 手机号输入
          Column() {
            Text('手机号')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#555555')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            TextInput({ placeholder: '请输入手机号' })
              .width('100%')
              .height(48)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: this.phoneError ? '#ff4444' : '#dddddd' })
              .type(InputType.PhoneNumber)
              .onChange((value: string) => {
                this.phoneNumber = value;
                this.phoneError = this.validatePhone(value);
              })
            
            // 手机号错误提示
            if (this.phoneError) {
              Text(this.phoneError)
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
                // 如果确认密码已输入，重新验证确认密码
                if (this.confirmPassword) {
                  this.confirmPasswordError = this.validateConfirmPassword(this.confirmPassword);
                }
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
          .margin({ bottom: 20 })

          // 确认密码输入
          Column() {
            Text('确认密码')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#555555')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            TextInput({ placeholder: '请再次输入密码' })
              .width('100%')
              .height(48)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: this.confirmPasswordError ? '#ff4444' : '#dddddd' })
              .type(InputType.Password)
              .onChange((value: string) => {
                this.confirmPassword = value;
                this.confirmPasswordError = this.validateConfirmPassword(value);
              })
            
            // 确认密码错误提示
            if (this.confirmPasswordError) {
              Text(this.confirmPasswordError)
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
              .margin({ top: 15, bottom: 15 })
          }

          // 注册按钮
          Button(this.isLoading ? '注册中...' : '注册')
            .width('100%')
            .height(48)
            .fontSize(16)
            .fontColor(Color.White)
            .linearGradient({
              angle: 135,
              colors: [['#667eea', 0], ['#764ba2', 1]]
            })
            .borderRadius(8)
            .margin({ top: 30 })
            .enabled(!this.isLoading)
            .onClick(() => {
              this.register();
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
    .backgroundColor('#f8f9fa')
  }
}