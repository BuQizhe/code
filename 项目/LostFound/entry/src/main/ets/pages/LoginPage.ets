// LoginPage.ets
import router from '@ohos.router'
import promptAction from '@ohos.promptAction'
import dataPreferences from '@ohos.data.preferences'
import { common } from '@kit.AbilityKit'

@Entry
@Component
struct LoginPage {
  context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext
  @State account: string = ''
  @State pwd    : string = ''

  async login() {
    if (!this.account || !this.pwd) {
      promptAction.showToast({ message: '请输入账号和密码', duration: 1000 }); return
    }
    const pref = await dataPreferences.getPreferences(this.context, 'auth')
    const localAcc = await pref.get('account', '') as string
    const localPwd = await pref.get('pwd', '') as string
    if (this.account !== localAcc || this.pwd !== localPwd) {
      promptAction.showToast({ message: '账号或密码错误', duration: 1500 }); return
    }
    // 成功
    router.replaceUrl({ url: 'pages/Index' })
  }

  build() {
    Stack() {
      Image($r('app.media.bg_auth')).width('100%').height('100%').objectFit(ImageFit.Cover).blur(20)
      Column() {
        Text('失物招领登录').fontSize(28).fontColor('#FFF').margin({ bottom: 40 })
        Column() {
          TextInput({ placeholder: '账号', text: this.account })
            .onChange(v => this.account = v)
          TextInput({ placeholder: '密码', text: this.pwd })
            .type(InputType.Password).margin({ top: 12 })
            .onChange(v => this.pwd = v)
          Button('登录').width('100%').margin({ top: 24 }).onClick(() => this.login())
          Row() {
            Text('还没账号？').fontColor('#FFF')
            Text('立即注册').fontColor('#FFD700').onClick(() => router.pushUrl({ url: 'pages/RegisterPage' }))
          }.margin({ top: 12 })
        }.padding(20).width('80%').backgroundColor('#20FFFFFF').borderRadius(16)
      }.alignItems(HorizontalAlign.Center)
    }
  }
}