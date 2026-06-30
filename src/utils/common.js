function formatDate(date, format = 'YYYY-MM-DD') {
  const d = typeof date === 'string' ? new Date(date) : date
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return ''
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return formatDate(date, format)
}

function formatTime(date, format = 'HH:mm:ss') {
  return formatDate(date, format)
}

function getRelativeTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return ''
  }

  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`
  } else {
    return `${Math.floor(diff / year)}年前`
  }
}

function isValidMobile(mobile) {
  if (!mobile || typeof mobile !== 'string') {
    return false
  }
  const reg = /^1[3-9]\d{9}$/
  return reg.test(mobile.trim())
}

function isValidCode(code, length = 6) {
  if (!code || typeof code !== 'string') {
    return false
  }
  const reg = new RegExp(`^\\d{${length}}$`)
  return reg.test(code.trim())
}

function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false
  }
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email.trim())
}

function isValidIDCard(idCard) {
  if (!idCard || typeof idCard !== 'string') {
    return false
  }
  const reg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
  return reg.test(idCard.trim())
}

function formatNumber(num, decimals = 0) {
  if (isNaN(num)) {
    return '0'
  }
  const parsed = parseFloat(num)
  return parsed.toFixed(decimals)
}

function formatPrice(price, symbol = '') {
  if (isNaN(price)) {
    return `${symbol}0.00`
  }
  const parsed = parseFloat(price)
  return `${symbol}${parsed.toFixed(2)}`
}

function formatThousand(num) {
  if (isNaN(num)) {
    return '0'
  }
  const parsed = parseFloat(num)
  return parsed.toLocaleString('zh-CN')
}

function debounce(func, wait) {
  let timeout = null
  return function (...args) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

function throttle(func, limit) {
  let inThrottle = false
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

function generateUUID() {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  if (typeof obj === 'object') {
    const cloned = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
}

function isEmpty(value) {
  if (value === null || value === undefined) {
    return true
  }
  if (typeof value === 'string' && value.trim() === '') {
    return true
  }
  if (Array.isArray(value) && value.length === 0) {
    return true
  }
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true
  }
  return false
}

export {
  formatDate,
  formatDateTime,
  formatTime,
  getRelativeTime,
  isValidMobile,
  isValidCode,
  isValidEmail,
  isValidIDCard,
  formatNumber,
  formatPrice,
  formatThousand,
  debounce,
  throttle,
  generateUUID,
  getRandomInt,
  deepClone,
  isEmpty
}

export default {
  formatDate,
  formatDateTime,
  formatTime,
  getRelativeTime,
  isValidMobile,
  isValidCode,
  isValidEmail,
  isValidIDCard,
  formatNumber,
  formatPrice,
  formatThousand,
  debounce,
  throttle,
  generateUUID,
  getRandomInt,
  deepClone,
  isEmpty
}