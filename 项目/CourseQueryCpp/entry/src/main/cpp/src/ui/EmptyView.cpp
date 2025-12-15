//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "ui/EmptyView.h"
#include <ohos/hilog/ndk/log.h>
#include <ohos/ui/components/ImageProvider.h>

// 日志标签（便于调试排错，符合赛事代码规范）
static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = {
    LOG_CORE, 0x00011, "EmptyView"
};

// 构造函数（初始化提示文本与根布局）
EmptyView::EmptyView(const std::string& message) : message_(message) {
    // 创建根布局（垂直方向，居中展示）
    rootLayout_ = DirectionalLayout::Create();
    if (!rootLayout_) {
        HiLog::Error(LOG_LABEL, "EmptyView Create: rootLayout create failed");
        return;
    }
    // 初始化组件样式
    InitStyle();
}

// 初始化组件样式（符合鸿蒙设计规范）
void EmptyView::InitStyle() {
    if (!rootLayout_) return;

    // 根布局样式配置
    rootLayout_->SetLayoutDirection(DirectionalLayout::LAYOUT_DIR_VERTICAL);
    rootLayout_->SetAlignItems(ItemAlign::ITEM_ALIGN_CENTER);
    rootLayout_->SetSpace(CONTAINER_SPACING);
    rootLayout_->SetMarginTop(CONTAINER_MARGIN_TOP);

    // 布局参数（宽占满，高自适应）
    LayoutParam layoutParam = rootLayout_->GetLayoutParam();
    layoutParam.SetWidth(LayoutParam::MATCH_PARENT);
    layoutParam.SetHeight(LayoutParam::WRAP_CONTENT);
    rootLayout_->SetLayoutParam(layoutParam);

    // 添加空状态图标
    auto emptyIcon = Image::Create();
    if (emptyIcon) {
        emptyIcon->SetImageSource(iconPath_);
        emptyIcon->SetWidth(ICON_SIZE);
        emptyIcon->SetHeight(ICON_SIZE);
        emptyIcon->SetImageFillColor(ICON_COLOR);
        rootLayout_->AddComponent(emptyIcon);
    }

    // 添加提示文本
    auto tipText = Text::Create();
    if (tipText) {
        tipText->SetText(message_);
        tipText->SetFontSize(fontSize_);
        tipText->SetFontColor(textColor_);
        tipText->SetTextAlign(Text::TEXT_ALIGN_CENTER);
        rootLayout_->AddComponent(tipText);
    }
}

// 构建组件（返回完整空状态布局，供页面调用）
std::shared_ptr<DirectionalLayout> EmptyView::Build() {
    return rootLayout_;
}

// 设置图标（支持替换默认图标，赛事扩展性要求）
void EmptyView::SetIcon(const std::string& iconPath) {
    if (iconPath.empty()) {
        HiLog::Warn(LOG_LABEL, "SetIcon: iconPath is empty");
        return;
    }
    iconPath_ = iconPath;
    // 重新初始化样式
    if (rootLayout_) {
        rootLayout_->RemoveAllComponents();
        InitStyle();
    }
}

// 设置文本样式（支持自定义颜色、大小，赛事UI适配要求）
void EmptyView::SetTextStyle(uint32_t color, float fontSize) {
    textColor_ = color;
    fontSize_ = fontSize;
    // 重新初始化样式
    if (rootLayout_) {
        rootLayout_->RemoveAllComponents();
        InitStyle();
    }
}