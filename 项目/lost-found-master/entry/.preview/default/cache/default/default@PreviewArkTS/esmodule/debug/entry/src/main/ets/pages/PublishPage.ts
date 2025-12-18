if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PublishPage_Params {
    itemType?: '寻物' | '寻主';
    title?: string;
    category?: string;
    location?: string;
    description?: string;
    contactInfo?: string;
    images?: string[];
    selectedImageUris?: string[];
    isLoading?: boolean;
    errorMessage?: string;
    lostTime?: string;
    categories?: string[];
    titleError?: string;
    categoryError?: string;
    descriptionError?: string;
    contactInfoError?: string;
    lostTimeError?: string;
}
import router from "@ohos:router";
import { HeaderBar } from "@normalized:N&&&entry/src/main/ets/components/CommonComponents&";
import { HttpUtils } from "@normalized:N&&&entry/src/main/ets/utils/HttpUtils&";
import type { ApiResponse, ApiItemData, PublishRequestData } from '../po/CommonTypes';
import photoAccessHelper from "@ohos:file.photoAccessHelper";
import type { LostItem } from '../po/LostItem';
import { API_BASE_URL, TimeUtils } from "@normalized:N&&&entry/src/main/ets/utils/Common&";
class PublishPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__itemType = new ObservedPropertySimplePU('寻物', this, "itemType");
        this.__title = new ObservedPropertySimplePU('', this, "title");
        this.__category = new ObservedPropertySimplePU('', this, "category");
        this.__location = new ObservedPropertySimplePU('', this, "location");
        this.__description = new ObservedPropertySimplePU('', this, "description");
        this.__contactInfo = new ObservedPropertySimplePU('', this, "contactInfo");
        this.__images = new ObservedPropertyObjectPU([], this, "images");
        this.__selectedImageUris = new ObservedPropertyObjectPU([], this, "selectedImageUris");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__lostTime = new ObservedPropertySimplePU(TimeUtils.getCurrentDateTime(), this, "lostTime");
        this.categories = ['数码产品', '证件卡类', '生活用品', '服饰配饰', '其他'];
        this.__titleError = new ObservedPropertySimplePU('', this, "titleError");
        this.__categoryError = new ObservedPropertySimplePU('', this, "categoryError");
        this.__descriptionError = new ObservedPropertySimplePU('', this, "descriptionError");
        this.__contactInfoError = new ObservedPropertySimplePU('', this, "contactInfoError");
        this.__lostTimeError = new ObservedPropertySimplePU('', this, "lostTimeError");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PublishPage_Params) {
        if (params.itemType !== undefined) {
            this.itemType = params.itemType;
        }
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.category !== undefined) {
            this.category = params.category;
        }
        if (params.location !== undefined) {
            this.location = params.location;
        }
        if (params.description !== undefined) {
            this.description = params.description;
        }
        if (params.contactInfo !== undefined) {
            this.contactInfo = params.contactInfo;
        }
        if (params.images !== undefined) {
            this.images = params.images;
        }
        if (params.selectedImageUris !== undefined) {
            this.selectedImageUris = params.selectedImageUris;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.lostTime !== undefined) {
            this.lostTime = params.lostTime;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
        if (params.titleError !== undefined) {
            this.titleError = params.titleError;
        }
        if (params.categoryError !== undefined) {
            this.categoryError = params.categoryError;
        }
        if (params.descriptionError !== undefined) {
            this.descriptionError = params.descriptionError;
        }
        if (params.contactInfoError !== undefined) {
            this.contactInfoError = params.contactInfoError;
        }
        if (params.lostTimeError !== undefined) {
            this.lostTimeError = params.lostTimeError;
        }
    }
    updateStateVars(params: PublishPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__itemType.purgeDependencyOnElmtId(rmElmtId);
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__category.purgeDependencyOnElmtId(rmElmtId);
        this.__location.purgeDependencyOnElmtId(rmElmtId);
        this.__description.purgeDependencyOnElmtId(rmElmtId);
        this.__contactInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__images.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedImageUris.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__lostTime.purgeDependencyOnElmtId(rmElmtId);
        this.__titleError.purgeDependencyOnElmtId(rmElmtId);
        this.__categoryError.purgeDependencyOnElmtId(rmElmtId);
        this.__descriptionError.purgeDependencyOnElmtId(rmElmtId);
        this.__contactInfoError.purgeDependencyOnElmtId(rmElmtId);
        this.__lostTimeError.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__itemType.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__category.aboutToBeDeleted();
        this.__location.aboutToBeDeleted();
        this.__description.aboutToBeDeleted();
        this.__contactInfo.aboutToBeDeleted();
        this.__images.aboutToBeDeleted();
        this.__selectedImageUris.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__lostTime.aboutToBeDeleted();
        this.__titleError.aboutToBeDeleted();
        this.__categoryError.aboutToBeDeleted();
        this.__descriptionError.aboutToBeDeleted();
        this.__contactInfoError.aboutToBeDeleted();
        this.__lostTimeError.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __itemType: ObservedPropertySimplePU<'寻物' | '寻主'>;
    get itemType() {
        return this.__itemType.get();
    }
    set itemType(newValue: '寻物' | '寻主') {
        this.__itemType.set(newValue);
    }
    private __title: ObservedPropertySimplePU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __category: ObservedPropertySimplePU<string>;
    get category() {
        return this.__category.get();
    }
    set category(newValue: string) {
        this.__category.set(newValue);
    }
    private __location: ObservedPropertySimplePU<string>;
    get location() {
        return this.__location.get();
    }
    set location(newValue: string) {
        this.__location.set(newValue);
    }
    private __description: ObservedPropertySimplePU<string>;
    get description() {
        return this.__description.get();
    }
    set description(newValue: string) {
        this.__description.set(newValue);
    }
    private __contactInfo: ObservedPropertySimplePU<string>;
    get contactInfo() {
        return this.__contactInfo.get();
    }
    set contactInfo(newValue: string) {
        this.__contactInfo.set(newValue);
    }
    private __images: ObservedPropertyObjectPU<string[]>;
    get images() {
        return this.__images.get();
    }
    set images(newValue: string[]) {
        this.__images.set(newValue);
    }
    private __selectedImageUris: ObservedPropertyObjectPU<string[]>; // 存储选择的图片URI
    get selectedImageUris() {
        return this.__selectedImageUris.get();
    }
    set selectedImageUris(newValue: string[]) {
        this.__selectedImageUris.set(newValue);
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
    private __lostTime: ObservedPropertySimplePU<string>;
    get lostTime() {
        return this.__lostTime.get();
    }
    set lostTime(newValue: string) {
        this.__lostTime.set(newValue);
    }
    private categories: string[]; // 仅供展示，实际从后端获取
    // 输入验证错误状态
    private __titleError: ObservedPropertySimplePU<string>;
    get titleError() {
        return this.__titleError.get();
    }
    set titleError(newValue: string) {
        this.__titleError.set(newValue);
    }
    private __categoryError: ObservedPropertySimplePU<string>;
    get categoryError() {
        return this.__categoryError.get();
    }
    set categoryError(newValue: string) {
        this.__categoryError.set(newValue);
    }
    private __descriptionError: ObservedPropertySimplePU<string>;
    get descriptionError() {
        return this.__descriptionError.get();
    }
    set descriptionError(newValue: string) {
        this.__descriptionError.set(newValue);
    }
    private __contactInfoError: ObservedPropertySimplePU<string>;
    get contactInfoError() {
        return this.__contactInfoError.get();
    }
    set contactInfoError(newValue: string) {
        this.__contactInfoError.set(newValue);
    }
    private __lostTimeError: ObservedPropertySimplePU<string>;
    get lostTimeError() {
        return this.__lostTimeError.get();
    }
    set lostTimeError(newValue: string) {
        this.__lostTimeError.set(newValue);
    }
    // 输入验证方法
    private validateTitle(value: string): void {
        if (!value.trim()) {
            this.titleError = '物品名称不能为空';
        }
        else if (value.trim().length > 30) {
            this.titleError = '物品名称不能超过30个字符';
        }
        else {
            this.titleError = '';
        }
    }
    private validateCategory(): void {
        if (!this.category) {
            this.categoryError = '请选择物品分类';
        }
        else {
            this.categoryError = '';
        }
    }
    private validateDescription(value: string): void {
        if (!value.trim()) {
            this.descriptionError = '详细描述不能为空';
        }
        else if (value.trim().length < 10) {
            this.descriptionError = '详细描述至少需要10个字符';
        }
        else if (value.trim().length > 500) {
            this.descriptionError = '详细描述不能超过500个字符';
        }
        else {
            this.descriptionError = '';
        }
    }
    private validateContactInfo(value: string): void {
        if (!value.trim()) {
            this.contactInfoError = '联系方式不能为空';
        }
        else if (value.trim().length < 5) {
            this.contactInfoError = '联系方式至少需要5个字符';
        }
        else if (value.trim().length > 20) {
            this.contactInfoError = '联系方式不能超过20个字符';
        }
        else {
            this.contactInfoError = '';
        }
    }
    private validateLostTime(value: string): void {
        if (!value.trim()) {
            this.lostTimeError = '时间不能为空';
        }
        else {
            this.lostTimeError = '';
        }
    }
    // 验证所有输入
    private validateAllInputs(): boolean {
        this.validateTitle(this.title);
        this.validateCategory();
        this.validateDescription(this.description);
        this.validateContactInfo(this.contactInfo);
        this.validateLostTime(this.lostTime);
        return !this.titleError && !this.categoryError && !this.descriptionError &&
            !this.contactInfoError && !this.lostTimeError;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(98:5)", "entry");
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
                        title: '发布求助',
                        showBack: true,
                        showAction: false,
                        onBack: () => {
                            router.back();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PublishPage.ets", line: 100, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '发布求助',
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
                        title: '发布求助',
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
            Scroll.debugLine("entry/src/main/ets/pages/PublishPage.ets(111:7)", "entry");
            // 内容区域
            Scroll.layoutWeight(1);
            // 内容区域
            Scroll.backgroundColor('#f8f9fa');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(112:9)", "entry");
            Column.width('100%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发布类型选择
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/PublishPage.ets(114:11)", "entry");
            // 发布类型选择
            Row.width('100%');
            // 发布类型选择
            Row.margin({ bottom: 25 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('寻物启事');
            Button.debugLine("entry/src/main/ets/pages/PublishPage.ets(115:13)", "entry");
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(16);
            Button.fontColor(this.itemType === '寻物' ? Color.White : '#666666');
            Button.backgroundColor(this.itemType === '寻物' ? undefined : '#f0f0f0');
            Button.linearGradient(this.itemType === '寻物' ? {
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
            } : undefined);
            Button.borderRadius(8);
            Button.onClick(() => {
                this.itemType = '寻物';
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('失物招领');
            Button.debugLine("entry/src/main/ets/pages/PublishPage.ets(130:13)", "entry");
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(16);
            Button.fontColor(this.itemType === '寻主' ? Color.White : '#666666');
            Button.backgroundColor(this.itemType === '寻主' ? undefined : '#f0f0f0');
            Button.linearGradient(this.itemType === '寻主' ? {
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
            } : undefined);
            Button.borderRadius(8);
            Button.margin({ left: 10 });
            Button.onClick(() => {
                this.itemType = '寻主';
            });
        }, Button);
        Button.pop();
        // 发布类型选择
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 物品标题
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(150:11)", "entry");
            // 物品标题
            Column.width('100%');
            // 物品标题
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('物品名称 *');
            Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(151:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入物品名称' });
            TextInput.debugLine("entry/src/main/ets/pages/PublishPage.ets(158:13)", "entry");
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.borderRadius(8);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: this.titleError ? '#ff4444' : '#e0e0e0' });
            TextInput.onChange((value: string) => {
                this.title = value;
                this.validateTitle(value);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.titleError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.titleError);
                        Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(171:15)", "entry");
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
        // 物品标题
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 物品分类
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(182:11)", "entry");
            // 物品分类
            Column.width('100%');
            // 物品分类
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('物品分类 *');
            Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(183:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分类选择
            Flex.create({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Start });
            Flex.debugLine("entry/src/main/ets/pages/PublishPage.ets(191:13)", "entry");
            // 分类选择
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const category = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(category);
                    Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(193:17)", "entry");
                    Text.fontSize(14);
                    Text.fontColor(this.category === category ? Color.White : '#666666');
                    Text.backgroundColor(this.category === category ? undefined : '#f0f0f0');
                    Text.linearGradient(this.category === category ? {
                        angle: 135,
                        colors: [['#667eea', 0], ['#764ba2', 1]]
                    } : undefined);
                    Text.borderRadius(15);
                    Text.padding({ left: 15, right: 15, top: 8, bottom: 8 });
                    Text.margin({ right: 10, bottom: 10 });
                    Text.onClick(() => {
                        this.category = category;
                        this.validateCategory();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 分类选择
        Flex.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.categoryError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.categoryError);
                        Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(213:15)", "entry");
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
        // 物品分类
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 详细描述
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(224:11)", "entry");
            // 详细描述
            Column.width('100%');
            // 详细描述
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('详细描述 *');
            Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(225:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ placeholder: '请详细描述物品特征、丢失/拾得经过等信息...' });
            TextArea.debugLine("entry/src/main/ets/pages/PublishPage.ets(232:13)", "entry");
            TextArea.width('100%');
            TextArea.height(100);
            TextArea.fontSize(16);
            TextArea.borderRadius(8);
            TextArea.backgroundColor(Color.White);
            TextArea.border({ width: 1, color: this.descriptionError ? '#ff4444' : '#e0e0e0' });
            TextArea.onChange((value: string) => {
                this.description = value;
                this.validateDescription(value);
            });
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.descriptionError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.descriptionError);
                        Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(245:15)", "entry");
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
        // 详细描述
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 地点信息
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(256:11)", "entry");
            // 地点信息
            Column.width('100%');
            // 地点信息
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('相关地点');
            Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(257:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: this.itemType === '寻物' ? '请输入丢失地点' : '请输入拾得地点' });
            TextInput.debugLine("entry/src/main/ets/pages/PublishPage.ets(264:1)", "entry");
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.borderRadius(8);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: '#e0e0e0' });
            TextInput.onChange((value: string) => {
                this.location = value;
            });
        }, TextInput);
        // 地点信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 联系方式
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(279:11)", "entry");
            // 联系方式
            Column.width('100%');
            // 联系方式
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('联系方式 *');
            Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(280:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入联系电话或微信号' });
            TextInput.debugLine("entry/src/main/ets/pages/PublishPage.ets(287:13)", "entry");
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.borderRadius(8);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: this.contactInfoError ? '#ff4444' : '#e0e0e0' });
            TextInput.onChange((value: string) => {
                this.contactInfo = value;
                this.validateContactInfo(value);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.contactInfoError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.contactInfoError);
                        Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(300:15)", "entry");
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
        // 联系方式
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图片上传
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(311:11)", "entry");
            // 图片上传
            Column.width('100%');
            // 图片上传
            Column.margin({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('上传图片');
            Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(312:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('最多可上传3张图片');
            Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(319:13)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图片上传区域
            Flex.create({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Start });
            Flex.debugLine("entry/src/main/ets/pages/PublishPage.ets(326:13)", "entry");
            // 图片上传区域
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 已选择的图片
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const imageUri = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.debugLine("entry/src/main/ets/pages/PublishPage.ets(329:17)", "entry");
                    Stack.margin({ right: 10, bottom: 10 });
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(imageUri);
                    Image.debugLine("entry/src/main/ets/pages/PublishPage.ets(330:19)", "entry");
                    Image.width(80);
                    Image.height(80);
                    Image.borderRadius(8);
                    Image.objectFit(ImageFit.Cover);
                    Image.border({ width: 1, color: '#e0e0e0' });
                    Image.alt('https://dummyimage.com/600x600/f0f0f0/999999.png&text=图片');
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 删除按钮
                    Text.create('×');
                    Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(339:19)", "entry");
                    // 删除按钮
                    Text.fontSize(16);
                    // 删除按钮
                    Text.fontColor(Color.White);
                    // 删除按钮
                    Text.backgroundColor('#ff4757');
                    // 删除按钮
                    Text.borderRadius(10);
                    // 删除按钮
                    Text.width(20);
                    // 删除按钮
                    Text.height(20);
                    // 删除按钮
                    Text.textAlign(TextAlign.Center);
                    // 删除按钮
                    Text.position({ x: 65, y: -5 });
                    // 删除按钮
                    Text.onClick(() => {
                        this.images.splice(index, 1);
                        this.selectedImageUris.splice(index, 1);
                    });
                }, Text);
                // 删除按钮
                Text.pop();
                Stack.pop();
            };
            this.forEachUpdateFunction(elmtId, this.images, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        // 已选择的图片
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 添加图片按钮
            if (this.images.length < 3) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.debugLine("entry/src/main/ets/pages/PublishPage.ets(358:17)", "entry");
                        Stack.onClick(async () => {
                            await this.selectPhotos();
                        });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(359:19)", "entry");
                        Column.width(80);
                        Column.height(80);
                        Column.borderRadius(8);
                        Column.backgroundColor('#f8f9fa');
                        Column.border({ width: 2, color: '#e0e0e0', style: BorderStyle.Dashed });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(366:19)", "entry");
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📷');
                        Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(367:21)", "entry");
                        Text.fontSize(20);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('添加');
                        Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(370:21)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#999999');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 图片上传区域
        Flex.pop();
        // 图片上传
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间选择
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/PublishPage.ets(387:11)", "entry");
            // 时间选择
            Column.width('100%');
            // 时间选择
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('丢失/拾得时间 *');
            Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(388:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入时间', text: this.lostTime });
            TextInput.debugLine("entry/src/main/ets/pages/PublishPage.ets(395:13)", "entry");
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.borderRadius(8);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: this.lostTimeError ? '#ff4444' : '#e0e0e0' });
            TextInput.onChange((value: string) => {
                this.lostTime = value;
                this.validateLostTime(value);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.lostTimeError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.lostTimeError);
                        Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(408:15)", "entry");
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
        // 时间选择
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 错误信息显示
            if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.debugLine("entry/src/main/ets/pages/PublishPage.ets(420:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#ff4444');
                        Text.width('100%');
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                });
            }
            // 发布按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发布按钮
            Button.createWithLabel(this.itemType === '寻物' ? '发布寻物启事' : '发布招领信息');
            Button.debugLine("entry/src/main/ets/pages/PublishPage.ets(428:11)", "entry");
            // 发布按钮
            Button.width('100%');
            // 发布按钮
            Button.height(50);
            // 发布按钮
            Button.fontSize(16);
            // 发布按钮
            Button.fontColor(Color.White);
            // 发布按钮
            Button.linearGradient({
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
            });
            // 发布按钮
            Button.borderRadius(8);
            // 发布按钮
            Button.enabled(!this.titleError && !this.categoryError && !this.descriptionError &&
                !this.contactInfoError && !this.lostTimeError &&
                !!this.title.trim() && !!this.category && !!this.description.trim() &&
                !!this.contactInfo.trim() && !!this.lostTime.trim());
            // 发布按钮
            Button.opacity((!this.titleError && !this.categoryError && !this.descriptionError &&
                !this.contactInfoError && !this.lostTimeError &&
                this.title.trim() && this.category && this.description.trim() &&
                this.contactInfo.trim() && this.lostTime.trim()) ? 1.0 : 0.6);
            // 发布按钮
            Button.onClick(async () => {
                // 表单验证
                if (!this.validateAllInputs()) {
                    return;
                }
                // 清除错误信息并设置加载状态
                this.errorMessage = '';
                this.isLoading = true;
                try {
                    // 构建请求数据
                    const requestData: PublishRequestData = {
                        itemName: this.title.trim(),
                        itemDescription: this.description.trim(),
                        images: this.images,
                        postType: this.itemType,
                        lostTime: this.lostTime.trim(),
                        lostLocation: this.location.trim(),
                        contact: this.contactInfo.trim(),
                        publisherId: 'user_12345',
                        communityId: 'comm_12345', // 默认值，实际从当前选择的社区获取
                    };
                    // 如果是寻主类型，添加暂存地点
                    if (this.itemType === '寻主') {
                        requestData.storageLocation = this.location.trim();
                    }
                    // 发送API请求
                    const url = `${API_BASE_URL}/api/post/create`;
                    const response = await HttpUtils.post(url, requestData);
                    const apiResponse: ApiResponse<ApiItemData> = JSON.parse(response);
                    if (apiResponse.code === 200 && apiResponse.data) {
                        console.log('发布成功:', apiResponse.data);
                        // 构造新发布的帖子信息
                        const newPost: LostItem = {
                            id: apiResponse.data.postId || `local_${Date.now()}`,
                            title: this.title.trim(),
                            category: this.category,
                            location: this.location.trim(),
                            time: TimeUtils.formatTime(this.lostTime.trim()),
                            originalTimestamp: new Date(this.lostTime.trim()).getTime(),
                            image: this.images.length > 0 ? this.images[0] : 'https://dummyimage.com/600x600/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B',
                            type: this.itemType,
                            status: '寻找中',
                            // 添加详细信息用于详情页显示
                            description: this.description,
                            contactInfo: this.contactInfo,
                            images: this.images.length > 0 ? this.images : ['https://dummyimage.com/600x600/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B'],
                            publisher: '我'
                        };
                        // 发布成功后，返回主页并传递新帖子信息
                        router.replaceUrl({
                            url: 'pages/MainPage',
                            params: {
                                newPost: JSON.stringify(newPost) // 传递新发布的帖子信息
                            }
                        });
                    }
                    else {
                        this.errorMessage = apiResponse.message || '发布失败，请重试';
                    }
                }
                catch (error) {
                    this.errorMessage = '网络请求失败，请重试';
                    console.error('发布失败:', error);
                }
                finally {
                    this.isLoading = false;
                }
            });
        }, Button);
        // 发布按钮
        Button.pop();
        Column.pop();
        // 内容区域
        Scroll.pop();
        Column.pop();
    }
    // 验证表单
    private validateForm(): boolean {
        if (!this.title.trim()) {
            this.errorMessage = '请输入物品名称';
            return false;
        }
        if (!this.category) {
            this.errorMessage = '请选择物品分类';
            return false;
        }
        if (!this.description.trim()) {
            this.errorMessage = '请输入详细描述';
            return false;
        }
        // 丢失地点为非必填项
        // if (!this.location.trim()) {
        //   this.errorMessage = '请输入相关地点';
        //   return false;
        // }
        if (!this.contactInfo.trim()) {
            this.errorMessage = '请输入联系方式';
            return false;
        }
        if (!this.lostTime.trim()) {
            this.errorMessage = '请输入时间';
            return false;
        }
        // 图片为非必须项
        // if (this.images.length === 0) {
        //   this.errorMessage = '请至少上传一张图片';
        //   return false;
        // }
        return true;
    }
    // 选择照片
    private async selectPhotos(): Promise<void> {
        try {
            const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
            photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
            photoSelectOptions.maxSelectNumber = 3;
            const photoViewPicker = new photoAccessHelper.PhotoViewPicker();
            const photoSelectResult = await photoViewPicker.select(photoSelectOptions);
            if (photoSelectResult && photoSelectResult.photoUris && photoSelectResult.photoUris.length > 0) {
                this.selectedImageUris = photoSelectResult.photoUris;
                this.images = photoSelectResult.photoUris; // 暂时使用URI作为图片路径
                console.info('选择照片成功，数量:', this.images.length);
            }
        }
        catch (error) {
            console.error('选择照片失败:', error);
            this.errorMessage = '选择照片失败，请重试';
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PublishPage";
    }
}
registerNamedRoute(() => new PublishPage(undefined, {}), "", { bundleName: "com.pizza.lostfound", moduleName: "entry", pagePath: "pages/PublishPage", pageFullPath: "entry/src/main/ets/pages/PublishPage", integratedHsp: "false", moduleType: "followWithHap" });
