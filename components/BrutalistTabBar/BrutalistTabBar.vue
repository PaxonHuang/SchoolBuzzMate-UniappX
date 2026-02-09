<template>
  <view class="brutalist-tab-bar">
    <view 
      v-for="(tab, index) in tabs" 
      :key="index"
      class="brutalist-tab-bar__item"
      :class="{ 'brutalist-tab-bar__item--active': index === activeIndex }"
      @click="handleTabClick(index)"
    >
      <view class="brutalist-tab-bar__icon">
        <image 
          v-if="tab.icon" 
          :src="tab.icon" 
          class="brutalist-tab-bar__icon-image"
        />
      </view>
      <text class="brutalist-tab-bar__text">{{ tab.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BrutalistTabBar',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleTabClick(index) {
      this.$emit('change', index)
    }
  }
}
</script>

<style scoped>
.brutalist-tab-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: #FFFFFF;
  border-top: 4rpx solid #000000;
  box-shadow: 0 -6rpx 0px #000000;
  z-index: 999;
}

.brutalist-tab-bar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12rpx 0;
  position: relative;
}

.brutalist-tab-bar__item--active {
  background: #FFE66D;
}

.brutalist-tab-bar__item--active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6rpx;
  background: #FF6B6B;
  transform: rotate(-1deg);
}

.brutalist-tab-bar__icon {
  margin-bottom: 6rpx;
}

.brutalist-tab-bar__icon-image {
  width: 48rpx;
  height: 48rpx;
}

.brutalist-tab-bar__text {
  font-size: 24rpx;
  font-weight: 700;
  color: #000000;
}
</style>