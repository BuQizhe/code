import router from '@ohos.router';
import { PermissionUtil } from '../ets/util/PermissionUtil';

@Entry
@Component
struct Index {
  build() {
    Column() {
      // 启动页logo+应用名称
      Column({ space: 16 }) {
        Image($r('app.media.app_logo'))
          .width(120)
          .height(120);

        Text($r('app.string.app_name'))
          .fontSize($r('app.float.title_font_size'))
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.primary_color'));
      }
      .flexGrow(1)
      .justifyContent(FlexAlign.Center);

      // 版本信息
      Text(`v1.0.0`)
        .fontSize($r('app.float.small_font_size'))
        .fontColor($r('app.color.gray_text'))
        .marginBottom(32);
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.page_background'));
  }

  // 页面加载完成后跳转首页
  async aboutToAppear() {
    // 检查核心权限
    const permissionUtil = PermissionUtil.getInstance();
    const granted = permissionUtil.checkPermissions([
      'ohos.permission.INTERNET',
      'ohos.permission.WRITE_USER_STORAGE'
    ]);
    // 延迟2秒跳转（启动页展示）
    setTimeout(() => {
      router.replaceUrl({ url: 'pages/CourseHome' });
    }, 2000);
  }
}