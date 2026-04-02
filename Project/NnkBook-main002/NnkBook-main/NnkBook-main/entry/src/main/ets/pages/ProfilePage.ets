// entry/src/main/ets/pages/ProfilePage.ets
import { promptAction } from '@kit.ArkUI';
import { updateUser, type UserInfo } from '../utils/HttpUtil';
import { router } from '@kit.ArkUI';

@Component
export struct ProfilePage {
  @State userInfo: UserInfo = AppStorage.Get('currentUser') as UserInfo
  @State gender: string = this.userInfo.gender
  @State hobby: string = this.userInfo.hobby
  @State avatar: string = this.userInfo.avatar

  async save(): Promise<void> {
    const ok = await updateUser(this.userInfo.userId, this.gender, this.hobby, this.avatar)
    if (ok) {
      // 更新全局
      const newUser: UserInfo = {
        userId: this.userInfo.userId,
        username: this.userInfo.username,
        gender: this.gender,
        hobby: this.hobby,
        avatar: this.avatar
      };

      AppStorage.Set('currentUser', newUser)
      promptAction.showToast({ message: '保存成功' })
    } else {
      promptAction.showToast({ message: '保存失败' })
    }
  }

  build() {
    Stack() {
      // ===== 背景图 =====
      Image($r('app.media.bg4'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .blur(20)

      Column({ space: 20 }) {
        Text('个人中心').fontSize(28).fontColor(Color.White).fontWeight(FontWeight.Bold)

        Row({ space: 10 }) {
          Text('用户名：').fontSize(16).fontColor(Color.White)
          Text(this.userInfo.username).fontSize(16).fontColor(Color.White).fontWeight(FontWeight.Bold)
        }.alignSelf(ItemAlign.Start)


        TextInput({ placeholder: '爱好帅不帅（可选）', text: this.hobby })
          .width('90%')
          .backgroundColor('#20FFFFFF')
          .borderRadius(12)
          .padding(12)
          .fontSize(16)
          .onChange(v => this.hobby = v)

        Button('保存修改')
          .width('90%')
          .height(50)
          .backgroundColor('#007AFF')
          .borderRadius(25)
          .fontSize(18)
          .fontColor(Color.White)
          .onClick(() => this.save())

        Button('退出登录')
          .width('90%')
          .height(50)
          .backgroundColor('#FF4444')
          .borderRadius(25)
          .fontSize(18)
          .fontColor(Color.White)
          .onClick(() => {
            AppStorage.Set('currentUser', null)
            AppStorage.Set('loggedIn', false)
            promptAction.showToast({ message: '已退出' })
            router.back()
          })
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .height('100%')
  }
}