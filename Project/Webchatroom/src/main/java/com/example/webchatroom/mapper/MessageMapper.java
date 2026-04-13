package com.example.webchatroom.mapper;

import com.example.webchatroom.model.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface MessageMapper {

    // 获取私聊会话的历史消息
    List<Message> getMessagesBySessionId(@Param("sessionId") int sessionId);

    // 获取群聊会话的历史消息
    List<Message> getGroupMessages(@Param("groupId") int groupId);

    // 保存消息
    void add(Message message);

    // 撤回消息
    void revokeMessage(@Param("messageId") int messageId);

    // 获取消息详情
    Message getMessageById(@Param("messageId") int messageId);

    // 标记消息为已读
    void markMessageAsRead(@Param("messageId") int messageId);

    // 标记会话中的所有消息为已读
    void markSessionMessagesAsRead(@Param("sessionId") int sessionId, @Param("userId") int userId);

    // 获取会话中未读消息数量
    int getUnreadCount(@Param("sessionId") int sessionId, @Param("userId") int userId);

    // 搜索消息
    List<Message> searchMessages(@Param("userId") int userId, @Param("keyword") String keyword);
}