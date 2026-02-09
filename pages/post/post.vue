<template>
  <view class="post-container">
    <BrutalistCard :rotate="-1" class="post-card">
      <view class="input-area">
        <BrutalistInput 
          type="textarea" 
          placeholder="分享你的校园生活..." 
          v-model="postContent"
          :maxlength="500"
          class="content-input"
        />
        <text class="char-count">{{postContent.length}}/500</text>
      </view>
      
      <view class="image-area">
        <view class="image-list">
          <view class="image-item" v-for="(item, index) in imageList" :key="index">
            <image :src="item" mode="aspectFill" @tap="previewImage(index)"></image>
            <view class="delete-btn" @tap="deleteImage(index)">×</view>
          </view>
          
          <view class="add-image" v-if="imageList.length < 9" @tap="chooseImage">
            <text class="add-icon">+</text>
            <text class="add-text">添加图片</text>
          </view>
        </view>
      </view>
      
      <view class="post-actions">
        <BrutalistButton 
          text="取消" 
          type="secondary" 
          @click="cancelPost" 
          class="action-btn"
        />
        <BrutalistButton 
          text="发布" 
          :disabled="!canPost" 
          @click="submitPost" 
          class="action-btn"
        />
      </view>
    </BrutalistCard>
  </view>
</template>

<script>
export default {
  data() {
    return {
      postContent: '',
      imageList: [],
      uploadedImages: [], // 已上传的图片URL列表
      isSubmitting: false
    }
  },
  computed: {
    canPost() {
      return this.postContent.trim().length > 0 || this.imageList.length > 0
    }
  },
  onLoad() {
    // 检查登录状态
    this.checkLoginStatus()
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
      }
    },
    
    // 选择图片
    chooseImage() {
      const maxCount = 9 - this.imageList.length
      
      uni.chooseImage({
        count: maxCount,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.imageList = [...this.imageList, ...res.tempFilePaths]
        },
        fail: (err) => {
          console.error('选择图片失败:', err)
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      })
    },
    
    // 预览图片
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.imageList
      })
    },
    
    // 删除图片
    deleteImage(index) {
      this.imageList.splice(index, 1)
    },
    
    // 上传图片
    async uploadImages() {
      if (this.imageList.length === 0) {
        return []
      }
      
      uni.showLoading({
        title: '上传图片中...',
        mask: true
      })
      
      const token = uni.getStorageSync('token')
      const uploadPromises = []
      
      for (const imagePath of this.imageList) {
        // 读取图片为base64
        const base64 = await this.fileToBase64(imagePath)
        
        const uploadPromise = uniCloud.callFunction({
          name: 'upload-image',
          data: {
            token,
            fileContent: base64
          }
        })
        
        uploadPromises.push(uploadPromise)
      }
      
      try {
        const results = await Promise.all(uploadPromises)
        const uploadedUrls = results.map(result => {
          if (result.result.code === 0) {
            return result.result.data.tempFileURL
          } else {
            throw new Error(result.result.message)
          }
        })
        
        return uploadedUrls
      } catch (error) {
        console.error('上传图片失败:', error)
        uni.showToast({
          title: '上传图片失败',
          icon: 'none'
        })
        throw error
      } finally {
        uni.hideLoading()
      }
    },
    
    // 文件转base64
    fileToBase64(filePath) {
      return new Promise((resolve, reject) => {
        uni.getFileSystemManager().readFile({
          filePath,
          encoding: 'base64',
          success: (res) => {
            resolve(res.data)
          },
          fail: reject
        })
      })
    },
    
    // 取消发布
    cancelPost() {
      uni.showModal({
        title: '提示',
        content: '确定要取消发布吗？',
        success: (res) => {
          if (res.confirm) {
            uni.navigateBack()
          }
        }
      })
    },
    
    // 提交发布
    async submitPost() {
      if (!this.canPost) {
        uni.showToast({
          title: '请输入内容或添加图片',
          icon: 'none'
        })
        return
      }
      
      if (this.isSubmitting) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // 上传图片
        const uploadedImages = await this.uploadImages()
        
        // 调用发布接口
        const token = uni.getStorageSync('token')
        const result = await uniCloud.callFunction({
          name: 'publish-post',
          data: {
            token,
            content: this.postContent.trim(),
            images: uploadedImages,
            isPublic: true
          }
        })
        
        if (result.result.code === 0) {
          uni.showToast({
            title: '发布成功',
            icon: 'success'
          })
          
          // 返回上一页
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          uni.showToast({
            title: result.result.message || '发布失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('发布失败:', error)
        uni.showToast({
          title: '发布失败',
          icon: 'none'
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style>
.post-container {
  min-height: 100vh;
  background-color: #FFFFFF;
  padding: 20rpx;
}

.post-card {
  width: 100%;
  padding: 40rpx;
}

.input-area {
  margin-bottom: 40rpx;
}

.content-input {
  margin-bottom: 10rpx;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: #666666;
  margin-top: 10rpx;
}

.image-area {
  margin-bottom: 40rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  margin: 10rpx;
  position: relative;
  border: 4rpx solid #000000;
  box-shadow: 6rpx 6rpx 0px #000000;
}

.image-item image {
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #FF6B6B;
  border: 4rpx solid #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 24rpx;
  font-weight: bold;
}

.add-image {
  width: 200rpx;
  height: 200rpx;
  margin: 10rpx;
  border: 4rpx dashed #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
}

.add-icon {
  font-size: 60rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.add-text {
  font-size: 24rpx;
  color: #666666;
}

.post-actions {
  display: flex;
  justify-content: space-between;
}

.action-btn {
  width: 48%;
}
</style>