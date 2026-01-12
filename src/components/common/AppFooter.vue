<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="copyright">
        © 2025 SmartCodeCheck.
        <span class="divider">|</span>
        Designed for Developers
      </div>
      <div class="links">
        <a href="#" @click.prevent="openContact" class="link-item">Contact</a>
        <span class="divider">|</span>
        <span class="version">v0.1.0 Beta</span>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeContact">
        <div class="glass-modal">
          <div class="modal-header">
            <h3>📬 联系开发者</h3>
            <button class="btn-close" @click="closeContact">×</button>
          </div>
          
          <div class="modal-body">
            <p class="desc">有任何问题、Bug 反馈或功能建议，欢迎发送邮件。</p>
            
            <div 
              class="email-box" 
              @click="copyEmail" 
              title="点击复制邮箱"
              :class="{ 'clicked': copied }"
            >
              <div class="icon-circle">📧</div>
              <span class="email-text">hekaifeng70@gmail.com</span>
              
              <div class="action-tag">
                <span v-if="!copied">点击复制</span>
                <span v-else class="success-text">✅ 已复制</span>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <p class="tip">或者直接使用 <a href="mailto:hekaifeng70@gmail.com" class="inner-link">系统邮件应用</a></p>
          </div>
        </div>
      </div>
    </transition>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
const copied = ref(false)

const openContact = () => {
  showModal.value = true
  copied.value = false
}

const closeContact = () => {
  showModal.value = false
}

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('hekaifeng70@gmail.com')
    copied.value = true
    // 2秒后重置状态
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
    alert('复制失败，请手动复制')
  }
}
</script>

<style scoped>
/* --- Footer 基础样式 (保持之前的简约风) --- */
.app-footer {
  margin-top: auto;
  padding: 24px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: linear-gradient(to bottom, rgba(13,17,23,0), rgba(13,17,23,1));
  position: relative;
  z-index: 50; /* 保证 Footer 本身层级 */
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.copyright, .links { display: flex; align-items: center; }
.divider { margin: 0 10px; opacity: 0.3; }

.link-item {
  color: var(--text-secondary);
  transition: all 0.2s;
  text-decoration: none;
  cursor: pointer;
  border-bottom: 1px dashed transparent;
}
.link-item:hover { 
  color: var(--primary-color); 
  border-bottom-color: var(--primary-color);
}
.version { font-family: monospace; opacity: 0.5; }

/* --- 弹窗样式 --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px); /* 背景模糊 */
  z-index: 9999; /* 最顶层 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-modal {
  width: 90%;
  max-width: 420px;
  background: rgba(22, 27, 34, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-header {
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; color: white; }
.btn-close {
  background: transparent; border: none; color: var(--text-secondary);
  font-size: 1.5rem; cursor: pointer; line-height: 1; padding: 4px;
  transition: color 0.2s;
}
.btn-close:hover { color: #fff; }

.desc { margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; }

/* 邮箱盒子 */
.email-box {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px;
  border-radius: 12px;
  display: flex; align-items: center; gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.email-box:hover {
  border-color: var(--primary-color);
  background: rgba(59, 130, 246, 0.08);
  transform: translateY(-2px);
}
.email-box:active { transform: translateY(0); }

.icon-circle {
  width: 32px; height: 32px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
}

.email-text {
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  color: var(--primary-color);
  font-weight: 500;
}

.action-tag {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: rgba(255,255,255,0.05);
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}
.success-text { color: var(--success); font-weight: bold; }

/* 底部提示 */
.modal-footer { text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; }
.tip { margin: 0; font-size: 0.8rem; color: var(--text-secondary); opacity: 0.7; }
.inner-link { color: var(--primary-color); text-decoration: none; }
.inner-link:hover { text-decoration: underline; }

/* 动画定义 */
@keyframes modalPop {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* 移动端适配 */
@media (max-width: 600px) {
  .footer-content { flex-direction: column; gap: 10px; }
  .email-text { font-size: 0.9rem; }
}
</style>