<template>
  <view class="bind-container">
    <view class="bind-card">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        <text class="nickname">{{userInfo.nickname}}</text>
      </view>
      
      <view class="bind-tips">
        <text class="tips-text">为了您的账户安全，建议绑定手机号</text>
      </view>
      
      <view class="bind-buttons">
        <button class="bind-btn brutalist-btn" @tap="bindPhone" v-if="!userInfo.isPhoneVerified">
          <text class="btn-text">绑定手机号</text>
        </button>
        
        <button class="skip-btn brutalist-btn brutalist-btn-secondary" @tap="skipBind">
          <text class="btn-text">暂时跳过</text>
        </button>
      </view>
      
      <text class="bind-note">绑定后可使用手机号快速登录，并能找回账户</text>
    </view>
    
    <!-- 绑定手机号模态框 -->
    <view class="modal-mask" v-if="showPhoneModal" @tap="hideBindPhone">
      <view class="phone-modal" @tap.stop>
        <text class="modal-title">绑定手机号</text>
        
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
          <button class="cancel-btn brutalist-btn brutalist-btn-secondary" @tap="hideBindPhone">取消</button>
          <button class="confirm-btn brutalist-btn" @tap="handleBindPhone">确认绑定</button>
        </view>
      </view>
    </view>
    
    <!-- 加载提示 -->
    <view class="loading-mask" v-if="isLoading">
      <view class="loading-content">
        <text>绑定中...</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
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
          
          // 如果已经绑定手机号，直接跳转到首页
          if (this.userInfo.isPhoneVerified) {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }
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
    
    // 绑定手机号
    bindPhone() {
      this.showPhoneModal = true
    },
    
    // 隐藏绑定手机号
    hideBindPhone() {
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
    
    // 确认绑定手机号
    async handleBindPhone() {
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
        const token = uni.getStorageSync('token')
        const res = await uniCloud.callFunction({
          name: 'bind-phone',
          data: {
            token,
            phone: this.phoneNumber,
            code: this.verifyCode
          }
        })
        
        if (res.result.success) {
          // 更新本地用户信息
          this.userInfo = res.result.userInfo
          
          // 更新本地存储
          uni.setStorageSync('userInfo', this.userInfo)
          
          uni.showToast({
            title: '绑定成功',
            icon: 'success'
          })
          
          // 跳转到首页
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }, 1500)
        } else {
          uni.showToast({
            title: res.result.message || '绑定失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('绑定手机号失败:', error)
        uni.showToast({
          title: '绑定失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    // 跳过绑定
    skipBind() {
      // 跳转到首页
      uni.switchTab({
        url: '/pages/index/index'
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
.bind-container {
  min-height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.bind-card {
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

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
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
}

.bind-tips {
  margin-bottom: 40rpx;
  text-align: center;
}

.tips-text {
  font-size: 30rpx;
  color: #333333;
}

.bind-buttons {
  width: 100%;
  margin-bottom: 30rpx;
}

.bind-btn, .skip-btn {
  width: 100%;
  height: 100rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
}

.bind-btn:active, .skip-btn:active {
  transform: translate(3rpx, 3rpx);
  box-shadow: 3rpx 3rpx 0px #000000;
}

.bind-btn {
  background-color: #FF6B6B;
}

.brutalist-btn-secondary {
  background-color: #FFE66D;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #000000;
}

.bind-note {
  font-size: 24rpx;
  color: #666666;
  text-align: center;
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