// src/api/index.js
import axios from 'axios'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1', 
  timeout: 60000, // 60秒超时，因为LLM生成较慢
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
apiClient.interceptors.response.use(
  response => response,
  error => {
    // 如果是取消请求造成的错误，不打印 Error Log
    if (error.name === 'CanceledError') {
      console.log('Request canceled by user')
    } else {
      console.error('API Error:', error)
    }
    return Promise.reject(error)
  }
)

export default {
  // 检测接口
  analyzeCode(data, signal) {
    return apiClient.post('/analyze', data, { signal }) // 增加 signal 参数用于取消
  },
  // 对比接口
  compareCodes(data, signal) {
    return apiClient.post('/compare', data, { signal }) // 增加 signal 参数用于取消
  }
}