// pages/add/Index.ets
import http from '@ohos.net.http';
import { promptAction } from '@kit.ArkUI';

/* ==================== 数据类型 ==================== */
interface Record {
  amount: number;
  type: string;
  category: string;
  remark?: string;
  user_id: number;
}

interface AddResponse {
  success: boolean;
}

/* ==================== 网络请求 ==================== */
const BASE_URL: string = 'http://192.168.221.23:5000';   // 改成你的电脑 IP

async function addRecord(record: Record): Promise<boolean> {
  const client = http.createHttp();
  try {
    const resp = await client.request(
      `${BASE_URL}/api/record/add`,
      {
        method: http.RequestMethod.POST,
        header: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json'
        },
        extraData: JSON.stringify(record),
        expectDataType: http.HttpDataType.STRING
      }
    );

    console.info('响应码：', resp.responseCode);
    console.info('响应内容：', resp.result);

    if (resp.responseCode === 200) {
      const data: AddResponse = JSON.parse(`${resp.result}`);
      return data.success;
    }
    return false;
  } catch (e) {
    console.error('新增失败：', e);
    return false;
  } finally {
    client.destroy();
  }
}

/* ==================== 标签下拉 ==================== */
@Component
struct TagMenu {
  @Link selectedName: string
  private options: SelectOption[] = [
    { value: '医疗' }, { value: '食物' }, { value: '购物' },
    { value: '家庭' }, { value: '水电物业费' }, { value: '交通' },
    { value: '教育' }, { value: '娱乐' }, { value: '旅行' },
    { value: '保险' }, { value: '储蓄' }, { value: '房租' }
  ]

  build() {
    Select(this.options)
      .selected(this.options.findIndex(opt => String(opt.value) === this.selectedName))
      .onSelect(idx => this.selectedName = String(this.options[idx].value))
      .width(120)
      .height(36)
  }
}

/* ==================== 页面组件 ==================== */
@Component
export struct AddIndex {
  @State amount: string = ''
  @State type: string = ''
  @State tagName: string = '医疗'
  @State remark: string = ''
  private numReg = /^\d+(\.\d{1,2})?$/

  onSubmit = async () => {
    if (!this.type) {
      promptAction.showToast({ message: '请选择类型' });
      return;
    }
    if (!this.numReg.test(this.amount)) {
      promptAction.showToast({ message: '金额格式错误' });
      return;
    }
    const ok = await addRecord({
      amount: parseFloat(this.amount),
      type: this.type,
      category: this.tagName,
      remark: this.remark,
      user_id: 1          // 后端要求
    });
    if (ok) {
      promptAction.showToast({ message: '提交成功（已存到后端！）' });
      this.amount = '';
      this.remark = '';
      this.type = '';
      this.tagName = '医疗';
    } else {
      promptAction.showToast({ message: '提交失败，请检查后端' });
    }
  }

  

  build() {
    Column({ space: 20 }) {
      Text('记一笔').fontSize(24).fontWeight(FontWeight.Bold)

      Row({ space: 10 }) {
        Text('类型').width(60).fontSize(16)
        Row({ space: 20 }) {
          Radio({ value: '支出', group: 'type' })
            .checked(this.type === '支出')
            .onChange(() => this.type = '支出')
          Text('支出')
          Radio({ value: '收入', group: 'type' })
            .checked(this.type === '收入')
            .onChange(() => this.type = '收入')
          Text('收入')
        }
      }

      Row({ space: 10 }) {
        Text('金额').width(60).fontSize(16)
        TextInput({ placeholder: '0.00', text: this.amount })
          .type(InputType.Number)
          .width('70%')
          .onChange(v => this.amount = v)
      }

      Row({ space: 10 }) {
        Text('标签').width(60).fontSize(16)
        TagMenu({ selectedName: $tagName })
      }

      Row({ space: 10 }) {
        Text('备注').width(60).fontSize(16)
        TextInput({ placeholder: '选填', text: this.remark })
          .width('70%')
          .onChange(v => this.remark = v)
      }

      Button('提交')
        .width(120)
        .onClick(() => this.onSubmit())
    }
    .alignItems(HorizontalAlign.Start)
    .padding(20)
  }
}