//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_PERMISSIONUTIL_H
#define COURSEQUERYCPP_PERMISSIONUTIL_H

#endif //COURSEQUERYCPP_PERMISSIONUTIL_H

#ifndef PERMISSION_UTIL_H
#define PERMISSION_UTIL_H

#include <string>
#include <vector>
#include <memory>
#include <ohos/aafwk/ability/AbilityContext.h>

using namespace OHOS::AAFwk;

// 权限申请回调（异步处理权限结果，赛事交互规范要求）
using PermissionCallback = std::function<void(bool allGranted, const std::vector<std::string>& grantedPerms)>;

// 权限工具类（封装鸿蒙权限C++ API，支撑合规访问系统资源，赛事权限模块要求）
class PermissionUtil {
public:
    // 单例模式（统一权限管理，避免重复申请）
    static std::shared_ptr<PermissionUtil> GetInstance();

    // 初始化（关联应用上下文，赛事资源访问基础）
    bool Init(const sptr<AbilityContext>& context);

    // 核心功能：申请必需权限（网络+存储，支撑核心功能运行）
    void RequestRequiredPermissions(PermissionCallback callback);

    // 检查单个权限是否已授权（支撑权限预判断，赛事稳定性要求）
    bool CheckPermission(const std::string& permission);

    // 检查多个权限是否已授权（支撑批量权限判断）
    std::vector<std::string> CheckPermissions(const std::vector<std::string>& permissions);

private:
    PermissionUtil() = default;
    ~PermissionUtil() = default;

    // 禁止拷贝构造与赋值
    PermissionUtil(const PermissionUtil&) = delete;
    PermissionUtil& operator=(const PermissionUtil&) = delete;

    // 单例实例
    static std::shared_ptr<PermissionUtil> instance_;

    // 应用上下文（权限申请必需，赛事资源依赖）
    sptr<AbilityContext> context_;

    // 必需权限列表（赛事核心功能依赖，确保合规访问）
    static const std::vector<std::string> REQUIRED_PERMISSIONS;
};

// 权限常量定义（统一权限标识，赛事代码规范要求）
static constexpr const char* PERMISSION_INTERNET = "ohos.permission.INTERNET";
static constexpr const char* PERMISSION_WRITE_STORAGE = "ohos.permission.WRITE_USER_STORAGE";

#endif // PERMISSION_UTIL_H