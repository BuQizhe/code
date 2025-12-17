// RegisterPage.ets
import router from '@ohos.router'
import promptAction from '@ohos.promptAction'
import dataPreferences from '@ohos.data.preferences'
import { common } from '@kit.AbilityKit'

@Entry
@Component
struct RegisterPage {
  context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext
  @State account: string = ''
  @State pwd    : string = ''
  @State pwd2   : string = ''

  async register() {
    if (!this.account || !this.pwd || !this.pwd2) {
      promptAction.showToast({ message: '请填完整', duration: 1000 }); return
    }
    if (this.pwd !== this.pwd2) {
      promptAction.showToast({ message: '两次密码不一致', duration: 1500 }); return
    }
    const pref = await dataPreferences.getPreferences(this.context, 'auth')
    await pref.put('account', this.account)
    await pref.put('pwd', this.pwd)   // 正式请哈希
    await pref.flush()
    promptAction.showToast({ message: '注册成功！', duration: 1500 })
    router.replaceUrl({ url: 'pages/Index' })   // 直接进首页
  }

  build() {
    Stack() {
      Image($r('app.media.bg_auth')).width('100%').height('100%').objectFit(ImageFit.Cover).blur(20)
      Column() {
        Text('注册账号').fontSize(28).fontColor('#FFF').margin({ bottom: 40 })
        Column() {
          TextInput({ placeholder: '账号', text: this.account })
            .onChange(v => this.account = v)
          TextInput({ placeholder: '密码', text: this.pwd })
            .type(InputType.Password).margin({ top: 12 })
            .onChange(v => this.pwd = v)
          TextInput({ placeholder: '再次输入密码', text: this.pwd2 })
            .type(InputType.Password).margin({ top: 12 })
            .onChange(v => this.pwd2 = v)
          Button('注册并登录').width('100%').margin({ top: 24 }).onClick(() => this.register())
          Row() {
            Text('已有账号？').fontColor('#FFF')
            Text('立即登录').fontColor('#FFD700').onClick(() => router.back())
          }.margin({ top: 12 })
        }.padding(20).width('80%').backgroundColor('#20FFFFFF').borderRadius(16)
      }.alignItems(HorizontalAlign.Center)
    }
  }
}