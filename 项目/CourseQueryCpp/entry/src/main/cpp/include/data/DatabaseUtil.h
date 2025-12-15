//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_DATABASEUTIL_H
#define COURSEQUERYCPP_DATABASEUTIL_H

#endif //COURSEQUERYCPP_DATABASEUTIL_H

#ifndef DATABASE_UTIL_H
#define DATABASE_UTIL_H

#include <vector>
#include <string>
#include <memory>
#include <ohos/data/relational_store/RelationalStore.h>
#include "model/CourseModel.h"

// 命名空间简化（鸿蒙C++ API规范，赛事代码规范要求）
using namespace OHOS::Data::RelationalStore;

class DatabaseUtil {
public:
    // 单例模式（确保数据库连接唯一，避免资源泄漏）
    static std::shared_ptr<DatabaseUtil> GetInstance();

    // 初始化数据库（创建表、获取连接，赛事数据存储基础）
    bool Init();

    // 批量插入课程（支撑数据同步与存储，赛事功能完整性）
    bool BatchInsertCourses(const std::vector<Course>& courses);

    // 按学期查询课程（支撑课程筛选，关联赛事核心功能）
    std::vector<Course> QueryCoursesBySemester(const std::string& semester);

    // 按关键词搜索课程（支撑搜索功能，关联赛事多模块整合）
    std::vector<Course> SearchCourses(const std::string& semester, const std::string& keyword);

    // 清空课程表（扩展功能，体现灵活性）
    bool ClearAllCourses();

private:
    DatabaseUtil() = default;
    ~DatabaseUtil() = default;

    // 禁止拷贝构造与赋值
    DatabaseUtil(const DatabaseUtil&) = delete;
    DatabaseUtil& operator=(const DatabaseUtil&) = delete;

    // 创建课程表（数据库初始化核心，赛事数据结构设计要求）
    bool CreateCourseTable();

    // 数据库连接对象（鸿蒙RelationalStore C++ API，赛事技术栈要求）
    sptr<RelationalStore> rdbStore_;

    // 常量定义（避免硬编码，赛事代码规范要求）
    static constexpr const char* DB_NAME = "course_query_db.db";
    static constexpr const char* TABLE_NAME = "course_info";
    static std::shared_ptr<DatabaseUtil> instance_;
};

#endif // DATABASE_UTIL_H