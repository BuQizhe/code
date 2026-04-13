// 全局变量
let currentSessionId = null;
let currentFriendId = null;
let currentChatType = 'friend'; // 'friend' or 'group'
let websocket = null;
let unreadCounts = {};
let messageElements = {};
let typingTimeout = null;
let isSearchMode = false;

// 页面加载时执行
$(document).ready(function() {
    getUserInfo();
    getFriendList();
    getSessionList();
    getGroupList();
    getFriendRequests();
    initTabSwitch();
    initSearchFriend();
    initSendMessage();
    initWebSocket();
    initAutoResize();
    initEmoji();
    initLogout();
    initTheme();
    initCreateGroup();
    initSearchMessage();
});

// 获取头像字母
function getAvatarLetter(name) {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
}

// 格式化消息时间
function formatMessageTime(timestamp) {
    if (!timestamp) return '';
    let date = new Date(timestamp);
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let yesterday = new Date(today - 24 * 3600 * 1000);

    if (date >= today) {
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        return hours + ':' + minutes;
    } else if (date >= yesterday) {
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        return '昨天 ' + hours + ':' + minutes;
    } else {
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        return month + '-' + day + ' ' + hours + ':' + minutes;
    }
}

// 提示消息
function showToast(msg, type) {
    let bgColor = type === 'error' ? '#f44336' : (type === 'success' ? '#4caf50' : '#2196f3');
    let toast = $(`<div style="position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:${bgColor}; color:white; padding:10px 20px; border-radius:8px; z-index:1002; font-size:14px;">${msg}</div>`);
    $('body').append(toast);
    setTimeout(function() {
        toast.fadeOut(300, function() { $(this).remove(); });
    }, 2000);
}

// 1. 获取用户信息
function getUserInfo() {
    $.ajax({
        url: '/userInfo',
        method: 'get',
        success: function(user) {
            if (user && user.userId > 0) {
                $('#userName').text(user.username);
                $('#userId').text('ID: ' + user.userId);
                $('#userAvatar').text(getAvatarLetter(user.username));
                $('#userInfo').attr('data-user-id', user.userId);
                if (!websocket || websocket.readyState !== WebSocket.OPEN) {
                    initWebSocket();
                }
            } else {
                alert('请先登录');
                location.href = '/login.html';
            }
        },
        error: function() {
            alert('获取用户信息失败');
            location.href = '/login.html';
        }
    });
}

// 2. 获取好友列表
function getFriendList() {
    $.ajax({
        url: '/friendList',
        method: 'get',
        success: function(friends) {
            let $friendList = $('#friendList');
            $friendList.empty();
            if (friends.length === 0) {
                $friendList.html('<li style="color:#888; text-align:center; padding:20px;">暂无好友</li>');
                return;
            }
            for (let friend of friends) {
                let $li = $('<li>')
                    .addClass('friend-item')
                    .attr('data-friend-id', friend.friendId)
                    .attr('data-friend-name', friend.friendName)
                    .html(`
                        <div class="friend-avatar">${getAvatarLetter(friend.friendName)}</div>
                        <div class="friend-name">${escapeHtml(friend.friendName)}</div>
                    `)
                    .click(function() {
                        clickFriend(friend.friendId, friend.friendName);
                    });
                $friendList.append($li);
            }
        },
        error: function() {
            console.log('获取好友列表失败');
        }
    });
}

// 3. 获取群聊列表
function getGroupList() {
    $.ajax({
        url: '/groupList',
        method: 'get',
        success: function(groups) {
            let $groupList = $('#groupList');
            $groupList.empty();
            if (groups.length === 0) {
                $groupList.html('<li style="color:#888; text-align:center; padding:20px;">暂无群聊</li>');
                return;
            }
            for (let group of groups) {
                let lastMsg = group.lastMessage || '';
                if (lastMsg.length > 25) {
                    lastMsg = lastMsg.substring(0, 25) + '...';
                }
                let unreadCount = unreadCounts['g_' + group.groupId] || 0;
                let unreadBadge = unreadCount > 0 ? `<span class="unread-badge">${unreadCount > 99 ? '99+' : unreadCount}</span>` : '';

                let $li = $('<li>')
                    .attr('data-group-id', group.groupId)
                    .attr('data-group-name', group.groupName)
                    .html(`
                        <div class="session-item">
                            <div class="session-avatar group">${getAvatarLetter(group.groupName)}</div>
                            <div class="session-info">
                                <div class="session-name">${escapeHtml(group.groupName)}</div>
                                <div class="session-preview">${escapeHtml(lastMsg)}</div>
                            </div>
                            ${unreadBadge}
                        </div>
                    `)
                    .click(function() {
                        clickGroup(group.groupId, group.groupName);
                    });
                $groupList.append($li);
            }
        },
        error: function() {
            console.log('获取群聊列表失败');
        }
    });
}

