<template>
  <div class="history-list">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="records.length === 0" class="empty">暂无历史记录</div>
    
    <div 
      v-else 
      v-for="item in records" 
      :key="item.id" 
      class="history-item"
      @click="$emit('restore', item)"
    >
      <div class="item-header">
        <span class="type-tag" :class="item.type">
          {{ item.type === 'detection' ? '检测' : '对比' }}
        </span>
        <span class="time">{{ formatTime(item.created_at) }}</span>
        <button class="btn-del" @click.stop="$emit('delete', item.id)">×</button>
      </div>
      
      <div class="item-summary">
        <span class="lang-badge">{{ item.data.language }}</span>
        
        <span 
          v-if="item.type === 'detection'" 
          class="score-badge" 
          :class="getScoreColor(item.data.results?.score)"
        >
           {{ item.data.results?.score ?? 'N/A' }}分
        </span>

        <div v-else-if="item.type === 'comparison'" class="score-group">
           <span class="mini-score color-a">A:{{ item.data.results?.score_a ?? '-' }}</span>
           <span class="vs">vs</span>
           <span class="mini-score color-b">B:{{ item.data.results?.score_b ?? '-' }}</span>
        </div>
      </div>

      <div class="code-preview">
         {{ getCodePreview(item) }}
      </div>
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
  return new Date(timeStr).toLocaleString('zh-CN', {
    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const getScoreColor = (score) => {
  if (score === undefined || score === null) return 'gray';
  if (score >= 90) return 'green';
  if (score >= 70) return 'orange';
  return 'red';
}

const getCodePreview = (item) => {
  // 对比模式下，优先展示 Code A
  const code = item.type === 'detection' ? item.data.code : item.data.codeA;
  if (!code) return '(空代码)';
  return code.slice(0, 60).replace(/\n/g, ' ') + '...';
}
</script>

<style scoped>
.history-list { display: flex; flex-direction: column; gap: 10px; }
.empty, .loading { text-align: center; color: var(--text-secondary); padding: 20px; font-size: 0.9rem; }

.history-item {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.history-item:hover { border-color: var(--primary-color); transform: translateX(-2px); }

.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.type-tag { font-size: 0.7rem; padding: 1px 4px; border-radius: 3px; margin-right: 6px; text-transform: uppercase; }
.type-tag.detection { background: rgba(59, 130, 246, 0.2); color: var(--primary-color); }
.type-tag.comparison { background: rgba(139, 92, 246, 0.2); color: var(--accent-color); }

.time { font-size: 0.75rem; color: var(--text-secondary); flex: 1; }
.btn-del { background: transparent; color: var(--text-secondary); font-size: 1.1rem; line-height: 1; padding: 0 4px; }
.btn-del:hover { color: var(--danger); }

.item-summary { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.lang-badge { font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; }

/* 单分数样式 */
.score-badge { font-size: 0.8rem; font-weight: bold; }
.score-badge.green { color: var(--success); }
.score-badge.orange { color: #f59e0b; }
.score-badge.red { color: var(--danger); }
.score-badge.gray { color: var(--text-secondary); }

/* 对比分数样式 */
.score-group { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: bold; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px; }
.mini-score.color-a { color: var(--primary-color); }
.mini-score.color-b { color: var(--accent-color); }
.vs { color: var(--text-secondary); font-size: 0.7rem; font-weight: normal; margin: 0 2px; }

.code-preview { font-family: monospace; font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.8; }
</style>