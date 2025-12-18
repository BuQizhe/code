if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MessagePage_Params {
    currentTab?: number;
    messages?: MessageItem[];
    isLoading?: boolean;
    baseUrl?: string;
    currentUserId?: string;
    tabs?: string[];
}
import router from "@ohos:router";
import type { MessageItem } from "../po/MessageItem";
import { HeaderBar, BottomTabBar, NavigationUtils } from "@normalized:N&&&entry/src/main/ets/components/CommonComponents&";
import { HttpUtils } from "@normalized:N&&&entry/src/main/ets/utils/HttpUtils&";
import type { ApiResponse, ApiNotificationData, NotificationListResponse, MarkReadRequest } from '../po/CommonTypes';
class MessagePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentTab = new ObservedPropertySimplePU(0, this, "currentTab");
        this.__messages = new ObservedPropertyObjectPU([], this, "messages");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.baseUrl = 'http://rap2api.taobao.org/app/mock/323891';
        this.currentUserId = 'user_12345';
        this.tabs = ['全部', '评论', '私信'];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MessagePage_Params) {
        if (params.currentTab !== undefined) {
            this.currentTab = params.currentTab;
        }
        if (params.messages !== undefined) {
            this.messages = params.messages;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.baseUrl !== undefined) {
            this.baseUrl = params.baseUrl;
        }
        if (params.currentUserId !== undefined) {
            this.currentUserId = params.currentUserId;
        }
        if (params.tabs !== undefined) {
            this.tabs = params.tabs;
        }
    }
    updateStateVars(params: MessagePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentTab.purgeDependencyOnElmtId(rmElmtId);
        this.__messages.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentTab.aboutToBeDeleted();
        this.__messages.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentTab: ObservedPropertySimplePU<number>;
    get currentTab() {
        return this.__currentTab.get();
    }
    set currentTab(newValue: number) {
        this.__currentTab.set(newValue);
    }
    private __messages: ObservedPropertyObjectPU<MessageItem[]>;
    get messages() {
        return this.__messages.get();
    }
    set messages(newValue: MessageItem[]) {
        this.__messages.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    // API配置
    private baseUrl: string;
    private currentUserId: string; // 当前用户ID，实际应用中应从用户状态获取
    private tabs: string[];
    // 页面初始化
    aboutToAppear(): void {
        this.loadNotifications();
    }
    // 加载消息通知列表
    async loadNotifications(): Promise<void> {
        try {
            this.isLoading = true;
            const url = `${this.baseUrl}/api/notification/list?userId=${this.currentUserId}`;
            const response = await HttpUtils.get(url);
            const apiResponse = JSON.parse(response as string) as ApiResponse<NotificationListResponse>;
            if (apiResponse.code === 200 && apiResponse.data) {
                this.messages = apiResponse.data.messageList.map((notification: ApiNotificationData) => {
                    return {
                        id: notification.messageId,
                        avatar: this.getAvatarByType(notification.messageType),
                        title: this.getTitleByType(notification.messageType, notification.content, notification.senderName),
                        preview: notification.content,
                        time: this.formatTime(notification.sendTime),
                        unreadCount: notification.isRead ? 0 : 1,
                        type: this.mapMessageType(notification.messageType),
                        senderId: notification.senderId
                    } as MessageItem;
                });
            }
            else {
                console.error('获取消息通知失败:', apiResponse.message);
            }
        }
        catch (error) {
            console.error('加载消息通知出错:', error);
        }
        finally {
            this.isLoading = false;
        }
    }
    // 根据消息类型获取头像
    private getAvatarByType(messageType: string): string {
        switch (messageType) {
            case '评论':
                return '💬';
            case '私信':
                return '📩';
            default:
                return '🔔';
        }
    }
    // 根据消息类型和内容生成标题
    private getTitleByType(messageType: string, _content: string, senderName?: string): string {
        switch (messageType) {
            case '评论':
                return '评论通知';
            case '私信':
                return senderName || '私信消息';
            default:
                return '系统通知';
        }
    }
    // 映射消息类型
    private mapMessageType(messageType: string): 'comment' | 'private' | 'system' {
        switch (messageType) {
            case '评论':
                return 'comment';
            case '私信':
                return 'private';
            default:
                return 'system';
        }
    }
    // 格式化时间
    private formatTime(timeStr: string): string {
        const messageTime = new Date(timeStr);
        const now = new Date();
        const diffMs = now.getTime() - messageTime.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        if (diffHours < 1) {
            return '刚刚';
        }
        else if (diffHours < 24) {
            return `${diffHours}小时前`;
        }
        else if (diffDays === 1) {
            return '昨天';
        }
        else if (diffDays < 7) {
            return `${diffDays}天前`;
        }
        else {
            return messageTime.toLocaleDateString();
        }
    }
    // 标记消息已读
    async markAsRead(messageId: string): Promise<void> {
        try {
            const url = `${this.baseUrl}/api/notification/read`;
            const data: MarkReadRequest = { messageId };
            const response = await HttpUtils.post(url, data);
            const apiResponse = JSON.parse(response as string) as ApiResponse<object>;
            if (apiResponse.code === 200) {
                // 更新本地消息状态
                const updatedMessages: MessageItem[] = [];
                for (const msg of this.messages) {
                    if (msg.id === messageId) {
                        updatedMessages.push({
                            id: msg.id,
                            avatar: msg.avatar,
                            title: msg.title,
                            preview: msg.preview,
                            time: msg.time,
                            unreadCount: 0,
                            type: msg.type,
                            senderId: msg.senderId
                        });
                    }
                    else {
                        updatedMessages.push(msg);
                    }
                }
                this.messages = updatedMessages;
            }
            else {
                console.error('标记已读失败:', apiResponse.message);
            }
        }
        catch (error) {
            console.error('标记已读出错:', error);
        }
    }
    // 根据当前标签筛选消息
    getFilteredMessages(): MessageItem[] {
        if (this.currentTab === 0) {
            return this.messages; // 全部
        }
        else if (this.currentTab === 1) {
            return this.messages.filter(msg => msg.type === 'comment'); // 评论
        }
        else {
            return this.messages.filter(msg => msg.type === 'private'); // 私信
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f8f9fa');
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
                        title: '消息',
                        showBack: false,
                        showAction: true,
                        actionText: '👤',
                        onAction: () => {
                            router.pushUrl({ url: 'pages/ProfilePage' });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MessagePage.ets", line: 165, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '消息',
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
                        title: '消息',
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
            Column.layoutWeight(1);
            // 内容区域
            Column.backgroundColor('#f8f9fa');
        }, Column);
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
            Row.margin({ left: 20, right: 20, top: 20, bottom: 0 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab);
                    Text.fontSize(14);
                    Text.fontColor(index === this.currentTab ? '#667eea' : '#666666');
                    Text.fontWeight(index === this.currentTab ? FontWeight.Medium : FontWeight.Normal);
                    Text.padding({ top: 8, bottom: 8 });
                    Text.layoutWeight(1);
                    Text.textAlign(TextAlign.Center);
                    Text.backgroundColor(index === this.currentTab ? Color.White : Color.Transparent);
                    Text.borderRadius(6);
                    Text.onClick(() => {
                        this.currentTab = index;
                        // 切换标签时可以选择性刷新数据
                        // this.loadNotifications();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabs, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // 筛选标签
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 消息列表
            if (this.isLoading && this.messages.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 加载状态
                        Column.create();
                        // 加载状态
                        Column.width('100%');
                        // 加载状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                        Text.margin({ top: 50 });
                    }, Text);
                    Text.pop();
                    // 加载状态
                    Column.pop();
                });
            }
            else if (this.getFilteredMessages().length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 空状态
                        Column.create();
                        // 空状态
                        Column.width('100%');
                        // 空状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无消息');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                        Text.margin({ top: 50 });
                    }, Text);
                    Text.pop();
                    // 空状态
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.width('100%');
                        List.height('100%');
                        List.layoutWeight(1);
                        List.scrollBar(BarState.Off);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const message = _item;
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
                                    ListItem.backgroundColor(Color.White);
                                    ListItem.border({ width: { bottom: 1 }, color: '#eeeeee' });
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.width('100%');
                                        Row.padding(16);
                                        Row.alignItems(VerticalAlign.Center);
                                        Row.onClick(() => {
                                            // 标记消息已读
                                            if (message.unreadCount && message.unreadCount > 0) {
                                                this.markAsRead(message.id);
                                            }
                                            if (message.type === 'private') {
                                                // 跳转到私信详情页
                                                router.pushUrl({
                                                    url: 'pages/ChatPage',
                                                    params: {
                                                        contactName: message.title,
                                                        contactAvatar: message.title ? message.title.charAt(0) : '用',
                                                        otherUserId: message.senderId || 'unknown_user'
                                                    }
                                                });
                                            }
                                            else if (message.type === 'comment') {
                                                // 跳转到评论详情页
                                                router.pushUrl({
                                                    url: 'pages/DetailPage',
                                                    params: {
                                                        postId: 'post_2134'
                                                    }
                                                });
                                            }
                                            else {
                                                console.log(`点击消息: ${message.title}`);
                                            }
                                        });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        // 头像
                                        if (message.avatar === '🔔') {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(message.avatar);
                                                    Text.fontSize(20);
                                                    Text.width(40);
                                                    Text.height(40);
                                                    Text.borderRadius(20);
                                                    Text.backgroundColor('#667eea');
                                                    Text.fontColor(Color.White);
                                                    Text.textAlign(TextAlign.Center);
                                                    Text.margin({ right: 12 });
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(message.avatar);
                                                    Text.fontSize(16);
                                                    Text.fontColor(Color.White);
                                                    Text.width(40);
                                                    Text.height(40);
                                                    Text.borderRadius(20);
                                                    Text.backgroundColor('#667eea');
                                                    Text.textAlign(TextAlign.Center);
                                                    Text.margin({ right: 12 });
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 消息内容
                                        Column.create();
                                        // 消息内容
                                        Column.alignItems(HorizontalAlign.Start);
                                        // 消息内容
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(message.title);
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Medium);
                                        Text.fontColor('#333333');
                                        Text.alignSelf(ItemAlign.Start);
                                        Text.margin({ bottom: 4 });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(message.preview);
                                        Text.fontSize(14);
                                        Text.fontColor('#666666');
                                        Text.alignSelf(ItemAlign.Start);
                                        Text.maxLines(1);
                                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    }, Text);
                                    Text.pop();
                                    // 消息内容
                                    Column.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 右侧时间和未读标识
                                        Column.create();
                                        // 右侧时间和未读标识
                                        Column.alignItems(HorizontalAlign.End);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(message.time);
                                        Text.fontSize(12);
                                        Text.fontColor('#999999');
                                        Text.alignSelf(ItemAlign.End);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (message.unreadCount && message.unreadCount > 0) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(message.unreadCount.toString());
                                                    Text.fontSize(12);
                                                    Text.fontColor(Color.White);
                                                    Text.backgroundColor('#dc3545');
                                                    Text.borderRadius(10);
                                                    Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                                    Text.margin({ top: 8 });
                                                    Text.alignSelf(ItemAlign.End);
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
                                    // 右侧时间和未读标识
                                    Column.pop();
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.getFilteredMessages(), forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        // 内容区域
        Column.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 底部导航 - 使用CommonComponents
                    BottomTabBar(this, {
                        currentIndex: 2,
                        onTabClick: (index: number) => {
                            NavigationUtils.handleTabNavigation(index, 2);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MessagePage.ets", line: 337, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            currentIndex: 2,
                            onTabClick: (index: number) => {
                                NavigationUtils.handleTabNavigation(index, 2);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        currentIndex: 2
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
        return "MessagePage";
    }
}
registerNamedRoute(() => new MessagePage(undefined, {}), "", { bundleName: "com.pizza.lostfound", moduleName: "entry", pagePath: "pages/MessagePage", pageFullPath: "entry/src/main/ets/pages/MessagePage", integratedHsp: "false", moduleType: "followWithHap" });
