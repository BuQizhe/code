//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_COURSECARD_H
#define COURSEQUERYCPP_COURSECARD_H

#endif //COURSEQUERYCPP_COURSECARD_H


#ifndef COURSE_CARD_H
#define COURSE_CARD_H

#include <ohos/ui/components/Component.h>
#include <ohos/ui/components/Text.h>
#include <ohos/ui/components/Image.h>
#include <ohos/ui/components/DirectionalLayout.h>
#include <ohos/ui/components/LayoutParam.h>
#include <memory>
#include "model/CourseModel.h"

using namespace OHOS::UI;

// 课程卡片组件（封装课程展示UI，支撑首页、列表页核心展示，赛事组件化设计要求）
class CourseCard {
public:
    // 构造函数（接收课程数据，初始化组件）
    explicit CourseCard(const Course& course);
    ~CourseCard() = default;

    // 禁止拷贝构造与赋值（组件资源唯一）
    CourseCard(const CourseCard&) = delete;
    CourseCard& operator=(const CourseCard&) = delete;

    // 构建组件（返回完整卡片布局，供页面调用，赛事UI整合要求）
    std::shared_ptr<DirectionalLayout> Build();

    // 设置点击事件（支撑跳转详情页，赛事交互功能要求）
    void SetOnClickListener(std::function<void()> listener);

private:
    // 初始化组件样式（符合鸿蒙设计规范，赛事UI规范要求）
    void InitStyle();

    // 构建课程名称+教师行（核心信息展示）
    std::shared_ptr<DirectionalLayout> BuildTitleRow();

    // 构建上课时间+地点行（关键信息展示）
    std::shared_ptr<DirectionalLayout> BuildInfoRow();

    // 构建学分+课程类型行（补充信息展示）
    std::shared_ptr<DirectionalLayout> BuildExtraRow();

    // 课程数据（组件展示数据源）
    Course course_;

    // 根布局（卡片容器，控制整体样式）
    std::shared_ptr<DirectionalLayout> rootLayout_;

    // 点击事件回调（支撑交互功能）
    std::function<void()> clickListener_;

    // UI样式常量（统一设计规范，赛事UI一致性要求）
    static constexpr float CARD_PADDING = 16.0f;       // 卡片内边距
    static constexpr float CARD_SPACING = 8.0f;        // 内部组件间距
    static constexpr float CARD_RADIUS = 12.0f;        // 圆角半径
    static constexpr float SHADOW_RADIUS = 4.0f;       // 阴影半径
    static constexpr float SHADOW_OFFSET_Y = 2.0f;     // 阴影Y偏移
    static constexpr uint32_t SHADOW_COLOR = 0x14000000; // 阴影颜色（透明黑）
    static constexpr uint32_t CARD_BG_COLOR = 0xFFFFFFFF; // 卡片背景色（白色）
    static constexpr float TITLE_FONT_SIZE = 18.0f;    // 课程名称字体大小
    static constexpr float CONTENT_FONT_SIZE = 16.0f;  // 内容字体大小
    static constexpr float SMALL_FONT_SIZE = 14.0f;    // 小字体大小
    static constexpr uint32_t TITLE_COLOR = 0xFF2F54EB; // 标题色（主题蓝）
    static constexpr uint32_t CONTENT_COLOR = 0xFF333333; // 内容色（深灰）
    static constexpr uint32_t GRAY_COLOR = 0xFF666666;  // 辅助色（中灰）
    static constexpr float ICON_SIZE = 16.0f;          // 图标大小
};

#endif // COURSE_CARD_H