// 4. 获取待处理的好友请求
function getFriendRequests() {
    $.ajax({
        url: '/getFriendRequests',
        method: 'get',
        success: function(requests) {
            if (requests.length > 0) {
                for (let req of requests) {
                    showFriendRequestDialog(req);
                }
            }
        },
        error: function() {
            console.log('获取好友请求失败');
        }
    });
}

// 微信风格好友申请弹窗
function showFriendRequestDialog(req) {
    $('.friend-request-modal').remove();

    let reasonHtml = req.reason ? `<div class="friend-request-reason"><span>验证消息：</span>${escapeHtml(req.reason)}</div>` : '';

    let modal = $(`
        <div class="friend-request-modal">
            <div class="friend-request-card">
                <div class="friend-request-header">
                    <div class="friend-request-avatar">${getAvatarLetter(req.fromUserName)}</div>
                    <div class="friend-request-name">${escapeHtml(req.fromUserName)}</div>
                    ${reasonHtml}
                </div>
                <div class="friend-request-footer">
                    <button class="accept-btn">接受</button>
                    <button class="reject-btn">拒绝</button>
                </div>
            </div>
        </div>
    `);

    $('body').append(modal);

    modal.find('.accept-btn').click(function() {
        acceptFriendRequest(req.fromUserId);
        modal.remove();
    });

    modal.find('.reject-btn').click(function() {
        rejectFriendRequest(req.fromUserId);
        modal.remove();
    });
}

// 接受好友请求
function acceptFriendRequest(fromUserId) {
    $.ajax({
        url: '/acceptFriendRequest',
        method: 'post',
        data: { fromUserId: fromUserId },
        success: function(resp) {
            if (resp.success) {
                showToast('已添加好友', 'success');
                getFriendList();
                getSessionList();
            }
        },
        error: function() {
            showToast('操作失败', 'error');
        }
    });
}

// 拒绝好友请求
function rejectFriendRequest(fromUserId) {
    $.ajax({
        url: '/rejectFriendRequest',
        method: 'post',
        data: { fromUserId: fromUserId },
        success: function(resp) {
            if (resp.success) {
                showToast('已拒绝', 'info');
            }
        },
        error: function() {
            showToast('操作失败', 'error');
        }
    });
}

// 5. 获取私聊会话列表
function getSessionList() {
    $.ajax({
        url: '/sessionList',
        method: 'get',
        success: function(sessions) {
            let $sessionList = $('#sessionList');
            $sessionList.empty();
            if (sessions.length === 0) {
                $sessionList.html('<li style="color:#888; text-align:center; padding:20px;">暂无会话</li>');
                return;
            }

            let stickySessions = JSON.parse(localStorage.getItem('stickySessions') || '[]');

            sessions.sort((a, b) => {
                let aSticky = stickySessions.includes(parseInt(a.sessionId));
                let bSticky = stickySessions.includes(parseInt(b.sessionId));
                if (aSticky && !bSticky) return -1;
                if (!aSticky && bSticky) return 1;
                return 0;
            });

            for (let session of sessions) {
                let friendName = session.friends && session.friends[0] ? session.friends[0].friendName : '未知';
                let lastMsg = session.lastMessage || '';
                if (lastMsg.length > 25) {
                    lastMsg = lastMsg.substring(0, 25) + '...';
                }
                let unreadCount = unreadCounts[session.sessionId] || 0;
                let unreadBadge = unreadCount > 0 ? `<span class="unread-badge">${unreadCount > 99 ? '99+' : unreadCount}</span>` : '';
                let isSticky = stickySessions.includes(parseInt(session.sessionId));
                let stickyClass = isSticky ? 'sticky' : '';

                let $li = $('<li>')
                    .attr('data-session-id', session.sessionId)
                    .attr('data-friend-name', friendName)
                    .attr('data-type', 'friend')
                    .html(`
                        <div class="session-item ${stickyClass}">
                            <div class="session-avatar">${getAvatarLetter(friendName)}</div>
                            <div class="session-info">
                                <div class="session-name">${escapeHtml(friendName)}</div>
                                <div class="session-preview">${escapeHtml(lastMsg)}</div>
                            </div>
                            ${unreadBadge}
                            <div class="session-actions">
                                <button class="session-action-btn sticky-btn" title="${isSticky ? '取消置顶' : '置顶'}">📌</button>
                                <button class="session-action-btn delete-btn" title="删除">🗑️</button>
                            </div>
                        </div>
                    `)
                    .click(function(e) {
                        if (!$(e.target).closest('.session-actions').length) {
                            clickSession($(this));
                        }
                    });

                $li.find('.sticky-btn').click(function(e) {
                    e.stopPropagation();
                    if (isSticky) {
                        unstickySession(session.sessionId);
                    } else {
                        stickySession(session.sessionId);
                    }
                });

                $li.find('.delete-btn').click(function(e) {
                    e.stopPropagation();
                    deleteSession(session.sessionId);
                });

                $sessionList.append($li);
            }
        },
        error: function() {
            console.log('获取会话列表失败');
        }
    });
}

