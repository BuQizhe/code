package com.example.webchatroom.api;

import com.example.webchatroom.model.GroupMessage;
import com.example.webchatroom.model.Message;
import com.example.webchatroom.model.User;
import com.example.webchatroom.mapper.GroupMessageMapper;
import com.example.webchatroom.mapper.MessageMapper;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@RestController
public class MessageAPI {

    @Resource
    private MessageMapper messageMapper;

    @Resource
    private GroupMessageMapper groupMessageMapper;

    // 获取历史消息（支持私聊和群聊）
    @GetMapping("/getMessages")
    public Object getMessages(Integer sessionId, String type) {
        if (sessionId == null) {
            return new ArrayList<>();
        }
        // type: group 表示群聊，friend 或不传表示私聊
        if ("group".equals(type)) {
            return groupMessageMapper.getGroupMessages(sessionId);
        } else {
            return messageMapper.getMessagesBySessionId(sessionId);
        }
    }

    // 搜索私聊消息
    @GetMapping("/searchMessages")
    public Object searchMessages(String keyword, HttpServletRequest req) {
        try {
            HttpSession session = req.getSession(false);
            if (session == null) {
                return new ArrayList<Message>();
            }
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return new ArrayList<Message>();
            }
            if (keyword == null || keyword.trim().isEmpty()) {
                return new ArrayList<Message>();
            }
            System.out.println("搜索消息: keyword=" + keyword + ", userId=" + user.getUserId());
            return messageMapper.searchMessages(user.getUserId(), keyword);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<Message>();
        }
    }
}