// 项目作者：杨钰然
import { router } from '@kit.ArkUI';
import { HeaderBar } from "../components/CommonComponents"
import { HttpUtils } from '../utils/HttpUtils';
import { ApiResponse, ApiItemData, PublishRequestData } from '../po/CommonTypes';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { LostItem } from '../po/LostItem';
import { API_BASE_URL, TimeUtils } from '../utils/Common';


@Entry
@Component
struct PublishPage {
  @State itemType: '寻物' | '寻主' = '寻物';
  @State title: string = '';
  @State category: string = '';
  @State location: string = '';
  @State description: string = '';
  @State contactInfo: string = '';
  @State images: string[] = [];
  @State selectedImageUris: string[] = []; // 存储选择的图片URI
  @State isLoading: boolean = false;
  @State errorMessage: string = '';
  @State lostTime: string = TimeUtils.getCurrentDateTime();
  private categories: string[] = ['数码产品', '证件卡类', '生活用品', '服饰配饰', '其他']; // 仅供展示，实际从后端获取
  
  // 输入验证错误状态
  @State titleError: string = '';
  @State categoryError: string = '';
  @State descriptionError: string = '';
  @State contactInfoError: string = '';
  @State lostTimeError: string = '';

  // 输入验证方法
  private validateTitle(value: string): void {
    if (!value.trim()) {
      this.titleError = '物品名称不能为空';
    } else if (value.trim().length > 30) {
      this.titleError = '物品名称不能超过30个字符';
    } else {
      this.titleError = '';
    }
  }
  
  private validateCategory(): void {
    if (!this.category) {
      this.categoryError = '请选择物品分类';
    } else {
      this.categoryError = '';
    }
  }
  
  private validateDescription(value: string): void {
    if (!value.trim()) {
      this.descriptionError = '详细描述不能为空';
    } else if (value.trim().length < 10) {
      this.descriptionError = '详细描述至少需要10个字符';
    } else if (value.trim().length > 500) {
      this.descriptionError = '详细描述不能超过500个字符';
    } else {
      this.descriptionError = '';
    }
  }
  
  private validateContactInfo(value: string): void {
    if (!value.trim()) {
      this.contactInfoError = '联系方式不能为空';
    } else if (value.trim().length < 5) {
      this.contactInfoError = '联系方式至少需要5个字符';
    } else if (value.trim().length > 20) {
      this.contactInfoError = '联系方式不能超过20个字符';
    } else {
      this.contactInfoError = '';
    }
  }
  
  private validateLostTime(value: string): void {
    if (!value.trim()) {
      this.lostTimeError = '时间不能为空';
    } else {
      this.lostTimeError = '';
    }
  }
  
  // 验证所有输入
  private validateAllInputs(): boolean {
    this.validateTitle(this.title);
    this.validateCategory();
    this.validateDescription(this.description);
    this.validateContactInfo(this.contactInfo);
    this.validateLostTime(this.lostTime);
    
    return !this.titleError && !this.categoryError && !this.descriptionError && 
           !this.contactInfoError && !this.lostTimeError;
  }

