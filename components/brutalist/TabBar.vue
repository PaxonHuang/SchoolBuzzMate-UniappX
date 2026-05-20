<template>
  <view class="brutalist-tabbar-container">
    <!-- 背景装饰涂鸦 -->
    <view class="tabbar-doodle-1">✦</view>
    <view class="tabbar-doodle-2">◉</view>

    <view class="brutalist-tabbar">
      <view
        v-for="(item, index) in tabBarList"
        :key="index"
        class="tab-item"
        :class="{ 'active': activePage === item.pagePath }"
        @click="switchTab(item.pagePath)"
      >
        <!-- 胶带装饰（激活状态） -->
        <view v-if="activePage === item.pagePath" class="tab-tape"></view>

        <!-- 图标容器 -->
        <view class="tab-icon-wrapper" :class="{ 'icon-active': activePage === item.pagePath }">
          <text class="tab-icon">{{ item.emoji }}</text>
        </view>

        <!-- 文本标签 -->
        <text class="tab-text">{{ item.text }}</text>

        <!-- 激活指示器 -->
        <view v-if="activePage === item.pagePath" class="active-indicator"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="uts">
import { ref, onMounted } from 'vue';

interface TabItem {
  pagePath: string;
  text: string;
  emoji: string;
}

const tabBarList: TabItem[] = [
  {
    pagePath: 'pages/index/index',
    text: '首页',
    emoji: '🏠'
  },
  {
    pagePath: 'pages/buddy/index',
    text: '找搭子',
    emoji: '👥'
  },
  {
    pagePath: 'pages/delivery/index',
    text: '跑腿',
    emoji: '📦'
  },
  {
    pagePath: 'pages/forum/index',
    text: '论坛',
    emoji: '📝'
  },
  {
    pagePath: 'pages/messages/index',
    text: '消息',
    emoji: '💬'
  }
];

const activePage = ref('');

const switchTab = (pagePath: string) => {
  activePage.value = pagePath;
  uni.switchTab({
    url: '/' + pagePath
  });
};

onMounted(() => {
  const pages = getCurrentPages();
  if (pages.length) {
    activePage.value = pages[pages.length - 1].route as string;
  }
});
</script>

<style lang="scss" scoped>
// 野兽派配色方案
$black: #000000;
$white: #ffffff;
$red: #FF6B6B;
$teal: #4ECDC4;
$yellow: #FFE66D;

.brutalist-tabbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

// 涂鸦装饰
.tabbar-doodle {
  &-1 {
    position: absolute;
    bottom: 140rpx;
    left: 20rpx;
    font-size: 32rpx;
    color: $teal;
    opacity: 0.6;
    animation: spin 8s linear infinite;
  }

  &-2 {
    position: absolute;
    bottom: 140rpx;
    right: 20rpx;
    font-size: 28rpx;
    color: $yellow;
    opacity: 0.6;
    animation: pulse 2s ease-in-out infinite;
  }
}

.brutalist-tabbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 4rpx solid $black;
  background: $white;
  padding: 12rpx 0 24rpx;
  position: relative;
  box-shadow: 0 -4rpx 0 $black;

  // 顶部不规则边缘
  &::before {
    content: '';
    position: absolute;
    top: -4rpx;
    left: 0;
    right: 0;
    height: 4rpx;
    background: repeating-linear-gradient(
      90deg,
      $black 0rpx,
      $black 8rpx,
      transparent 8rpx,
      transparent 16rpx
    );
  }
}

.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx 16rpx;
  width: 100%;
  transition: all 0.2s ease;

  // 激活状态
  &.active {
    .tab-text {
      color: $black;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1rpx;
    }

    .tab-icon-wrapper {
      background: $yellow;
      border-color: $black;
      box-shadow: 4rpx 4rpx 0 $black;
      transform: translateY(-4rpx);
    }
  }

  // 点击效果
  &:active {
    transform: scale(0.95);
  }
}

// 胶带装饰
.tab-tape {
  position: absolute;
  top: -6rpx;
  left: 50%;
  transform: translateX(-50%) rotate(-1deg);
  width: 32rpx;
  height: 12rpx;
  background: rgba(255, 107, 107, 0.8);
  z-index: 1;
}

// 图标容器
.tab-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border: 3rpx solid transparent;
  border-radius: 50%;
  margin-bottom: 8rpx;
  transition: all 0.2s ease;
  background: $white;
  box-shadow: 2rpx 2rpx 0 rgba(0, 0, 0, 0.1);

  // 不规则边缘
  clip-path: polygon(
    5% 0%, 95% 2%, 100% 95%, 95% 100%,
    5% 98%, 0% 5%, 2% 0%
  );

  &.icon-active {
    animation: bounce 0.4s ease;
  }
}

.tab-icon {
  font-size: 44rpx;
  line-height: 1;
}

.tab-text {
  font-size: 22rpx;
  color: #666;
  font-weight: 600;
  transition: all 0.2s ease;
}

// 激活指示器
.active-indicator {
  position: absolute;
  bottom: -4rpx;
  width: 48rpx;
  height: 6rpx;
  background: $red;
  border-radius: 3rpx;
  border: 2rpx solid $black;

  // 不规则形状
  clip-path: polygon(
    5% 0%, 95% 0%, 100% 50%, 95% 100%,
    5% 100%, 0% 50%
  );
}

// 动画
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(-4rpx); }
  50% { transform: translateY(-8rpx); }
}
</style>
