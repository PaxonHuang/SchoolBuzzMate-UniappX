'use strict';

// 数据库集合名称
const SMS_CODE_COLLECTION = 'sms_codes';

exports.main = async (event, context) => {
  const { phone } = event;
  
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return {
      success: false,
      message: '手机号格式不正确'
    };
  }
  
  try {
    const db = uniCloud.database();
    const codeCollection = db.collection(SMS_CODE_COLLECTION);
    
    // 检查发送频率限制（1分钟内只能发送一次）
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCode = await codeCollection.where({
      phone,
      createTime: db.command.gte(oneMinuteAgo)
    }).get();
    
    if (recentCode.data.length > 0) {
      return {
        success: false,
        message: '发送过于频繁，请稍后再试'
      };
    }
    
    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 发送短信验证码
    const smsResult = await sendSMS(phone, code);
    
    if (!smsResult.success) {
      return {
        success: false,
        message: '短信发送失败',
        error: smsResult.error
      };
    }
    
    // 保存验证码到数据库（有效期5分钟）
    await codeCollection.add({
      phone,
      code,
      createTime: new Date(),
      expireTime: new Date(Date.now() + 5 * 60 * 1000),
      used: false
    });
    
    return {
      success: true,
      message: '验证码发送成功'
    };
    
  } catch (error) {
    console.error('发送短信验证码失败:', error);
    return {
      success: false,
      message: '发送失败，请重试',
      error: error.message
    };
  }
};

// 发送短信验证码
async function sendSMS(phone, code) {
  try {
    // 这里使用uniCloud的短信服务
    // 需要在uniCloud控制台配置短信模板
    const res = await uniCloud.sendSms({
      phone: phone,
      templateId: 'YOUR_SMS_TEMPLATE_ID', // 短信模板ID，需要在uniCloud控制台申请
      data: {
        code: code // 验证码
      }
    });
    
    if (res.errCode === 0) {
      return {
        success: true
      };
    } else {
      return {
        success: false,
        error: `短信发送失败: ${res.errMsg}`
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}