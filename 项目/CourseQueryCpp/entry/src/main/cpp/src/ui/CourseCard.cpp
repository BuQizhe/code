//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "ui/CourseCard.h"
#include <ohos/hilog/ndk/log.h>
#include <ohos/ui/components/ImageProvider.h>

// 日志标签（便于调试排错，符合赛事代码规范）
static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = {
    LOG_CORE, 0x00010, "CourseCard"
};

// 构造函数（初始化课程数据与根布局）
CourseCard::CourseCard(const Course& course) : course_(course) {
    // 创建根布局（垂直方向，作为卡片容器）
    rootLayout_ = DirectionalLayout::Create();
    if (!rootLayout_) {
        HiLog::Error(LOG_LABEL, "CourseCard Create: rootLayout create failed");
        return;
    }
    // 初始化组件样式
    InitStyle();
}

// 初始化组件样式（符合鸿蒙设计规范，赛事UI规范要求）
void CourseCard::InitStyle() {
    if (!rootLayout_) return;

    // 根布局样式配置
    rootLayout_->SetLayoutDirection(DirectionalLayout::LAYOUT_DIR_VERTICAL);
    rootLayout_->SetPadding(CARD_PADDING, CARD_PADDING, CARD_PADDING, CARD_PADDING);
    rootLayout_->SetSpace(CARD_SPACING);
    rootLayout_->SetBackgroundColor(CARD_BG_COLOR);
    rootLayout_->SetBorderRadius(CARD_RADIUS);
    rootLayout_->SetShadow(SHADOW_RADIUS, SHADOW_OFFSET_Y, 0, SHADOW_COLOR);

    // 设置布局参数（宽占满，高自适应）
    LayoutParam layoutParam = rootLayout_->GetLayoutParam();
    layoutParam.SetWidth(LayoutParam::MATCH_PARENT);
    layoutParam.SetHeight(LayoutParam::WRAP_CONTENT);
    rootLayout_->SetLayoutParam(layoutParam);

    // 绑定点击事件
    rootLayout_->SetOnClickListener([this]() {
        if (clickListener_) {
            clickListener_();
        }
    });

    // 添加子布局（标题行+信息行+额外信息行）
    rootLayout_->AddComponent(BuildTitleRow());
    rootLayout_->AddComponent(buildInfoRow());
    rootLayout_->AddComponent(buildExtraRow());
}

// 构建课程名称+教师行（核心信息展示）
std::shared_ptr<DirectionalLayout> CourseCard::buildTitleRow() {
    auto row = DirectionalLayout::Create();
    if (!row) {
        HiLog::Error(LOG_LABEL, "buildTitleRow: create row failed");
        return nullptr;
    }

    row->SetLayoutDirection(DirectionalLayout::LAYOUT_DIR_HORIZONTAL);
    row->SetSpace(CARD_SPACING);

    // 课程名称文本
    auto courseName = Text::Create();
    if (courseName) {
        courseName->SetText(course_.GetName());
        courseName->SetFontSize(TITLE_FONT_SIZE);
        courseName->SetFontColor(TITLE_COLOR);
        courseName->SetFontWeight(Font::FONT_WEIGHT_MEDIUM);
        // 课程名称占满剩余空间
        LayoutParam nameParam = courseName->GetLayoutParam();
        nameParam.SetWidth(LayoutParam::MATCH_CONTENT);
        nameParam.SetHeight(LayoutParam::WRAP_CONTENT);
        courseName->SetLayoutParam(nameParam);
        row->AddComponent(courseName);
    }

    // 教师名称文本
    auto teacherName = Text::Create();
    if (teacherName) {
        teacherName->SetText(course_.GetTeacher());
        teacherName->SetFontSize(SMALL_FONT_SIZE);
        teacherName->SetFontColor(GRAY_COLOR);
        LayoutParam teacherParam = teacherName->GetLayoutParam();
        teacherParam.SetWidth(LayoutParam::MATCH_CONTENT);
        teacherParam.SetHeight(LayoutParam::WRAP_CONTENT);
        teacherName->SetLayoutParam(teacherParam);
        row->AddComponent(teacherName);
    }

    return row;
}

