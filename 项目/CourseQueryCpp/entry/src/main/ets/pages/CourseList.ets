import router from '@ohos.router';
import { CourseDataSource } from '../ets/data/CourseDataSource';
import { CourseCard } from '../ets/components/CourseCard';
import { EmptyView } from '../ets/components/EmptyView';
import { CourseType } from '../ets/model/CourseModel';

@Entry
@Component
struct CourseList {
  @State semester: string = '';
  @State allCourses: Course[] = [];
  @State filteredCourses: Course[] = [];
  @State selectedType: string = '全部';
  @State isLoading: boolean = true;
  private courseDataSource: CourseDataSource = CourseDataSource.getInstance();

  // 课程类型筛选选项
  private typeOptions: string[] = ['全部', '必修课', '选修课', '公选课'];

  async aboutToAppear() {
    // 获取传递的学期参数
    const params = router.getParams();
    this.semester = params.semester as string;
    // 加载全学期课程
    await this.loadAllCourses();
  }

  // 加载全学期课程
  async loadAllCourses() {
    this.isLoading = true;
    this.courseDataSource.getAllCourses(this.semester, (success: boolean, courses: Course[]) => {
      this.isLoading = false;
      if (success) {
        this.allCourses = courses;
        this.filteredCourses = courses; // 初始显示全部
      } else {
        this.allCourses = [];
        this.filteredCourses = [];
      }
    });
  }

  // 筛选课程类型
  filterByType(type: string) {
    this.selectedType = type;
    if (type === '全部') {
      this.filteredCourses = this.allCourses;
    } else {
      this.filteredCourses = this.allCourses.filter(course => {
        switch (type) {
          case '必修课': return course.type === CourseType.COMPULSORY;
          case '选修课': return course.type === CourseType.ELECTIVE;
          case '公选课': return course.type === CourseType.PUBLIC_ELECTIVE;
          default: return true;
        }
      });
    }
  }

  build() {
    Column({ space: 16 }) {
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

        Text(`${this.semester}课程列表`)
          .fontSize($r('app.float.title_font_size'))
          .fontWeight(FontWeight.Bold)
          .flexGrow(1);
      }
      .padding(16)
      .width('100%');

      // 筛选栏
      Row({ space: 12 }) {
        ForEach(this.typeOptions, (option: string) => {
          Button(option)
            .fontSize($r('app.float.content_font_size'))
            .backgroundColor(this.selectedType === option ? $r('app.color.primary_color') : $r('app.color.card_background'))
            .textColor(this.selectedType === option ? '#FFFFFF' : $r('app.color.content_color'))
            .borderRadius($r('app.float.card_radius'))
            .padding(8, 16)
            .onClick(() => this.filterByType(option));
        });
      }
      .padding(0, 0, 0, 16)
      .width('100%')
      .scrollable(ScrollDirection.Horizontal);

      // 课程列表
      if (this.isLoading) {
        Progress()
          .width(40)
          .height(40)
          .margin({ top: 100 });
      } else if (this.filteredCourses.length === 0) {
        EmptyView(message: $r('app.string.empty_course_list'))
        .margin({ top: 100 });
      } else {
        List({ space: 12 }) {
          ForEach(this.filteredCourses, (course: Course) => {
            ListItem() {
              CourseCard(course: course)
              .onClick(() => {
                router.pushUrl({
                  url: 'pages/CourseDetail',
                  params: { course: JSON.stringify(course) }
                });
              });
            }
          });
        }
        .padding(0, 0, 0, 16)
        .width('100%')
        .flexGrow(1);
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.page_background'));
  }
}