if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RegisterPage_Params {
    username?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    avatar?: string;
    errorMessage?: string;
    usernameError?: string;
    phoneError?: string;
    passwordError?: string;
    confirmPasswordError?: string;
    isLoading?: boolean;
}
import router from "@ohos:router";
import { HeaderBar } from "@normalized:N&&&entry/src/main/ets/components/CommonComponents&";
class RegisterPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__phoneNumber = new ObservedPropertySimplePU('', this, "phoneNumber");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__avatar = new ObservedPropertySimplePU('', this, "avatar");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__usernameError = new ObservedPropertySimplePU('', this, "usernameError");
        this.__phoneError = new ObservedPropertySimplePU('', this, "phoneError");
        this.__passwordError = new ObservedPropertySimplePU('', this, "passwordError");
        this.__confirmPasswordError = new ObservedPropertySimplePU('', this, "confirmPasswordError");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RegisterPage_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.phoneNumber !== undefined) {
            this.phoneNumber = params.phoneNumber;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.confirmPassword !== undefined) {
            this.confirmPassword = params.confirmPassword;
        }
        if (params.avatar !== undefined) {
            this.avatar = params.avatar;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.usernameError !== undefined) {
            this.usernameError = params.usernameError;
        }
        if (params.phoneError !== undefined) {
            this.phoneError = params.phoneError;
        }
        if (params.passwordError !== undefined) {
            this.passwordError = params.passwordError;
        }
        if (params.confirmPasswordError !== undefined) {
            this.confirmPasswordError = params.confirmPasswordError;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
    }
    updateStateVars(params: RegisterPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__phoneNumber.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__avatar.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__usernameError.purgeDependencyOnElmtId(rmElmtId);
        this.__phoneError.purgeDependencyOnElmtId(rmElmtId);
        this.__passwordError.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPasswordError.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__phoneNumber.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__avatar.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__usernameError.aboutToBeDeleted();
        this.__phoneError.aboutToBeDeleted();
        this.__passwordError.aboutToBeDeleted();
        this.__confirmPasswordError.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __phoneNumber: ObservedPropertySimplePU<string>;
    get phoneNumber() {
        return this.__phoneNumber.get();
    }
    set phoneNumber(newValue: string) {
        this.__phoneNumber.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __confirmPassword: ObservedPropertySimplePU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(newValue: string) {
        this.__confirmPassword.set(newValue);
    }
    private __avatar: ObservedPropertySimplePU<string>;
    get avatar() {
        return this.__avatar.get();
    }
    set avatar(newValue: string) {
        this.__avatar.set(newValue);
    }
    private __errorMessage: ObservedPropertySimplePU<string>;
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    private __usernameError: ObservedPropertySimplePU<string>;
    get usernameError() {
        return this.__usernameError.get();
    }
    set usernameError(newValue: string) {
        this.__usernameError.set(newValue);
    }
    private __phoneError: ObservedPropertySimplePU<string>;
    get phoneError() {
        return this.__phoneError.get();
    }
    set phoneError(newValue: string) {
        this.__phoneError.set(newValue);
    }
    private __passwordError: ObservedPropertySimplePU<string>;
    get passwordError() {
        return this.__passwordError.get();
    }
    set passwordError(newValue: string) {
        this.__passwordError.set(newValue);
    }
    private __confirmPasswordError: ObservedPropertySimplePU<string>;
    get confirmPasswordError() {
        return this.__confirmPasswordError.get();
    }
    set confirmPasswordError(newValue: string) {
        this.__confirmPasswordError.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    // 验证用户名
    validateUsername(value: string): string {
        if (!value.trim()) {
            return '请输入用户名';
        }
        if (value.trim().length < 3) {
            return '用户名长度不能少于3位';
        }
        if (value.trim().length > 20) {
            return '用户名长度不能超过20位';
        }
        return '';
    }
    // 验证手机号
    validatePhone(value: string): string {
        if (!value.trim()) {
            return '请输入手机号';
        }
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(value.trim())) {
            return '请输入正确的手机号格式';
        }
        return '';
    }
    // 验证密码
    validatePassword(value: string): string {
        if (!value.trim()) {
            return '请输入密码';
        }
        if (value.length < 3) {
            return '密码长度不能少于3位';
        }
        if (value.length > 20) {
            return '密码长度不能超过20位';
        }
        return '';
    }
    // 验证确认密码
    validateConfirmPassword(value: string): string {
        if (!value.trim()) {
            return '请确认密码';
        }
        if (value !== this.password) {
            return '两次输入的密码不一致';
        }
        return '';
    }
    // 注册方法
    async register() {
        // 验证所有输入
        this.usernameError = this.validateUsername(this.username);
        this.phoneError = this.validatePhone(this.phoneNumber);
        this.passwordError = this.validatePassword(this.password);
        this.confirmPasswordError = this.validateConfirmPassword(this.confirmPassword);
        if (this.usernameError || this.phoneError || this.passwordError || this.confirmPasswordError) {
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        try {
            // 注册请求
            await new Promise<string>(resolve => setTimeout(resolve, 1000));
            // 注册成功后跳转到主页
            router.pushUrl({ url: 'pages/MainPage' });
        }
        catch (error) {
            console.error('注册请求失败:', error);
            this.errorMessage = '注册失败，请稍后重试';
        }
        finally {
            this.isLoading = false;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RegisterPage.ets(101:5)", "entry");
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
                        title: '注册',
                        showBack: true,
                        onBack: () => {
                            router.back();
                        },
                        showAction: false,
                        actionText: '👤',
                        onAction: () => {
                            router.pushUrl({ url: 'pages/ProfilePage' });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RegisterPage.ets", line: 103, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '注册',
                            showBack: true,
                            onBack: () => {
                                router.back();
                            },
                            showAction: false,
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
                        title: '注册',
                        showBack: true,
                        showAction: false,
                        actionText: '👤'
                    });
                }
            }, { name: "HeaderBar" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区域
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RegisterPage.ets(118:7)", "entry");
            // 内容区域
            Column.layoutWeight(1);
            // 内容区域
            Column.padding(20);
            // 内容区域
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 头像上传
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RegisterPage.ets(120:9)", "entry");
            // 头像上传
            Column.margin({ top: 20, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/RegisterPage.ets(121:11)", "entry");
            Stack.margin({ bottom: 20 });
            Stack.onClick(() => {
                console.log('头像上传点击');
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create({ width: 80, height: 80 });
            Circle.debugLine("entry/src/main/ets/pages/RegisterPage.ets(122:13)", "entry");
            Circle.fill({ "id": 125833939, "type": 10001, params: [], "bundleName": "com.pizza.lostfound", "moduleName": "entry" });
            Circle.border({ width: 2, color: '#dddddd', style: BorderStyle.Dashed });
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📷');
            Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(126:13)", "entry");
            Text.fontSize(24);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Stack.pop();
        // 头像上传
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 表单区域
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RegisterPage.ets(138:9)", "entry");
            // 表单区域
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名输入
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RegisterPage.ets(140:11)", "entry");
            // 用户名输入
            Column.width('100%');
            // 用户名输入
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户名');
            Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(141:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#555555');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入用户名' });
            TextInput.debugLine("entry/src/main/ets/pages/RegisterPage.ets(148:13)", "entry");
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.borderRadius(8);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: this.usernameError ? '#ff4444' : '#dddddd' });
            TextInput.onChange((value: string) => {
                this.username = value;
                this.usernameError = this.validateUsername(value);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 用户名错误提示
            if (this.usernameError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.usernameError);
                        Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(162:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#ff4444');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ top: 5 });
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
        // 用户名输入
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手机号输入
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RegisterPage.ets(173:11)", "entry");
            // 手机号输入
            Column.width('100%');
            // 手机号输入
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('手机号');
            Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(174:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#555555');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入手机号' });
            TextInput.debugLine("entry/src/main/ets/pages/RegisterPage.ets(181:13)", "entry");
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.borderRadius(8);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: this.phoneError ? '#ff4444' : '#dddddd' });
            TextInput.type(InputType.PhoneNumber);
            TextInput.onChange((value: string) => {
                this.phoneNumber = value;
                this.phoneError = this.validatePhone(value);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 手机号错误提示
            if (this.phoneError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.phoneError);
                        Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(196:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#ff4444');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ top: 5 });
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
        // 手机号输入
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码输入
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RegisterPage.ets(207:11)", "entry");
            // 密码输入
            Column.width('100%');
            // 密码输入
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码');
            Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(208:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#555555');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入密码' });
            TextInput.debugLine("entry/src/main/ets/pages/RegisterPage.ets(215:13)", "entry");
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.borderRadius(8);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: this.passwordError ? '#ff4444' : '#dddddd' });
            TextInput.type(InputType.Password);
            TextInput.onChange((value: string) => {
                this.password = value;
                this.passwordError = this.validatePassword(value);
                // 如果确认密码已输入，重新验证确认密码
                if (this.confirmPassword) {
                    this.confirmPasswordError = this.validateConfirmPassword(this.confirmPassword);
                }
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 密码错误提示
            if (this.passwordError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.passwordError);
                        Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(234:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#ff4444');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ top: 5 });
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
        // 密码输入
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 确认密码输入
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RegisterPage.ets(245:11)", "entry");
            // 确认密码输入
            Column.width('100%');
            // 确认密码输入
            Column.margin({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('确认密码');
            Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(246:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#555555');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请再次输入密码' });
            TextInput.debugLine("entry/src/main/ets/pages/RegisterPage.ets(253:13)", "entry");
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.borderRadius(8);
            TextInput.backgroundColor(Color.White);
            TextInput.border({ width: 1, color: this.confirmPasswordError ? '#ff4444' : '#dddddd' });
            TextInput.type(InputType.Password);
            TextInput.onChange((value: string) => {
                this.confirmPassword = value;
                this.confirmPasswordError = this.validateConfirmPassword(value);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 确认密码错误提示
            if (this.confirmPasswordError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.confirmPasswordError);
                        Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(268:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#ff4444');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ top: 5 });
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
        // 确认密码输入
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 错误提示
            if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.debugLine("entry/src/main/ets/pages/RegisterPage.ets(280:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#ff4444');
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ top: 15, bottom: 15 });
                    }, Text);
                    Text.pop();
                });
            }
            // 注册按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 注册按钮
            Button.createWithLabel(this.isLoading ? '注册中...' : '注册');
            Button.debugLine("entry/src/main/ets/pages/RegisterPage.ets(289:11)", "entry");
            // 注册按钮
            Button.width('100%');
            // 注册按钮
            Button.height(48);
            // 注册按钮
            Button.fontSize(16);
            // 注册按钮
            Button.fontColor(Color.White);
            // 注册按钮
            Button.linearGradient({
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
            });
            // 注册按钮
            Button.borderRadius(8);
            // 注册按钮
            Button.margin({ top: 30 });
            // 注册按钮
            Button.enabled(!this.isLoading);
            // 注册按钮
            Button.onClick(() => {
                this.register();
            });
        }, Button);
        // 注册按钮
        Button.pop();
        // 表单区域
        Column.pop();
        // 内容区域
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "RegisterPage";
    }
}
registerNamedRoute(() => new RegisterPage(undefined, {}), "", { bundleName: "com.pizza.lostfound", moduleName: "entry", pagePath: "pages/RegisterPage", pageFullPath: "entry/src/main/ets/pages/RegisterPage", integratedHsp: "false", moduleType: "followWithHap" });
