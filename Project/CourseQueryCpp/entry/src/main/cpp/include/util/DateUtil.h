//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_DATEUTIL_H
#define COURSEQUERYCPP_DATEUTIL_H

#endif //COURSEQUERYCPP_DATEUTIL_H

#ifndef DATE_UTIL_H
#define DATE_UTIL_H

#include <string>
#include <ctime>
#include <vector>

// 日期工具类（封装时间解析、筛选核心逻辑，支撑今日课程等核心功能）
class DateUtil {
public:
    // 获取当前日期（格式：YYYY-MM-DD，支撑页面展示与数据筛选）
    static std::string GetCurrentDate();

    // 获取当前星期（格式：周一/周二...，支撑今日课程筛选，赛事核心功能）
    static std::string GetCurrentWeekday();

    // 从上课时间中提取星期（如"周一1-2节"→"周一"，支撑课程筛选逻辑）
    static std::string ExtractWeekdayFromClassTime(const std::string& classTime);

    // 比较两个日期大小（返回true：date1 > date2，支撑时间排序功能）
    static bool CompareDates(const std::string& date1, const std::string& date2);

    // 获取当前时间戳（格式：毫秒级字符串，支撑同步时间记录）
    static std::string GetCurrentTimestamp();

    // 时间戳转日期字符串（格式：YYYY-MM-DD HH:MM:SS，支撑用户登录时间展示）
    static std::string TimestampToDatetime(const std::string& timestamp);

private:
    // 私有构造函数（禁止实例化，工具类设计规范）
    DateUtil() = default;
    ~DateUtil() = default;

    // 禁止拷贝构造与赋值
    DateUtil(const DateUtil&) = delete;
    DateUtil& operator=(const DateUtil&) = delete;

    // 解析日期字符串为tm结构体（内部辅助方法）
    static bool ParseDate(const std::string& dateStr, tm& tmStruct);
};

#endif // DATE_UTIL_H