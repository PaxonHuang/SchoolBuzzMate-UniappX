'use strict';

const db = uniCloud.database();
exports.main = async (event, context) => {
  try {
    // 验证token
    const validateResult = await uniCloud.callFunction({
      name: 'validate-token',
      data: {
        token: event.token
      }
    });
    
    if (!validateResult.result.code === 0) {
      return {
        code: 401,
        message: '身份验证失败',
        data: null
      };
    }
    
    const userId = validateResult.result.data.userId;
    const postId = event.postId;
    const content = event.content;
    
    if (!postId || !content || !content.trim()) {
      return {
        code: 400,
        message: '缺少必要参数',
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
    
    // 获取用户信息
    const userQuery = await db.collection('users').doc(userId).get();
    if (!userQuery.data.length) {
      return {
        code: 404,
        message: '用户不存在',
        data: null
      };
    }
    
    const user = userQuery.data[0];
    
    // 创建评论数据
    const commentData = {
      postId: postId,
      userId: userId,
      content: content.trim(),
      createTime: new Date(),
      updateTime: new Date(),
      replyTo: event.replyTo || null // 回复的评论ID，null表示直接评论动态
    };
    
    // 插入评论数据
    const commentResult = await db.collection('comments').add(commentData);
    
    // 更新动态的评论数
    await db.collection('posts').doc(postId).update({
      comments: db.command.inc(1)
    });
    
    // 返回结果
    return {
      code: 0,
      message: '评论成功',
      data: {
        commentId: commentResult.id,
        ...commentData,
        userInfo: {
          nickname: user.nickname,
          avatar: user.avatar
        }
      }
    };
  } catch (error) {
    return {
      code: 500,
      message: '评论失败: ' + error.message,
      data: null
    };
  }
};