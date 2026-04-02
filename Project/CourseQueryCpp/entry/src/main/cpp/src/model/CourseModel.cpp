//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "model/CourseModel.h"
#include <stdexcept>
#include <ohos/utils/errors.h>
#include <ohos/hilog/ndk/log.h>

// 日志标签（便于调试排错，符合赛事代码规范）
static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = {
    LOG_CORE, 0x00002, "CourseModel"
};

// 带参构造函数（快速创建课程对象，支撑数据层高效初始化）
Course::Course(const std::string& id, const std::string& name, const std::string& teacher,
               double credit, const std::vector<std::string>& classTime, const std::string& location,
               const std::string& weekRange, CourseType type, ExamType examType, const std::string& semester)
    : id_(id), name_(name), teacher_(teacher), credit_(credit), classTime_(classTime),
      location_(location), weekRange_(weekRange), type_(type), examType_(examType), semester_(semester) {}

// 序列化（JSON字符串转换，支撑C++→ETS跨语言数据传递，赛事核心交互要求）
std::string Course::Serialize() const {
    try {
        json j;
        j["id"] = id_;
        j["name"] = name_;
        j["teacher"] = teacher_;
        j["credit"] = credit_;
        j["classTime"] = classTime_;
        j["location"] = location_;
        j["weekRange"] = weekRange_;
        j["type"] = CourseTypeToString(type_);
        j["examType"] = ExamTypeToString(examType_);
        j["semester"] = semester_;
        j["description"] = description_;
        return j.dump();
    } catch (const std::exception& e) {
        HiLog::Error(LOG_LABEL, "Course Serialize failed: %{public}s", e.what());
        return "";
    }
}

// 反序列化（JSON字符串→课程对象，支撑页面参数接收，赛事功能完整性要求）
Course Course::Deserialize(const std::string& jsonStr, int32_t& errCode) {
    errCode = ERR_OK;
    try {
        if (jsonStr.empty()) {
            HiLog::Error(LOG_LABEL, "Deserialize failed: json string is empty");
            errCode = ERR_INVALID_VALUE;
            return Course();
        }

        json j = json::parse(jsonStr);
        Course course;
        course.id_ = j.value("id", "");
        course.name_ = j.value("name", "");
        course.teacher_ = j.value("teacher", "");
        course.credit_ = j.value("credit", 0.0);
        
        // 解析上课时间数组
        if (j.contains("classTime") && j["classTime"].is_array()) {
            course.classTime_ = j["classTime"].get<std::vector<std::string>>();
        } else {
            HiLog::Warn(LOG_LABEL, "Deserialize: classTime is missing or invalid");
            errCode = ERR_INVALID_VALUE;
        }

        course.location_ = j.value("location", "");
        course.weekRange_ = j.value("weekRange", "");
        
        // 解析枚举类型
        std::string typeStr = j.value("type", "");
        course.type_ = StringToCourseType(typeStr, errCode);
        if (errCode != ERR_OK) {
            HiLog::Error(LOG_LABEL, "Deserialize: invalid course type: %{public}s", typeStr.c_str());
            return course;
        }

        std::string examTypeStr = j.value("examType", "");
        course.examType_ = StringToExamType(examTypeStr, errCode);
        if (errCode != ERR_OK) {
            HiLog::Error(LOG_LABEL, "Deserialize: invalid exam type: %{public}s", examTypeStr.c_str());
            return course;
        }

        course.semester_ = j.value("semester", "");
        course.description_ = j.value("description", "");

        // 数据校验
        if (!course.Validate()) {
            HiLog::Error(LOG_LABEL, "Deserialize: course data is invalid");
            errCode = ERR_INVALID_VALUE;
        }

        return course;
    } catch (const std::exception& e) {
        HiLog::Error(LOG_LABEL, "Deserialize failed: %{public}s", e.what());
        errCode = ERR_UNKNOWN;
        return Course();
    }
}

// 数据校验（确保核心字段完整，支撑功能稳定，赛事无明显BUG要求）
bool Course::Validate() const {
    if (id_.empty() || name_.empty() || teacher_.empty()) {
        HiLog::Warn(LOG_LABEL, "Course Validate failed: id/name/teacher is empty");
        return false;
    }
    if (credit_ <= 0) {
        HiLog::Warn(LOG_LABEL, "Course Validate failed: credit is invalid");
        return false;
    }
    if (classTime_.empty() || location_.empty() || weekRange_.empty() || semester_.empty()) {
        HiLog::Warn(LOG_LABEL, "Course Validate failed: classTime/location/weekRange/semester is empty");
        return false;
    }
    return true;
}

// 课程类型枚举→字符串（支撑数据存储与展示，赛事数据规范要求）
std::string CourseTypeToString(CourseType type) {
    switch (type) {
        case CourseType::COMPULSORY: return "必修课";
        case CourseType::ELECTIVE: return "选修课";
        case CourseType::PUBLIC_ELECTIVE: return "公选课";
        default:
            HiLog::Warn(LOG_LABEL, "CourseTypeToString: unknown type");
            return "";
    }
}

