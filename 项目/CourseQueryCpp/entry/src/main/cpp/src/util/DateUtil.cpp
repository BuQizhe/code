//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "util/DateUtil.h"
#include <ohos/hilog/ndk/log.h>
#include <ohos/utils/errors.h>
#include <stdexcept>
#include <regex>

// 日志标签（便于调试排错，符合赛事代码规范）
static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = {
    LOG_CORE, 0x00007, "DateUtil"
};

// 获取当前日期（格式：YYYY-MM-DD，支撑页面展示与数据筛选）
std::string DateUtil::GetCurrentDate() {
    std::time_t now = std::time(nullptr);
    tm tmStruct = *std::localtime(&now);
    char buf[16];
    std::strftime(buf, sizeof(buf), "%Y-%m-%d", &tmStruct);
    return std::string(buf);
}

// 获取当前星期（格式：周一/周二...，支撑今日课程筛选，赛事核心功能）
std::string DateUtil::GetCurrentWeekday() {
    std::time_t now = std::time(nullptr);
    tm tmStruct = *std::localtime(&now);
    int weekday = tmStruct.tm_wday; // 0=周日，1=周一...6=周六

    switch (weekday) {
        case 0: return "周日";
        case 1: return "周一";
        case 2: return "周二";
        case 3: return "周三";
        case 4: return "周四";
        case 5: return "周五";
        case 6: return "周六";
        default:
            HiLog::Error(LOG_LABEL, "GetCurrentWeekday: invalid weekday %{public}d", weekday);
            return "";
    }
}

// 从上课时间中提取星期（如"周一1-2节"→"周一"，支撑课程筛选逻辑）
std::string DateUtil::ExtractWeekdayFromClassTime(const std::string& classTime) {
    if (classTime.empty()) {
        HiLog::Error(LOG_LABEL, "ExtractWeekdayFromClassTime: classTime is empty");
        return "";
    }

    // 正则匹配星期（周一至周日）
    std::regex weekdayRegex(R"(^(周一|周二|周三|周四|周五|周六|周日))");
    std::smatch match;
    if (std::regex_search(classTime, match, weekdayRegex)) {
        return match.str(1);
    }

    HiLog::Warn(LOG_LABEL, "ExtractWeekdayFromClassTime: no weekday found in %{public}s", classTime.c_str());
    return "";
}

// 比较两个日期大小（返回true：date1 > date2，支撑时间排序功能）
bool DateUtil::CompareDates(const std::string& date1, const std::string& date2) {
    tm tm1, tm2;
    if (!ParseDate(date1, tm1) || !ParseDate(date2, tm2)) {
        return false;
    }
    return std::mktime(&tm1) > std::mktime(&tm2);
}

// 获取当前时间戳（格式：毫秒级字符串，支撑同步时间记录）
std::string DateUtil::GetCurrentTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()).count();
    return std::to_string(ms);
}

// 时间戳转日期字符串（格式：YYYY-MM-DD HH:MM:SS，支撑用户登录时间展示）
std::string DateUtil::TimestampToDatetime(const std::string& timestamp) {
    try {
        int64_t ms = std::stoll(timestamp);
        auto timePoint = std::chrono::system_clock::from_time_t(ms / 1000);
        auto tmStruct = *std::localtime(&std::chrono::system_clock::to_time_t(timePoint));
        char buf[32];
        std::strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", &tmStruct);
        return std::string(buf);
    } catch (const std::exception& e) {
        HiLog::Error(LOG_LABEL, "TimestampToDatetime failed: %{public}s", e.what());
        return "";
    }
}

// 解析日期字符串为tm结构体（内部辅助方法）
bool DateUtil::ParseDate(const std::string& dateStr, tm& tmStruct) {
    if (dateStr.empty()) {
        HiLog::Error(LOG_LABEL, "ParseDate: dateStr is empty");
        return false;
    }

    // 支持格式：YYYY-MM-DD
    std::regex dateRegex(R"(^(\d{4})-(\d{2})-(\d{2})$)");
    std::smatch match;
    if (!std::regex_match(dateStr, match, dateRegex)) {
        HiLog::Error(LOG_LABEL, "ParseDate: invalid date format %{public}s", dateStr.c_str());
        return false;
    }

    try {
        int year = std::stoi(match.str(1));
        int month = std::stoi(match.str(2)) - 1; // tm_mon从0开始
        int day = std::stoi(match.str(3));

        tmStruct.tm_year = year - 1900;
        tmStruct.tm_mon = month;
        tmStruct.tm_mday = day;
        tmStruct.tm_hour = 0;
        tmStruct.tm_min = 0;
        tmStruct.tm_sec = 0;
        tmStruct.tm_isdst = -1;

        // 验证日期有效性
        if (std::mktime(&tmStruct) == -1) {
            HiLog::Error(LOG_LABEL, "ParseDate: invalid date %{public}s", dateStr.c_str());
            return false;
        }
        return true;
    } catch (const std::exception& e) {
        HiLog::Error(LOG_LABEL, "ParseDate failed: %{public}s", e.what());
        return false;
    }
}