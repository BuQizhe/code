//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "data/CourseDataSource.h"
#include <ohos/hilog/ndk/log.h>
#include <ohos/utils/errors.h>
#include <thread>

// 日志标签（便于调试排错，符合赛事代码规范）
static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = {
    LOG_CORE, 0x00004, "CourseDataSource"
};

// 初始化单例实例
std::shared_ptr<CourseDataSource> CourseDataSource::instance_ = nullptr;

// 单例模式获取实例（赛事模块化设计要求）
std::shared_ptr<CourseDataSource> CourseDataSource::GetInstance() {
    if (instance_ == nullptr) {
        instance_ = std::shared_ptr<CourseDataSource>(new CourseDataSource());
    }
    return instance_;
}

// 初始化依赖模块（赛事模块协同要求）
bool CourseDataSource::Init() {
    HiLog::Info(LOG_LABEL, "CourseDataSource Init start");

    // 初始化数据库工具
    dbUtil_ = DatabaseUtil::GetInstance();
    if (!dbUtil_->Init()) {
        HiLog::Error(LOG_LABEL, "DatabaseUtil init failed");
        return false;
    }

    // 初始化偏好设置工具
    prefUtil_ = PreferencesUtil::GetInstance();
    if (!prefUtil_) {
        HiLog::Error(LOG_LABEL, "PreferencesUtil get instance failed");
        return false;
    }

    // 初始化网络工具
    httpUtil_ = HttpUtil::GetInstance();
    if (!httpUtil_->Init()) {
        HiLog::Error(LOG_LABEL, "HttpUtil init failed");
        return false;
    }

    HiLog::Info(LOG_LABEL, "CourseDataSource Init success");
    return true;
}

// 获取今日课程（支撑首页核心功能，赛事功能完整性要求）
void CourseDataSource::GetTodayCourses(CourseDataCallback callback) {
    if (!callback) {
        HiLog::Error(LOG_LABEL, "Invalid callback");
        return;
    }

    // 异步处理，避免阻塞UI（赛事稳定性要求）
    std::thread([this, callback]() {
        try {
            // 获取当前缓存学期
            int32_t errCode = 0;
            std::string currentSem = prefUtil_->GetCurrentSemester(errCode);
            if (errCode != ERR_OK || currentSem.empty()) {
                HiLog::Warn(LOG_LABEL, "Get current semester failed, use default");
                currentSem = "2024-2025学年第一学期";
            }

            // 先从本地数据库获取课程
            std::vector<Course> allCourses = GetCoursesFromDB(currentSem);
            if (allCourses.empty()) {
                HiLog::Info(LOG_LABEL, "No local courses, sync from remote");
                // 本地无数据，同步远程数据
                SyncRemoteCourses([this, currentSem, callback](bool success, const std::vector<Course>& courses) {
                    if (success) {
                        // 筛选今日课程
                        std::vector<Course> todayCourses = FilterTodayCourses(courses);
                        callback(true, todayCourses);
                    } else {
                        callback(false, {});
                    }
                });
                return;
            }

            // 筛选今日课程
            std::vector<Course> todayCourses = FilterTodayCourses(allCourses);
            callback(true, todayCourses);
        } catch (const std::exception& e) {
            HiLog::Error(LOG_LABEL, "GetTodayCourses failed: %{public}s", e.what());
            callback(false, {});
        }
    }).detach();
}

// 获取全学期课程（支撑课程列表页，赛事功能完整性要求）
void CourseDataSource::GetAllCourses(const std::string& semester, CourseDataCallback callback) {
    if (!callback || semester.empty()) {
        HiLog::Error(LOG_LABEL, "Invalid parameter");
        callback(false, {});
        return;
    }

    std::thread([this, semester, callback]() {
        try {
            // 先查本地数据库
            std::vector<Course> localCourses = GetCoursesFromDB(semester);
            if (!localCourses.empty()) {
                callback(true, localCourses);
                return;
            }

            // 本地无数据，同步远程
            SyncRemoteCourses([this, semester, callback](bool success, const std::vector<Course>& courses) {
                if (success) {
                    // 筛选当前学期课程
                    std::vector<Course> targetCourses;
                    for (const auto& course : courses) {
                        if (course.GetSemester() == semester) {
                            targetCourses.push_back(course);
                        }
                    }
                    callback(true, targetCourses);
                } else {
                    callback(false, {});
                }
            });
        } catch (const std::exception& e) {
            HiLog::Error(LOG_LABEL, "GetAllCourses failed: %{public}s", e.what());
            callback(false, {});
        }
    }).detach();
}

