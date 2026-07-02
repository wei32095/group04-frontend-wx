<template>
  <view class="course-detail-page">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
        <text class="back-text">返回课程列表</text>
      </view>
    </view>

    <view class="course-header">
      <text class="course-title">{{ courseInfo.courseTitle }}</text>
      <view class="course-meta">
        <text class="meta-item">授课老师: {{ courseInfo.teacherName }}</text>
        <view :class="['status-tag', courseInfo.status === 'active' ? 'status-active' : 'status-pending']">
          {{ courseInfo.status === 'active' ? '进行中' : '待加入' }}
        </view>
      </view>
    </view>

    <view class="tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-item', currentTab === tab.key ? 'tab-active' : '']"
        @click="switchTab(tab.key)"
      >
        {{ tab.name }}
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <view v-if="currentTab === 'detail'" class="tab-content">
        <view class="section">
          <text class="section-title">课堂详情</text>
          <text class="section-desc">{{ courseInfo.description }}</text>
        </view>

        <view class="info-cards">
          <view class="info-card">
            <text class="info-label">课程码</text>
            <text class="info-value">{{ courseInfo.courseCode }}</text>
          </view>
          <view class="info-card">
            <text class="info-label">学生人数</text>
            <text class="info-value">{{ courseInfo.studentCount }}人</text>
          </view>
          <view class="info-card">
            <text class="info-label">创建时间</text>
            <text class="info-value">{{ courseInfo.createdAt }}</text>
          </view>
        </view>

        <view class="section">
          <text class="section-title">课程封面</text>
          <view class="cover-wrap">
            <image 
              v-if="courseInfo.cover" 
              :src="courseInfo.cover" 
              class="cover-image"
              mode="aspectFill"
            />
            <view v-else class="cover-placeholder">
              <text class="placeholder-text">课程封面</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'classes'" class="tab-content">
        <view class="section">
          <text class="section-title">课堂列表</text>
          <view v-for="item in classList" :key="item.id" class="class-card">
            <view class="class-header">
              <text class="class-title">{{ item.title }}</text>
              <view class="class-tags">
                <view v-if="item.checkinStatus" :class="['checkin-tag', item.checkinStatus === 'signing' ? 'checkin-signing' : '']">
                  {{ item.checkinStatus === 'signing' ? '签到中' : '' }}
                </view>
                <view :class="['class-status-tag', item.status === 'ongoing' ? 'class-ongoing' : 'class-ended']">
                  {{ item.status === 'ongoing' ? '进行中' : '已结束' }}
                </view>
              </view>
            </view>
            <text class="class-time">{{ item.time }}</text>
            <view class="class-action">
              <text class="action-text" @click="enterClass(item)">进入课堂 →</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'resources'" class="tab-content">
        <view class="section">
          <text class="section-title">课程资源</text>
          <view v-for="item in resourceList" :key="item.id" class="resource-card">
            <view class="resource-icon">
              <text class="icon-text">{{ getFileIcon(item.name) }}</text>
            </view>
            <view class="resource-info">
              <text class="resource-name">{{ item.name }}</text>
              <text class="resource-desc">{{ item.description }}</text>
              <text class="resource-meta">上传者: {{ item.uploader }} | 下载{{ item.downloadCount }}次</text>
            </view>
            <view class="download-btn" @click="downloadResource(item)">
              <text class="download-text">下载</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'qa'" class="tab-content">
        <view class="section">
          <view class="section-header">
            <text class="section-title">互动问答</text>
            <view class="publish-btn" @click="publishQuestion">
              <text class="publish-text">发布问题</text>
            </view>
          </view>
          <view v-for="item in qaList" :key="item.id" class="qa-card">
            <view class="qa-author">
              <view class="avatar">
                <text class="avatar-text">{{ item.authorName.charAt(0) }}</text>
              </view>
              <view class="author-info">
                <text class="author-name">{{ item.authorName }}</text>
                <text class="qa-time">{{ item.time }}</text>
              </view>
              <view class="reply-count">
                <text class="reply-text">回复{{ item.replyCount }}</text>
              </view>
            </view>
            <text class="qa-title">{{ item.title }}</text>
            <text class="qa-content">{{ item.content }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-if="showPublishModal" class="modal-overlay" @click="closePublishModal">
      <view class="modal-content" @click.stop>
        <text class="modal-title">发布问题</text>
        <input class="modal-input" placeholder="问题标题" v-model="questionTitle" />
        <textarea class="modal-textarea" placeholder="问题描述" v-model="questionContent" />
        <view class="modal-actions">
          <view class="modal-btn modal-btn-cancel" @click="closePublishModal">
            <text>取消</text>
          </view>
          <view class="modal-btn modal-btn-confirm" @click="submitQuestion">
            <text>发布</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const courseId = ref('')
const currentTab = ref('detail')
const showPublishModal = ref(false)
const questionTitle = ref('')
const questionContent = ref('')

const tabs = [
  { key: 'detail', name: '课程详情' },
  { key: 'classes', name: '课堂列表' },
  { key: 'resources', name: '课程资源' },
  { key: 'qa', name: '互动问答' }
]

const courseInfo = ref({
  courseTitle: '',
  teacherName: '',
  status: 'active',
  description: '',
  courseCode: '',
  studentCount: 0,
  createdAt: '',
  cover: ''
})

const classList = ref([])
const resourceList = ref([])
const qaList = ref([])

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  courseId.value = currentPage.options?.courseId || ''
  fetchCourseDetail()
  fetchClassList()
  fetchResourceList()
  fetchQAList()
})

