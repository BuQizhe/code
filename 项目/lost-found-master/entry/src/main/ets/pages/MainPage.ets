// 项目作者：杨钰然
import { router } from '@kit.ArkUI';
import { LostItem } from "../po/LostItem"
import { HeaderBar, BottomTabBar, StatusTag, CardContainer, NavigationUtils } from "../components/CommonComponents"
import { HttpUtils } from '../utils/HttpUtils';
import { ApiResponse } from '../po/CommonTypes';
import { PostCommunityInfo, PostInfo, SearchResponse } from '../po/MainInfo';
import { API_BASE_URL } from '../utils/Common';

@Entry
@Component
struct MainPage {
  @State searchText: string = '';
  @State selectedFilter: string = '寻物';
  private filterTabs: string[] = ['寻物', '寻主', '已找到'];
  @State showCommunityDropdown: boolean = false;
  @State selectedCommunity: string = '全部社区';
  @State selectedCommunityId: string = 'comm_12345';
  @State communities: PostCommunityInfo[] = [];
  @State isLoading: boolean = false;
  @State errorMessage: string = '';

  // 数据状态
  @State lostItems: LostItem[] = [];

  // 本地新发布的帖子列表（用于防止数据被mock响应覆盖问题）
  private localPublishedPosts: LostItem[] = [];

