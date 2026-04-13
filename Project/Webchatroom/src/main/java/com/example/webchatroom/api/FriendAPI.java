package com.example.webchatroom.api;

import com.example.webchatroom.config.OnlineUserManager;
import com.example.webchatroom.model.AddFriendRequest;
import com.example.webchatroom.model.Friend;
import com.example.webchatroom.model.User;
import com.example.webchatroom.mapper.FriendMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class FriendAPI {

    @Resource
    private FriendMapper friendMapper;

    @Autowired
    private OnlineUserManager onlineUserManager;

    private ObjectMapper objectMapper = new ObjectMapper();

    // 获取好友列表
    @GetMapping("/friendList")
    public Object getFriendList(HttpServletRequest req) {
        try {
            HttpSession session = req.getSession(false);
            if (session == null) {
                return new ArrayList<Friend>();
            }
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return new ArrayList<Friend>();
            }
            return friendMapper.selectFriendList(user.getUserId());
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<Friend>();
        }
    }

    // 搜索好友
    @GetMapping("/findFriend")
    public Object findFriend(String name, HttpServletRequest req) {
        try {
            HttpSession session = req.getSession(false);
            if (session == null) {
                return new ArrayList<Friend>();
            }
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return new ArrayList<Friend>();
            }
            System.out.println("搜索好友: name=" + name + ", userId=" + user.getUserId());
            List<Friend> result = friendMapper.findFriend(user.getUserId(), name);
            System.out.println("搜索结果数量: " + result.size());
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<Friend>();
        }
    }

    // 检查是否是好友
    @GetMapping("/isFriend")
    public Object isFriend(int friendId, HttpServletRequest req) {
        Map<String, Object> result = new HashMap<>();
        try {
            HttpSession session = req.getSession(false);
            if (session == null) {
                result.put("isFriend", false);
                return result;
            }
            User user = (User) session.getAttribute("user");
            if (user == null) {
                result.put("isFriend", false);
                return result;
            }
            int count = friendMapper.isFriend(user.getUserId(), friendId);
            result.put("isFriend", count > 0);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("isFriend", false);
        }
        return result;
    }

    // 发送好友请求
    @PostMapping("/sendFriendRequest")
    public Object sendFriendRequest(int toUserId, String reason, HttpServletRequest req) {
        Map<String, Object> result = new HashMap<>();
        try {
            HttpSession session = req.getSession(false);
            if (session == null) {
                result.put("success", false);
                result.put("message", "未登录");
                return result;
            }
            User user = (User) session.getAttribute("user");
            if (user == null) {
                result.put("success", false);
                result.put("message", "未登录");
                return result;
            }

            // 不能添加自己
            if (user.getUserId() == toUserId) {
                result.put("success", false);
                result.put("message", "不能添加自己为好友");
                return result;
            }

            // 检查是否已经是好友
            int isFriend = friendMapper.isFriend(user.getUserId(), toUserId);
            if (isFriend > 0) {
                result.put("success", false);
                result.put("message", "已经是好友了");
                return result;
            }

            // 检查是否已发送过请求
            AddFriendRequest existing = friendMapper.checkFriendRequest(user.getUserId(), toUserId);
            if (existing != null) {
                result.put("success", false);
                result.put("message", "已发送过好友请求，请等待对方处理");
                return result;
            }

            // 保存好友请求到数据库
            friendMapper.addFriendRequest(user.getUserId(), toUserId, reason == null ? "" : reason);
            System.out.println("好友请求已保存: from=" + user.getUserId() + ", to=" + toUserId);

            // 通过WebSocket实时通知对方
            WebSocketSession targetSession = onlineUserManager.getSession(toUserId);
            if (targetSession != null && targetSession.isOpen()) {
                Map<String, Object> notification = new HashMap<>();
                notification.put("type", "friendRequest");
                notification.put("fromUserId", user.getUserId());
                notification.put("fromUserName", user.getUsername());
                notification.put("reason", reason == null ? "" : reason);
                String json = objectMapper.writeValueAsString(notification);
                targetSession.sendMessage(new TextMessage(json));
                System.out.println("WebSocket通知已发送给: " + toUserId);
            } else {
                System.out.println("对方不在线，请求已保存，上线后会收到");
            }

            result.put("success", true);
            result.put("message", "好友请求已发送");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("message", "发送失败");
        }
        return result;
    }

    // 获取待处理的好友请求
    @GetMapping("/getFriendRequests")
    public Object getFriendRequests(HttpServletRequest req) {
        try {
            HttpSession session = req.getSession(false);
            if (session == null) {
                return new ArrayList<AddFriendRequest>();
            }
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return new ArrayList<AddFriendRequest>();
            }
            List<AddFriendRequest> requests = friendMapper.getPendingFriendRequests(user.getUserId());
            System.out.println("获取好友请求: userId=" + user.getUserId() + ", count=" + requests.size());
            return requests;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<AddFriendRequest>();
        }
    }

    // 接受好友请求
    @PostMapping("/acceptFriendRequest")
    public Object acceptFriendRequest(int fromUserId, HttpServletRequest req) {
        Map<String, Object> result = new HashMap<>();
        try {
            HttpSession session = req.getSession(false);
            if (session == null) {
                result.put("success", false);
                return result;
            }
            User user = (User) session.getAttribute("user");
            if (user == null) {
                result.put("success", false);
                return result;
            }

            System.out.println("接受好友请求: from=" + fromUserId + ", to=" + user.getUserId());

            // 更新请求状态
            friendMapper.acceptFriendRequest(fromUserId, user.getUserId());

            // 添加好友关系（双向）
            friendMapper.addFriendRelation(user.getUserId(), fromUserId);

            // 通知对方
            WebSocketSession targetSession = onlineUserManager.getSession(fromUserId);
            if (targetSession != null && targetSession.isOpen()) {
                Map<String, Object> notification = new HashMap<>();
                notification.put("type", "friendRequestAccepted");
                notification.put("fromUserId", user.getUserId());
                notification.put("fromUserName", user.getUsername());
                String json = objectMapper.writeValueAsString(notification);
                targetSession.sendMessage(new TextMessage(json));
                System.out.println("接受通知已发送给: " + fromUserId);
            }

            result.put("success", true);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
        }
        return result;
    }

    // 拒绝好友请求
    @PostMapping("/rejectFriendRequest")
    public Object rejectFriendRequest(int fromUserId, HttpServletRequest req) {
        Map<String, Object> result = new HashMap<>();
        try {
            HttpSession session = req.getSession(false);
            if (session == null) {
                result.put("success", false);
                return result;
            }
            User user = (User) session.getAttribute("user");
            if (user == null) {
                result.put("success", false);
                return result;
            }

            System.out.println("拒绝好友请求: from=" + fromUserId + ", to=" + user.getUserId());

            friendMapper.rejectFriendRequest(fromUserId, user.getUserId());
            result.put("success", true);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
        }
        return result;
    }
}