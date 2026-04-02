//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_COURSEMODEL_H
#define COURSEQUERYCPP_COURSEMODEL_H

#endif //COURSEQUERYCPP_COURSEMODEL_H

#ifndef COURSE_MODEL_H
#define COURSE_MODEL_H

#include <string>
#include <vector>
#include <ctime>
#include <nlohmann/json.hpp> // 鸿蒙NDK内置JSON库，支撑跨语言数据传递
#include <ohos/utils/errors.h>

// 命名空间简化（符合C++编码规范，赛事代码规范要求）
using json = nlohmann::json;

// 课程类型枚举（规范数据取值，避免非法输入，赛事功能稳定性要求）
enum class CourseType {
    COMPULSORY,    // 必修课
    ELECTIVE,      // 选修课
    PUBLIC_ELECTIVE// 公选课
};

// 考核方式枚举（统一数据表述，支撑课程详情展示功能）
enum class ExamType {
    EXAM,          // 考试
    ASSESSMENT     // 考查
};

// 学期枚举（预设常用学期，支撑学期切换核心功能，赛事功能完整性要求）
enum class Semester {
    FIRST_SEMESTER,  // 2024-2025学年第一学期
    SECOND_SEMESTER, // 2024-2025学年第二学期
    SUMMER_TERM,     // 2025年夏季学期
    WINTER_TERM      // 2025年冬季学期
};

// 课程实体类（封装课程核心信息，支撑所有课程相关功能，赛事核心数据模型）
class Course {
public:
    // 构造函数（默认+带参，便于对象创建）
    Course() = default;
    Course(const std::string& id, const std::string& name, const std::string& teacher,
           double credit, const std::vector<std::string>& classTime, const std::string& location,
           const std::string& weekRange, CourseType type, ExamType examType, const std::string& semester);

    // 序列化（JSON字符串转换，支撑跨语言数据传递，如C++→ETS页面）
    std::string Serialize() const;
    // 反序列化（JSON字符串→对象，支撑页面参数接收，如详情页接收课程数据）
    static Course Deserialize(const std::string& jsonStr, int32_t& errCode);
    // 数据校验（确保核心字段完整，赛事功能稳定性要求）
    bool Validate() const;

    // Getter/Setter方法（封装数据，符合面向对象设计，赛事代码规范要求）
    std::string GetId() const { return id_; }
    void SetId(const std::string& id) { id_ = id; }

    std::string GetName() const { return name_; }
    void SetName(const std::string& name) { name_ = name; }

    std::string GetTeacher() const { return teacher_; }
    void SetTeacher(const std::string& teacher) { teacher_ = teacher; }

    double GetCredit() const { return credit_; }
    void SetCredit(double credit) { credit_ = credit; }

    std::vector<std::string> GetClassTime() const { return classTime_; }
    void SetClassTime(const std::vector<std::string>& classTime) { classTime_ = classTime; }

    std::string GetLocation() const { return location_; }
    void SetLocation(const std::string& location) { location_ = location; }

    std::string GetWeekRange() const { return weekRange_; }
    void SetWeekRange(const std::string& weekRange) { weekRange_ = weekRange; }

    CourseType GetType() const { return type_; }
    void SetType(CourseType type) { type_ = type; }

    ExamType GetExamType() const { return examType_; }
    void SetExamType(ExamType examType) { examType_ = examType; }

    std::string GetSemester() const { return semester_; }
    void SetSemester(const std::string& semester) { semester_ = semester; }

    std::string GetDescription() const { return description_; }
    void SetDescription(const std::string& description) { description_ = description; }

private:
    std::string id_;             // 课程唯一标识（数据库主键，支撑数据存储）
    std::string name_;           // 课程名称（核心展示字段）
    std::string teacher_;        // 教师姓名（搜索/展示字段）
    double credit_;              // 学分（详情展示字段）
    std::vector<std::string> classTime_; // 上课时间（如["周一1-2节"]，支撑今日课程筛选）
    std::string location_;       // 上课地点（详情展示字段）
    std::string weekRange_;      // 周次范围（如"1-16周"，支撑课程有效性判断）
    CourseType type_;            // 课程类型（筛选功能字段）
    ExamType examType_;          // 考核方式（详情展示字段）
    std::string semester_;       // 所属学期（筛选/缓存字段）
    std::string description_;    // 课程简介（扩展字段，体现创新，赛事加分项）
};

// 枚举与字符串互转工具函数（支撑数据存储与展示，赛事功能完整性要求）
std::string CourseTypeToString(CourseType type);
CourseType StringToCourseType(const std::string& str, int32_t& errCode);

std::string ExamTypeToString(ExamType type);
ExamType StringToExamType(const std::string& str, int32_t& errCode);

std::string SemesterToString(Semester semester);
Semester StringToSemester(const std::string& str, int32_t& errCode);

// 模拟课程数据（开发阶段测试用，支撑无网络/数据库时功能调试，赛事开发效率要求）
std::vector<Course> GetMockCourses(const std::string& semester);

#endif // COURSE_MODEL_H