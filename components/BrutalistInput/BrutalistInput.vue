<template>
  <view class="brutalist-input-container">
    <text class="brutalist-input__label" v-if="label">{{ label }}</text>
    <view class="brutalist-input-wrapper">
      <input 
        class="brutalist-input"
        :class="{ 'brutalist-input--error': error }"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :password="password"
        :maxlength="maxlength"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </view>
    <text class="brutalist-input__error" v-if="error">{{ error }}</text>
  </view>
</template>

<script>
export default {
  name: 'BrutalistInput',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    password: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [String, Number],
      default: 140
    },
    error: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.detail.value)
    },
    handleFocus(e) {
      this.$emit('focus', e)
    },
    handleBlur(e) {
      this.$emit('blur', e)
    }
  }
}
</script>

<style scoped>
.brutalist-input-container {
  margin: 30rpx 0;
}

.brutalist-input__label {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #000000;
  margin-bottom: 10rpx;
}

.brutalist-input-wrapper {
  position: relative;
}

.brutalist-input {
  width: 100%;
  height: 96rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  color: #000000;
  background: #FFFFFF;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
  transform: rotate(-0.5deg);
}

.brutalist-input--error {
  border-color: #FF6B6B;
  box-shadow: 6rpx 6rpx 0px #FF6B6B;
}

.brutalist-input__error {
  display: block;
  font-size: 26rpx;
  color: #FF6B6B;
  margin-top: 8rpx;
  font-weight: 700;
}
</style>