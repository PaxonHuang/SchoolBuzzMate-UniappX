<template>
  <view class="page-container">
    <!-- 页面背景装饰 -->
    <view class="page-doodle-1">✦</view>

    <!-- 返回导航 -->
    <view class="nav-back" @click="goBack">
      <text class="back-icon">←</text>
      <text class="back-text">返回</text>
    </view>

    <!-- 标题卡片 -->
    <brutalist-card class="header-card" taped accent>
      <text class="header-title">发布跑腿</text>
      <text class="header-subtitle">互助便利，轻松搞定</text>
    </brutalist-card>

    <!-- 表单卡片 -->
    <brutalist-card class="form-card">
      <!-- 标题输入 -->
      <view class="form-group">
        <text class="form-label">
          <text>📝</text>
          <text>任务标题</text>
          <text class="required">*</text>
        </text>
        <brutalist-input
          v-model="formData.title"
          placeholder="例如：帮忙取个快递"
          :maxlength="30"
          show-count
          taped
        />
      </view>

      <!-- 任务类型 -->
      <view class="form-group">
        <text class="form-label">
          <text>🏷️</text>
          <text>任务类型</text>
          <text class="required">*</text>
        </text>
        <view class="tag-grid">
          <view
            v-for="tag in deliveryTags"
            :key="tag"
            class="tag-item"
            :class="{ 'active': formData.tags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            <text>{{ getTagEmoji(tag) }}</text>
            <text>{{ tag }}</text>
          </view>
        </view>
      </view>

      <!-- 详细描述 -->
      <view class="form-group">
        <text class="form-label">
          <text>✍️</text>
          <text>详细描述</text>
          <text class="required">*</text>
        </text>
        <view class="textarea-wrapper">
          <textarea
            v-model="formData.description"
            class="form-textarea"
            placeholder="请详细描述你的需求，包括取件地点、送达地点等..."
            :maxlength="300"
          />
          <text class="char-count">{{ formData.description.length }}/300</text>
        </view>
      </view>

      <!-- 跑腿费 -->
      <view class="form-group">
        <text class="form-label">
          <text>💰</text>
          <text>跑腿费</text>
          <text class="required">*</text>
        </text>
        <view class="amount-selector">
          <view
            v-for="amount in presetAmounts"
            :key="amount"
            class="amount-item"
            :class="{ 'active': formData.amount === amount }"
            @click="selectAmount(amount)"
          >
            <text>¥{{ amount }}</text>
          </view>
          <view
            class="amount-item custom"
            :class="{ 'active': isCustomAmount }"
            @click="showCustomInput"
          >
            <text v-if="!isCustomAmount">自定义</text>
            <input
              v-else
              v-model="customAmount"
              class="custom-input"
              type="digit"
              placeholder="金额"
              @input="onCustomAmountInput"
            />
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <brutalist-button
        class="submit-btn"
        accent
        taped
        arrow
        large
        @click="submitRequest"
      >
        发布需求
      </brutalist-button>
    </brutalist-card>

    <!-- 提示 -->
    <view class="tips">
      <text class="tips-text">💡 请确保信息准确，接单后会尽快联系您</text>
    </view>
  </view>
</template>

<script setup lang="uts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import BrutalistCard from '@/components/brutalist/BrutalistCard.vue'
import BrutalistButton from '@/components/brutalist/BrutalistButton.vue'
import BrutalistInput from '@/components/brutalist/BrutalistInput.vue'

interface FormData {
  title: string
  description: string
  tags: string[]
  amount: number
}

const userStore = useUserStore()
const formData = ref<FormData>({
  title: '',
  description: '',
  tags: [],
  amount: 5
})

const deliveryTags = [
  '取快递', '买饭', '打印', '代购', '送东西', '其他'
]

const presetAmounts = [3, 5, 8, 10, 15]
const customAmount = ref('')
const isCustomAmount = computed(() => {
  return !presetAmounts.includes(formData.value.amount)
})

function getTagEmoji(tag: string): string {
  const emojiMap: Record<string, string> = {
    '取快递': '📦',
    '买饭': '🍜',
    '打印': '📄',
    '代购': '🛒',
    '送东西': '🚚',
    '其他': '📌'
  }
  return emojiMap[tag] || '🏷️'
}

function toggleTag(tag: string) {
  const index = formData.value.tags.indexOf(tag)
  if (index === -1) {
    formData.value.tags = [tag] // 单选
  } else {
    formData.value.tags = []
  }
}

function selectAmount(amount: number) {
  formData.value.amount = amount
  customAmount.value = ''
}

function showCustomInput() {
  formData.value.amount = 0
  customAmount.value = ''
}

function onCustomAmountInput(e: any) {
  const val = parseFloat(e.detail.value)
  if (val > 0) {
    formData.value.amount = val
  }
}

function goBack() {
  uni.navigateBack()
}

