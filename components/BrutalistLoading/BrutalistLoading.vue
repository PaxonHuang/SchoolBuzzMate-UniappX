<template>
  <view class="brutalist-loading" v-if="visible">
    <view class="brutalist-loading__spinner">
      <view class="brutalist-loading__dot"></view>
      <view class="brutalist-loading__dot"></view>
      <view class="brutalist-loading__dot"></view>
    </view>
    <text v-if="text" class="brutalist-loading__text">{{ text }}</text>
  </view>
</template>

<script>
export default {
  name: 'BrutalistLoading',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style scoped>
.brutalist-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.brutalist-loading__spinner {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.brutalist-loading__dot {
  width: 16rpx;
  height: 16rpx;
  background: #000000;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.brutalist-loading__dot:nth-child(1) {
  animation-delay: -0.32s;
}

.brutalist-loading__dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.brutalist-loading__text {
  font-size: 30rpx;
  font-weight: 700;
  color: #000000;
  transform: rotate(-0.5deg);
}
</style>