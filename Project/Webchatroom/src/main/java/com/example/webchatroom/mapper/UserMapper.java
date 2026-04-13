package com.example.webchatroom.mapper;

import com.example.webchatroom.model.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    User selectByName(String username);
    int insert(User user);
}