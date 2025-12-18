if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DetailPage_Params {
    postId?: string;
    itemData?: ItemData;
    comments?: CommentData[];
    newComment?: string;
    isCommentFocused?: boolean;
    showClaimDialog?: boolean;
    claimPhoneNumber?: string;
    isLoading?: boolean;
    errorMessage?: string;
}
import router from "@ohos:router";
import { HeaderBar } from "@normalized:N&&&entry/src/main/ets/components/CommonComponents&";
import type { ItemData } from "../po/ItemData";
import type { CommentData } from "../po/CommentData";
import { HttpUtils } from "@normalized:N&&&entry/src/main/ets/utils/HttpUtils&";
import type { ApiResponse, CreateClaimRequest, CreateCommentRequest, ApiItemData, ApiCommentData } from '../po/CommonTypes';
import type { LostItem } from '../po/LostItem';
import { API_BASE_URL } from "@normalized:N&&&entry/src/main/ets/utils/Common&";
class DetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.postId = '';
        this.__itemData = new ObservedPropertyObjectPU({
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
        }, this, "itemData");
        this.__comments = new ObservedPropertyObjectPU([], this, "comments");
        this.__newComment = new ObservedPropertySimplePU('', this, "newComment");
        this.__isCommentFocused = new ObservedPropertySimplePU(false, this, "isCommentFocused");
        this.__showClaimDialog = new ObservedPropertySimplePU(false, this, "showClaimDialog");
        this.__claimPhoneNumber = new ObservedPropertySimplePU('', this, "claimPhoneNumber");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DetailPage_Params) {
        if (params.postId !== undefined) {
            this.postId = params.postId;
        }
        if (params.itemData !== undefined) {
            this.itemData = params.itemData;
        }
        if (params.comments !== undefined) {
            this.comments = params.comments;
        }
        if (params.newComment !== undefined) {
            this.newComment = params.newComment;
        }
        if (params.isCommentFocused !== undefined) {
            this.isCommentFocused = params.isCommentFocused;
        }
        if (params.showClaimDialog !== undefined) {
            this.showClaimDialog = params.showClaimDialog;
        }
        if (params.claimPhoneNumber !== undefined) {
            this.claimPhoneNumber = params.claimPhoneNumber;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
    }
    updateStateVars(params: DetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__itemData.purgeDependencyOnElmtId(rmElmtId);
        this.__comments.purgeDependencyOnElmtId(rmElmtId);
        this.__newComment.purgeDependencyOnElmtId(rmElmtId);
        this.__isCommentFocused.purgeDependencyOnElmtId(rmElmtId);
        this.__showClaimDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__claimPhoneNumber.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__itemData.aboutToBeDeleted();
        this.__comments.aboutToBeDeleted();
        this.__newComment.aboutToBeDeleted();
        this.__isCommentFocused.aboutToBeDeleted();
        this.__showClaimDialog.aboutToBeDeleted();
        this.__claimPhoneNumber.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 检查网络连接
    private checkNetworkConnection(): void {
        console.log('检查网络连接状态...');
        // 这里可以添加网络连接检查的代码
        // 例如使用网络状态API检查当前网络是否可用
    }
    // 物品ID，从路由参数获取
    private postId: string;
    private __itemData: ObservedPropertyObjectPU<ItemData>;
    get itemData() {
        return this.__itemData.get();
    }
    set itemData(newValue: ItemData) {
        this.__itemData.set(newValue);
    }
    // 评论相关状态
    private __comments: ObservedPropertyObjectPU<CommentData[]>;
    get comments() {
        return this.__comments.get();
    }
    set comments(newValue: CommentData[]) {
        this.__comments.set(newValue);
    }
    private __newComment: ObservedPropertySimplePU<string>;
    get newComment() {
        return this.__newComment.get();
    }
    set newComment(newValue: string) {
        this.__newComment.set(newValue);
    }
    private __isCommentFocused: ObservedPropertySimplePU<boolean>;
    get isCommentFocused() {
        return this.__isCommentFocused.get();
    }
    set isCommentFocused(newValue: boolean) {
        this.__isCommentFocused.set(newValue);
    }
    // 认领弹窗相关状态
    private __showClaimDialog: ObservedPropertySimplePU<boolean>;
    get showClaimDialog() {
        return this.__showClaimDialog.get();
    }
    set showClaimDialog(newValue: boolean) {
        this.__showClaimDialog.set(newValue);
    }
    private __claimPhoneNumber: ObservedPropertySimplePU<string>;
    get claimPhoneNumber() {
        return this.__claimPhoneNumber.get();
    }
    set claimPhoneNumber(newValue: string) {
        this.__claimPhoneNumber.set(newValue);
    }
    // 加载状态
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
                    const localData: LostItem = JSON.parse(Reflect.get(params, 'localPostData') as string);
                    this.loadLocalPostData(localData);
                    console.log('使用本地帖子数据，不加载评论');
                    // 本地帖子不加载评论，保持comments为空数组
                }
                catch (error) {
                    console.error('解析本地帖子数据失败:', error);
                    // 解析失败时仍尝试从API获取
                    this.checkNetworkConnection();
                    this.getItemDetail();
                    this.getCommentList();
                }
            }
            else {
                // 没有本地数据，从API获取
                this.checkNetworkConnection();
                this.getItemDetail();
                this.getCommentList();
            }
        }
        else {
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
        }
        catch (error) {
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
                    }
                    else if (description.includes('钱包')) {
                        category = '钱包';
                    }
                    else if (description.includes('钥匙')) {
                        category = '钥匙';
                    }
                    else if (description.includes('身份证')) {
                        category = '身份证';
                    }
                    else if (description.includes('书包')) {
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
                }
                else {
                    this.errorMessage = apiResponse.message || '获取物品详情失败';
                    console.error(`获取物品详情失败: code=${apiResponse.code}, message=${apiResponse.message}`);
                }
            }
            catch (parseError) {
                console.error(`解析物品详情JSON失败: ${parseError}`);
                this.errorMessage = '解析响应数据失败';
            }
        }
        catch (error) {
            this.errorMessage = '网络请求失败';
            console.error(`获取物品详情异常: ${error}`);
        }
        finally {
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
                }
                else {
                    console.error(`获取评论列表失败: code=${apiResponse.code}, message=${apiResponse.message}`);
                }
            }
            catch (parseError) {
                console.error(`解析评论列表JSON失败: ${parseError}`);
            }
        }
        catch (error) {
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
            const commentData: CreateCommentRequest = {
                content: this.newComment.trim(),
                postId: this.postId,
                images: [],
                commenterId: 'user_12651',
                id: '' // 评论ID由服务器生成
            };
            const response = await HttpUtils.post(url, commentData);
            const apiResponse: ApiResponse<ApiCommentData> = JSON.parse(response);
            if (apiResponse.code === 200 && apiResponse.data) {
                // 创建新评论
                // 创建符合CommentData接口的对象
                const newCommentData: CommentData = {
                    id: apiResponse.data.commentId || '',
                    userName: '我',
                    content: this.newComment.trim(),
                    time: apiResponse.data.createTime || new Date().toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    }).replace(/\//g, '-'),
                    avatar: 'https://dummyimage.com/600x600/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B',
                    postId: this.postId
                };
                // 添加到评论列表
                this.comments.push(newCommentData);
                // 清空输入框
                this.newComment = '';
                console.log('发表评论成功:', newCommentData.content);
            }
            else {
                console.error('发表评论失败:', apiResponse.message);
            }
        }
        catch (error) {
            console.error('发表评论异常:', error);
        }
    }
    // 获取状态文本
    getStatusText(): string {
        const status = this.itemData.status || 'searching'; // 默认为寻找中
        if (this.itemData.type === '寻物') {
            return status === '已找到' ? '已找到' : '寻找中';
        }
        else {
            return status === '已找到' ? '已认领' : '待认领';
        }
    }
    // 获取状态颜色
    getStatusColor(): string {
        const status = this.itemData.status || 'searching'; // 默认为寻找中
        return status === '已找到' ? '#51cf66' : '#ff9500';
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(292:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.bindContentCover(this.showClaimDialog, { builder: () => {
                    this.ClaimDialogBuilder.call(this);
                } }, {
                modalTransition: ModalTransition.NONE,
                backgroundColor: Color.Transparent,
                onAppear: () => {
                    console.log('认领弹窗显示');
                },
                onDisappear: () => {
                    console.log('认领弹窗隐藏');
                    this.claimPhoneNumber = ''; // 清空输入
                }
            });
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
                        title: '物品详情',
                        showBack: true,
                        showAction: false,
                        onBack: () => {
                            router.back();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/DetailPage.ets", line: 294, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '物品详情',
                            showBack: true,
                            showAction: false,
                            onBack: () => {
                                router.back();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '物品详情',
                        showBack: true,
                        showAction: false
                    });
                }
            }, { name: "HeaderBar" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区域
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/DetailPage.ets(305:7)", "entry");
            // 内容区域
            Scroll.layoutWeight(1);
            // 内容区域
            Scroll.backgroundColor('#f8f9fa');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(306:9)", "entry");
            Column.width('100%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 图片展示区域
            if (this.itemData.images.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(309:13)", "entry");
                        Row.width('100%');
                        Row.margin({ bottom: 20 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const image = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Image.create(image);
                                Image.debugLine("entry/src/main/ets/pages/DetailPage.ets(311:17)", "entry");
                                Image.width(100);
                                Image.height(100);
                                Image.borderRadius(8);
                                Image.objectFit(ImageFit.Cover);
                                Image.backgroundColor({ "id": 125833939, "type": 10001, params: [], "bundleName": "com.pizza.lostfound", "moduleName": "entry" });
                                Image.alt('📱');
                                Image.onError(() => {
                                    console.error('图片加载失败:', image);
                                });
                                Image.margin({ right: 10 });
                            }, Image);
                        };
                        this.forEachUpdateFunction(elmtId, this.itemData.images, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                });
            }
            // 基本信息卡片
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 基本信息卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(329:11)", "entry");
            // 基本信息卡片
            Column.width('100%');
            // 基本信息卡片
            Column.padding(20);
            // 基本信息卡片
            Column.backgroundColor(Color.White);
            // 基本信息卡片
            Column.borderRadius(12);
            // 基本信息卡片
            Column.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
            // 基本信息卡片
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题和状态
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(331:13)", "entry");
            // 标题和状态
            Row.width('100%');
            // 标题和状态
            Row.margin({ bottom: 15 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.itemData.title);
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(332:15)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.itemData.type === '寻物' ? '寻物启事' : '失物招领');
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(338:15)", "entry");
            Text.fontSize(14);
            Text.fontColor(Color.White);
            Text.backgroundColor(this.itemData.type === '寻物' ? '#ff6b6b' : '#51cf66');
            Text.borderRadius(12);
            Text.padding({ left: 10, right: 10, top: 4, bottom: 4 });
        }, Text);
        Text.pop();
        // 标题和状态
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 详细信息
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(349:13)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(350:15)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('分类：');
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(351:17)", "entry");
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.width(80);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.itemData.category);
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(355:17)", "entry");
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(363:15)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('地点：');
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(364:17)", "entry");
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.width(80);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.itemData.location);
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(368:17)", "entry");
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(376:15)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('时间：');
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(377:17)", "entry");
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.width(80);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.itemData.time);
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(381:17)", "entry");
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(389:15)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('发布者：');
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(390:17)", "entry");
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.width(80);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.itemData.publisher);
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(394:17)", "entry");
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
        // 详细信息
        Column.pop();
        // 基本信息卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 详细描述卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(410:11)", "entry");
            // 详细描述卡片
            Column.width('100%');
            // 详细描述卡片
            Column.padding(20);
            // 详细描述卡片
            Column.backgroundColor(Color.White);
            // 详细描述卡片
            Column.borderRadius(12);
            // 详细描述卡片
            Column.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
            // 详细描述卡片
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('详细描述');
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(411:13)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 15 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.itemData.description);
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(418:13)", "entry");
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.lineHeight(24);
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 15 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态标记
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(426:13)", "entry");
            // 状态标记
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getStatusText());
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(427:15)", "entry");
            Text.fontSize(14);
            Text.fontColor(Color.White);
            Text.backgroundColor(this.getStatusColor());
            Text.borderRadius(15);
            Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/DetailPage.ets(434:15)", "entry");
        }, Blank);
        Blank.pop();
        // 状态标记
        Row.pop();
        // 详细描述卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 联系方式卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(446:11)", "entry");
            // 联系方式卡片
            Column.width('100%');
            // 联系方式卡片
            Column.padding(20);
            // 联系方式卡片
            Column.backgroundColor(Color.White);
            // 联系方式卡片
            Column.borderRadius(12);
            // 联系方式卡片
            Column.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
            // 联系方式卡片
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('联系方式');
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(447:13)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 15 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.itemData.contactInfo);
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(454:13)", "entry");
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        // 联系方式卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评论区域
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(467:11)", "entry");
            // 评论区域
            Column.width('100%');
            // 评论区域
            Column.padding(20);
            // 评论区域
            Column.backgroundColor(Color.White);
            // 评论区域
            Column.borderRadius(12);
            // 评论区域
            Column.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
            // 评论区域
            Column.margin({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评论标题
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(469:13)", "entry");
            // 评论标题
            Row.width('100%');
            // 评论标题
            Row.margin({ bottom: 15 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('评论');
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(470:15)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`(${this.comments.length})`);
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(475:15)", "entry");
            Text.fontSize(16);
            Text.fontColor('#999999');
            Text.margin({ left: 5 });
        }, Text);
        Text.pop();
        // 评论标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 评论列表
            if (this.comments.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(485:15)", "entry");
                        Column.width('100%');
                        Column.margin({ bottom: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const comment = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(487:19)", "entry");
                                Column.width('100%');
                                Column.padding({ bottom: index < this.comments.length - 1 ? 15 : 0 });
                                Column.border({
                                    width: { bottom: index < this.comments.length - 1 ? 1 : 0 },
                                    color: '#f0f0f0'
                                });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 评论头部信息
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(489:21)", "entry");
                                // 评论头部信息
                                Row.width('100%');
                                // 评论头部信息
                                Row.margin({ bottom: 10 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 用户头像
                                Text.create('用');
                                Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(491:23)", "entry");
                                // 用户头像
                                Text.fontSize(12);
                                // 用户头像
                                Text.fontColor(Color.White);
                                // 用户头像
                                Text.width(32);
                                // 用户头像
                                Text.height(32);
                                // 用户头像
                                Text.borderRadius(18);
                                // 用户头像
                                Text.backgroundColor('#667eea');
                                // 用户头像
                                Text.textAlign(TextAlign.Center);
                            }, Text);
                            // 用户头像
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(500:23)", "entry");
                                Column.alignItems(HorizontalAlign.Start);
                                Column.margin({ left: 10 });
                                Column.layoutWeight(1);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(comment.userName);
                                Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(501:25)", "entry");
                                Text.fontSize(14);
                                Text.fontWeight(FontWeight.Medium);
                                Text.fontColor('#333333');
                                Text.alignSelf(ItemAlign.Start);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(comment.time);
                                Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(507:25)", "entry");
                                Text.fontSize(12);
                                Text.fontColor('#999999');
                                Text.alignSelf(ItemAlign.Start);
                                Text.margin({ top: 2 });
                            }, Text);
                            Text.pop();
                            Column.pop();
                            // 评论头部信息
                            Row.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 评论内容
                                Text.create(comment.content);
                                Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(521:21)", "entry");
                                // 评论内容
                                Text.fontSize(15);
                                // 评论内容
                                Text.fontColor('#333333');
                                // 评论内容
                                Text.lineHeight(22);
                                // 评论内容
                                Text.alignSelf(ItemAlign.Start);
                                // 评论内容
                                Text.margin({ left: 42 });
                            }, Text);
                            // 评论内容
                            Text.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.comments, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无评论，快来发表第一条评论吧~');
                        Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(539:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.textAlign(TextAlign.Center);
                        Text.width('100%');
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评论输入区域
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(548:13)", "entry");
            // 评论输入区域
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(549:15)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '写下你的评论...', text: this.newComment });
            TextInput.debugLine("entry/src/main/ets/pages/DetailPage.ets(550:17)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(40);
            TextInput.fontSize(14);
            TextInput.backgroundColor('#f8f9fa');
            TextInput.borderRadius(20);
            TextInput.padding({ left: 15, right: 15 });
            TextInput.border({ width: this.isCommentFocused ? 1 : 0, color: '#667eea' });
            TextInput.onChange((value: string) => {
                this.newComment = value;
            });
            TextInput.onFocus(() => {
                this.isCommentFocused = true;
            });
            TextInput.onBlur(() => {
                this.isCommentFocused = false;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('发送');
            Button.debugLine("entry/src/main/ets/pages/DetailPage.ets(568:17)", "entry");
            Button.width(60);
            Button.height(40);
            Button.fontSize(14);
            Button.fontColor(this.newComment.trim() ? Color.White : '#999999');
            Button.backgroundColor(this.newComment.trim() ? '#667eea' : '#f0f0f0');
            Button.borderRadius(20);
            Button.margin({ left: 10 });
            Button.enabled(this.newComment.trim().length > 0);
            Button.onClick(() => {
                this.sendComment();
            });
        }, Button);
        Button.pop();
        Row.pop();
        // 评论输入区域
        Column.pop();
        // 评论区域
        Column.pop();
        Column.pop();
        // 内容区域
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部操作栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(599:7)", "entry");
            // 底部操作栏
            Row.width('100%');
            // 底部操作栏
            Row.padding({ left: 20, right: 20, top: 15, bottom: 15 });
            // 底部操作栏
            Row.backgroundColor(Color.White);
            // 底部操作栏
            Row.border({ width: { top: 1 }, color: '#e0e0e0' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('私信Ta');
            Button.debugLine("entry/src/main/ets/pages/DetailPage.ets(600:9)", "entry");
            Button.width(80);
            Button.height(44);
            Button.fontSize(14);
            Button.fontColor('#666666');
            Button.backgroundColor({ "id": 125833939, "type": 10001, params: [], "bundleName": "com.pizza.lostfound", "moduleName": "entry" });
            Button.borderRadius(8);
            Button.onClick(() => {
                router.pushUrl({
                    url: 'pages/ChatPage',
                    params: {
                        contactName: this.itemData.publisher || '用户',
                        contactAvatar: this.itemData.publisher ? this.itemData.publisher.charAt(0) : '用',
                        otherUserId: this.itemData.publisher || 'unknown_user'
                    }
                });
                console.log('私信详情页');
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 根据物品类型和状态显示不同的按钮文本和状态
            if (this.itemData.status === '已找到') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 已找到/已认领状态
                        Button.createWithLabel('已找到');
                        Button.debugLine("entry/src/main/ets/pages/DetailPage.ets(622:11)", "entry");
                        // 已找到/已认领状态
                        Button.layoutWeight(1);
                        // 已找到/已认领状态
                        Button.height(44);
                        // 已找到/已认领状态
                        Button.fontSize(16);
                        // 已找到/已认领状态
                        Button.fontColor(Color.White);
                        // 已找到/已认领状态
                        Button.backgroundColor('#51cf66');
                        // 已找到/已认领状态
                        Button.borderRadius(8);
                        // 已找到/已认领状态
                        Button.margin({ left: 15 });
                        // 已找到/已认领状态
                        Button.enabled(false);
                    }, Button);
                    // 已找到/已认领状态
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 寻找中/待认领状态
                        Button.createWithLabel(this.itemData.type === '寻物' ? '确认找到' : '认领');
                        Button.debugLine("entry/src/main/ets/pages/DetailPage.ets(633:11)", "entry");
                        // 寻找中/待认领状态
                        Button.layoutWeight(1);
                        // 寻找中/待认领状态
                        Button.height(44);
                        // 寻找中/待认领状态
                        Button.fontSize(16);
                        // 寻找中/待认领状态
                        Button.fontColor(Color.White);
                        // 寻找中/待认领状态
                        Button.linearGradient({
                            angle: 135,
                            colors: [['#667eea', 0], ['#764ba2', 1]]
                        });
                        // 寻找中/待认领状态
                        Button.borderRadius(8);
                        // 寻找中/待认领状态
                        Button.margin({ left: 15 });
                        // 寻找中/待认领状态
                        Button.onClick(() => {
                            this.showClaimDialog = true;
                        });
                    }, Button);
                    // 寻找中/待认领状态
                    Button.pop();
                });
            }
        }, If);
        If.pop();
        // 底部操作栏
        Row.pop();
        Column.pop();
    }
    // 认领弹窗构建器
    ClaimDialogBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(672:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 遮罩层
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(674:7)", "entry");
            // 遮罩层
            Column.width('100%');
            // 遮罩层
            Column.height('100%');
            // 遮罩层
            Column.backgroundColor('rgba(0, 0, 0, 0.5)');
            // 遮罩层
            Column.onClick(() => {
                this.showClaimDialog = false;
            });
        }, Column);
        // 遮罩层
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 弹窗内容
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(683:7)", "entry");
            // 弹窗内容
            Column.width('85%');
            // 弹窗内容
            Column.padding(25);
            // 弹窗内容
            Column.backgroundColor(Color.White);
            // 弹窗内容
            Column.borderRadius(12);
            // 弹窗内容
            Column.shadow({ radius: 8, color: '#00000020', offsetX: 0, offsetY: 4 });
            // 弹窗内容
            Column.position({ x: '50%', y: '50%' });
            // 弹窗内容
            Column.translate({ x: '-50%', y: '-50%' });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 弹窗标题 - 根据物品类型显示不同标题
            Text.create(this.itemData.type === '寻物' ? '确认找到物品' : '认领物品');
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(685:9)", "entry");
            // 弹窗标题 - 根据物品类型显示不同标题
            Text.fontSize(18);
            // 弹窗标题 - 根据物品类型显示不同标题
            Text.fontWeight(FontWeight.Bold);
            // 弹窗标题 - 根据物品类型显示不同标题
            Text.fontColor('#333333');
            // 弹窗标题 - 根据物品类型显示不同标题
            Text.margin({ bottom: 20 });
        }, Text);
        // 弹窗标题 - 根据物品类型显示不同标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 物品信息
            Text.create(this.itemData.type === '寻物' ?
                `确认找到：${this.itemData.title}` :
                `确认认领：${this.itemData.title}`);
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(692:9)", "entry");
            // 物品信息
            Text.fontSize(16);
            // 物品信息
            Text.fontColor('#666666');
            // 物品信息
            Text.margin({ bottom: 15 });
        }, Text);
        // 物品信息
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手机号输入
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/DetailPage.ets(700:9)", "entry");
            // 手机号输入
            Column.width('100%');
            // 手机号输入
            Column.margin({ bottom: 25 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('请输入您的手机号码');
            Text.debugLine("entry/src/main/ets/pages/DetailPage.ets(701:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({
                placeholder: '请输入11位手机号码',
                text: this.claimPhoneNumber
            });
            TextInput.debugLine("entry/src/main/ets/pages/DetailPage.ets(707:11)", "entry");
            TextInput.width('100%');
            TextInput.height(44);
            TextInput.fontSize(16);
            TextInput.backgroundColor('#f8f9fa');
            TextInput.borderRadius(8);
            TextInput.padding({ left: 15, right: 15 });
            TextInput.border({ width: 1, color: '#e0e0e0' });
            TextInput.type(InputType.PhoneNumber);
            TextInput.maxLength(11);
            TextInput.onChange((value: string) => {
                this.claimPhoneNumber = value;
            });
        }, TextInput);
        // 手机号输入
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/DetailPage.ets(728:9)", "entry");
            // 操作按钮
            Row.width('100%');
            // 操作按钮
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/pages/DetailPage.ets(729:11)", "entry");
            Button.width(100);
            Button.height(40);
            Button.fontSize(16);
            Button.fontColor('#666666');
            Button.backgroundColor({ "id": 125833939, "type": 10001, params: [], "bundleName": "com.pizza.lostfound", "moduleName": "entry" });
            Button.borderRadius(8);
            Button.onClick(() => {
                this.showClaimDialog = false;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.itemData.type === '寻物' ? '确认找到' : '确认认领');
            Button.debugLine("entry/src/main/ets/pages/DetailPage.ets(740:11)", "entry");
            Button.width(120);
            Button.height(40);
            Button.fontSize(16);
            Button.fontColor(Color.White);
            Button.backgroundColor(this.isValidPhoneNumber() ? '#667eea' : '#cccccc');
            Button.borderRadius(8);
            Button.margin({ left: 15 });
            Button.enabled(this.isValidPhoneNumber());
            Button.onClick(() => {
                this.confirmClaim();
            });
        }, Button);
        Button.pop();
        // 操作按钮
        Row.pop();
        // 弹窗内容
        Column.pop();
        Column.pop();
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
            const claimData: CreateClaimRequest = {
                claimerId: 'user_12345',
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
            }
            else {
                console.error('认领失败:', apiResponse.message);
            }
        }
        catch (error) {
            console.error('认领请求异常:', error);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "DetailPage";
    }
}
registerNamedRoute(() => new DetailPage(undefined, {}), "", { bundleName: "com.pizza.lostfound", moduleName: "entry", pagePath: "pages/DetailPage", pageFullPath: "entry/src/main/ets/pages/DetailPage", integratedHsp: "false", moduleType: "followWithHap" });
