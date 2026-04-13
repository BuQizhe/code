package com.example.webchatroom.api;

import com.example.webchatroom.model.GroupChat;
import com.example.webchatroom.model.User;
import com.example.webchatroom.mapper.GroupChatMapper;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class GroupChatAPI {

    @Resource
    private GroupChatMapper groupChatMapper;

    // 获取用户群聊列表
    @GetMapping("/groupList")
    public Object getGroupList(HttpServletRequest req) {
        try {
            HttpSession session = req.getSession(false);
            if (session == null) return new ArrayList<GroupChat>();
            User user = (User) session.getAttribute("user");
            if (user == null) return new ArrayList<GroupChat>();
            return groupChatMapper.getUserGroups(user.getUserId());
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<GroupChat>();
        }
    }

    // 创建群聊
    @PostMapping("/createGroup")
    public Object createGroup(String groupName, @RequestParam List<Integer> memberIds, HttpServletRequest req) {
        Map<String, Object> result = new HashMap<>();
        try {
            HttpSession session = req.getSession(false);
            if (session == null) {
                result.put("success", false);
                return result;
            }
            User user = (User) session.getAttribute("user");
            if (user == null) {
                result.put("success", false);
                return result;
            }

            GroupChat group = new GroupChat();
            group.setGroupName(groupName);
            group.setOwnerId(user.getUserId());
            groupChatMapper.createGroup(group);

            // 添加群成员
            groupChatMapper.addGroupMember(group.getGroupId(), user.getUserId());
            for (int memberId : memberIds) {
                groupChatMapper.addGroupMember(group.getGroupId(), memberId);
            }

            result.put("success", true);
            result.put("groupId", group.getGroupId());
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
        }
        return result;
    }
}