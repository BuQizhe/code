package com.example.webchatroom.mapper;

import com.example.webchatroom.model.Friend;
import com.example.webchatroom.model.GroupChat;
import com.example.webchatroom.model.GroupMember;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface GroupChatMapper {

    // 获取用户的所有群聊
    List<GroupChat> getUserGroups(@Param("userId") int userId);

    // 获取群成员
    List<Friend> getGroupMembers(@Param("groupId") int groupId);

    // 创建群聊
    void createGroup(GroupChat group);

    // 添加群成员
    void addGroupMember(@Param("groupId") int groupId, @Param("userId") int userId);

    // 检查是否是群成员
    int isGroupMember(@Param("groupId") int groupId, @Param("userId") int userId);

    // 获取群聊最后一条消息
    String getGroupLastMessage(@Param("groupId") int groupId);
}