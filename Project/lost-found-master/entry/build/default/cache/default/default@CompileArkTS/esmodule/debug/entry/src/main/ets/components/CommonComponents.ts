if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ImageUploader_Params {
    maxCount?: number;
    imageSize?: number;
    selectedImages?: string[];
    onImagesChange?: (images: string[]) => void;
}
interface BottomTabBar_Params {
    currentIndex?: number;
    onTabClick?: (index: number) => void;
    tabs?: TabItem[];
}
interface HeaderBar_Params {
    title?: string;
    showBack?: boolean;
    showAction?: boolean;
    actionText?: string;
    onBack?: () => void;
    onAction?: () => void;
}
interface LoadingSpinner_Params {
    spinnerSize?: number;
    color?: ResourceColor;
    text?: string;
}
interface EmptyState_Params {
    icon?: string;
    title?: string;
    description?: string;
    actionText?: string;
    onAction?: () => void;
}
interface StatusTag_Params {
    tagType?: '寻物' | '寻主' | '寻找中' | '已找到';
    tagSize?: 'small' | 'medium' | 'large';
    text?: string;
}
interface CardContainer_Params {
    cardPadding?: number;
    cardMargin?: number;
    cardBackgroundColor?: ResourceColor;
    cardBorderRadius?: number;
    showShadow?: boolean;
    content?: () => void;
}
interface CustomTextInput_Params {
    label?: string;
    placeholder?: string;
    value?: string;
    errorMessage?: string;
    inputType?: InputType;
    maxLength?: number;
}
interface GradientButton_Params {
    text?: string;
    buttonWidth?: string | number;
    buttonHeight?: string | number;
    fontSize?: number;
    fontColor?: ResourceColor;
    onButtonClick?: () => void;
}
import router from "@ohos:router";
// 导航工具类
export class NavigationUtils {
    // 统一的底部导航处理函数
    static handleTabNavigation(targetIndex: number, currentIndex: number) {
        // 如果已经在目标页面，不进行跳转
        if (targetIndex === currentIndex) {
            return;
        }
        switch (targetIndex) {
            case 0:
                router.pushUrl({ url: 'pages/MainPage' });
                break;
            case 1:
                router.pushUrl({ url: 'pages/CommunityPage' });
                break;
            case 2:
                router.pushUrl({ url: 'pages/MessagePage' });
                break;
            case 3:
                router.pushUrl({ url: 'pages/ProfilePage' });
                break;
        }
    }
}
export class GradientButton extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__text = new SynchedPropertySimpleOneWayPU(params.text, this, "text");
        this.__buttonWidth = new SynchedPropertySimpleOneWayPU(params.buttonWidth, this, "buttonWidth");
        this.__buttonHeight = new SynchedPropertySimpleOneWayPU(params.buttonHeight, this, "buttonHeight");
        this.__fontSize = new SynchedPropertySimpleOneWayPU(params.fontSize, this, "fontSize");
        this.__fontColor = new SynchedPropertyObjectOneWayPU(params.fontColor, this, "fontColor");
        this.onButtonClick = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: GradientButton_Params) {
        if (params.text === undefined) {
            this.__text.set('');
        }
        if (params.buttonWidth === undefined) {
            this.__buttonWidth.set('100%');
        }
        if (params.buttonHeight === undefined) {
            this.__buttonHeight.set(48);
        }
        if (params.fontSize === undefined) {
            this.__fontSize.set(16);
        }
        if (params.fontColor === undefined) {
            this.__fontColor.set(Color.White);
        }
        if (params.onButtonClick !== undefined) {
            this.onButtonClick = params.onButtonClick;
        }
    }
    updateStateVars(params: GradientButton_Params) {
        this.__text.reset(params.text);
        this.__buttonWidth.reset(params.buttonWidth);
        this.__buttonHeight.reset(params.buttonHeight);
        this.__fontSize.reset(params.fontSize);
        this.__fontColor.reset(params.fontColor);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__text.purgeDependencyOnElmtId(rmElmtId);
        this.__buttonWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__buttonHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__fontSize.purgeDependencyOnElmtId(rmElmtId);
        this.__fontColor.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__text.aboutToBeDeleted();
        this.__buttonWidth.aboutToBeDeleted();
        this.__buttonHeight.aboutToBeDeleted();
        this.__fontSize.aboutToBeDeleted();
        this.__fontColor.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __text: SynchedPropertySimpleOneWayPU<string>;
    get text() {
        return this.__text.get();
    }
    set text(newValue: string) {
        this.__text.set(newValue);
    }
    private __buttonWidth: SynchedPropertySimpleOneWayPU<string | number>;
    get buttonWidth() {
        return this.__buttonWidth.get();
    }
    set buttonWidth(newValue: string | number) {
        this.__buttonWidth.set(newValue);
    }
    private __buttonHeight: SynchedPropertySimpleOneWayPU<string | number>;
    get buttonHeight() {
        return this.__buttonHeight.get();
    }
    set buttonHeight(newValue: string | number) {
        this.__buttonHeight.set(newValue);
    }
    private __fontSize: SynchedPropertySimpleOneWayPU<number>;
    get fontSize() {
        return this.__fontSize.get();
    }
    set fontSize(newValue: number) {
        this.__fontSize.set(newValue);
    }
    private __fontColor: SynchedPropertySimpleOneWayPU<ResourceColor>;
    get fontColor() {
        return this.__fontColor.get();
    }
    set fontColor(newValue: ResourceColor) {
        this.__fontColor.set(newValue);
    }
    private onButtonClick?: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.text);
            Button.width(this.buttonWidth);
            Button.height(this.buttonHeight);
            Button.fontSize(this.fontSize);
            Button.fontColor(ObservedObject.GetRawObject(this.fontColor));
            Button.linearGradient({
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
            });
            Button.borderRadius(8);
            Button.onClick(() => {
                if (this.onButtonClick) {
                    this.onButtonClick();
                }
            });
        }, Button);
        Button.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class CustomTextInput extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__label = new SynchedPropertySimpleOneWayPU(params.label, this, "label");
        this.__placeholder = new SynchedPropertySimpleOneWayPU(params.placeholder, this, "placeholder");
        this.__value = new SynchedPropertySimpleTwoWayPU(params.value, this, "value");
        this.__errorMessage = new SynchedPropertySimpleOneWayPU(params.errorMessage, this, "errorMessage");
        this.__inputType = new SynchedPropertySimpleOneWayPU(params.inputType, this, "inputType");
        this.__maxLength = new SynchedPropertySimpleOneWayPU(params.maxLength, this, "maxLength");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CustomTextInput_Params) {
        if (params.label === undefined) {
            this.__label.set('');
        }
        if (params.placeholder === undefined) {
            this.__placeholder.set('');
        }
        if (params.errorMessage === undefined) {
            this.__errorMessage.set('');
        }
        if (params.inputType === undefined) {
            this.__inputType.set(InputType.Normal);
        }
        if (params.maxLength === undefined) {
            this.__maxLength.set(-1);
        }
    }
    updateStateVars(params: CustomTextInput_Params) {
        this.__label.reset(params.label);
        this.__placeholder.reset(params.placeholder);
        this.__errorMessage.reset(params.errorMessage);
        this.__inputType.reset(params.inputType);
        this.__maxLength.reset(params.maxLength);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__label.purgeDependencyOnElmtId(rmElmtId);
        this.__placeholder.purgeDependencyOnElmtId(rmElmtId);
        this.__value.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__inputType.purgeDependencyOnElmtId(rmElmtId);
        this.__maxLength.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__label.aboutToBeDeleted();
        this.__placeholder.aboutToBeDeleted();
        this.__value.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__inputType.aboutToBeDeleted();
        this.__maxLength.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __label: SynchedPropertySimpleOneWayPU<string>;
    get label() {
        return this.__label.get();
    }
    set label(newValue: string) {
        this.__label.set(newValue);
    }
    private __placeholder: SynchedPropertySimpleOneWayPU<string>;
    get placeholder() {
        return this.__placeholder.get();
    }
    set placeholder(newValue: string) {
        this.__placeholder.set(newValue);
    }
    private __value: SynchedPropertySimpleTwoWayPU<string>;
    get value() {
        return this.__value.get();
    }
    set value(newValue: string) {
        this.__value.set(newValue);
    }
    private __errorMessage: SynchedPropertySimpleOneWayPU<string>;
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    private __inputType: SynchedPropertySimpleOneWayPU<InputType>;
    get inputType() {
        return this.__inputType.get();
    }
    set inputType(newValue: InputType) {
        this.__inputType.set(newValue);
    }
    private __maxLength: SynchedPropertySimpleOneWayPU<number>;
    get maxLength() {
        return this.__maxLength.get();
    }
    set maxLength(newValue: number) {
        this.__maxLength.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.label) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.label);
                        Text.fontSize(16);
                        Text.fontColor('#333333');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ bottom: 8 });
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: this.placeholder, text: this.value });
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.backgroundColor('#f8f9fa');
            TextInput.borderRadius(8);
            TextInput.border({ width: 1, color: this.errorMessage ? '#ff6b6b' : '#dee2e6' });
            TextInput.type(this.inputType);
            TextInput.maxLength(this.maxLength > 0 ? this.maxLength : undefined);
            TextInput.onChange((value: string) => {
                this.value = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.fontSize(14);
                        Text.fontColor('#ff6b6b');
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
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class CardContainer extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__cardPadding = new SynchedPropertySimpleOneWayPU(params.cardPadding, this, "cardPadding");
        this.__cardMargin = new SynchedPropertySimpleOneWayPU(params.cardMargin, this, "cardMargin");
        this.__cardBackgroundColor = new SynchedPropertyObjectOneWayPU(params.cardBackgroundColor, this, "cardBackgroundColor");
        this.__cardBorderRadius = new SynchedPropertySimpleOneWayPU(params.cardBorderRadius, this, "cardBorderRadius");
        this.__showShadow = new SynchedPropertySimpleOneWayPU(params.showShadow, this, "showShadow");
        this.content = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CardContainer_Params) {
        if (params.cardPadding === undefined) {
            this.__cardPadding.set(20);
        }
        if (params.cardMargin === undefined) {
            this.__cardMargin.set(0);
        }
        if (params.cardBackgroundColor === undefined) {
            this.__cardBackgroundColor.set(Color.White);
        }
        if (params.cardBorderRadius === undefined) {
            this.__cardBorderRadius.set(12);
        }
        if (params.showShadow === undefined) {
            this.__showShadow.set(true);
        }
        if (params.content !== undefined) {
            this.content = params.content;
        }
    }
    updateStateVars(params: CardContainer_Params) {
        this.__cardPadding.reset(params.cardPadding);
        this.__cardMargin.reset(params.cardMargin);
        this.__cardBackgroundColor.reset(params.cardBackgroundColor);
        this.__cardBorderRadius.reset(params.cardBorderRadius);
        this.__showShadow.reset(params.showShadow);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__cardPadding.purgeDependencyOnElmtId(rmElmtId);
        this.__cardMargin.purgeDependencyOnElmtId(rmElmtId);
        this.__cardBackgroundColor.purgeDependencyOnElmtId(rmElmtId);
        this.__cardBorderRadius.purgeDependencyOnElmtId(rmElmtId);
        this.__showShadow.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__cardPadding.aboutToBeDeleted();
        this.__cardMargin.aboutToBeDeleted();
        this.__cardBackgroundColor.aboutToBeDeleted();
        this.__cardBorderRadius.aboutToBeDeleted();
        this.__showShadow.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __cardPadding: SynchedPropertySimpleOneWayPU<number>;
    get cardPadding() {
        return this.__cardPadding.get();
    }
    set cardPadding(newValue: number) {
        this.__cardPadding.set(newValue);
    }
    private __cardMargin: SynchedPropertySimpleOneWayPU<number>;
    get cardMargin() {
        return this.__cardMargin.get();
    }
    set cardMargin(newValue: number) {
        this.__cardMargin.set(newValue);
    }
    private __cardBackgroundColor: SynchedPropertySimpleOneWayPU<ResourceColor>;
    get cardBackgroundColor() {
        return this.__cardBackgroundColor.get();
    }
    set cardBackgroundColor(newValue: ResourceColor) {
        this.__cardBackgroundColor.set(newValue);
    }
    private __cardBorderRadius: SynchedPropertySimpleOneWayPU<number>;
    get cardBorderRadius() {
        return this.__cardBorderRadius.get();
    }
    set cardBorderRadius(newValue: number) {
        this.__cardBorderRadius.set(newValue);
    }
    private __showShadow: SynchedPropertySimpleOneWayPU<boolean>;
    get showShadow() {
        return this.__showShadow.get();
    }
    set showShadow(newValue: boolean) {
        this.__showShadow.set(newValue);
    }
    private __content;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(this.cardPadding);
            Column.margin(this.cardMargin);
            Column.backgroundColor(ObservedObject.GetRawObject(this.cardBackgroundColor));
            Column.borderRadius(this.cardBorderRadius);
            Column.shadow(this.showShadow ? {
                radius: 4,
                color: '#00000010',
                offsetX: 0,
                offsetY: 2
            } : null);
        }, Column);
        this.content.bind(this)();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
