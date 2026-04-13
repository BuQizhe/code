package com.example.webchatroom.api;

import com.example.webchatroom.model.User;
import com.example.webchatroom.mapper.UserMapper;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
public class UserAPI {

    @Resource
    private UserMapper userMapper;

    // 登录接口
    @PostMapping("/login")
    public Object login(String username, String password, HttpServletRequest req) {
        User user = userMapper.selectByName(username);
        if (user == null || !user.getPassword().equals(password)) {
            return new User();  // 登录失败，返回userId=0的用户
        }
        HttpSession session = req.getSession(true);
        session.setAttribute("user", user);
        return user;
    }

    // 注册接口
    @PostMapping("/register")
    public Object register(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        try {
            userMapper.insert(user);
        } catch (DuplicateKeyException e) {
            return new User();  // 用户名重复，返回空用户
        }
        return user;
    }

    // 获取当前登录用户信息
    @GetMapping("/userInfo")
    public Object getUserInfo(HttpServletRequest req) {
        HttpSession session = req.getSession(false);
        if (session == null) {
            return new User();
        }
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return new User();
        }
        user.setPassword("");  // 清空密码再返回
        return user;
    }
}