  build() {
    Column() {
      // 头部导航 - 使用CommonComponents
      HeaderBar({
        title: '发布求助',
        showBack: true,
        showAction: false,
        onBack: () => {
          router.back();
        }
      })
        .margin({ top: 0 })

      // 内容区域
      Scroll() {
        Column() {
          // 发布类型选择
          Row() {
            Button('寻物启事')
              .layoutWeight(1)
              .height(44)
              .fontSize(16)
.fontColor(this.itemType === '寻物' ? Color.White : '#666666')
.backgroundColor(this.itemType === '寻物' ? undefined : '#f0f0f0')
              .linearGradient(this.itemType === '寻物' ? {
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
              } : undefined)
              .borderRadius(8)
              .onClick(() => {
this.itemType = '寻物';
              })
            
            Button('失物招领')
              .layoutWeight(1)
              .height(44)
              .fontSize(16)
.fontColor(this.itemType === '寻主' ? Color.White : '#666666')
              .backgroundColor(this.itemType === '寻主' ? undefined : '#f0f0f0')
              .linearGradient(this.itemType === '寻主' ? {
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
              } : undefined)
              .borderRadius(8)
              .margin({ left: 10 })
              .onClick(() => {
this.itemType = '寻主';
              })
          }
          .width('100%')
          .margin({ bottom: 25 })

          // 物品标题
          Column() {
            Text('物品名称 *')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#333333')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            TextInput({ placeholder: '请输入物品名称' })
              .width('100%')
              .height(48)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: this.titleError ? '#ff4444' : '#e0e0e0' })
              .onChange((value: string) => {
                this.title = value;
                this.validateTitle(value);
              })
            
            if (this.titleError) {
              Text(this.titleError)
                .fontSize(12)
                .fontColor('#ff4444')
                .alignSelf(ItemAlign.Start)
                .margin({ top: 4 })
            }
          }
          .width('100%')
          .margin({ bottom: 20 })

          // 物品分类
          Column() {
            Text('物品分类 *')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#333333')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            // 分类选择
            Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Start }) {
              ForEach(this.categories, (category: string) => {
                Text(category)
                  .fontSize(14)
                  .fontColor(this.category === category ? Color.White : '#666666')
                  .backgroundColor(this.category === category ? undefined : '#f0f0f0')
                  .linearGradient(this.category === category ? {
                    angle: 135,
                    colors: [['#667eea', 0], ['#764ba2', 1]]
                  } : undefined)
                  .borderRadius(15)
                  .padding({ left: 15, right: 15, top: 8, bottom: 8 })
                  .margin({ right: 10, bottom: 10 })
                  .onClick(() => {
                    this.category = category;
                    this.validateCategory();
                  })
              })
            }
            .width('100%')
            
            if (this.categoryError) {
              Text(this.categoryError)
                .fontSize(12)
                .fontColor('#ff4444')
                .alignSelf(ItemAlign.Start)
                .margin({ top: 4 })
            }
          }
          .width('100%')
          .margin({ bottom: 20 })

