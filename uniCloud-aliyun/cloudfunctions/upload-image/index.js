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
    
    // 上传图片到uniCloud存储
    const {
      fileID,
      tempFileURL
    } = await uniCloud.uploadFile({
      cloudPath: `posts/${userId}_${Date.now()}.jpg`,
      fileContent: event.fileContent
    });
    
    // 返回图片信息
    return {
      code: 0,
      message: '图片上传成功',
      data: {
        fileID,
        tempFileURL
      }
    };
  } catch (error) {
    return {
      code: 500,
      message: '图片上传失败: ' + error.message,
      data: null
    };
  }
};