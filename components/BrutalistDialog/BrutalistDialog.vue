<template>
  <view class="brutalist-dialog" v-if="visible" @click="handleMaskClick">
    <view class="brutalist-dialog__container" @click.stop>
      <view class="brutalist-dialog__header">
        <text class="brutalist-dialog__title">{{ title }}</text>
      </view>
      <view class="brutalist-dialog__content">
        <slot>
          <text class="brutalist-dialog__text">{{ content }}</text>
        </slot>
      </view>
      <view class="brutalist-dialog__footer">
        <BrutalistButton 
          v-if="showCancel" 
          type="secondary" 
          :text="cancelText" 
          @click="handleCancel"
        />
        <BrutalistButton 
          type="primary" 
          :text="confirmText" 
          @click="handleConfirm"
        />
      </view>
    </view>
  </view>
</template>

<script>
import BrutalistButton from '../BrutalistButton/BrutalistButton.vue'

export default {
  name: 'BrutalistDialog',
  components: {
    BrutalistButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    content: {
      type: String,
      default: ''
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleMaskClick() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.brutalist-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.brutalist-dialog__container {
  width: 80%;
  background: #FFFFFF;
  border: 4rpx solid #000000;
  box-shadow: 8rpx 8rpx 0px #000000;
  transform: rotate(-1deg);
  overflow: hidden;
}

.brutalist-dialog__header {
  padding: 32rpx 32rpx 16rpx;
  border-bottom: 4rpx solid #000000;
}

.brutalist-dialog__title {
  font-size: 36rpx;
  font-weight: 900;
  color: #000000;
}

.brutalist-dialog__content {
  padding: 32rpx;
}

.brutalist-dialog__text {
  font-size: 30rpx;
  color: #000000;
  line-height: 1.6;
}

.brutalist-dialog__footer {
  display: flex;
  padding: 16rpx 32rpx 32rpx;
  gap: 20rpx;
}

.brutalist-dialog__footer > view {
  flex: 1;
}
</style>