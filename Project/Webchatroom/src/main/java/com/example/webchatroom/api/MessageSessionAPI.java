package com.example.webchatroom.api;

import com.example.webchatroom.model.*;
import com.example.webchatroom.mapper.FriendMapper;
import com.example.webchatroom.mapper.MessageMapper;
import com.example.webchatroom.mapper.MessageSessionMapper;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class MessageSessionAPI {

    @Resource
    private MessageSessionMapper messageSessionMapper;

    @Resource
    private MessageMapper messageMapper;

    @Resource
    private FriendMapper friendMapper;

    // 获取会话列表
    @GetMapping("/sessionList")
    public Object getSessionList(HttpServletRequest req) {
        try {
            HttpSession session = req.getSession(false);
            if (session == null) {
                return new ArrayList<MessageSession>();
            }
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return new ArrayList<MessageSession>();
            }

            List<MessageSession> sessionList = new ArrayList<>();
            List<Integer> sessionIds = messageSessionMapper.getSessionIdsByUserId(user.getUserId());

            for (int sessionId : sessionIds) {
                MessageSession messageSession = new MessageSession();
                messageSession.setSessionId(sessionId);

                // 获取会话中的好友
                List<Friend> friends = messageSessionMapper.getFriendsBySessionId(sessionId, user.getUserId());
                messageSession.setFriends(friends);

                // 获取最后一条消息
                String lastMessage = messageSessionMapper.getLastMessageBySessionId(sessionId);
                messageSession.setLastMessage(lastMessage == null ? "" : lastMessage);

                sessionList.add(messageSession);
            }

            return sessionList;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<MessageSession>();
        }
    }

    // 创建新会话
    @PostMapping("/session")
    public Object createSession(int toUserId, HttpServletRequest req) {
        Map<String, Integer> result = new HashMap<>();
        try {
            HttpSession httpSession = req.getSession(false);
            if (httpSession == null) {
                return result;
            }
            User user = (User) httpSession.getAttribute("user");
            if (user == null) {
                return result;
            }

            // 检查是否已存在会话
            List<Integer> sessionIds = messageSessionMapper.getSessionIdsByUserId(user.getUserId());
            for (int sessionId : sessionIds) {
                List<Friend> friends = messageSessionMapper.getFriendsBySessionId(sessionId, user.getUserId());
                for (Friend friend : friends) {
                    if (friend.getFriendId() == toUserId) {
                        // 会话已存在，更新时间
                        messageSessionMapper.updateLastTime(sessionId);
                        result.put("sessionId", sessionId);
                        return result;
                    }
                }
            }

            // 创建新会话
            MessageSession messageSession = new MessageSession();
            messageSessionMapper.addMessageSession(messageSession);
            int sessionId = messageSession.getSessionId();

            // 添加会话成员
            MessageSessionUserItem item1 = new MessageSessionUserItem();
            item1.setSessionId(sessionId);
            item1.setUserId(user.getUserId());
            messageSessionMapper.addMessageSessionUser(item1);

            MessageSessionUserItem item2 = new MessageSessionUserItem();
            item2.setSessionId(sessionId);
            item2.setUserId(toUserId);
            messageSessionMapper.addMessageSessionUser(item2);

            result.put("sessionId", sessionId);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return result;
        }
    }
}