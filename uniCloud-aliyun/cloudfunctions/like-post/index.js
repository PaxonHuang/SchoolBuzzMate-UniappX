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
    
    // 检查是否已点赞
    const likeQuery = await db.collection('likes')
      .where({
        postId: postId,
        userId: userId
      })
      .get();
    
    let isLiked = false;
    
    if (likeQuery.data.length > 0) {
      // 已点赞，取消点赞
      await db.collection('likes').doc(likeQuery.data[0]._id).remove();
      
      // 更新动态点赞数
      await db.collection('posts').doc(postId).update({
        likes: db.command.inc(-1)
      });
      
      isLiked = false;
    } else {
      // 未点赞，添加点赞
      await db.collection('likes').add({
        postId: postId,
        userId: userId,
        createTime: new Date()
      });
      
      // 更新动态点赞数
      await db.collection('posts').doc(postId).update({
        likes: db.command.inc(1)
      });
      
      isLiked = true;
    }
    
    // 获取最新点赞数
    const updatedPostQuery = await db.collection('posts').doc(postId).get();
    const likes = updatedPostQuery.data[0].likes;
    
    // 返回结果
    return {
      code: 0,
      message: isLiked ? '点赞成功' : '取消点赞成功',
      data: {
        isLiked,
        likes
      }
    };
  } catch (error) {
    return {
      code: 500,
      message: '操作失败: ' + error.message,
      data: null
    };
  }
};