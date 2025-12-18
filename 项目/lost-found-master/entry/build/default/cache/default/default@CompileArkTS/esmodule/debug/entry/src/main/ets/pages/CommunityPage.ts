if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CommunityPage_Params {
    communities?: CommunityInfo[];
    isLoading?: boolean;
    errorMessage?: string;
    localCreatedCommunities?: CommunityInfo[];
}
import router from "@ohos:router";
import type { ApiCommunityInfo, ApiResponse, CommunityInfo } from "../po/CommunityInfo";
import { HeaderBar, BottomTabBar, NavigationUtils } from "@normalized:N&&&entry/src/main/ets/components/CommonComponents&";
import { HttpUtils } from "@normalized:N&&&entry/src/main/ets/utils/HttpUtils&";
import { API_BASE_URL } from "@normalized:N&&&entry/src/main/ets/utils/Common&";
class CommunityPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__communities = new ObservedPropertyObjectPU([], this, "communities");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.localCreatedCommunities = [];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CommunityPage_Params) {
        if (params.communities !== undefined) {
            this.communities = params.communities;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.localCreatedCommunities !== undefined) {
            this.localCreatedCommunities = params.localCreatedCommunities;
        }
    }
    updateStateVars(params: CommunityPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__communities.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__communities.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __communities: ObservedPropertyObjectPU<CommunityInfo[]>;
    get communities() {
        return this.__communities.get();
    }
    set communities(newValue: CommunityInfo[]) {
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
    // 本地新创建的社区列表（用于解决mock数据覆盖问题）
    private localCreatedCommunities: CommunityInfo[];
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
                        isAdmin: false,
                        isJoined: isJoined
                    };
                });
                // 合并API数据和本地创建的社区数据
                // 过滤掉API中已存在的本地社区（避免重复）
                const filteredLocalCommunities = this.localCreatedCommunities.filter(localCommunity => !apiCommunities.some(apiCommunity => apiCommunity.id === localCommunity.id));
                // 将本地创建的社区放在前面，API数据放在后面
                this.communities = [...filteredLocalCommunities, ...apiCommunities];
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
            }
            catch (error) {
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
        }
        else {
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
                        title: '社区',
                        showBack: false,
                        showAction: true,
                        actionText: '+',
                        onAction: () => {
                            router.pushUrl({ url: 'pages/CreateCommunityPage' });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CommunityPage.ets", line: 116, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '社区',
                            showBack: false,
                            showAction: true,
                            actionText: '+',
                            onAction: () => {
                                router.pushUrl({ url: 'pages/CreateCommunityPage' });
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '社区',
                        showBack: false,
                        showAction: true,
                        actionText: '+'
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
            Scroll.backgroundColor('#f8f9fa');
            // 内容区域
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 20, right: 20, top: 20, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 我加入的社区统计卡片
            Column.create();
            // 我加入的社区统计卡片
            Column.width('100%');
            // 我加入的社区统计卡片
            Column.padding(16);
            // 我加入的社区统计卡片
            Column.backgroundColor(Color.White);
            // 我加入的社区统计卡片
            Column.borderRadius(12);
            // 我加入的社区统计卡片
            Column.shadow({ radius: 4, color: '#0000001A', offsetX: 0, offsetY: 2 });
            // 我加入的社区统计卡片
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('社区列表');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.margin({ top: 4 });
                        Text.alignSelf(ItemAlign.Start);
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.fontSize(14);
                        Text.fontColor('#ff4444');
                        Text.margin({ top: 4 });
                        Text.alignSelf(ItemAlign.Start);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.communities.length}个社区`);
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.margin({ top: 4 });
                        Text.alignSelf(ItemAlign.Start);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 刷新按钮
            Button.createWithLabel('刷新');
            // 刷新按钮
            Button.fontSize(12);
            // 刷新按钮
            Button.fontColor('#667eea');
            // 刷新按钮
            Button.backgroundColor(Color.Transparent);
            // 刷新按钮
            Button.border({ width: 1, color: '#667eea' });
            // 刷新按钮
            Button.borderRadius(4);
            // 刷新按钮
            Button.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            // 刷新按钮
            Button.onClick(() => {
                this.getMyCommunities();
            });
        }, Button);
        // 刷新按钮
        Button.pop();
        Row.pop();
        // 我加入的社区统计卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 社区列表
            if (this.isLoading) {
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
                        Text.create('正在加载社区列表...');
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                        Text.margin({ top: 40, bottom: 40 });
                    }, Text);
                    Text.pop();
                    // 加载状态
                    Column.pop();
                });
            }
            else if (this.errorMessage && this.communities.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 错误状态
                        Column.create();
                        // 错误状态
                        Column.width('100%');
                        // 错误状态
                        Column.justifyContent(FlexAlign.Center);
                        // 错误状态
                        Column.margin({ top: 40, bottom: 40 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载失败');
                        Text.fontSize(16);
                        Text.fontColor('#ff4444');
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('重试');
                        Button.fontSize(14);
                        Button.fontColor(Color.White);
                        Button.backgroundColor('#667eea');
                        Button.borderRadius(6);
                        Button.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                        Button.onClick(() => {
                            this.getMyCommunities();
                        });
                    }, Button);
                    Button.pop();
                    // 错误状态
                    Column.pop();
                });
            }
            else if (this.communities.length === 0) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 空状态
                        Column.create();
                        // 空状态
                        Column.width('100%');
                        // 空状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无加入的社区');
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                        Text.margin({ top: 40, bottom: 40 });
                    }, Text);
                    Text.pop();
                    // 空状态
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 社区列表
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const community = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.width('100%');
                                Column.padding(16);
                                Column.backgroundColor(Color.White);
                                Column.borderRadius(12);
                                Column.shadow({ radius: 4, color: '#0000001A', offsetX: 0, offsetY: 2 });
                                Column.margin({ bottom: 16 });
                                Column.onClick(() => {
                                    console.log(`点击社区: ${community.name}`);
                                });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.justifyContent(FlexAlign.SpaceBetween);
                                Row.alignItems(VerticalAlign.Center);
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.alignItems(HorizontalAlign.Start);
                                Column.layoutWeight(1);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(community.name);
                                Text.fontSize(16);
                                Text.fontWeight(FontWeight.Medium);
                                Text.fontColor('#333333');
                                Text.alignSelf(ItemAlign.Start);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${community.type} · ${community.memberCount}人${community.isAdmin ? ' · 管理员' : ''}`);
                                Text.fontSize(14);
                                Text.fontColor('#666666');
                                Text.margin({ top: 4 });
                                Text.alignSelf(ItemAlign.Start);
                            }, Text);
                            Text.pop();
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                // 右侧按钮或状态
                                if (community.isAdmin) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Button.createWithLabel('我创建的');
                                            Button.fontSize(14);
                                            Button.fontColor(Color.White);
                                            Button.backgroundColor('#667eea');
                                            Button.borderRadius(6);
                                            Button.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                            Button.onClick(() => {
                                                console.log(`管理社区: ${community.name}`);
                                            });
                                        }, Button);
                                        Button.pop();
                                    });
                                }
                                else if (community.isJoined) {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('✓ 已加入');
                                            Text.fontSize(14);
                                            Text.fontColor('#28a745');
                                            Text.fontWeight(FontWeight.Medium);
                                        }, Text);
                                        Text.pop();
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(2, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Button.createWithLabel('加入');
                                            Button.fontSize(14);
                                            Button.fontColor(Color.White);
                                            Button.backgroundColor('#667eea');
                                            Button.borderRadius(6);
                                            Button.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                            Button.onClick(() => {
                                                this.joinCommunity(community.id);
                                            });
                                        }, Button);
                                        Button.pop();
                                    });
                                }
                            }, If);
                            If.pop();
                            Row.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.communities, forEachItemGenFunction);
                    }, ForEach);
                    // 社区列表
                    ForEach.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        // 内容区域
        Scroll.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 底部导航 - 使用CommonComponents
                    BottomTabBar(this, {
                        currentIndex: 1,
                        onTabClick: (index: number) => {
                            NavigationUtils.handleTabNavigation(index, 1);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CommunityPage.ets", line: 301, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            currentIndex: 1,
                            onTabClick: (index: number) => {
                                NavigationUtils.handleTabNavigation(index, 1);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        currentIndex: 1
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
        return "CommunityPage";
    }
}
registerNamedRoute(() => new CommunityPage(undefined, {}), "", { bundleName: "com.pizza.lostfound", moduleName: "entry", pagePath: "pages/CommunityPage", pageFullPath: "entry/src/main/ets/pages/CommunityPage", integratedHsp: "false", moduleType: "followWithHap" });
