<template>
  <button 
    class="brutalist-button"
    :class="[
      `brutalist-button--${type}`,
      { 'brutalist-button--disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <text class="brutalist-button__text">{{ text }}</text>
  </button>
</template>

<script>
export default {
  name: 'BrutalistButton',
  props: {
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'primary', // primary, secondary, danger
      validator: value => ['primary', 'secondary', 'danger'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style scoped>
.brutalist-button {
  position: relative;
  width: 100%;
  height: 96rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFFFFF;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
  transform: rotate(-1deg);
  transition: transform 0.1s ease;
  margin: 20rpx 0;
}

.brutalist-button--disabled {
  opacity: 0.6;
  transform: rotate(-0.5deg);
}

.brutalist-button:active {
  transform: translateY(3rpx) rotate(-1deg);
  box-shadow: 3rpx 3rpx 0px #000000;
}

.brutalist-button--primary {
  background: #FF6B6B;
}

.brutalist-button--secondary {
  background: #FFE66D;
}

.brutalist-button--danger {
  background: #FFFFFF;
  border-color: #FF6B6B;
  color: #FF6B6B;
}

.brutalist-button__text {
  font-size: 32rpx;
  font-weight: 700;
  color: #000000;
}

.brutalist-button--danger .brutalist-button__text {
  color: #FF6B6B;
}
</style>