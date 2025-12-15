import router from '@ohos.router';
import { CourseUtil } from '../ets/model/CourseModel';

@Entry
@Component
struct CourseDetail {
  @State course: Course | null = null;
  @State isLoading: boolean = true;

  async aboutToAppear() {
    // 获取传递的课程参数
    const params = router.getParams();
    const courseStr = params.course as string;
    // 反序列化课程数据
    let errCode = 0;
    this.course = CourseUtil.deserialize(courseStr, errCode);
    this.isLoading = false;
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

        Text('课程详情')
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
          .margin({ top: 100 });
      } else if (!this.course) {
        Text($r('app.string.course_detail_load_fail'))
          .fontSize($r('app.float.content_font_size'))
          .fontColor($r('app.color.gray_text'))
          .margin({ top: 100 });
      } else {
        // 课程详情卡片
        Column({ space: 16 }) {
          // 课程名称+教师
          Column({ space: 8 }) {
            Text(this.course.name)
              .fontSize($r('app.float.title_font_size'))
              .fontWeight(FontWeight.Bold)
              .textAlign(TextAlign.Center);

            Text(`授课教师：${this.course.teacher}`)
              .fontSize($r('app.float.content_font_size'))
              .fontColor($r('app.color.gray_text'))
              .textAlign(TextAlign.Center);
          }

          // 核心信息网格
          Grid() {
            GridItem() {
              CourseInfoItem(label: '学分', value: this.course.credit.toString());
            }
            GridItem() {
              CourseInfoItem(label: '课程类型', value: CourseTypeToString(this.course.type));
            }
            GridItem() {
              CourseInfoItem(label: '考核方式', value: ExamTypeToString(this.course.examType));
            }
            GridItem() {
              CourseInfoItem(label: '周次范围', value: this.course.weekRange);
            }
          }
          .columnsTemplate('1fr 1fr')
          .columnsGap(16)
          .rowsGap(16)
          .padding(0, 16);

          // 上课时间
          CourseDetailItem(label: '上课时间', content: this.course.classTime.join('\n'));

          // 上课地点
          CourseDetailItem(label: '上课地点', content: this.course.location);

          // 课程简介
          if (this.course.description) {
            CourseDetailItem(label: '课程简介', content: this.course.description);
          }
        }
        .padding(20)
        .width('90%')
        .backgroundColor($r('app.color.card_background'))
        .borderRadius($r('app.float.card_radius'))
        .shadow({ radius: 4, color: $r('app.color.shadow_color'), offsetY: 2 })
        .margin({ top: 10 });
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.page_background'));
  }
}

// 课程详情项组件（复用）
@Component
struct CourseDetailItem {
  @Prop label: string;
  @Prop content: string;

  build() {
    Column({ space: 8 }) {
      Text(this.label)
        .fontSize($r('app.float.small_font_size'))
        .fontColor($r('app.color.gray_text'))
        .width('100%');

      Text(this.content)
        .fontSize($r('app.float.content_font_size'))
        .fontColor($r('app.color.content_color'))
        .width('100%')
        .textWrap(true);
    }
  }
}

// 课程信息网格项组件（复用）
@Component
struct CourseInfoItem {
  @Prop label: string;
  @Prop value: string;

  build() {
    Column({ space: 4 }) {
      Text(this.label)
        .fontSize($r('app.float.small_font_size'))
        .fontColor($r('app.color.gray_text'));

      Text(this.value)
        .fontSize($r('app.float.content_font_size'))
        .fontColor($r('app.color.content_color'));
    }
    .alignItems(ItemAlign.Center)
    .backgroundColor($r('app.color.page_background'))
    .padding(12)
    .borderRadius($r('app.float.card_radius'));
  }
}