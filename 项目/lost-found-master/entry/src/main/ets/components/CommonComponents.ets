// 项目作者：杨钰然

// 通用组件库
import { router } from "@kit.ArkUI";

// 导航工具类
export class NavigationUtils {
  // 统一的底部导航处理函数
  static handleTabNavigation(targetIndex: number, currentIndex: number) {
    // 如果已经在目标页面，不进行跳转
    if (targetIndex === currentIndex) {
      return;
    }
    
    switch (targetIndex) {
      case 0:
        router.pushUrl({ url: 'pages/MainPage' });
        break;
      case 1:
        router.pushUrl({ url: 'pages/CommunityPage' });
        break;
      case 2:
        router.pushUrl({ url: 'pages/MessagePage' });
        break;
      case 3:
        router.pushUrl({ url: 'pages/ProfilePage' });
        break;
    }
  }
}

// 渐变按钮组件
@Component
export struct GradientButton {
  @Prop text: string = '';
  @Prop buttonWidth: string | number = '100%';
  @Prop buttonHeight: string | number = 48;
  @Prop fontSize: number = 16;
  @Prop fontColor: ResourceColor = Color.White;
  private onButtonClick?: () => void;

  build() {
    Button(this.text)
      .width(this.buttonWidth)
      .height(this.buttonHeight)
      .fontSize(this.fontSize)
      .fontColor(this.fontColor)
      .linearGradient({
        angle: 135,
        colors: [['#667eea', 0], ['#764ba2', 1]]
      })
      .borderRadius(8)
      .onClick(() => {
        if (this.onButtonClick) {
          this.onButtonClick();
        }
      })
  }
}

// 输入框组件
@Component
export struct CustomTextInput {
  @Prop label: string = '';
  @Prop placeholder: string = '';
  @Link value: string;
  @Prop errorMessage: string = '';
  @Prop inputType: InputType = InputType.Normal;
  @Prop maxLength: number = -1;

  build() {
    Column() {
      if (this.label) {
        Text(this.label)
          .fontSize(16)
          .fontColor('#333333')
          .alignSelf(ItemAlign.Start)
          .margin({ bottom: 8 })
      }
      
      TextInput({ placeholder: this.placeholder, text: this.value })
        .width('100%')
        .height(48)
        .fontSize(16)
        .backgroundColor('#f8f9fa')
        .borderRadius(8)
        .border({ width: 1, color: this.errorMessage ? '#ff6b6b' : '#dee2e6' })
        .type(this.inputType)
        .maxLength(this.maxLength > 0 ? this.maxLength : undefined)
        .onChange((value: string) => {
          this.value = value;
        })
      
      if (this.errorMessage) {
        Text(this.errorMessage)
          .fontSize(14)
          .fontColor('#ff6b6b')
          .alignSelf(ItemAlign.Start)
          .margin({ top: 4 })
      }
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }
}

// 卡片容器组件
@Component
export struct CardContainer {
  @Prop cardPadding: number = 20;
  @Prop cardMargin: number = 0;
  @Prop cardBackgroundColor: ResourceColor = Color.White;
  @Prop cardBorderRadius: number = 12;
  @Prop showShadow: boolean = true;
  @BuilderParam content: () => void;

  build() {
    Column() {
      this.content()
    }
    .width('100%')
    .padding(this.cardPadding)
    .margin(this.cardMargin)
    .backgroundColor(this.cardBackgroundColor)
    .borderRadius(this.cardBorderRadius)
    .shadow(this.showShadow ? { 
      radius: 4, 
      color: '#00000010', 
      offsetX: 0, 
      offsetY: 2 
    } : null)
  }
}

// 状态标签组件
interface GeneratedObjectLiteralInterface_1 {
  bg: string;
  text: Color;
}

interface GeneratedObjectLiteralInterface_2 {
  fontSize: number;
  padding: Padding;
}

@Component
export struct StatusTag {
  @Prop tagType: '寻物' | '寻主' | '寻找中' | '已找到' = '寻物';
  @Prop tagSize: 'small' | 'medium' | 'large' = 'medium';
  @Prop text: string = '';

