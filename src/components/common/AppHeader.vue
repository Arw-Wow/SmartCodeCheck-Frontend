<template>
  <header class="site-header">
    <div class="container header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">⚡</span> SmartCodeCheck
      </router-link>
      
      <nav class="main-nav">
        <router-link to="/" active-class="active">首页</router-link>
        <router-link to="/detection" active-class="active">代码检测</router-link>
        <router-link to="/comparison" active-class="active">代码对比</router-link>
      </nav>

      <div class="actions">
        <template v-if="!authStore.token">
          <router-link to="/login" class="btn-text">登录</router-link>
          <router-link to="/register" class="btn-primary-sm">注册</router-link>
        </template>

        <div v-else class="user-menu">
          <span class="username">👤 {{ authStore.user?.username || '用户' }}</span>
          <button @click="handleLogout" class="btn-logout" title="退出登录">
            <span class="icon">➜</span> 退出
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
  background: var(--panel-color);
  border-bottom: 1px solid var(--border-color);
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.3rem; font-weight: bold; display: flex; align-items: center; gap: 8px; color: var(--text-primary); text-decoration: none; }
.logo-icon { color: var(--primary-color); }

.main-nav { display: flex; gap: 25px; }
.main-nav a { color: var(--text-secondary); font-weight: 500; transition: color 0.2s; position: relative; }
.main-nav a:hover, .main-nav a.active { color: var(--text-primary); }
.main-nav a.active::after {
  content: ''; position: absolute; bottom: -18px; left: 0; width: 100%; height: 2px; background: var(--primary-color);
}

.actions { display: flex; align-items: center; gap: 15px; }
.btn-text { color: var(--text-secondary); font-size: 0.95rem; font-weight: 500; }
.btn-text:hover { color: var(--text-primary); }

.btn-primary-sm {
  background: var(--primary-color);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: filter 0.2s;
}
.btn-primary-sm:hover { filter: brightness(1.1); }

.user-menu { display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.05); padding: 5px 15px; border-radius: 20px; border: 1px solid var(--border-color); }
.username { font-size: 0.9rem; font-weight: 500; color: var(--text-primary); }
.btn-logout { 
  background: transparent; 
  color: var(--text-secondary); 
  font-size: 0.85rem; 
  display: flex; align-items: center; gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
}
.btn-logout:hover { color: var(--danger); background: rgba(218, 54, 51, 0.1); }
</style>