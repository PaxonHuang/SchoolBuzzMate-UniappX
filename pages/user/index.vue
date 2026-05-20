<template>
  <view class="page-container">
    <view class="page-doodle-1">✦</view>
    <view class="page-doodle-2">◉</view>

    <brutalist-card class="profile-header" taped accent>
      <view class="avatar-section" @click="chooseAvatar">
        <view class="avatar-wrapper">
          <image v-if="userInfo.avatar" class="avatar-image" :src="userInfo.avatar" mode="aspectFill" />
          <text v-else class="avatar-text">{{ userInfo.nickname?.charAt(0) || 'U' }}</text>
          <view class="avatar-edit">
            <text>📷</text>
          </view>
        </view>
        <text class="edit-hint">点击更换头像</text>
      </view>

      <view class="user-name-section">
        <text class="user-name">{{ userInfo.nickname || '校园用户' }}</text>
        <view class="edit-icon" @click="editNickname">✏️</view>
      </view>
    </brutalist-card>

    <brutalist-card class="info-card">
      <view class="info-title">
        <text>📋</text>
        <text>基本信息</text>
      </view>

      <view class="info-item" @click="showGenderPicker = true">
        <text class="label">性别</text>
        <view class="value">
          <text>{{ getGenderText(userInfo.gender) }}</text>
          <text class="arrow">→</text>
        </view>
      </view>

      <view class="info-item" @click="editContact">
        <text class="label">联系方式</text>
        <view class="value">
          <text>{{ userInfo.contact || '未设置' }}</text>
          <text class="arrow">→</text>
        </view>
      </view>
    </brutalist-card>

    <brutalist-card class="address-card">
      <view class="card-header">
        <view class="info-title">
          <text>📍</text>
          <text>收货地址</text>
        </view>
        <view class="add-btn" @click="addAddress">+ 新增</view>
      </view>

      <view v-if="addresses.length === 0" class="empty-address">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无收货地址</text>
      </view>

      <view v-else class="address-list">
        <view
          v-for="(addr, index) in addresses"
          :key="addr.id"
          class="address-item"
          @click="editAddress(index)"
        >
          <view class="address-header">
            <text class="address-name">{{ addr.name }}</text>
            <view class="address-actions">
              <text class="default-tag" v-if="addr.isDefault">默认</text>
              <text class="delete-btn" @click.stop="deleteAddress(index)">×</text>
            </view>
          </view>
          <text class="address-detail">
            {{ addr.campus }} · {{ addr.location }} · {{ addr.detail }}
          </text>
          <text class="address-phone">{{ addr.phone }}</text>
        </view>
      </view>
    </brutalist-card>

    <brutalist-button class="logout-btn" outline @click="handleLogout">
      退出登录
    </brutalist-button>

    <TabBar />

    <uni-popup ref="nicknamePopup" type="dialog">
      <view class="popup-content">
        <text class="popup-title">修改昵称</text>
        <input
          v-model="tempNickname"
          class="popup-input"
          placeholder="请输入新昵称"
          :maxlength="20"
        />
        <view class="popup-buttons">
          <text class="popup-btn cancel" @click="closeNicknamePopup">取消</text>
          <text class="popup-btn confirm" @click="saveNickname">确定</text>
        </view>
      </view>
    </uni-popup>

    <picker mode="selector" :range="genderOptions" :value="genderIndex" @change="onGenderChange" :show="showGenderPicker" @cancel="showGenderPicker = false">
      <view></view>
    </picker>

    <uni-popup ref="addressPopup" type="center">
      <view class="address-popup-content">
        <text class="popup-title">{{ editingAddressIndex >= 0 ? '编辑地址' : '新增地址' }}</text>

        <view class="form-group">
          <text class="form-label">联系人</text>
          <input
            v-model="addressForm.name"
            class="form-input"
            placeholder="请输入联系人姓名"
            :maxlength="10"
          />
        </view>

        <view class="form-group">
          <text class="form-label">手机号</text>
          <input
            v-model="addressForm.phone"
            class="form-input"
            type="number"
            placeholder="请输入手机号"
            :maxlength="11"
          />
        </view>

        <view class="form-group">
          <text class="form-label">校区</text>
          <picker mode="selector" :range="campusOptions" @change="onCampusChange">
            <view class="form-picker">
              <text>{{ addressForm.campus || '请选择校区' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <view class="form-group">
          <text class="form-label">位置类型</text>
          <picker mode="selector" :range="locationTypeOptions" @change="onLocationTypeChange">
            <view class="form-picker">
              <text>{{ addressForm.locationType || '请选择位置类型' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <view class="form-group">
          <text class="form-label">详细位置</text>
          <input
            v-model="addressForm.detail"
            class="form-input"
            placeholder="请输入详细位置"
            :maxlength="50"
          />
        </view>

        <view class="form-group checkbox-group">
          <checkbox :checked="addressForm.isDefault" @change="onDefaultChange" />
          <text class="checkbox-label">设为默认地址</text>
        </view>

        <view class="popup-buttons">
          <text class="popup-btn cancel" @click="closeAddressPopup">取消</text>
          <text class="popup-btn confirm" @click="saveAddress">保存</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="uts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import BrutalistCard from '@/components/brutalist/BrutalistCard.vue'
import BrutalistButton from '@/components/brutalist/BrutalistButton.vue'
import TabBar from '@/components/brutalist/TabBar.vue'

interface Address {
  id: string
  name: string
  phone: string
  campus: string
  locationType: string
  detail: string
  isDefault: boolean
}

const userStore = useUserStore()

const userInfo = computed(() => userStore.user || {
  nickname: '校园用户',
  avatar: '',
  gender: 'secret',
  contact: ''
})

const addresses = ref<Address[]>([])

const tempNickname = ref('')
const showGenderPicker = ref(false)
const genderIndex = ref(0)

const genderOptions = ['男', '女', '保密']
const campusOptions = ['主校区', '南校区', '北校区', '东校区']
const locationTypeOptions = ['校门', '教学楼', '宿舍楼', '食堂', '图书馆', '体育馆']

const editingAddressIndex = ref(-1)
const addressForm = ref<Address>({
  id: '',
  name: '',
  phone: '',
  campus: '',
  locationType: '',
  detail: '',
  isDefault: false
})

function getGenderText(gender?: string): string {
  const map: Record<string, string> = {
    'male': '男',
    'female': '女',
    'secret': '保密'
  }
  return map[gender || 'secret'] || '保密'
}

function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      uni.uploadFile({
        url: 'https://your-upload-url.com/upload',
        filePath: tempFilePath,
        name: 'file',
        success: (uploadRes) => {
          const data = JSON.parse(uploadRes.data)
          userStore.updateProfile({ avatar: data.url })
        }
      })
    }
  })
}

