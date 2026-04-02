// 项目作者：杨钰然
import { router } from '@kit.ArkUI';
import { HeaderBar } from '../components/CommonComponents';
import { ItemData } from "../po/ItemData"
import { CommentData } from "../po/CommentData"
import { HttpUtils } from '../utils/HttpUtils';
import { ApiResponse, CreateClaimRequest, CreateCommentRequest, ApiItemData, ApiCommentData } from '../po/CommonTypes';
import { LostItem } from '../po/LostItem';
import { API_BASE_URL } from '../utils/Common';


@Entry
@Component
struct DetailPage {
  // 检查网络连接
  private checkNetworkConnection(): void {
    console.log('检查网络连接状态...');
    // 这里可以添加网络连接检查的代码
    // 例如使用网络状态API检查当前网络是否可用
  }
  
  // 物品ID，从路由参数获取
  private postId: string = '';
  
  @State itemData: ItemData = {
    id: '',
    title: '',
    category: '',
    location: '',
    time: '',
    description: '',
    contactInfo: '',
    images: [],
    type: '寻物',
    publisher: '',
    status: '寻找中'
  };
  
  // 评论相关状态
  @State comments: CommentData[] = [];
  @State newComment: string = '';
  @State isCommentFocused: boolean = false;
  
  // 认领弹窗相关状态
  @State showClaimDialog: boolean = false;
  @State claimPhoneNumber: string = '';
  
  // 加载状态
  @State isLoading: boolean = false;
  @State errorMessage: string = '';

  // 页面初始化时获取数据
  aboutToAppear(): void {
    // 从路由参数获取物品ID和可能的本地数据
    const params = router.getParams();
    if (params && Reflect.get(params, 'postId')) {
      this.postId = Reflect.get(params, 'postId') as string;
      console.log(`页面初始化，获取到postId: ${this.postId}`);
      
      // 检查是否有本地帖子数据传递过来
      if (params && Reflect.get(params, 'localPostData')) {
        try {
          const localData : LostItem = JSON.parse(Reflect.get(params, 'localPostData') as string);
          this.loadLocalPostData(localData);
          console.log('使用本地帖子数据，不加载评论');
          // 本地帖子不加载评论，保持comments为空数组
        } catch (error) {
          console.error('解析本地帖子数据失败:', error);
          // 解析失败时仍尝试从API获取
          this.checkNetworkConnection();
          this.getItemDetail();
          this.getCommentList();
        }
      } else {
        // 没有本地数据，从API获取
        this.checkNetworkConnection();
        this.getItemDetail();
        this.getCommentList();
      }
    } else {
      this.errorMessage = '未找到物品ID';
      console.error('未找到物品ID');
    }
  }
  
  // 加载本地帖子数据
  loadLocalPostData(localData: LostItem): void {
    try {
      this.itemData = {
        id: localData.id || '',
        title: localData.title || '',
        category: localData.category || '其他',
        location: localData.location || '',
        time: localData.time || '',
        description: localData.description || '暂无描述',
        contactInfo: localData.contactInfo || '暂无联系方式',
        images: localData.images && localData.images.length > 0 ? localData.images : ['📱'],
        type: localData.type || '寻物',
        publisher: localData.publisher || '我',
        status: localData.status || '寻找中'
      };
      console.log('成功加载本地帖子数据:', this.itemData.title);
    } catch (error) {
      console.error('加载本地帖子数据失败:', error);
      this.errorMessage = '加载帖子数据失败';
    }
  }

