if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MainPage_Params {
    searchText?: string;
    selectedFilter?: string;
    filterTabs?: string[];
    showCommunityDropdown?: boolean;
    selectedCommunity?: string;
    selectedCommunityId?: string;
    communities?: PostCommunityInfo[];
    isLoading?: boolean;
    errorMessage?: string;
    lostItems?: LostItem[];
    localPublishedPosts?: LostItem[];
}
import router from "@ohos:router";
import type { LostItem } from "../po/LostItem";
import { HeaderBar, BottomTabBar, NavigationUtils } from "@normalized:N&&&entry/src/main/ets/components/CommonComponents&";
import { HttpUtils } from "@normalized:N&&&entry/src/main/ets/utils/HttpUtils&";
import type { ApiResponse } from '../po/CommonTypes';
import type { PostCommunityInfo, PostInfo, SearchResponse } from '../po/MainInfo';
import { API_BASE_URL } from "@normalized:N&&&entry/src/main/ets/utils/Common&";
class MainPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__selectedFilter = new ObservedPropertySimplePU('寻物', this, "selectedFilter");
        this.filterTabs = ['寻物', '寻主', '已找到'];
        this.__showCommunityDropdown = new ObservedPropertySimplePU(false, this, "showCommunityDropdown");
        this.__selectedCommunity = new ObservedPropertySimplePU('全部社区', this, "selectedCommunity");
        this.__selectedCommunityId = new ObservedPropertySimplePU('comm_12345', this, "selectedCommunityId");
        this.__communities = new ObservedPropertyObjectPU([], this, "communities");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__lostItems = new ObservedPropertyObjectPU([], this, "lostItems");
        this.localPublishedPosts = [];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MainPage_Params) {
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.selectedFilter !== undefined) {
            this.selectedFilter = params.selectedFilter;
        }
        if (params.filterTabs !== undefined) {
            this.filterTabs = params.filterTabs;
        }
        if (params.showCommunityDropdown !== undefined) {
            this.showCommunityDropdown = params.showCommunityDropdown;
        }
        if (params.selectedCommunity !== undefined) {
            this.selectedCommunity = params.selectedCommunity;
        }
        if (params.selectedCommunityId !== undefined) {
            this.selectedCommunityId = params.selectedCommunityId;
        }
        if (params.communities !== undefined) {
            this.communities = params.communities;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.lostItems !== undefined) {
            this.lostItems = params.lostItems;
        }
        if (params.localPublishedPosts !== undefined) {
            this.localPublishedPosts = params.localPublishedPosts;
        }
    }
    updateStateVars(params: MainPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedFilter.purgeDependencyOnElmtId(rmElmtId);
        this.__showCommunityDropdown.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedCommunity.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedCommunityId.purgeDependencyOnElmtId(rmElmtId);
        this.__communities.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__lostItems.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__searchText.aboutToBeDeleted();
        this.__selectedFilter.aboutToBeDeleted();
        this.__showCommunityDropdown.aboutToBeDeleted();
        this.__selectedCommunity.aboutToBeDeleted();
        this.__selectedCommunityId.aboutToBeDeleted();
        this.__communities.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__lostItems.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    private __selectedFilter: ObservedPropertySimplePU<string>;
    get selectedFilter() {
        return this.__selectedFilter.get();
    }
    set selectedFilter(newValue: string) {
        this.__selectedFilter.set(newValue);
    }
    private filterTabs: string[];
    private __showCommunityDropdown: ObservedPropertySimplePU<boolean>;
    get showCommunityDropdown() {
        return this.__showCommunityDropdown.get();
    }
    set showCommunityDropdown(newValue: boolean) {
        this.__showCommunityDropdown.set(newValue);
    }
    private __selectedCommunity: ObservedPropertySimplePU<string>;
    get selectedCommunity() {
        return this.__selectedCommunity.get();
    }
    set selectedCommunity(newValue: string) {
        this.__selectedCommunity.set(newValue);
    }
    private __selectedCommunityId: ObservedPropertySimplePU<string>;
    get selectedCommunityId() {
        return this.__selectedCommunityId.get();
    }
    set selectedCommunityId(newValue: string) {
        this.__selectedCommunityId.set(newValue);
    }
    private __communities: ObservedPropertyObjectPU<PostCommunityInfo[]>;
    get communities() {
        return this.__communities.get();
    }
    set communities(newValue: PostCommunityInfo[]) {
        this.__communities.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __errorMessage: ObservedPropertySimplePU<string>;
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    // 数据状态
    private __lostItems: ObservedPropertyObjectPU<LostItem[]>;
    get lostItems() {
        return this.__lostItems.get();
    }
    set lostItems(newValue: LostItem[]) {
        this.__lostItems.set(newValue);
    }
    // 本地新发布的帖子列表（用于防止数据被mock响应覆盖问题）
    private localPublishedPosts: LostItem[];
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
            }
            else {
                this.errorMessage = apiResponse.message || '获取社区列表失败';
            }
        }
        catch (error) {
            this.errorMessage = '网络请求失败';
            console.error('获取社区列表失败:', error);
        }
        finally {
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
                const filteredLocalPosts = this.localPublishedPosts.filter(localPost => !apiPosts.some(apiPost => apiPost.id === localPost.id));
                // 将本地发布的帖子放在前面，API数据放在后面
                this.lostItems = [...filteredLocalPosts, ...apiPosts];
            }
            else {
                this.errorMessage = apiResponse.message || '获取发布信息失败';
            }
        }
        catch (error) {
            this.errorMessage = '网络请求失败';
            console.error('获取发布信息失败:', error);
        }
        finally {
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
            }
            else {
                this.errorMessage = apiResponse.message || '搜索失败';
            }
        }
        catch (error) {
            this.errorMessage = '搜索请求失败';
            console.error('搜索失败:', error);
        }
        finally {
            this.isLoading = false;
        }
    }
    // 格式化时间显示
    private formatTime(timeStr: string): string {
        if (!timeStr)
            return '时间未知';
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
            }
            else if (diffDays > 0) {
                return `${diffDays}天前`;
            }
            else if (diffHours > 0) {
                return `${diffHours}小时前`;
            }
            else if (diffMinutes > 0) {
                return `${diffMinutes}分钟前`;
            }
            else {
                return '刚刚';
            }
        }
        catch (error) {
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
            }
            catch (error) {
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
        }
        else {
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
        }
        else {
            return item.type === '寻物' ? '寻物' : '寻主';
        }
    }
    // 获取状态文字颜色
    getStatusColor(item: LostItem): string {
        if (item.status === '已找到') {
            return '#155724';
        }
        else {
            return '#856404';
        }
    }
    // 获取状态背景颜色
    getStatusBackgroundColor(item: LostItem): string {
        if (item.status === '已找到') {
            return '#d4edda';
        }
        else {
            return '#fff3cd';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.margin({ top: 0 });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 头部导航 - 使用CommonComponents
                    HeaderBar(this, {
                        title: '失物招领',
                        showBack: false,
                        showAction: true,
                        actionText: '👤',
                        onAction: () => {
                            router.pushUrl({ url: 'pages/ProfilePage' });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 276, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '失物招领',
                            showBack: false,
                            showAction: true,
                            actionText: '👤',
                            onAction: () => {
                                router.pushUrl({ url: 'pages/ProfilePage' });
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '失物招领',
                        showBack: false,
                        showAction: true,
                        actionText: '👤'
                    });
                }
            }, { name: "HeaderBar" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区域
            Column.create();
            // 内容区域
            Column.width('100%');
            // 内容区域
            Column.padding({ left: 20, right: 20, top: 20 });
            // 内容区域
            Column.backgroundColor('#f8f9fa');
            // 内容区域
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 社区选择器
            Column.create();
            // 社区选择器
            Column.width('100%');
            // 社区选择器
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor(Color.White);
            Row.borderRadius(8);
            Row.border({ width: 1, color: '#e0e0e0' });
            Row.onClick(() => {
                this.showCommunityDropdown = !this.showCommunityDropdown;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('筛选社区');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.selectedCommunity);
            Text.fontSize(12);
            Text.fontColor('#666666');
            Text.margin({ top: 2 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showCommunityDropdown ? '▲' : '▼');
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 下拉列表
            if (this.showCommunityDropdown) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(8);
                        Column.border({ width: 1, color: '#e0e0e0' });
                        Column.shadow({ radius: 8, color: '#0000001A', offsetX: 0, offsetY: 4 });
                        Column.margin({ top: 4 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 全部社区选项
                        Row.create();
                        // 全部社区选项
                        Row.width('100%');
                        // 全部社区选项
                        Row.padding({ left: 12, right: 12, top: 10, bottom: 10 });
                        // 全部社区选项
                        Row.backgroundColor(Color.White);
                        // 全部社区选项
                        Row.onClick(async () => {
                            this.selectedCommunity = '全部社区';
                            if (this.communities.length > 0) {
                                this.selectedCommunityId = this.communities[0].communityId;
                            }
                            this.showCommunityDropdown = false;
                            // 切换到全部社区后重新获取发布信息
                            await this.getPostList();
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('全部社区');
                        Text.fontSize(14);
                        Text.fontColor('#333333');
                        Text.layoutWeight(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.selectedCommunity === '全部社区') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('✓');
                                    Text.fontSize(14);
                                    Text.fontColor('#667eea');
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    // 全部社区选项
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.communities.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Divider.create();
                                    Divider.color('#f0f0f0');
                                    Divider.strokeWidth(1);
                                }, Divider);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const community = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.padding({ left: 12, right: 12, top: 10, bottom: 10 });
                                Row.backgroundColor(Color.White);
                                Row.onClick(async () => {
                                    this.selectedCommunity = community.communityName;
                                    this.selectedCommunityId = community.communityId;
                                    this.showCommunityDropdown = false;
                                    // 切换社区后重新获取发布信息
                                    await this.getPostList();
                                });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(community.communityName);
                                Text.fontSize(14);
                                Text.fontColor('#333333');
                                Text.layoutWeight(1);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (community.communityName === this.selectedCommunity) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('✓');
                                            Text.fontSize(14);
                                            Text.fontColor('#667eea');
                                        }, Text);
                                        Text.pop();
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                            Row.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (index < this.communities.length - 1) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Divider.create();
                                            Divider.color('#f0f0f0');
                                            Divider.strokeWidth(1);
                                        }, Divider);
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.communities, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 社区选择器
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索栏
            Row.create();
            // 搜索栏
            Row.width('100%');
            // 搜索栏
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '搜索物品名称、描述...', text: this.searchText });
            TextInput.layoutWeight(1);
            TextInput.height(44);
            TextInput.fontSize(16);
            TextInput.borderRadius(22);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: '#ddd' });
            TextInput.padding({ left: 16, right: 16 });
            TextInput.onChange((value: string) => {
                this.searchText = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('🔍');
            Button.width(44);
            Button.height(44);
            Button.backgroundColor('#667eea');
            Button.borderRadius(22);
            Button.fontColor(Color.White);
            Button.fontSize(18);
            Button.margin({ left: 8 });
            Button.onClick(async () => {
                await this.searchPosts();
            });
        }, Button);
        Button.pop();
        // 搜索栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 筛选标签
            Row.create();
            // 筛选标签
            Row.width('100%');
            // 筛选标签
            Row.backgroundColor('#f8f9fa');
            // 筛选标签
            Row.borderRadius(8);
            // 筛选标签
            Row.padding(4);
            // 筛选标签
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab);
                    Text.layoutWeight(1);
                    Text.fontSize(14);
                    Text.fontColor(this.selectedFilter === tab ? '#667eea' : '#666666');
                    Text.fontWeight(this.selectedFilter === tab ? FontWeight.Medium : FontWeight.Normal);
                    Text.backgroundColor(this.selectedFilter === tab ? Color.White : Color.Transparent);
                    Text.borderRadius(6);
                    Text.padding(8);
                    Text.textAlign(TextAlign.Center);
                    Text.onClick(() => {
                        this.selectedFilter = tab;
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.filterTabs, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 筛选标签
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 加载状态和错误信息
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.height(100);
                        Row.justifyContent(FlexAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height(200);
                        Column.justifyContent(FlexAlign.Center);
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('❌');
                        Text.fontSize(32);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.fontSize(14);
                        Text.fontColor('#ff4444');
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('重试');
                        Button.fontSize(14);
                        Button.backgroundColor('#667eea');
                        Button.fontColor(Color.White);
                        Button.borderRadius(6);
                        Button.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                        Button.margin({ top: 12 });
                        Button.onClick(async () => {
                            this.errorMessage = '';
                            await this.getCommunityList();
                            await this.getPostList();
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 物品列表
                        List.create({ space: 16 });
                        // 物品列表
                        List.layoutWeight(1);
                        // 物品列表
                        List.scrollBar(BarState.Off);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.width('100%');
                                        Row.padding(16);
                                        Row.backgroundColor(Color.White);
                                        Row.borderRadius(12);
                                        Row.shadow({ radius: 4, color: '#0000001A', offsetX: 0, offsetY: 2 });
                                        Row.onClick(() => {
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
                                            }
                                            else {
                                                // API数据，只传递postId
                                                router.pushUrl({
                                                    url: 'pages/DetailPage',
                                                    params: {
                                                        postId: item.id
                                                    }
                                                });
                                                console.log(`跳转到详情页（API数据），传递postId: ${item.id}`);
                                            }
                                        });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 图片
                                        Image.create(item.image);
                                        // 图片
                                        Image.width(80);
                                        // 图片
                                        Image.height(80);
                                        // 图片
                                        Image.borderRadius(8);
                                        // 图片
                                        Image.objectFit(ImageFit.Cover);
                                        // 图片
                                        Image.alt('https://dummyimage.com/600x600/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B');
                                        // 图片
                                        Image.onError(() => {
                                            console.error('图片加载失败:', item.image);
                                        });
                                    }, Image);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 信息
                                        Column.create();
                                        // 信息
                                        Column.layoutWeight(1);
                                        // 信息
                                        Column.alignItems(HorizontalAlign.Start);
                                        // 信息
                                        Column.margin({ left: 12 });
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.title);
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Bold);
                                        Text.fontColor('#333333');
                                        Text.maxLines(1);
                                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                        Text.alignSelf(ItemAlign.Start);
                                        Text.margin({ bottom: 4 });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`📍 ${item.location}`);
                                        Text.fontSize(14);
                                        Text.fontColor('#666666');
                                        Text.margin({ bottom: 2 });
                                        Text.alignSelf(ItemAlign.Start);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`⏰ ${item.time}`);
                                        Text.fontSize(14);
                                        Text.fontColor('#666666');
                                        Text.margin({ bottom: 8 });
                                        Text.alignSelf(ItemAlign.Start);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 状态标签
                                        Text.create(this.getStatusText(item));
                                        // 状态标签
                                        Text.fontSize(12);
                                        // 状态标签
                                        Text.fontWeight(FontWeight.Medium);
                                        // 状态标签
                                        Text.fontColor(this.getStatusColor(item));
                                        // 状态标签
                                        Text.backgroundColor(this.getStatusBackgroundColor(item));
                                        // 状态标签
                                        Text.borderRadius(12);
                                        // 状态标签
                                        Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                                        // 状态标签
                                        Text.alignSelf(ItemAlign.Start);
                                    }, Text);
                                    // 状态标签
                                    Text.pop();
                                    // 信息
                                    Column.pop();
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.lostItems.filter(item => this.selectedFilter === '全部' ||
                            (this.selectedFilter === '已找到' && item.status === '已找到') ||
                            (this.selectedFilter === '寻物' && item.type === '寻物' && item.status === '寻找中') ||
                            (this.selectedFilter === '寻主' && item.type === '寻主' && item.status === '寻找中')).sort((a, b) => {
                            // 按时间倒序排列，最新的在前面
                            return b.originalTimestamp - a.originalTimestamp;
                        }), forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    // 物品列表
                    List.pop();
                });
            }
        }, If);
        If.pop();
        // 内容区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 浮动发布按钮
            Stack.create();
            // 浮动发布按钮
            Stack.width('100%');
            // 浮动发布按钮
            Stack.height(0);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+');
            Button.width(56);
            Button.height(56);
            Button.fontSize(24);
            Button.fontColor(Color.White);
            Button.linearGradient({
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
            });
            Button.borderRadius(28);
            Button.shadow({ radius: 8, color: '#667eea66', offsetX: 0, offsetY: 4 });
            Button.position({ x: '100%', y: '100%' });
            Button.translate({ x: -76, y: -140 });
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/PublishPage' });
            });
        }, Button);
        Button.pop();
        // 浮动发布按钮
        Stack.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 底部导航 - 使用CommonComponents
                    BottomTabBar(this, {
                        currentIndex: 0,
                        onTabClick: (index: number) => {
                            NavigationUtils.handleTabNavigation(index, 0);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 624, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            currentIndex: 0,
                            onTabClick: (index: number) => {
                                NavigationUtils.handleTabNavigation(index, 0);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        currentIndex: 0
                    });
                }
            }, { name: "BottomTabBar" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "MainPage";
    }
}
registerNamedRoute(() => new MainPage(undefined, {}), "", { bundleName: "com.pizza.lostfound", moduleName: "entry", pagePath: "pages/MainPage", pageFullPath: "entry/src/main/ets/pages/MainPage", integratedHsp: "false", moduleType: "followWithHap" });
