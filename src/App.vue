<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

const WHITE_LIST = [
  '/pages/login/index'
]

function checkLoginStatus(url) {
  if (!userStore.isLogin && !WHITE_LIST.includes(url)) {
    uni.redirectTo({ url: '/pages/login/index' })
    return false
  }
  return true
}

onLaunch(() => {
  // pinia-plugin-persistedstate 会自动从本地存储恢复状态
  // 无需手动解析存储数据
  
  // 启动时如果已登录，且当前页面是登录页，则跳转到课程页面
  if (userStore.isLogin) {
    const pages = getCurrentPages()
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      if (currentPage.route === 'pages/login/index') {
        uni.switchTab({ url: '/pages/course/index' })
      }
    }
  }
})

onShow(() => {
  // 每次页面显示时检查登录状态
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    checkLoginStatus('/' + currentPage.route)
  }
})

onHide(() => {})
</script>

<style>
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  color: #333333;
  background-color: #F5F5F5;
  box-sizing: border-box;
  line-height: 1.5;
}

view, text, button, input, textarea, image {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

image {
  display: block;
  width: auto;
  height: auto;
}

::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}

.container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F5F5F5;
}

.btn-primary {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #4A90D9;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 500;
  text-align: center;
  border-radius: 12rpx;
  border: none;
}

.btn-primary:active {
  background-color: #3A7BC8;
}

.btn-secondary {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #E8F4FD;
  color: #4A90D9;
  font-size: 32rpx;
  font-weight: 500;
  text-align: center;
  border-radius: 12rpx;
  border: 1rpx solid #4A90D9;
}

.btn-secondary:active {
  background-color: #D0E8FA;
}

.btn-disabled {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #CCCCCC;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 500;
  text-align: center;
  border-radius: 12rpx;
  border: none;
}

.btn-small {
  width: auto;
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
  border-radius: 8rpx;
}

.btn-radius {
  border-radius: 44rpx;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-primary {
  color: #4A90D9;
}

.text-secondary {
  color: #666666;
}

.text-muted {
  color: #999999;
}

.text-danger {
  color: #E74C3C;
}

.text-success {
  color: #27AE60;
}

.text-warning {
  color: #F39C12;
}

.bg-white {
  background-color: #FFFFFF;
}

.bg-primary {
  background-color: #4A90D9;
}

.bg-gray {
  background-color: #F5F5F5;
}

.margin-top-10 {
  margin-top: 10rpx;
}

.margin-top-20 {
  margin-top: 20rpx;
}

.margin-top-30 {
  margin-top: 30rpx;
}

.padding-10 {
  padding: 10rpx;
}

.padding-20 {
  padding: 20rpx;
}

.padding-30 {
  padding: 30rpx;
}

</style>
