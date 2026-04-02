// entry/src/main/ets/pages/AddPage.ets
import { promptAction } from '@kit.ArkUI';
import { router } from '@kit.ArkUI';
import { getNowDate } from '../utils/time';
import { addRecord } from '../utils/HttpUtil';
import { UserInfo } from '../utils/HttpUtil';

@Component
export struct AddPage {
  @State amount: string = '';
  @State type: string = '';
  @State category: string = '餐饮';
  @State remark: string = '';
  private userInfo: UserInfo = AppStorage.get('currentUser') as UserInfo;

  private numReg = /^\d+(\.\d{1,2})?$/;

  async submit(): Promise<void> {
    if (!this.type) { promptAction.showToast({ message: '请选择类型' }); return; }
    const val = parseFloat(this.amount);
    if (isNaN(val) || val <= 0) { promptAction.showToast({ message: '金额必须是正数' }); return; }

    const ok = await addRecord({
      amount: val,
      type: this.type,
      category: this.category,
      remark: this.remark,
      user_id: this.userInfo.userId,
      date: getNowDate()
    });

    if (ok) {
      try {
        promptAction.showToast({ message: '提交成功' });
      } catch (error) {
        // TODO: Implement error handling.
      }
      this.amount = ''; this.remark = ''; this.type = ''; this.category = '食物';

      // 跳转到 ListPage 并传递数据
      router.pushUrl({
        url: 'pages/ListPage',
        params: {
          data: JSON.stringify({
            amount: val,
            type: this.type,
            category: this.category,
            remark: this.remark,
            date: getNowDate()
          })
        }
      }).catch(() => {
        // TODO: Implement error handling.
      });
    } else {
      try {
        promptAction.showToast({ message: '提交失败' });
      } catch (error) {
        // TODO: Implement error handling.
      }
    }
  }

  build() {
    Stack() {
      Image($r('app.media.bg2'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .blur(20)

      Column({ space: 20 }) {
        Text('新增记录').fontSize(28).fontColor(Color.White).fontWeight(FontWeight.Bold)

        Row({ space: 20 }) {
          Radio({ value: '支出', group: 'type' }).checked(this.type === '支出')
            .onChange(() => this.type = '支出')
          Text('支出').fontColor(Color.White)
          Radio({ value: '收入', group: 'type' }).checked(this.type === '收入')
            .onChange(() => this.type = '收入')
          Text('收入').fontColor(Color.White)
        }

        TextInput({ placeholder: '金额（如 10.5）', text: this.amount })
          .type(InputType.Number)
          .width('90%')
          .backgroundColor('#20FFFFFF')
          .borderRadius(12)
          .padding(12)
          .fontSize(16)
          .onChange(v => this.amount = v)

        Select([{ value: '医疗' }, { value: '餐饮' }, { value: '交通' }, { value: '娱乐' }, { value: '衣服' }, { value: '住房' }, { value: '薪水' }, { value: '储蓄' }, { value: '银行' }, { value: '额外' }])
          .onSelect(idx => this.category = ['医疗', '餐饮', '交通', '娱乐', '衣服', '住房', '薪水', '储蓄', '银行', '额外'][idx])
          .width('90%')
          .height(40)
          .backgroundColor('#20FFFFFF')
          .borderRadius(12)

        TextInput({ placeholder: '备注（可选）', text: this.remark })
          .width('90%')
          .backgroundColor('#20FFFFFF')
          .borderRadius(12)
          .padding(12)
          .fontSize(16)
          .onChange(v => this.remark = v)

        Button('提交')
          .width('90%')
          .height(50)
          .backgroundColor('#007AFF')
          .borderRadius(25)
          .fontSize(18)
          .fontColor(Color.White)
          .onClick(() => this.submit())
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .height('100%')
  }
}