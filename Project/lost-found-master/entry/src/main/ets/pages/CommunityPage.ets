// 项目作者：杨钰然
import { router } from '@kit.ArkUI';
import { ApiCommunityInfo, ApiResponse, CommunityInfo } from "../po/CommunityInfo"
import { HeaderBar, BottomTabBar, NavigationUtils } from "../components/CommonComponents"
import { HttpUtils } from '../utils/HttpUtils';
import { API_BASE_URL } from '../utils/Common';


@Entry
@Component
struct CommunityPage {
  @State communities: CommunityInfo[] = [];
  @State isLoading: boolean = false;
  @State errorMessage: string = '';
  
  // 本地新创建的社区列表（用于解决mock数据覆盖问题）
  private localCreatedCommunities: CommunityInfo[] = [];
  
  // 获取用户已加入的社区列表
  async getMyCommunities(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      const url = `${API_BASE_URL}/api/community/my-communities?userId=user_12345`;
      const response = await HttpUtils.get(url);
      const apiResponse: ApiResponse<ApiCommunityInfo[]> = JSON.parse(response);
      
      if (apiResponse.code === 200 && apiResponse.data) {
        // 将API返回的数据转换为CommunityInfo格式
        const apiCommunities = apiResponse.data.map((apiCommunity: ApiCommunityInfo): CommunityInfo => {
          // 设置部分社区为未加入状态
          const isJoined = Math.random() > 0.6;
          return {
            id: apiCommunity.communityId,
            name: apiCommunity.communityName,
            type: apiCommunity.communityType,
            memberCount: apiCommunity.memberCount || 0,
            isAdmin: false, // API暂未返回管理员信息，默认为false
            isJoined: isJoined
          };
        });
        
        // 合并API数据和本地创建的社区数据
        // 过滤掉API中已存在的本地社区（避免重复）
        const filteredLocalCommunities = this.localCreatedCommunities.filter(localCommunity => 
          !apiCommunities.some(apiCommunity => apiCommunity.id === localCommunity.id)
        );
        
        // 将本地创建的社区放在前面，API数据放在后面
        this.communities = [...filteredLocalCommunities, ...apiCommunities];
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
  
  // 页面初始化时获取数据
  aboutToAppear(): void {
    this.getMyCommunities();
  }
  
  // 页面重新显示时刷新数据
  onPageShow(): void {
    // 检查是否有新创建的社区信息传递过来
    const params = router.getParams();
    if (params && Reflect.get(params, 'newCommunity')) {
      try {
        const newCommunity: CommunityInfo = JSON.parse(Reflect.get(params, 'newCommunity') as string);
        this.addLocalCommunity(newCommunity);
      } catch (error) {
        console.error('解析新社区信息失败:', error);
      }
    }
    
    this.getMyCommunities();
  }
  
  // 添加新创建的社区到本地列表
  addLocalCommunity(community: CommunityInfo): void {
    // 检查本地列表和当前显示列表中是否已存在，避免重复添加
    const existsInLocal = this.localCreatedCommunities.some(local => local.id === community.id);
    const existsInCurrent = this.communities.some(current => current.id === community.id);
    
    if (!existsInLocal && !existsInCurrent) {
      this.localCreatedCommunities.push(community);
      // 立即更新显示的社区列表，将新社区放在最前面
      this.communities = [community, ...this.communities];
      console.log('成功添加新创建的社区:', community.name);
    } else {
      console.log('社区已存在，跳过添加:', community.name);
    }
  }
  
  // 加入社区
  joinCommunity(communityId: string): void {
    const communityIndex = this.communities.findIndex(community => community.id === communityId);
    if (communityIndex !== -1) {
      // 更新社区状态为已加入
      this.communities[communityIndex].isJoined = true;
      // 人数+1
      this.communities[communityIndex].memberCount += 1;
      // 触发UI更新
      this.communities = [...this.communities];
      console.log(`成功加入社区: ${this.communities[communityIndex].name}`);
    }
  }

  build() {
    Column() {
      // 头部导航 - 使用CommonComponents
      HeaderBar({
        title: '社区',
        showBack: false,
        showAction: true,
        actionText: '+',
        onAction: () => {
          router.pushUrl({ url: 'pages/CreateCommunityPage' });
        }
      })
        .margin({ top: 0 })

      // 内容区域
      Scroll() {
        Column() {
          // 我加入的社区统计卡片
          Column() {
            Row() {
              Column() {
                Text('社区列表')
                  .fontSize(16)
                  .fontWeight(FontWeight.Medium)
                  .fontColor('#333333')
                  .alignSelf(ItemAlign.Start)
                if (this.isLoading) {
                  Text('加载中...')
                    .fontSize(14)
                    .fontColor('#666666')
                    .margin({ top: 4 })
                    .alignSelf(ItemAlign.Start)
                } else if (this.errorMessage) {
                  Text(this.errorMessage)
                    .fontSize(14)
                    .fontColor('#ff4444')
                    .margin({ top: 4 })
                    .alignSelf(ItemAlign.Start)
                } else {
                  Text(`${this.communities.length}个社区`)
                    .fontSize(14)
                    .fontColor('#666666')
                    .margin({ top: 4 })
                    .alignSelf(ItemAlign.Start)
                }
              }
              .alignItems(HorizontalAlign.Start)
              .layoutWeight(1)
              
              // 刷新按钮
              Button('刷新')
                .fontSize(12)
                .fontColor('#667eea')
                .backgroundColor(Color.Transparent)
                .border({ width: 1, color: '#667eea' })
                .borderRadius(4)
                .padding({ left: 8, right: 8, top: 4, bottom: 4 })
                .onClick(() => {
                  this.getMyCommunities();
                })
            }
            .width('100%')
          }
          .width('100%')
          .padding(16)
          .backgroundColor(Color.White)
          .borderRadius(12)
          .shadow({ radius: 4, color: '#0000001A', offsetX: 0, offsetY: 2 })
          .margin({ bottom: 16 })

          // 社区列表
          if (this.isLoading) {
            // 加载状态
            Column() {
              Text('正在加载社区列表...')
                .fontSize(16)
                .fontColor('#666666')
                .margin({ top: 40, bottom: 40 })
            }
            .width('100%')
            .justifyContent(FlexAlign.Center)
          } else if (this.errorMessage && this.communities.length === 0) {
            // 错误状态
            Column() {
              Text('加载失败')
                .fontSize(16)
                .fontColor('#ff4444')
                .margin({ bottom: 8 })
              Text(this.errorMessage)
                .fontSize(14)
                .fontColor('#666666')
                .margin({ bottom: 16 })
              Button('重试')
                .fontSize(14)
                .fontColor(Color.White)
                .backgroundColor('#667eea')
                .borderRadius(6)
                .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                .onClick(() => {
                  this.getMyCommunities();
                })
            }
            .width('100%')
            .justifyContent(FlexAlign.Center)
            .margin({ top: 40, bottom: 40 })
          } else if (this.communities.length === 0) {
            // 空状态
            Column() {
              Text('暂无加入的社区')
                .fontSize(16)
                .fontColor('#666666')
                .margin({ top: 40, bottom: 40 })
            }
            .width('100%')
            .justifyContent(FlexAlign.Center)
          } else {
            // 社区列表
            ForEach(this.communities, (community: CommunityInfo) => {
              Column() {
                Row() {
                  Column() {
                    Text(community.name)
                      .fontSize(16)
                      .fontWeight(FontWeight.Medium)
                      .fontColor('#333333')
                      .alignSelf(ItemAlign.Start)
                    
                    Text(`${community.type} · ${community.memberCount}人${community.isAdmin ? ' · 管理员' : ''}`)
                      .fontSize(14)
                      .fontColor('#666666')
                      .margin({ top: 4 })
                      .alignSelf(ItemAlign.Start)
                  }
                  .alignItems(HorizontalAlign.Start)
                  .layoutWeight(1)
                  
                  // 右侧按钮或状态
                  if (community.isAdmin) {
                    Button('我创建的')
                      .fontSize(14)
                      .fontColor(Color.White)
                      .backgroundColor('#667eea')
                      .borderRadius(6)
                      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                      .onClick(() => {
                        console.log(`管理社区: ${community.name}`);
                      })
                  } else if (community.isJoined) {
                    Text('✓ 已加入')
                      .fontSize(14)
                      .fontColor('#28a745')
                      .fontWeight(FontWeight.Medium)
                  } else {
                    Button('加入')
                      .fontSize(14)
                      .fontColor(Color.White)
                      .backgroundColor('#667eea')
                      .borderRadius(6)
                      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                      .onClick(() => {
                        this.joinCommunity(community.id);
                      })
                  }
                }
                .width('100%')
                .justifyContent(FlexAlign.SpaceBetween)
                .alignItems(VerticalAlign.Center)
              }
              .width('100%')
              .padding(16)
              .backgroundColor(Color.White)
              .borderRadius(12)
              .shadow({ radius: 4, color: '#0000001A', offsetX: 0, offsetY: 2 })
              .margin({ bottom: 16 })
              .onClick(() => {
                console.log(`点击社区: ${community.name}`);
              })
            })
          }
        }
        .width('100%')
        .padding({ left: 20, right: 20, top: 20, bottom: 20 })
      }
      .layoutWeight(1)
      .backgroundColor('#f8f9fa')
      .scrollBar(BarState.Off)

      // 底部导航 - 使用CommonComponents
      BottomTabBar({
        currentIndex: 1,
        onTabClick: (index: number) => {
          NavigationUtils.handleTabNavigation(index, 1);
        }
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f8f9fa')
  }
}