  private getTagStyle() {
    if (this.tagType === '寻物') {
      return ({ bg: '#ff6b6b', text: Color.White } as GeneratedObjectLiteralInterface_1);
    } else if (this.tagType === '寻主') {
      return ({ bg: '#51cf66', text: Color.White } as GeneratedObjectLiteralInterface_1);
    } else if (this.tagType === '寻找中') {
      return ({ bg: '#339af0', text: Color.White } as GeneratedObjectLiteralInterface_1);
    } else if (this.tagType === '已找到') {
      return ({ bg: '#868e96', text: Color.White } as GeneratedObjectLiteralInterface_1);
    } else {
      return ({ bg: '#ff6b6b', text: Color.White } as GeneratedObjectLiteralInterface_1);
    }
  }

  private getTagSize() {
    if (this.tagSize === 'small') {
      return ({ fontSize: 12, padding: { left: 6, right: 6, top: 2, bottom: 2 } } as GeneratedObjectLiteralInterface_2);
    } else if (this.tagSize === 'medium') {
      return ({ fontSize: 14, padding: { left: 8, right: 8, top: 4, bottom: 4 } } as GeneratedObjectLiteralInterface_2);
    } else if (this.tagSize === 'large') {
      return ({ fontSize: 16, padding: { left: 10, right: 10, top: 6, bottom: 6 } } as GeneratedObjectLiteralInterface_2);
    } else {
      return ({ fontSize: 14, padding: { left: 8, right: 8, top: 4, bottom: 4 } } as GeneratedObjectLiteralInterface_2);
    }
  }

  build() {
    Text(this.text || this.tagType)
      .fontSize(this.getTagSize().fontSize)
      .fontColor(this.getTagStyle().text)
      .backgroundColor(this.getTagStyle().bg)
      .borderRadius(12)
      .padding(this.getTagSize().padding)
  }
}

// 空状态组件
@Component
export struct EmptyState {
  @Prop icon: string = '📭';
  @Prop title: string = '暂无数据';
  @Prop description: string = '';
  @Prop actionText: string = '';
  private onAction?: () => void;

  build() {
    Column() {
      Text(this.icon)
        .fontSize(48)
        .margin({ bottom: 20 })
      
      Text(this.title)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor('#666666')
        .margin({ bottom: 10 })
      
      if (this.description) {
        Text(this.description)
          .fontSize(14)
          .fontColor('#999999')
          .textAlign(TextAlign.Center)
          .margin({ bottom: 20 })
      }
      
      if (this.actionText && this.onAction) {
        Button(this.actionText)
          .height(40)
          .fontSize(14)
          .fontColor('#667eea')
          .backgroundColor('#f0f2ff')
          .borderRadius(20)
          .padding({ left: 20, right: 20 })
          .onClick(() => {
            if (this.onAction) {
              this.onAction();
            }
          })
      }
    }
    .width('100%')
    .padding(40)
    .justifyContent(FlexAlign.Center)
  }
}

// 加载组件
@Component
export struct LoadingSpinner {
  @Prop spinnerSize: number = 32;
  @Prop color: ResourceColor = '#667eea';
  @Prop text: string = '';

  build() {
    Column() {
      LoadingProgress()
        .width(this.spinnerSize)
        .height(this.spinnerSize)
        .color(this.color)
      
      if (this.text) {
        Text(this.text)
          .fontSize(14)
          .fontColor('#666666')
          .margin({ top: 10 })
      }
    }
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }
}

// 头部导航组件
@Component
export struct HeaderBar {
  @Prop title: string = '';
  @Prop showBack: boolean = true;
  @Prop showAction: boolean = false;
  @Prop actionText: string = '';
  onBack?: () => void;
  onAction?: () => void;

  build() {
    Row() {
      if (this.showBack) {
        Button('←')
          .fontSize(20)
          .fontColor(Color.White)
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            if (this.onBack) {
              this.onBack();
            } else {
              router.back();
            }
          })
      } else {
        Row().width(40)
      }
      
      Text(this.title)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor(Color.White)
        .layoutWeight(1)
        .textAlign(TextAlign.Center)
      
