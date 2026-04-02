// entry/src/main/ets/pages/LoginPage.ets
import { promptAction } from '@kit.ArkUI';
import { registerUser, loginUser, type UserInfo } from '../utils/HttpUtil';
import { router } from '@kit.ArkUI';

@Component
export struct LoginPage {
  signature: ResourceStr | undefined;
  city: ResourceStr | undefined;
  birthday: ResourceStr | undefined;
  email: ResourceStr | undefined;
  phone: ResourceStr | undefined;
  @State username: string = ''
  @State password: string = ''
  @State isLogin: boolean = true
  @State gender: string = ''
  @State hobby: string = ''
  @State avatar: string = ''

  async submit(): Promise<void> {
    if (!this.username || !this.password) {
      promptAction.showToast({ message: '用户名和密码不能为空' })
      return
    }
    const user = this.isLogin
      ? await loginUser(this.username, this.password)
      : await registerUser(this.username, this.password, this.gender, this.hobby, this.avatar)

    if (user) {
      promptAction.showToast({ message: this.isLogin ? '登录成功' : '注册成功' })
      // 存全局 + 跳转主页
      AppStorage.SetOrCreate('currentUser', user)
      AppStorage.SetOrCreate('loggedIn', true)
      router.pushUrl({ url: 'pages/HomePage' })
    } else {
      promptAction.showToast({ message: this.isLogin ? '登录失败' : '注册失败' })
    }
  }

  build() {
    Stack() {
      // ===== 背景图 =====
      Image($r('app.media.bg'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .blur(20)

      Column({ space: 20 }) {
        Text(this.isLogin ? '用户登录' : '用户注册').fontSize(28).fontColor(Color.White).fontWeight(FontWeight.Bold)

        TextInput({ placeholder: '用户名', text: this.username })
          .width('90%')
          .backgroundColor('#20FFFFFF')
          .borderRadius(12)
          .padding(12)
          .fontSize(16)
          .onChange(v => this.username = v)

        TextInput({ placeholder: '密码', text: this.password })
          .type(InputType.Password)
          .width('90%')
          .backgroundColor('#20FFFFFF')
          .borderRadius(12)
          .padding(12)
          .fontSize(16)
          .onChange(v => this.password = v)

        if (!this.isLogin) {

          TextInput({ placeholder: '出生日期（可选）', text: this.birthday })
            .width('90%')
            .backgroundColor('#20FFFFFF')
            .borderRadius(12)
            .padding(12)
            .fontSize(16)
            .onChange(v => this.birthday = v)

          

          TextInput({ placeholder: '爱好（可选）', text: this.hobby })
            .width('90%')
            .backgroundColor('#20FFFFFF')
            .borderRadius(12)
            .padding(12)
            .fontSize(16)
            .onChange(v => this.hobby = v)

          TextInput({ placeholder: '城市（可选）', text: this.city })
            .width('90%')
            .backgroundColor('#20FFFFFF')
            .borderRadius(12)
            .padding(12)
            .fontSize(16)
            .onChange(v => this.city = v)



          TextInput({ placeholder: '邮箱（可选）', text: this.email })
            .width('90%')
            .backgroundColor('#20FFFFFF')
            .borderRadius(12)
            .padding(12)
            .fontSize(16)
            .onChange(v => this.email = v)

          TextInput({ placeholder: '签名（可选）', text: this.signature })
            .width('90%')
            .backgroundColor('#20FFFFFF')
            .borderRadius(12)
            .padding(12)
            .fontSize(16)
            .onChange(v => this.signature = v)




        }

        Button(this.isLogin ? '登录' : '注册')
          .width('90%')
          .height(50)
          .backgroundColor('#007AFF')
          .borderRadius(25)
          .fontSize(18)
          .fontColor(Color.White)
          .onClick(() => this.submit())

        Button(this.isLogin ? '去注册' : '去登录')
          .width('90%')
          .height(50)
          .backgroundColor('#20FFFFFF')
          .borderRadius(25)
          .fontSize(16)
          .fontColor(Color.White)
          .onClick(() => this.isLogin = !this.isLogin)
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .height('100%')
  }
}