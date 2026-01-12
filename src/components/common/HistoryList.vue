{
type: uploaded file
fileName: arw-wow/smartcodecheck-frontend/SmartCodeCheck-Frontend-f6d694c11d44bf7ccc5adc25c0bbf4a895ccfa9d/src/components/common/HistoryList.vue
fullContent:
<template>
  <div class="history-list">
    <div v-if="loading" class="state-box">
      <div class="spinner"></div>
      <p>同步云端数据...</p>
    </div>

    <div v-else-if="records.length === 0" class="state-box empty">
      <div class="icon">📜</div>
      <p>暂无历史记录</p>
      <span class="sub">您的分析结果将自动保存在这里</span>
    </div>
    
    <div v-else class="list-container">
      <transition-group name="list-anim">
        <div 
          v-for="item in records" 
          :key="item.id" 
          class="history-card"
          :class="item.type"
          @click="$emit('restore', item)"
        >
          <div class="card-header">
            <div class="meta-left">
              <span class="type-pill" :class="item.type">
                {{ item.type === 'detection' ? 'ANALYSIS' : 'VS COMPARE' }}
              </span>
              <span class="time-text">{{ formatTime(item.created_at) }}</span>
            </div>
            
            <button class="btn-delete" @click.stop="$emit('delete', item.id)" title="删除记录">
              <span class="trash-icon">🗑️</span>
            </button>
          </div>
          
          <div class="card-body">
            <div class="lang-tag">
              <span class="dot" :style="{ background: getLangColor(item.data.language) }"></span>
              {{ item.data.language }}
            </div>

            <div class="score-display">
              <div v-if="item.type === 'detection'" class="single-score">
                 <span class="val" :class="getScoreClass(item.data.results?.score)">
                   {{ item.data.results?.score ?? '--' }}
                 </span>
                 <span class="label">分</span>
              </div>
              
              <div v-else class="vs-score">
                 <div class="s-block">
                   <span class="l">A</span>
                   <span class="v a-color">{{ item.data.results?.score_a ?? '-' }}</span>
                 </div>
                 <div class="vs-divider">/</div>
                 <div class="s-block">
                   <span class="l">B</span>
                   <span class="v b-color">{{ item.data.results?.score_b ?? '-' }}</span>
                 </div>
              </div>
            </div>
          </div>

          <div class="code-snippet">
             <code>{{ getCodePreview(item) }}</code>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
defineProps({
  records: Array,
  loading: Boolean
})

defineEmits(['restore', 'delete'])

const formatTime = (timeStr) => {
  const d = new Date(timeStr)
  // 简单的“刚才”、“今天”逻辑可以加在这里，这里保持标准格式
  return d.toLocaleString('zh-CN', {
    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const getScoreClass = (score) => {
  if (!score) return 'gray'
  if (score >= 90) return 'green'
  if (score >= 70) return 'orange'
  return 'red'
}

const getLangColor = (lang) => {
  const map = { Python: '#3572A5', Java: '#b07219', 'C++': '#f34b7d', JavaScript: '#f1e05a', Go: '#00ADD8' }
  return map[lang] || '#8B949E'
}

const getCodePreview = (item) => {
  const code = item.type === 'detection' ? item.data.code : item.data.codeA;
  if (!code) return '// No code content...';
  // 截取前两行或前60字符
  const lines = code.split('\n').slice(0, 2).join(' ').slice(0, 60);
  return lines + '...'
}
</script>

<style scoped>
.history-list { height: 100%; display: flex; flex-direction: column; }

/* 状态展示 */
.state-box {
  padding: 40px; text-align: center; color: var(--text-secondary);
  display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;
}
.state-box .icon { font-size: 2.5rem; margin-bottom: 10px; opacity: 0.5; }
.state-box .sub { font-size: 0.8rem; margin-top: 5px; opacity: 0.5; }

.spinner {
  width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1);
  border-top-color: var(--primary-color); border-radius: 50%;
  animation: spin 0.8s linear infinite; margin-bottom: 15px;
}

/* 列表容器 */
.list-container {
  display: flex; flex-direction: column; gap: 12px; padding-bottom: 20px;
}

/* 卡片主体 */
.history-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.history-card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: var(--text-secondary); opacity: 0.5; transition: all 0.3s;
}

/* 类型区分颜色 */
.history-card.detection::before { background: var(--primary-color); }
.history-card.comparison::before { background: var(--accent-color); }

.history-card:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.history-card.detection:hover { border-color: rgba(59, 130, 246, 0.3); }
.history-card.comparison:hover { border-color: rgba(139, 92, 246, 0.3); }

/* Card Header */
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.meta-left { display: flex; align-items: center; gap: 8px; }

.type-pill {
  font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;
  letter-spacing: 0.5px;
}
.type-pill.detection { background: rgba(59, 130, 246, 0.15); color: var(--primary-color); }
.type-pill.comparison { background: rgba(139, 92, 246, 0.15); color: var(--accent-color); }

.time-text { font-size: 0.75rem; color: var(--text-secondary); opacity: 0.8; }

.btn-delete {
  background: transparent; opacity: 0; transition: all 0.2s; padding: 4px; border-radius: 4px;
}
.history-card:hover .btn-delete { opacity: 1; }
.btn-delete:hover { background: rgba(218, 54, 51, 0.2); }
.trash-icon { font-size: 0.9rem; filter: grayscale(1); }
.btn-delete:hover .trash-icon { filter: grayscale(0); }

/* Card Body */
.card-body { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }

.lang-tag {
  display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--text-primary); font-weight: 500;
}
.dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 5px rgba(255,255,255,0.2); }

.score-display { font-family: 'Inter', sans-serif; }

.single-score .val { font-size: 1.2rem; font-weight: 800; }
.single-score .val.green { color: var(--success); text-shadow: 0 0 10px rgba(35, 134, 54, 0.3); }
.single-score .val.orange { color: #f59e0b; }
.single-score .val.red { color: var(--danger); }
.single-score .label { font-size: 0.7rem; color: var(--text-secondary); margin-left: 2px; }

.vs-score { display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 6px; }
.s-block { display: flex; align-items: baseline; gap: 3px; }
.s-block .l { font-size: 0.7rem; color: var(--text-secondary); font-weight: bold; }
.s-block .v { font-size: 0.9rem; font-weight: bold; }
.a-color { color: var(--primary-color); }
.b-color { color: var(--accent-color); }
.vs-divider { opacity: 0.3; font-size: 0.8rem; }

/* Code Snippet */
.code-snippet {
  background: rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 6px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}
.code-snippet code {
  display: block;
  font-family: 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.8;
}

/* Animations */
@keyframes spin { to { transform: rotate(360deg); } }
.list-anim-enter-active, .list-anim-leave-active { transition: all 0.3s ease; }
.list-anim-enter-from, .list-anim-leave-to { opacity: 0; transform: translateX(-10px); }
</style>
}