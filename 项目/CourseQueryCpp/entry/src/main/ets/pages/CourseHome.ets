import router from '@ohos.router';
import { CourseDataSource } from '../ets/data/CourseDataSource';
import { PreferencesUtil } from '../ets/data/PreferencesUtil';
import { CourseCard } from '../ets/components/CourseCard';
import { EmptyView } from '../ets/components/EmptyView';
import { Semester } from '../ets/model/CourseModel';

@Entry
@Component
struct CourseHome {
  @State currentSemester: string = Semester.FIRST_SEMESTER;
  @State todayCourses: Course[] = [];
  @State isLoading: boolean = true;
  private courseDataSource: CourseDataSource = CourseDataSource.getInstance();
  private preferencesUtil: PreferencesUtil = PreferencesUtil.getInstance();

  // 页面加载初始化
  async aboutToAppear() {
    // 读取缓存学期
    this.currentSemester = await this.preferencesUtil.getCurrentSemester();
    // 加载今日课程
    await this.loadTodayCourses();
  }

  // 加载今日课程（调用C++数据源）
  async loadTodayCourses() {
    this.isLoading = true;
    this.courseDataSource.getTodayCourses((success: boolean, courses: Course[]) => {
      this.isLoading = false;
      if (success) {
        this.todayCourses = courses;
      } else {
        this.todayCourses = [];
      }
    });
  }

  // 切换学期
  async changeSemester(semester: string) {
    await this.preferencesUtil.setCurrentSemester(semester);
    this.currentSemester = semester;
    await this.loadTodayCourses();
  }

  // 跳转到搜索页
  goToSearch() {
    router.pushUrl({ url: 'pages/SearchPage' });
  }

  // 跳转到课程列表页
  goToCourseList() {
    router.pushUrl({ url: 'pages/CourseList', params: { semester: this.currentSemester } });
  }

  // 跳转到个人中心
  goToMine() {
    router.pushUrl({ url: 'pages/MinePage' });
  }

  build() {
    Column({ space: 16 }) {
      // 顶部导航栏
      Row({ space: 12 }) {
        Text($r('app.string.course_home_title'))
          .fontSize($r('app.float.title_font_size'))
          .fontWeight(FontWeight.Bold)
          .flexGrow(1);

        // 学期切换下拉框
        DropdownMenu() {
          Text(this.currentSemester)
            .fontSize($r('app.float.content_font_size'))
            .padding(12);
        }
        .menuItems([
          { value: Semester.FIRST_SEMESTER, action: () => this.changeSemester(Semester.FIRST_SEMESTER) },
          { value: Semester.SECOND_SEMESTER, action: () => this.changeSemester(Semester.SECOND_SEMESTER) },
          { value: Semester.SUMMER_TERM, action: () => this.changeSemester(Semester.SUMMER_TERM) },
          { value: Semester.WINTER_TERM, action: () => this.changeSemester(Semester.WINTER_TERM) }
        ])
        .width(220);

        // 个人中心入口
        Image($r('app.media.icon_user'))
          .width(28)
          .height(28)
          .onClick(() => this.goToMine());

        // 搜索按钮
        Image($r('app.media.icon_search'))
          .width(28)
          .height(28)
          .marginLeft(12)
          .onClick(() => this.goToSearch());
      }
      .padding(16)
      .width('100%');

      // 今日课程标题栏
      Row({ space: 8 }) {
        Text(`今日课程（${new Date().toLocaleDateString()}）`)
          .fontSize($r('app.float.subtitle_font_size'))
          .fontWeight(FontWeight.Medium)
          .flexGrow(1);

        Text('查看全部')
          .fontSize($r('app.float.small_font_size'))
          .fontColor($r('app.color.primary_color'))
          .onClick(() => this.goToCourseList());
      }
      .padding(0, 0, 0, 16)
      .width('100%');

      // 加载状态/空状态/课程列表
      if (this.isLoading) {
        Progress()
          .width(40)
          .height(40)
          .margin({ top: 100 });
      } else if (this.todayCourses.length === 0) {
        EmptyView(message: $r('app.string.empty_today_course'))
        .margin({ top: 100 });
      } else {
        List({ space: 12 }) {
          ForEach(this.todayCourses, (course: Course) => {
            ListItem() {
              CourseCard(course: course)
              .onClick(() => {
                // 跳转到课程详情页
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