<template>
  <view class="container">
    <BrutalistTitle size="large" text="粗野主义手绘风格组件库" />
    
    <!-- 按钮组件演示 -->
    <BrutalistTitle size="medium" text="按钮组件" />
    <BrutalistButton text="主要按钮" type="primary" @click="showToast('主要按钮点击')" />
    <BrutalistButton text="次要按钮" type="secondary" @click="showToast('次要按钮点击')" />
    <BrutalistButton text="危险按钮" type="danger" @click="showDialog" />
    <BrutalistButton text="禁用按钮" :disabled="true" />
    
    <!-- 输入框组件演示 -->
    <BrutalistTitle size="medium" text="输入框组件" />
    <BrutalistInput 
      label="用户名" 
      placeholder="请输入用户名" 
      v-model="username"
    />
    <BrutalistInput 
      label="密码" 
      type="password" 
      placeholder="请输入密码" 
      v-model="password"
    />
    <BrutalistInput 
      label="手机号" 
      placeholder="请输入手机号" 
      v-model="phone"
      error="请输入正确的手机号格式"
    />
    
    <!-- 卡片组件演示 -->
    <BrutalistTitle size="medium" text="卡片组件" />
    <BrutalistCard>
      <text style="font-size: 30rpx;">这是一个默认卡片组件</text>
    </BrutalistCard>
    <BrutalistCard type="primary">
      <text style="font-size: 30rpx;">这是一个主要卡片组件</text>
    </BrutalistCard>
    <BrutalistCard type="secondary" clickable @click="showToast('点击了次要卡片')">
      <text style="font-size: 30rpx;">这是一个可点击的次要卡片组件</text>
    </BrutalistCard>
    
    <!-- 头像组件演示 -->
    <BrutalistTitle size="medium" text="头像组件" />
    <view class="avatar-container">
      <BrutalistAvatar size="60" name="张三" />
      <BrutalistAvatar size="80" src="/static/images/default-avatar.png" name="李四" />
      <BrutalistAvatar size="100" name="王五" />
    </view>
    
    <!-- 标题组件演示 -->
    <BrutalistTitle size="medium" text="标题组件" />
    <BrutalistTitle size="small" text="小标题" />
    <BrutalistTitle size="medium" text="中标题" />
    <BrutalistTitle size="large" text="大标题" />
    
    <!-- 加载组件演示 -->
    <BrutalistTitle size="medium" text="加载组件" />
    <BrutalistLoading :visible="loadingVisible" text="正在加载中..." />
    <view style="margin: 20rpx 0;">
      <BrutalistButton text="切换加载状态" @click="toggleLoading" />
    </view>
    
    <!-- Toast组件演示 -->
    <view style="margin: 20rpx 0;">
      <BrutalistButton text="显示Toast" @click="showToast('这是一个Toast提示')" />
    </view>
    
    <!-- Dialog组件演示 -->
    <view style="margin: 20rpx 0;">
      <BrutalistButton text="显示Dialog" @click="showDialog" />
    </view>
    
    <!-- 底部导航栏演示 -->
    <BrutalistTitle size="medium" text="底部导航栏" />
    <BrutalistTabBar 
      :tabs="tabBarData" 
      :activeIndex="activeTabIndex"
      @change="handleTabChange"
    />
    
    <!-- Toast和Dialog组件 -->
    <BrutalistToast ref="toast" :text="toastText" />
    <BrutalistDialog 
      :visible="dialogVisible" 
      title="提示" 
      content="这是一个粗野主义风格的对话框"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
      @close="handleDialogClose"
    />
  </view>
</template>

<script>
import BrutalistTitle from '../../components/BrutalistTitle/BrutalistTitle.vue'
import BrutalistButton from '../../components/BrutalistButton/BrutalistButton.vue'
import BrutalistInput from '../../components/BrutalistInput/BrutalistInput.vue'
import BrutalistCard from '../../components/BrutalistCard/BrutalistCard.vue'
import BrutalistAvatar from '../../components/BrutalistAvatar/BrutalistAvatar.vue'
import BrutalistLoading from '../../components/BrutalistLoading/BrutalistLoading.vue'
import BrutalistTabBar from '../../components/BrutalistTabBar/BrutalistTabBar.vue'
import BrutalistToast from '../../components/BrutalistToast/BrutalistToast.vue'
import BrutalistDialog from '../../components/BrutalistDialog/BrutalistDialog.vue'

export default {
  components: {
    BrutalistTitle,
    BrutalistButton,
    BrutalistInput,
    BrutalistCard,
    BrutalistAvatar,
    BrutalistLoading,
    BrutalistTabBar,
    BrutalistToast,
    BrutalistDialog
  },
  data() {
    return {
      username: '',
      password: '',
      phone: '',
      loadingVisible: true,
      toastText: '',
      dialogVisible: false,
      activeTabIndex: 0,
      tabBarData: [
        { text: '首页', icon: '/static/images/home.png' },
        { text: '发布', icon: '/static/images/add.png' },
        { text: '我的', icon: '/static/images/user.png' }
      ]
    }
  },
  methods: {
    toggleLoading() {
      this.loadingVisible = !this.loadingVisible
    },
    showToast(text) {
      this.toastText = text
      this.$refs.toast.show()
    },
    showDialog() {
      this.dialogVisible = true
    },
    handleDialogConfirm() {
      this.dialogVisible = false
      this.showToast('点击了确定')
    },
    handleDialogCancel() {
      this.dialogVisible = false
      this.showToast('点击了取消')
    },
    handleDialogClose() {
      this.dialogVisible = false
    },
    handleTabChange(index) {
      this.activeTabIndex = index
      this.showToast(`切换到${this.tabBarData[index].text}`)
    }
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx;
  padding-bottom: 160rpx; /* 为底部导航留空间 */
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 30rpx;
  margin: 20rpx 0;
}
</style>