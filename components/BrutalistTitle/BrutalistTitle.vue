<template>
  <text class="brutalist-title" :class="`brutalist-title--${size}`">
    <slot>{{ text }}</slot>
  </text>
</template>

<script>
export default {
  name: 'BrutalistTitle',
  props: {
    text: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: value => ['small', 'medium', 'large'].includes(value)
    }
  }
}
</script>

<style scoped>
.brutalist-title {
  display: block;
  color: #000000;
  font-weight: 900;
  margin: 20rpx 0;
}

.brutalist-title--small {
  font-size: 36rpx;
  transform: rotate(-0.5deg);
}

.brutalist-title--medium {
  font-size: 48rpx;
  transform: rotate(-1deg);
}

.brutalist-title--large {
  font-size: 60rpx;
  transform: rotate(-1.5deg);
}
</style>