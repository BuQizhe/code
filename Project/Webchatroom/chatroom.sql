-- 创建数据库
create database if not exists java_chatroom charset utf8mb4;

use java_chatroom;

-- 用户表
drop table if exists user;
create table user (
                      userId int primary key auto_increment,
                      username varchar(20) unique,
                      password varchar(20)
);

-- 好友表
drop table if exists friend;
create table friend (
                        userId int,
                        friendId int
);

-- 好友请求表
drop table if exists add_friend_request;
create table add_friend_request (
                                    id int primary key auto_increment,
                                    fromUserId int,
                                    toUserId int,
                                    reason varchar(200),
                                    status varchar(20) default 'pending',
                                    createTime datetime default now()
);

-- 会话表
drop table if exists message_session;
create table message_session (
                                 sessionId int primary key auto_increment,
                                 lastTime datetime default now()
);

-- 会话用户关联表
drop table if exists message_session_user;
create table message_session_user (
                                      sessionId int,
                                      userId int
);

-- 私聊消息表
drop table if exists message;
create table message (
                         messageId int primary key auto_increment,
                         fromId int,
                         sessionId int,
                         content varchar(2048),
                         imageUrl varchar(500),
                         postTime datetime,
                         isRevoked int default 0,
                         isRead int default 0
);

-- 群聊表
drop table if exists group_chat;
create table group_chat (
                            groupId int primary key auto_increment,
                            groupName varchar(50),
                            ownerId int,
                            createTime datetime default now()
);

-- 群成员表
drop table if exists group_member;
create table group_member (
                              groupId int,
                              userId int,
                              joinTime datetime default now()
);

-- 群聊消息表
drop table if exists group_message;
create table group_message (
                               messageId int primary key auto_increment,
                               fromId int,
                               groupId int,
                               content varchar(2048),
                               imageUrl varchar(500),
                               postTime datetime,
                               isRevoked int default 0
);

-- 插入测试用户
insert into user values(1, 'zhangsan', '123');
insert into user values(2, 'lisi', '123');
insert into user values(3, 'wangwu', '123');

-- 添加好友关系
insert into friend values(1, 2);
insert into friend values(1, 3);
insert into friend values(2, 1);
insert into friend values(3, 1);
insert into friend values(2, 3);
insert into friend values(3, 2);