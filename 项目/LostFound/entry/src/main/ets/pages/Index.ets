// Index.ets  零警告版  API-12  ✅
import router from '@ohos.router'
import promptAction from '@ohos.promptAction'
import dataPreferences from '@ohos.data.preferences'
import picker from '@ohos.file.picker'
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
struct Index {
  @State list: LostItem[] = []
  @State isRefreshing: boolean = false
  @State userName: string = ''
  @State avatarUri: string = ''

  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext
  private pref: dataPreferences.Preferences | null = null

  async aboutToAppear() {
    this.pref = await dataPreferences.getPreferences(this.context, 'lost')
    const authPref = await dataPreferences.getPreferences(this.context, 'auth')
    this.userName = await authPref.get('account', '同学') as string
    this.avatarUri = await authPref.get('avatar', '') as string
    await this.loadData()
  }

  private async loadData() {
    if (!this.pref) return
    const raw = await this.pref.get('data', '[]') as string
    this.list = JSON.parse(raw)
  }

  async save() {
    if (!this.pref) return
    await this.pref.put('data', JSON.stringify(this.list))
    await this.pref.flush()
    promptAction.showToast({ message: '保存成功', duration: 1500 })
  }

  // 换头像：图库选择
  async pickAvatar() {
    try {
      const photoPicker = new picker.PhotoViewPicker()
      const res = await photoPicker.select({
        MIMEType: picker.PhotoViewMIMETypes.IMAGE_TYPE,
        maxSelectNumber: 1
      })
      if (res.photoUris && res.photoUris.length > 0) {
        this.avatarUri = res.photoUris[0]
        const authPref = await dataPreferences.getPreferences(this.context, 'auth')
        await authPref.put('avatar', this.avatarUri)
        await authPref.flush()
        promptAction.showToast({ message: '头像已更新' })
      }
    } catch (e) {
      promptAction.showToast({ message: '取消选择' })
    }
  }

  onBackPress(): boolean {
    router.replaceUrl({ url: 'pages/LoginPage' })
    return true
  }

  @Builder
  itemCard(item: LostItem) {
    Row() {
      Column() {
        Text(item.title).fontSize(18).fontWeight(FontWeight.Medium)
        Text(item.desc).fontSize(14).fontColor('#666').maxLines(2)
        Text(`联系电话：${item.phone}  时间：${item.time}`)
          .fontSize(12).fontColor('#999').margin({ top: 4 })
      }.alignItems(HorizontalAlign.Start).layoutWeight(1)

      Image($r('app.media.delete'))
        .width(24).height(24)
        .onClick(async () => {
          this.list = this.list.filter(i => i.id !== item.id)
          await this.save()
        })
    }
    .width('100%')
    .padding(12)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .shadow({ radius: 4, color: '#20000000' })
    .onClick(() => {
      router.pushUrl({ url: 'pages/DetailPage', params: { item: JSON.stringify(item) } })
    })
  }

  @Builder
  emptyUI() {
    Blank()
    Column() {
      Image($r('app.media.empty')).width(120).height(120)
      Text('暂无失物，快去发布第一条吧~').fontSize(14).fontColor('#999')
    }
  }

  build() {
    Column() {
      // 顶部背景+头像+返回
      Stack() {
        Image($r('app.media.bg_main')).width('100%').height(200).objectFit(ImageFit.Cover)
        Row() {
          Image(this.avatarUri ? this.avatarUri : $r('app.media.avatar'))
            .width(60).height(60).borderRadius(30).onClick(() => this.pickAvatar())
          Column() {
            Text(`欢迎，${this.userName}`).fontSize(18).fontColor('#FFF')
            Text('点头像可更换').fontSize(12).fontColor('#FFF')
          }.alignItems(HorizontalAlign.Start).margin({ left: 12 })
        }.alignItems(VerticalAlign.Center).margin({ top: 80, left: 20 })

        Text('< 返回').fontSize(16).fontColor('#FFF')
          .position({ x: 20, y: 40 }).onClick(() => {
          router.replaceUrl({ url: 'pages/LoginPage' })
        })
      }.height(200)

      // ✅ Refresh 事件挂在组件上，构造参数里不写 onRefreshing
      Refresh({ refreshing: this.isRefreshing }) {
        Column() {   // 单孩子
          if (this.list.length === 0) {
            this.emptyUI()
          } else {
            List({ space: 12 }) {
              ForEach(this.list, (item: LostItem) => {
                ListItem() { this.itemCard(item) }
              }, (item: LostItem) => item.id)
            }.padding({ left: 16, right: 16 })
          }
        }
      }
      .onRefreshing(async () => {   // ✅ 事件挂在组件上
        this.isRefreshing = true
        await this.loadData()
        this.isRefreshing = false
        promptAction.showToast({ message: '已刷新' })
      })
      .layoutWeight(1)   // ✅ 正确属性名
      .backgroundColor('#F5F5F5')

      // 悬浮发布
      Row() {
        Image($r('app.media.add')).width(32).height(32).fillColor('#FFF')
      }
      .width(56).height(56).backgroundColor('#007DFF').borderRadius(28)
      .position({ x: '80%', y: '85%' }).shadow({ radius: 6, color: '#40000000' })
      .onClick(() => router.pushUrl({ url: 'pages/AddPage' }))
    }
    .width('100%').height('100%').backgroundColor('#F5F5F5')
  }
}