// 构建上课时间+地点行（关键信息展示）
std::shared_ptr<DirectionalLayout> CourseCard::buildInfoRow() {
    auto row = DirectionalLayout::Create();
    if (!row) {
        HiLog::Error(LOG_LABEL, "buildInfoRow: create row failed");
        return nullptr;
    }

    row->SetLayoutDirection(DirectionalLayout::LAYOUT_DIR_HORIZONTAL);
    row->SetSpace(CARD_SPACING);

    // 时间图标
    auto timeIcon = Image::Create();
    if (timeIcon) {
        // 加载时间图标（resources/media/icon_time.svg）
        timeIcon->SetImageSource("media/icon_time.svg");
        timeIcon->SetWidth(ICON_SIZE);
        timeIcon->SetHeight(ICON_SIZE);
        timeIcon->SetImageFillColor(GRAY_COLOR);
        row->AddComponent(timeIcon);
    }

    // 上课时间文本（取第一个时间段）
    auto classTime = Text::Create();
    if (classTime) {
        const auto& timeList = course_.GetClassTime();
        std::string timeText = timeList.empty() ? "无" : timeList[0];
        classTime->SetText(timeText);
        classTime->SetFontSize(CONTENT_FONT_SIZE);
        classTime->SetFontColor(CONTENT_COLOR);
        LayoutParam timeParam = classTime->GetLayoutParam();
        timeParam.SetWidth(LayoutParam::MATCH_CONTENT);
        timeParam.SetHeight(LayoutParam::WRAP_CONTENT);
        classTime->SetLayoutParam(timeParam);
        row->AddComponent(classTime);
    }

    // 地点图标
    auto locIcon = Image::Create();
    if (locIcon) {
        locIcon->SetImageSource("media/icon_location.svg");
        locIcon->SetWidth(ICON_SIZE);
        locIcon->SetHeight(ICON_SIZE);
        locIcon->SetImageFillColor(GRAY_COLOR);
        row->AddComponent(locIcon);
    }

    // 上课地点文本
    auto location = Text::Create();
    if (location) {
        location->SetText(course_.GetLocation());
        location->SetFontSize(CONTENT_FONT_SIZE);
        location->SetFontColor(CONTENT_COLOR);
        // 地点文本超出部分省略
        location->SetMaxLines(1);
        location->SetTextOverflow(Text::TEXT_OVERFLOW_ELLIPSIS);
        LayoutParam locParam = location->GetLayoutParam();
        locParam.SetWidth(LayoutParam::MATCH_CONTENT);
        locParam.SetHeight(LayoutParam::WRAP_CONTENT);
        location->SetLayoutParam(locParam);
        row->AddComponent(location);
    }

    return row;
}

// 构建学分+课程类型行（补充信息展示）
std::shared_ptr<DirectionalLayout> CourseCard::buildExtraRow() {
    auto row = DirectionalLayout::Create();
    if (!row) {
        HiLog::Error(LOG_LABEL, "buildExtraRow: create row failed");
        return nullptr;
    }

    row->SetLayoutDirection(DirectionalLayout::LAYOUT_DIR_HORIZONTAL);
    row->SetSpace(CARD_SPACING * 2);

    // 学分文本
    auto credit = Text::Create();
    if (credit) {
        std::string creditText = "学分：" + std::to_string(course_.GetCredit());
        credit->SetText(creditText);
        credit->SetFontSize(SMALL_FONT_SIZE);
        credit->SetFontColor(GRAY_COLOR);
        row->AddComponent(credit);
    }

    // 课程类型文本
    auto courseType = Text::Create();
    if (courseType) {
        std::string typeText = CourseTypeToString(course_.GetType());
        courseType->SetText(typeText);
        courseType->SetFontSize(SMALL_FONT_SIZE);
        courseType->SetFontColor(GRAY_COLOR);
        row->AddComponent(courseType);
    }

    return row;
}

// 构建组件（返回完整卡片布局，供页面调用）
std::shared_ptr<DirectionalLayout> CourseCard::Build() {
    return rootLayout_;
}

// 设置点击事件（支撑跳转详情页，赛事交互功能要求）
void CourseCard::SetOnClickListener(std::function<void()> listener) {
    clickListener_ = std::move(listener);
}