// 置顶会话
function stickySession(sessionId) {
    let stickySessions = JSON.parse(localStorage.getItem('stickySessions') || '[]');
    if (!stickySessions.includes(sessionId)) {
        stickySessions.push(sessionId);
        localStorage.setItem('stickySessions', JSON.stringify(stickySessions));
    }
    getSessionList();
    showToast('已置顶', 'success');
}

// 取消置顶
function unstickySession(sessionId) {
    let stickySessions = JSON.parse(localStorage.getItem('stickySessions') || '[]');
    stickySessions = stickySessions.filter(id => id != sessionId);
    localStorage.setItem('stickySessions', JSON.stringify(stickySessions));
    getSessionList();
    showToast('已取消置顶', 'info');
}

// 删除会话
function deleteSession(sessionId) {
    if (confirm('确定要删除这个会话吗？')) {
        if (currentSessionId == sessionId) {
            currentSessionId = null;
            $('#chatTitle').text('请选择会话');
            $('#messageShow').html('<div style="text-align:center; color:#999; padding:50px;">暂无消息，选择一个会话开始聊天</div>');
        }
        let stickySessions = JSON.parse(localStorage.getItem('stickySessions') || '[]');
        stickySessions = stickySessions.filter(id => id != sessionId);
        localStorage.setItem('stickySessions', JSON.stringify(stickySessions));
        getSessionList();
        showToast('会话已删除', 'success');
    }
}

// 6. 点击私聊会话
function clickSession($li) {
    $('#sessionList li').removeClass('selected');
    $li.addClass('selected');

    let sessionId = $li.attr('data-session-id');
    let friendName = $li.attr('data-friend-name');

    if (unreadCounts[sessionId]) {
        delete unreadCounts[sessionId];
        let badge = $li.find('.unread-badge');
        if (badge.length > 0) {
            badge.remove();
        }
    }

    currentSessionId = sessionId;
    currentChatType = 'friend';
    $('#chatTitle').text(friendName);

    // 发送已读回执
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        let message = {
            type: 'markRead',
            sessionId: parseInt(currentSessionId)
        };
        websocket.send(JSON.stringify(message));
    }

    if (currentSessionId) {
        getHistoryMessages(currentSessionId);
    }
}

// 7. 点击群聊
function clickGroup(groupId, groupName) {
    $('#groupList li').removeClass('selected');
    $('li[data-group-id="' + groupId + '"]').addClass('selected');

    if (unreadCounts['g_' + groupId]) {
        delete unreadCounts['g_' + groupId];
        let badge = $('li[data-group-id="' + groupId + '"]').find('.unread-badge');
        if (badge.length > 0) {
            badge.remove();
        }
    }

    currentSessionId = groupId;
    currentChatType = 'group';
    $('#chatTitle').text(groupName);

    if (currentSessionId) {
        getHistoryMessages(currentSessionId);
    }
}

// 8. 获取历史消息
function getHistoryMessages(sessionId) {
    let type = currentChatType;
    $.ajax({
        url: '/getMessages',
        method: 'get',
        data: { sessionId: sessionId, type: type },
        success: function(messages) {
            let $messageShow = $('#messageShow');
            $messageShow.empty();
            messageElements = {};
            let selfUsername = $('#userName').text();
            for (let msg of messages) {
                addMessage(msg, selfUsername);
            }
            $messageShow.scrollTop($messageShow[0].scrollHeight);
        },
        error: function() {
            console.log('获取历史消息失败');
        }
    });
}

