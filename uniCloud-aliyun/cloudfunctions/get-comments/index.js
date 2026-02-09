'use strict';

const db = uniCloud.database();
exports.main = async (event, context) => {
  try {
    // 验证token（可选，某些接口可以不登录查看）
    let userId = null;
    if (event.token) {
      const validateResult = await uniCloud.callFunction({
        name: 'validate-token',
        data: {
          token: event.token
        }
      });
      
      if (validateResult.result.code === 0) {
        userId = validateResult.result.data.userId;
      }
    }
    
    const postId = event.postId;
    
    if (!postId) {
      return {
        code: 400,
        message: '缺少动态ID',
        data: null
      };
    }
    
    // 检查动态是否存在
    const postQuery = await db.collection('posts').doc(postId).get();
    if (!postQuery.data.length) {
      return {
        code: 404,
        message: '动态不存在',
        data: null
      };
    }
    
    // 获取分页参数
    const page = event.page || 1;
    const pageSize = event.pageSize || 20;
    const offset = (page - 1) * pageSize;
    
    // 查询评论列表（直接评论动态的评论）
    const commentsQuery = db.collection('comments')
      .where({
        postId: postId,
        replyTo: db.command.exists(false)
      })
      .orderBy('createTime', 'desc')
      .skip(offset)
      .limit(pageSize)
      .get();
    
    // 获取总数
    const countQuery = db.collection('comments')
      .where({
        postId: postId,
        replyTo: db.command.exists(false)
      })
      .count();
    
    // 执行查询
    const [commentsResult, countResult] = await Promise.all([commentsQuery, countQuery]);
    
    // 获取用户信息
    const userIds = [...new Set(commentsResult.data.map(comment => comment.userId))];
    const usersQuery = await db.collection('users')
      .where({
        _id: db.command.in(userIds)
      })
      .get();
    
    // 构建用户信息映射
    const userMap = {};
    usersQuery.data.forEach(user => {
      userMap[user._id] = {
        nickname: user.nickname,
        avatar: user.avatar
      };
    });
    
    // 获取回复评论
    const commentIds = commentsResult.data.map(comment => comment._id);
    let repliesMap = {};
    
    if (commentIds.length > 0) {
      const repliesQuery = await db.collection('comments')
        .where({
          replyTo: db.command.in(commentIds)
        })
        .orderBy('createTime', 'asc')
        .get();
      
      // 获取回复的用户信息
      const replyUserIds = [...new Set(repliesQuery.data.map(reply => reply.userId))];
      const replyUsersQuery = await db.collection('users')
        .where({
          _id: db.command.in(replyUserIds)
        })
        .get();
      
      const replyUserMap = {};
      replyUsersQuery.data.forEach(user => {
        replyUserMap[user._id] = {
          nickname: user.nickname,
          avatar: user.avatar
        };
      });
      
      // 组织回复数据
      repliesMap = {};
      repliesQuery.data.forEach(reply => {
        const parentCommentId = reply.replyTo;
        if (!repliesMap[parentCommentId]) {
          repliesMap[parentCommentId] = [];
        }
        
        repliesMap[parentCommentId].push({
          ...reply,
          userInfo: replyUserMap[reply.userId] || {
            nickname: '未知用户',
            avatar: ''
          }
        });
      });
    }
    
    // 组装返回数据
    const comments = commentsResult.data.map(comment => ({
      ...comment,
      userInfo: userMap[comment.userId] || {
        nickname: '未知用户',
        avatar: ''
      },
      replies: repliesMap[comment._id] || []
    }));
    
    // 返回结果
    return {
      code: 0,
      message: '获取成功',
      data: {
        comments,
        total: countResult.total,
        page,
        pageSize,
        totalPages: Math.ceil(countResult.total / pageSize)
      }
    };
  } catch (error) {
    return {
      code: 500,
      message: '获取评论列表失败: ' + error.message,
      data: null
    };
  }
};