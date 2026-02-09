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
    
    // 创建动态数据
    const postData = {
      userId: userId,
      content: event.content || '',
      images: event.images || [], // 图片URL数组
      createTime: new Date(),
      updateTime: new Date(),
      likes: 0,
      comments: 0,
      isPublic: event.isPublic !== false, // 默认公开
      tags: event.tags || []
    };
    
    // 插入动态数据
    const postResult = await db.collection('posts').add(postData);
    
    // 返回结果
    return {
      code: 0,
      message: '发布成功',
      data: {
        postId: postResult.id,
        ...postData,
        userInfo: {
          nickname: user.nickname,
          avatar: user.avatar,
          school: user.school
        }
      }
    };
  } catch (error) {
    return {
      code: 500,
      message: '发布失败: ' + error.message,
      data: null
    };
  }
};