function editNickname() {
  tempNickname.value = userInfo.value.nickname || ''
}

function saveNickname() {
  if (!tempNickname.value.trim()) {
    uni.showToast({ title: '昵称不能为空', icon: 'none' })
    return
  }
  userStore.updateProfile({ nickname: tempNickname.value })
  uni.showToast({ title: '修改成功', icon: 'success' })
}

function closeNicknamePopup() {
}

function onGenderChange(e: any) {
  const index = e.detail.value
  const genderMap = ['male', 'female', 'secret']
  userStore.updateProfile({ gender: genderMap[index] })
  showGenderPicker.value = false
}

function editContact() {
  uni.showModal({
    title: '修改联系方式',
    editable: true,
    placeholderText: userInfo.value.contact || '请输入联系方式',
    success: (res) => {
      if (res.confirm && res.content) {
        userStore.updateProfile({ contact: res.content })
      }
    }
  })
}

function addAddress() {
  editingAddressIndex.value = -1
  addressForm.value = {
    id: '',
    name: '',
    phone: '',
    campus: '',
    locationType: '',
    detail: '',
    isDefault: false
  }
}

function editAddress(index: number) {
  editingAddressIndex.value = index
  addressForm.value = { ...addresses.value[index] }
}

function deleteAddress(index: number) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该地址吗？',
    success: (res) => {
      if (res.confirm) {
        addresses.value.splice(index, 1)
        saveAddresses()
      }
    }
  })
}

