package com.example.webchatroom.mapper;

import com.example.webchatroom.model.GroupMessage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface GroupMessageMapper {

    // 获取群聊历史消息
    List<GroupMessage> getGroupMessages(@Param("groupId") int groupId);

    // 保存群聊消息
    void addGroupMessage(GroupMessage message);

    // 撤回群聊消息
    void revokeGroupMessage(@Param("messageId") int messageId);

    // 获取消息详情
    GroupMessage getGroupMessageById(@Param("messageId") int messageId);
}