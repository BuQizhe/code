//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_USERMODEL_H
#define COURSEQUERYCPP_USERMODEL_H

#endif //COURSEQUERYCPP_USERMODEL_H

#ifndef USER_MODEL_H
#define USER_MODEL_H

#include <string>
#include <nlohmann/json.hpp>
#include <ohos/utils/errors.h>

using json = nlohmann::json;

// 用户实体类（封装用户核心信息，支撑多用户数据隔离，赛事创新要求）
class User {
public:
    // 构造函数
    User() = default;
    User(const std::string& userId, const std::string& userName, const std::string& studentId,
         const std::string& currentSemester, const std::string& lastLoginTime);

    // 序列化（支撑用户信息存储与传递）
    std::string Serialize() const;
    // 反序列化（支撑用户信息读取）
    static User Deserialize(const std::string& jsonStr, int32_t& errCode);
    // 数据校验（确保用户信息完整）
    bool Validate() const;

    // Getter/Setter方法（封装数据，符合面向对象设计）
    std::string GetUserId() const { return userId_; }
    void SetUserId(const std::string& userId) { userId_ = userId; }

    std::string GetUserName() const { return userName_; }
    void SetUserName(const std::string& userName) { userName_ = userName; }

    std::string GetStudentId() const { return studentId_; }
    void SetStudentId(const std::string& studentId) { studentId_ = studentId; }

    std::string GetCurrentSemester() const { return currentSemester_; }
    void SetCurrentSemester(const std::string& currentSemester) { currentSemester_ = currentSemester; }

    std::string GetLastLoginTime() const { return lastLoginTime_; }
    void SetLastLoginTime(const std::string& lastLoginTime) { lastLoginTime_ = lastLoginTime; }

private:
    std::string userId_;          // 用户唯一标识（支撑数据隔离，如我的课程）
    std::string userName_;        // 用户名（个人中心展示）
    std::string studentId_;       // 学号（校园场景核心字段，体现场景适配）
    std::string currentSemester_; // 当前选中学期（关联课程筛选，支撑核心功能）
    std::string lastLoginTime_;   // 最后登录时间（扩展字段，体现功能完整性）
};

// 默认用户数据（开发测试用，支撑个人中心功能调试）
User GetDefaultUser();

#endif // USER_MODEL_H