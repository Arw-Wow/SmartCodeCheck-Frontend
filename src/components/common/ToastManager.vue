<template>
  <div class="toast-container">
    <transition-group name="toast-fade">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id" 
        class="toast-item"
        :class="toast.type"
      >
        <div class="icon">
          <span v-if="toast.type === 'success'">✅</span>
          <span v-else-if="toast.type === 'error'">❌</span>
          <span v-else-if="toast.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="content">{{ toast.message }}</div>
        <button class="close-btn" @click="toastStore.remove(toast.id)">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
const toastStore = useToastStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none; /* 允许点击穿透到底层，除非点在 toast 上 */
}

.toast-item {
  pointer-events: auto;
  min-width: 300px;
  max-width: 400px;
  background: var(--panel-color);
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 4px solid var(--primary-color);
  font-size: 0.95rem;
  /* 玻璃拟态微效 */
  backdrop-filter: blur(10px);
  background: rgba(22, 27, 34, 0.9);
}

.toast-item.success { border-left-color: var(--success); }
.toast-item.error { border-left-color: var(--danger); }
.toast-item.warning { border-left-color: #f59e0b; }

.content { flex: 1; line-height: 1.4; }

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
}
.close-btn:hover { color: var(--text-primary); }

/* 动画效果 */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>