function onCampusChange(e: any) {
  addressForm.value.campus = campusOptions[e.detail.value]
}

function onLocationTypeChange(e: any) {
  addressForm.value.locationType = locationTypeOptions[e.detail.value]
}

function onDefaultChange(e: any) {
  addressForm.value.isDefault = e.detail.value[0]
}

function closeAddressPopup() {
  editingAddressIndex.value = -1
}

function saveAddress() {
  if (!addressForm.value.name.trim()) {
    uni.showToast({ title: '请输入联系人', icon: 'none' })
    return
  }
  if (!addressForm.value.phone) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  if (!/^1[3-9]\d{9}$/.test(addressForm.value.phone)) {
    uni.showToast({ title: '手机号格式错误', icon: 'none' })
    return
  }
  if (!addressForm.value.campus) {
    uni.showToast({ title: '请选择校区', icon: 'none' })
    return
  }
  if (!addressForm.value.locationType) {
    uni.showToast({ title: '请选择位置类型', icon: 'none' })
    return
  }
  if (!addressForm.value.detail.trim()) {
    uni.showToast({ title: '请输入详细位置', icon: 'none' })
    return
  }

  if (addressForm.value.isDefault) {
    addresses.value.forEach(addr => addr.isDefault = false)
  }

  const address = {
    ...addressForm.value,
    id: addressForm.value.id || 'addr_' + Date.now()
  }

  if (editingAddressIndex.value >= 0) {
    addresses.value[editingAddressIndex.value] = address
  } else {
    addresses.value.push(address)
  }

  saveAddresses()
  uni.showToast({ title: '保存成功', icon: 'success' })
}

function saveUserInfo() {
  userStore.setUserInfo(userInfo.value)
  uni.setStorageSync('userInfo', userInfo.value)
}

function saveAddresses() {
  uni.setStorageSync('addresses', addresses.value)
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    }
  })
}

function loadAddresses() {
  const saved = uni.getStorageSync('addresses')
  if (saved && Array.isArray(saved)) {
    addresses.value = saved
  }
}

loadAddresses()
</script>

<style lang="scss" scoped>
$black: #000000;
$white: #ffffff;
$red: #FF6B6B;
$teal: #4ECDC4;
$yellow: #FFE66D;

.page-container {
  min-height: 100vh;
  padding: 24rpx;
  padding-bottom: 160rpx;
  background: linear-gradient(180deg, #FFF9E6 0%, #ffffff 50%, #F0FFF4 100%);
  position: relative;
}

.page-doodle {
  &-1 {
    position: fixed;
    top: 120rpx;
    right: 40rpx;
    font-size: 48rpx;
    color: $teal;
    opacity: 0.3;
    animation: spin 12s linear infinite;
    z-index: 0;
  }

  &-2 {
    position: fixed;
    top: 400rpx;
    left: 40rpx;
    font-size: 36rpx;
    color: $yellow;
    opacity: 0.35;
    animation: pulse 3s ease-in-out infinite;
    z-index: 0;
  }
}

.profile-header {
  text-align: center;
  padding: 48rpx 32rpx !important;
  margin-bottom: 32rpx !important;

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24rpx;
  }

  .avatar-wrapper {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, $teal, #4ECDC4);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 6rpx 6rpx 0 $black;
    margin-bottom: 16rpx;
    overflow: hidden;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .avatar-text {
    font-size: 72rpx;
    font-weight: 900;
    color: $white;
  }

  .avatar-edit {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 48rpx;
    height: 48rpx;
    background: $yellow;
    border: 3rpx solid $black;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 3rpx 3rpx 0 $black;

    text {
      font-size: 24rpx;
    }
  }

  .edit-hint {
    font-size: 22rpx;
    color: #999;
  }

  .user-name-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
  }

  .user-name {
    font-size: 40rpx;
    font-weight: 900;
    color: $black;
  }

  .edit-icon {
    font-size: 32rpx;
    cursor: pointer;
  }
}

