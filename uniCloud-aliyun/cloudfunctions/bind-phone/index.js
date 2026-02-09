'use strict';
const jwt = require('jsonwebtoken');

// 数据库集合名称
const USER_COLLECTION = 'users';
const SMS_CODE_COLLECTION = 'sms_codes';

// JWT密钥
const JWT_SECRET = 'SCHOOL_BUZZ_JWT_SECRET_KEY';

exports.main = async (event, context) => {
  const { token, phone, code } = event;
  
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return {
      success: false,
      message: '手机号格式不正确'
    };
  }
  
  if (!token) {
    return {
      success: false,
      message: '缺少token'
    };
  }
  
  try {
    // 验证JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const db = uniCloud.database();
    const userCollection = db.collection(USER_COLLECTION);
    const codeCollection = db.collection(SMS_CODE_COLLECTION);
    
    // 验证短信验证码
    const now = new Date();
    const codeRecord = await codeCollection.where({
      phone,
      code,
      used: false,
      expireTime: db.command.gte(now)
    }).orderBy('createTime', 'desc').limit(1).get();
    
    if (codeRecord.data.length === 0) {
      return {
        success: false,
        message: '验证码无效或已过期'
      };
    }
    
    // 标记验证码为已使用
    await codeCollection.doc(codeRecord.data[0]._id).update({
      used: true,
      usedTime: now
    });
    
    // 检查手机号是否已被其他用户绑定
    const existPhone = await userCollection.where({
      phone,
      _id: db.command.neq(decoded.userId)
    }).get();
    
    if (existPhone.data.length > 0) {
      return {
        success: false,
        message: '该手机号已被其他用户绑定'
      };
    }
    
    // 获取用户信息
    const userResult = await userCollection.doc(decoded.userId).get();
    
    if (!userResult.data.length) {
      return {
        success: false,
        message: '用户不存在'
      };
    }
    
    const userData = userResult.data[0];
    
    // 更新用户手机号信息
    await userCollection.doc(decoded.userId).update({
      phone,
      isPhoneVerified: true,
      phoneVerifiedTime: now,
      updateTime: now
    });
    
    // 返回更新后的用户信息
    const returnUserData = {
      _id: userData._id,
      phone: phone,
      nickname: userData.nickname,
      avatar: userData.avatar,
      isPhoneVerified: true,
      wxOpenId: userData.wxOpenId,
      school: userData.school,
      studentId: userData.studentId,
      realName: userData.realName,
      createTime: userData.createTime,
      status: userData.status
    };
    
    return {
      success: true,
      message: '绑定成功',
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
      console.error('绑定手机号失败:', error);
      return {
        success: false,
        message: '绑定失败，请重试',
        error: error.message
      };
    }
  }
};