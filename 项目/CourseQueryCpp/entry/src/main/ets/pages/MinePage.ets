import router from '@ohos.router';
import { PreferencesUtil } from '../ets/data/PreferencesUtil';
import { UserUtil, GetDefaultUser } from '../ets/model/UserModel';

@Entry
@Component
struct MinePage {
  @State user: User | null = null;
  @State currentSemester: string = '';
  @State isLoading: boolean = true;
  private preferencesUtil: PreferencesUtil = PreferencesUtil.getInstance();

  async aboutToAppear() {
    await this.loadUserInfo();
    await this.loadCurrentSemester();
    this.isLoading = false;
  }

  // 加载用户信息
  async loadUserInfo() {
    let errCode = 0;
    const userJson = await this.preferencesUtil.getUserInfo(errCode);
    if (errCode === 0 && userJson) {
      let userErr = 0;
      this.user = UserUtil.deserialize(userJson, userErr);
    }
    // 无用户信息时使用默认用户
    if (!this.user) {
      this.user = GetDefaultUser();
      await this.preferencesUtil.saveUserInfo(this.user.serialize());
    }
  }

  // 加载当前学期
  async loadCurrentSemester() {
    let errCode = 0;
    this.currentSemester = await this.preferencesUtil.getCurrentSemester(errCode);
  }

  build() {
    Column({ space: 20 }) {
      // 顶部导航栏
      Row({ space: 12 }) {
        Button({ type: ButtonType.Circle, stateEffect: true })
          .width(40)
          .height(40)
          .backgroundColor($r('app.color.card_background'))
          .onClick(() => router.back())
          .child(
            Image($r('app.media.icon_back'))
              .width(20)
              .height(20)
              .fillColor($r('app.color.content_color'))
          );

        Text($r('app.string.mine_page_title'))
          .fontSize($r('app.float.title_font_size'))
          .fontWeight(FontWeight.Bold)
          .flexGrow(1);
      }
      .padding(16)
      .width('100%');

      if (this.isLoading) {
        Progress()
          .width(40)
          .height(40)
          .margin({ top: 50 });
      } else {
        // 用户信息卡片
        Column({ space: 12 }) {
          Image($r('app.media.icon_user_large'))
            .width(80)
            .height(80)
            .borderRadius(40)
            .backgroundColor($r('app.color.primary_color'))
            .fillColor('#FFFFFF');

          Text(this.user?.userName || '未知用户')
            .fontSize($r('app.float.title_font_size'))
            .fontWeight(FontWeight.Bold);

          Text(`学号：${this.user?.studentId || '未知学号'}`)
            .fontSize($r('app.float.content_font_size'))
            .fontColor($r('app.color.gray_text'));
        }
        .padding(20)
        .width('100%')
        .backgroundColor($r('app.color.card_background'));

        // 功能列表
        List({ space: 1 }) {
          // 当前学期
          ListItem() {
            Row({ space: 12 }) {
              Image($r('app.media.icon_semester'))
                .width(24)
                .height(24)
                .fillColor($r('app.color.primary_color'))
                .marginLeft(16);

              Text($r('app.string.semester_switch'))
                .fontSize($r('app.float.content_font_size'))
                .flexGrow(1);

              Text(this.currentSemester)
                .fontSize($r('app.float.content_font_size'))
                .fontColor($r('app.color.gray_text'))
                .marginRight(16);
            }
            .padding(16)
            .width('100%');
          }

          // 关于我们
          ListItem() {
            Row({ space: 12 }) {
              Image($r('app.media.icon_about'))
                .width(24)
                .height(24)
                .fillColor($r('app.color.primary_color'))
                .marginLeft(16);

              Text($r('app.string.about_us'))
                .fontSize($r('app.float.content_font_size'))
                .flexGrow(1);

              Image($r('app.media.icon_arrow_right'))
                .width(20)
                .height(20)
                .fillColor($r('app.color.gray_text'))
                .marginRight(16);
            }
            .padding(16)
            .width('100%');
          }
        }
        .width('100%')
        .flexGrow(1);
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.page_background'));
  }
}