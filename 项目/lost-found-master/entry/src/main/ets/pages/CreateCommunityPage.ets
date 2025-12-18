// 项目作者：杨钰然
import { router } from '@kit.ArkUI';
import { HeaderBar } from '../components/CommonComponents';
import { ApiCommunityInfo, ApiResponse,
  CommunityInfo,
  CreateCommunityResponse,
  CreateRequestInfo,
  JoinRequestInfo } from '../po/CommunityInfo';
import { API_BASE_URL } from '../utils/Common';
import { HttpUtils } from '../utils/HttpUtils';


@Entry
@Component
struct CreateCommunityPage {
  @State communityName: string = '';
  @State communityType: string = '';
  @State detailAddress: string = '';
  @State showTypeDropdown: boolean = false;
  @State isLoading: boolean = false;
  @State errorMessage: string = '';
  
  // 输入验证错误状态
  @State communityNameError: string = '';
  @State communityTypeError: string = '';
  @State detailAddressError: string = '';
  
  private communityTypes: string[] = ['校园', '小区', '公司', '车站', '机场'];
  
  // 检测社区名称和地址是否重复的函数
  private checkDuplicateCommunity(newName: string, newAddress: string, existingCommunities: CommunityInfo[]): string | null {
    const normalizedNewName = this.normalizeString(newName);
    const normalizedNewAddress = this.normalizeString(newAddress);
    
    for (const community of existingCommunities) {
      const normalizedExistingName = this.normalizeString(community.name);
      const normalizedExistingAddress = this.normalizeString(community.address || '');
      
      // 检查名称相似度
      const nameSimilarity = this.calculateSimilarity(normalizedNewName, normalizedExistingName);
      const nameContains = this.checkSubstringContainment(normalizedNewName, normalizedExistingName);
      
      // 检查地址相似度
      const addressSimilarity = this.calculateSimilarity(normalizedNewAddress, normalizedExistingAddress);
      const addressContains = this.checkSubstringContainment(normalizedNewAddress, normalizedExistingAddress);
      
      // 如果名称相似度高于80%或存在包含关系，且地址相似度高于70%或存在包含关系，则认为重复
      if ((nameSimilarity > 0.8 || nameContains) && (addressSimilarity > 0.7 || addressContains)) {
        return `检测到相似社区："${community.name}"，请确认是否为同一地点`;
      }
      
      // 如果名称完全相同或高度相似，提示可能重复
      if (nameSimilarity > 0.9 || nameContains) {
        return `已存在相似名称的社区："${community.name}"，请检查是否重复`;
      }
    }
    
    return null;
  }
  
  // 字符串标准化处理
  private normalizeString(str: string): string {
    return str.toLowerCase()
      .replace(/\s+/g, '') // 移除所有空格
      .replace(/[第一二三四五六七八九十]/g, (match) => {
        // 将中文数字转换为阿拉伯数字
        const numMap: Record<string, string> = {
          '第': '', '一': '1', '二': '2', '三': '3', '四': '4', '五': '5',
          '六': '6', '七': '7', '八': '8', '九': '9', '十': '10'
        };
        return numMap[match] || match;
      })
      .replace(/[医院|大学|学校|小区|公司|车站|机场]/g, '') // 移除常见后缀
      .replace(/[区|市|县|镇|街道|路|号]/g, ''); // 移除地址常见后缀
  }
  
  // 计算两个字符串的相似度（使用简化的编辑距离算法）
  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;
    if (str1.length === 0 || str2.length === 0) return 0.0;
    