async function fetchCourseDetail() {
  try {
    // TODO: 调用课程详情接口
    // const res = await getCourseDetail({ courseId: courseId.value })
    // courseInfo.value = res || {}
    courseInfo.value = {
      courseTitle: '英语阅读与写作',
      teacherName: '张老师',
      status: 'active',
      description: '通过趣味短文学习地道表达，提升写作能力',
      courseCode: 'WRITE2026',
      studentCount: 2,
      createdAt: '2026-06-2',
      cover: ''
    }
  } catch (error) {
    console.error('获取课程详情失败:', error)
  }
}

async function fetchClassList() {
  try {
    // TODO: 调用课堂列表接口
    // const res = await getClassList({ courseId: courseId.value })
    // classList.value = res || []
    classList.value = [
      {
        id: 1,
        title: '第三讲: 听力',
        time: '2026-07-02 10:37 - 16:37',
        status: 'ongoing',
        checkinStatus: 'signing'
      },
      {
        id: 2,
        title: '第二讲: 阅读',
        time: '2026-07-02 10:35 - 12:35',
        status: 'ended',
        checkinStatus: ''
      },
      {
        id: 3,
        title: '第一讲: 如何写好一个段落',
        time: '2026-06-29 15:07 - 16:00',
        status: 'ended',
        checkinStatus: ''
      }
    ]
  } catch (error) {
    console.error('获取课堂列表失败:', error)
  }
}

async function fetchResourceList() {
  try {
    // TODO: 调用课程资源接口
    // const res = await getResourceList({ courseId: courseId.value })
    // resourceList.value = res || []
    resourceList.value = [
      {
        id: 1,
        name: 'ajo.txt',
        description: '',
        uploader: '张老师',
        downloadCount: 8
      },
      {
        id: 2,
        name: '范文集-我的周末.jpg',
        description: '优秀范文合集，供学生参考学习',
        uploader: '张老师',
        downloadCount: 12
      }
    ]
  } catch (error) {
    console.error('获取课程资源失败:', error)
  }
}

async function fetchQAList() {
  try {
    // TODO: 调用互动问答接口
    // const res = await getQAList({ courseId: courseId.value })
    // qaList.value = res || []
    qaList.value = [
      {
        id: 1,
        authorName: '李小明',
        time: '07-04 09:00',
        title: '段落的主题句一定要放在第一句吗？',
        content: '有时候看到文章的主题句在最后，这样写也可以吗？',
        replyCount: 1
      },
      {
        id: 2,
        authorName: '韦敏睿',
        time: '',
        title: '你好呀？',
        content: 'hi',
        replyCount: 0
      }
    ]
  } catch (error) {
    console.error('获取问答列表失败:', error)
  }
}

function goBack() {
  uni.navigateBack()
}

function switchTab(key) {
  currentTab.value = key
}

function getFileIcon(fileName) {
  const ext = fileName.split('.').pop().toLowerCase()
  if (ext === 'txt') return '📄'
  if (ext === 'jpg' || ext === 'png' || ext === 'jpeg') return '🖼️'
  if (ext === 'pdf') return '📕'
  if (ext === 'doc' || ext === 'docx') return '📘'
  if (ext === 'xls' || ext === 'xlsx') return '📗'
  return '📎'
}

function enterClass(item) {
  uni.showToast({ title: '进入课堂', icon: 'none' })
}

function downloadResource(item) {
  uni.showToast({ title: '开始下载', icon: 'none' })
}

function publishQuestion() {
  showPublishModal.value = true
}

function closePublishModal() {
  showPublishModal.value = false
  questionTitle.value = ''
  questionContent.value = ''
}

async function submitQuestion() {
  if (!questionTitle.value.trim()) {
    uni.showToast({ title: '请输入问题标题', icon: 'none' })
    return
  }
  try {
    // TODO: 调用发布问题接口
    // await publishQuestionApi({
    //   courseId: courseId.value,
    //   title: questionTitle.value,
    //   content: questionContent.value
    // })
    uni.showToast({ title: '发布成功', icon: 'success' })
    closePublishModal()
    await fetchQAList()
  } catch (error) {
    uni.showToast({ title: '发布失败', icon: 'none' })
  }
}
</script>

