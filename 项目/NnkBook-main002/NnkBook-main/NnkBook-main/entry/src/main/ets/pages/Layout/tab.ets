// entry/src/main/ets/pages/Layout/tab.ets
import { LoginPage } from '../LoginPage'
import { AddPage } from '../AddPage'
import { ListPage } from '../ListPage'
import { ProfilePage } from '../ProfilePage'

@Entry
@Component
struct TabsPage {
  @State currentIndex: number = 0
  private tabsController: TabsController = new TabsController()

  aboutToAppear(): void {
    // 未登录则停留在登录页
    if (!AppStorage.Get('loggedIn')) this.currentIndex = 0
  }

  build() {
    Column() {
      Tabs({ barPosition: BarPosition.End, controller: this.tabsController, index: this.currentIndex }) {
        TabContent() { LoginPage() }
        .tabBar(this.TabBuilder('登录', 0))

        TabContent() { AddPage() }
        .tabBar(this.TabBuilder('新增', 1))

        TabContent() { ListPage() }
        .tabBar(this.TabBuilder('记录', 2))

        TabContent() { ProfilePage() }
        .tabBar(this.TabBuilder('我的', 3))
      }
      .animationDuration(0)
      .scrollable(false)
      .onChange((index: number) => this.currentIndex = index)
    }
    .backgroundColor('#F5F5F5')
    .width('100%')
    .height('100%')
  }

  @Builder
  TabBuilder(title: string, index: number) {
    Column() {
      Text(title)
        .fontSize(14)
        .fontColor(this.currentIndex === index ? '#007AFF' : '#666')
        .fontWeight(this.currentIndex === index ? FontWeight.Bold : FontWeight.Normal)
    }
    .width('100%')
    .height(56)
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      this.currentIndex = index
      this.tabsController.changeIndex(index)
    })
  }
}

export {TabsPage}