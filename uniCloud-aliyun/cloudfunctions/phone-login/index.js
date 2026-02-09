'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// 数据库集合名称
const USER_COLLECTION = 'users';
const SMS_CODE_COLLECTION = 'sms_codes';

// JWT密钥
const JWT_SECRET = 'SCHOOL_BUZZ_JWT_SECRET_KEY';

exports.main = async (event, context) => {
  const { phone, code } = event;
  
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return {
      success: false,
      message: '手机号格式不正确'
    };
  }
  
  try {
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
    
    // 查询或创建用户
    const existUser = await userCollection.where({
      phone
    }).get();
    
    let userData;
    
    if (existUser.data.length > 0) {
      // 用户已存在，更新登录信息
      userData = existUser.data[0];
      
      // 更新手机号验证状态
      if (!userData.isPhoneVerified) {
        await userCollection.doc(userData._id).update({
          isPhoneVerified: true,
          phoneVerifiedTime: now
        });
        userData.isPhoneVerified = true;
        userData.phoneVerifiedTime = now;
      }
      
      // 更新最后登录时间
      await userCollection.doc(userData._id).update({
        lastLoginTime: now,
        loginCount: userData.loginCount ? userData.loginCount + 1 : 1
      });
      
    } else {
      // 创建新用户
      const newUser = {
        phone,
        nickname: `用户${phone.slice(-4)}`, // 默认昵称
        avatar: '/static/images/default-avatar.png', // 默认头像
        gender: 0, // 未知性别
        isPhoneVerified: true,
        phoneVerifiedTime: now,
        wxOpenId: null, // 微信openid，需要绑定
        wxUnionId: null, // 微信unionid
        school: null, // 学校信息
        studentId: null, // 学号
        realName: null, // 真实姓名
        createTime: now,
        lastLoginTime: now,
        loginCount: 1,
        status: 'active' // 用户状态：active-正常，banned-封禁
      };
      
      const createResult = await userCollection.add(newUser);
      userData = {
        ...newUser,
        _id: createResult.id
      };
    }
    
    // 生成JWT token
    const token = generateToken(userData);
    
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
      status: userData.status,
      isNewUser: existUser.data.length === 0
    };
    
    return {
      success: true,
      message: '登录成功',
      token: token,
      userInfo: returnUserData
    };
    
  } catch (error) {
    console.error('手机号登录失败:', error);
    return {
      success: false,
      message: '登录失败，请重试',
      error: error.message
    };
  }
};

// 生成JWT token
function generateToken(userData) {
  return jwt.sign(
    {
      userId: userData._id,
      phone: userData.phone
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}