          // 详细描述
          Column() {
            Text('详细描述 *')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#333333')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            TextArea({ placeholder: '请详细描述物品特征、丢失/拾得经过等信息...' })
              .width('100%')
              .height(100)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: this.descriptionError ? '#ff4444' : '#e0e0e0' })
              .onChange((value: string) => {
                this.description = value;
                this.validateDescription(value);
              })
            
            if (this.descriptionError) {
              Text(this.descriptionError)
                .fontSize(12)
                .fontColor('#ff4444')
                .alignSelf(ItemAlign.Start)
                .margin({ top: 4 })
            }
          }
          .width('100%')
          .margin({ bottom: 20 })

          // 地点信息
          Column() {
            Text('相关地点')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#333333')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
TextInput({ placeholder: this.itemType === '寻物' ? '请输入丢失地点' : '请输入拾得地点' })
              .width('100%')
              .height(48)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: '#e0e0e0' })
              .onChange((value: string) => {
                this.location = value;
              })
          }
          .width('100%')
          .margin({ bottom: 20 })

          // 联系方式
          Column() {
            Text('联系方式 *')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#333333')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            TextInput({ placeholder: '请输入联系电话或微信号' })
              .width('100%')
              .height(48)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: this.contactInfoError ? '#ff4444' : '#e0e0e0' })
              .onChange((value: string) => {
                this.contactInfo = value;
                this.validateContactInfo(value);
              })
            
            if (this.contactInfoError) {
              Text(this.contactInfoError)
                .fontSize(12)
                .fontColor('#ff4444')
                .alignSelf(ItemAlign.Start)
                .margin({ top: 4 })
            }
          }
          .width('100%')
          .margin({ bottom: 20 })

          // 图片上传
          Column() {
            Text('上传图片')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#333333')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            Text('最多可上传3张图片')
              .fontSize(12)
              .fontColor('#999999')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 12 })
            
            // 图片上传区域
            Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Start }) {
              // 已选择的图片
ForEach(this.images, (imageUri: string, index: number) => {
                Stack() {
                  Image(imageUri)
                    .width(80)
                    .height(80)
                    .borderRadius(8)
                    .objectFit(ImageFit.Cover)
                    .border({ width: 1, color: '#e0e0e0' })
                    .alt('https://dummyimage.com/600x600/f0f0f0/999999.png&text=图片')
                  
                  // 删除按钮
                  Text('×')
                    .fontSize(16)
                    .fontColor(Color.White)
                    .backgroundColor('#ff4757')
                    .borderRadius(10)
                    .width(20)
                    .height(20)
                    .textAlign(TextAlign.Center)
                    .position({ x: 65, y: -5 })
                    .onClick(() => {
                      this.images.splice(index, 1);
                      this.selectedImageUris.splice(index, 1);
                    })
                }
                .margin({ right: 10, bottom: 10 })
              })
              
              // 添加图片按钮
if (this.images.length < 3) {
                Stack() {
                  Column()
                    .width(80)
                    .height(80)
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
                .onClick(async () => {
                  await this.selectPhotos();
                })
              }
            }
            .width('100%')
          }
          .width('100%')
          .margin({ bottom: 30 })

          // 时间选择
          Column() {
            Text('丢失/拾得时间 *')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#333333')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            TextInput({ placeholder: '请输入时间', text: this.lostTime })
              .width('100%')
              .height(48)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: this.lostTimeError ? '#ff4444' : '#e0e0e0' })
              .onChange((value: string) => {
                this.lostTime = value;
                this.validateLostTime(value);
              })
            
            if (this.lostTimeError) {
              Text(this.lostTimeError)
                .fontSize(12)
                .fontColor('#ff4444')
                .alignSelf(ItemAlign.Start)
                .margin({ top: 4 })
            }
          }
          .width('100%')
          .margin({ bottom: 20 })
          
          // 错误信息显示
          if (this.errorMessage) {
            Text(this.errorMessage)
              .fontSize(14)
              .fontColor('#ff4444')
              .width('100%')
              .margin({ bottom: 16 })
          }
          
          // 发布按钮
          Button(
            this.itemType === '寻物' ? '发布寻物启事' : '发布招领信息'
          )
            .width('100%')
            .height(50)
            .fontSize(16)
            .fontColor(Color.White)
            .linearGradient({
              angle: 135,
              colors: [['#667eea', 0], ['#764ba2', 1]]
            })
            .borderRadius(8)
            .enabled(!this.titleError && !this.categoryError && !this.descriptionError && 
                     !this.contactInfoError && !this.lostTimeError && 
                     !!this.title.trim() && !!this.category && !!this.description.trim() &&
                     !!this.contactInfo.trim() && !!this.lostTime.trim())
            .opacity((!this.titleError && !this.categoryError && !this.descriptionError && 
                      !this.contactInfoError && !this.lostTimeError && 
                      this.title.trim() && this.category && this.description.trim() && 
                      this.contactInfo.trim() && this.lostTime.trim()) ? 1.0 : 0.6)
            .onClick(async () => {
              // 表单验证
              if (!this.validateAllInputs()) {
                return;
              }
              
              // 清除错误信息并设置加载状态
              this.errorMessage = '';
              this.isLoading = true;
              
              try {
                // 构建请求数据
                const requestData: PublishRequestData = {
                  itemName: this.title.trim(),
                  itemDescription: this.description.trim(),
                  images: this.images,
                  postType: this.itemType,
                  lostTime: this.lostTime.trim(),
                  lostLocation: this.location.trim(),
                  contact: this.contactInfo.trim(),
                  publisherId: 'user_12345', // 默认值，实际从用户登录状态获取
                  communityId: 'comm_12345', // 默认值，实际从当前选择的社区获取
                };
                
                // 如果是寻主类型，添加暂存地点
                if (this.itemType === '寻主') {
                  requestData.storageLocation = this.location.trim();
                }
                
                // 发送API请求
                const url = `${API_BASE_URL}/api/post/create`;
                const response = await HttpUtils.post(url, requestData);
                const apiResponse: ApiResponse<ApiItemData> = JSON.parse(response);
                
                if (apiResponse.code === 200 && apiResponse.data) {
                  console.log('发布成功:', apiResponse.data);
                  
                  // 构造新发布的帖子信息
                  const newPost: LostItem = {
                    id: apiResponse.data.postId || `local_${Date.now()}`, // 使用API返回的ID或生成本地ID
                    title: this.title.trim(),
                    category: this.category,
                    location: this.location.trim(),
                    time: TimeUtils.formatTime(this.lostTime.trim()),
                    originalTimestamp: new Date(this.lostTime.trim()).getTime(),
                    image: this.images.length > 0 ? this.images[0] : 'https://dummyimage.com/600x600/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B',
                    type: this.itemType,
                    status: '寻找中',
                    // 添加详细信息用于详情页显示
                    description: this.description,
                    contactInfo: this.contactInfo,
                    images: this.images.length > 0 ? this.images : ['https://dummyimage.com/600x600/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B'],
                    publisher: '我'
                  };
                  
                  // 发布成功后，返回主页并传递新帖子信息
                  router.replaceUrl({ 
                    url: 'pages/MainPage',
                    params: {
                      newPost: JSON.stringify(newPost) // 传递新发布的帖子信息
                    }
                  });
                } else {
                  this.errorMessage = apiResponse.message || '发布失败，请重试';
                }
              } catch (error) {
                this.errorMessage = '网络请求失败，请重试';
                console.error('发布失败:', error);
              } finally {
                this.isLoading = false;
              }
            })
        }
        .width('100%')
        .padding(20)
      }
      .layoutWeight(1)
      .backgroundColor('#f8f9fa')
    }
    .width('100%')
    .height('100%')
  }

  // 验证表单
   private validateForm(): boolean {
     if (!this.title.trim()) {
       this.errorMessage = '请输入物品名称';
       return false;
     }
     if (!this.category) {
       this.errorMessage = '请选择物品分类';
       return false;
     }
     if (!this.description.trim()) {
       this.errorMessage = '请输入详细描述';
       return false;
     }
     // 丢失地点为非必填项
     // if (!this.location.trim()) {
     //   this.errorMessage = '请输入相关地点';
     //   return false;
     // }
     if (!this.contactInfo.trim()) {
       this.errorMessage = '请输入联系方式';
       return false;
     }
     if (!this.lostTime.trim()) {
       this.errorMessage = '请输入时间';
       return false;
     }
     // 图片为非必须项
     // if (this.images.length === 0) {
     //   this.errorMessage = '请至少上传一张图片';
     //   return false;
     // }
     return true;
   }

  // 选择照片
  private async selectPhotos(): Promise<void> {
    try {
      const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
      photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
      photoSelectOptions.maxSelectNumber = 3;
      
      const photoViewPicker = new photoAccessHelper.PhotoViewPicker();
      const photoSelectResult = await photoViewPicker.select(photoSelectOptions);
      
      if (photoSelectResult && photoSelectResult.photoUris && photoSelectResult.photoUris.length > 0) {
        this.selectedImageUris = photoSelectResult.photoUris;
        this.images = photoSelectResult.photoUris; // 暂时使用URI作为图片路径
        console.info('选择照片成功，数量:', this.images.length);
      }
    } catch (error) {
      console.error('选择照片失败:', error);
      this.errorMessage = '选择照片失败，请重试';
    }
  }
}
