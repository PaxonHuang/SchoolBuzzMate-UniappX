<template>
  <view class="app">
    <view class="app-content">
      <!-- 自定义导航栏占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

      <!-- 页面内容 -->
      <router-view />
    </view>
  </view>
</template>

<script setup lang="uts">
import { ref } from 'vue'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
// 状态栏高度
const statusBarHeight = ref(0)

// 应用生命周期
onLaunch(() => {
  console.log('App Launch')

  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0

  // 初始化uni-id
  initUniId()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})

// 初始化uni-id
function initUniId() {
  // 在微信小程序中自动登录
  // #ifdef MP-WEIXIN
  try {
    uni.login({
      provider: 'weixin',
      success: (loginRes) => {
        console.log('微信登录成功', loginRes)
        // 登录成功后可以调用云函数进行后续处理
      },
      fail: (err) => {
        console.error('微信登录失败', err)
      }
    })
  } catch (e) {
    console.error('初始化登录失败:', e)
  }
  // #endif
}
</script>

<style lang="scss">
/* 全局样式 */
page {
  height: 100%;
  background-color: #f5f5f5;
}

.app {
  height: 100%;

  .app-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

/* 定义CSS变量 */
page {
  --uni-color-primary: #4CAF50;
  --uni-color-success: #4CAF50;
  --uni-color-warning: #FF9800;
  --uni-color-error: #F44336;
}
</style>