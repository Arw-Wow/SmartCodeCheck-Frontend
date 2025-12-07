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
          <option value="JavaScript">JavaScript</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>检测维度</label>
        <DimensionSelector v-model="selectedDimensions" />
      </div>

      <button @click="handleAnalyze" :disabled="isAnalyzing" class="btn btn-primary full-width">
        {{ isAnalyzing ? '正在调用 LLM 分析...' : '开始检测' }}
      </button>
      
      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
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
        <p>模型正在思考中...</p>
      </div>

      <div v-if="results" class="results-content">
        <div class="score-card">
          <span class="score-label">综合得分</span>
          <span class="score-val" :class="getScoreClass(results.score)">{{ results.score }}</span>
        </div>
        
        <div class="issue-list">
          <div v-for="(issue, index) in results.issues" :key="index" class="issue-item">
            <div class="issue-header">
              <span class="badge" :class="issue.type">{{ issue.type }}</span>
              <span class="dim-tag">{{ issue.dimension }}</span>
              <span v-if="issue.line" class="line-tag">Line {{ issue.line }}</span>
            </div>
            <p class="issue-desc">{{ issue.description }}</p>
            <div class="issue-suggestion">💡 建议: {{ issue.suggestion }}</div>
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
import api from '@/api' // 引入我们刚写的 api

const language = ref('Python')
const codeContent = ref('def example():\n    print("Hello World")')
const selectedDimensions = ref(['correctness', 'security', 'efficiency'])
const isAnalyzing = ref(false)
const results = ref(null)
const errorMessage = ref('')

const handleAnalyze = async () => {
  // 1. 基础校验
  if (!codeContent.value.trim()) return alert('请输入代码')
  if (selectedDimensions.value.length === 0) return alert('请至少选择一个维度')

  isAnalyzing.value = true
  results.value = null
  errorMessage.value = ''

  try {
    // 2. 构造请求体 (需与后端 AnalysisRequest 模型字段一致)
    const payload = {
      code_content: codeContent.value,
      language: language.value,
      dimensions: selectedDimensions.value
    }

    // 3. 调用后端
    const response = await api.analyzeCode(payload)
    
    // 4. 赋值结果
    results.value = response.data
    
  } catch (error) {
    console.error(error)
    errorMessage.value = '分析失败，请检查后端服务或网络连接。'
  } finally {
    isAnalyzing.value = false
  }
}

// 辅助函数：根据分数改变颜色
const getScoreClass = (score) => {
  if (score >= 90) return 'text-success'
  if (score >= 70) return 'text-warning'
  return 'text-danger'
}
</script>

<style scoped>
/* 保持原有样式，新增部分样式 */
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

.score-card { text-align: center; margin-bottom: 20px; padding: 15px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; }
.score-val { display: block; font-size: 2.5rem; font-weight: bold; }
.text-success { color: var(--success); }
.text-warning { color: #F59E0B; }
.text-danger { color: var(--danger); }

.issue-item { background: var(--bg-color); padding: 15px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid var(--text-secondary); }
.badge { font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; margin-right: 8px; }
.badge.Warning { background: #F59E0B; color: #000; }
.badge.Error { background: var(--danger); color: #fff; }
.badge.Info { background: var(--primary-color); color: #fff; }
.dim-tag, .line-tag { font-size: 0.75rem; color: var(--text-secondary); margin-right: 8px; }
.issue-suggestion { margin-top: 8px; font-size: 0.85rem; color: var(--success); border-top: 1px dashed var(--border-color); padding-top: 5px;}
.error-msg { color: var(--danger); margin-top: 10px; font-size: 0.9rem; }
.spinner { /* 简单的加载动画 */ border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top: 3px solid var(--primary-color); width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 10px;}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>