// 9. 添加消息到界面
function addMessage(msg, selfUsername) {
    let $messageShow = $('#messageShow');
    let $messageDiv = $('<div>').addClass('message').attr('data-message-id', msg.messageId);
    let isSelf = (msg.fromName === selfUsername);
    $messageDiv.addClass(isSelf ? 'message-right' : 'message-left');

    let time = formatMessageTime(msg.postTime);
    let contentHtml = '';

    if (msg.isRevoked === 1) {
        contentHtml = '<span style="color:#999; font-style:italic;">' + (isSelf ? '你' : msg.fromName) + ' 撤回了一条消息</span>';
    }
    else if (msg.imageUrl && msg.imageUrl !== 'null' && msg.imageUrl !== '') {
        contentHtml = `<img src="${msg.imageUrl}" class="image-message" onclick="window.open('${msg.imageUrl}')" onerror="this.style.display='none'">`;
    }
    else if (msg.content) {
        contentHtml = escapeHtml(msg.content);
    }

    let revokeBtn = '';
    if (isSelf && msg.isRevoked !== 1) {
        revokeBtn = `<button class="revoke-btn" data-message-id="${msg.messageId}">撤回</button>`;
    }

    let readStatus = '';
    if (!isSelf && msg.isRead === 1) {
        readStatus = '<span class="read-status read">已读</span>';
    } else if (!isSelf && msg.isRead === 0) {
        readStatus = '<span class="read-status">未读</span>';
    }

    $messageDiv.html(
        '<div class="box">' +
        '<h4>' + escapeHtml(msg.fromName) + ' | ' + time + revokeBtn + readStatus + '</h4>' +
        '<p>' + contentHtml + '</p>' +
        '</div>'
    );
    $messageShow.append($messageDiv);

    if (msg.messageId) {
        messageElements[msg.messageId] = $messageDiv;
    }

    if (revokeBtn) {
        $messageDiv.find('.revoke-btn').off('click').on('click', function() {
            let messageId = $(this).data('message-id');
            revokeMessage(messageId);
        });
    }
}

// 10. 撤回消息
function revokeMessage(messageId) {
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
        alert('WebSocket未连接');
        return;
    }

    let message = {
        type: 'revoke',
        sessionId: parseInt(currentSessionId),
        messageId: messageId,
        chatType: currentChatType
    };
    websocket.send(JSON.stringify(message));
    console.log('撤回请求已发送, messageId=' + messageId);

    let $messageDiv = messageElements[messageId];
    if ($messageDiv && $messageDiv.length > 0) {
        let isSelf = $messageDiv.hasClass('message-right');
        $messageDiv.find('p').html('<span style="color:#999; font-style:italic;">' + (isSelf ? '你' : '对方') + ' 撤回了一条消息</span>');
        $messageDiv.find('.revoke-btn').remove();
    }

    if (currentChatType === 'friend') {
        let $sessionLi = findSessionById(currentSessionId);
        if ($sessionLi && $sessionLi.length > 0) {
            $sessionLi.find('.session-preview').text('[撤回了一条消息]');
        }
    } else {
        let $groupLi = $(`li[data-group-id="${currentSessionId}"]`);
        if ($groupLi.length > 0) {
            $groupLi.find('.session-preview').text('[撤回了一条消息]');
        }
    }
}

// 11. 处理撤回消息
function handleRevokeMessage(resp) {
    console.log('收到撤回通知:', resp);

    let $messageDiv = messageElements[resp.messageId];
    if ($messageDiv && $messageDiv.length > 0) {
        let isSelf = $messageDiv.hasClass('message-right');
        $messageDiv.find('p').html('<span style="color:#999; font-style:italic;">' + (isSelf ? '你' : resp.fromName) + ' 撤回了一条消息</span>');
        $messageDiv.find('.revoke-btn').remove();
    }

    if (currentChatType === 'friend') {
        let $sessionLi = findSessionById(resp.sessionId);
        if ($sessionLi && $sessionLi.length > 0) {
            $sessionLi.find('.session-preview').text('[撤回了一条消息]');
        }
    } else {
        let $groupLi = $(`li[data-group-id="${resp.sessionId}"]`);
        if ($groupLi.length > 0) {
            $groupLi.find('.session-preview').text('[撤回了一条消息]');
        }
    }
}

// 12. 点击好友
function clickFriend(friendId, friendName) {
    $.ajax({
        url: '/isFriend',
        method: 'get',
        data: { friendId: friendId },
        async: false,
        success: function(resp) {
            if (!resp.isFriend) {
                alert('请先添加对方为好友');
                return;
            }
        }
    });

    let $existingSession = null;
    $('#sessionList li').each(function() {
        if ($(this).attr('data-friend-name') === friendName) {
            $existingSession = $(this);
            return false;
        }
    });

    if ($existingSession) {
        $('#sessionList').prepend($existingSession);
        $existingSession.click();
    } else {
        let $newSession = $('<li>')
            .attr('data-friend-name', friendName)
            .attr('data-type', 'friend')
            .html(`
                <div class="session-item">
                    <div class="session-avatar">${getAvatarLetter(friendName)}</div>
                    <div class="session-info">
                        <div class="session-name">${escapeHtml(friendName)}</div>
                        <div class="session-preview"></div>
                    </div>
                </div>
            `);
        $('#sessionList').prepend($newSession);
        createSession(friendId, $newSession);
        $newSession.click();
    }
    $('#tabSession').click();
}

