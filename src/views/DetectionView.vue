<!-- 包含模拟后端数据逻辑 -->

<template>
  <div class="container detection-layout">
    <aside class="sidebar">
      <h3>配置面板</h3>
      <div class="form-group">
        <label>编程语言</label>
        <select v-model="language">
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>检测维度</label>
        <DimensionSelector v-model="selectedDimensions" />
      </div>

      <button @click="handleAnalyze" :disabled="isAnalyzing" class="btn btn-primary full-width">
        {{ isAnalyzing ? '分析中...' : '开始检测' }}
      </button>
    </aside>

    <main class="editor-section">
      <CodeEditor v-model="codeContent" :language="language" />
    </main>

    <aside class="result-sidebar">
      <h3>检测报告</h3>
      
      <div v-if="!results && !isAnalyzing" class="empty-state">
        请在左侧配置并输入代码后点击开始。
      </div>

      <div v-if="isAnalyzing" class="loading-state">
        <div class="spinner"></div>
        <p>正在分析代码逻辑与安全风险...</p>
      </div>

      <div v-if="results" class="results-content">
        <div class="score-card">
          <span class="score-label">综合得分</span>
          <span class="score-val">{{ results.score }}</span>
        </div>
        
        <div class="issue-list">
          <div v-for="(issue, index) in results.issues" :key="index" class="issue-item">
            <div class="issue-header">
              <span class="badge" :class="issue.type">{{ issue.type }}</span>
              <span class="dim-tag">{{ issue.dimension }}</span>
            </div>
            <p class="issue-desc">{{ issue.description }}</p>
            <div class="issue-suggestion">建议: {{ issue.suggestion }}</div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DimensionSelector from '@/components/analysis/DimensionSelector.vue'
import CodeEditor from '@/components/analysis/CodeEditor.vue'

const language = ref('Python')
const codeContent = ref('def example():\n    pass')
const selectedDimensions = ref(['correctness', 'security'])
const isAnalyzing = ref(false)
const results = ref(null)

// 模拟后端 API 调用
const handleAnalyze = () => {
  if (!codeContent.value.trim()) return alert('请输入代码')
  
  isAnalyzing.value = true
  results.value = null // 清空旧结果

  setTimeout(() => {
    isAnalyzing.value = false
    results.value = {
      score: 85,
      issues: [
        { 
          dimension: '安全性', 
          type: 'Warning', 
          description: '检测到潜在的 SQL 注入风险，未对 inputs 进行过滤。', 
          suggestion: '使用参数化查询代替字符串拼接。' 
        },
        { 
          dimension: '效率', 
          type: 'Info', 
          description: '循环中存在重复计算。', 
          suggestion: '将常量计算移出循环体。' 
        }
      ]
    }
  }, 2000)
}
</script>

<style scoped>
.detection-layout {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 20px;
  height: calc(100vh - 100px);
}
.sidebar, .result-sidebar { background: var(--panel-color); padding: 20px; border-radius: 8px; overflow-y: auto; }
.form-group { margin-bottom: 20px; }
select { width: 100%; padding: 8px; background: var(--bg-color); color: #fff; border: 1px solid var(--border-color); border-radius: 4px; }
.full-width { width: 100%; margin-top: 20px; }

/* 结果样式 */
.score-card { text-align: center; margin-bottom: 20px; padding: 15px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; }
.score-val { display: block; font-size: 2.5rem; font-weight: bold; color: var(--primary-color); }
.issue-item { background: var(--bg-color); padding: 15px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid var(--text-secondary); }
.badge { font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; margin-right: 8px; }
.badge.Warning { background: #F59E0B; color: #000; }
.badge.Info { background: var(--primary-color); color: #fff; }
.issue-suggestion { margin-top: 8px; font-size: 0.85rem; color: var(--success); }
</style>