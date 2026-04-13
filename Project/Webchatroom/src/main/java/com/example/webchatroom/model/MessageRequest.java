package com.example.webchatroom.model;

public class MessageRequest {
    private String type;
    private int sessionId;
    private String content;
    private int messageId;  // 新增：用于撤回消息

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
    }
}