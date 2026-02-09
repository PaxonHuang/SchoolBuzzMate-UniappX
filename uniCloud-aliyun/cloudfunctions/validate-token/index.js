'use strict';
const jwt = require('jsonwebtoken');

// 数据库集合名称
const USER_COLLECTION = 'users';

// JWT密钥
const JWT_SECRET = 'SCHOOL_BUZZ_JWT_SECRET_KEY';

exports.main = async (event, context) => {
  const { token } = event;
  
  if (!token) {
    return {
      success: false,
      message: '缺少token'
    };
  }
  
  try {
    // 验证JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 从数据库获取用户信息
    const db = uniCloud.database();
    const userCollection = db.collection(USER_COLLECTION);
    
    const userResult = await userCollection.doc(decoded.userId).get();
    
    if (!userResult.data.length) {
      return {
        success: false,
        message: '用户不存在'
      };
    }
    
    const userData = userResult.data[0];
    
    // 检查用户状态
    if (userData.status === 'banned') {
      return {
        success: false,
        message: '用户已被封禁'
      };
    }
    
    // 返回用户信息（不包含敏感信息）
    const returnUserData = {
      _id: userData._id,
      phone: userData.phone,
      nickname: userData.nickname,
      avatar: userData.avatar,
      isPhoneVerified: userData.isPhoneVerified,
      wxOpenId: userData.wxOpenId,
      school: userData.school,
      studentId: userData.studentId,
      realName: userData.realName,
      createTime: userData.createTime,
      status: userData.status
    };
    
    return {
      success: true,
      userInfo: returnUserData
    };
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return {
        success: false,
        message: '登录已过期，请重新登录'
      };
    } else if (error.name === 'JsonWebTokenError') {
      return {
        success: false,
        message: '无效的token'
      };
    } else {
      console.error('Token验证失败:', error);
      return {
        success: false,
        message: '验证失败，请重试',
        error: error.message
      };
    }
  }
};