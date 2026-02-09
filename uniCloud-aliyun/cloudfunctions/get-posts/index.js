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
    
    // 构建查询条件
    const queryCondition = {
      isPublic: true
    };
    
    // 获取分页参数
    const page = event.page || 1;
    const pageSize = event.pageSize || 10;
    const offset = (page - 1) * pageSize;
    
    // 查询动态列表
    const postsQuery = db.collection('posts')
      .where(queryCondition)
      .orderBy('createTime', 'desc')
      .skip(offset)
      .limit(pageSize)
      .get();
    
    // 获取总数
    const countQuery = db.collection('posts')
      .where(queryCondition)
      .count();
    
    // 执行查询
    const [postsResult, countResult] = await Promise.all([postsQuery, countQuery]);
    
    // 获取用户信息
    const userIds = [...new Set(postsResult.data.map(post => post.userId))];
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
        avatar: user.avatar,
        school: user.school
      };
    });
    
    // 检查当前用户是否已点赞
    let likeMap = {};
    if (userId && userIds.length > 0) {
      const postIds = postsResult.data.map(post => post._id);
      const likesQuery = await db.collection('likes')
        .where({
          postId: db.command.in(postIds),
          userId: userId
        })
        .get();
      
      likesQuery.data.forEach(like => {
        likeMap[like.postId] = true;
      });
    }
    
    // 组装返回数据
    const posts = postsResult.data.map(post => ({
      ...post,
      userInfo: userMap[post.userId] || {
        nickname: '未知用户',
        avatar: '',
        school: ''
      },
      isLiked: !!likeMap[post._id]
    }));
    
    // 返回结果
    return {
      code: 0,
      message: '获取成功',
      data: {
        posts,
        total: countResult.total,
        page,
        pageSize,
        totalPages: Math.ceil(countResult.total / pageSize)
      }
    };
  } catch (error) {
    return {
      code: 500,
      message: '获取动态列表失败: ' + error.message,
      data: null
    };
  }
};