//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "util/PermissionUtil.h"
#include <ohos/hilog/ndk/log.h>
#include <ohos/utils/errors.h>
#include <ohos/abilityaccessctrl/ability_access_ctrl.h>
#include <ohos/abilityaccessctrl/permission_define.h>

using namespace OHOS::AbilityAccessCtrl;
using namespace OHOS::Security::AccessToken;

static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = {
    LOG_CORE, 0x00009, "PermissionUtil"
};

// 初始化单例实例
std::shared_ptr<PermissionUtil> PermissionUtil::instance_ = nullptr;

// 必需权限列表（赛事核心功能依赖，确保合规访问）
const std::vector<std::string> PermissionUtil::REQUIRED_PERMISSIONS = {
    PERMISSION_INTERNET,
    PERMISSION_WRITE_STORAGE
};

// 单例模式获取实例（统一权限管理，避免重复申请）
std::shared_ptr<PermissionUtil> PermissionUtil::GetInstance() {
    if (instance_ == nullptr) {
        instance_ = std::shared_ptr<PermissionUtil>(new PermissionUtil());
    }
    return instance_;
}

// 初始化（关联应用上下文，赛事资源访问基础）
bool PermissionUtil::Init(const sptr<AbilityContext>& context) {
    if (!context) {
        HiLog::Error(LOG_LABEL, "Init: invalid ability context");
        return false;
    }

    context_ = context;
    HiLog::Info(LOG_LABEL, "PermissionUtil Init success");
    return true;
}

// 申请必需权限（网络+存储，支撑核心功能运行）
void PermissionUtil::RequestRequiredPermissions(PermissionCallback callback) {
    if (!callback || !context_) {
        HiLog::Error(LOG_LABEL, "RequestRequiredPermissions: invalid parameter");
        callback(false, {});
        return;
    }

    // 检查已授权权限
    std::vector<std::string> grantedPerms = CheckPermissions(REQUIRED_PERMISSIONS);
    if (grantedPerms.size() == REQUIRED_PERMISSIONS.size()) {
        HiLog::Info(LOG_LABEL, "All required permissions are granted");
        callback(true, grantedPerms);
        return;
    }

    // 筛选未授权权限
    std::vector<std::string> neededPerms;
    for (const auto& perm : REQUIRED_PERMISSIONS) {
        if (std::find(grantedPerms.begin(), grantedPerms.end(), perm) == grantedPerms.end()) {
            neededPerms.push_back(perm);
        }
    }

    if (neededPerms.empty()) {
        callback(true, grantedPerms);
        return;
    }

    // 申请权限（鸿蒙权限申请API）
    auto atManager = AbilityAccessCtrl::CreateAtManager();
    if (!atManager) {
        HiLog::Error(LOG_LABEL, "RequestRequiredPermissions: create AtManager failed");
        callback(false, grantedPerms);
        return;
    }

    // 异步申请权限
    atManager->RequestPermissionsFromUser(context_, neededPerms, [callback, grantedPerms](const std::vector<PermissionResult>& results) {
        std::vector<std::string> newGrantedPerms = grantedPerms;
        for (const auto& result : results) {
            if (result.grantStatus == GrantStatus::PERMISSION_GRANTED) {
                newGrantedPerms.push_back(result.permissionName);
            }
        }

        bool allGranted = (newGrantedPerms.size() == REQUIRED_PERMISSIONS.size());
        callback(allGranted, newGrantedPerms);
    });
}

// 检查单个权限是否已授权（支撑权限预判断，赛事稳定性要求）
bool PermissionUtil::CheckPermission(const std::string& permission) {
    if (permission.empty() || !context_) {
        HiLog::Error(LOG_LABEL, "CheckPermission: invalid parameter");
        return false;
    }

    auto atManager = AbilityAccessCtrl::CreateAtManager();
    if (!atManager) {
        HiLog::Error(LOG_LABEL, "CheckPermission: create AtManager failed");
        return false;
    }

    auto result = atManager->VerifySelfPermission(permission);
    bool granted = (result == GrantStatus::PERMISSION_GRANTED);
    HiLog::Info(LOG_LABEL, "CheckPermission: %{public}s is %{public}s",
                permission.c_str(), granted ? "granted" : "denied");
    return granted;
}

// 检查多个权限是否已授权（支撑批量权限判断）
std::vector<std::string> PermissionUtil::CheckPermissions(const std::vector<std::string>& permissions) {
    std::vector<std::string> grantedPerms;
    if (permissions.empty() || !context_) {
        HiLog::Error(LOG_LABEL, "CheckPermissions: invalid parameter");
        return grantedPerms;
    }

    auto atManager = AbilityAccessCtrl::CreateAtManager();
    if (!atManager) {
        HiLog::Error(LOG_LABEL, "CheckPermissions: create AtManager failed");
        return grantedPerms;
    }

    for (const auto& perm : permissions) {
        if (atManager->VerifySelfPermission(perm) == GrantStatus::PERMISSION_GRANTED) {
            grantedPerms.push_back(perm);
        }
    }

    HiLog::Info(LOG_LABEL, "CheckPermissions: granted %{public}zu permissions", grantedPerms.size());
    return grantedPerms;
}