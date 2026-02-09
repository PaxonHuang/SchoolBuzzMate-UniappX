<template>
  <view 
    class="brutalist-card"
    :class="[
      `brutalist-card--${type}`,
      { 'brutalist-card--clickable': clickable }
    ]"
    @click="handleClick"
  >
    <view class="brutalist-card__content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BrutalistCard',
  props: {
    type: {
      type: String,
      default: 'default', // default, primary, secondary
      validator: value => ['default', 'primary', 'secondary'].includes(value)
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (this.clickable) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style scoped>
.brutalist-card {
  background: #FFFFFF;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
  transform: rotate(-1deg);
  margin: 20rpx 0;
  overflow: hidden;
}

.brutalist-card--clickable {
  transition: transform 0.1s ease;
}

.brutalist-card--clickable:active {
  transform: translateY(3rpx) rotate(-1deg);
  box-shadow: 3rpx 3rpx 0px #000000;
}

.brutalist-card--primary {
  background: #FF6B6B;
}

.brutalist-card--secondary {
  background: #FFE66D;
}

.brutalist-card__content {
  padding: 32rpx;
}
</style>