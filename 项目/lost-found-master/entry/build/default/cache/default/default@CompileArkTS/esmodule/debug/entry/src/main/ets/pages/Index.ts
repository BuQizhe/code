if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    username?: string;
    password?: string;
    isLoading?: boolean;
    errorMessage?: string;
    usernameError?: string;
    passwordError?: string;
}
import router from "@ohos:router";
import { HeaderBar } from "@normalized:N&&&entry/src/main/ets/components/CommonComponents&";
import { HttpUtils } from "@normalized:N&&&entry/src/main/ets/utils/HttpUtils&";
import type { ApiResponse } from '../po/CommonTypes';
// 登录响应数据接口
interface LoginData {
    userId: string;
    username: string;
    phone: string;
    avatar: string;
    registerTime: string;
}
interface LoginRequest extends Record<string, string | number | object> {
    username: string;
    password: string;
}
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__usernameError = new ObservedPropertySimplePU('', this, "usernameError");
        this.__passwordError = new ObservedPropertySimplePU('', this, "passwordError");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.usernameError !== undefined) {
            this.usernameError = params.usernameError;
        }
        if (params.passwordError !== undefined) {
            this.passwordError = params.passwordError;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__usernameError.purgeDependencyOnElmtId(rmElmtId);
        this.__passwordError.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__usernameError.aboutToBeDeleted();
        this.__passwordError.aboutToBeDeleted();
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
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
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
    private __usernameError: ObservedPropertySimplePU<string>;
    get usernameError() {
        return this.__usernameError.get();
    }
    set usernameError(newValue: string) {
        this.__usernameError.set(newValue);
    }
    private __passwordError: ObservedPropertySimplePU<string>;
    get passwordError() {
        return this.__passwordError.get();
    }
    set passwordError(newValue: string) {
        this.__passwordError.set(newValue);
    }
    // 验证用户名
    validateUsername(value: string): string {
        if (!value.trim()) {
            return '请输入用户名';
        }
        if (value.trim().length < 3) {
            return '用户名长度不能少于3位';
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
        return '';
    }
    // 登录方法
    async login() {
        // 验证输入
        this.usernameError = this.validateUsername(this.username);
        this.passwordError = this.validatePassword(this.password);
        if (this.usernameError || this.passwordError) {
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        try {
            const url = 'http://rap2api.taobao.org/app/mock/323891/api/user/login';
            const loginData: LoginRequest = {
                username: this.username,
                password: this.password
            };
            const response = await HttpUtils.post(url, loginData);
            const result = JSON.parse(response) as ApiResponse<LoginData>;
            if (result.code === 200 && result.data) {
                console.log('登录成功:', result.data);
                // 可以在这里保存用户信息到本地存储
                // 跳转到主页
                router.pushUrl({ url: 'pages/MainPage' }).catch(() => {
                    // TODO: Implement error handling.
                });
            }
            else {
                this.errorMessage = result.message || '登录失败';
            }
        }
        catch (error) {
            console.error('登录请求失败:', error);
            this.errorMessage = '网络请求失败，请检查网络连接';
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
                        title: '登录',
                        showBack: false,
                        showAction: false
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 97, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            title: '登录',
                            showBack: false,
                            showAction: false
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        title: '登录',
                        showBack: false,
                        showAction: false
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
            Column.padding(20);
            // 内容区域
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 欢迎区域
            Column.create();
            // 欢迎区域
            Column.margin({ top: 40, bottom: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📱');
            Text.fontSize(64);
            Text.fontColor('#667eea');
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('欢迎使用');
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('连接社区，寻找失物');
            Text.fontSize(16);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        // 欢迎区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 表单区域
            Column.create();
            // 表单区域
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名输入
            Column.create();
            // 用户名输入
            Column.width('100%');
            // 用户名输入
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户名');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#555555');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入用户名' });
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
            // 密码输入
            Column.create();
            // 密码输入
            Column.width('100%');
            // 密码输入
            Column.margin({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#555555');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入密码' });
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
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 密码错误提示
            if (this.passwordError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.passwordError);
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
            If.create();
            // 错误提示
            if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.fontSize(14);
                        Text.fontColor('#ff4444');
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ bottom: 15 });
                    }, Text);
                    Text.pop();
                });
            }
            // 登录按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录按钮
            Button.createWithLabel(this.isLoading ? '登录中...' : '登录');
            // 登录按钮
            Button.width('100%');
            // 登录按钮
            Button.height(48);
            // 登录按钮
            Button.fontSize(16);
            // 登录按钮
            Button.fontColor(Color.White);
            // 登录按钮
            Button.linearGradient({
                angle: 135,
                colors: [['#667eea', 0], ['#764ba2', 1]]
            });
            // 登录按钮
            Button.borderRadius(8);
            // 登录按钮
            Button.margin({ bottom: 10 });
            // 登录按钮
            Button.enabled(!this.isLoading);
            // 登录按钮
            Button.onClick(() => {
                this.login();
            });
        }, Button);
        // 登录按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 注册按钮
            Button.createWithLabel('注册账号');
            // 注册按钮
            Button.width('100%');
            // 注册按钮
            Button.height(48);
            // 注册按钮
            Button.fontSize(16);
            // 注册按钮
            Button.fontColor('#6c757d');
            // 注册按钮
            Button.backgroundColor('#f8f9fa');
            // 注册按钮
            Button.borderRadius(8);
            // 注册按钮
            Button.border({ width: 1, color: '#dee2e6' });
            // 注册按钮
            Button.onClick(() => {
                // 跳转注册页面
                router.pushUrl({ url: 'pages/RegisterPage' }).catch(() => {
                    // TODO: Implement error handling.
                });
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
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.pizza.lostfound", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
