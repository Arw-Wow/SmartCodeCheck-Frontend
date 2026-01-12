{
type: uploaded file
fileName: arw-wow/smartcodecheck-frontend/SmartCodeCheck-Frontend-f6d694c11d44bf7ccc5adc25c0bbf4a895ccfa9d/src/components/common/AppHeader.vue
fullContent:
<template>
  <header class="site-header glass-effect">
    <div class="container header-inner">
      <router-link to="/" class="logo-wrapper">
        <div class="logo-icon-box">
          <span class="logo-icon">⚡</span>
        </div>
        <span class="logo-text">SmartCodeCheck</span>
      </router-link>
      
      <nav class="main-nav">
        <router-link to="/" active-class="active" class="nav-link">
          <span class="link-content">首页</span>
        </router-link>
        <router-link to="/detection" active-class="active" class="nav-link">
          <span class="link-content">代码检测</span>
        </router-link>
        <router-link to="/comparison" active-class="active" class="nav-link">
          <span class="link-content">代码对比</span>
        </router-link>
      </nav>

      <div class="actions">
        <template v-if="!authStore.token">
          <router-link to="/login" class="btn-ghost">登录</router-link>
          <router-link to="/register" class="btn-primary-glow">注册</router-link>
        </template>

        <div v-else class="user-pill">
          <div class="avatar-circle">
            {{ authStore.user?.username?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <span class="username">{{ authStore.user?.username }}</span>
          <div class="divider-vertical"></div>
          <button @click="handleLogout" class="btn-logout" title="退出登录">
            <span class="icon">➜</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 0;
  transition: all 0.3s ease;
}

.glass-effect {
  background: rgba(13, 17, 23, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

/* Logo */
.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  group: hover;
}

.logo-icon-box {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.logo-wrapper:hover .logo-icon-box {
  transform: rotate(15deg) scale(1.1);
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

/* Navigation */
.main-nav {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px;
  border-radius: 99px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
  color: #fff;
  background: var(--primary-color);
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
}

/* Buttons & User */
.actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-ghost {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.2s;
}
.btn-ghost:hover { color: var(--text-primary); }

.btn-primary-glow {
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  color: white;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
}

.btn-primary-glow:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
  transform: translateY(-1px);
}

/* User Pill */
.user-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid var(--border-color);
  padding: 4px 6px 4px 12px;
  border-radius: 30px;
  transition: all 0.3s;
}

.user-pill:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(30, 30, 30, 0.8);
}

.avatar-circle {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #FF6B6B, #EE5253);
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.username {
  font-size: 0.85rem;
  color: var(--text-primary);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.divider-vertical {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.1);
}

.btn-logout {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: transparent;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: rgba(218, 54, 51, 0.2);
  color: #ff6b6b;
}
</style>
}