<template>
  <view class="comments-container">
    <!-- 顶部信息 -->
    <view class="header">
      <view class="post-info">
        <text class="comment-count">{{ totalComments }}条评论</text>
      </view>
    </view>
    
    <!-- 评论列表 -->
    <scroll-view 
      class="comments-scroll"
      scroll-y="true"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="refreshComments"
      @scrolltolower="loadMore"
    >
      <view v-if="loading" class="loading-container">
        <BrutalistLoading text="加载中..." />
      </view>
      
      <view v-else-if="commentList.length > 0" class="comment-list">
        <view v-for="(comment, index) in commentList" :key="comment._id" class="comment-item-container">
          <BrutalistCard :rotate="(index % 2 === 0) ? -0.5 : 0.5" class="comment-item">
            <!-- 评论内容 -->
            <view class="comment-content">
              <view class="comment-header">
                <BrutalistAvatar 
                  :src="comment.userInfo.avatar" 
                  :text="comment.userInfo.nickname" 
                  size="small"
                />
                <view class="user-info">
                  <text class="nickname">{{ comment.userInfo.nickname }}</text>
                  <text class="time">{{ formatTime(comment.createTime) }}</text>
                </view>
              </view>
              
              <text class="comment-text">{{ comment.content }}</text>
              
              <view class="comment-actions">
                <view class="action-btn" @tap="replyToComment(comment)">
                  <text class="action-text">回复</text>
                </view>
              </view>
            </view>
            
            <!-- 回复列表 -->
            <view v-if="comment.replies && comment.replies.length > 0" class="replies-container">
              <view 
                v-for="reply in comment.replies" 
                :key="reply._id"
                class="reply-item"
              >
                <view class="reply-header">
                  <BrutalistAvatar 
                    :src="reply.userInfo.avatar" 
                    :text="reply.userInfo.nickname" 
                    size="small"
                  />
                  <view class="user-info">
                    <text class="nickname">
                      {{ reply.userInfo.nickname }}
                      <text class="reply-to-text">回复 {{ comment.userInfo.nickname }}</text>
                    </text>
                    <text class="time">{{ formatTime(reply.createTime) }}</text>
                  </view>
                </view>
                
                <text class="reply-text">{{ reply.content }}</text>
                
                <view class="reply-actions">
                  <view class="action-btn" @tap="replyToComment(comment, reply)">
                    <text class="action-text">回复</text>
                  </view>
                </view>
              </view>
            </view>
          </BrutalistCard>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-else class="empty-container">
        <BrutalistCard :rotate="-1" class="empty-card">
          <text class="empty-text">还没有评论，快来发表第一条吧！</text>
        </BrutalistCard>
      </view>
      
      <!-- 加载更多 -->
      <view v-if="!isEnd && commentList.length > 0" class="load-more">
        <BrutalistLoading v-if="loadingMore" text="加载中..." />
      </view>
    </scroll-view>
    
    <!-- 评论输入框 -->
    <view class="input-container">
      <BrutalistCard :rotate="0" class="input-card">
        <BrutalistInput 
          v-model="commentContent" 
          :placeholder="replyTarget ? `回复 ${replyTarget.nickname}` : '发表评论'"
          class="comment-input"
          @confirm="submitComment"
        />
        <BrutalistButton 
          text="发送" 
          :disabled="!commentContent.trim()"
          @click="submitComment"
          class="submit-btn"
        />
      </BrutalistCard>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      postId: '',
      commentList: [],
      loading: true,
      loadingMore: false,
      refreshing: false,
      isEnd: false,
      currentPage: 1,
      pageSize: 10,
      totalComments: 0,
      commentContent: '',
      replyTarget: null // 回复目标，包含用户信息和评论ID
    }
  },
  onLoad(options) {
    // 检查登录状态
    if (!this.checkLoginStatus()) return
    
    this.postId = options.postId
    if (!this.postId) {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      })
      uni.navigateBack()
      return
    }
    
    // 加载评论列表
    this.loadComments()
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
    
    // 加载评论列表
    async loadComments(isRefresh = false) {
      if (isRefresh) {
        this.currentPage = 1
        this.isEnd = false
      }
      
      try {
        const token = uni.getStorageSync('token')
        const result = await uniCloud.callFunction({
          name: 'get-comments',
          data: {
            token,
            postId: this.postId,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        })
        
        if (result.result.code === 0) {
          const { comments, total } = result.result.data
          
          if (isRefresh) {
            this.commentList = comments
          } else {
            this.commentList = [...this.commentList, ...comments]
          }
          
          this.totalComments = total
          
          // 判断是否已加载全部数据
          if (this.commentList.length >= total) {
            this.isEnd = true
          }
        } else {
          uni.showToast({
            title: result.result.message || '加载失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('加载评论失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        this.loadingMore = false
        this.refreshing = false
      }
    },
    
    // 刷新评论
    refreshComments() {
      this.refreshing = true
      this.loadComments(true)
    },
    
    // 加载更多
    loadMore() {
      if (this.loadingMore || this.isEnd) return
      
      this.loadingMore = true
      this.currentPage++
      this.loadComments()
    },
    
    // 回复评论
    replyToComment(comment, reply = null) {
      if (reply) {
        this.replyTarget = {
          ...reply.userInfo,
          commentId: reply._id,
          parentCommentId: comment._id
        }
      } else {
        this.replyTarget = {
          ...comment.userInfo,
          commentId: comment._id,
          parentCommentId: null
        }
      }
      
      // 聚焦到输入框
      this.$nextTick(() => {
        this.commentContent = ''
      })
    },
    
    // 提交评论
    async submitComment() {
      const content = this.commentContent.trim()
      if (!content) {
        uni.showToast({
          title: '请输入评论内容',
          icon: 'none'
        })
        return
      }
      
      try {
        const token = uni.getStorageSync('token')
        const data = {
          token,
          postId: this.postId,
          content
        }
        
        // 如果是回复，添加replyTo参数
        if (this.replyTarget) {
          data.replyTo = this.replyTarget.commentId
        }
        
        const result = await uniCloud.callFunction({
          name: 'add-comment',
          data
        })
        
        if (result.result.code === 0) {
          // 清空输入框
          this.commentContent = ''
          this.replyTarget = null
          
          // 刷新评论列表
          this.refreshComments()
          
          uni.showToast({
            title: '评论成功',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: result.result.message || '评论失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('评论失败:', error)
        uni.showToast({
          title: '评论失败',
          icon: 'none'
        })
      }
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
      
      // 格式化日期
      return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
    }
  }
}
</script>

<style>
.comments-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #FFFFFF;
}

.header {
  padding: 20rpx;
  border-bottom: 4rpx solid #000000;
}

.post-info {
  display: flex;
  align-items: center;
}

.comment-count {
  font-size: 30rpx;
  font-weight: 700;
  color: #000000;
}

.comments-scroll {
  flex: 1;
  padding: 0 20rpx;
}

.loading-container, .empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-card {
  width: 90%;
  padding: 60rpx 40rpx;
  display: flex;
  justify-content: center;
}

.empty-text {
  font-size: 32rpx;
  color: #333333;
}

.comment-list {
  padding: 20rpx 0;
}

.comment-item-container {
  margin-bottom: 30rpx;
}

.comment-item {
  padding: 30rpx;
}

.comment-content {
  margin-bottom: 20rpx;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.user-info {
  margin-left: 20rpx;
}

.nickname {
  font-size: 28rpx;
  font-weight: 700;
  color: #000000;
  display: block;
}

.time {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-top: 5rpx;
}

.comment-text {
  font-size: 30rpx;
  color: #333333;
  line-height: 1.6;
  display: block;
  margin-bottom: 15rpx;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  padding: 5rpx 15rpx;
  border: 2rpx solid #000000;
}

.action-text {
  font-size: 26rpx;
  color: #333333;
}

.replies-container {
  border-top: 2rpx dashed #000000;
  padding-top: 20rpx;
  margin-top: 20rpx;
}

.reply-item {
  padding: 20rpx;
  background-color: #F5F5F5;
  border: 2rpx solid #000000;
  margin-bottom: 15rpx;
}

.reply-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.reply-to-text {
  font-size: 26rpx;
  color: #666666;
  margin-left: 10rpx;
}

.reply-text {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.5;
  display: block;
  margin-bottom: 10rpx;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 20rpx;
}

.input-container {
  padding: 20rpx;
  border-top: 4rpx solid #000000;
}

.input-card {
  display: flex;
  align-items: center;
  padding: 20rpx;
}

.comment-input {
  flex: 1;
  margin-right: 20rpx;
}

.submit-btn {
  width: 120rpx;
  height: 60rpx;
}
</style>