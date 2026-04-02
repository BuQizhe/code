//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_ENTRYABILITY_H
#define COURSEQUERYCPP_ENTRYABILITY_H

#endif //COURSEQUERYCPP_ENTRYABILITY_H

#ifndef ENTRY_ABILITY_H
#define ENTRY_ABILITY_H

#include <ohos/aafwk/ability/Ability.h>
#include <ohos/aafwk/content/Intent.h>
#include <ohos/ui/window/WindowStage.h>
#include <memory>
#include "data/PreferencesUtil.h"  // 关联偏好设置工具（赛事核心模块）

// 命名空间简化（鸿蒙C++ API标准用法）
using namespace OHOS::AAFwk;
using namespace OHOS::UI::Window;
using namespace OHOS::AppExecFwk;

class EntryAbility : public Ability {
public:
    EntryAbility() = default;
    ~EntryAbility() = default;

    // 鸿蒙Stage模型核心生命周期方法（赛事必须实现）
    void OnCreate(const Want& want, const AbilityInfo& abilityInfo) override;
    void OnWindowStageCreate(const sptr<WindowStage>& windowStage) override;
    void OnDestroy() override;

    // 全局上下文获取接口（供数据库、网络等模块调用）
    static sptr<AbilityContext> GetGlobalContext();

private:
    static sptr<AbilityContext> globalContext_;  // 全局上下文（关键资源）
    std::shared_ptr<PreferencesUtil> preferencesUtil_;  // 偏好设置工具（赛事核心模块）
};

#endif // ENTRY_ABILITY_H