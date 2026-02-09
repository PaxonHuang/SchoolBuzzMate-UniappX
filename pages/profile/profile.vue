<template>
  <view class="profile-container">
    <view class="profile-card">
      <view class="user-header">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        <text class="nickname">{{userInfo.nickname}}</text>
        <view class="user-tags">
          <text class="tag" v-if="userInfo.isPhoneVerified">已绑定手机</text>
          <text class="tag" v-if="userInfo.wxOpenId">微信用户</text>
        </view>
      </view>
      
      <view class="profile-info">
        <view class="info-item">
          <text class="info-label">手机号</text>
          <text class="info-value">{{userInfo.phone ? userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '未绑定'}}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">注册时间</text>
          <text class="info-value">{{formatDate(userInfo.createTime)}}</text>
        </view>
      </view>
      
      <view class="action-buttons">
        <button class="action-btn brutalist-btn" @tap="editProfile">编辑资料</button>
        <button class="action-btn brutalist-btn brutalist-btn-secondary" @tap="logout">退出登录</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  onLoad() {
    // 获取用户信息
    this.getUserInfo()
  },
  methods: {
    // 获取用户信息
    async getUserInfo() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          // 没有token，跳转到登录页
          uni.redirectTo({
            url: '/pages/login/login'
          })
          return
        }
        
        const res = await uniCloud.callFunction({
          name: 'validate-token',
          data: { token }
        })
        
        if (res.result.success) {
          this.userInfo = res.result.userInfo
        } else {
          // token无效，跳转到登录页
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.redirectTo({
            url: '/pages/login/login'
          })
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        uni.redirectTo({
          url: '/pages/login/login'
        })
      }
    },
    
    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return ''
      
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      
      return `${year}年${month}月${day}日`
    },
    
    // 编辑资料
    editProfile() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },
    
    // 退出登录
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除本地存储
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
            
            // 跳转到登录页
            uni.redirectTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.profile-container {
  min-height: 100vh;
  background-color: #FFFFFF;
  padding: 40rpx;
}

.profile-card {
  width: 100%;
  background-color: #FFFFFF;
  padding: 60rpx 40rpx;
  border: 8rpx solid #000000;
  box-shadow: 12rpx 12rpx 0px #000000;
  transform: rotate(-1deg);
}

.user-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 4rpx solid #000000;
  margin-bottom: 20rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: 700;
  color: #000000;
  margin-bottom: 20rpx;
}

.user-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  padding: 6rpx 20rpx;
  background-color: #FFE66D;
  border: 2rpx solid #000000;
  font-size: 24rpx;
  color: #000000;
  margin: 0 10rpx 10rpx 0;
}

.profile-info {
  margin-bottom: 60rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #EEEEEE;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 30rpx;
  color: #666666;
}

.info-value {
  font-size: 30rpx;
  color: #000000;
  font-weight: 700;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.action-btn {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
}

.action-btn:active {
  transform: translate(3rpx, 3rpx);
  box-shadow: 3rpx 3rpx 0px #000000;
}

.action-btn {
  background-color: #FF6B6B;
}

.brutalist-btn-secondary {
  background-color: #FFE66D;
}

.action-btn text {
  font-size: 32rpx;
  font-weight: 700;
  color: #000000;
}
</style>