async function submitRequest() {
  // 检查登录
  if (!userStore.isLoggedIn) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    return
  }

  // 验证标题
  if (!formData.value.title.trim()) {
    uni.showToast({
      title: '请输入标题',
      icon: 'none'
    })
    return
  }

  // 验证类型
  if (formData.value.tags.length === 0) {
    uni.showToast({
      title: '请选择任务类型',
      icon: 'none'
    })
    return
  }

  // 验证描述
  if (!formData.value.description.trim()) {
    uni.showToast({
      title: '请输入描述',
      icon: 'none'
    })
    return
  }

  // 验证金额
  if (formData.value.amount <= 0) {
    uni.showToast({
      title: '请输入跑腿费',
      icon: 'none'
    })
    return
  }

  uni.showLoading({ title: '发布中...' })

  try {
    const db = uniCloud.database()

    await db.collection('requests').add({
      type: 'delivery',
      title: formData.value.title,
      description: formData.value.description,
      tags: formData.value.tags,
      amount: formData.value.amount,
      creator: userStore.user?._id || 'user_' + Date.now(),
      creatorName: userStore.user?.nickname || '校园用户',
      status: 'open',
      createTime: Date.now()
    })

    uni.hideLoading()
    uni.showToast({
      title: '发布成功！',
      icon: 'success'
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.hideLoading()
    console.error('发布失败:', e)

    // 降级处理：使用本地存储模拟
    const mockRequest = {
      _id: 'req_' + Date.now(),
      title: formData.value.title,
      description: formData.value.description,
      tags: formData.value.tags,
      amount: formData.value.amount,
      creator: userStore.user?._id || 'user_' + Date.now(),
      creatorName: userStore.user?.nickname || '校园用户',
      createTime: Date.now(),
      status: 'open'
    }

    // 保存到本地
    const requests = uni.getStorageSync('mock_requests') || []
    requests.unshift(mockRequest)
    uni.setStorageSync('mock_requests', requests)

    uni.showToast({
      title: '发布成功（本地）',
      icon: 'success'
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
}
</script>

<style lang="scss" scoped>
// 野兽派配色方案
$black: #000000;
$white: #ffffff;
$red: #FF6B6B;
$teal: #4ECDC4;
$yellow: #FFE66D;

.page-container {
  min-height: 100vh;
  padding: 24rpx;
  padding-bottom: 48rpx;
  background: linear-gradient(180deg, #FFF9E6 0%, #ffffff 50%, #FFE6F0 100%);
  position: relative;
}

// 背景涂鸦
.page-doodle-1 {
  position: fixed;
  top: 100rpx;
  right: 30rpx;
  font-size: 40rpx;
  color: $red;
  opacity: 0.3;
  animation: spin 10s linear infinite;
  z-index: 0;
}

// 返回导航
.nav-back {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  padding: 12rpx 0;

  .back-icon {
    font-size: 36rpx;
    font-weight: 900;
    margin-right: 8rpx;
  }

  .back-text {
    font-size: 26rpx;
    font-weight: 700;
  }
}

// 标题卡片
.header-card {
  text-align: center;
  padding: 32rpx 24rpx !important;
  margin-bottom: 24rpx !important;

  .header-title {
    display: block;
    font-size: 40rpx;
    font-weight: 900;
    color: $black;
    margin-bottom: 8rpx;
  }

  .header-subtitle {
    display: block;
    font-size: 24rpx;
    color: #666;
  }
}

// 表单卡片
.form-card {
  padding: 32rpx 24rpx !important;
}

.form-group {
  margin-bottom: 32rpx;

  .form-label {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 12rpx;
    font-size: 26rpx;
    font-weight: 900;

    text:first-child {
      font-size: 28rpx;
    }

    .required {
      color: $red;
    }
  }
}

// 标签网格
.tag-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.tag-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  padding: 16rpx 12rpx;
  border: 3rpx solid $black;
  background: $white;
  box-shadow: 3rpx 3rpx 0 $black;
  transition: all 0.2s ease;

  text:first-child {
    font-size: 32rpx;
  }

  text:last-child {
    font-size: 22rpx;
    font-weight: 700;
  }

  &.active {
    background: $yellow;
    transform: translate(-2rpx, -2rpx);
    box-shadow: 5rpx 5rpx 0 $black;
  }

  &:active {
    transform: translate(2rpx, 2rpx);
    box-shadow: 1rpx 1rpx 0 $black;
  }
}

// 文本域
.textarea-wrapper {
  position: relative;

  .form-textarea {
    width: 100%;
    min-height: 200rpx;
    padding: 20rpx;
    border: 4rpx solid $black;
    background: $white;
    font-size: 28rpx;
    line-height: 1.6;
    box-shadow: 4rpx 4rpx 0 $black;

    clip-path: polygon(
      1% 0%, 98% 1%, 99% 98%, 1% 100%
    );
  }

  .char-count {
    position: absolute;
    bottom: 16rpx;
    right: 16rpx;
    font-size: 22rpx;
    color: #999;
  }
}

// 金额选择
.amount-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.amount-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100rpx;
  padding: 16rpx 24rpx;
  border: 3rpx solid $black;
  background: $white;
  box-shadow: 3rpx 3rpx 0 $black;
  font-size: 28rpx;
  font-weight: 700;
  transition: all 0.2s ease;

  &.active {
    background: $red;
    color: $white;
    transform: translate(-2rpx, -2rpx);
    box-shadow: 5rpx 5rpx 0 $black;
  }

  &:active {
    transform: translate(2rpx, 2rpx);
    box-shadow: 1rpx 1rpx 0 $black;
  }

  &.custom {
    .custom-input {
      width: 80rpx;
      text-align: center;
      font-size: 28rpx;
      font-weight: 700;
    }
  }
}

.submit-btn {
  width: 100%;
  margin-top: 24rpx;
}

// 提示
.tips {
  text-align: center;
  padding: 24rpx;

  .tips-text {
    font-size: 24rpx;
    color: #999;
  }
}

// 动画
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
