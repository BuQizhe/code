# 失物招领APP API文档
API的url前缀：http://rap2api.taobao.org/app/mock/323891

## 一、用户管理模块 API

### 1. 用户注册

**地址：** `/api/user/register`  
**请求方式：** POST  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| phone | string | 否 | 手机号 |
| avatar | file | 否 | 头像文件 |

**响应结果：**

**成功（200）：**

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "user_12345",
    "username": "张三",
    "password": "******",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar/default.jpg",
    "registerTime": "2025-06-16 06:01:57"
  }
}
```

**失败：**

```json
{"code": 400, "message": "用户名已存在"}
```

### 2. 用户登录

**地址：** `/api/user/login`  
**请求方式：** POST  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "userId": "user_12345",
    "username": "张三",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar/user_12345.jpg",
    "registerTime": "2025-06-16 06:01:57"
  }
}
```

**失败：**
```json
{"code": 401, "message": "用户名或密码错误"}
```

### 3. 查看个人信息

**地址：** `/api/user/profile`  
**请求方式：** GET  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| userId | string | 是 | 用户ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "userId": "user_12345",
    "username": "张三",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar/user_12345.jpg",
    "registerTime": "2025-06-16 06:01:57"
  }
}
```

### 4. 编辑个人信息

**地址：** `/api/user/profile`  
**请求方式：** PUT  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| userId | string | 是 | 用户ID |
| username | string | 否 | 用户名 |
| phone | string | 否 | 手机号 |
| avatar | file | 否 | 头像文件 |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "更新成功"
}
```

## 二、社区管理模块 API

### 1. 创建社区

**地址：** `/api/community/create`  
**请求方式：** POST  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| communityName | string | 是 | 社区名称 |
| communityType | string | 是 | 社区类型（校园/小区/公司/车站/机场） |
| address | string | 是 | 地址 |
| creatorId | string | 是 | 创建者ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "communityId": "comm_12345",
    "communityName": "北京大学",
    "communityType": "校园",
    "address": "北京市海淀区颐和园路5号",
    "creatorId": "user_12345",
    "createTime": "2025-06-16 06:01:57"
  }
}
```

### 2. 搜索社区

**地址：** `/api/community/search`  
**请求方式：** GET  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| communityName | string | 否 | 社区名称 |
| communityType | string | 否 | 社区类型 |
| address | string | 否 | 地址 |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "搜索成功",
  "data": [
    {
      "communityId": "comm_12345",
      "communityName": "北京大学",
      "communityType": "校园",
      "address": "北京市海淀区颐和园路5号",
      "createTime": "2025-06-16 06:01:57"
    }
  ]
}
```

### 3. 加入社区

**地址：** `/api/community/join`  
**请求方式：** POST  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| userId | string | 是 | 用户ID |
| communityId | string | 是 | 社区ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "加入成功",
  "data": {
    "userId": "user_12345",
    "communityId": "comm_12345",
    "joinTime": "2025-06-16 06:01:57"
  }
}
```

### 4. 获取用户已加入社区列表

**地址：** `/api/community/my-communities`  
**请求方式：** GET  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| userId | string | 是 | 用户ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "communityId": "comm_12345",
      "communityName": "北京大学",
      "communityType": "校园",
      "memberCount": 1250
    }
  ]
}
```

## 三、发布管理模块 API

### 1. 信息搜索

**地址：** `/api/post/search`  
**请求方式：** GET  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| communityId | string | 是 | 当前社区ID |
| keyword | string | 是 | 搜索关键词（物品名称、物品描述） |
| postType | string | 否 | 信息类型（寻物/寻主） |
| publishTime | string | 否 | 发布时间筛选 |
| status | string | 否 | 状态标记（寻找中/已找到） |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "搜索成功",
  "data": {
    "searchKeyword": "手机",
    "filterCondition": "寻主",
    "searchResults": [
      {
        "postId": "post_12345",
        "itemName": "苹果手机",
        "itemDescription": "黑色iPhone 13，有保护壳",
        "postType": "寻主",
        "lostLocation": "图书馆三楼",
        "status": "寻找中",
      "image": "https://dummyimage.com/60x60/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B",
      "lostTime": "2025-01-10 22:15:21"
      }
    ]
  }
}
```

### 2. 求助发布

**地址：** `/api/post/create`  
**请求方式：** POST  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| itemName | string | 是 | 物品名称 |
| itemDescription | string | 是 | 物品描述 |
| images | array | 否 | 物品图片URL数组 |
| postType | string | 是 | 信息类型（寻物/寻主） |
| lostTime | string | 是 | 丢失时间 |
| lostLocation | string | 是 | 丢失地点 |
| contact | string | 否 | 联系方式 |
| storageLocation | string | 否 | 暂存地点（寻主时必填，寻物时不填） |
| publisherId | string | 是 | 发布者ID |
| communityId | string | 是 | 社区ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "postId": "post_12345",
    "itemName": "苹果手机",
    "itemDescription": "黑色iPhone 13，有保护壳",
    "images": ["https://example.com/img1.jpg"],
    "postType": "寻主",
    "lostTime": "2025-06-15 14:30:00",
    "lostLocation": "图书馆三楼",
    "contact": "13800138000",
    "storageLocation": "保安室",
    "publisherId": "user_12345",
    "communityId": "comm_12345",
    "status": "寻找中"
  }
}
```

### 3. 求助详情

