//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_COURSEDATASOURCE_H
#define COURSEQUERYCPP_COURSEDATASOURCE_H

#endif //COURSEQUERYCPP_COURSEDATASOURCE_H

#ifndef COURSE_DATA_SOURCE_H
#define COURSE_DATA_SOURCE_H

#include <vector>
#include <string>
#include <memory>
#include <functional>
#include "model/CourseModel.h"
#include "DatabaseUtil.h"
#include "PreferencesUtil.h"
#include "util/HttpUtil.h"
#include "util/DateUtil.h"

// 数据回调函数（支撑异步数据获取，避免UI阻塞，赛事稳定性要求）
using CourseDataCallback = std::function<void(bool success, const std::vector<Course>& courses)>;

// 数据源整合类（统一管理本地数据库、网络同步、偏好设置，赛事模块化设计要求）
class CourseDataSource {
public:
    // 单例模式（确保全局唯一实例，避免资源重复创建，赛事代码规范要求）
    static std::shared_ptr<CourseDataSource> GetInstance();

    // 初始化（关联数据库、偏好设置、网络工具，赛事模块依赖管理）
    bool Init();

    // 核心功能1：获取今日课程（支撑首页展示，关联赛事核心功能）
    void GetTodayCourses(CourseDataCallback callback);

    // 核心功能2：获取全学期课程（支撑课程列表页，关联赛事功能完整性）
    void GetAllCourses(const std::string& semester, CourseDataCallback callback);

    // 核心功能3：搜索课程（支撑搜索功能，关联赛事3个以上知识模块要求）
    void SearchCourses(const std::string& keyword, CourseDataCallback callback);

    // 核心功能4：同步远程课程（支撑网络模块，关联赛事创新与实际需求结合）
    void SyncRemoteCourses(CourseDataCallback callback);

private:
    CourseDataSource() = default;
    ~CourseDataSource() = default;

    // 禁止拷贝构造与赋值（单例模式规范）
    CourseDataSource(const CourseDataSource&) = delete;
    CourseDataSource& operator=(const CourseDataSource&) = delete;

    // 从本地数据库获取课程
    std::vector<Course> GetCoursesFromDB(const std::string& semester);

    // 检查是否需要同步远程数据（根据最后同步时间判断）
    bool NeedSyncRemoteData();

    // 单例实例
    static std::shared_ptr<CourseDataSource> instance_;

    // 依赖模块（数据层核心依赖，赛事模块协同要求）
    std::shared_ptr<DatabaseUtil> dbUtil_;
    std::shared_ptr<PreferencesUtil> prefUtil_;
    std::shared_ptr<HttpUtil> httpUtil_;
};

#endif // COURSE_DATA_SOURCE_H