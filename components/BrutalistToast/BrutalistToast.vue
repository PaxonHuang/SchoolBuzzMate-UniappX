<template>
  <transition name="fade">
    <view class="brutalist-toast" v-if="visible">
      <text class="brutalist-toast__text">{{ text }}</text>
    </view>
  </transition>
</template>

<script>
export default {
  name: 'BrutalistToast',
  props: {
    text: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      visible: false,
      timer: null
    }
  },
  methods: {
    show() {
      this.visible = true
      
      if (this.timer) {
        clearTimeout(this.timer)
      }
      
      this.timer = setTimeout(() => {
        this.hide()
      }, this.duration)
    },
    hide() {
      this.visible = false
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style scoped>
.brutalist-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-1deg);
  background: #000000;
  color: #FFFFFF;
  padding: 32rpx 48rpx;
  border-radius: 16rpx;
  z-index: 1001;
  max-width: 80%;
  text-align: center;
}

.brutalist-toast__text {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>