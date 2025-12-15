//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_EMPTYVIEW_H
#define COURSEQUERYCPP_EMPTYVIEW_H

#endif //COURSEQUERYCPP_EMPTYVIEW_H

#ifndef EMPTY_VIEW_H
#define EMPTY_VIEW_H

#include <ohos/ui/components/Component.h>
#include <ohos/ui/components/Text.h>
#include <ohos/ui/components/Image.h>
#include <ohos/ui/components/DirectionalLayout.h>
#include <memory>
#include <string>

using namespace OHOS::UI;

// 空状态组件（封装无数据/无结果展示UI，支撑多页面空状态统一处理，赛事UI完整性要求）
class EmptyView {
public:
    // 构造函数（接收提示文本，支持自定义，赛事灵活性要求）
    explicit EmptyView(const std::string& message);
    ~EmptyView() = default;

    // 禁止拷贝构造与赋值
    EmptyView(const EmptyView&) = delete;
    EmptyView& operator=(const EmptyView&) = delete;

    // 构建组件（返回完整空状态布局，供页面调用）
    std::shared_ptr<DirectionalLayout> Build();

    // 设置图标（支持替换默认图标，赛事扩展性要求）
    void SetIcon(const std::string& iconPath);

    // 设置文本样式（支持自定义颜色、大小，赛事UI适配要求）
    void SetTextStyle(uint32_t color, float fontSize);

private:
    // 初始化组件样式（符合鸿蒙设计规范）
    void InitStyle();

    // 提示文本（空状态核心信息）
    std::string message_;

    // 图标路径（默认空状态图标）
    std::string iconPath_ = "media/icon_empty.svg";

    // 文本颜色（默认中灰）
    uint32_t textColor_ = 0xFF666666;

    // 文本大小（默认16fp）
    float fontSize_ = 16.0f;

    // 根布局（空状态容器）
    std::shared_ptr<DirectionalLayout> rootLayout_;

    // UI样式常量（统一设计规范）
    static constexpr float CONTAINER_SPACING = 16.0f;  // 图标与文本间距
    static constexpr float ICON_SIZE = 80.0f;          // 空状态图标大小
    static constexpr float CONTAINER_MARGIN_TOP = 100.0f; // 顶部边距（居中展示）
    static constexpr uint32_t ICON_COLOR = 0xFF666666;  // 图标颜色（中灰）
};

#endif // EMPTY_VIEW_H