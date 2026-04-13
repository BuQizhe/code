package com.example.webchatroom.mapper;

import com.example.webchatroom.model.AddFriendRequest;
import com.example.webchatroom.model.Friend;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface FriendMapper {

    // 查询好友列表
    List<Friend> selectFriendList(int userId);

    // 搜索好友
    List<Friend> findFriend(@Param("selfUserId") int selfUserId, @Param("friendName") String friendName);

    // 发送好友请求
    void addFriendRequest(@Param("fromUserId") int fromUserId, @Param("toUserId") int toUserId, @Param("reason") String reason);

    // 检查是否已发送过好友请求
    AddFriendRequest checkFriendRequest(@Param("fromUserId") int fromUserId, @Param("toUserId") int toUserId);

    // 获取待处理的好友请求列表
    List<AddFriendRequest> getPendingFriendRequests(int toUserId);

    // 接受好友请求
    void acceptFriendRequest(@Param("fromUserId") int fromUserId, @Param("toUserId") int toUserId);

    // 拒绝好友请求
    void rejectFriendRequest(@Param("fromUserId") int fromUserId, @Param("toUserId") int toUserId);

    // 添加好友关系（双向）
    void addFriendRelation(@Param("userId") int userId, @Param("friendId") int friendId);

    // 检查是否已经是好友
    int isFriend(@Param("userId") int userId, @Param("friendId") int friendId);
}