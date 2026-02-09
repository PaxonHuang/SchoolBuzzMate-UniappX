const db = uniCloud.database();
const uniID = require('uni-id');

exports.main = async (event, context) => {
  // 验证用户登录状态
  const { uid } = await uniID.checkToken(event.uniIdToken);
  if (!uid) {
    return {
      errCode: 'UNAUTHORIZED',
      errMsg: '用户未登录或登录已过期'
    };
  }

  try {
    // 查询校园卡余额
    const collection = db.collection('campus_card_balance');
    const result = await collection.where({
      user_id: uid
    }).get();

    // 检查查询结果
    if (result.data.length === 0) {
      return {
        errCode: 'BALANCE_NOT_FOUND',
        errMsg: '未找到您的校园卡信息'
      };
    }

    // 返回余额信息
    const balanceInfo = result.data[0];
    return {
      code: 0,
      msg: '查询成功',
      data: {
        balance: balanceInfo.balance,
        last_update: balanceInfo.last_update,
        card_status: balanceInfo.card_status
      }
    };

  } catch (error) {
    console.error('查询校园卡余额失败:', error);
    return {
      errCode: 'QUERY_ERROR',
      errMsg: '查询失败，请稍后重试'
    };
  }
};