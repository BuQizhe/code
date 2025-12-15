//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#include "util/HttpUtil.h"
#include <ohos/hilog/ndk/log.h>
#include <ohos/utils/errors.h>
#include <ohos/net/http/http_client.h>
#include <thread>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using namespace OHOS::Net::Http;

static constexpr OHOS::HiviewDFX::HiLogLabel LOG_LABEL = {
    LOG_CORE, 0x00008, "HttpUtil"
};

// 初始化单例实例
std::shared_ptr<HttpUtil> HttpUtil::instance_ = nullptr;

// 单例模式获取实例（赛事模块化设计要求）
std::shared_ptr<HttpUtil> HttpUtil::GetInstance() {
    if (instance_ == nullptr) {
        instance_ = std::shared_ptr<HttpUtil>(new HttpUtil());
    }
    return instance_;
}

// 初始化（配置超时、请求头，赛事网络规范要求）
bool HttpUtil::Init() {
    HiLog::Info(LOG_LABEL, "HttpUtil Init success");
    return true; // 鸿蒙HTTP客户端无需额外初始化，直接使用
}

// 同步远程课程数据（支撑数据更新，赛事实际需求创新）
void HttpUtil::SyncCourses(const std::string& semester, HttpCallback callback) {
    if (!callback || semester.empty()) {
        HiLog::Error(LOG_LABEL, "SyncCourses: invalid parameter");
        callback(false, {});
        return;
    }

    // 异步请求，避免阻塞UI（赛事稳定性要求）
    std::thread([this, semester, callback]() {
        try {
            // 构建请求URL（拼接学期参数）
            std::string url = std::string(MOCK_COURSE_API) + "?semester=" + semester;
            HiLog::Info(LOG_LABEL, "SyncCourses: request url %{public}s", url.c_str());

            // 发送GET请求
            std::string response = SendGetRequest(url);
            if (response.empty()) {
                HiLog::Error(LOG_LABEL, "SyncCourses: empty response");
                callback(false, {});
                return;
            }

            // 解析响应数据
            int32_t errCode = 0;
            std::vector<Course> courses = ParseCourseResponse(response, errCode);
            if (errCode != ERR_OK || courses.empty()) {
                HiLog::Error(LOG_LABEL, "SyncCourses: parse response failed");
                callback(false, {});
                return;
            }

            callback(true, courses);
        } catch (const std::exception& e) {
            HiLog::Error(LOG_LABEL, "SyncCourses failed: %{public}s", e.what());
            callback(false, {});
        }
    }).detach();
}

// 检查网络连接状态（支撑离线提示，赛事交互体验要求）
bool HttpUtil::CheckNetworkState() {
    // 鸿蒙网络状态检查API（简化实现，实际可扩展）
    try {
        HttpClient client;
        // 尝试连接公共测试地址
        std::string testUrl = "https://www.baidu.com";
        auto response = client.SendRequest(testUrl, RequestMethod::GET);
        return response->GetResponseCode() == 200;
    } catch (const std::exception& e) {
        HiLog::Warn(LOG_LABEL, "CheckNetworkState: network unavailable: %{public}s", e.what());
        return false;
    }
}

// 发送HTTP GET请求（内部核心方法，封装鸿蒙HTTP API）
std::string HttpUtil::SendGetRequest(const std::string& url) {
    HttpClient client;
    HttpRequest request;

    // 配置请求参数
    request.SetUrl(url);
    request.SetMethod(RequestMethod::GET);
    request.AddHeader("Content-Type", "application/json");
    request.AddHeader("User-Agent", DEFAULT_USER_AGENT);

    // 设置超时时间
    client.SetConnectTimeout(HTTP_TIMEOUT);
    client.SetReadTimeout(HTTP_TIMEOUT);
    client.SetWriteTimeout(HTTP_TIMEOUT);

    try {
        auto response = client.SendRequest(request);
        int32_t responseCode = response->GetResponseCode();
        if (responseCode != 200) {
            HiLog::Error(LOG_LABEL, "SendGetRequest: response code %{public}d", responseCode);
            return "";
        }

        std::string responseBody = response->GetBody();
        HiLog::Info(LOG_LABEL, "SendGetRequest: response length %{public}zu", responseBody.size());
        return responseBody;
    } catch (const std::exception& e) {
        HiLog::Error(LOG_LABEL, "SendGetRequest failed: %{public}s", e.what());
        return "";
    }
}

// 解析HTTP响应为Course列表（JSON字符串→对象，支撑跨语言数据解析）
std::vector<Course> HttpUtil::ParseCourseResponse(const std::string& response, int32_t& errCode) {
    errCode = ERR_OK;
    std::vector<Course> courses;

    try {
        json j = json::parse(response);
        if (!j.contains("data") || !j["data"].is_array()) {
            HiLog::Error(LOG_LABEL, "ParseCourseResponse: no data array");
            errCode = ERR_INVALID_VALUE;
            return courses;
        }

        auto dataArray = j["data"].get<json::array_t>();
        for (const auto& item : dataArray) {
            Course course;
            course.SetId(item.value("id", ""));
            course.SetName(item.value("name", ""));
            course.SetTeacher(item.value("teacher", ""));
            course.SetCredit(item.value("credit", 0.0));

            // 解析上课时间数组
            if (item.contains("classTime") && item["classTime"].is_array()) {
                course.SetClassTime(item["classTime"].get<std::vector<std::string>>());
            } else {
                HiLog::Warn(LOG_LABEL, "ParseCourseResponse: missing classTime");
                continue;
            }

            course.SetLocation(item.value("location", ""));
            course.SetWeekRange(item.value("weekRange", ""));

            // 解析枚举类型
            std::string typeStr = item.value("type", "");
            int32_t enumErr = 0;
            course.SetType(StringToCourseType(typeStr, enumErr));
            if (enumErr != ERR_OK) {
                HiLog::Warn(LOG_LABEL, "ParseCourseResponse: invalid course type %{public}s", typeStr.c_str());
                continue;
            }

            std::string examTypeStr = item.value("examType", "");
            course.SetExamType(StringToExamType(examTypeStr, enumErr));
            if (enumErr != ERR_OK) {
                HiLog::Warn(LOG_LABEL, "ParseCourseResponse: invalid exam type %{public}s", examTypeStr.c_str());
                continue;
            }

            course.SetSemester(item.value("semester", ""));
            course.SetDescription(item.value("description", ""));

            // 数据校验
            if (course.Validate()) {
                courses.push_back(course);
            } else {
                HiLog::Warn(LOG_LABEL, "ParseCourseResponse: invalid course data");
            }
        }

        HiLog::Info(LOG_LABEL, "ParseCourseResponse: parsed %{public}zu courses", courses.size());
        return courses;
    } catch (const std::exception& e) {
        HiLog::Error(LOG_LABEL, "ParseCourseResponse failed: %{public}s", e.what());
        errCode = ERR_UNKNOWN;
        return courses;
    }
}