// 13. 创建私聊会话
function createSession(friendId, $sessionLi) {
    $.ajax({
        url: '/session',
        method: 'post',
        data: { toUserId: friendId },
        success: function(resp) {
            if (resp && resp.sessionId) {
                $sessionLi.attr('data-session-id', resp.sessionId);
            }
        },
        error: function() {
            console.log('创建会话失败');
        }
    });
}

// 14. 切换标签页
function initTabSwitch() {
    $('#tabSession').click(function() {
        $(this).addClass('active');
        $('#tabGroup').removeClass('active');
        $('#tabFriend').removeClass('active');
        $('#sessionList').removeClass('hide');
        $('#groupList').addClass('hide');
        $('#friendList').addClass('hide');
    });

    $('#tabGroup').click(function() {
        $(this).addClass('active');
        $('#tabSession').removeClass('active');
        $('#tabFriend').removeClass('active');
        $('#groupList').removeClass('hide');
        $('#sessionList').addClass('hide');
        $('#friendList').addClass('hide');
        getGroupList();
    });

    $('#tabFriend').click(function() {
        $(this).addClass('active');
        $('#tabSession').removeClass('active');
        $('#tabGroup').removeClass('active');
        $('#friendList').removeClass('hide');
        $('#sessionList').addClass('hide');
        $('#groupList').addClass('hide');
        getFriendList();
    });
}

// 15. 搜索好友
function initSearchFriend() {
    $('#searchBtn').click(function() {
        let keyword = $('#searchInput').val().trim();
        if (!keyword) {
            alert('请输入搜索关键词');
            return;
        }

        $.ajax({
            url: '/findFriend',
            method: 'get',
            data: { name: keyword },
            success: function(users) {
                if (users.length === 0) {
                    alert('未找到匹配的用户');
                    return;
                }
                showSearchResult(users);
            },
            error: function() {
                alert('搜索失败');
            }
        });
    });
}

// 16. 显示搜索结果
function showSearchResult(users) {
    $('#chatTitle').text('搜索结果');
    let $messageShow = $('#messageShow');
    $messageShow.empty();

    for (let user of users) {
        let randomId = 'reason_' + Date.now() + '_' + user.friendId;
        $messageShow.append(`
            <div class="message" style="display:flex; align-items:center; width:100%; padding:10px; border-bottom:1px solid #eee;">
                <div class="friend-avatar" style="width:45px; height:45px; margin-right:12px;">${getAvatarLetter(user.friendName)}</div>
                <span style="width:100px; font-size:14px;">${escapeHtml(user.friendName)}</span>
                <input type="text" id="${randomId}" placeholder="验证消息" style="width:180px; margin:0 10px; padding:8px; border:1px solid #ddd; border-radius:5px;">
                <button onclick="sendFriendRequest(${user.friendId}, '${escapeHtml(user.friendName)}', '${randomId}')" style="padding:8px 15px; cursor:pointer; background:#4caf50; color:white; border:none; border-radius:5px;">添加好友</button>
            </div>
        `);
    }
}

// 17. 发送好友请求
function sendFriendRequest(friendId, friendName, inputId) {
    let reason = $('#' + inputId).val();
    $.ajax({
        url: '/sendFriendRequest',
        method: 'post',
        data: { toUserId: friendId, reason: reason || '' },
        success: function(resp) {
            if (resp.success) {
                showToast('已向 ' + friendName + ' 发送好友申请', 'success');
            } else {
                showToast(resp.message || '发送失败', 'error');
            }
        },
        error: function() {
            showToast('发送失败', 'error');
        }
    });
}

// 18. 发送文本消息
function sendMessage() {
    if (!currentSessionId) {
        alert('请先选择一个会话');
        return false;
    }
    let content = $('#messageInput').val().trim();
    if (!content) {
        alert('请输入消息内容');
        return false;
    }

    if (websocket && websocket.readyState === WebSocket.OPEN) {
        let message = {
            type: 'message',
            sessionId: parseInt(currentSessionId),
            content: content,
            chatType: currentChatType
        };
        websocket.send(JSON.stringify(message));
        $('#messageInput').val('');
        $('#messageInput').css('height', 'auto');
        console.log('消息已发送:', message);
        return true;
    } else {
        alert('WebSocket连接未建立');
        return false;
    }
}

