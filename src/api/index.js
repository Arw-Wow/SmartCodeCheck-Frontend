// src/api/index.js
import axios from 'axios'

// 创建 axios 实例
const apiClient = axios.create({
  // 对应后端 app/main.py 中定义的 prefix "/api/v1"
  baseURL: 'http://localhost:8000/api/v1', 
  timeout: 60000, // LLM 分析较慢，设置 60秒超时
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器（可选，用于统一处理错误）
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default {
  // 检测接口
  analyzeCode(data) {
    return apiClient.post('/analyze', data)
  },
  // 对比接口
  compareCodes(data) {
    return apiClient.post('/compare', data)
  }
}