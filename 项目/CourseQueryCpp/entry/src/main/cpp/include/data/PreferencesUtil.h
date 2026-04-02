//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_PREFERENCESUTIL_H
#define COURSEQUERYCPP_PREFERENCESUTIL_H

#endif //COURSEQUERYCPP_PREFERENCESUTIL_H

#ifndef PREFERENCES_UTIL_H
#define PREFERENCES_UTIL_H

#include <string>
#include <memory>
#include <ohos/data/preferences/Preferences.h>
#include <ohos/aafwk/ability/AbilityContext.h>
#include "model/CourseModel.h"

using namespace OHOS::Data::Preferences;
using namespace OHOS::AAFwk;

class PreferencesUtil {
public:
    // 单例模式（全局唯一，支撑偏好设置统一管理）
    static std::shared_ptr<PreferencesUtil> GetInstance();

    // 初始化（关联应用上下文，赛事资源访问要求）
    bool Init(const sptr<AbilityContext>& context);

    // 核心功能1：获取当前选中学期（支撑学期切换缓存，赛事核心功能）
    std::string GetCurrentSemester(int32_t& errCode);

    // 核心功能2：设置当前选中学期（支撑用户选择记忆，赛事交互体验要求）
    bool SetCurrentSemester(const std::string& semester);

    // 核心功能3：获取最后数据同步时间（支撑增量同步，赛事创新功能）
    std::string GetLastSyncTime(int32_t& errCode);

    // 核心功能4：设置数据同步时间（支撑同步状态管理，赛事功能完整性）
    bool SetLastSyncTime(const std::string& time);

    // 核心功能5：存储用户信息（支撑多用户数据隔离，赛事扩展功能）
    bool SaveUserInfo(const std::string& userJson);

    // 核心功能6：获取用户信息（支撑个人中心，赛事场景适配要求）
    std::string GetUserInfo(int32_t& errCode);

private:
    PreferencesUtil() = default;
    ~PreferencesUtil() = default;

    // 禁止拷贝构造与赋值
    PreferencesUtil(const PreferencesUtil&) = delete;
    PreferencesUtil& operator=(const PreferencesUtil&) = delete;

    // 偏好设置核心对象（鸿蒙Preferences C++ API，赛事技术栈要求）
    std::shared_ptr<Preferences> preferences_;

    // 常量定义（规范存储键值，赛事代码规范要求）
    static constexpr const char* PREF_NAME = "course_query_prefs";
    static constexpr const char* KEY_CURRENT_SEMESTER = "current_semester";
    static constexpr const char* KEY_LAST_SYNC_TIME = "last_sync_time";
    static constexpr const char* KEY_USER_INFO = "user_info";
    static std::shared_ptr<PreferencesUtil> instance_;
};

#endif // PREFERENCES_UTIL_H