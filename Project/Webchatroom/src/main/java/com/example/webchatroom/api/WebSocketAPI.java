package com.example.webchatroom.api;

import com.example.webchatroom.config.OnlineUserManager;
import com.example.webchatroom.mapper.GroupChatMapper;
import com.example.webchatroom.mapper.GroupMessageMapper;
import com.example.webchatroom.mapper.MessageMapper;
import com.example.webchatroom.mapper.MessageSessionMapper;
import com.example.webchatroom.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.annotation.Resource;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WebSocketAPI extends TextWebSocketHandler {

    @Autowired
    private OnlineUserManager onlineUserManager;

    @Resource
    private MessageSessionMapper messageSessionMapper;

    @Resource
    private MessageMapper messageMapper;

    @Resource
    private GroupChatMapper groupChatMapper;

    @Resource
    private GroupMessageMapper groupMessageMapper;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("WebSocket 连接成功!");
        try {
            Map<String, Object> attributes = session.getAttributes();
            User user = (User) attributes.get("user");
            if (user != null) {
                onlineUserManager.online(user.getUserId(), session);
                System.out.println("用户上线: " + user.getUsername() + " (ID: " + user.getUserId() + ")");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("收到消息: " + message.getPayload());
        try {
            Map<String, Object> attributes = session.getAttributes();
            User user = (User) attributes.get("user");
            if (user == null) {
                System.out.println("用户未登录");
                return;
            }

            Map<String, Object> req = objectMapper.readValue(message.getPayload(), Map.class);
            String type = (String) req.get("type");
            System.out.println("消息类型: " + type);

            if ("message".equals(type)) {
                handleChatMessage(user, req);
            } else if ("revoke".equals(type)) {
                handleRevokeMessage(user, req);
            } else if ("markRead".equals(type)) {
                handleMarkRead(user, req);
            } else if ("typing".equals(type)) {
                handleTyping(user, req);
            } else if ("stopTyping".equals(type)) {
                handleStopTyping(user, req);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 处理聊天消息（支持私聊和群聊）
    private void handleChatMessage(User fromUser, Map<String, Object> req) throws IOException {
        int sessionId = (int) req.get("sessionId");
        String content = (String) req.getOrDefault("content", "");
        String imageUrl = (String) req.getOrDefault("imageUrl", null);
        String chatType = (String) req.getOrDefault("chatType", "friend");

        System.out.println("聊天消息: from=" + fromUser.getUsername() + ", sessionId=" + sessionId + ", chatType=" + chatType);

        int messageId = 0;

        if ("group".equals(chatType)) {
            // 群聊：保存到 group_message 表
            GroupMessage groupMsg = new GroupMessage();
            groupMsg.setFromId(fromUser.getUserId());
            groupMsg.setGroupId(sessionId);
            groupMsg.setContent(content);
            groupMsg.setImageUrl(imageUrl);
            groupMsg.setPostTime(new Timestamp(System.currentTimeMillis()));
            groupMsg.setIsRevoked(0);
            groupMessageMapper.addGroupMessage(groupMsg);
            messageId = groupMsg.getMessageId();
            System.out.println("群聊消息已保存, messageId=" + messageId);
        } else {
            // 私聊：保存到 message 表
            Message message = new Message();
            message.setFromId(fromUser.getUserId());
            message.setSessionId(sessionId);
            message.setContent(content);
            message.setPostTime(new Timestamp(System.currentTimeMillis()));
            message.setIsRevoked(0);
            message.setIsRead(0);
            message.setImageUrl(imageUrl);
            messageMapper.add(message);
            messageId = message.getMessageId();
            System.out.println("私聊消息已保存, messageId=" + messageId);

            // 更新会话时间
            messageSessionMapper.updateLastTime(sessionId);
        }

        // 获取需要发送的用户列表
        List<Integer> targetUserIds = new ArrayList<>();

        if ("group".equals(chatType)) {
            // 群聊：获取群成员
            List<Friend> members = groupChatMapper.getGroupMembers(sessionId);
            for (Friend member : members) {
                targetUserIds.add(member.getFriendId());
            }
        } else {
            // 私聊：获取会话中的其他用户
            List<Friend> friends = messageSessionMapper.getFriendsBySessionId(sessionId, fromUser.getUserId());
            targetUserIds.add(fromUser.getUserId());
            for (Friend friend : friends) {
                targetUserIds.add(friend.getFriendId());
            }
        }

        System.out.println("目标用户: " + targetUserIds);

        // 构造响应
        Map<String, Object> resp = new HashMap<>();
        resp.put("type", "message");
        resp.put("messageId", messageId);
        resp.put("fromId", fromUser.getUserId());
        resp.put("fromName", fromUser.getUsername());
        resp.put("sessionId", sessionId);
        resp.put("content", content);
        resp.put("imageUrl", imageUrl);
        resp.put("postTime", new Timestamp(System.currentTimeMillis()).toString());
        resp.put("isRevoked", 0);
        resp.put("isRead", 0);
        resp.put("chatType", chatType);

        String respJson = objectMapper.writeValueAsString(resp);
        System.out.println("转发消息JSON: " + respJson);

        // 发送给所有目标用户
        for (int userId : targetUserIds) {
            WebSocketSession targetSession = onlineUserManager.getSession(userId);
            if (targetSession != null && targetSession.isOpen()) {
                targetSession.sendMessage(new TextMessage(respJson));
                System.out.println("消息已发送给: userId=" + userId);
            } else {
                System.out.println("用户不在线: userId=" + userId);
            }
        }
    }

    // 处理撤回消息
    private void handleRevokeMessage(User fromUser, Map<String, Object> req) throws IOException {
        int messageId = (int) req.get("messageId");
        int sessionId = (int) req.get("sessionId");
        String chatType = (String) req.getOrDefault("chatType", "friend");

        System.out.println("撤回请求: messageId=" + messageId + ", fromUser=" + fromUser.getUsername() + ", chatType=" + chatType);

        // 获取需要通知的用户列表
        List<Integer> targetUserIds = new ArrayList<>();

        if ("group".equals(chatType)) {
            // 群聊撤回
            GroupMessage groupMsg = groupMessageMapper.getGroupMessageById(messageId);
            if (groupMsg == null) {
                System.out.println("消息不存在");
                return;
            }
            if (groupMsg.getFromId() != fromUser.getUserId()) {
                System.out.println("只能撤回自己的消息");
                return;
            }
            if (groupMsg.getIsRevoked() == 1) {
                System.out.println("消息已撤回");
                return;
            }

            long now = System.currentTimeMillis();
            long postTime = groupMsg.getPostTime().getTime();
            long diff = (now - postTime) / 1000;
            if (diff > 120) {
                System.out.println("超过2分钟不能撤回");
                return;
            }

            groupMessageMapper.revokeGroupMessage(messageId);
            System.out.println("群聊消息已撤回");

            // 获取群成员
            List<Friend> members = groupChatMapper.getGroupMembers(sessionId);
            for (Friend member : members) {
                targetUserIds.add(member.getFriendId());
            }
        } else {
            // 私聊撤回
            Message message = messageMapper.getMessageById(messageId);
            if (message == null) {
                System.out.println("消息不存在");
                return;
            }
            if (message.getFromId() != fromUser.getUserId()) {
                System.out.println("只能撤回自己的消息");
                return;
            }
            if (message.getIsRevoked() == 1) {
                System.out.println("消息已撤回");
                return;
            }

            long now = System.currentTimeMillis();
            long postTime = message.getPostTime().getTime();
            long diff = (now - postTime) / 1000;
            if (diff > 120) {
                System.out.println("超过2分钟不能撤回");
                return;
            }

            messageMapper.revokeMessage(messageId);
            System.out.println("私聊消息已撤回");

            // 获取私聊对方
            List<Friend> friends = messageSessionMapper.getFriendsBySessionId(sessionId, fromUser.getUserId());
            targetUserIds.add(fromUser.getUserId());
            for (Friend friend : friends) {
                targetUserIds.add(friend.getFriendId());
            }
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("type", "revoke");
        resp.put("messageId", messageId);
        resp.put("sessionId", sessionId);
        resp.put("fromId", fromUser.getUserId());
        resp.put("fromName", fromUser.getUsername());
        resp.put("chatType", chatType);

        String respJson = objectMapper.writeValueAsString(resp);
        System.out.println("撤回响应JSON: " + respJson);

        for (int userId : targetUserIds) {
            WebSocketSession targetSession = onlineUserManager.getSession(userId);
            if (targetSession != null && targetSession.isOpen()) {
                targetSession.sendMessage(new TextMessage(respJson));
                System.out.println("撤回通知已发送给: userId=" + userId);
            }
        }
    }

    // 处理已读回执
    private void handleMarkRead(User user, Map<String, Object> req) throws IOException {
        int sessionId = (int) req.get("sessionId");
        System.out.println("已读回执: userId=" + user.getUserId() + ", sessionId=" + sessionId);

        messageMapper.markSessionMessagesAsRead(sessionId, user.getUserId());

        List<Friend> friends = messageSessionMapper.getFriendsBySessionId(sessionId, user.getUserId());
        Map<String, Object> resp = new HashMap<>();
        resp.put("type", "readReceipt");
        resp.put("sessionId", sessionId);
        resp.put("userId", user.getUserId());
        resp.put("userName", user.getUsername());

        String respJson = objectMapper.writeValueAsString(resp);

        for (Friend friend : friends) {
            WebSocketSession targetSession = onlineUserManager.getSession(friend.getFriendId());
            if (targetSession != null && targetSession.isOpen()) {
                targetSession.sendMessage(new TextMessage(respJson));
                System.out.println("已读回执已发送给: " + friend.getFriendName());
            }
        }
    }

    // 处理正在输入
    private void handleTyping(User user, Map<String, Object> req) throws IOException {
        int sessionId = (int) req.get("sessionId");

        List<Friend> friends = messageSessionMapper.getFriendsBySessionId(sessionId, user.getUserId());
        Map<String, Object> resp = new HashMap<>();
        resp.put("type", "typing");
        resp.put("sessionId", sessionId);
        resp.put("userId", user.getUserId());
        resp.put("userName", user.getUsername());

        String respJson = objectMapper.writeValueAsString(resp);

        for (Friend friend : friends) {
            WebSocketSession targetSession = onlineUserManager.getSession(friend.getFriendId());
            if (targetSession != null && targetSession.isOpen()) {
                targetSession.sendMessage(new TextMessage(respJson));
            }
        }
    }

    // 处理停止输入
    private void handleStopTyping(User user, Map<String, Object> req) throws IOException {
        int sessionId = (int) req.get("sessionId");

        List<Friend> friends = messageSessionMapper.getFriendsBySessionId(sessionId, user.getUserId());
        Map<String, Object> resp = new HashMap<>();
        resp.put("type", "stopTyping");
        resp.put("sessionId", sessionId);

        String respJson = objectMapper.writeValueAsString(resp);

        for (Friend friend : friends) {
            WebSocketSession targetSession = onlineUserManager.getSession(friend.getFriendId());
            if (targetSession != null && targetSession.isOpen()) {
                targetSession.sendMessage(new TextMessage(respJson));
            }
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.out.println("WebSocket 异常: " + exception.getMessage());
        exception.printStackTrace();
        try {
            Map<String, Object> attributes = session.getAttributes();
            User user = (User) attributes.get("user");
            if (user != null) {
                onlineUserManager.offline(user.getUserId());
                System.out.println("用户下线: " + user.getUsername());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("WebSocket 关闭: " + status);
        try {
            Map<String, Object> attributes = session.getAttributes();
            User user = (User) attributes.get("user");
            if (user != null) {
                onlineUserManager.offline(user.getUserId());
                System.out.println("用户下线: " + user.getUsername());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}