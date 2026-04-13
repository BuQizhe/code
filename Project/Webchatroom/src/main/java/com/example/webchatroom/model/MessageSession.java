package com.example.webchatroom.model;

import java.util.List;

public class MessageSession {
    private int sessionId;
    private List<Friend> friends;
    private String lastMessage;
    private String lastTime;

    public int getSessionId() {
        return sessionId;
    }

    public void setSessionId(int sessionId) {
        this.sessionId = sessionId;
    }

    public List<Friend> getFriends() {
        return friends;
    }

    public void setFriends(List<Friend> friends) {
        this.friends = friends;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public String getLastTime() {
        return lastTime;
    }

    public void setLastTime(String lastTime) {
        this.lastTime = lastTime;
    }
}