// 字符串→课程类型枚举（支撑数据解析，赛事功能完整性要求）
CourseType StringToCourseType(const std::string& str, int32_t& errCode) {
    errCode = ERR_OK;
    if (str == "必修课") return CourseType::COMPULSORY;
    if (str == "选修课") return CourseType::ELECTIVE;
    if (str == "公选课") return CourseType::PUBLIC_ELECTIVE;
    
    HiLog::Error(LOG_LABEL, "StringToCourseType: invalid string: %{public}s", str.c_str());
    errCode = ERR_INVALID_VALUE;
    return CourseType::COMPULSORY; // 默认返回必修课
}

// 考核方式枚举→字符串（支撑数据存储与展示）
std::string ExamTypeToString(ExamType type) {
    switch (type) {
        case ExamType::EXAM: return "考试";
        case ExamType::ASSESSMENT: return "考查";
        default:
            HiLog::Warn(LOG_LABEL, "ExamTypeToString: unknown type");
            return "";
    }
}

// 字符串→考核方式枚举（支撑数据解析）
ExamType StringToExamType(const std::string& str, int32_t& errCode) {
    errCode = ERR_OK;
    if (str == "考试") return ExamType::EXAM;
    if (str == "考查") return ExamType::ASSESSMENT;
    
    HiLog::Error(LOG_LABEL, "StringToExamType: invalid string: %{public}s", str.c_str());
    errCode = ERR_INVALID_VALUE;
    return ExamType::EXAM; // 默认返回考试
}

// 学期枚举→字符串（支撑数据存储与展示）
std::string SemesterToString(Semester semester) {
    switch (semester) {
        case Semester::FIRST_SEMESTER: return "2024-2025学年第一学期";
        case Semester::SECOND_SEMESTER: return "2024-2025学年第二学期";
        case Semester::SUMMER_TERM: return "2025年夏季学期";
        case Semester::WINTER_TERM: return "2025年冬季学期";
        default:
            HiLog::Warn(LOG_LABEL, "SemesterToString: unknown semester");
            return "";
    }
}

// 字符串→学期枚举（支撑数据解析）
Semester StringToSemester(const std::string& str, int32_t& errCode) {
    errCode = ERR_OK;
    if (str == "2024-2025学年第一学期") return Semester::FIRST_SEMESTER;
    if (str == "2024-2025学年第二学期") return Semester::SECOND_SEMESTER;
    if (str == "2025年夏季学期") return Semester::SUMMER_TERM;
    if (str == "2025年冬季学期") return Semester::WINTER_TERM;
    
    HiLog::Error(LOG_LABEL, "StringToSemester: invalid string: %{public}s", str.c_str());
    errCode = ERR_INVALID_VALUE;
    return Semester::FIRST_SEMESTER; // 默认返回第一学期
}

// 模拟课程数据（支撑开发阶段测试，赛事开发效率要求）
std::vector<Course> GetMockCourses(const std::string& semester) {
    std::vector<Course> courses;

    // 模拟课程1：鸿蒙应用开发
    Course course1(
        "course_001",
        "鸿蒙应用开发",
        "张老师",
        3.0,
        {"周一1-2节", "周三3-4节"},
        "计算机楼302",
        "1-16周",
        CourseType::COMPULSORY,
        ExamType::EXAM,
        semester
    );
    course1.SetDescription("学习鸿蒙系统应用开发核心技术，包括ArkTS、ArkUI、数据存储等，结合赛事要求设计实战项目");
    courses.push_back(course1);

    // 模拟课程2：人工智能导论
    Course course2(
        "course_002",
        "人工智能导论",
        "李老师",
        2.0,
        {"周二2-3节", "周四4-5节"},
        "教学楼201",
        "1-16周",
        CourseType::ELECTIVE,
        ExamType::ASSESSMENT,
        semester
    );
    course2.SetDescription("介绍人工智能基本概念、算法原理及应用场景，培养创新思维");
    courses.push_back(course2);

    // 模拟课程3：数据结构与算法
    Course course3(
        "course_003",
        "数据结构与算法",
        "王老师",
        4.0,
        {"周一5-6节", "周五1-2节"},
        "计算机楼205",
        "1-16周",
        CourseType::COMPULSORY,
        ExamType::EXAM,
        semester
    );
    course3.SetDescription("深入学习常用数据结构与算法设计，提升编程效率与问题解决能力");
    courses.push_back(course3);

    // 模拟课程4：大学英语（4）
    Course course4(
        "course_004",
        "大学英语（4）",
        "刘老师",
        2.5,
        {"周三1-2节", "周五3-4节"},
        "外语楼103",
        "1-16周",
        CourseType::COMPULSORY,
        ExamType::EXAM,
        semester
    );
    course4.SetDescription("提升英语听说读写能力，适应国际化交流需求");
    courses.push_back(course4);

    HiLog::Info(LOG_LABEL, "GetMockCourses: generated %{public}zu mock courses for semester: %{public}s",
                courses.size(), semester.c_str());
    return courses;
}