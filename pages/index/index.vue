<template>
  <view class="index-container">
    <view class="header">
      <BrutalistTitle title="校园动态" size="large" :rotate="0.5" />
    </view>
    
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <BrutalistLoading text="加载中..." />
    </view>
    
    <!-- 动态列表 -->
    <view v-else-if="postList.length > 0" class="post-list">
      <view v-for="(item, index) in postList" :key="item._id" class="post-item-container">
        <BrutalistCard :rotate="(index % 2 === 0) ? -0.5 : 0.5" class="post-item">
          <!-- 用户信息 -->
          <view class="user-info" @tap="goToUserProfile(item.userId)">
            <BrutalistAvatar 
              :src="item.userInfo.avatar" 
              :text="item.userInfo.nickname" 
              size="medium"
            />
            <view class="user-detail">
              <text class="nickname">{{ item.userInfo.nickname }}</text>
              <text class="school" v-if="item.userInfo.school">{{ item.userInfo.school }}</text>
              <text class="time">{{ formatTime(item.createTime) }}</text>
            </view>
          </view>
          
          <!-- 动态内容 -->
          <view class="post-content">
            <text class="content-text" v-if="item.content">{{ item.content }}</text>
            
            <!-- 图片列表 -->
            <view class="image-grid" v-if="item.images && item.images.length">
              <view 
                v-for="(img, imgIndex) in item.images" 
                :key="imgIndex"
                class="image-item"
                @tap="previewImage(item.images, imgIndex)"
              >
                <image :src="img" mode="aspectFill" />
              </view>
            </view>
          </view>
          
          <!-- 互动区域 -->
          <view class="post-actions">
            <view class="action-item" @tap="likePost(item._id, item.isLiked, index)">
              <text class="action-icon">{{ item.isLiked ? '❤️' : '🤍' }}</text>
              <text class="action-text">{{ item.likes || 0 }}</text>
            </view>
            
            <view class="action-item" @tap="commentPost(item._id)">
              <text class="action-icon">💬</text>
              <text class="action-text">{{ item.comments || 0 }}</text>
            </view>
            
            <view class="action-item" @tap="sharePost(item._id)">
              <text class="action-icon">🔗</text>
              <text class="action-text">分享</text>
            </view>
          </view>
        </BrutalistCard>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view v-else class="empty-container">
      <BrutalistCard :rotate="-1" class="empty-card">
        <text class="empty-text">还没有动态，快来发布第一条吧！</text>
        <BrutalistButton 
          text="去发布" 
          type="primary" 
          @click="goToPost" 
          class="empty-button"
        />
      </BrutalistCard>
    </view>
    
    <!-- 加载更多 -->
    <view v-if="postList.length > 0 && !isEnd" class="load-more">
      <BrutalistButton 
        text="加载更多" 
        type="secondary" 
        @click="loadMore" 
        :loading="loadingMore"
      />
    </view>
    
    <!-- 已到底部 -->
    <view v-if="isEnd && postList.length > 0" class="no-more">
      <text class="no-more-text">— 已经到底啦 —</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      postList: [],
      loading: true,
      loadingMore: false,
      isEnd: false,
      currentPage: 1,
      pageSize: 10
    }
  },
  onLoad() {
    // 检查登录状态
    this.checkLoginStatus()
    // 加载动态列表
    this.loadPosts()
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.refreshData()
  },
  onReachBottom() {
    // 上拉加载更多
    this.loadMore()
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const token = uni.getStorageSync('token')
      if (!token) {
        // 没有token，跳转到登录页
        uni.redirectTo({
          url: '/pages/login/login'
        })
        return false
      }
      return true
    },
    
    // 加载动态列表
    async loadPosts(isRefresh = false) {
      if (isRefresh) {
        this.currentPage = 1
        this.isEnd = false
      }
      
      try {
        const token = uni.getStorageSync('token')
        const result = await uniCloud.callFunction({
          name: 'get-posts',
          data: {
            token,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        })
        
        if (result.result.code === 0) {
          const { posts, total, totalPages } = result.result.data
          
          if (isRefresh) {
            this.postList = posts
          } else {
            this.postList = [...this.postList, ...posts]
          }
          
          // 判断是否已加载全部数据
          if (this.currentPage >= totalPages) {
            this.isEnd = true
          }
        } else {
          uni.showToast({
            title: result.result.message || '加载失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('加载动态失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        this.loadingMore = false
        if (isRefresh) {
          uni.stopPullDownRefresh()
        }
      }
    },
    
    // 刷新数据
    refreshData() {
      this.loadPosts(true)
    },
    
    // 加载更多
    loadMore() {
      if (this.loadingMore || this.isEnd) return
      
      this.loadingMore = true
      this.currentPage++
      this.loadPosts()
    },
    
    // 点赞动态
    async likePost(postId, isLiked, index) {
      if (!this.checkLoginStatus()) return
      
      try {
        const token = uni.getStorageSync('token')
        const result = await uniCloud.callFunction({
          name: 'like-post',
          data: {
            token,
            postId
          }
        })
        
        if (result.result.code === 0) {
          const { isLiked: newIsLiked, likes } = result.result.data
          this.postList[index].isLiked = newIsLiked
          this.postList[index].likes = likes
        } else {
          uni.showToast({
            title: result.result.message || '操作失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('点赞失败:', error)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },
    
    // 评论动态（跳转到评论页）
    commentPost(postId) {
      uni.navigateTo({
        url: `/pages/comments/comments?postId=${postId}`
      })
    },
    
    // 分享动态
    sharePost(postId) {
      // TODO: 实现分享功能
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      })
    },
    
    // 跳转到用户主页
    goToUserProfile(userId) {
      // TODO: 实现用户主页
      uni.showToast({
        title: '用户主页开发中',
        icon: 'none'
      })
    },
    
    // 预览图片
    previewImage(images, current = 0) {
      uni.previewImage({
        current,
        urls: images
      })
    },
    
    // 格式化时间
    formatTime(time) {
      const now = new Date()
      const date = new Date(time)
      const diff = now - date
      
      // 一分钟内
      if (diff < 60 * 1000) {
        return '刚刚'
      }
      
      // 一小时内
      if (diff < 60 * 60 * 1000) {
        return Math.floor(diff / (60 * 1000)) + '分钟前'
      }
      
      // 一天内
      if (diff < 24 * 60 * 60 * 1000) {
        return Math.floor(diff / (60 * 60 * 1000)) + '小时前'
      }
      
      // 一个月内
      if (diff < 30 * 24 * 60 * 60 * 1000) {
        return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前'
      }
      
      // 格式化日期
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },
    
    // 跳转到发布页面
    goToPost() {
      uni.navigateTo({
        url: '/pages/post/post'
      })
    },
    
    // 跳转到个人中心
    goToProfile() {
      uni.navigateTo({
        url: '/pages/profile/profile'
      })
    }
  }
}
</script>

<style>
.index-container {
  min-height: 100vh;
  background-color: #FFFFFF;
  padding: 20rpx;
}

.header {
  padding: 20rpx 0;
  margin-bottom: 30rpx;
}

.loading-container, .empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400rpx;
}

.empty-card {
  width: 90%;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-text {
  font-size: 32rpx;
  color: #333333;
  margin-bottom: 40rpx;
  text-align: center;
}

.empty-button {
  width: 200rpx;
}

.post-list {
  margin-bottom: 40rpx;
}

.post-item-container {
  margin-bottom: 30rpx;
}

.post-item {
  padding: 30rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.user-detail {
  margin-left: 20rpx;
  flex: 1;
}

.nickname {
  font-size: 32rpx;
  font-weight: 700;
  color: #000000;
  display: block;
  margin-bottom: 5rpx;
}

.school {
  font-size: 26rpx;
  color: #666666;
  display: block;
  margin-bottom: 5rpx;
}

.time {
  font-size: 24rpx;
  color: #999999;
}

.post-content {
  margin-bottom: 20rpx;
}

.content-text {
  font-size: 30rpx;
  color: #333333;
  line-height: 1.6;
  display: block;
  margin-bottom: 20rpx;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin: 0 -5rpx;
}

.image-item {
  width: calc(33.33% - 10rpx);
  height: 200rpx;
  margin: 5rpx;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
  overflow: hidden;
}

.image-item image {
  width: 100%;
  height: 100%;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  padding-top: 20rpx;
  border-top: 4rpx solid #000000;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
}

.action-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.action-text {
  font-size: 26rpx;
  color: #333333;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 20rpx;
}

.no-more {
  display: flex;
  justify-content: center;
  padding: 30rpx;
}

.no-more-text {
  font-size: 28rpx;
  color: #999999;
}
</style>