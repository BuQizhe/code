//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "data/DatabaseUtil.h"
#include <ohos/hilog/ndk/log.h>
#include <ohos/utils/errors.h>
#include <ohos/ability/ability_context.h>
#include "ability/EntryAbility.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = {
    LOG_CORE, 0x00005, "DatabaseUtil"
};

std::shared_ptr<DatabaseUtil> DatabaseUtil::instance_ = nullptr;

// 单例模式获取实例
std::shared_ptr<DatabaseUtil> DatabaseUtil::GetInstance() {
    if (instance_ == nullptr) {
        instance_ = std::shared_ptr<DatabaseUtil>(new DatabaseUtil());
    }
    return instance_;
}

// 初始化数据库（赛事数据存储基础）
bool DatabaseUtil::Init() {
    HiLog::Info(LOG_LABEL, "DatabaseUtil Init start");

    // 获取应用上下文
    auto context = EntryAbility::GetGlobalContext();
    if (!context) {
        HiLog::Error(LOG_LABEL, "Get ability context failed");
        return false;
    }

    // 配置数据库
    OHOS::Data::RelationalStore::DatabaseConfig config;
    config.SetName(DB_NAME);
    config.SetSecurityLevel(OHOS::Data::RelationalStore::SecurityLevel::S1);

    // 打开数据库
    auto result = OHOS::Data::RelationalStore::RelationalStore::Open(context, config, rdbStore_);
    if (result != OHOS::Utils::ERR_OK || !rdbStore_) {
        HiLog::Error(LOG_LABEL, "Open database failed, result: %{public}d", result);
        return false;
    }

    // 创建课程表
    if (!CreateCourseTable()) {
        HiLog::Error(LOG_LABEL, "Create course table failed");
        return false;
    }

    HiLog::Info(LOG_LABEL, "DatabaseUtil Init success");
    return true;
}

// 创建课程表（赛事数据结构设计要求）
bool DatabaseUtil::CreateCourseTable() {
    std::string createSql = std::string("CREATE TABLE IF NOT EXISTS ") + TABLE_NAME + R"( (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        teacher TEXT NOT NULL,
        credit REAL NOT NULL,
        classTime TEXT NOT NULL,
        location TEXT NOT NULL,
        weekRange TEXT NOT NULL,
        type TEXT NOT NULL,
        examType TEXT NOT NULL,
        semester TEXT NOT NULL
    ))";

    auto result = rdbStore_->ExecuteSql(createSql);
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Execute create table sql failed, result: %{public}d", result);
        return false;
    }
    return true;
}

// 批量插入课程（支撑数据同步与存储，赛事功能完整性要求）
bool DatabaseUtil::BatchInsertCourses(const std::vector<Course>& courses) {
    if (!rdbStore_ || courses.empty()) {
        HiLog::Error(LOG_LABEL, "Invalid parameter");
        return false;
    }

    std::vector<OHOS::Data::RelationalStore::ValuesBucket> valuesList;
    for (const auto& course : courses) {
        OHOS::Data::RelationalStore::ValuesBucket values;
        values.PutString("id", course.GetId());
        values.PutString("name", course.GetName());
        values.PutString("teacher", course.GetTeacher());
        values.PutDouble("credit", course.GetCredit());

        // 序列化classTime为JSON字符串
        json j = course.GetClassTime();
        values.PutString("classTime", j.dump());

        values.PutString("location", course.GetLocation());
        values.PutString("weekRange", course.GetWeekRange());
        values.PutString("type", CourseTypeToString(course.GetType()));
        values.PutString("examType", ExamTypeToString(course.GetExamType()));
        values.PutString("semester", course.GetSemester());

        valuesList.push_back(values);
    }

    auto result = rdbStore_->BatchInsert(TABLE_NAME, valuesList);
    if (result != static_cast<int>(courses.size())) {
        HiLog::Error(LOG_LABEL, "Batch insert failed, result: %{public}d, expect: %{public}zu",
                     result, courses.size());
        return false;
    }
    return true;
}

// 按学期查询课程（支撑课程筛选，关联赛事核心功能）
std::vector<Course> DatabaseUtil::QueryCoursesBySemester(const std::string& semester) {
    std::vector<Course> courses;
    if (!rdbStore_ || semester.empty()) {
        HiLog::Error(LOG_LABEL, "Invalid parameter");
        return courses;
    }

    std::string querySql = "SELECT * FROM " + std::string(TABLE_NAME) + " WHERE semester = ?";
    std::vector<std::string> bindArgs = {semester};

    auto resultSet = rdbStore_->QuerySql(querySql, bindArgs);
    if (!resultSet) {
        HiLog::Error(LOG_LABEL, "Query sql failed");
        return courses;
    }

    // 解析结果集
    while (resultSet->GoToNextRow() == OHOS::Utils::ERR_OK) {
        Course course;
        course.SetId(resultSet->GetString("id"));
        course.SetName(resultSet->GetString("name"));
        course.SetTeacher(resultSet->GetString("teacher"));
        course.SetCredit(resultSet->GetDouble("credit"));

        // 反序列化classTime
        std::string classTimeStr = resultSet->GetString("classTime");
        try {
            auto classTime = json::parse(classTimeStr).get<std::vector<std::string>>();
            course.SetClassTime(classTime);
        } catch (const std::exception& e) {
            HiLog::Error(LOG_LABEL, "Parse classTime failed: %{public}s", e.what());
            continue;
        }

        course.SetLocation(resultSet->GetString("location"));
        course.SetWeekRange(resultSet->GetString("weekRange"));

        // 解析枚举类型
        int32_t errCode = 0;
        course.SetType(StringToCourseType(resultSet->GetString("type"), errCode));
        course.SetExamType(StringToExamType(resultSet->GetString("examType"), errCode));
        course.SetSemester(resultSet->GetString("semester"));

        courses.push_back(course);
    }

    resultSet->Close();
    HiLog::Info(LOG_LABEL, "Query courses count: %{public}zu", courses.size());
    return courses;
}

// 按关键词搜索课程（支撑搜索功能，赛事多模块整合要求）
std::vector<Course> DatabaseUtil::SearchCourses(const std::string& semester, const std::string& keyword) {
    std::vector<Course> allCourses = QueryCoursesBySemester(semester);
    std::vector<Course> result;

    // 模糊搜索（忽略大小写）
    std::string lowerKeyword = keyword;
    std::transform(lowerKeyword.begin(), lowerKeyword.end(), lowerKeyword.begin(), ::tolower);

    for (const auto& course : allCourses) {
        std::string lowerName = course.GetName();
        std::string lowerTeacher = course.GetTeacher();
        std::transform(lowerName.begin(), lowerName.end(), lowerName.begin(), ::tolower);
        std::transform(lowerTeacher.begin(), lowerTeacher.end(), lowerTeacher.begin(), ::tolower);

        if (lowerName.find(lowerKeyword) != std::string::npos ||
            lowerTeacher.find(lowerKeyword) != std::string::npos) {
            result.push_back(course);
        }
    }

    return result;
}

// 清空课程表（扩展功能，体现灵活性）
bool DatabaseUtil::ClearAllCourses() {
    if (!rdbStore_) {
        HiLog::Error(LOG_LABEL, "Database not initialized");
        return false;
    }

    std::string sql = "DELETE FROM " + std::string(TABLE_NAME);
    auto result = rdbStore_->ExecuteSql(sql);
    if (result != OHOS::Utils::ERR_OK) {
        HiLog::Error(LOG_LABEL, "Clear all courses failed, result: %{public}d", result);
        return false;
    }
    return true;
}