  // 获取社区列表
  async getCommunityList(): Promise<void> {
    try {
      this.isLoading = true;
      const url = `${API_BASE_URL}/api/community/my-communities`;
      const response = await HttpUtils.get(url);
      const apiResponse: ApiResponse<PostCommunityInfo[]> = JSON.parse(response);

      if (apiResponse.code === 200 && apiResponse.data) {
        this.communities = apiResponse.data;
        if (this.communities.length > 0) {
          // 保持默认显示'全部社区'，但使用第一个社区的ID获取数据
          this.selectedCommunityId = this.communities[0].communityId;
          // 获取社区列表后，自动获取第一个社区的发布信息
          await this.getPostList();
        }
      } else {
        this.errorMessage = apiResponse.message || '获取社区列表失败';
      }
    } catch (error) {
      this.errorMessage = '网络请求失败';
      console.error('获取社区列表失败:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // 获取发布信息列表
  async getPostList(): Promise<void> {
    try {
      this.isLoading = true;
      const url = `${API_BASE_URL}/api/post/community-list?communityId=${this.selectedCommunityId}`;

      const response = await HttpUtils.get(url);
      const apiResponse: ApiResponse<PostInfo[]> = JSON.parse(response);

      if (apiResponse.code === 200 && apiResponse.data) {
        // 将PostInfo转换为LostItem格式
         const apiPosts = apiResponse.data.map((post: PostInfo): LostItem => {
           const originalTime = post.lostTime || post.publishTime || '';
           return {
             id: post.postId,
             title: post.itemName,
             category: post.itemDescription || '其他',
             location: post.lostLocation,
             time: this.formatTime(originalTime),
             originalTimestamp: originalTime ? new Date(originalTime).getTime() : 0,
             image: post.images && post.images.length > 0 ? post.images[0] : 'https://dummyimage.com/600x600/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B',
             type: post.postType === '寻物' ? '寻物' : '寻主',
             status: post.status === '已找到' ? '已找到' : '寻找中'
           };
         });

         // 合并本地发布的帖子和API数据
         // 过滤掉API中已存在的本地帖子（避免重复）
         const filteredLocalPosts = this.localPublishedPosts.filter(localPost =>
           !apiPosts.some(apiPost => apiPost.id === localPost.id)
         );

         // 将本地发布的帖子放在前面，API数据放在后面
         this.lostItems = [...filteredLocalPosts, ...apiPosts];
      } else {
        this.errorMessage = apiResponse.message || '获取发布信息失败';
      }
    } catch (error) {
      this.errorMessage = '网络请求失败';
      console.error('获取发布信息失败:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // 搜索功能
  async searchPosts(): Promise<void> {
    if (!this.searchText.trim()) {
      // 如果搜索框为空，重新获取当前社区的所有发布信息
      await this.getPostList();
      return;
    }

    try {
      this.isLoading = true;
      const url = `${API_BASE_URL}/api/post/search?communityId=${this.selectedCommunityId}&keyword=${encodeURIComponent(this.searchText.trim())}`;

      const response = await HttpUtils.get(url);
      const apiResponse: ApiResponse<SearchResponse> = JSON.parse(response);

      if (apiResponse.code === 200 && apiResponse.data) {
        // 将搜索结果转换为LostItem格式
         this.lostItems = apiResponse.data.searchResults.map((post: PostInfo): LostItem => {
           const originalTime = post.lostTime || post.publishTime || '';
           return {
             id: post.postId,
             title: post.itemName,
             category: post.itemDescription || '其他',
             location: post.lostLocation,
             time: this.formatTime(originalTime),
             originalTimestamp: originalTime ? new Date(originalTime).getTime() : 0,
             image: post.images && post.images.length > 0 ? post.images[0] : 'https://dummyimage.com/600x600/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B',
             type: post.postType === '寻物' ? '寻物' : '寻主',
             status: post.status === '已找到' ? '已找到' : '寻找中'
           };
         });
      } else {
        this.errorMessage = apiResponse.message || '搜索失败';
      }
    } catch (error) {
      this.errorMessage = '搜索请求失败';
      console.error('搜索失败:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // 格式化时间显示
  private formatTime(timeStr: string): string {
    if (!timeStr) return '时间未知';

    try {
      const date = new Date(timeStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffDays > 7) {
        // 超过7天显示具体日期
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      } else if (diffDays > 0) {
        return `${diffDays}天前`;
      } else if (diffHours > 0) {
        return `${diffHours}小时前`;
      } else if (diffMinutes > 0) {
        return `${diffMinutes}分钟前`;
      } else {
        return '刚刚';
      }
    } catch (error) {
      // 如果时间格式无法解析，直接返回原字符串
      return timeStr;
    }
  }

  // 页面初始化
  async aboutToAppear(): Promise<void> {
    await this.getCommunityList();
    // getCommunityList中已经会自动调用getPostList，无需重复调用
  }

  // 页面重新显示时检查是否需要刷新
  onPageShow(): void {
    const params = router.getParams();
    if (params && Reflect.get(params, 'refreshList')) {
      console.log('检测到刷新标志，重新获取列表');
      // 先清除参数，避免无限循环
      router.replaceUrl({ url: 'pages/MainPage' });
      // 延迟执行刷新，确保页面参数已清除
      setTimeout(() => {
        this.getPostList();
      }, 100);
    }

    // 检查是否有新发布的帖子信息传递过来
    if (params && Reflect.get(params, 'newPost')) {
      try {
        const newPost: LostItem = JSON.parse(Reflect.get(params, 'newPost') as string);
        this.addLocalPost(newPost);
      } catch (error) {
        console.error('解析新发布帖子信息失败:', error);
      }
    }

    // 检查是否有帖子状态更新
    if (params && Reflect.get(params, 'updatedPostId') && Reflect.get(params, 'updatedStatus')) {
      const postId = Reflect.get(params, 'updatedPostId') as string;
      const newStatus = Reflect.get(params, 'updatedStatus') as "已找到" | "寻找中";
      this.updatePostStatus(postId, newStatus);
      console.log(`更新帖子状态: ${postId} -> ${newStatus}`);
      // 清除参数
      router.replaceUrl({ url: 'pages/MainPage' });
    }
  }

  // 添加新发布的帖子到本地列表
  addLocalPost(post: LostItem): void {
    // 检查本地列表和当前显示列表中是否已存在，避免重复添加
    const existsInLocal = this.localPublishedPosts.some(local => local.id === post.id);
    const existsInCurrent = this.lostItems.some(current => current.id === post.id);

    if (!existsInLocal && !existsInCurrent) {
      this.localPublishedPosts.push(post);
      // 立即更新显示的帖子列表，将新帖子放在最前面
      this.lostItems = [post, ...this.lostItems];
      console.log('成功添加新发布的帖子:', post.title);
    } else {
      console.log('帖子已存在，跳过添加:', post.title);
    }
  }

  // 更新帖子状态
  updatePostStatus(postId: string, newStatus: "已找到" | "寻找中"): void {
    // 更新本地发布的帖子状态
    const localPostIndex = this.localPublishedPosts.findIndex(post => post.id === postId);
    if (localPostIndex !== -1) {
      this.localPublishedPosts[localPostIndex].status = newStatus;
    }

    // 更新当前显示列表中的帖子状态
    const currentPostIndex = this.lostItems.findIndex(post => post.id === postId);
    if (currentPostIndex !== -1) {
      this.lostItems[currentPostIndex].status = newStatus;
    }

    console.log(`帖子状态已更新: ${postId} -> ${newStatus}`);
  }

  // 获取状态文本
  getStatusText(item: LostItem): string {
    if (item.status === '已找到') {
      return '已找到';
    } else {
      return item.type === '寻物' ? '寻物' : '寻主';
    }
  }

  // 获取状态文字颜色
  getStatusColor(item: LostItem): string {
    if (item.status === '已找到') {
      return '#155724';
    } else {
      return '#856404';
    }
  }

  // 获取状态背景颜色
  getStatusBackgroundColor(item: LostItem): string {
    if (item.status === '已找到') {
      return '#d4edda';
    } else {
      return '#fff3cd';
    }
  }

  build() {
    Column() {
      // 头部导航 - 使用CommonComponents
      HeaderBar({
        title: '失物招领',
        showBack: false,
        showAction: true,
        actionText: '👤',
        onAction: () => {
          router.pushUrl({ url: 'pages/ProfilePage' });
        }
      })
      .margin({ top: 0 })

      // 内容区域
      Column() {
        // 社区选择器
        Column() {
          Row() {
            Column() {
              Text('筛选社区')
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .fontColor('#333333')
                .alignSelf(ItemAlign.Start)
              Text(this.selectedCommunity)
                .fontSize(12)
                .fontColor('#666666')
                .margin({ top: 2 })
                .alignSelf(ItemAlign.Start)
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)

            Text(this.showCommunityDropdown ? '▲' : '▼')
              .fontSize(14)
              .fontColor('#666666')
          }
          .width('100%')
          .padding(12)
          .backgroundColor(Color.White)
          .borderRadius(8)
          .border({ width: 1, color: '#e0e0e0' })
          .onClick(() => {
            this.showCommunityDropdown = !this.showCommunityDropdown;
          })

          // 下拉列表
          if (this.showCommunityDropdown) {
            Column() {
              // 全部社区选项
              Row() {
                Text('全部社区')
                  .fontSize(14)
                  .fontColor('#333333')
                  .layoutWeight(1)

                if (this.selectedCommunity === '全部社区') {
                  Text('✓')
                    .fontSize(14)
                    .fontColor('#667eea')
                }
              }
              .width('100%')
              .padding({ left: 12, right: 12, top: 10, bottom: 10 })
              .backgroundColor(Color.White)
              .onClick(async () => {
                this.selectedCommunity = '全部社区';
                if (this.communities.length > 0) {
                  this.selectedCommunityId = this.communities[0].communityId;
                }
                this.showCommunityDropdown = false;
                // 切换到全部社区后重新获取发布信息
                await this.getPostList();
              })

              if (this.communities.length > 0) {
                Divider()
                  .color('#f0f0f0')
                  .strokeWidth(1)
              }

              ForEach(this.communities, (community: PostCommunityInfo, index: number) => {
                Row() {
                  Text(community.communityName)
                    .fontSize(14)
                    .fontColor('#333333')
                    .layoutWeight(1)

                  if (community.communityName === this.selectedCommunity) {
                    Text('✓')
                      .fontSize(14)
                      .fontColor('#667eea')
                  }
                }
                .width('100%')
                .padding({ left: 12, right: 12, top: 10, bottom: 10 })
                .backgroundColor(Color.White)
                .onClick(async () => {
                  this.selectedCommunity = community.communityName;
                  this.selectedCommunityId = community.communityId;
                  this.showCommunityDropdown = false;
                  // 切换社区后重新获取发布信息
                  await this.getPostList();
                })

                if (index < this.communities.length - 1) {
                  Divider()
                    .color('#f0f0f0')
                    .strokeWidth(1)
                }
              })
            }
            .width('100%')
            .backgroundColor(Color.White)
            .borderRadius(8)
            .border({ width: 1, color: '#e0e0e0' })
            .shadow({ radius: 8, color: '#0000001A', offsetX: 0, offsetY: 4 })
            .margin({ top: 4 })
          }
        }
        .width('100%')
        .margin({ bottom: 20 })

        // 搜索栏
        Row() {
          TextInput({ placeholder: '搜索物品名称、描述...', text: this.searchText })
            .layoutWeight(1)
            .height(44)
            .fontSize(16)
            .borderRadius(22)
            .backgroundColor(Color.White)
            .border({ width: 1, color: '#ddd' })
            .padding({ left: 16, right: 16 })
            .onChange((value: string) => {
              this.searchText = value;
            })

          Button('🔍')
            .width(44)
            .height(44)
            .backgroundColor('#667eea')
            .borderRadius(22)
            .fontColor(Color.White)
            .fontSize(18)
            .margin({ left: 8 })
            .onClick(async () => {
              await this.searchPosts();
            })
        }
        .width('100%')
        .margin({ bottom: 20 })

        // 筛选标签
        Row() {
          ForEach(this.filterTabs, (tab: string) => {
            Text(tab)
              .layoutWeight(1)
              .fontSize(14)
              .fontColor(this.selectedFilter === tab ? '#667eea' : '#666666')
              .fontWeight(this.selectedFilter === tab ? FontWeight.Medium : FontWeight.Normal)
              .backgroundColor(this.selectedFilter === tab ? Color.White : Color.Transparent)
              .borderRadius(6)
              .padding(8)
              .textAlign(TextAlign.Center)
              .onClick(() => {
                this.selectedFilter = tab;
              })
          })
        }
        .width('100%')
        .backgroundColor('#f8f9fa')
        .borderRadius(8)
        .padding(4)
        .margin({ bottom: 20 })

        // 加载状态和错误信息
        if (this.isLoading) {
          Row() {
            Text('加载中...')
              .fontSize(16)
              .fontColor('#666666')
          }
          .width('100%')
          .height(100)
          .justifyContent(FlexAlign.Center)
        } else if (this.errorMessage) {
          Column() {
            Text('❌')
              .fontSize(32)
              .margin({ bottom: 8 })
            Text(this.errorMessage)
              .fontSize(14)
              .fontColor('#ff4444')
              .textAlign(TextAlign.Center)
            Button('重试')
              .fontSize(14)
              .backgroundColor('#667eea')
              .fontColor(Color.White)
              .borderRadius(6)
              .padding({ left: 16, right: 16, top: 8, bottom: 8 })
              .margin({ top: 12 })
              .onClick(async () => {
                this.errorMessage = '';
                await this.getCommunityList();
                await this.getPostList();
              })
          }
          .width('100%')
          .height(200)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        } else {
          // 物品列表
          List({ space: 16 }) {
          ForEach(this.lostItems.filter(item =>
            this.selectedFilter === '全部' ||
            (this.selectedFilter === '已找到' && item.status === '已找到') ||
            (this.selectedFilter === '寻物' && item.type === '寻物' && item.status === '寻找中') ||
            (this.selectedFilter === '寻主' && item.type === '寻主' && item.status === '寻找中')
          ).sort((a, b) => {
            // 按时间倒序排列，最新的在前面
            return b.originalTimestamp - a.originalTimestamp;
          }), (item: LostItem) => {
            ListItem() {
              Row() {
                // 图片
                Image(item.image)
                  .width(80)
                  .height(80)
                  .borderRadius(8)
                  .objectFit(ImageFit.Cover)
                  .alt('https://dummyimage.com/600x600/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B')
                  .onError(() => {
                    console.error('图片加载失败:', item.image);
                  })

                // 信息
                Column() {
                  Text(item.title)
                    .fontSize(16)
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#333333')
                    .maxLines(1)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })
                    .alignSelf(ItemAlign.Start)
                    .margin({ bottom: 4 })

                  Text(`📍 ${item.location}`)
                    .fontSize(14)
                    .fontColor('#666666')
                    .margin({ bottom: 2 })
                    .alignSelf(ItemAlign.Start)

                  Text(`⏰ ${item.time}`)
                    .fontSize(14)
                    .fontColor('#666666')
                    .margin({ bottom: 8 })
                    .alignSelf(ItemAlign.Start)

                  // 状态标签
                  Text(this.getStatusText(item))
                    .fontSize(12)
                    .fontWeight(FontWeight.Medium)
                    .fontColor(this.getStatusColor(item))
                    .backgroundColor(this.getStatusBackgroundColor(item))
                    .borderRadius(12)
                    .padding({ left: 8, right: 8, top: 4, bottom: 4 })
                    .alignSelf(ItemAlign.Start)
                }
                .layoutWeight(1)
                .alignItems(HorizontalAlign.Start)
                .margin({ left: 12 })
              }
              .width('100%')
              .padding(16)
              .backgroundColor(Color.White)
              .borderRadius(12)
              .shadow({ radius: 4, color: '#0000001A', offsetX: 0, offsetY: 2 })
              .onClick(() => {
                // 检查是否是本地发布的帖子
                const isLocalPost = this.localPublishedPosts.some(local => local.id === item.id);
                
                if (isLocalPost) {
                   // 本地发布的帖子，传递完整数据
                   router.pushUrl({
                     url: 'pages/DetailPage',
                     params: {
                       postId: item.id,
                       localPostData: JSON.stringify({
                         id: item.id,
                         title: item.title,
                         category: item.category,
                         location: item.location,
                         time: item.time,
                         description: item.description || '这是我刚刚发布的物品信息',
                         contactInfo: item.contactInfo || '联系电话：请通过私信联系',
                         images: item.images || [item.image],
                         type: item.type,
                         publisher: item.publisher || '我',
                         status: item.status
                       })
                     }
                   });
                  console.log(`跳转到详情页（本地数据），传递postId: ${item.id}`);
                } else {
                  // API数据，只传递postId
                  router.pushUrl({
                    url: 'pages/DetailPage',
                    params: {
                      postId: item.id
                    }
                  });
                  console.log(`跳转到详情页（API数据），传递postId: ${item.id}`);
                }
              })
            }
          })
          }
          .layoutWeight(1)
          .scrollBar(BarState.Off)
        }
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 20 })
      .backgroundColor('#f8f9fa')
      .layoutWeight(1)

      // 浮动发布按钮
      Stack() {
        Button('+')
          .width(56)
          .height(56)
          .fontSize(24)
          .fontColor(Color.White)
          .linearGradient({
            angle: 135,
            colors: [['#667eea', 0], ['#764ba2', 1]]
          })
          .borderRadius(28)
          .shadow({ radius: 8, color: '#667eea66', offsetX: 0, offsetY: 4 })
          .position({ x: '100%', y: '100%' })
          .translate({ x: -76, y: -140 })
          .onClick(() => {
            router.pushUrl({ url: 'pages/PublishPage' });
          })
      }
      .width('100%')
      .height(0)

      // 底部导航 - 使用CommonComponents
      BottomTabBar({
        currentIndex: 0,
        onTabClick: (index: number) => {
          NavigationUtils.handleTabNavigation(index, 0);
        }
      })
    }
    .width('100%')
    .height('100%')
  }
}
