'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// 数据库集合名称
const USER_COLLECTION = 'users';

// JWT密钥
const JWT_SECRET = 'SCHOOL_BUZZ_JWT_SECRET_KEY';

exports.main = async (event, context) => {
  const { code, userInfo } = event;
  
  try {
    // 获取微信openid
    const wxResult = await getWxOpenId(code);
    
    if (!wxResult.success) {
      return {
        success: false,
        message: '获取微信信息失败',
        error: wxResult.error
      };
    }
    
    const { openid, unionid } = wxResult;
    
    // 查询或创建用户
    const db = uniCloud.database();
    const userCollection = db.collection(USER_COLLECTION);
    
    // 检查用户是否已存在
    const existUser = await userCollection.where({
      wxOpenId: openid
    }).get();
    
    let userData;
    
    if (existUser.data.length > 0) {
      // 用户已存在，更新登录信息
      userData = existUser.data[0];
      
      // 更新最后登录时间
      await userCollection.doc(userData._id).update({
        lastLoginTime: new Date(),
        loginCount: userData.loginCount ? userData.loginCount + 1 : 1
      });
      
    } else {
      // 创建新用户
      const newUser = {
        wxOpenId: openid,
        wxUnionId: unionid,
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        gender: userInfo.gender,
        phone: null, // 手机号，需要绑定
        isPhoneVerified: false,
        school: null, // 学校信息
        studentId: null, // 学号
        realName: null, // 真实姓名
        createTime: new Date(),
        lastLoginTime: new Date(),
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
      wxOpenId: userData.wxOpenId,
      nickname: userData.nickname,
      avatar: userData.avatar,
      phone: userData.phone,
      isPhoneVerified: userData.isPhoneVerified,
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
    console.error('微信登录失败:', error);
    return {
      success: false,
      message: '登录失败，请重试',
      error: error.message
    };
  }
};

// 获取微信openid和unionid
async function getWxOpenId(code) {
  try {
    // 这里需要替换为实际的微信小程序AppID和AppSecret
    // 建议将这些配置存储在uniCloud的云函数环境变量中
    const appid = 'YOUR_MINI_PROGRAM_APPID';
    const secret = 'YOUR_MINI_PROGRAM_SECRET';
    
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    
    const res = await uniCloud.httpclient.request(url, {
      method: 'GET',
      dataType: 'json'
    });
    
    if (res.data.errcode) {
      return {
        success: false,
        error: `微信API错误: ${res.data.errmsg}`
      };
    }
    
    return {
      success: true,
      openid: res.data.openid,
      unionid: res.data.unionid
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// 生成JWT token
function generateToken(userData) {
  return jwt.sign(
    {
      userId: userData._id,
      wxOpenId: userData.wxOpenId
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}