package com.example.webchatroom.mapper;

import com.example.webchatroom.model.Friend;
import com.example.webchatroom.model.MessageSession;
import com.example.webchatroom.model.MessageSessionUserItem;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface MessageSessionMapper {

    // 获取用户的所有会话ID（按最后访问时间降序）
    List<Integer> getSessionIdsByUserId(int userId);

    // 获取会话中的好友（排除自己）
    List<Friend> getFriendsBySessionId(int sessionId, int selfUserId);

    // 获取会话的最后一条消息
    String getLastMessageBySessionId(int sessionId);

    // 创建新会话
    int addMessageSession(MessageSession messageSession);

    // 添加会话用户关联
    void addMessageSessionUser(MessageSessionUserItem item);

    // 更新会话最后访问时间
    void updateLastTime(int sessionId);
}