// 状态标签组件
interface GeneratedObjectLiteralInterface_1 {
    bg: string;
    text: Color;
}
interface GeneratedObjectLiteralInterface_2 {
    fontSize: number;
    padding: Padding;
}
export class StatusTag extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__tagType = new SynchedPropertySimpleOneWayPU(params.tagType, this, "tagType");
        this.__tagSize = new SynchedPropertySimpleOneWayPU(params.tagSize, this, "tagSize");
        this.__text = new SynchedPropertySimpleOneWayPU(params.text, this, "text");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: StatusTag_Params) {
        if (params.tagType === undefined) {
            this.__tagType.set('寻物');
        }
        if (params.tagSize === undefined) {
            this.__tagSize.set('medium');
        }
        if (params.text === undefined) {
            this.__text.set('');
        }
    }
    updateStateVars(params: StatusTag_Params) {
        this.__tagType.reset(params.tagType);
        this.__tagSize.reset(params.tagSize);
        this.__text.reset(params.text);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__tagType.purgeDependencyOnElmtId(rmElmtId);
        this.__tagSize.purgeDependencyOnElmtId(rmElmtId);
        this.__text.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tagType.aboutToBeDeleted();
        this.__tagSize.aboutToBeDeleted();
        this.__text.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __tagType: SynchedPropertySimpleOneWayPU<'寻物' | '寻主' | '寻找中' | '已找到'>;
    get tagType() {
        return this.__tagType.get();
    }
    set tagType(newValue: '寻物' | '寻主' | '寻找中' | '已找到') {
        this.__tagType.set(newValue);
    }
    private __tagSize: SynchedPropertySimpleOneWayPU<'small' | 'medium' | 'large'>;
    get tagSize() {
        return this.__tagSize.get();
    }
    set tagSize(newValue: 'small' | 'medium' | 'large') {
        this.__tagSize.set(newValue);
    }
    private __text: SynchedPropertySimpleOneWayPU<string>;
    get text() {
        return this.__text.get();
    }
    set text(newValue: string) {
        this.__text.set(newValue);
    }
    private getTagStyle() {
        if (this.tagType === '寻物') {
            return ({ bg: '#ff6b6b', text: Color.White } as GeneratedObjectLiteralInterface_1);
        }
        else if (this.tagType === '寻主') {
            return ({ bg: '#51cf66', text: Color.White } as GeneratedObjectLiteralInterface_1);
        }
        else if (this.tagType === '寻找中') {
            return ({ bg: '#339af0', text: Color.White } as GeneratedObjectLiteralInterface_1);
        }
        else if (this.tagType === '已找到') {
            return ({ bg: '#868e96', text: Color.White } as GeneratedObjectLiteralInterface_1);
        }
        else {
            return ({ bg: '#ff6b6b', text: Color.White } as GeneratedObjectLiteralInterface_1);
        }
    }
    private getTagSize() {
        if (this.tagSize === 'small') {
            return ({ fontSize: 12, padding: { left: 6, right: 6, top: 2, bottom: 2 } } as GeneratedObjectLiteralInterface_2);
        }
        else if (this.tagSize === 'medium') {
            return ({ fontSize: 14, padding: { left: 8, right: 8, top: 4, bottom: 4 } } as GeneratedObjectLiteralInterface_2);
        }
        else if (this.tagSize === 'large') {
            return ({ fontSize: 16, padding: { left: 10, right: 10, top: 6, bottom: 6 } } as GeneratedObjectLiteralInterface_2);
        }
        else {
            return ({ fontSize: 14, padding: { left: 8, right: 8, top: 4, bottom: 4 } } as GeneratedObjectLiteralInterface_2);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.text || this.tagType);
            Text.fontSize(this.getTagSize().fontSize);
            Text.fontColor(this.getTagStyle().text);
            Text.backgroundColor(this.getTagStyle().bg);
            Text.borderRadius(12);
            Text.padding(this.getTagSize().padding);
        }, Text);
        Text.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class EmptyState extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__icon = new SynchedPropertySimpleOneWayPU(params.icon, this, "icon");
        this.__title = new SynchedPropertySimpleOneWayPU(params.title, this, "title");
        this.__description = new SynchedPropertySimpleOneWayPU(params.description, this, "description");
        this.__actionText = new SynchedPropertySimpleOneWayPU(params.actionText, this, "actionText");
        this.onAction = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: EmptyState_Params) {
        if (params.icon === undefined) {
            this.__icon.set('📭');
        }
        if (params.title === undefined) {
            this.__title.set('暂无数据');
        }
        if (params.description === undefined) {
            this.__description.set('');
        }
        if (params.actionText === undefined) {
            this.__actionText.set('');
        }
        if (params.onAction !== undefined) {
            this.onAction = params.onAction;
        }
    }
    updateStateVars(params: EmptyState_Params) {
        this.__icon.reset(params.icon);
        this.__title.reset(params.title);
        this.__description.reset(params.description);
        this.__actionText.reset(params.actionText);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__icon.purgeDependencyOnElmtId(rmElmtId);
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__description.purgeDependencyOnElmtId(rmElmtId);
        this.__actionText.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__icon.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__description.aboutToBeDeleted();
        this.__actionText.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __icon: SynchedPropertySimpleOneWayPU<string>;
    get icon() {
        return this.__icon.get();
    }
    set icon(newValue: string) {
        this.__icon.set(newValue);
    }
    private __title: SynchedPropertySimpleOneWayPU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __description: SynchedPropertySimpleOneWayPU<string>;
    get description() {
        return this.__description.get();
    }
    set description(newValue: string) {
        this.__description.set(newValue);
    }
    private __actionText: SynchedPropertySimpleOneWayPU<string>;
    get actionText() {
        return this.__actionText.get();
    }
    set actionText(newValue: string) {
        this.__actionText.set(newValue);
    }
    private onAction?: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(40);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.icon);
            Text.fontSize(48);
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#666666');
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.description) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.description);
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ bottom: 20 });
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.actionText && this.onAction) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.actionText);
                        Button.height(40);
                        Button.fontSize(14);
                        Button.fontColor('#667eea');
                        Button.backgroundColor('#f0f2ff');
                        Button.borderRadius(20);
                        Button.padding({ left: 20, right: 20 });
                        Button.onClick(() => {
                            if (this.onAction) {
                                this.onAction();
                            }
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class LoadingSpinner extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__spinnerSize = new SynchedPropertySimpleOneWayPU(params.spinnerSize, this, "spinnerSize");
        this.__color = new SynchedPropertyObjectOneWayPU(params.color, this, "color");
        this.__text = new SynchedPropertySimpleOneWayPU(params.text, this, "text");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoadingSpinner_Params) {
        if (params.spinnerSize === undefined) {
            this.__spinnerSize.set(32);
        }
        if (params.color === undefined) {
            this.__color.set('#667eea');
        }
        if (params.text === undefined) {
            this.__text.set('');
        }
    }
    updateStateVars(params: LoadingSpinner_Params) {
        this.__spinnerSize.reset(params.spinnerSize);
        this.__color.reset(params.color);
        this.__text.reset(params.text);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__spinnerSize.purgeDependencyOnElmtId(rmElmtId);
        this.__color.purgeDependencyOnElmtId(rmElmtId);
        this.__text.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__spinnerSize.aboutToBeDeleted();
        this.__color.aboutToBeDeleted();
        this.__text.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __spinnerSize: SynchedPropertySimpleOneWayPU<number>;
    get spinnerSize() {
        return this.__spinnerSize.get();
    }
    set spinnerSize(newValue: number) {
        this.__spinnerSize.set(newValue);
    }
    private __color: SynchedPropertySimpleOneWayPU<ResourceColor>;
    get color() {
        return this.__color.get();
    }
    set color(newValue: ResourceColor) {
        this.__color.set(newValue);
    }
    private __text: SynchedPropertySimpleOneWayPU<string>;
    get text() {
        return this.__text.get();
    }
    set text(newValue: string) {
        this.__text.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            LoadingProgress.create();
            LoadingProgress.width(this.spinnerSize);
            LoadingProgress.height(this.spinnerSize);
            LoadingProgress.color(ObservedObject.GetRawObject(this.color));
        }, LoadingProgress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.text) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.text);
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.margin({ top: 10 });
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
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class HeaderBar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__title = new SynchedPropertySimpleOneWayPU(params.title, this, "title");
        this.__showBack = new SynchedPropertySimpleOneWayPU(params.showBack, this, "showBack");
        this.__showAction = new SynchedPropertySimpleOneWayPU(params.showAction, this, "showAction");
        this.__actionText = new SynchedPropertySimpleOneWayPU(params.actionText, this, "actionText");
        this.onBack = undefined;
        this.onAction = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HeaderBar_Params) {
        if (params.title === undefined) {
            this.__title.set('');
        }
        if (params.showBack === undefined) {
            this.__showBack.set(true);
        }
        if (params.showAction === undefined) {
            this.__showAction.set(false);
        }
        if (params.actionText === undefined) {
            this.__actionText.set('');
        }
        if (params.onBack !== undefined) {
            this.onBack = params.onBack;
        }
        if (params.onAction !== undefined) {
            this.onAction = params.onAction;
        }
    }
    updateStateVars(params: HeaderBar_Params) {
        this.__title.reset(params.title);
        this.__showBack.reset(params.showBack);
        this.__showAction.reset(params.showAction);
        this.__actionText.reset(params.actionText);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__showBack.purgeDependencyOnElmtId(rmElmtId);
        this.__showAction.purgeDependencyOnElmtId(rmElmtId);
        this.__actionText.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__showBack.aboutToBeDeleted();
        this.__showAction.aboutToBeDeleted();
        this.__actionText.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: SynchedPropertySimpleOneWayPU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __showBack: SynchedPropertySimpleOneWayPU<boolean>;
    get showBack() {
        return this.__showBack.get();
    }
    set showBack(newValue: boolean) {
        this.__showBack.set(newValue);
    }
    private __showAction: SynchedPropertySimpleOneWayPU<boolean>;
    get showAction() {
        return this.__showAction.get();
    }
    set showAction(newValue: boolean) {
        this.__showAction.set(newValue);
    }
    private __actionText: SynchedPropertySimpleOneWayPU<string>;
    get actionText() {
        return this.__actionText.get();
    }
    set actionText(newValue: string) {
        this.__actionText.set(newValue);
    }
    private onBack?: () => void;
    private onAction?: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(60);
            Row.linearGradient({
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
            });
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.alignItems(VerticalAlign.Center);
            Row.padding({ left: 15, right: 15, top: 10, bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showBack) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('←');
                        Button.fontSize(20);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            if (this.onBack) {
                                this.onBack();
                            }
                            else {
                                router.back();
                            }
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width(40);
                    }, Row);
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showAction && this.actionText) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.actionText);
                        Button.fontSize(16);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            if (this.onAction) {
                                this.onAction();
                            }
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width(40);
                    }, Row);
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
// 定义Tab接口
interface TabItem {
    icon: string;
    text: string;
    activeColor?: ResourceColor;
    inactiveColor?: ResourceColor;
}
export class BottomTabBar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new SynchedPropertySimpleOneWayPU(params.currentIndex, this, "currentIndex");
        this.onTabClick = undefined;
        this.tabs = [
            { icon: '🏠', text: '首页' },
            { icon: '🏘️', text: '社区' },
            { icon: '💬', text: '消息' },
            { icon: '👤', text: '我的' }
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BottomTabBar_Params) {
        if (params.currentIndex === undefined) {
            this.__currentIndex.set(0);
        }
        if (params.onTabClick !== undefined) {
            this.onTabClick = params.onTabClick;
        }
        if (params.tabs !== undefined) {
            this.tabs = params.tabs;
        }
    }
    updateStateVars(params: BottomTabBar_Params) {
        this.__currentIndex.reset(params.currentIndex);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: SynchedPropertySimpleOneWayPU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private onTabClick?: (index: number) => void;
    // 固定的导航项目，按照原型图设计
    private tabs: TabItem[];
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(70);
            Row.backgroundColor(Color.White);
            Row.border({ width: { top: 1 }, color: '#e0e0e0' });
            Row.justifyContent(FlexAlign.SpaceAround);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.layoutWeight(1);
                    Column.justifyContent(FlexAlign.Center);
                    Column.alignItems(HorizontalAlign.Center);
                    Column.padding({ top: 8, bottom: 8 });
                    Column.onClick(() => {
                        if (this.onTabClick) {
                            this.onTabClick(index);
                        }
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab.icon);
                    Text.fontSize(20);
                    Text.fontColor(index === this.currentIndex ? '#667eea' : '#999999');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab.text);
                    Text.fontSize(12);
                    Text.fontColor(index === this.currentIndex ? '#667eea' : '#999999');
                    Text.margin({ top: 4 });
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabs, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class ImageUploader extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__maxCount = new SynchedPropertySimpleOneWayPU(params.maxCount, this, "maxCount");
        this.__imageSize = new SynchedPropertySimpleOneWayPU(params.imageSize, this, "imageSize");
        this.__selectedImages = new ObservedPropertyObjectPU([], this, "selectedImages");
        this.onImagesChange = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ImageUploader_Params) {
        if (params.maxCount === undefined) {
            this.__maxCount.set(3);
        }
        if (params.imageSize === undefined) {
            this.__imageSize.set(80);
        }
        if (params.selectedImages !== undefined) {
            this.selectedImages = params.selectedImages;
        }
        if (params.onImagesChange !== undefined) {
            this.onImagesChange = params.onImagesChange;
        }
    }
    updateStateVars(params: ImageUploader_Params) {
        this.__maxCount.reset(params.maxCount);
        this.__imageSize.reset(params.imageSize);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__maxCount.purgeDependencyOnElmtId(rmElmtId);
        this.__imageSize.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedImages.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__maxCount.aboutToBeDeleted();
        this.__imageSize.aboutToBeDeleted();
        this.__selectedImages.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __maxCount: SynchedPropertySimpleOneWayPU<number>;
    get maxCount() {
        return this.__maxCount.get();
    }
    set maxCount(newValue: number) {
        this.__maxCount.set(newValue);
    }
    private __imageSize: SynchedPropertySimpleOneWayPU<number>;
    get imageSize() {
        return this.__imageSize.get();
    }
    set imageSize(newValue: number) {
        this.__imageSize.set(newValue);
    }
    private __selectedImages: ObservedPropertyObjectPU<string[]>;
    get selectedImages() {
        return this.__selectedImages.get();
    }
    set selectedImages(newValue: string[]) {
        this.__selectedImages.set(newValue);
    }
    private onImagesChange?: (images: string[]) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Start });
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 已选择的图片
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const image = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.margin({ right: 10, bottom: 10 });
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width(this.imageSize);
                    Column.height(this.imageSize);
                    Column.borderRadius(8);
                    Column.backgroundColor('#f0f0f0');
                    Column.border({ width: 1, color: '#e0e0e0' });
                }, Column);
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('🖼️');
                    Text.fontSize(24);
                    Text.fontColor('#999999');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 删除按钮
                    Text.create('×');
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
                    Text.position({ x: this.imageSize - 15, y: -5 });
                    // 删除按钮
                    Text.onClick(() => {
                        this.selectedImages.splice(index, 1);
                        if (this.onImagesChange) {
                            this.onImagesChange(ObservedObject.GetRawObject(this.selectedImages));
                        }
                    });
                }, Text);
                // 删除按钮
                Text.pop();
                Stack.pop();
            };
            this.forEachUpdateFunction(elmtId, this.selectedImages, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        // 已选择的图片
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 添加图片按钮
            if (this.selectedImages.length < this.maxCount) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.onClick(() => {
                            this.selectedImages.push(`image_${this.selectedImages.length + 1}`);
                            if (this.onImagesChange) {
                                this.onImagesChange(ObservedObject.GetRawObject(this.selectedImages));
                            }
                        });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width(this.imageSize);
                        Column.height(this.imageSize);
                        Column.borderRadius(8);
                        Column.backgroundColor('#f8f9fa');
                        Column.border({ width: 2, color: '#e0e0e0', style: BorderStyle.Dashed });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📷');
                        Text.fontSize(20);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('添加');
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
        Flex.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
