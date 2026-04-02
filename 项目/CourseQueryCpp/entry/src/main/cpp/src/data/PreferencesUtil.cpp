//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "data/PreferencesUtil.h"
#include <ohos/hilog/ndk/log.h>
#include <ohos/utils/errors.h>
#include "ability/EntryAbility.h"

static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = {
    LOG_CORE, 0x00006, "PreferencesUtil"
};

std::shared_ptr<PreferencesUtil> PreferencesUtil::instance_ = nullptr;

// 单例模式获取实例
std::shared_ptr<PreferencesUtil> PreferencesUtil::GetInstance() {
    if (instance_ == nullptr) {
        instance_ = std::shared_ptr<PreferencesUtil>(new PreferencesUtil());
    }
    return instance_;
}

// 初始化（关联应用上下文，赛事资源访问要求）
bool PreferencesUtil::Init(const sptr<OHOS::AAFwk::AbilityContext>& context) {
    if (!context) {
        HiLog::Error(LOG_LABEL, "Invalid ability context");
        return false;
    }

    // 打开偏好设置
    auto result = OHOS::Data::Preferences::Preferences::Open(context, PREF_NAME, preferences_);
    if (result != OHOS::Utils::ERR_OK || !preferences_) {
        HiLog::Error(LOG_LABEL, "Open preferences failed, result: %{public}d", result);
        return false;
    }

    // 初始化默认值
    InitDefaultValues();

    HiLog::Info(LOG_LABEL, "PreferencesUtil Init success");
    return true;
}

// 初始化默认值（首次启动时设置）
void PreferencesUtil::InitDefaultValues() {
    // 检查当前学期是否存在
    bool hasSemester = false;
    preferences_->HasKey(KEY_CURRENT_SEMESTER, hasSemester);
    if (!hasSemester) {
        SetCurrentSemester("2024-2025学年第一学期");
        HiLog::Info(LOG_LABEL, "Set default current semester");
    }

    // 检查最后同步时间是否存在
    bool hasSyncTime = false;
    preferences_->HasKey(KEY_LAST_SYNC_TIME, hasSyncTime);
    if (!hasSyncTime) {
        SetLastSyncTime("0");
        HiLog::Info(LOG_LABEL, "Set default last sync time");
    }
}

// 获取当前选中学期（支撑学期切换缓存，赛事核心功能）
std::string PreferencesUtil::GetCurrentSemester(int32_t& errCode) {
    errCode = OHOS::Utils::ERR_OK;
    if (!preferences_) {
        HiLog::Error(LOG_LABEL, "Preferences not initialized");
        errCode = OHOS::Utils::ERR_NO_INIT;
        return "";
    }

    std::string semester;
    auto result = preferences_->GetString(KEY_CURRENT_SEMESTER, semester);
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Get current semester failed, result: %{public}d", result);
        errCode = result;
        return "";
    }
    return semester;
}

// 设置当前选中学期（支撑用户选择记忆，赛事交互体验要求）
bool PreferencesUtil::SetCurrentSemester(const std::string& semester) {
    if (!preferences_ || semester.empty()) {
        HiLog::Error(LOG_LABEL, "Invalid parameter");
        return false;
    }

    auto result = preferences_->PutString(KEY_CURRENT_SEMESTER, semester);
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Set current semester failed, result: %{public}d", result);
        return false;
    }

    // 持久化存储
    result = preferences_->Flush();
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Flush preferences failed, result: %{public}d", result);
        return false;
    }

    HiLog::Info(LOG_LABEL, "Set current semester: %{public}s", semester.c_str());
    return true;
}

// 获取最后数据同步时间（支撑增量同步，赛事创新功能）
std::string PreferencesUtil::GetLastSyncTime(int32_t& errCode) {
    errCode = OHOS::Utils::ERR_OK;
    if (!preferences_) {
        HiLog::Error(LOG_LABEL, "Preferences not initialized");
        errCode = OHOS::Utils::ERR_NO_INIT;
        return "";
    }

    std::string syncTime;
    auto result = preferences_->GetString(KEY_LAST_SYNC_TIME, syncTime);
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Get last sync time failed, result: %{public}d", result);
        errCode = result;
        return "";
    }
    return syncTime;
}

// 设置数据同步时间（支撑同步状态管理，赛事功能完整性要求）
bool PreferencesUtil::SetLastSyncTime(const std::string& time) {
    if (!preferences_ || time.empty()) {
        HiLog::Error(LOG_LABEL, "Invalid parameter");
        return false;
    }

    auto result = preferences_->PutString(KEY_LAST_SYNC_TIME, time);
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Set last sync time failed, result: %{public}d", result);
        return false;
    }

    result = preferences_->Flush();
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Flush preferences failed, result: %{public}d", result);
        return false;
    }

    HiLog::Info(LOG_LABEL, "Set last sync time: %{public}s", time.c_str());
    return true;
}

// 存储用户信息（支撑多用户数据隔离，赛事扩展功能）
bool PreferencesUtil::SaveUserInfo(const std::string& userJson) {
    if (!preferences_ || userJson.empty()) {
        HiLog::Error(LOG_LABEL, "Invalid parameter");
        return false;
    }

    auto result = preferences_->PutString(KEY_USER_INFO, userJson);
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Save user info failed, result: %{public}d", result);
        return false;
    }

    result = preferences_->Flush();
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Flush preferences failed, result: %{public}d", result);
        return false;
    }

    HiLog::Info(LOG_LABEL, "Save user info success");
    return true;
}

// 获取用户信息（支撑个人中心，赛事场景适配要求）
std::string PreferencesUtil::GetUserInfo(int32_t& errCode) {
    errCode = OHOS::Utils::ERR_OK;
    if (!preferences_) {
        HiLog::Error(LOG_LABEL, "Preferences not initialized");
        errCode = OHOS::Utils::ERR_NO_INIT;
        return "";
    }

    std::string userJson;
    auto result = preferences_->GetString(KEY_USER_INFO, userJson);
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Get user info failed, result: %{public}d", result);
        errCode = result;
        return "";
    }
    return userJson;
}