<style>
.course-detail-page {
  min-height: 100vh;
  background-color: #F5F7FA;
}

.header {
  padding: 20rpx 30rpx;
  background-color: #FFFFFF;
}

.back-btn {
  display: flex;
  align-items: center;
}

.back-btn .back-icon {
  font-size: 32rpx;
  color: #333333;
}

.back-btn .back-text {
  font-size: 28rpx;
  color: #666666;
  margin-left: 8rpx;
}

.course-header {
  padding: 30rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
}

.course-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 16rpx;
}

.course-meta {
  display: flex;
  align-items: center;
}

.course-meta .meta-item {
  font-size: 28rpx;
  color: #666666;
}

.status-tag {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  margin-left: 20rpx;
}

.status-tag.status-active {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.status-tag.status-pending {
  background-color: #FFF3E0;
  color: #EF6C00;
}

.tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #EEEEEE;
}

.tab-item {
  flex: 1;
  padding: 28rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #666666;
  position: relative;
}

.tab-item.tab-active {
  color: #2E7D32;
  font-weight: bold;
}

.tab-item.tab-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #2E7D32;
  border-radius: 2rpx;
}

.content {
  height: calc(100vh - 280rpx);
  padding: 20rpx;
}

.tab-content {
  padding-bottom: 40rpx;
}

.section {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 16rpx;
}

.section-desc {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

.info-cards {
  display: flex;
  margin-top: 20rpx;
}

.info-card {
  flex: 1;
  background-color: #F8FAFB;
  border-radius: 12rpx;
  padding: 24rpx 16rpx;
  text-align: center;
}

.info-card:first-child {
  margin-right: 16rpx;
}

.info-card:last-child {
  margin-left: 16rpx;
}

.info-label {
  font-size: 22rpx;
  color: #999999;
  display: block;
  margin-bottom: 10rpx;
}

.info-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.cover-wrap {
  margin-top: 16rpx;
}

.cover-image {
  width: 100%;
  height: 300rpx;
  border-radius: 12rpx;
}

.cover-placeholder {
  width: 100%;
  height: 300rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 28rpx;
  color: #CCCCCC;
}

.class-card {
  background-color: #F8FAFB;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.class-card:last-child {
  margin-bottom: 0;
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.class-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.class-tags {
  display: flex;
}

.checkin-tag {
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
  font-size: 20rpx;
}

.checkin-tag.checkin-signing {
  background-color: #FFEBEE;
  color: #C62828;
  margin-right: 10rpx;
}

.class-status-tag {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.class-status-tag.class-ongoing {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.class-status-tag.class-ended {
  background-color: #F5F5F5;
  color: #999999;
}

.class-time {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-bottom: 16rpx;
}

.class-action {
  text-align: right;
}

.action-text {
  font-size: 26rpx;
  color: #2E7D32;
}

.resource-card {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
}

.resource-card:last-child {
  border-bottom: none;
}

.resource-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: #E8F5E9;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.icon-text {
  font-size: 36rpx;
}

.resource-info {
  flex: 1;
}

.resource-name {
  font-size: 28rpx;
  color: #333333;
  display: block;
  margin-bottom: 6rpx;
}

.resource-desc {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-bottom: 6rpx;
}

.resource-meta {
  font-size: 22rpx;
  color: #CCCCCC;
}

.download-btn {
  background-color: #2E7D32;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
}

.download-text {
  font-size: 24rpx;
  color: #FFFFFF;
}

.publish-btn {
  background-color: #2E7D32;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
}

.publish-text {
  font-size: 24rpx;
  color: #FFFFFF;
}

.qa-card {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
}

.qa-card:last-child {
  border-bottom: none;
}

.qa-author {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.avatar {
  width: 56rpx;
  height: 56rpx;
  background-color: #E8F5E9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.avatar-text {
  font-size: 24rpx;
  color: #2E7D32;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 26rpx;
  color: #333333;
  display: block;
  margin-bottom: 4rpx;
}

.qa-time {
  font-size: 22rpx;
  color: #CCCCCC;
}

.reply-count {
  padding: 4rpx 12rpx;
  background-color: #F5F5F5;
  border-radius: 16rpx;
}

.reply-text {
  font-size: 22rpx;
  color: #999999;
}

.qa-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 10rpx;
}

.qa-content {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.6;
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
  padding: 30rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  text-align: center;
  margin-bottom: 30rpx;
}

.modal-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #EEEEEE;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

.modal-textarea {
  width: 100%;
  height: 200rpx;
  border: 1rpx solid #EEEEEE;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  margin-bottom: 30rpx;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
}

.modal-btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.modal-btn.modal-btn-cancel {
  background-color: #F5F5F5;
  color: #666666;
  margin-right: 20rpx;
}

.modal-btn.modal-btn-confirm {
  background-color: #2E7D32;
  color: #FFFFFF;
}
</style>