// 通用工具函数

// 防抖函数
export function debounce(func, wait) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

// 节流函数
export function throttle(func, wait) {
  let previous = 0
  return function(...args) {
    const now = Date.now()
    if (now - previous > wait) {
      func.apply(this, args)
      previous = now
    }
  }
}

// 格式化时间
export function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  
  // 小于1小时
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前'
  }
  
  // 小于1天
  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前'
  }
  
  // 小于7天
  if (diff < 604800000) {
    return Math.floor(diff / 86400000) + '天前'
  }
  
  // 超过7天，显示具体日期
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// 验证手机号
export function validatePhone(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 获取文件扩展名
export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// 生成随机ID
export function generateId(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// 深拷贝对象
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  
  const clonedObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }
  
  return clonedObj
}

// Toast提示工具
export function showToast(text, icon = 'none') {
  uni.showToast({
    title: text,
    icon,
    duration: 2000
  })
}

// 显示加载中
export function showLoading(title = '加载中...') {
  uni.showLoading({
    title,
    mask: true
  })
}

// 隐藏加载中
export function hideLoading() {
  uni.hideLoading()
}

// 显示确认对话框
export function showConfirm(content, title = '提示') {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title,
      content,
      success: (res) => {
        if (res.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail: () => {
        reject(new Error('显示确认对话框失败'))
      }
    })
  })
}

// 页面跳转工具
export function navigateTo(url) {
  uni.navigateTo({
    url,
    fail: (err) => {
      console.error('页面跳转失败:', err)
      showToast('页面跳转失败')
    }
  })
}

// 页面重定向
export function redirectTo(url) {
  uni.redirectTo({
    url,
    fail: (err) => {
      console.error('页面重定向失败:', err)
      showToast('页面重定向失败')
    }
  })
}

// 切换到TabBar页面
export function switchTab(url) {
  uni.switchTab({
    url,
    fail: (err) => {
      console.error('切换TabBar页面失败:', err)
      showToast('页面切换失败')
    }
  })
}

// 返回上一页
export function navigateBack(delta = 1) {
  uni.navigateBack({
    delta,
    fail: (err) => {
      console.error('返回上一页失败:', err)
      showToast('返回失败')
    }
  })
}

// 获取当前用户信息（从本地存储）
export function getCurrentUser() {
  try {
    const userInfo = uni.getStorageSync('userInfo')
    return userInfo ? JSON.parse(userInfo) : null
  } catch (e) {
    console.error('获取用户信息失败:', e)
    return null
  }
}

// 保存用户信息到本地存储
export function saveUserInfo(userInfo) {
  try {
    uni.setStorageSync('userInfo', JSON.stringify(userInfo))
    return true
  } catch (e) {
    console.error('保存用户信息失败:', e)
    return false
  }
}

// 清除用户信息
export function clearUserInfo() {
  try {
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('token')
    return true
  } catch (e) {
    console.error('清除用户信息失败:', e)
    return false
  }
}