// 发送图片消息
function sendImageMessage(file) {
    if (!currentSessionId) {
        alert('请先选择一个会话');
        return;
    }

    let formData = new FormData();
    formData.append('image', file);
    formData.append('sessionId', currentSessionId);

    $.ajax({
        url: '/uploadImage',
        method: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(resp) {
            if (resp.success) {
                let message = {
                    type: 'message',
                    sessionId: parseInt(currentSessionId),
                    content: '',
                    imageUrl: resp.imageUrl,
                    chatType: currentChatType
                };
                websocket.send(JSON.stringify(message));
                showToast('图片发送成功', 'success');
            } else {
                showToast('图片上传失败: ' + (resp.message || '未知错误'), 'error');
            }
        },
        error: function(xhr) {
            console.log('上传错误:', xhr);
            showToast('图片上传失败', 'error');
        }
    });
}

// 19. 输入框自适应
function initAutoResize() {
    $('#messageInput').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';

        // 正在输入状态（仅私聊）
        if (websocket && websocket.readyState === WebSocket.OPEN && currentSessionId && currentChatType === 'friend') {
            let message = {
                type: 'typing',
                sessionId: parseInt(currentSessionId)
            };
            websocket.send(JSON.stringify(message));

            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(function() {
                let stopMsg = {
                    type: 'stopTyping',
                    sessionId: parseInt(currentSessionId)
                };
                websocket.send(JSON.stringify(stopMsg));
            }, 1000);
        }
    });
}

// 20. 初始化发送消息
function initSendMessage() {
    $('#sendBtn').click(function() {
        sendMessage();
    });

    $('#messageInput').keypress(function(event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    $('#imageBtn').click(function() {
        $('#imageInput').click();
    });

    $('#imageInput').change(function() {
        let file = this.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast('请选择图片文件', 'error');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast('图片不能超过5MB', 'error');
                return;
            }
            sendImageMessage(file);
        }
        $(this).val('');
    });
}

// 21. 初始化 WebSocket（自动适配本地/外网）
function initWebSocket() {
    let userId = $('#userInfo').attr('data-user-id');
    if (!userId || userId === '加载中...') {
        setTimeout(initWebSocket, 1000);
        return;
    }

    if (websocket && websocket.readyState === WebSocket.OPEN) {
        return;
    }

    // 自动获取当前访问地址
    let host = window.location.hostname;
    let protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsUrl = protocol + '//' + host + ':8080/message';

    // 如果是外网访问（cpolar），使用 wss 且不需要端口
    if (host.includes('cpolar.top') || host.includes('cpolar.com')) {
        wsUrl = 'wss://' + host + '/message';
    }

    console.log('WebSocket连接地址: ' + wsUrl);

    websocket = new WebSocket(wsUrl);

    websocket.onopen = function() {
        console.log('WebSocket连接成功');
    };

    websocket.onmessage = function(event) {
        try {
            let resp = JSON.parse(event.data);
            console.log('收到消息:', resp);

            if (resp.type === 'message') {
                handleNewMessage(resp);
            } else if (resp.type === 'revoke') {
                handleRevokeMessage(resp);
            } else if (resp.type === 'friendRequest') {
                handleFriendRequestNotification(resp);
            } else if (resp.type === 'friendRequestAccepted') {
                handleFriendRequestAccepted(resp);
            } else if (resp.type === 'readReceipt') {
                handleReadReceipt(resp);
            } else if (resp.type === 'typing') {
                handleTyping(resp);
            } else if (resp.type === 'stopTyping') {
                handleStopTyping(resp);
            }
        } catch (e) {
            console.log('解析失败:', e);
        }
    };

    websocket.onclose = function() {
        console.log('WebSocket关闭');
        setTimeout(function() {
            if ($('#userInfo').attr('data-user-id')) {
                initWebSocket();
            }
        }, 3000);
    };

    websocket.onerror = function(error) {
        console.log('WebSocket错误:', error);
    };
}

// 22. 处理正在输入
function handleTyping(resp) {
    let titleText = $('#chatTitle').text();
    if (!titleText.includes('正在输入') && currentChatType === 'friend') {
        $('#chatTitle').html(`${titleText} <span style="font-size:12px; color:#999;">正在输入...</span>`);
    }
}

// 23. 处理停止输入
function handleStopTyping(resp) {
    let titleText = $('#chatTitle').text().replace(' 正在输入...', '');
    $('#chatTitle').text(titleText);
}

// 24. 处理好友请求通知
function handleFriendRequestNotification(resp) {
    console.log('收到好友请求通知:', resp);
    showFriendRequestDialog(resp);
}

