package com.example.webchatroom.model;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class GroupMessage {
    private int messageId;
    private int fromId;
    private String fromName;
    private int groupId;
    private String content;
    private String imageUrl;
    private Timestamp postTime;
    private int isRevoked;

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

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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

    public String getPostTimeStr() {
        if (postTime == null) return "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(postTime);
    }
}