# 💬 网页聊天室

基于 Spring Boot + WebSocket 的实时聊天室应用。

## 技术栈

- Spring Boot 2.7.18
- MyBatis
- MySQL 8.0
- WebSocket
- jQuery

## 功能特性

- 用户注册/登录
- 好友管理（搜索、添加、接受/拒绝）
- 私聊/群聊
- 实时消息（WebSocket）
- 图片发送
- 撤回消息（2分钟内）
- 未读红点/已读回执
- 夜间模式
- 置顶/删除会话
- 消息搜索
- 正在输入提示

## 快速开始

### 1. 环境要求
- JDK 17+
- MySQL 8.0+

### 2. 创建数据库
```bash
mysql -u root -p < chatroom.sql