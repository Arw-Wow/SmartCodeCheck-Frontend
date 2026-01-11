<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="card-header">
        <h2>🚀 创建账号</h2>
        <p class="subtitle">开启您的代码质量检测之旅</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="auth-form" novalidate>
        <div class="form-group">
          <label>用户名</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input 
              v-model="form.username" 
              type="text" 
              placeholder="建议使用英文 ID"
              :class="{ 'has-error': errors.username }"
              @input="clearError('username')"
            />
          </div>
          <span class="error-text" v-if="errors.username">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label>邮箱 (可选)</label>
          <div class="input-wrapper">
            <span class="input-icon">📧</span>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="example@email.com"
              :class="{ 'has-error': errors.email }"
              @input="clearError('email')"
            />
          </div>
          <span class="error-text" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔑</span>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="至少 6 位字符"
              :class="{ 'has-error': errors.password }"
              @input="clearError('password')"
            />
          </div>
          <span class="error-text" v-if="errors.password">{{ errors.password }}</span>
        </div>
        
        <button type="submit" class="btn btn-primary full-width" :disabled="loading">
          <span v-if="loading" class="spinner-sm"></span>
          {{ loading ? '注册中...' : '确认注册' }}
        </button>
      </form>

      <div class="footer-link">
        已有账号？ <router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const form = reactive({ username: '', email: '', password: '' })
const errors = reactive({ username: '', email: '', password: '' })
const loading = ref(false)

const clearError = (field) => {
  errors[field] = ''
}

const validate = () => {
  let isValid = true
  
  // 用户名校验
  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = '用户名至少需要 3 个字符'
    isValid = false
  }

  // 密码校验
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度不能少于 6 位'
    isValid = false
  }

  // 邮箱校验 (如果不为空)
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '邮箱格式不正确'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validate()) return

  loading.value = true
  try {
    const emailToSend = form.email.trim() || undefined
    await authStore.register(form.username, form.password, emailToSend)
    
    toast.success('🎉 注册成功！正在跳转登录页...')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    
  } catch (err) {
    // 处理后端返回的具体错误
    const msg = err.response?.data?.detail || '注册失败，请稍后重试'
    
    if (msg.includes('username already exists')) {
      errors.username = '该用户名已被占用'
      toast.warning('用户名重复，请换一个试试')
    } else {
      toast.error(msg)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 样式复用 LoginView 的，这里为了完整性直接复制了部分核心样式，
   在实际项目中可以提取公共组件 */
.auth-container { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  min-height: 80vh; 
  background: radial-gradient(circle at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%); /* 注册页用紫色调一点的背景 */
}

.auth-card { 
  width: 100%;
  max-width: 420px; 
  background: var(--panel-color); 
  padding: 40px; 
  border-radius: 16px; 
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-header { text-align: center; margin-bottom: 30px; }
h2 { margin: 0 0 10px 0; font-size: 1.8rem; }
.subtitle { color: var(--text-secondary); margin: 0; font-size: 0.95rem; }

.form-group { margin-bottom: 20px; position: relative; }
label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: var(--text-secondary); }

.input-wrapper { position: relative; }
.input-icon { 
  position: absolute; 
  left: 12px; 
  top: 50%; 
  transform: translateY(-50%); 
  font-size: 1.1rem; 
  opacity: 0.6; 
}

input { 
  width: 100%; 
  padding: 12px 12px 12px 40px; 
  background: var(--bg-color); 
  border: 1px solid var(--border-color); 
  color: white; 
  border-radius: 8px; 
  box-sizing: border-box;
  font-size: 1rem;
  transition: all 0.2s ease;
}

input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  outline: none;
}

input.has-error {
  border-color: var(--danger);
  background: rgba(218, 54, 51, 0.05);
}

.error-text {
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.full-width { 
  width: 100%; 
  padding: 12px; 
  font-size: 1rem; 
  margin-top: 10px; 
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.footer-link { text-align: center; margin-top: 25px; font-size: 0.9rem; color: var(--text-secondary); }
.footer-link a { color: var(--primary-color); font-weight: 600; text-decoration: none; }
.footer-link a:hover { text-decoration: underline; }

.spinner-sm {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>