**地址：** `/api/post/detail`  
**请求方式：** GET  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| postId | string | 是 | 求助ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "postId": "post_12345",
    "itemName": "苹果手机",
    "itemDescription": "黑色iPhone 13，有保护壳",
    "images": ["https://example.com/img1.jpg"],
    "postType": "寻主",
    "lostTime": "2025-06-15 14:30:00",
    "lostLocation": "图书馆三楼",
    "contact": "13800138000",
    "storageLocation": "保安室",
    "publisherId": "user_12345",
    "communityId": "comm_12345",
    "status": "寻找中",
    "category": "证件"
  }
}
```

### 4. 求助更新

**地址：** `/api/post/update`  
**请求方式：** PUT  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| postId | string | 是 | 求助ID |
| itemName | string | 否 | 物品名称 |
| itemDescription | string | 否 | 物品描述 |
| images | array | 否 | 物品图片URL数组 |
| contact | string | 否 | 联系方式 |
| status | string | 否 | 状态标记（寻找中/已找到） |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "更新成功"
}
```

### 5. 获取社区求助列表

**地址：** `/api/post/community-list`  
**请求方式：** GET  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| communityId | string | 是 | 社区ID |
| postType | string | 否 | 信息类型筛选 |
| status | string | 否 | 状态筛选 |

**响应结果：**

**成功（200）：**

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "postId": "post_12345",
      "itemName": "苹果手机",
      "postType": "寻主",
      "lostLocation": "图书馆三楼",
      "publisherId": "user_12345",
      "status": "寻找中",
      "image": "https://dummyimage.com/60x60/3ee/fff.jpg&text=%E7%A4%BA%E4%BE%8B",
      "lostTime": "2025-01-10 22:15:21"
    }
  ]
}
```

## 四、认领管理模块 API

### 1. 认领登记

**地址：** `/api/claim/create`  
**请求方式：** POST  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| claimerId | string | 是 | 认领者ID |
| postId | string | 是 | 求助ID |
| claimerPhone | string | 是 | 认领者手机号 |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "认领成功",
  "data": {
    "claimId": "claim_12345",
    "claimerId": "user_67890",
    "postId": "post_12345",
    "claimTime": "2025-06-16 06:01:57",
    "claimerPhone": "13900139000"
  }
}
```

## 五、评论留言模块 API

### 1. 发表评论

**地址：** `/api/comment/create`  
**请求方式：** POST  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| content | string | 是 | 评论内容 |
| images | array | 否 | 评论图片URL数组 |
| commenterId | string | 是 | 评论者ID |
| postId | string | 是 | 求助ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "评论成功",
  "data": {
    "commentId": "comment_12345",
    "content": "这个手机我见过，在食堂附近",
    "images": ["https://example.com/comment_img1.jpg"],
    "commenterId": "user_67890",
    "postId": "post_12345",
    "createTime": "2025-06-16 06:01:57"
  }
}
```

### 2. 评论列表

**地址：** `/api/comment/list`  
**请求方式：** GET  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| postId | string | 是 | 求助ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "commentId": "comment_12345",
      "content": "这个手机我见过，在食堂附近",
      "images": ["https://example.com/comment_img1.jpg"],
      "commenterId": "user_67890",
      "commenterAvatar": "https://example.com/avatar2.jpg",
      "commenterName": "李四",
      "createTime": "2025-06-16 06:01:57"
    }
  ]
}
```

### 3. 发送私信

**地址：** `/api/message/send`  
**请求方式：** POST  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| content | string | 是 | 私信内容 |
| images | array | 否 | 私信图片URL数组 |
| senderId | string | 是 | 发送者ID |
| receiverId | string | 是 | 接收者ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "发送成功",
  "data": {
    "messageId": "msg_12345",
    "content": "请问这个手机还在吗？",
    "images": [],
    "senderId": "user_67890",
    "receiverId": "user_12345",
    "sendTime": "2025-06-16 06:01:57"
  }
}
```

### 4. 获取私信对话历史

**地址：** `/api/message/conversation`  
**请求方式：** GET  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| userId | string | 是 | 当前用户ID |
| otherUserId | string | 是 | 对方用户ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "messageId": "msg_12345",
      "content": "请问这个手机还在吗？",
      "images": [],
      "senderId": "user_67890",
      "receiverId": "user_12345",
      "sendTime": "2025-06-16 06:01:57"
    }
  ]
}
```

## 六、消息推送模块 API

### 1. 获取消息通知列表

**地址：** `/api/notification/list`  
**请求方式：** GET  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| userId | string | 是 | 接收者ID |
| messageType | string | 否 | 消息类型（评论/私信） |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "messageList": [
      {
        "messageId": "notif_12345",
        "messageType": "评论",
        "receiverId": "user_12345",
        "content": "李四在您的失物信息下发表了评论",
        "sendTime": "2025-06-16 06:01:57",
        "isRead": false
      }
    ],
    "messageCategory": ["评论", "私信"],
    "unreadCount": 5
  }
}
```

### 2. 标记消息已读

**地址：** `/api/notification/read`  
**请求方式：** PUT  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| messageId | string | 是 | 消息ID |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "标记成功"
}
```

## 七、文件上传 API

### 1. 上传图片

**地址：** `/api/upload/image`  
**请求方式：** POST  
**请求参数：**

| 参数名 | 类型 | 是否必填 | 说明 |
|--------|------|----------|------|
| file | file | 是 | 图片文件 |

**响应结果：**

**成功（200）：**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "https://example.com/uploads/20250616/image_12345.jpg"
  }
}
```

## 八、数据字典

### 社区类型枚举
- 校园
- 小区  
- 公司
- 车站
- 机场

### 信息类型枚举
- 寻物
- 寻主

### 状态标记枚举
- 寻找中（默认）
- 已找到

### 消息类型枚举
- 评论
- 私信

### 阅读状态
- true：已读
- false：未读

## 九、状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 登录失效 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |