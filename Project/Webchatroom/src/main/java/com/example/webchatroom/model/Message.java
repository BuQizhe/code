package com.example.webchatroom.model;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class Message {
    private int messageId;
    private int fromId;
    private String fromName;
    private int sessionId;
    private String content;
    private Timestamp postTime;
    private int isRevoked;
    private int isRead;
    private String imageUrl;

    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
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
        if (isRevoked == 1) {
            return "对方撤回了一条消息";
        }
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getPostTime() {
        return postTime;
    }

    public void setPostTime(Timestamp postTime) {
        this.postTime = postTime;
    }

    public int getIsRevoked() {
        return isRevoked;
    }

    public void setIsRevoked(int isRevoked) {
        this.isRevoked = isRevoked;
    }

    public int getIsRead() {
        return isRead;
    }

    public void setIsRead(int isRead) {
        this.isRead = isRead;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPostTimeStr() {
        if (postTime == null) return "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(postTime);
    }

    public String getDisplayTime() {
        if (postTime == null) return "";
        java.util.Date date = new java.util.Date(postTime.getTime());
        java.util.Date now = new java.util.Date();
        java.util.Date today = new java.util.Date(now.getYear(), now.getMonth(), now.getDate());
        java.util.Date yesterday = new java.util.Date(today.getTime() - 24 * 3600 * 1000);

        if (date.after(today)) {
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
            return sdf.format(date);
        } else if (date.after(yesterday)) {
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
            return "昨天 " + sdf.format(date);
        } else {
            SimpleDateFormat sdf = new SimpleDateFormat("MM-dd HH:mm");
            return sdf.format(date);
        }
    }
}