  // 获取物品详情
  async getItemDetail(): Promise<void> {
    if (!this.postId) {
      console.error('getItemDetail: postId为空，无法获取物品详情');
      return;
    }
    
    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      const url = `${API_BASE_URL}/api/post/detail?postId=${this.postId}`;
      console.log(`开始获取物品详情，postId: ${this.postId}`);
      const response = await HttpUtils.get(url);
      console.log(`物品详情API响应: ${response}`);
      
      try {
        const apiResponse: ApiResponse<ApiItemData> = JSON.parse(response);
        console.log(`解析后的物品详情数据: ${JSON.stringify(apiResponse)}`);
        
        if (apiResponse.code === 200 && apiResponse.data) {
          const postData = apiResponse.data;
          console.log(`物品详情数据: ${JSON.stringify(postData)}`);
          
          // 将API返回的数据映射到ItemData结构
          // 从描述中提取关键词，匹配到预定义的分类
          let category = '其他';
          const description = postData.category || '';
          if (description.includes('手机')) {
            category = '手机';
          } else if (description.includes('钱包')) {
            category = '钱包';
          } else if (description.includes('钥匙')) {
            category = '钥匙';
          } else if (description.includes('身份证')) {
            category = '身份证';
          } else if (description.includes('书包')) {
            category = '书包';
          }
          
          this.itemData = {
            id: postData.postId || '',
            title: postData.itemName || '',
            category: category,
            location: postData.lostLocation || '',
            time: postData.lostTime || '',
            description: postData.itemDescription || '',
            contactInfo: postData.contact ? `联系电话：${postData.contact}` : '暂无联系方式',
            images: postData.images ? [postData.images].flat() : ['📱'],
            type: postData.postType === '寻主' ? '寻主' : '寻物',
            publisher: postData.publisherId || '匿名用户',
            status: postData.status === '已找到' ? '已找到' : '寻找中'
          };
          
          console.log('获取物品详情成功:', this.itemData.title);
        } else {
          this.errorMessage = apiResponse.message || '获取物品详情失败';
          console.error(`获取物品详情失败: code=${apiResponse.code}, message=${apiResponse.message}`);
        }
      } catch (parseError) {
        console.error(`解析物品详情JSON失败: ${parseError}`);
        this.errorMessage = '解析响应数据失败';
      }
    } catch (error) {
      this.errorMessage = '网络请求失败';
      console.error(`获取物品详情异常: ${error}`);
    } finally {
      this.isLoading = false;
    }
  }
  
  // 获取评论列表
  async getCommentList(): Promise<void> {
    if (!this.postId) {
      console.error('getCommentList: postId为空，无法获取评论列表');
      return;
    }
    
    try {
      console.log(`开始获取评论列表，postId: ${this.postId}`);
      const url = `${API_BASE_URL}/api/comment/list?postId=${this.postId}`;
      const response = await HttpUtils.get(url);
      console.log(`评论列表API响应: ${response}`);
      
      try {
        const apiResponse: ApiResponse<ApiCommentData[]> = JSON.parse(response);
        console.log(`解析后的评论列表数据: ${JSON.stringify(apiResponse)}`);
        
        if (apiResponse.code === 200 && apiResponse.data) {
          // 将API返回的评论数据映射到CommentData结构
          this.comments = apiResponse.data.map((comment: ApiCommentData): CommentData => {
            return {
              id: comment.commentId || '',
              userName: comment.commenterName || '',
              content: comment.content || '',
              time: comment.createTime || '',
              avatar: comment.commenterAvatar || '',
              postId: this.postId
            };
          });
          
          console.log(`获取评论列表成功, 共 ${this.comments.length} 条评论`);
          console.log(`评论数据: ${JSON.stringify(this.comments)}`);
        } else {
          console.error(`获取评论列表失败: code=${apiResponse.code}, message=${apiResponse.message}`);
        }
      } catch (parseError) {
        console.error(`解析评论列表JSON失败: ${parseError}`);
      }
    } catch (error) {
      console.error(`获取评论列表异常: ${error}`);
    }
  }
  
  // 发送评论方法
  async sendComment(): Promise<void> {
    if (this.newComment.trim().length === 0) {
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/api/comment/create`;
      const commentData : CreateCommentRequest = {
        content: this.newComment.trim(),
        postId: this.postId,
        images: [],
        commenterId: 'user_12651', // 当前用户ID
        id: '' // 评论ID由服务器生成
      };
      
      const response = await HttpUtils.post(url, commentData);
      const apiResponse: ApiResponse<ApiCommentData> = JSON.parse(response);
      
      if (apiResponse.code === 200 && apiResponse.data) {
        // 创建新评论
        // 创建符合CommentData接口的对象
        const newCommentData: CommentData = {
          id: apiResponse.data.commentId || '',
          userName: '我', // 当前用户名
          content: this.newComment.trim(),
          time: apiResponse.data.createTime || new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(/\//g, '-'),
          avatar: 'https://dummyimage.com/600x600/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B', // 可选，设置默认头像
          postId: this.postId
        };
        
        // 添加到评论列表
        this.comments.push(newCommentData);
        
        // 清空输入框
        this.newComment = '';
        
        console.log('发表评论成功:', newCommentData.content);
      } else {
        console.error('发表评论失败:', apiResponse.message);
      }
    } catch (error) {
      console.error('发表评论异常:', error);
    }
  }

  // 获取状态文本
  getStatusText(): string {
    const status = this.itemData.status || 'searching'; // 默认为寻找中
    if (this.itemData.type === '寻物') {
      return status === '已找到' ? '已找到' : '寻找中';
    } else {
      return status === '已找到' ? '已认领' : '待认领';
    }
  }

  // 获取状态颜色
  getStatusColor(): string {
    const status = this.itemData.status || 'searching'; // 默认为寻找中
    return status === '已找到' ? '#51cf66' : '#ff9500';
  }

  build() {
    Column() {
      // 头部导航 - 使用CommonComponents
      HeaderBar({
        title: '物品详情',
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
          // 图片展示区域
          if (this.itemData.images.length > 0) {
            Row() {
              ForEach(this.itemData.images, (image: string) => {
                Image(image)
                  .width(100)
                  .height(100)
                  .borderRadius(8)
                  .objectFit(ImageFit.Cover)
                  .backgroundColor($r('sys.color.glass_material_outline_secondary'))
                  .alt('📱')
                  .onError(() => {
                    console.error('图片加载失败:', image);
                  })
                  .margin({ right: 10 })
              })
            }
            .width('100%')
            .margin({ bottom: 20 })
          }

          // 基本信息卡片
          Column() {
            // 标题和状态
            Row() {
              Text(this.itemData.title)
                .fontSize(20)
                .fontWeight(FontWeight.Bold)
                .fontColor('#333333')
                .layoutWeight(1)
              
              Text(this.itemData.type === '寻物' ? '寻物启事' : '失物招领')
                .fontSize(14)
                .fontColor(Color.White)
                .backgroundColor(this.itemData.type === '寻物' ? '#ff6b6b' : '#51cf66')
                .borderRadius(12)
                .padding({ left: 10, right: 10, top: 4, bottom: 4 })
            }
            .width('100%')
            .margin({ bottom: 15 })

            // 详细信息
            Column() {
              Row() {
                Text('分类：')
                  .fontSize(16)
                  .fontColor('#666666')
                  .width(80)
                Text(this.itemData.category)
                  .fontSize(16)
                  .fontColor('#333333')
                  .layoutWeight(1)
              }
              .width('100%')
              .margin({ bottom: 12 })

              Row() {
                Text('地点：')
                  .fontSize(16)
                  .fontColor('#666666')
                  .width(80)
                Text(this.itemData.location)
                  .fontSize(16)
                  .fontColor('#333333')
                  .layoutWeight(1)
              }
              .width('100%')
              .margin({ bottom: 12 })

              Row() {
                Text('时间：')
                  .fontSize(16)
                  .fontColor('#666666')
                  .width(80)
                Text(this.itemData.time)
                  .fontSize(16)
                  .fontColor('#333333')
                  .layoutWeight(1)
              }
              .width('100%')
              .margin({ bottom: 12 })

              Row() {
                Text('发布者：')
                  .fontSize(16)
                  .fontColor('#666666')
                  .width(80)
                Text(this.itemData.publisher)
                  .fontSize(16)
                  .fontColor('#333333')
                  .layoutWeight(1)
              }
              .width('100%')
            }
          }
          .width('100%')
          .padding(20)
          .backgroundColor(Color.White)
          .borderRadius(12)
          .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })
          .margin({ bottom: 20 })

          // 详细描述卡片
          Column() {
            Text('详细描述')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor('#333333')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 15 })
            
            Text(this.itemData.description)
              .fontSize(16)
              .fontColor('#666666')
              .lineHeight(24)
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 15 })

            // 状态标记
            Row() {
              Text(this.getStatusText())
                .fontSize(14)
                .fontColor(Color.White)
                .backgroundColor(this.getStatusColor())
                .borderRadius(15)
                .padding({ left: 12, right: 12, top: 6, bottom: 6 })
              
              Blank()
            }
            .width('100%')
          }
          .width('100%')
          .padding(20)
          .backgroundColor(Color.White)
          .borderRadius(12)
          .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })
          .margin({ bottom: 20 })

          // 联系方式卡片
          Column() {
            Text('联系方式')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor('#333333')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 15 })
            
            Text(this.itemData.contactInfo)
              .fontSize(16)
              .fontColor('#666666')
              .alignSelf(ItemAlign.Start)
          }
          .width('100%')
          .padding(20)
          .backgroundColor(Color.White)
          .borderRadius(12)
          .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })
          .margin({ bottom: 20 })

          // 评论区域
          Column() {
            // 评论标题
            Row() {
              Text('评论')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .fontColor('#333333')
              
              Text(`(${this.comments.length})`)
                .fontSize(16)
                .fontColor('#999999')
                .margin({ left: 5 })
            }
            .width('100%')
            .margin({ bottom: 15 })
            
            // 评论列表
            if (this.comments.length > 0) {
              Column() {
                ForEach(this.comments, (comment: CommentData, index: number) => {
                  Column() {
                    // 评论头部信息
                    Row() {
                      // 用户头像
                      Text('用') // comment.avatar
                        .fontSize(12)
                        .fontColor(Color.White)
                        .width(32)
                        .height(32)
                        .borderRadius(18)
                        .backgroundColor('#667eea')
                        .textAlign(TextAlign.Center)
                      
                      Column() {
                        Text(comment.userName)
                          .fontSize(14)
                          .fontWeight(FontWeight.Medium)
                          .fontColor('#333333')
                          .alignSelf(ItemAlign.Start)
                        
                        Text(comment.time)
                          .fontSize(12)
                          .fontColor('#999999')
                          .alignSelf(ItemAlign.Start)
                          .margin({ top: 2 })
                      }
                      .alignItems(HorizontalAlign.Start)
                      .margin({ left: 10 })
                      .layoutWeight(1)
                    }
                    .width('100%')
                    .margin({ bottom: 10 })
                    
                    // 评论内容
                    Text(comment.content)
                      .fontSize(15)
                      .fontColor('#333333')
                      .lineHeight(22)
                      .alignSelf(ItemAlign.Start)
                      .margin({ left: 42 })
                  }
                  .width('100%')
                  .padding({ bottom: index < this.comments.length - 1 ? 15 : 0 })
                  .border({
                    width: { bottom: index < this.comments.length - 1 ? 1 : 0 },
                    color: '#f0f0f0'
                  })
                })
              }
              .width('100%')
              .margin({ bottom: 20 })
            } else {
              Text('暂无评论，快来发表第一条评论吧~')
                .fontSize(14)
                .fontColor('#999999')
                .textAlign(TextAlign.Center)
                .width('100%')
                .margin({ bottom: 20 })
            }
            
            // 评论输入区域
            Column() {
              Row() {
                TextInput({ placeholder: '写下你的评论...', text: this.newComment })
                  .layoutWeight(1)
                  .height(40)
                  .fontSize(14)
                  .backgroundColor('#f8f9fa')
                  .borderRadius(20)
                  .padding({ left: 15, right: 15 })
                  .border({ width: this.isCommentFocused ? 1 : 0, color: '#667eea' })
                  .onChange((value: string) => {
                    this.newComment = value;
                  })
                  .onFocus(() => {
                    this.isCommentFocused = true;
                  })
                  .onBlur(() => {
                    this.isCommentFocused = false;
                  })
                
                Button('发送')
                  .width(60)
                  .height(40)
                  .fontSize(14)
                  .fontColor(this.newComment.trim() ? Color.White : '#999999')
                  .backgroundColor(this.newComment.trim() ? '#667eea' : '#f0f0f0')
                  .borderRadius(20)
                  .margin({ left: 10 })
                  .enabled(this.newComment.trim().length > 0)
                  .onClick(() => {
                    this.sendComment();
                  })
              }
              .width('100%')
            }
            .width('100%')
          }
          .width('100%')
          .padding(20)
          .backgroundColor(Color.White)
          .borderRadius(12)
          .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })
          .margin({ bottom: 30 })
        }
        .width('100%')
        .padding(20)
      }
      .layoutWeight(1)
      .backgroundColor('#f8f9fa')

      // 底部操作栏
      Row() {
        Button('私信Ta')
          .width(80)
          .height(44)
          .fontSize(14)
          .fontColor('#666666')
          .backgroundColor($r('sys.color.glass_material_outline_secondary'))
          .borderRadius(8)
          .onClick(() => {
            router.pushUrl({
              url: 'pages/ChatPage',
              params: {
                contactName: this.itemData.publisher || '用户',
                contactAvatar: this.itemData.publisher ? this.itemData.publisher.charAt(0) : '用',
                otherUserId: this.itemData.publisher || 'unknown_user'
              }
            });
            console.log('私信详情页');
          })
        
        // 根据物品类型和状态显示不同的按钮文本和状态
        if (this.itemData.status === '已找到') {
          // 已找到/已认领状态
          Button('已找到')
            .layoutWeight(1)
            .height(44)
            .fontSize(16)
            .fontColor(Color.White)
            .backgroundColor('#51cf66')
            .borderRadius(8)
            .margin({ left: 15 })
            .enabled(false)
        } else {
          // 寻找中/待认领状态
          Button(this.itemData.type === '寻物' ? '确认找到' : '认领')
            .layoutWeight(1)
            .height(44)
            .fontSize(16)
            .fontColor(Color.White)
            .linearGradient({
              angle: 135,
              colors: [['#667eea', 0], ['#764ba2', 1]]
            })
            .borderRadius(8)
            .margin({ left: 15 })
            .onClick(() => {
              this.showClaimDialog = true;
            })
        }
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 15 })
      .backgroundColor(Color.White)
      .border({ width: { top: 1 }, color: '#e0e0e0' })
    }
    .width('100%')
    .height('100%')
    .bindContentCover(this.showClaimDialog, this.ClaimDialogBuilder(), {
      modalTransition: ModalTransition.NONE,
      backgroundColor: Color.Transparent,
      onAppear: () => {
        console.log('认领弹窗显示');
      },
      onDisappear: () => {
        console.log('认领弹窗隐藏');
        this.claimPhoneNumber = ''; // 清空输入
      }
    })
  }

  // 认领弹窗构建器
  @Builder
  ClaimDialogBuilder() {
    Column() {
      // 遮罩层
      Column()
        .width('100%')
        .height('100%')
        .backgroundColor('rgba(0, 0, 0, 0.5)')
        .onClick(() => {
          this.showClaimDialog = false;
        })
      
      // 弹窗内容
      Column() {
        // 弹窗标题 - 根据物品类型显示不同标题
        Text(this.itemData.type === '寻物' ? '确认找到物品' : '认领物品')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')
          .margin({ bottom: 20 })
        
        // 物品信息
        Text(this.itemData.type === '寻物' ? 
          `确认找到：${this.itemData.title}` : 
          `确认认领：${this.itemData.title}`)
          .fontSize(16)
          .fontColor('#666666')
          .margin({ bottom: 15 })
        
        // 手机号输入
        Column() {
          Text('请输入您的手机号码')
            .fontSize(14)
            .fontColor('#333333')
            .alignSelf(ItemAlign.Start)
            .margin({ bottom: 8 })
          
          TextInput({ 
            placeholder: '请输入11位手机号码', 
            text: this.claimPhoneNumber 
          })
            .width('100%')
            .height(44)
            .fontSize(16)
            .backgroundColor('#f8f9fa')
            .borderRadius(8)
            .padding({ left: 15, right: 15 })
            .border({ width: 1, color: '#e0e0e0' })
            .type(InputType.PhoneNumber)
            .maxLength(11)
            .onChange((value: string) => {
              this.claimPhoneNumber = value;
            })
        }
        .width('100%')
        .margin({ bottom: 25 })
        
        // 操作按钮
        Row() {
          Button('取消')
            .width(100)
            .height(40)
            .fontSize(16)
            .fontColor('#666666')
            .backgroundColor($r('sys.color.glass_material_outline_secondary'))
            .borderRadius(8)
            .onClick(() => {
              this.showClaimDialog = false;
            })
          
          Button(this.itemData.type === '寻物' ? '确认找到' : '确认认领')
            .width(120)
            .height(40)
            .fontSize(16)
            .fontColor(Color.White)
            .backgroundColor(this.isValidPhoneNumber() ? '#667eea' : '#cccccc')
            .borderRadius(8)
            .margin({ left: 15 })
            .enabled(this.isValidPhoneNumber())
            .onClick(() => {
              this.confirmClaim();
            })
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
      }
      .width('85%')
      .padding(25)
      .backgroundColor(Color.White)
      .borderRadius(12)
      .shadow({ radius: 8, color: '#00000020', offsetX: 0, offsetY: 4 })
      .position({ x: '50%', y: '50%' })
      .translate({ x: '-50%', y: '-50%' })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }

  // 验证手机号格式
  isValidPhoneNumber(): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(this.claimPhoneNumber);
  }

  // 确认认领
  async confirmClaim(): Promise<void> {
    if (!this.isValidPhoneNumber()) {
      console.log('手机号格式不正确');
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/api/claim/create`;
      const claimData : CreateClaimRequest = {
        claimerId: 'user_12345', // 假设当前用户ID
        postId: this.postId,
        claimerPhone: this.claimPhoneNumber
      };
      
      const response = await HttpUtils.post(url, claimData);
      const apiResponse: ApiResponse<CreateClaimRequest> = JSON.parse(response);
      
      if (apiResponse.code === 200) {
        // 更新物品状态为已找到
        this.itemData.status = '已找到';
        
        // 关闭弹窗
        this.showClaimDialog = false;
        
        console.log(`认领成功，手机号：${this.claimPhoneNumber}`);
        
        // 返回主页并传递状态更新信息
        router.back({
          url: 'pages/MainPage',
          params: {
            updatedPostId: this.postId,
            updatedStatus: '已找到'
          }
        });
      } else {
        console.error('认领失败:', apiResponse.message);
      }
    } catch (error) {
      console.error('认领请求异常:', error);
    }
  }
}