      if (this.showAction && this.actionText) {
        Button(this.actionText)
          .fontSize(16)
          .fontColor(Color.White)
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            if (this.onAction) {
              this.onAction();
            }
          })
      } else {
        Row().width(40)
      }
    }
    .width('100%')
    .height(60)
    .linearGradient({
      angle: 135,
      colors: [['#667eea', 0], ['#764ba2', 1]]
    })
    .justifyContent(FlexAlign.SpaceBetween)
    .alignItems(VerticalAlign.Center)
    .padding({ left: 15, right: 15, top: 10, bottom: 10 })
  }
}

// 定义Tab接口
interface TabItem {
  icon: string;
  text: string;
  activeColor?: ResourceColor;
  inactiveColor?: ResourceColor;
}

// 底部导航组件
@Component
export struct BottomTabBar {
  @Prop currentIndex: number = 0;
  onTabClick?: (index: number) => void;

  // 固定的导航项目，按照原型图设计
  private tabs: TabItem[] = [
    { icon: '🏠', text: '首页' },
    { icon: '🏘️', text: '社区' },
    { icon: '💬', text: '消息' },
    { icon: '👤', text: '我的' }
  ];

  build() {
    Row() {
      ForEach(this.tabs, (tab: TabItem, index: number) => {
        Column() {
          Text(tab.icon)
            .fontSize(20)
            .fontColor(index === this.currentIndex ? '#667eea' : '#999999')
          
          Text(tab.text)
            .fontSize(12)
            .fontColor(index === this.currentIndex ? '#667eea' : '#999999')
            .margin({ top: 4 })
        }
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
        .alignItems(HorizontalAlign.Center)
        .padding({ top: 8, bottom: 8 })
        .onClick(() => {
          if (this.onTabClick) {
            this.onTabClick(index);
          }
        })
      })
    }
    .width('100%')
    .height(70)
    .backgroundColor(Color.White)
    .border({ width: { top: 1 }, color: '#e0e0e0' })
    .justifyContent(FlexAlign.SpaceAround)
    .alignItems(VerticalAlign.Center)
  }
}

// 图片上传组件
@Component
export struct ImageUploader {
  @Prop maxCount: number = 3;
  @Prop imageSize: number = 80;
  @State selectedImages: string[] = [];
  onImagesChange?: (images: string[]) => void;

  build() {
    Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Start }) {
      // 已选择的图片
      ForEach(this.selectedImages, (image: string, index: number) => {
        Stack() {
          Column()
            .width(this.imageSize)
            .height(this.imageSize)
            .borderRadius(8)
            .backgroundColor('#f0f0f0')
            .border({ width: 1, color: '#e0e0e0' })
          
          Text('🖼️')
            .fontSize(24)
            .fontColor('#999999')
          
          // 删除按钮
          Text('×')
            .fontSize(16)
            .fontColor(Color.White)
            .backgroundColor('#ff4757')
            .borderRadius(10)
            .width(20)
            .height(20)
            .textAlign(TextAlign.Center)
            .position({ x: this.imageSize - 15, y: -5 })
            .onClick(() => {
              this.selectedImages.splice(index, 1);
              if (this.onImagesChange) {
                this.onImagesChange(this.selectedImages);
              }
            })
        }
        .margin({ right: 10, bottom: 10 })
      })
      
      // 添加图片按钮
      if (this.selectedImages.length < this.maxCount) {
        Stack() {
          Column()
            .width(this.imageSize)
            .height(this.imageSize)
            .borderRadius(8)
            .backgroundColor('#f8f9fa')
            .border({ width: 2, color: '#e0e0e0', style: BorderStyle.Dashed })
          
          Column() {
            Text('📷')
              .fontSize(20)
              .fontColor('#999999')
            Text('添加')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ top: 4 })
          }
        }
        .onClick(() => {
          this.selectedImages.push(`image_${this.selectedImages.length + 1}`);
          if (this.onImagesChange) {
            this.onImagesChange(this.selectedImages);
          }
        })
      }
    }
    .width('100%')
  }
}