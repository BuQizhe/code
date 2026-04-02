if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CreateCommunityPage_Params {
    communityName?: string;
    communityType?: string;
    detailAddress?: string;
    showTypeDropdown?: boolean;
    isLoading?: boolean;
    errorMessage?: string;
    communityNameError?: string;
    communityTypeError?: string;
    detailAddressError?: string;
    communityTypes?: string[];
}
import router from "@ohos:router";
import { HeaderBar } from "@normalized:N&&&entry/src/main/ets/components/CommonComponents&";
import type { ApiCommunityInfo, ApiResponse, CommunityInfo, CreateCommunityResponse, CreateRequestInfo, JoinRequestInfo } from '../po/CommunityInfo';
import { API_BASE_URL } from "@normalized:N&&&entry/src/main/ets/utils/Common&";
import { HttpUtils } from "@normalized:N&&&entry/src/main/ets/utils/HttpUtils&";
class CreateCommunityPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__communityName = new ObservedPropertySimplePU('', this, "communityName");
        this.__communityType = new ObservedPropertySimplePU('', this, "communityType");
        this.__detailAddress = new ObservedPropertySimplePU('', this, "detailAddress");
        this.__showTypeDropdown = new ObservedPropertySimplePU(false, this, "showTypeDropdown");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__communityNameError = new ObservedPropertySimplePU('', this, "communityNameError");
        this.__communityTypeError = new ObservedPropertySimplePU('', this, "communityTypeError");
        this.__detailAddressError = new ObservedPropertySimplePU('', this, "detailAddressError");
        this.communityTypes = ['校园', '小区', '公司', '车站', '机场'];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CreateCommunityPage_Params) {
        if (params.communityName !== undefined) {
            this.communityName = params.communityName;
        }
        if (params.communityType !== undefined) {
            this.communityType = params.communityType;
        }
        if (params.detailAddress !== undefined) {
            this.detailAddress = params.detailAddress;
        }
        if (params.showTypeDropdown !== undefined) {
            this.showTypeDropdown = params.showTypeDropdown;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.communityNameError !== undefined) {
            this.communityNameError = params.communityNameError;
        }
        if (params.communityTypeError !== undefined) {
            this.communityTypeError = params.communityTypeError;
        }
        if (params.detailAddressError !== undefined) {
            this.detailAddressError = params.detailAddressError;
        }
        if (params.communityTypes !== undefined) {
            this.communityTypes = params.communityTypes;
        }
    }
    updateStateVars(params: CreateCommunityPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__communityName.purgeDependencyOnElmtId(rmElmtId);
        this.__communityType.purgeDependencyOnElmtId(rmElmtId);
        this.__detailAddress.purgeDependencyOnElmtId(rmElmtId);
        this.__showTypeDropdown.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__communityNameError.purgeDependencyOnElmtId(rmElmtId);
        this.__communityTypeError.purgeDependencyOnElmtId(rmElmtId);
        this.__detailAddressError.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__communityName.aboutToBeDeleted();
        this.__communityType.aboutToBeDeleted();
        this.__detailAddress.aboutToBeDeleted();
        this.__showTypeDropdown.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__communityNameError.aboutToBeDeleted();
        this.__communityTypeError.aboutToBeDeleted();
        this.__detailAddressError.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __communityName: ObservedPropertySimplePU<string>;
    get communityName() {
        return this.__communityName.get();
    }
    set communityName(newValue: string) {
        this.__communityName.set(newValue);
    }
    private __communityType: ObservedPropertySimplePU<string>;
    get communityType() {
        return this.__communityType.get();
    }
    set communityType(newValue: string) {
        this.__communityType.set(newValue);
    }
    private __detailAddress: ObservedPropertySimplePU<string>;
    get detailAddress() {
        return this.__detailAddress.get();
    }
    set detailAddress(newValue: string) {
        this.__detailAddress.set(newValue);
    }
    private __showTypeDropdown: ObservedPropertySimplePU<boolean>;
    get showTypeDropdown() {
        return this.__showTypeDropdown.get();
    }
    set showTypeDropdown(newValue: boolean) {
        this.__showTypeDropdown.set(newValue);
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
    // 输入验证错误状态
    private __communityNameError: ObservedPropertySimplePU<string>;
    get communityNameError() {
        return this.__communityNameError.get();
    }
    set communityNameError(newValue: string) {
        this.__communityNameError.set(newValue);
    }
    private __communityTypeError: ObservedPropertySimplePU<string>;
    get communityTypeError() {
        return this.__communityTypeError.get();
    }
    set communityTypeError(newValue: string) {
        this.__communityTypeError.set(newValue);
    }
    private __detailAddressError: ObservedPropertySimplePU<string>;
    get detailAddressError() {
        return this.__detailAddressError.get();
    }
    set detailAddressError(newValue: string) {
        this.__detailAddressError.set(newValue);
    }
    private communityTypes: string[];
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
        if (str1 === str2)
            return 1.0;
        if (str1.length === 0 || str2.length === 0)
            return 0.0;
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
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // 替换
                    matrix[i][j - 1] + 1, // 插入
                    matrix[i - 1][j] + 1 // 删除
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    }
    // 检查字符串包含关系
    private checkSubstringContainment(str1: string, str2: string): boolean {
        if (str1.length < 2 || str2.length < 2)
            return false;
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
        }
        catch (error) {
            console.error('获取现有社区列表失败:', error);
        }
        return [];
    }
    // 验证社区名称
    private validateCommunityName(): void {
        const name = this.communityName.trim();
        if (!name) {
            this.communityNameError = '社区名称不能为空';
        }
        else if (name.length < 2) {
            this.communityNameError = '社区名称至少需要2个字符';
        }
        else if (name.length > 20) {
            this.communityNameError = '社区名称不能超过20个字符';
        }
        else {
            this.communityNameError = '';
        }
    }
    // 验证社区类型
    private validateCommunityType(): void {
        if (!this.communityType) {
            this.communityTypeError = '请选择社区类型';
        }
        else {
            this.communityTypeError = '';
        }
    }
    // 验证详细地址
    private validateDetailAddress(): void {
        const address = this.detailAddress.trim();
        if (!address) {
            this.detailAddressError = '详细地址不能为空';
        }
        else if (address.length < 5) {
            this.detailAddressError = '详细地址至少需要5个字符';
        }
        else if (address.length > 100) {
            this.detailAddressError = '详细地址不能超过100个字符';
        }
        else {
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
            const duplicateWarning = this.checkDuplicateCommunity(this.communityName.trim(), this.detailAddress.trim(), existingCommunities);
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
                    name: this.communityName.trim(),
                    type: this.communityType,
                    memberCount: 1,
                    isAdmin: true,
                    isJoined: true,
                    address: this.detailAddress.trim() // 添加地址信息
                };
                // 返回上一页并传递新创建的社区信息
                router.back({
                    url: 'pages/CommunityPage',
                    params: {
                        newCommunity: JSON.stringify(newCommunity)
                    }
                });
            }
            else {
                this.errorMessage = apiResponse.message || '创建社区失败';
            }
        }
        catch (error) {
            this.errorMessage = '网络请求失败，请重试';
            console.error('创建社区失败:', error);
        }
        finally {
            this.isLoading = false;
        }
    }
    // 加入社区
    async joinCommunity(communityId: string): Promise<void> {
        try {
            const url = `${API_BASE_URL}/api/community/join`;
            const requestData: JoinRequestInfo = {
                userId: 'user_12345',
                communityId: communityId
            };
            const response = await HttpUtils.post(url, requestData);
            const apiResponse: ApiResponse<object> = JSON.parse(response);
            if (apiResponse.code === 200) {
                console.log('自动加入社区成功');
            }
            else {
                console.error('自动加入社区失败:', apiResponse.message);
            }
        }
        catch (error) {
            console.error('自动加入社区请求失败:', error);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(286:5)", "entry");
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
                        title: '创建社区',
                        showBack: true,
                        onBack: () => {
                            router.back();
                        },
                        showAction: false
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CreateCommunityPage.ets", line: 288, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '创建社区',
                            showBack: true,
                            onBack: () => {
                                router.back();
                            },
                            showAction: false
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '创建社区',
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
            Scroll.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(299:7)", "entry");
            // 内容区域
            Scroll.layoutWeight(1);
            // 内容区域
            Scroll.backgroundColor('#f8f9fa');
            // 内容区域
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(300:9)", "entry");
            Column.width('100%');
            Column.padding({ left: 20, right: 20, top: 20, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 社区名称
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(302:11)", "entry");
            // 社区名称
            Column.width('100%');
            // 社区名称
            Column.alignItems(HorizontalAlign.Start);
            // 社区名称
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('社区名称');
            Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(303:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#555555');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入社区名称', text: this.communityName });
            TextInput.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(310:13)", "entry");
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.borderRadius(8);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: this.communityNameError ? '#ff4444' : '#dddddd' });
            TextInput.padding({ left: 12, right: 12 });
            TextInput.onChange((value: string) => {
                this.communityName = value;
                this.validateCommunityName();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 社区名称错误提示
            if (this.communityNameError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.communityNameError);
                        Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(325:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#ff4444');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ top: 4 });
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
        // 社区名称
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 社区类型
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(337:11)", "entry");
            // 社区类型
            Column.width('100%');
            // 社区类型
            Column.alignItems(HorizontalAlign.Start);
            // 社区类型
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('社区类型');
            Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(338:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#555555');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(345:13)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(346:15)", "entry");
            Row.width('100%');
            Row.height(48);
            Row.padding({ left: 12, right: 12 });
            Row.backgroundColor(Color.White);
            Row.border({ width: 1, color: '#dddddd' });
            Row.borderRadius(8);
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.alignItems(VerticalAlign.Center);
            Row.border({ width: 1, color: this.communityTypeError ? '#ff4444' : '#dddddd' });
            Row.onClick(() => {
                this.showTypeDropdown = !this.showTypeDropdown;
                this.validateCommunityType();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.communityType || '请选择社区类型');
            Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(347:17)", "entry");
            Text.fontSize(16);
            Text.fontColor(this.communityType ? '#333333' : '#999999');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showTypeDropdown ? '▲' : '▼');
            Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(352:17)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 下拉选项
            if (this.showTypeDropdown) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(372:17)", "entry");
                        Column.width('100%');
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(8);
                        Column.border({ width: 1, color: '#e0e0e0' });
                        Column.shadow({ radius: 8, color: '#0000001A', offsetX: 0, offsetY: 4 });
                        Column.margin({ top: 4 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const type = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(374:21)", "entry");
                                Row.width('100%');
                                Row.padding({ left: 12, right: 12, top: 12, bottom: 12 });
                                Row.backgroundColor(Color.White);
                                Row.onClick(() => {
                                    this.communityType = type;
                                    this.showTypeDropdown = false;
                                    this.validateCommunityType();
                                });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(type);
                                Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(375:23)", "entry");
                                Text.fontSize(16);
                                Text.fontColor('#333333');
                                Text.layoutWeight(1);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (type === this.communityType) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('✓');
                                            Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(381:25)", "entry");
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
                                if (index < this.communityTypes.length - 1) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Divider.create();
                                            Divider.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(396:23)", "entry");
                                            Divider.color({ "id": 125833939, "type": 10001, params: [], "bundleName": "com.pizza.lostfound", "moduleName": "entry" });
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
                        this.forEachUpdateFunction(elmtId, this.communityTypes, forEachItemGenFunction, undefined, true, false);
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
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 社区类型错误提示
            if (this.communityTypeError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.communityTypeError);
                        Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(414:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#ff4444');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ top: 4 });
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
        // 社区类型
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 详细地址
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(426:11)", "entry");
            // 详细地址
            Column.width('100%');
            // 详细地址
            Column.alignItems(HorizontalAlign.Start);
            // 详细地址
            Column.margin({ bottom: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('详细地址');
            Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(427:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#555555');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ placeholder: '请输入详细地址', text: this.detailAddress });
            TextArea.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(434:13)", "entry");
            TextArea.width('100%');
            TextArea.height(120);
            TextArea.fontSize(16);
            TextArea.borderRadius(8);
            TextArea.backgroundColor(Color.White);
            TextArea.border({ width: 1, color: this.detailAddressError ? '#ff4444' : '#dddddd' });
            TextArea.padding(12);
            TextArea.onChange((value: string) => {
                this.detailAddress = value;
                this.validateDetailAddress();
            });
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 详细地址错误提示
            if (this.detailAddressError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.detailAddressError);
                        Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(449:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#ff4444');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ top: 4 });
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
        // 详细地址
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 错误信息显示
            if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(462:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#ff4444');
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                });
            }
            // 创建按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 创建按钮
            Button.createWithLabel(this.isLoading ? '创建中...' : '创建社区');
            Button.debugLine("entry/src/main/ets/pages/CreateCommunityPage.ets(471:11)", "entry");
            // 创建按钮
            Button.width('100%');
            // 创建按钮
            Button.height(48);
            // 创建按钮
            Button.fontSize(16);
            // 创建按钮
            Button.fontColor(Color.White);
            // 创建按钮
            Button.linearGradient({
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
            });
            // 创建按钮
            Button.borderRadius(8);
            // 创建按钮
            Button.enabled(!this.isLoading && !this.communityNameError && !this.communityTypeError &&
                !this.detailAddressError && !!this.communityName.trim() && !!this.communityType &&
                !!this.detailAddress.trim());
            // 创建按钮
            Button.opacity((this.isLoading || this.communityNameError || this.communityTypeError || this.detailAddressError ||
                !this.communityName.trim() || !this.communityType || !this.detailAddress.trim()) ? 0.6 : 1.0);
            // 创建按钮
            Button.onClick(async () => {
                await this.createCommunity();
            });
        }, Button);
        // 创建按钮
        Button.pop();
        Column.pop();
        // 内容区域
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CreateCommunityPage";
    }
}
registerNamedRoute(() => new CreateCommunityPage(undefined, {}), "", { bundleName: "com.pizza.lostfound", moduleName: "entry", pagePath: "pages/CreateCommunityPage", pageFullPath: "entry/src/main/ets/pages/CreateCommunityPage", integratedHsp: "false", moduleType: "followWithHap" });
