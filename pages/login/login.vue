<template>
  <view class="login-container">
    <view class="login-card">
      <view class="app-logo">
        <image class="logo-img" src="/static/images/logo.png" mode="aspectFit"></image>
      </view>
      <text class="app-title">校趣闪搭</text>
      <text class="app-subtitle">连接校园，分享精彩</text>
      
      <view class="login-buttons">
        <button class="login-btn brutalist-btn" @tap="handleWxLogin" :disabled="isLoading">
          <text class="btn-text">微信登录</text>
        </button>
        
        <button class="phone-btn brutalist-btn brutalist-btn-secondary" @tap="showPhoneLogin" :disabled="isLoading">
          <text class="btn-text">手机号登录</text>
        </button>
      </view>
      
      <view class="login-agreement">
        <text class="agreement-text">登录即表示同意</text>
        <text class="agreement-link" @tap="openUserAgreement">《用户协议》</text>
        <text class="agreement-text">和</text>
        <text class="agreement-link" @tap="openPrivacyPolicy">《隐私政策》</text>
      </view>
    </view>
    
    <!-- 手机号登录模态框 -->
    <view class="modal-mask" v-if="showPhoneModal" @tap="hidePhoneLogin">
      <view class="phone-modal" @tap.stop>
        <text class="modal-title">手机号登录</text>
        
        <view class="input-group">
          <input 
            class="phone-input" 
            type="number" 
            placeholder="请输入手机号" 
            v-model="phoneNumber" 
            maxlength="11"
          />
        </view>
        
        <view class="input-group">
          <input 
            class="code-input" 
            type="number" 
            placeholder="请输入验证码" 
            v-model="verifyCode" 
            maxlength="6"
          />
          <button 
            class="code-btn brutalist-btn" 
            @tap="sendCode" 
            :disabled="codeTimer > 0 || !isValidPhone"
          >
            {{codeTimer > 0 ? `${codeTimer}s` : '获取验证码'}}
          </button>
        </view>
        
        <view class="modal-buttons">
          <button class="cancel-btn brutalist-btn brutalist-btn-secondary" @tap="hidePhoneLogin">取消</button>
          <button class="confirm-btn brutalist-btn" @tap="handlePhoneLogin">登录</button>
        </view>
      </view>
    </view>
    
    <!-- 加载提示 -->
    <view class="loading-mask" v-if="isLoading">
      <view class="loading-content">
        <text>登录中...</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      showPhoneModal: false,
      phoneNumber: '',
      verifyCode: '',
      codeTimer: 0,
      codeTimerId: null
    }
  },
  computed: {
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.phoneNumber)
    }
  },
  onLoad() {
    // 检查是否已经登录
    this.checkLoginStatus()
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const token = uni.getStorageSync('token')
      if (token) {
        // 验证token有效性
        this.validateToken(token)
      }
    },
    
    // 验证token有效性
    async validateToken(token) {
      try {
        const res = await uniCloud.callFunction({
          name: 'validate-token',
          data: { token }
        })
        
        if (res.result.success) {
          // token有效，跳转到首页
          uni.switchTab({
            url: '/pages/index/index'
          })
        }
      } catch (error) {
        console.error('Token验证失败:', error)
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
      }
    },
    
    // 微信登录
    async handleWxLogin() {
      this.isLoading = true
      
      try {
        // 获取微信登录凭证
        const loginRes = await uni.login({
          provider: 'weixin'
        })
        
        if (!loginRes.code) {
          throw new Error('获取微信登录凭证失败')
        }
        
        // 获取用户信息
        const userInfoRes = await uni.getUserInfo({
          provider: 'weixin'
        })
        
        // 调用云函数进行微信登录
        const res = await uniCloud.callFunction({
          name: 'wx-login',
          data: {
            code: loginRes.code,
            userInfo: userInfoRes.userInfo
          }
        })
        
        if (res.result.success) {
          // 登录成功，保存token和用户信息
          uni.setStorageSync('token', res.result.token)
          uni.setStorageSync('userInfo', res.result.userInfo)
          
          // 跳转到首页
          uni.switchTab({
            url: '/pages/index/index'
          })
        } else {
          uni.showToast({
            title: res.result.message || '登录失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('微信登录失败:', error)
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    // 显示手机号登录
    showPhoneLogin() {
      this.showPhoneModal = true
    },
    
    // 隐藏手机号登录
    hidePhoneLogin() {
      this.showPhoneModal = false
      this.phoneNumber = ''
      this.verifyCode = ''
    },
    
    // 发送验证码
    async sendCode() {
      if (!this.isValidPhone) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      
      try {
        const res = await uniCloud.callFunction({
          name: 'send-sms-code',
          data: {
            phone: this.phoneNumber
          }
        })
        
        if (res.result.success) {
          // 开始倒计时
          this.codeTimer = 60
          this.codeTimerId = setInterval(() => {
            this.codeTimer--
            if (this.codeTimer <= 0) {
              clearInterval(this.codeTimerId)
              this.codeTimerId = null
            }
          }, 1000)
          
          uni.showToast({
            title: '验证码已发送',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: res.result.message || '发送失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('发送验证码失败:', error)
        uni.showToast({
          title: '发送失败，请重试',
          icon: 'none'
        })
      }
    },
    
    // 手机号登录
    async handlePhoneLogin() {
      if (!this.isValidPhone) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      
      if (!this.verifyCode || this.verifyCode.length !== 6) {
        uni.showToast({
          title: '请输入正确的验证码',
          icon: 'none'
        })
        return
      }
      
      this.isLoading = true
      
      try {
        const res = await uniCloud.callFunction({
          name: 'phone-login',
          data: {
            phone: this.phoneNumber,
            code: this.verifyCode
          }
        })
        
        if (res.result.success) {
          // 登录成功，保存token和用户信息
          uni.setStorageSync('token', res.result.token)
          uni.setStorageSync('userInfo', res.result.userInfo)
          
          // 跳转到首页
          uni.switchTab({
            url: '/pages/index/index'
          })
        } else {
          uni.showToast({
            title: res.result.message || '登录失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('手机号登录失败:', error)
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    // 打开用户协议
    openUserAgreement() {
      uni.navigateTo({
        url: '/pages/webview/webview?title=用户协议&url=https://example.com/user-agreement'
      })
    },
    
    // 打开隐私政策
    openPrivacyPolicy() {
      uni.navigateTo({
        url: '/pages/webview/webview?title=隐私政策&url=https://example.com/privacy-policy'
      })
    }
  },
  
  onUnload() {
    // 清理倒计时
    if (this.codeTimerId) {
      clearInterval(this.codeTimerId)
    }
  }
}
</script>

<style>
.login-container {
  min-height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  position: relative;
}

.login-card {
  width: 90%;
  max-width: 600rpx;
  background-color: #FFFFFF;
  padding: 60rpx 40rpx;
  border: 8rpx solid #000000;
  box-shadow: 12rpx 12rpx 0px #000000;
  transform: rotate(-1deg);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
}

.logo-img {
  width: 100%;
  height: 100%;
}

.app-title {
  font-size: 48rpx;
  font-weight: 900;
  color: #000000;
  margin-bottom: 10rpx;
}

.app-subtitle {
  font-size: 30rpx;
  font-weight: 400;
  color: #333333;
  margin-bottom: 60rpx;
}

.login-buttons {
  width: 100%;
  margin-bottom: 40rpx;
}

.login-btn, .phone-btn {
  width: 100%;
  height: 100rpx;
  margin-bottom: 20rpx;
  background-color: #FF6B6B;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:active, .phone-btn:active {
  transform: translate(3rpx, 3rpx);
  box-shadow: 3rpx 3rpx 0px #000000;
}

.brutalist-btn-secondary {
  background-color: #FFE66D;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #000000;
}

.login-agreement {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 24rpx;
}

.agreement-text {
  color: #666666;
  margin: 0 6rpx;
}

.agreement-link {
  color: #FF6B6B;
  margin: 0 6rpx;
  text-decoration: underline;
}

/* 模态框样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.phone-modal {
  width: 90%;
  max-width: 600rpx;
  background-color: #FFFFFF;
  padding: 40rpx;
  border: 8rpx solid #000000;
  box-shadow: 12rpx 12rpx 0px #000000;
  transform: rotate(1deg);
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #000000;
  text-align: center;
  margin-bottom: 40rpx;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  border: 4rpx solid #000000;
  background-color: #FFFFFF;
  box-shadow: 6rpx 6rpx 0px #000000;
}

.phone-input, .code-input {
  flex: 1;
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
}

.code-input {
  border-left: 4rpx solid #000000;
}

.code-btn {
  height: 80rpx;
  padding: 0 20rpx;
  white-space: nowrap;
  background-color: #FFE66D;
  border: none;
  border-left: 4rpx solid #000000;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}

.cancel-btn, .confirm-btn {
  width: 48%;
  height: 80rpx;
}

.cancel-btn {
  background-color: #FFE66D;
}

.confirm-btn {
  background-color: #FF6B6B;
}

/* 加载提示 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background-color: #FFFFFF;
  padding: 30rpx 60rpx;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
}

.loading-content text {
  font-size: 30rpx;
  color: #000000;
}
</style>