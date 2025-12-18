if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProfilePage_Params {
    userInfo?: UserInfo;
    searchingCount?: number;
    foundCount?: number;
    helpOthersCount?: number;
    isLoading?: boolean;
    errorMessage?: string;
}
import router from "@ohos:router";
import { HeaderBar, BottomTabBar, NavigationUtils } from "@normalized:N&&&entry/src/main/ets/components/CommonComponents&";
import type { UserInfo, ApiUserInfo } from "../po/UserInfo";
import { HttpUtils } from "@normalized:N&&&entry/src/main/ets/utils/HttpUtils&";
import type { ApiResponse } from "../po/CommonTypes";
import { API_BASE_URL } from "@normalized:N&&&entry/src/main/ets/utils/Common&";
class ProfilePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__userInfo = new ObservedPropertyObjectPU({
            avatar: '👤',
            username: '加载中...',
            phone: '加载中...',
            joinDate: '加载中...',
            publishCount: 5,
            foundCount: 3
        }, this, "userInfo");
        this.__searchingCount = new ObservedPropertySimplePU(3, this, "searchingCount");
        this.__foundCount = new ObservedPropertySimplePU(5, this, "foundCount");
        this.__helpOthersCount = new ObservedPropertySimplePU(2, this, "helpOthersCount");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProfilePage_Params) {
        if (params.userInfo !== undefined) {
            this.userInfo = params.userInfo;
        }
        if (params.searchingCount !== undefined) {
            this.searchingCount = params.searchingCount;
        }
        if (params.foundCount !== undefined) {
            this.foundCount = params.foundCount;
        }
        if (params.helpOthersCount !== undefined) {
            this.helpOthersCount = params.helpOthersCount;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
    }
    updateStateVars(params: ProfilePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__userInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__searchingCount.purgeDependencyOnElmtId(rmElmtId);
        this.__foundCount.purgeDependencyOnElmtId(rmElmtId);
        this.__helpOthersCount.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__userInfo.aboutToBeDeleted();
        this.__searchingCount.aboutToBeDeleted();
        this.__foundCount.aboutToBeDeleted();
        this.__helpOthersCount.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __userInfo: ObservedPropertyObjectPU<UserInfo>;
    get userInfo() {
        return this.__userInfo.get();
    }
    set userInfo(newValue: UserInfo) {
        this.__userInfo.set(newValue);
    }
    private __searchingCount: ObservedPropertySimplePU<number>;
    get searchingCount() {
        return this.__searchingCount.get();
    }
    set searchingCount(newValue: number) {
        this.__searchingCount.set(newValue);
    }
    private __foundCount: ObservedPropertySimplePU<number>;
    get foundCount() {
        return this.__foundCount.get();
    }
    set foundCount(newValue: number) {
        this.__foundCount.set(newValue);
    }
    private __helpOthersCount: ObservedPropertySimplePU<number>;
    get helpOthersCount() {
        return this.__helpOthersCount.get();
    }
    set helpOthersCount(newValue: number) {
        this.__helpOthersCount.set(newValue);
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
    // 组件初始化时获取用户信息
    aboutToAppear() {
        this.loadUserProfile();
    }
    // 获取用户信息
    private async loadUserProfile() {
        try {
            this.isLoading = true;
            this.errorMessage = '';
            // 模拟用户ID，实际应用中应该从登录状态获取
            const userId = 'user_12345';
            const url = `${API_BASE_URL}/api/user/profile?userId=${userId}`;
            const response = await HttpUtils.get(url);
            const apiResponse: ApiResponse<ApiUserInfo> = JSON.parse(response);
            if (apiResponse.code === 200 && apiResponse.data) {
                const userData = apiResponse.data;
                this.userInfo = {
                    avatar: userData.avatar || '👤',
                    username: userData.username || '未知用户',
                    phone: userData.phone || '未绑定',
                    joinDate: userData.registerTime ? userData.registerTime.split(' ')[0] : '未知',
                    publishCount: this.userInfo.publishCount,
                    foundCount: this.userInfo.foundCount // 保持模拟数据
                };
            }
            else {
                this.errorMessage = apiResponse.message || '获取用户信息失败';
                console.error('获取用户信息失败:', apiResponse.message);
            }
        }
        catch (error) {
            this.errorMessage = '网络请求失败';
            console.error('获取用户信息失败:', error);
        }
        finally {
            this.isLoading = false;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
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
                        title: '个人中心',
                        showBack: false,
                        showAction: false
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ProfilePage.ets", line: 71, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '个人中心',
                            showBack: false,
                            showAction: false
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '个人中心',
                        showBack: false,
                        showAction: false
                    });
                }
            }, { name: "HeaderBar" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区域
            Scroll.create();
            // 内容区域
            Scroll.layoutWeight(1);
            // 内容区域
            Scroll.backgroundColor('#f5f5f5');
            // 内容区域
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户信息卡片
            Column.create();
            // 用户信息卡片
            Column.width('100%');
            // 用户信息卡片
            Column.backgroundColor(Color.White);
            // 用户信息卡片
            Column.borderRadius(12);
            // 用户信息卡片
            Column.padding(16);
            // 用户信息卡片
            Column.margin({ bottom: 16 });
            // 用户信息卡片
            Column.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 加载状态
                        Column.create();
                        // 加载状态
                        Column.width('100%');
                        // 加载状态
                        Column.height(150);
                        // 加载状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⏳');
                        Text.fontSize(32);
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载用户信息中...');
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    // 加载状态
                    Column.pop();
                });
            }
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 错误状态
                        Column.create();
                        // 错误状态
                        Column.width('100%');
                        // 错误状态
                        Column.height(150);
                        // 错误状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('❌');
                        Text.fontSize(32);
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.fontSize(14);
                        Text.fontColor('#dc3545');
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('重新加载');
                        Button.fontSize(14);
                        Button.backgroundColor('#667eea');
                        Button.borderRadius(6);
                        Button.onClick(() => {
                            this.loadUserProfile();
                        });
                    }, Button);
                    Button.pop();
                    // 错误状态
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 正常显示用户信息
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 头像
                        Stack.create();
                        // 头像
                        Stack.margin({ bottom: 15 });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create({ width: 80, height: 80 });
                        Circle.fill({ "id": 125833939, "type": 10001, params: [], "bundleName": "com.pizza.lostfound", "moduleName": "entry" });
                        Circle.border({ width: 2, color: '#ddd', style: BorderStyle.Dashed });
                    }, Circle);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.userInfo.avatar.startsWith('http')) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 如果是网络图片URL，这里可以使用Image组件
                                    // 由于ArkTS限制，暂时显示默认头像
                                    Text.create('👤');
                                    // 如果是网络图片URL，这里可以使用Image组件
                                    // 由于ArkTS限制，暂时显示默认头像
                                    Text.fontSize(32);
                                    // 如果是网络图片URL，这里可以使用Image组件
                                    // 由于ArkTS限制，暂时显示默认头像
                                    Text.fontColor('#999999');
                                }, Text);
                                // 如果是网络图片URL，这里可以使用Image组件
                                // 由于ArkTS限制，暂时显示默认头像
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.userInfo.avatar);
                                    Text.fontSize(32);
                                    Text.fontColor('#999999');
                                }, Text);
                                Text.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    // 头像
                    Stack.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户名
                        Text.create(this.userInfo.username);
                        // 用户名
                        Text.fontSize(20);
                        // 用户名
                        Text.fontWeight(FontWeight.Bold);
                        // 用户名
                        Text.fontColor('#333333');
                        // 用户名
                        Text.margin({ bottom: 5 });
                    }, Text);
                    // 用户名
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 手机号
                        Text.create(`手机号：${this.userInfo.phone}`);
                        // 手机号
                        Text.fontSize(14);
                        // 手机号
                        Text.fontColor('#666666');
                        // 手机号
                        Text.margin({ bottom: 5 });
                    }, Text);
                    // 手机号
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 注册时间
                        Text.create(`注册时间：${this.userInfo.joinDate}`);
                        // 注册时间
                        Text.fontSize(14);
                        // 注册时间
                        Text.fontColor('#666666');
                    }, Text);
                    // 注册时间
                    Text.pop();
                    // 正常显示用户信息
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 用户信息卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 我发布的求助统计卡片
            Column.create();
            // 我发布的求助统计卡片
            Column.width('100%');
            // 我发布的求助统计卡片
            Column.backgroundColor(Color.White);
            // 我发布的求助统计卡片
            Column.borderRadius(12);
            // 我发布的求助统计卡片
            Column.padding(16);
            // 我发布的求助统计卡片
            Column.margin({ bottom: 16 });
            // 我发布的求助统计卡片
            Column.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 15 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我发布的求助');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 统计数据
            Row.create();
            // 统计数据
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.searchingCount.toString());
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#667eea');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('寻物中');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.foundCount.toString());
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#28a745');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('已找到');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.helpOthersCount.toString());
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#ffc107');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('帮助他人');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        // 统计数据
        Row.pop();
        // 我发布的求助统计卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能菜单卡片
            Column.create();
            // 功能菜单卡片
            Column.width('100%');
            // 功能菜单卡片
            Column.backgroundColor(Color.White);
            // 功能菜单卡片
            Column.borderRadius(12);
            // 功能菜单卡片
            Column.padding(16);
            // 功能菜单卡片
            Column.margin({ bottom: 16 });
            // 功能菜单卡片
            Column.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 编辑个人信息
            // Row() {
            //   Text('📝 编辑个人信息')
            //     .fontSize(16)
            //     .fontColor('#333333')
            //     .layoutWeight(1)
            // }
            // .width('100%')
            // .padding({ top: 10, bottom: 10 })
            // .border({ width: { bottom: 1 }, color: '#eee' })
            // .onClick(() => {
            //   console.log('编辑个人信息');
            // })
            // 我的社区
            Row.create();
            // 编辑个人信息
            // Row() {
            //   Text('📝 编辑个人信息')
            //     .fontSize(16)
            //     .fontColor('#333333')
            //     .layoutWeight(1)
            // }
            // .width('100%')
            // .padding({ top: 10, bottom: 10 })
            // .border({ width: { bottom: 1 }, color: '#eee' })
            // .onClick(() => {
            //   console.log('编辑个人信息');
            // })
            // 我的社区
            Row.width('100%');
            // 编辑个人信息
            // Row() {
            //   Text('📝 编辑个人信息')
            //     .fontSize(16)
            //     .fontColor('#333333')
            //     .layoutWeight(1)
            // }
            // .width('100%')
            // .padding({ top: 10, bottom: 10 })
            // .border({ width: { bottom: 1 }, color: '#eee' })
            // .onClick(() => {
            //   console.log('编辑个人信息');
            // })
            // 我的社区
            Row.padding({ top: 10, bottom: 10 });
            // 编辑个人信息
            // Row() {
            //   Text('📝 编辑个人信息')
            //     .fontSize(16)
            //     .fontColor('#333333')
            //     .layoutWeight(1)
            // }
            // .width('100%')
            // .padding({ top: 10, bottom: 10 })
            // .border({ width: { bottom: 1 }, color: '#eee' })
            // .onClick(() => {
            //   console.log('编辑个人信息');
            // })
            // 我的社区
            Row.border({ width: { bottom: 1 }, color: '#eee' });
            // 编辑个人信息
            // Row() {
            //   Text('📝 编辑个人信息')
            //     .fontSize(16)
            //     .fontColor('#333333')
            //     .layoutWeight(1)
            // }
            // .width('100%')
            // .padding({ top: 10, bottom: 10 })
            // .border({ width: { bottom: 1 }, color: '#eee' })
            // .onClick(() => {
            //   console.log('编辑个人信息');
            // })
            // 我的社区
            Row.onClick(() => {
                router.pushUrl({ url: 'pages/CommunityPage' });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🏘️ 我的社区');
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        // 编辑个人信息
        // Row() {
        //   Text('📝 编辑个人信息')
        //     .fontSize(16)
        //     .fontColor('#333333')
        //     .layoutWeight(1)
        // }
        // .width('100%')
        // .padding({ top: 10, bottom: 10 })
        // .border({ width: { bottom: 1 }, color: '#eee' })
        // .onClick(() => {
        //   console.log('编辑个人信息');
        // })
        // 我的社区
        Row.pop();
        // 功能菜单卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 退出登录按钮
            Button.createWithLabel('退出登录');
            // 退出登录按钮
            Button.width('100%');
            // 退出登录按钮
            Button.height(48);
            // 退出登录按钮
            Button.fontSize(16);
            // 退出登录按钮
            Button.fontColor('#6c757d');
            // 退出登录按钮
            Button.backgroundColor('#f8f9fa');
            // 退出登录按钮
            Button.border({ width: 1, color: '#dee2e6' });
            // 退出登录按钮
            Button.borderRadius(8);
            // 退出登录按钮
            Button.margin({ bottom: 20 });
            // 退出登录按钮
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/Index' });
            });
        }, Button);
        // 退出登录按钮
        Button.pop();
        Column.pop();
        // 内容区域
        Scroll.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 底部导航 - 使用CommonComponents
                    BottomTabBar(this, {
                        currentIndex: 3,
                        onTabClick: (index: number) => {
                            NavigationUtils.handleTabNavigation(index, 3);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ProfilePage.ets", line: 307, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            currentIndex: 3,
                            onTabClick: (index: number) => {
                                NavigationUtils.handleTabNavigation(index, 3);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        currentIndex: 3
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
        return "ProfilePage";
    }
}
registerNamedRoute(() => new ProfilePage(undefined, {}), "", { bundleName: "com.pizza.lostfound", moduleName: "entry", pagePath: "pages/ProfilePage", pageFullPath: "entry/src/main/ets/pages/ProfilePage", integratedHsp: "false", moduleType: "followWithHap" });
