package com.example.webchatroom.model;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class MessageResponse {
    private String type;
    private int fromId;
    private String fromName;
    private int sessionId;
    private String content;
    private String postTime;
    private int messageId;  // 新增：消息ID，用于撤回
    private int isRevoked;  // 新增：是否已撤回

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getFromId() {
        return fromId;
    }

    public void setFromId(int fromId) {
        this.fromId = fromId;
    }

    public String getFromName() {
        return fromName;
    }

    public void setFromName(String fromName) {
        this.fromName = fromName;
    }

    public int getSessionId() {
        return sessionId;
    }

    public void setSessionId(int sessionId) {
        this.sessionId = sessionId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPostTime() {
        return postTime;
    }

    public void setPostTime(String postTime) {
        this.postTime = postTime;
    }

    public void setPostTime(Timestamp postTime) {
        if (postTime != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            this.postTime = sdf.format(postTime);
        }
    }

    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
    }

    public int getIsRevoked() {
        return isRevoked;
    }

    public void setIsRevoked(int isRevoked) {
        this.isRevoked = isRevoked;
    }
}