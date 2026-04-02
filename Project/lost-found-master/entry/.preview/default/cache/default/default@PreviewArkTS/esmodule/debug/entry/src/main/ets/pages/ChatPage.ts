if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ChatPage_Params {
    contactName?: string;
    contactAvatar?: string;
    inputText?: string;
    messages?: ChatMessage[];
    currentUserId?: string;
    otherUserId?: string;
    baseUrl?: string;
}
import router from "@ohos:router";
import type { ChatMessage } from "../po/ChatMessage";
import { HeaderBar } from "@normalized:N&&&entry/src/main/ets/components/CommonComponents&";
import { HttpUtils } from "@normalized:N&&&entry/src/main/ets/utils/HttpUtils&";
import type { ApiResponse, ApiMessageData, SendMessageRequest, SendMessageResponse } from '../po/CommonTypes';
class ChatPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__contactName = new ObservedPropertySimplePU('王同学', this, "contactName");
        this.__contactAvatar = new ObservedPropertySimplePU('王', this, "contactAvatar");
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.__messages = new ObservedPropertyObjectPU([], this, "messages");
        this.__currentUserId = new ObservedPropertySimplePU('user_12345', this, "currentUserId");
        this.__otherUserId = new ObservedPropertySimplePU('user_67890', this, "otherUserId");
        this.baseUrl = 'http://rap2api.taobao.org/app/mock/323891';
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ChatPage_Params) {
        if (params.contactName !== undefined) {
            this.contactName = params.contactName;
        }
        if (params.contactAvatar !== undefined) {
            this.contactAvatar = params.contactAvatar;
        }
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
        if (params.messages !== undefined) {
            this.messages = params.messages;
        }
        if (params.currentUserId !== undefined) {
            this.currentUserId = params.currentUserId;
        }
        if (params.otherUserId !== undefined) {
            this.otherUserId = params.otherUserId;
        }
        if (params.baseUrl !== undefined) {
            this.baseUrl = params.baseUrl;
        }
    }
    updateStateVars(params: ChatPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__contactName.purgeDependencyOnElmtId(rmElmtId);
        this.__contactAvatar.purgeDependencyOnElmtId(rmElmtId);
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__messages.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUserId.purgeDependencyOnElmtId(rmElmtId);
        this.__otherUserId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__contactName.aboutToBeDeleted();
        this.__contactAvatar.aboutToBeDeleted();
        this.__inputText.aboutToBeDeleted();
        this.__messages.aboutToBeDeleted();
        this.__currentUserId.aboutToBeDeleted();
        this.__otherUserId.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __contactName: ObservedPropertySimplePU<string>;
    get contactName() {
        return this.__contactName.get();
    }
    set contactName(newValue: string) {
        this.__contactName.set(newValue);
    }
    private __contactAvatar: ObservedPropertySimplePU<string>;
    get contactAvatar() {
        return this.__contactAvatar.get();
    }
    set contactAvatar(newValue: string) {
        this.__contactAvatar.set(newValue);
    }
    private __inputText: ObservedPropertySimplePU<string>;
    get inputText() {
        return this.__inputText.get();
    }
    set inputText(newValue: string) {
        this.__inputText.set(newValue);
    }
    private __messages: ObservedPropertyObjectPU<ChatMessage[]>;
    get messages() {
        return this.__messages.get();
    }
    set messages(newValue: ChatMessage[]) {
        this.__messages.set(newValue);
    }
    private __currentUserId: ObservedPropertySimplePU<string>; // 当前用户ID
    get currentUserId() {
        return this.__currentUserId.get();
    }
    set currentUserId(newValue: string) {
        this.__currentUserId.set(newValue);
    }
    private __otherUserId: ObservedPropertySimplePU<string>; // 对方用户ID
    get otherUserId() {
        return this.__otherUserId.get();
    }
    set otherUserId(newValue: string) {
        this.__otherUserId.set(newValue);
    }
    private baseUrl: string;
    aboutToAppear() {
        // 获取路由参数
        const params = router.getParams();
        if (params) {
            this.contactName = Reflect.get(params, 'contactName') as string || '王同学';
            this.contactAvatar = Reflect.get(params, 'contactAvatar') as string || '王';
            // 兼容旧的receiverId参数和新的otherUserId参数
            this.otherUserId = Reflect.get(params, 'otherUserId') as string ||
                Reflect.get(params, 'receiverId') as string ||
                'user_67890';
        }
        // 加载对话历史
        this.loadConversation();
    }
    // 加载对话历史
    async loadConversation() {
        try {
            const url = `${this.baseUrl}/api/message/conversation?userId=${this.currentUserId}&otherUserId=${this.otherUserId}`;
            const response = await HttpUtils.get(url);
            const apiResponse: ApiResponse<ApiMessageData[]> = JSON.parse(response);
            if (apiResponse.code === 200 && apiResponse.data) {
                this.messages = apiResponse.data.map((msg: ApiMessageData): ChatMessage => {
                    return {
                        id: msg.messageId,
                        content: msg.content,
                        time: this.formatTime(msg.sendTime),
                        isSent: msg.senderId === this.currentUserId
                    };
                });
            }
            else {
                console.error('获取对话历史失败:', apiResponse.message);
            }
        }
        catch (error) {
            console.error('加载对话历史出错:', error);
        }
    }
    // 格式化时间
    formatTime(timeStr: string): string {
        try {
            const date = new Date(timeStr);
            return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
        catch (error) {
            return timeStr;
        }
    }
    // 发送消息
    async sendMessage() {
        if (this.inputText.trim()) {
            const content = this.inputText.trim();
            this.inputText = ''; // 先清空输入框
            // 先添加到本地显示
            const tempMessage: ChatMessage = {
                id: Date.now().toString(),
                content: content,
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                isSent: true
            };
            this.messages.push(tempMessage);
            try {
                // 发送到服务器
                const url = `${this.baseUrl}/api/message/send`;
                const requestData: SendMessageRequest = {
                    content: content,
                    senderId: this.currentUserId,
                    receiverId: this.otherUserId,
                    images: []
                };
                const response = await HttpUtils.post(url, requestData);
                const apiResponse: ApiResponse<SendMessageResponse> = JSON.parse(response);
                if (apiResponse.code === 200 && apiResponse.data) {
                    console.log('消息发送成功:', apiResponse.data);
                    // 更新消息ID为服务器返回的ID
                    const lastIndex = this.messages.length - 1;
                    if (lastIndex >= 0) {
                        this.messages[lastIndex].id = apiResponse.data.messageId;
                    }
                }
                else {
                    console.error('发送消息失败:', apiResponse.message);
                    // 发送失败，可以在这里添加重试逻辑或错误提示
                }
            }
            catch (error) {
                console.error('发送消息出错:', error);
                // 发送失败，可以在这里添加重试逻辑或错误提示
            }
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChatPage.ets(116:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f8f9fa');
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 头部导航 - 使用CommonComponents
                    HeaderBar(this, {
                        title: this.contactName,
                        showBack: true,
                        showAction: false,
                        onBack: () => {
                            router.back();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ChatPage.ets", line: 118, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: this.contactName,
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
                        title: this.contactName,
                        showBack: true,
                        showAction: false
                    });
                }
            }, { name: "HeaderBar" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 聊天内容区域
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChatPage.ets(128:7)", "entry");
            // 聊天内容区域
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 消息列表
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/ChatPage.ets(130:9)", "entry");
            // 消息列表
            Scroll.layoutWeight(1);
            // 消息列表
            Scroll.scrollBar(BarState.Off);
            // 消息列表
            Scroll.backgroundColor('#f8f9fa');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChatPage.ets(131:11)", "entry");
            Column.width('100%');
            Column.padding({ left: 15, right: 15, top: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const message = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (message.isSent) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 自己发送的消息（右侧）
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/ChatPage.ets(135:17)", "entry");
                                // 自己发送的消息（右侧）
                                Row.width('100%');
                                // 自己发送的消息（右侧）
                                Row.justifyContent(FlexAlign.End);
                                // 自己发送的消息（右侧）
                                Row.margin({ bottom: 15 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.debugLine("entry/src/main/ets/pages/ChatPage.ets(136:19)", "entry");
                                Column.alignItems(HorizontalAlign.End);
                                Column.margin({ right: 10 });
                                Column.constraintSize({ maxWidth: '70%' });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Stack.create();
                                Stack.debugLine("entry/src/main/ets/pages/ChatPage.ets(137:21)", "entry");
                                Stack.backgroundColor('#667eea');
                                Stack.borderRadius(15);
                            }, Stack);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(message.content);
                                Text.debugLine("entry/src/main/ets/pages/ChatPage.ets(138:23)", "entry");
                                Text.fontSize(16);
                                Text.fontColor(Color.White);
                                Text.padding(10);
                                Text.maxLines(10);
                                Text.textAlign(TextAlign.Start);
                            }, Text);
                            Text.pop();
                            Stack.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(message.time);
                                Text.debugLine("entry/src/main/ets/pages/ChatPage.ets(148:21)", "entry");
                                Text.fontSize(12);
                                Text.fontColor('#999999');
                                Text.margin({ top: 5 });
                                Text.alignSelf(ItemAlign.End);
                            }, Text);
                            Text.pop();
                            Column.pop();
                            // 自己发送的消息（右侧）
                            Row.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 对方发送的消息（左侧）
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/ChatPage.ets(163:17)", "entry");
                                // 对方发送的消息（左侧）
                                Row.width('100%');
                                // 对方发送的消息（左侧）
                                Row.justifyContent(FlexAlign.Start);
                                // 对方发送的消息（左侧）
                                Row.alignItems(VerticalAlign.Top);
                                // 对方发送的消息（左侧）
                                Row.margin({ bottom: 15 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 头像
                                Text.create(this.contactAvatar);
                                Text.debugLine("entry/src/main/ets/pages/ChatPage.ets(165:19)", "entry");
                                // 头像
                                Text.fontSize(16);
                                // 头像
                                Text.fontColor(Color.White);
                                // 头像
                                Text.width(36);
                                // 头像
                                Text.height(36);
                                // 头像
                                Text.borderRadius(18);
                                // 头像
                                Text.backgroundColor('#667eea');
                                // 头像
                                Text.textAlign(TextAlign.Center);
                                // 头像
                                Text.margin({ right: 10 });
                            }, Text);
                            // 头像
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.debugLine("entry/src/main/ets/pages/ChatPage.ets(175:19)", "entry");
                                Column.alignItems(HorizontalAlign.Start);
                                Column.constraintSize({ maxWidth: '70%' });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Stack.create();
                                Stack.debugLine("entry/src/main/ets/pages/ChatPage.ets(176:21)", "entry");
                                Stack.backgroundColor({ "id": 125833939, "type": 10001, params: [], "bundleName": "com.pizza.lostfound", "moduleName": "entry" });
                                Stack.borderRadius(15);
                            }, Stack);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(message.content);
                                Text.debugLine("entry/src/main/ets/pages/ChatPage.ets(177:23)", "entry");
                                Text.fontSize(16);
                                Text.fontColor('#333333');
                                Text.padding(10);
                                Text.maxLines(10);
                                Text.textAlign(TextAlign.Start);
                            }, Text);
                            Text.pop();
                            Stack.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(message.time);
                                Text.debugLine("entry/src/main/ets/pages/ChatPage.ets(187:21)", "entry");
                                Text.fontSize(12);
                                Text.fontColor('#999999');
                                Text.margin({ top: 5 });
                                Text.alignSelf(ItemAlign.Start);
                            }, Text);
                            Text.pop();
                            Column.pop();
                            // 对方发送的消息（左侧）
                            Row.pop();
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, this.messages, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        // 消息列表
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 输入框区域
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ChatPage.ets(211:9)", "entry");
            // 输入框区域
            Row.width('100%');
            // 输入框区域
            Row.padding({ left: 15, right: 15, top: 15, bottom: 15 });
            // 输入框区域
            Row.backgroundColor(Color.White);
            // 输入框区域
            Row.border({ width: { top: 1 }, color: '#eeeeee' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '输入消息...', text: this.inputText });
            TextInput.debugLine("entry/src/main/ets/pages/ChatPage.ets(212:11)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(40);
            TextInput.fontSize(16);
            TextInput.borderRadius(20);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: '#dddddd' });
            TextInput.padding({ left: 15, right: 15 });
            TextInput.onChange((value: string) => {
                this.inputText = value;
            });
            TextInput.onSubmit(() => {
                this.sendMessage();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('发送');
            Button.debugLine("entry/src/main/ets/pages/ChatPage.ets(227:11)", "entry");
            Button.fontSize(16);
            Button.fontColor(Color.White);
            Button.backgroundColor('#667eea');
            Button.borderRadius(20);
            Button.padding({ left: 20, right: 20, top: 10, bottom: 10 });
            Button.margin({ left: 10 });
            Button.onClick(() => {
                this.sendMessage();
            });
        }, Button);
        Button.pop();
        // 输入框区域
        Row.pop();
        // 聊天内容区域
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ChatPage";
    }
}
registerNamedRoute(() => new ChatPage(undefined, {}), "", { bundleName: "com.pizza.lostfound", moduleName: "entry", pagePath: "pages/ChatPage", pageFullPath: "entry/src/main/ets/pages/ChatPage", integratedHsp: "false", moduleType: "followWithHap" });
