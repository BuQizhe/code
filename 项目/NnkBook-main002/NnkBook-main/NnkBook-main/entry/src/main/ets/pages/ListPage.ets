// entry/src/main/ets/pages/ListPage.ets
import { promptAction } from '@kit.ArkUI';
import { listRecord, deleteRecord, type Record } from '../utils/HttpUtil';
import { UserInfo } from '../utils/HttpUtil';
import { router } from '@kit.ArkUI';

interface GeneratedTypeLiteralInterface_1 {
  data?: string;
}

@Component
export struct ListPage {
  @State records: Record[] = [];
  @State income: number = 0;
  @State outcome: number = 0;
  private userInfo: UserInfo = AppStorage.get('currentUser') as UserInfo;

  aboutToAppear(): void {
    this.loadList();
    this.handlePassedData();
  }

  async loadList(): Promise<void> {
    this.records = await listRecord(this.userInfo.userId);
    this.updateTotals();
  }

  updateTotals(): void {
    this.income = this.records.filter(i => i.type === '收入').reduce((s, i) => s + i.amount, 0);
    this.outcome = this.records.filter(i => i.type === '支出').reduce((s, i) => s + i.amount, 0);
  }

  async deleteItem(item: Record): Promise<void> {
    if (!item.id) return;
    const ok = await deleteRecord(item.id);
    if (ok) {
      try {
        promptAction.showToast({ message: '已删除' });
      } catch (error) {
        // TODO: Implement error handling.
      }
      await this.loadList();
    }
  }

  handlePassedData(): void {
    const params = router.getParams() as GeneratedTypeLiteralInterface_1;
    if (params && typeof params.data === 'string') {
      const passedData: Record = JSON.parse(params.data);
      this.records.unshift(passedData); // 将新数据添加到列表顶部
      this.updateTotals();
    }
  }

  build() {
    Stack() {
      Image($r('app.media.bg3'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .blur(20)

      Column({ space: 20 }) {
        Text('记账记录').fontSize(28).fontColor(Color.White).fontWeight(FontWeight.Bold)

        Row({ space: 20 }) {
          Text(`收入 ¥${this.income.toFixed(2)}`).fontColor('#00C853').fontSize(18)
          Text(`支出 ¥${this.outcome.toFixed(2)}`).fontColor('#FF4444').fontSize(18)
        }.alignSelf(ItemAlign.Start)

        if (this.records.length === 0) {
          Text('暂无记录，去“新增”页提交一笔～').fontSize(16).fontColor(Color.White).margin({ top: 40 })
        } else {
          List({ space: 10 }) {
            ForEach(this.records, (item: Record) => {
              ListItem() {
                Row() {
                  Column({ space: 4 }) {
                    Row({ space: 10 }) {
                      Text(item.type === '支出' ? `支出 ¥${item.amount}` : `收入 ¥${item.amount}`)
                        .fontSize(18).fontColor(item.type === '支出' ? '#FF4444' : '#00C853')
                      Text(`【${item.category}】`).fontSize(14).fontColor('#666')
                    }
                    if (item.remark) Text(`备注：${item.remark}`).fontSize(13).fontColor('#888')
                    Text(`时间：${item.create_time}`).fontSize(12).fontColor('#999')
                  }.layoutWeight(1)

                  Button('删除')
                    .width(40)
                    .height(28)
                    .fontSize(12)
                    .backgroundColor('#F56C6C')
                    .onClick(() => this.deleteItem(item))
                }
                .width('100%')
                .padding(15)
                .backgroundColor('#20FFFFFF')
                .borderRadius(12)
              }.swipeAction({ end: this.deleteButton(item) })
            }, (item: Record) => item.id?.toString() ?? `${item.amount}-${item.category}`)
          }
          .width('100%')
          .layoutWeight(1)
        }

        Button('刷新')
          .width('90%')
          .height(50)
          .backgroundColor('#007AFF')
          .borderRadius(25)
          .fontSize(18)
          .fontColor(Color.White)
          .onClick(() => this.loadList())
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  deleteButton(item: Record) {
    Button('删除')
      .width(60)
      .height('100%')
      .backgroundColor('#F56C6C')
      .onClick(() => this.deleteItem(item))
  }
}