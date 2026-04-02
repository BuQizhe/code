//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "model/UserModel.h"
#include <stdexcept>
#include <ohos/utils/errors.h>
#include <ohos/hilog/ndk/log.h>
#include <ctime>

// 日志标签（便于调试排错，符合赛事代码规范）
static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = {
    LOG_CORE, 0x00003, "UserModel"
};

// 带参构造函数（快速创建用户对象，支撑个人中心功能）
User::User(const std::string& userId, const std::string& userName, const std::string& studentId,
           const std::string& currentSemester, const std::string& lastLoginTime)
    : userId_(userId), userName_(userName), studentId_(studentId),
      currentSemester_(currentSemester), lastLoginTime_(lastLoginTime) {}

// 序列化（支撑用户信息存储与传递，赛事数据交互要求）
std::string User::Serialize() const {
    try {
        json j;
        j["userId"] = userId_;
        j["userName"] = userName_;
        j["studentId"] = studentId_;
        j["currentSemester"] = currentSemester_;
        j["lastLoginTime"] = lastLoginTime_;
        return j.dump();
    } catch (const std::exception& e) {
        HiLog::Error(LOG_LABEL, "User Serialize failed: %{public}s", e.what());
        return "";
    }
}

// 反序列化（支撑用户信息读取，赛事功能完整性要求）
User User::Deserialize(const std::string& jsonStr, int32_t& errCode) {
    errCode = ERR_OK;
    try {
        if (jsonStr.empty()) {
            HiLog::Error(LOG_LABEL, "Deserialize failed: json string is empty");
            errCode = ERR_INVALID_VALUE;
            return User();
        }

        json j = json::parse(jsonStr);
        User user;
        user.userId_ = j.value("userId", "");
        user.userName_ = j.value("userName", "");
        user.studentId_ = j.value("studentId", "");
        user.currentSemester_ = j.value("currentSemester", "");
        user.lastLoginTime_ = j.value("lastLoginTime", "");

        // 数据校验
        if (!user.Validate()) {
            HiLog::Error(LOG_LABEL, "Deserialize: user data is invalid");
            errCode = ERR_INVALID_VALUE;
        }

        return user;
    } catch (const std::exception& e) {
        HiLog::Error(LOG_LABEL, "Deserialize failed: %{public}s", e.what());
        errCode = ERR_UNKNOWN;
        return User();
    }
}

// 数据校验（确保用户信息完整，支撑功能稳定）
bool User::Validate() const {
    if (userId_.empty() || userName_.empty() || studentId_.empty()) {
        HiLog::Warn(LOG_LABEL, "User Validate failed: userId/userName/studentId is empty");
        return false;
    }
    if (currentSemester_.empty()) {
        HiLog::Warn(LOG_LABEL, "User Validate failed: currentSemester is empty");
        return false;
    }
    return true;
}

// 默认用户数据（支撑开发测试，赛事开发效率要求）
User GetDefaultUser() {
    // 生成默认用户ID（时间戳+随机数，确保唯一性）
    std::string userId = "user_" + std::to_string(std::time(nullptr));
    // 默认当前学期
    std::string currentSemester = "2024-2025学年第一学期";
    // 当前时间（格式：YYYY-MM-DD HH:MM:SS）
    std::time_t now = std::time(nullptr);
    char timeBuf[64];
    std::strftime(timeBuf, sizeof(timeBuf), "%Y-%m-%d %H:%M:%S", std::localtime(&now));
    std::string lastLoginTime = timeBuf;

    User defaultUser(
        userId,
        "张三",
        "2024001001",
        currentSemester,
        lastLoginTime
    );

    HiLog::Info(LOG_LABEL, "GetDefaultUser: generated default user, studentId: %{public}s",
                defaultUser.GetStudentId().c_str());
    return defaultUser;
}