.info-card, .address-card {
  margin-bottom: 24rpx !important;
  padding: 32rpx 24rpx !important;
}

.info-title, .card-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 24rpx;

  text:first-child {
    font-size: 32rpx;
  }

  text:nth-child(2) {
    font-size: 28rpx;
    font-weight: 900;
    color: $black;
  }
}

.card-header {
  justify-content: space-between;
}

.add-btn {
  padding: 8rpx 16rpx;
  background: $teal;
  border: 2rpx solid $black;
  box-shadow: 2rpx 2rpx 0 $black;
  font-size: 22rpx;
  font-weight: 700;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx dashed #ddd;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 26rpx;
    font-weight: 700;
    color: #333;
  }

  .value {
    display: flex;
    align-items: center;
    gap: 8rpx;
    color: #666;

    text:first-child {
      font-size: 26rpx;
    }

    .arrow {
      font-size: 24rpx;
    }
  }
}

.empty-address {
  text-align: center;
  padding: 60rpx 0;

  .empty-icon {
    display: block;
    font-size: 64rpx;
    margin-bottom: 16rpx;
    opacity: 0.5;
  }

  .empty-text {
    display: block;
    font-size: 26rpx;
    color: #999;
  }
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.address-item {
  padding: 20rpx;
  border: 3rpx solid $black;
  background: $white;
  box-shadow: 3rpx 3rpx 0 $black;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.address-name {
  font-size: 28rpx;
  font-weight: 700;
}

.address-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.default-tag {
  padding: 4rpx 8rpx;
  background: $teal;
  border: 2rpx solid $black;
  font-size: 20rpx;
  font-weight: 700;
}

.delete-btn {
  font-size: 32rpx;
  color: $red;
  font-weight: 700;
}

.address-detail {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
  line-height: 1.4;
}

.address-phone {
  display: block;
  font-size: 22rpx;
  color: #999;
}

.logout-btn {
  margin-top: 32rpx;
  width: 100%;
}

.popup-content, .address-popup-content {
  background: $white;
  padding: 48rpx 32rpx;
  border: 4rpx solid $black;
  box-shadow: 6rpx 6rpx 0 $black;
  width: 600rpx;
}

.popup-title {
  display: block;
  font-size: 36rpx;
  font-weight: 900;
  color: $black;
  text-align: center;
  margin-bottom: 32rpx;
}

.popup-input {
  width: 100%;
  padding: 20rpx;
  border: 3rpx solid $black;
  background: #F5F5F5;
  font-size: 28rpx;
  margin-bottom: 32rpx;
  box-shadow: 3rpx 3rpx 0 $black;
}

.form-group {
  margin-bottom: 24rpx;

  .form-label {
    display: block;
    font-size: 24rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 12rpx;
  }

  .form-input {
    width: 100%;
    padding: 16rpx 20rpx;
    border: 3rpx solid $black;
    background: $white;
    font-size: 26rpx;
    box-shadow: 3rpx 3rpx 0 $black;
  }

  .form-picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 20rpx;
    border: 3rpx solid $black;
    background: $white;
    box-shadow: 3rpx 3rpx 0 $black;

    text:first-child {
      font-size: 26rpx;
    }

    .picker-arrow {
      font-size: 20rpx;
      color: #999;
    }
  }

  &.checkbox-group {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 16rpx 20rpx;
    border: 3rpx solid $black;
    background: $white;

    .checkbox-label {
      font-size: 26rpx;
    }
  }
}

.popup-buttons {
  display: flex;
  gap: 16rpx;
  margin-top: 32rpx;
}

.popup-btn {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 700;
  border: 3rpx solid $black;
  box-shadow: 3rpx 3rpx 0 $black;

  &.cancel {
    background: #F5F5F5;
  }

  &.confirm {
    background: $teal;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
</style>
