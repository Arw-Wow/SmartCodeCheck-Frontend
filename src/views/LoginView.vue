<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="card-header">
        <h2>👋 欢迎回来</h2>
        <p class="subtitle">登录以继续使用 SmartCodeCheck</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="auth-form" novalidate>
        <div class="form-group">
          <label>用户名</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input 
              v-model="form.username" 
              type="text" 
              placeholder="请输入用户名"
              :class="{ 'has-error': errors.username }"
              @input="clearError('username')"
            />
          </div>
          <span class="error-text" v-if="errors.username">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label>密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码"
              :class="{ 'has-error': errors.password }"
              @input="clearError('password')"
            />
          </div>
          <span class="error-text" v-if="errors.password">{{ errors.password }}</span>
        </div>
        
        <button type="submit" class="btn btn-primary full-width" :disabled="loading">
          <span v-if="loading" class="spinner-sm"></span>
          {{ loading ? '登录中...' : '立即登录' }}
        </button>
      </form>

      <div class="footer-link">
        还没有账号？ <router-link to="/register">免费注册</router-link>
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

const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })
const loading = ref(false)

const clearError = (field) => {
  errors[field] = ''
}

const validate = () => {
  let isValid = true
  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  }
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  }
  return isValid
}

const handleLogin = async () => {
  if (!validate()) return

  loading.value = true
  try {
    await authStore.login(form.username, form.password)
    toast.success(`欢迎回来, ${form.username}!`)
    router.push('/')
  } catch (err) {
    const msg = err.response?.data?.detail || '登录失败，请检查用户名或密码'
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 引入一些现代化的样式变量 */
.auth-container { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  min-height: 80vh; 
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
}

.auth-card { 
  width: 100%;
  max-width: 420px; 
  background: var(--panel-color); 
  padding: 40px; 
  border-radius: 16px; 
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}
/* .auth-card:hover { transform: translateY(-5px); } */

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
  pointer-events: none;
}

input { 
  width: 100%; 
  padding: 12px 12px 12px 40px; /*留出图标位置*/
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
  animation: slideDown 0.2s ease;
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
@keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>