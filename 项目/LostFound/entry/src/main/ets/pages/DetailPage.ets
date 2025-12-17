// DetailPage.ets  (API-12，DevEco Studio 6.0.1 零警告)
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
struct DetailPage {
  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext
  // 1. 用点语法取参数，避免 [] 索引警告
  @State item: LostItem = JSON.parse((router.getParams() as Record<string, string>)?.item ?? '{}') as LostItem
  @State comment: string = ''
  @State comments: string[] = this.item.comments ?? []

  // 提交评论
  private async saveComment() {
    if (!this.comment.trim()) return
    this.comments.push(this.comment.trim())
    this.item.comments = this.comments

    // 2. 写回总列表（注意：没有多写 .pref）
    const pref = await dataPreferences.getPreferences(this.context, 'lost')
    const raw = await pref.get('data', '[]') as string
    const all: LostItem[] = JSON.parse(raw)
    const idx = all.findIndex(i => i.id === this.item.id)
    if (idx >= 0) all[idx] = this.item
    await pref.put('data', JSON.stringify(all))
    await pref.flush()          // ✅ 正确写法
    this.comment = ''
    promptAction.showToast({ message: '评论已提交', duration: 1000 })
  }

  // 删除整条
  private async deleteItem() {
    const pref = await dataPreferences.getPreferences(this.context, 'lost')
    const raw = await pref.get('data', '[]') as string
    let all: LostItem[] = JSON.parse(raw)
    all = all.filter(i => i.id !== this.item.id)
    await pref.put('data', JSON.stringify(all))
    await pref.flush()
    promptAction.showToast({ message: '已删除', duration: 1000 })
    router.back()
  }

  // 物理返回键
  onBackPress(): boolean {
    router.back()
    return true
  }

  build() {
    Column() {
      // 顶部返回+标题
      Row() {
        // 3. 临时用文本代替缺失的 back.png；有图后换成 Image($r('app.media.back'))
        Text('< 返回').fontSize(16).fontColor('#007DFF')
          .onClick(() => router.back())
        Text('详情').fontSize(20).fontWeight(FontWeight.Medium).margin({ left: 12 })
        Blank()
        Text('删除').fontColor('#FF4D4F').onClick(() => this.deleteItem())
      }.width('100%').padding(12)

      Scroll() {
        Column() {
          Text(this.item.title).fontSize(22).fontWeight(FontWeight.Medium)
          Text(`时间：${this.item.time}`).fontSize(12).fontColor('#999').margin({ top: 4 })
          Text(`联系电话：${this.item.phone}`).fontSize(14).fontColor('#666').margin({ top: 8 })
          Text('描述：').fontSize(14).fontColor('#666').margin({ top: 12 })
          Text(this.item.desc).fontSize(14).fontColor('#333')
          if (this.item.detail) {
            Text('详细信息：').fontSize(14).fontColor('#666').margin({ top: 12 })
            Text(this.item.detail).fontSize(14).fontColor('#333')
          }

          // 评论列表
          Text(`评论（${this.comments.length}）`).fontSize(16).fontWeight(FontWeight.Medium).margin({ top: 20 })
          if (this.comments.length === 0) {
            Text('暂无评论').fontSize(12).fontColor('#999').margin({ top: 8 })
          } else {
            ForEach(this.comments, (c: string) => {
              Row() {
                // 4. Circle 用 .color() 而不是 .fillColor()
                Circle()
                  .width(8)
                  .height(8)
                  .fill('#007DFF')          // ✅ 正确属性
                Text(c).fontSize(14).fontColor('#333').margin({ left: 8 })
              }.margin({ top: 8 })
            }, (c: string) => c)
          }

          // 写评论
          TextArea({ placeholder: '说点什么...', text: this.comment })
            .height(80).margin({ top: 16 })
            .onChange(v => this.comment = v)
          Button('提交评论').width('100%').margin({ top: 12 })
            .onClick(() => this.saveComment())
        }
        .padding(16).width('100%').backgroundColor('#FFFFFF')
        .borderRadius(12).shadow({ radius: 4, color: '#20000000' })
      }
      .layoutWeight(1).padding({ top: 12 })
    }
    .width('100%').height('100%').backgroundColor('#F5F5F5').padding(16)
  }
}