// 搜索课程（支撑搜索功能，赛事3个以上知识模块整合要求）
void CourseDataSource::SearchCourses(const std::string& keyword, CourseDataCallback callback) {
    if (!callback || keyword.empty()) {
        HiLog::Error(LOG_LABEL, "Invalid parameter");
        callback(false, {});
        return;
    }

    std::thread([this, keyword, callback]() {
        try {
            int32_t errCode = 0;
            std::string currentSem = prefUtil_->GetCurrentSemester(errCode);
            if (errCode != ERR_OK || currentSem.empty()) {
                HiLog::Warn(LOG_LABEL, "Get current semester failed");
                callback(false, {});
                return;
            }

            // 从数据库搜索
            std::vector<Course> result = dbUtil_->SearchCourses(currentSem, keyword);
            callback(true, result);
        } catch (const std::exception& e) {
            HiLog::Error(LOG_LABEL, "SearchCourses failed: %{public}s", e.what());
            callback(false, {});
        }
    }).detach();
}

// 同步远程课程（支撑网络模块，赛事创新功能要求）
void CourseDataSource::SyncRemoteCourses(CourseDataCallback callback) {
    if (!callback) {
        HiLog::Error(LOG_LABEL, "Invalid callback");
        return;
    }

    // 检查是否需要同步
    if (!NeedSyncRemoteData()) {
        HiLog::Info(LOG_LABEL, "No need to sync remote data");
        int32_t errCode = 0;
        std::string currentSem = prefUtil_->GetCurrentSemester(errCode);
        if (errCode == ERR_OK) {
            callback(true, GetCoursesFromDB(currentSem));
        } else {
            callback(false, {});
        }
        return;
    }

    // 从远程同步
    int32_t errCode = 0;
    std::string currentSem = prefUtil_->GetCurrentSemester(errCode);
    if (errCode != ERR_OK) {
        currentSem = "2024-2025学年第一学期";
    }

    httpUtil_->SyncCourses(currentSem, [this, callback](bool success, const std::vector<Course>& courses) {
        if (success && !courses.empty()) {
            // 批量插入数据库
            if (dbUtil_->BatchInsertCourses(courses)) {
                // 更新同步时间
                prefUtil_->SetLastSyncTime(DateUtil::GetCurrentTimestamp());
                HiLog::Info(LOG_LABEL, "Sync remote courses success, count: %{public}zu", courses.size());
                callback(true, courses);
            } else {
                HiLog::Error(LOG_LABEL, "Batch insert courses failed");
                callback(false, {});
            }
        } else {
            HiLog::Error(LOG_LABEL, "Sync remote courses failed");
            callback(false, {});
        }
    });
}

// 从本地数据库获取课程（内部辅助方法）
std::vector<Course> CourseDataSource::GetCoursesFromDB(const std::string& semester) {
    if (semester.empty()) {
        HiLog::Error(LOG_LABEL, "Semester is empty");
        return {};
    }
    return dbUtil_->QueryCoursesBySemester(semester);
}

// 检查是否需要同步远程数据（内部辅助方法）
bool CourseDataSource::NeedSyncRemoteData() {
    int32_t errCode = 0;
    std::string lastSyncTime = prefUtil_->GetLastSyncTime(errCode);
    if (errCode != ERR_OK || lastSyncTime.empty()) {
        return true;
    }

    // 超过24小时需要重新同步
    std::string currentTime = DateUtil::GetCurrentTimestamp();
    int64_t lastTime = std::stoll(lastSyncTime);
    int64_t currTime = std::stoll(currentTime);
    return (currTime - lastTime) > 86400000; // 24*60*60*1000毫秒
}

// 筛选今日课程（内部辅助方法）
std::vector<Course> CourseDataSource::FilterTodayCourses(const std::vector<Course>& courses) {
    std::vector<Course> todayCourses;
    std::string currentWeekday = DateUtil::GetCurrentWeekday();

    for (const auto& course : courses) {
        const auto& classTimes = course.GetClassTime();
        for (const auto& time : classTimes) {
            std::string courseWeekday = DateUtil::ExtractWeekdayFromClassTime(time);
            if (courseWeekday == currentWeekday) {
                todayCourses.push_back(course);
                break;
            }
        }
    }

    return todayCourses;
}