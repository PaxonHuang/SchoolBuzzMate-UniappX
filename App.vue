<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #FFFFFF;
  font-family: 'PingFang SC', sans-serif;
}

/* 粗野主义手绘风格基础样式 */
.brutalist-card {
  background-color: #FFFFFF;
  border: 8rpx solid #000000;
  box-shadow: 12rpx 12rpx 0px #000000;
  transform: rotate(-1deg);
}

.brutalist-btn {
  background-color: #FF6B6B;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
}

.brutalist-btn:active {
  transform: translate(3rpx, 3rpx);
  box-shadow: 3rpx 3rpx 0px #000000;
}

.brutalist-btn-secondary {
  background-color: #FFE66D;
}

.brutalist-text-primary {
  color: #000000;
}

.brutalist-text-secondary {
  color: #333333;
}

.brutalist-text-accent {
  color: #FF6B6B;
}

.brutalist-highlight {
  color: #FFE66D;
}
</style>