    const maxLength = Math.max(str1.length, str2.length);
    const distance = this.levenshteinDistance(str1, str2);
    return 1 - (distance / maxLength);
  }
  
  // 计算编辑距离
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // 替换
            matrix[i][j - 1] + 1,     // 插入
            matrix[i - 1][j] + 1      // 删除
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  // 检查字符串包含关系
  private checkSubstringContainment(str1: string, str2: string): boolean {
    if (str1.length < 2 || str2.length < 2) return false;
    return str1.includes(str2) || str2.includes(str1);
  }
  
  // 获取现有社区列表用于重复检测
  private async getExistingCommunities(): Promise<CommunityInfo[]> {
    try {
      const url = `${API_BASE_URL}/api/community/my-communities?userId=user_12345`;
      const response = await HttpUtils.get(url);
      const apiResponse: ApiResponse<ApiCommunityInfo[]> = JSON.parse(response);
      
      if (apiResponse.code === 200 && apiResponse.data) {
        return apiResponse.data.map((community: ApiCommunityInfo): CommunityInfo => ({
          id: community.communityId || community.id || '',
          name: community.communityName || community.name || '',
          type: community.communityType || community.type || '',
          memberCount: community.memberCount || 0,
          isAdmin: community.isAdmin || false,
          isJoined: community.isJoined || false,
          address: community.address || ''
        }));
      }
    } catch (error) {
      console.error('获取现有社区列表失败:', error);
    }
    return [];
  }
  
  // 验证社区名称
  private validateCommunityName(): void {
    const name = this.communityName.trim();
    if (!name) {
      this.communityNameError = '社区名称不能为空';
    } else if (name.length < 2) {
      this.communityNameError = '社区名称至少需要2个字符';
    } else if (name.length > 20) {
      this.communityNameError = '社区名称不能超过20个字符';
    } else {
      this.communityNameError = '';
    }
  }
  
  // 验证社区类型
  private validateCommunityType(): void {
    if (!this.communityType) {
      this.communityTypeError = '请选择社区类型';
    } else {
      this.communityTypeError = '';
    }
  }
  
  // 验证详细地址
  private validateDetailAddress(): void {
    const address = this.detailAddress.trim();
    if (!address) {
      this.detailAddressError = '详细地址不能为空';
    } else if (address.length < 5) {
      this.detailAddressError = '详细地址至少需要5个字符';
    } else if (address.length > 100) {
      this.detailAddressError = '详细地址不能超过100个字符';
    } else {
      this.detailAddressError = '';
    }
  }
  
  // 验证所有输入
  private validateAllInputs(): boolean {
    this.validateCommunityName();
    this.validateCommunityType();
    this.validateDetailAddress();
    
    return !this.communityNameError && !this.communityTypeError && !this.detailAddressError;
  }

  // 创建社区
  async createCommunity(): Promise<void> {
    // 先进行输入验证
    if (!this.validateAllInputs()) {
      return;
    }
    
    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      // 获取现有社区列表进行重复检测
      const existingCommunities = await this.getExistingCommunities();
      const duplicateWarning = this.checkDuplicateCommunity(
        this.communityName.trim(),
        this.detailAddress.trim(),
        existingCommunities
      );
      
      if (duplicateWarning) {
        this.errorMessage = duplicateWarning;
        this.isLoading = false;
        return;
      }
      
      const url = `${API_BASE_URL}/api/community/create`;
      const requestData: CreateRequestInfo = {
        communityName: this.communityName.trim(),
        communityType: this.communityType,
        address: this.detailAddress.trim(),
        creatorId: 'user_12345' // 实际应用中应该从用户登录状态获取
      };
      
      const response = await HttpUtils.post(url, requestData);
      const apiResponse: ApiResponse<CreateCommunityResponse> = JSON.parse(response);
      
      if (apiResponse.code === 200 && apiResponse.data) {
        console.log('社区创建成功:', apiResponse.data);
        
        // 创建成功后自动加入该社区
        await this.joinCommunity(apiResponse.data.communityId);
        
        // 构造新创建的社区信息
        const newCommunity: CommunityInfo = {
          id: apiResponse.data.communityId,
          name: this.communityName.trim(), // 使用用户输入的名称
          type: this.communityType, // 使用用户选择的类型
          memberCount: 1, // 创建者自己
          isAdmin: true,  // 创建者是管理员
          isJoined: true,  // 已加入
          address: this.detailAddress.trim() // 添加地址信息
        };
        
        // 返回上一页并传递新创建的社区信息
        router.back({
          url: 'pages/CommunityPage',
          params: {
            newCommunity: JSON.stringify(newCommunity)
          }
        });
      } else {
        this.errorMessage = apiResponse.message || '创建社区失败';
      }
    } catch (error) {
      this.errorMessage = '网络请求失败，请重试';
      console.error('创建社区失败:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  // 加入社区
  async joinCommunity(communityId: string): Promise<void> {
    try {
      const url = `${API_BASE_URL}/api/community/join`;
      const requestData: JoinRequestInfo = {
        userId: 'user_12345', // 实际应用中应该从用户登录状态获取
        communityId: communityId
      };
      
      const response = await HttpUtils.post(url, requestData);
      const apiResponse: ApiResponse<object> = JSON.parse(response);
      
      if (apiResponse.code === 200) {
        console.log('自动加入社区成功');
      } else {
        console.error('自动加入社区失败:', apiResponse.message);
      }
    } catch (error) {
      console.error('自动加入社区请求失败:', error);
    }
  }

  build() {
    Column() {
      // 头部导航 - 使用CommonComponents
      HeaderBar({
        title: '创建社区',
        showBack: true,
        onBack: () =>{
          router.back();
        },
        showAction: false
      })
        .margin({ top: 0 })

      // 内容区域
      Scroll() {
        Column() {
          // 社区名称
          Column() {
            Text('社区名称')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#555555')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            TextInput({ placeholder: '请输入社区名称', text: this.communityName })
              .width('100%')
              .height(48)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: this.communityNameError ? '#ff4444' : '#dddddd' })
              .padding({ left: 12, right: 12 })
              .onChange((value: string) => {
                this.communityName = value;
                this.validateCommunityName();
              })
            
            // 社区名称错误提示
            if (this.communityNameError) {
              Text(this.communityNameError)
                .fontSize(12)
                .fontColor('#ff4444')
                .alignSelf(ItemAlign.Start)
                .margin({ top: 4 })
            }
          }
          .width('100%')
          .alignItems(HorizontalAlign.Start)
          .margin({ bottom: 20 })

          // 社区类型
          Column() {
            Text('社区类型')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#555555')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            Column() {
              Row() {
                Text(this.communityType || '请选择社区类型')
                  .fontSize(16)
                  .fontColor(this.communityType ? '#333333' : '#999999')
                  .layoutWeight(1)
                
                Text(this.showTypeDropdown ? '▲' : '▼')
                  .fontSize(14)
                  .fontColor('#666666')
              }
              .width('100%')
              .height(48)
              .padding({ left: 12, right: 12 })
              .backgroundColor(Color.White)
              .border({ width: 1, color: '#dddddd' })
              .borderRadius(8)
              .justifyContent(FlexAlign.SpaceBetween)
              .alignItems(VerticalAlign.Center)
              .border({ width: 1, color: this.communityTypeError ? '#ff4444' : '#dddddd' })
              .onClick(() => {
                this.showTypeDropdown = !this.showTypeDropdown;
                this.validateCommunityType();
              })
              
              // 下拉选项
              if (this.showTypeDropdown) {
                Column() {
                  ForEach(this.communityTypes, (type: string, index: number) => {
                    Row() {
                      Text(type)
                        .fontSize(16)
                        .fontColor('#333333')
                        .layoutWeight(1)
                      
                      if (type === this.communityType) {
                        Text('✓')
                          .fontSize(14)
                          .fontColor('#667eea')
                      }
                    }
                    .width('100%')
                    .padding({ left: 12, right: 12, top: 12, bottom: 12 })
                    .backgroundColor(Color.White)
                    .onClick(() => {
                      this.communityType = type;
                      this.showTypeDropdown = false;
                      this.validateCommunityType();
                    })
                    
                    if (index < this.communityTypes.length - 1) {
                      Divider()
                        .color($r('sys.color.glass_material_outline_secondary'))
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
            
            // 社区类型错误提示
            if (this.communityTypeError) {
              Text(this.communityTypeError)
                .fontSize(12)
                .fontColor('#ff4444')
                .alignSelf(ItemAlign.Start)
                .margin({ top: 4 })
            }
          }
          .width('100%')
          .alignItems(HorizontalAlign.Start)
          .margin({ bottom: 20 })

          // 详细地址
          Column() {
            Text('详细地址')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#555555')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })
            
            TextArea({ placeholder: '请输入详细地址', text: this.detailAddress })
              .width('100%')
              .height(120)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor(Color.White)
              .border({ width: 1, color: this.detailAddressError ? '#ff4444' : '#dddddd' })
              .padding(12)
              .onChange((value: string) => {
                this.detailAddress = value;
                this.validateDetailAddress();
              })
            
            // 详细地址错误提示
            if (this.detailAddressError) {
              Text(this.detailAddressError)
                .fontSize(12)
                .fontColor('#ff4444')
                .alignSelf(ItemAlign.Start)
                .margin({ top: 4 })
            }
          }
          .width('100%')
          .alignItems(HorizontalAlign.Start)
          .margin({ bottom: 40 })

          // 错误信息显示
          if (this.errorMessage) {
            Text(this.errorMessage)
              .fontSize(14)
              .fontColor('#ff4444')
              .width('100%')
              .textAlign(TextAlign.Center)
              .margin({ bottom: 16 })
          }

          // 创建按钮
          Button(this.isLoading ? '创建中...' : '创建社区')
            .width('100%')
            .height(48)
            .fontSize(16)
            .fontColor(Color.White)
            .linearGradient({
              angle: 135,
              colors: [['#667eea', 0], ['#764ba2', 1]]
            })
            .borderRadius(8)
            .enabled(!this.isLoading && !this.communityNameError && !this.communityTypeError &&
              !this.detailAddressError && !!this.communityName.trim() && !!this.communityType &&
              !!this.detailAddress.trim())
            .opacity((this.isLoading || this.communityNameError || this.communityTypeError || this.detailAddressError ||
              !this.communityName.trim() || !this.communityType || !this.detailAddress.trim()) ? 0.6 : 1.0)
            .onClick(async () => {
              await this.createCommunity();
            })
        }
        .width('100%')
        .padding({ left: 20, right: 20, top: 20, bottom: 20 })
      }
      .layoutWeight(1)
      .backgroundColor('#f8f9fa')
      .scrollBar(BarState.Off)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f8f9fa')
  }
}