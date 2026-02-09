<template>
  <view class="brutalist-avatar" :style="avatarStyle">
    <image 
      v-if="src" 
      class="brutalist-avatar__image" 
      :src="src" 
      @error="handleImageError"
    />
    <text v-else class="brutalist-avatar__placeholder">
      {{ placeholderText }}
    </text>
  </view>
</template>

<script>
export default {
  name: 'BrutalistAvatar',
  props: {
    src: {
      type: String,
      default: ''
    },
    size: {
      type: [String, Number],
      default: 80
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageError: false
    }
  },
  computed: {
    avatarStyle() {
      return {
        width: `${this.size}rpx`,
        height: `${this.size}rpx`
      }
    },
    placeholderText() {
      if (this.name) {
        // 取名字的第一个字符
        return this.name.charAt(0).toUpperCase()
      }
      return '用'
    }
  },
  methods: {
    handleImageError() {
      this.imageError = true
    }
  }
}
</script>

<style scoped>
.brutalist-avatar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFFFFF;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
  transform: rotate(-1deg);
  overflow: hidden;
}

.brutalist-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brutalist-avatar__placeholder {
  font-size: 36rpx;
  font-weight: 900;
  color: #000000;
}
</style>