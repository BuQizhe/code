//
// Created on 2025/12/15.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef COURSEQUERYCPP_HTTPUTIL_H
#define COURSEQUERYCPP_HTTPUTIL_H

#endif //COURSEQUERYCPP_HTTPUTIL_H

#ifndef HTTP_UTIL_H
#define HTTP_UTIL_H

#include <string>
#include <vector>
#include <functional>
#include <memory>
#include "model/CourseModel.h"

// 网络请求回调（异步请求避免UI阻塞，赛事稳定性要求）
using HttpCallback = std::function<void(bool success, const std::vector<Course>& courses)>;

// 网络工具类（封装鸿蒙HTTP C++ API，支撑远程课程同步，赛事网络模块要求）
class HttpUtil {
public:
    // 单例模式（确保网络请求资源唯一，避免端口占用）
    static std::shared_ptr<HttpUtil> GetInstance();

    // 初始化（配置超时、请求头，赛事网络规范要求）
    bool Init();

    // 核心功能：同步远程课程数据（支撑数据更新，赛事实际需求创新）
    void SyncCourses(const std::string& semester, HttpCallback callback);

    // 扩展功能：检查网络连接状态（支撑离线提示，赛事交互体验要求）
    bool CheckNetworkState();

private:
    HttpUtil() = default;
    ~HttpUtil() = default;

    // 禁止拷贝构造与赋值
    HttpUtil(const HttpUtil&) = delete;
    HttpUtil& operator=(const HttpUtil&) = delete;

    // 发送HTTP GET请求（内部核心方法，封装鸿蒙HTTP API）
    std::string SendGetRequest(const std::string& url);

    // 解析HTTP响应为Course列表（JSON字符串→对象，支撑跨语言数据解析）
    std::vector<Course> ParseCourseResponse(const std::string& response, int32_t& errCode);

    // 单例实例
    static std::shared_ptr<HttpUtil> instance_;

    // 网络配置常量（避免硬编码，赛事代码规范要求）
    static constexpr int32_t HTTP_TIMEOUT = 5000; // 超时时间5秒
    static constexpr const char* DEFAULT_USER_AGENT = "CourseQuery/1.0 (HarmonyOS)";
    static constexpr const char* MOCK_COURSE_API = "https://mock.campus-api.com/courses"; // 模拟校园接口
};

#endif // HTTP_UTIL_H