// 25. 处理好友请求被接受
function handleFriendRequestAccepted(resp) {
    showToast(resp.fromUserName + ' 已接受你的好友请求', 'success');
    getFriendList();
    getSessionList();
}

// 26. 处理已读回执
function handleReadReceipt(resp) {
    console.log('收到已读回执:', resp);
    if (currentSessionId == resp.sessionId && currentChatType === 'friend') {
        $('#messageShow .message-right .read-status').removeClass('read').text('已读').addClass('read');
    }
}

// 27. 处理新消息
function handleNewMessage(resp) {
    console.log('收到新消息:', resp);
    let selfUsername = $('#userName').text();

    let content = resp.content;
    if (resp.imageUrl && !content) {
        content = '[图片]';
    }
    if (content && content.length > 25) {
        content = content.substring(0, 25) + '...';
    }

    // 判断是私聊还是群聊
    if (resp.chatType === 'group') {
        // 群聊消息
        let $groupLi = $(`li[data-group-id="${resp.sessionId}"]`);
        if ($groupLi.length === 0) {
            getGroupList();
            setTimeout(function() {
                $groupLi = $(`li[data-group-id="${resp.sessionId}"]`);
                if ($groupLi.length > 0) {
                    $groupLi.find('.session-preview').text(content);
                }
            }, 500);
        } else {
            $groupLi.find('.session-preview').text(content);
            $('#groupList').prepend($groupLi);
        }

        if (currentSessionId == resp.sessionId && currentChatType === 'group') {
            addMessage(resp, selfUsername);
            $('#messageShow').scrollTop($('#messageShow')[0].scrollHeight);
        } else if (resp.fromName !== selfUsername) {
            let key = 'g_' + resp.sessionId;
            if (!unreadCounts[key]) unreadCounts[key] = 0;
            unreadCounts[key]++;

            let badge = $groupLi.find('.unread-badge');
            let badgeText = unreadCounts[key] > 99 ? '99+' : unreadCounts[key];
            if (badge.length > 0) {
                badge.text(badgeText);
            } else {
                $groupLi.find('.session-item').append(`<span class="unread-badge">${badgeText}</span>`);
            }
        }
    } else {
        // 私聊消息
        let $sessionLi = $(`li[data-session-id="${resp.sessionId}"]`);
        if ($sessionLi.length === 0) {
            getSessionList();
            setTimeout(function() {
                $sessionLi = $(`li[data-session-id="${resp.sessionId}"]`);
                if ($sessionLi.length > 0) {
                    $sessionLi.find('.session-preview').text(content);
                    $('#sessionList').prepend($sessionLi);
                }
            }, 500);
        } else {
            $sessionLi.find('.session-preview').text(content);
            $('#sessionList').prepend($sessionLi);
        }

        if (currentSessionId == resp.sessionId && currentChatType === 'friend') {
            addMessage(resp, selfUsername);
            $('#messageShow').scrollTop($('#messageShow')[0].scrollHeight);
        } else if (resp.fromName !== selfUsername) {
            if (!unreadCounts[resp.sessionId]) unreadCounts[resp.sessionId] = 0;
            unreadCounts[resp.sessionId]++;

            let badge = $sessionLi.find('.unread-badge');
            let badgeText = unreadCounts[resp.sessionId] > 99 ? '99+' : unreadCounts[resp.sessionId];
            if (badge.length > 0) {
                badge.text(badgeText);
            } else {
                $sessionLi.find('.session-item').append(`<span class="unread-badge">${badgeText}</span>`);
            }

            $('#chatTitle').addClass('title-blink');
            setTimeout(function() {
                $('#chatTitle').removeClass('title-blink');
            }, 1500);
        }
    }
}

// 28. 根据sessionId查找会话
function findSessionById(sessionId) {
    let result = null;
    $('#sessionList li').each(function() {
        if ($(this).attr('data-session-id') == sessionId) {
            result = $(this);
            return false;
        }
    });
    return result;
}

// 29. 初始化表情包
function initEmoji() {
    $('.emoji').click(function() {
        let emoji = $(this).data('emoji');
        $('#messageInput').val($('#messageInput').val() + emoji);
        $('#messageInput').focus();
    });

    $('#moreEmojiBtn').click(function() {
        $('#emojiPanel').toggle();
    });

    $(document).click(function(e) {
        if (!$(e.target).closest('#emojiPanel').length && !$(e.target).closest('#moreEmojiBtn').length) {
            $('#emojiPanel').hide();
        }
    });
}

