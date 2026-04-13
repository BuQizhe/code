package com.example.webchatroom.config;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class OnlineUserManager {

    private ConcurrentHashMap<Integer, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public void online(int userId, WebSocketSession session) {
        sessions.put(userId, session);
        System.out.println("用户上线: " + userId + "，当前在线人数: " + sessions.size());
        System.out.println("当前在线用户: " + sessions.keySet());
    }

    public void offline(int userId) {
        sessions.remove(userId);
        System.out.println("用户下线: " + userId + "，当前在线人数: " + sessions.size());
    }

    public WebSocketSession getSession(int userId) {
        WebSocketSession session = sessions.get(userId);
        System.out.println("获取用户会话: userId=" + userId + ", session=" + (session != null ? "存在" : "不存在"));
        return session;
    }

    public boolean isOnline(int userId) {
        return sessions.containsKey(userId);
    }

    public int getOnlineCount() {
        return sessions.size();
    }
}