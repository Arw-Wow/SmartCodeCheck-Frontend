<template>
  <div class="register-view">
    <div class="ambient-light">
      <div class="light-orb orb-1"></div>
      <div class="light-orb orb-2"></div>
    </div>

    <div class="register-container">
      <div class="glass-card">
        <div class="card-header">
          <div class="logo-area">🚀</div>
          <h2 class="title">创建账号</h2>
          <p class="subtitle">加入 SmartCodeCheck，体验智能代码审计</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-form" novalidate>
          <div class="form-group">
            <label>用户名</label>
            <div class="input-group" :class="{ 'focused': focusedField === 'username' }">
              <span class="input-icon">👤</span>
              <input 
                v-model="form.username" 
                type="text" 
                placeholder="设置您的 ID"
                @focus="focusedField = 'username'"
                @blur="focusedField = ''"
                @input="clearError('username')"
                :class="{ 'has-error': errors.username }"
              />
            </div>
            <transition name="fade-slide">
              <span class="error-msg" v-if="errors.username">{{ errors.username }}</span>
            </transition>
          </div>

          <div class="form-group">
            <label>邮箱 (可选)</label>
            <div class="input-group" :class="{ 'focused': focusedField === 'email' }">
              <span class="input-icon">📧</span>
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="example@email.com"
                @focus="focusedField = 'email'"
                @blur="focusedField = ''"
                @input="clearError('email')"
                :class="{ 'has-error': errors.email }"
              />
            </div>
            <transition name="fade-slide">
              <span class="error-msg" v-if="errors.email">{{ errors.email }}</span>
            </transition>
          </div>

          <div class="form-group">
            <label>密码</label>
            <div class="input-group" :class="{ 'focused': focusedField === 'password' }">
              <span class="input-icon">🔑</span>
              <input 
                v-model="form.password" 
                type="password" 
                placeholder="至少 6 位字符"
                @focus="focusedField = 'password'"
                @blur="focusedField = ''"
                @input="clearError('password')"
                :class="{ 'has-error': errors.password }"
              />
            </div>
            <transition name="fade-slide">
              <span class="error-msg" v-if="errors.password">{{ errors.password }}</span>
            </transition>
          </div>
          
          <button type="submit" class="btn-glow full-width" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>确认注册</span>
          </button>
        </form>

        <div class="footer-actions">
          <span>已有账号？</span>
          <router-link to="/login" class="link-text">立即登录 &rarr;</router-link>
        </div>
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
const focusedField = ref('')

const clearError = (field) => {
  errors[field] = ''
}

const validate = () => {
  let isValid = true
  
  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = '用户名至少需要 3 个字符'
    isValid = false
  }

  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度不能少于 6 位'
    isValid = false
  }

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
/* 复用 LoginView 的大部分样式，微调颜色 */
.register-view {
  position: relative;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 20px;
}

.ambient-light {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 0;
}
.light-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 12s infinite ease-in-out;
}
/* 紫色系光斑 */
.orb-1 { width: 350px; height: 350px; background: #8B5CF6; top: -50px; left: -50px; animation-delay: 0s; }
.orb-2 { width: 250px; height: 250px; background: #3B82F6; bottom: 0; right: 0; animation-delay: -3s; }

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -20px); }
}

.register-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  perspective: 1000px;
}

.glass-card {
  background: rgba(22, 27, 34, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-header { text-align: center; margin-bottom: 30px; }
.logo-area { font-size: 3rem; margin-bottom: 10px; text-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
.title { font-size: 1.8rem; font-weight: 700; color: #fff; margin: 0 0 8px 0; }
.subtitle { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }

.form-group { margin-bottom: 20px; position: relative; }
label { display: block; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }

.input-group {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}
.input-group:hover { border-color: rgba(255,255,255,0.2); }
.input-group.focused {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  background: rgba(0, 0, 0, 0.5);
}

.input-icon { padding: 0 16px; font-size: 1.1rem; opacity: 0.6; }

input {
  width: 100%;
  padding: 12px 16px 12px 0;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  outline: none;
}
input::placeholder { color: rgba(255,255,255,0.2); }

.has-error { border-color: var(--danger) !important; }
.error-msg {
  position: absolute;
  left: 0;
  bottom: -22px;
  font-size: 0.8rem;
  color: var(--danger);
  display: flex;
  align-items: center;
}
.error-msg::before { content: '⚠ '; margin-right: 4px; }

.btn-glow {
  position: relative;
  width: 100%;
  padding: 14px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.btn-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
  filter: brightness(1.1);
}
.btn-glow:active { transform: translateY(0); }
.btn-glow:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.footer-actions {
  margin-top: 25px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  border-top: 1px solid rgba(255,255,255,0.05);
  padding-top: 20px;
}
.link-text {
  color: var(--primary-color);
  font-weight: 600;
  margin-left: 5px;
  transition: color 0.2s;
}
.link-text:hover { color: #60A5FA; text-decoration: underline; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.2s; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-5px); }

.spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>