// 30. 退出登录
function initLogout() {
    $('#logoutBtn').click(function() {
        if (confirm('确定退出吗？')) {
            if (websocket) websocket.close();
            location.href = '/login.html';
        }
    });
}

// 31. 夜间模式
function initTheme() {
    let isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        $('body').addClass('dark-mode');
        $('#themeBtn').text('☀️');
    }

    $('#themeBtn').click(function() {
        $('body').toggleClass('dark-mode');
        let isDarkNow = $('body').hasClass('dark-mode');
        localStorage.setItem('darkMode', isDarkNow);
        $('#themeBtn').text(isDarkNow ? '☀️' : '🌙');
    });
}

// 32. 创建群聊
function initCreateGroup() {
    $('#createGroupBtn').click(function() {
        showCreateGroupDialog();
    });
}

function showCreateGroupDialog() {
    $.ajax({
        url: '/friendList',
        method: 'get',
        success: function(friends) {
            let friendListHtml = '';
            for (let friend of friends) {
                friendListHtml += `
                    <div class="friend-select-item">
                        <input type="checkbox" value="${friend.friendId}" id="friend_${friend.friendId}">
                        <label for="friend_${friend.friendId}">${escapeHtml(friend.friendName)}</label>
                    </div>
                `;
            }

            let modal = $(`
                <div class="create-group-modal">
                    <div class="create-group-card">
                        <div class="create-group-header">创建群聊</div>
                        <div class="create-group-body">
                            <input type="text" id="groupName" placeholder="群名称">
                            <div class="friend-select-list">
                                ${friendListHtml}
                            </div>
                        </div>
                        <div class="create-group-footer">
                            <button id="confirmCreateGroup">创建</button>
                            <button id="cancelCreateGroup">取消</button>
                        </div>
                    </div>
                </div>
            `);

            $('body').append(modal);

            $('#confirmCreateGroup').click(function() {
                let groupName = $('#groupName').val().trim();
                if (!groupName) {
                    showToast('请输入群名称', 'error');
                    return;
                }

                let memberIds = [];
                $('.friend-select-item input:checked').each(function() {
                    memberIds.push($(this).val());
                });

                $.ajax({
                    url: '/createGroup',
                    method: 'post',
                    data: {
                        groupName: groupName,
                        memberIds: memberIds
                    },
                    traditional: true,
                    success: function(resp) {
                        if (resp.success) {
                            showToast('群聊创建成功', 'success');
                            getGroupList();
                            modal.remove();
                        } else {
                            showToast('创建失败', 'error');
                        }
                    },
                    error: function() {
                        showToast('创建失败', 'error');
                    }
                });
            });

            $('#cancelCreateGroup').click(function() {
                modal.remove();
            });
        }
    });
}

// 33. 搜索消息
function initSearchMessage() {
    $('#searchMsgBtn').click(function() {
        $('#searchMsgArea').toggle();
        if ($('#searchMsgArea').is(':visible')) {
            $('#searchMsgInput').focus();
        } else {
            $('#messageShow').show();
            if (currentSessionId) {
                getHistoryMessages(currentSessionId);
            }
        }
    });

    $('#closeSearchBtn').click(function() {
        $('#searchMsgArea').hide();
        if (currentSessionId) {
            getHistoryMessages(currentSessionId);
        }
    });

    $('#doSearchMsgBtn').click(function() {
        let keyword = $('#searchMsgInput').val().trim();
        if (!keyword) {
            showToast('请输入搜索关键词', 'error');
            return;
        }

        $.ajax({
            url: '/searchMessages',
            method: 'get',
            data: { keyword: keyword },
            success: function(messages) {
                let $messageShow = $('#messageShow');
                $messageShow.empty();
                if (messages.length === 0) {
                    $messageShow.html('<div style="text-align:center; color:#999; padding:50px;">未找到相关消息</div>');
                    return;
                }
                let selfUsername = $('#userName').text();
                for (let msg of messages) {
                    let $msgDiv = $('<div>').addClass('search-result-item').html(`
                        <div><strong>${escapeHtml(msg.fromName)}</strong> <span style="color:#999; font-size:12px;">${formatMessageTime(msg.postTime)}</span></div>
                        <div>${escapeHtml(msg.content)}</div>
                    `);
                    $msgDiv.click(function() {
                        currentSessionId = msg.sessionId;
                        currentChatType = 'friend';
                        $('#chatTitle').text(msg.fromName);
                        getHistoryMessages(msg.sessionId);
                        $('#searchMsgArea').hide();
                    });
                    $messageShow.append($msgDiv);
                }
            },
            error: function() {
                showToast('搜索失败', 'error');
            }
        });
    });
}

// 辅助函数：转义HTML
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}