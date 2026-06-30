<template>
  <view class="page-container">
    <view class="info-header">
      <view class="avatar-area" @click="handleAvatarUpload">
        <image class="avatar-img" :src="userForm.avatar" mode="aspectFill" />
        <view class="upload-icon-wrap">
          <text class="upload-icon">+</text>
        </view>
      </view>
      <text class="user-name">{{ userForm.name }}</text>
      <text class="user-desc">青耘平台个人信息档案</text>
    </view>
    
    <view class="info-card">
      <view class="info-item">
        <text class="info-label">青耘ID</text>
        <text class="info-value">{{ userForm.id }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">姓名</text>
        <input class="info-input" v-model="userForm.name" placeholder="请输入姓名" />
      </view>
      <view class="info-item">
        <text class="info-label">手机号</text>
        <text v-if="rawPhone" class="info-value">{{ userForm.phone }}</text>
        <view v-else class="bind-btn" @click="handleBindPhone">
          <text class="bind-btn-text">绑定手机号</text>
        </view>
      </view>
      <view class="info-item">
        <text class="info-label">角色</text>
        <view class="role-tag">学生</view>
      </view>
      <view class="info-item">
        <text class="info-label">用户状态</text>
        <view class="status-tag">正常使用</view>
      </view>
      <view class="info-item">
        <text class="info-label">青耘积分</text>
        <view class="points-tag">{{ userForm.points }} 积分</view>
      </view>
      <view class="info-item">
        <text class="info-label">个人简介</text>
        <textarea 
          class="info-textarea" 
          v-model="userForm.introduction" 
          placeholder="请输入个人简介"
          :maxlength="500"
        />
      </view>
    </view>
    
    <view class="save-btn" @click="handleSave">
      <text class="save-btn-text">保存信息</text>
    </view>
    
    <view v-if="showBindModal" class="modal-overlay" @click="handleCloseModal">
      <view class="modal-content" @click.stop>
        <text class="modal-title">绑定手机号</text>
        
        <view class="modal-form">
          <input 
            class="modal-input" 
            v-model="bindForm.phone" 
            placeholder="请输入手机号"
            type="number"
            maxlength="11"
          />
          
          <view class="code-row">
            <input 
              class="modal-input code-input" 
              v-model="bindForm.code" 
              placeholder="请输入验证码"
              type="number"
              maxlength="6"
            />
            <view 
              class="get-code-btn" 
              :class="{ disabled: countdown > 0 || !bindForm.phone }"
              @click="handleSendCode"
            >
              <text class="get-code-text">{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
            </view>
          </view>
          
          <text class="modal-tip">若60s内未收到验证码请重新获取，同一手机号60s内仅可获取一次，验证码有效期五分钟。手机号一经绑定不可更改！</text>
        </view>
        
        <view class="modal-confirm-btn" @click="handleConfirmBind">
          <text class="modal-confirm-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import http from '@/utils/request'

const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20student%20avatar%20portrait%20friendly%20smile&image_size=square'

const userForm = reactive({
  id: '',
  name: '',
  phone: '',
  avatar: defaultAvatar,
  points: 0,
  introduction: '',
  role: 1,
  status: 1
})

const rawPhone = ref('')
const showBindModal = ref(false)
const countdown = ref(0)
const bindForm = reactive({
  phone: '',
  code: ''
})

onMounted(() => {
  fetchUserInfo()
})

function maskPhone(phone) {
  if (!phone || phone.length < 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

async function fetchUserInfo() {
  try {
    uni.showLoading({ title: '加载中...' })
    const res = await http.get('/info')
    console.log('获取接口返回:', res)
    if (res) {
      userForm.id = 'QY' + String(res.id).padStart(9, '0')
      userForm.name = res.name || ''
      rawPhone.value = res.phone || ''
      userForm.phone = maskPhone(res.phone) || ''
      userForm.avatar = res.avatar || defaultAvatar
      userForm.points = res.points || 0
      userForm.introduction = res.bio || ''
      userForm.role = res.role || 1
      userForm.status = res.status || 1
    }
  } catch (error) {
    console.error('获取个人信息失败:', error)
    uni.showToast({ title: '获取信息失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

function handleAvatarUpload() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      userForm.avatar = tempFilePath
      console.log('头像上传接口预留位置:', tempFilePath)
    },
    fail: () => {
      uni.showToast({ title: '选择图片失败', icon: 'none' })
    }
  })
}

function handleBindPhone() {
  showBindModal.value = true
}

function handleCloseModal() {
  showBindModal.value = false
}

async function handleSendCode() {
  if (countdown.value > 0 || !bindForm.phone) return
  
  if (bindForm.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  try {
    uni.showLoading({ title: '发送中...' })
    
    // TODO: 后续接入正式发送验证码接口
    console.log('发送验证码接口预留位置:', { phone: bindForm.phone })
    // const res = await http.post('/user/sms/send', { phone: bindForm.phone })
    
    // 模拟发送成功
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    uni.showToast({ title: '验证码已发送', icon: 'success' })
  } catch (error) {
    console.error('发送验证码失败:', error)
    uni.showToast({ title: '发送失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

async function handleConfirmBind() {
  if (!bindForm.phone || !bindForm.code) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  
  if (bindForm.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  if (bindForm.code.length !== 6) {
    uni.showToast({ title: '请输入6位验证码', icon: 'none' })
    return
  }
  
  try {
    uni.showLoading({ title: '绑定中...' })
    
    // TODO: 后续接入正式绑定手机号接口
    console.log('绑定手机号接口预留位置:', { phone: bindForm.phone, code: bindForm.code })
    // const res = await http.post('/user/mobile/bind', { phone: bindForm.phone, code: bindForm.code })
    
    // 模拟绑定成功
    rawPhone.value = bindForm.phone
    userForm.phone = maskPhone(bindForm.phone)
    showBindModal.value = false
    
    // 重置表单
    bindForm.phone = ''
    bindForm.code = ''
    
    uni.showToast({ title: '绑定成功', icon: 'success' })
  } catch (error) {
    console.error('绑定手机号失败:', error)
    uni.showToast({ title: '绑定失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

async function handleSave() {
  try {
    uni.showLoading({ title: '保存中...' })
    
    const updateData = {}
    if (userForm.name) updateData.name = userForm.name
    if (userForm.avatar && !userForm.avatar.includes('trae-api')) updateData.avatar = userForm.avatar
    if (userForm.introduction) updateData.bio = userForm.introduction
    
    if (Object.keys(updateData).length === 0) {
      uni.showToast({ title: '请至少修改一项信息', icon: 'none' })
      return
    }
    
    const res = await http.put('/info', updateData)
    console.log('保存接口返回:', res)
    
    if (res) {
      uni.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } catch (error) {
    console.error('保存个人信息失败:', error)
    uni.showToast({ title: '保存失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}
</script>

<style scoped>
page {
  background-color: #F5F5F5;
  min-height: 100vh;
}

.page-container {
  padding-bottom: 160rpx;
}

.info-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 30rpx 40rpx;
  background-color: #2E7D32;
}

.avatar-area {
  position: relative;
  margin-bottom: 20rpx;
}

.avatar-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 6rpx solid rgba(255, 255, 255, 0.3);
}

.upload-icon-wrap {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 56rpx;
  height: 56rpx;
  background-color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #2E7D32;
}

.upload-icon {
  font-size: 36rpx;
  color: #2E7D32;
  font-weight: 600;
}

.user-name {
  font-size: 40rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8rpx;
}

.user-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.info-card {
  margin: 30rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.info-item {
  display: flex;
  padding: 24rpx 30rpx;
  border-bottom: 2rpx solid #F5F5F5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  width: 140rpx;
  font-size: 28rpx;
  color: #666666;
  flex-shrink: 0;
}

.info-value {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.info-input {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.info-textarea {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
  min-height: 160rpx;
}

.role-tag, .status-tag {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.role-tag {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.status-tag {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.points-tag {
  padding: 6rpx 16rpx;
  background-color: #E8F5E9;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #4CAF50;
  font-weight: 600;
}

.save-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #2E7D32;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.save-btn-text {
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.bind-btn {
  padding: 12rpx 32rpx;
  background-color: #4CAF50;
  border-radius: 30rpx;
}

.bind-btn-text {
  font-size: 26rpx;
  color: #FFFFFF;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 600rpx;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 40rpx;
  box-sizing: border-box;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  text-align: center;
  display: block;
  margin-bottom: 40rpx;
}

.modal-form {
  margin-bottom: 40rpx;
}

.modal-input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
  margin-bottom: 24rpx;
}

.code-row {
  display: flex;
  gap: 20rpx;
}

.code-input {
  flex: 1;
  margin-bottom: 24rpx;
}

.get-code-btn {
  width: 200rpx;
  height: 88rpx;
  background-color: #4CAF50;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.get-code-btn.disabled {
  background-color: #CCCCCC;
}

.get-code-text {
  font-size: 26rpx;
  color: #FFFFFF;
}

.get-code-btn.disabled .get-code-text {
  color: #999999;
}

.modal-tip {
  font-size: 22rpx;
  color: #999999;
  line-height: 1.6;
}

.modal-confirm-btn {
  height: 88rpx;
  background-color: #4CAF50;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-confirm-text {
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 500;
}
</style>
