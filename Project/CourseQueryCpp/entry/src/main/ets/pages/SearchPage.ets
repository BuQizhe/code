import router from '@ohos.router';
import { CourseDataSource } from '../ets/data/CourseDataSource';
import { CourseCard } from '../ets/components/CourseCard';
import { EmptyView } from '../ets/components/EmptyView';
import { PreferencesUtil } from '../ets/data/PreferencesUtil';

@Entry
@Component
struct SearchPage {
  @State searchText: string = '';
  @State searchResult: Course[] = [];
  @State isSearching: boolean = false;
  private courseDataSource: CourseDataSource = CourseDataSource.getInstance();
  private preferencesUtil: PreferencesUtil = PreferencesUtil.getInstance();

  async aboutToAppear() {
    // 接收搜索关键词（从首页跳转）
    const params = router.getParams();
    if (params.keyword) {
      this.searchText = params.keyword as string;
      await this.doSearch();
    }
  }

  // 执行搜索（调用C++搜索逻辑）
  async doSearch() {
    if (this.searchText.trim() === '') {
      this.searchResult = [];
      return;
    }
    this.isSearching = true;
    this.courseDataSource.searchCourses(this.searchText.trim(), (success: boolean, courses: Course[]) => {
      this.isSearching = false;
      this.searchResult = success ? courses : [];
    });
  }

  build() {
    Column({ space: 16 }) {
      // 搜索栏
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

        TextField(this.searchText)
          .placeholder($r('app.string.search_placeholder'))
          .placeholderFontSize($r('app.float.small_font_size'))
          .placeholderColor($r('app.color.gray_text'))
          .fontSize($r('app.float.content_font_size'))
          .backgroundColor($r('app.color.card_background'))
          .borderRadius($r('app.float.card_radius'))
          .padding(12)
          .flexGrow(1)
          .onChange((value: string) => {
            this.searchText = value;
          })
          .onSubmit(() => this.doSearch());

        Button($r('app.string.search_btn_text'))
          .fontSize($r('app.float.content_font_size'))
          .backgroundColor($r('app.color.primary_color'))
          .textColor('#FFFFFF')
          .borderRadius($r('app.float.card_radius'))
          .padding(12, 20)
          .onClick(() => this.doSearch());
      }
      .padding(16)
      .width('100%');

      // 搜索结果区域
      if (this.isSearching) {
        Progress()
          .width(40)
          .height(40)
          .margin({ top: 100 });
      } else if (this.searchText.trim() === '') {
        EmptyView(message: $r('app.string.search_input_hint'))
        .margin({ top: 100 });
      } else if (this.searchResult.length === 0) {
        EmptyView(message: $r('app.string.empty_search_result'))
        .margin({ top: 100 });
      } else {
        List({ space: 12 }) {
          ForEach(this.searchResult, (course: Course) => {
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