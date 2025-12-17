// AddPage.ets
import router from '@ohos.router'
import promptAction from '@ohos.promptAction'
import dataPreferences from '@ohos.data.preferences'
import { common } from '@kit.AbilityKit'

interface LostItem {
  id: string
  title: string
  desc: string
  phone: string
  time: string
  detail?: string
  comments?: string[]
}

@Entry
@Component
struct AddPage {
  context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext
  @State title: string = ''
  @State desc: string = ''
  @State phone: string = ''
  @State detail: string = ''   // 详细信息

  async save() {
    if (!this.title || !this.phone) {
      promptAction.showToast({ message: '请填写物品名称和电话', duration: 1000 }); return
    }
    const pref = await dataPreferences.getPreferences(this.context, 'lost')
    const raw = await pref.get('data', '[]') as string
    const old: LostItem[] = JSON.parse(raw)
    old.push({
      id: Date.now().toString(),
      title: this.title,
      desc: this.desc,
      phone: this.phone,
      detail: this.detail,               // 保存详细信息
      time: new Date().toLocaleString(),
      comments: []
    })
    await pref.put('data', JSON.stringify(old))
    await pref.flush()
    promptAction.showToast({ message: '发布成功！', duration: 1500 })
    router.back()
  }

  build() {
    Column() {
      Row() {
        Text('新增失物').fontSize(24).fontWeight(FontWeight.Bold)
        Blank()
        Text('保存').fontSize(18).fontColor('#007DFF').onClick(() => this.save())
      }.width('100%').padding(16)

      Scroll() {
        Column() {
          Text('物品名称').fontSize(14).fontColor('#666')
          TextInput({ placeholder: '如：黑色钱包', text: this.title })
            .onChange(v => this.title = v)

          Text('描述信息').fontSize(14).fontColor('#666').margin({ top: 12 })
          TextInput({ placeholder: '丢失地点、特征等', text: this.desc })
            .onChange(v => this.desc = v)

          Text('联系电话').fontSize(14).fontColor('#666').margin({ top: 12 })
          TextInput({ placeholder: '手机号', text: this.phone })
            .type(InputType.PhoneNumber)
            .onChange(v => this.phone = v)

          Text('详细信息').fontSize(14).fontColor('#666').margin({ top: 12 })
          TextArea({ placeholder: '详细描述、照片文字等（可选）', text: this.detail })
            .height(120).onChange(v => this.detail = v)
        }.padding(16).width('100%').backgroundColor('#FFFFFF')
        .borderRadius(12).shadow({ radius: 4, color: '#20000000' })
      }.layoutWeight(1).padding({ top: 12 })

      Button('发布失物').width('90%').margin({ bottom: 20 })
        .onClick(() => this.save())
    }
    .width('100%').height('100%').backgroundColor('#F5F5F5').padding(16)
  }
}