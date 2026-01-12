<template>
  <div class="container detection-layout">
    <aside class="sidebar">
      <h3>配置面板</h3>
      
      <div class="form-group">
        <label>编程语言</label>
        <select v-model="store.detection.language">
          <option value="Auto">Auto</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Go">Go</option>
        </select>
      </div>

      <div class="form-group">
        <label>模型选择</label>
        <select v-model="store.detection.modelName">
          <option value="deepseek-v3.1">deepseek-v3.1</option>
          <option value="qwen3-coder-plus">qwen3-coder-plus</option>
          <option value="gpt-5-mini">gpt-5-mini</option>
          <option value="gpt-5">gpt-5</option>
          <option value="gemini-3-pro-preview">gemini-3-pro-preview</option>
          <option value="my-finetuned-model">my-finetuned-model</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>检测维度</label>
        <DimensionSelector 
          v-model="store.detection.selectedDimensions" 
        />
      </div>

      <div class="action-area">
        <button 
          v-if="!isAnalyzing"
          @click="handleAnalyze" 
          class="btn btn-primary full-width"
        >
          开始检测
        </button>
        <button 
          v-else
          @click="handleStop" 
          class="btn btn-danger full-width"
        >
          🛑 终止生成
        </button>
      </div>
      
      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
    </aside>

    <main class="editor-section">
      <details class="instruction-box">
        <summary>📝 代码生成指令（可选，点击展开）</summary>
        <textarea
          v-model="store.detection.generationInstruction"
          class="instruction-input"
          rows="8"
          placeholder="例如：请用Python实现一个二分查找函数，要求包含输入校验与时间复杂度说明。"
        ></textarea>
      </details>
      <CodeEditor v-model="store.detection.code" :language="store.detection.language" />
    </main>

    <aside class="result-sidebar">
      <div class="tabs-header">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'result' }"
          @click="activeTab = 'result'"
        >
          📊 分析结果
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'history' }"
          @click="loadHistory"
        >
          🕒 历史记录
        </button>
      </div>

      <div v-show="activeTab === 'result'" class="tab-content">
        <div class="sidebar-header">
          <h3>检测报告</h3>
          <div v-if="store.detection.results" class="export-tools">
            <button @click="exportJSON" class="btn-icon" title="导出 JSON">JSON</button>
            <button @click="exportMD" class="btn-icon" title="导出 Markdown">Markdown</button>
          </div>
        </div>
        
        <div v-if="!store.detection.results && !isAnalyzing" class="empty-state">
          请配置并点击开始检测。
        </div>

        <div v-if="isAnalyzing" class="loading-state">
          <div class="spinner"></div>
          <p>模型正在深度分析代码...</p>
          <small class="tip">包含自定义维度的分析可能需要更多时间</small>
        </div>

        <div v-if="store.detection.results" class="results-content">
          <div class="score-card">
            <span class="score-label">综合得分</span>
            <span class="score-val" :class="getScoreClass(store.detection.results.score)">
              {{ store.detection.results.score }}
            </span>
          </div>
          
          <div class="issue-list">
            <div v-for="(issue, index) in store.detection.results.issues" :key="index" class="issue-item">
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
      </div>

      <div v-show="activeTab === 'history'" class="tab-content">
        <HistoryList 
          :records="store.historyList" 
          :loading="historyLoading"
          @restore="handleRestore"
          @delete="handleDeleteHistory"
        />
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGlobalDataStore } from '@/stores/index'
import { useToastStore } from '@/stores/toast'
import api from '@/api'
import DimensionSelector from '@/components/analysis/DimensionSelector.vue'
import CodeEditor from '@/components/analysis/CodeEditor.vue'
import HistoryList from '@/components/common/HistoryList.vue'
import { downloadFile, generateDetectionMarkdown } from '@/utils/export'

// 创建store实例
const store = useGlobalDataStore()
const toast = useToastStore()

const isAnalyzing = ref(false)
const errorMessage = ref('')
const activeTab = ref('result') // 控制 Tab 切换
const historyLoading = ref(false) // 历史记录加载状态
let abortController = null 

const handleAnalyze = async () => {
  // 基础校验
  if (!store.detection.code.trim()) return alert('请输入代码')
  if (store.detection.selectedDimensions.length === 0) return alert('请至少选择一个维度')

  isAnalyzing.value = true
  store.detection.results = null
  errorMessage.value = ''
  
  // 切换回结果 Tab
  activeTab.value = 'result'
  
  // 初始化 AbortController
  abortController = new AbortController()

  try {
    const payload = {
      code_content: store.detection.code,
      language: store.detection.language,
      model_name: store.detection.modelName,
      dimensions: store.detection.selectedDimensions,
      custom_definitions: store.customDefinitions,
      generation_instruction: store.detection.generationInstruction?.trim() || undefined
    }

    // 调用 API
    const response = await api.analyzeCode(payload, abortController.signal)
    
    store.detection.results = response.data

    // 成功后自动保存到历史记录 (异步执行，不阻塞 UI)
    store.saveToHistory('detection').then(() => {
      toast.success('结果已保存至历史记录', 1000)
    }).catch(err => console.error('自动保存历史失败', err))
    
  } catch (error) {
    if (error.name === 'CanceledError' || error.message === 'canceled') {
      errorMessage.value = '检测已手动终止。'
    } else {
      console.error(error)
      errorMessage.value = '分析失败: ' + error.message
    }
  } finally {
    isAnalyzing.value = false
    abortController = null
  }
}

// 终止操作
const handleStop = () => {
  if (abortController) {
    abortController.abort()
  }
}

// 历史记录相关逻辑
const loadHistory = async () => {
  activeTab.value = 'history'
  historyLoading.value = true
  await store.fetchHistory('detection')
  historyLoading.value = false
}

const handleRestore = (record) => {
  if (confirm('恢复历史记录将覆盖当前编辑器内容，确定吗？')) {
    store.restoreHistory(record)
    activeTab.value = 'result'
    toast.success('已恢复历史记录')
  }
}

const handleDeleteHistory = async (id) => {
  if (confirm('确定删除这条记录吗？')) {
    await store.removeHistory(id, 'detection')
    toast.success('删除成功')
  }
}

// 导出功能
const exportJSON = () => {
  const data = JSON.stringify(store.detection.results, null, 2)
  downloadFile(data, `analysis_report_${Date.now()}.json`, 'application/json')
}

const exportMD = () => {
  const md = generateDetectionMarkdown(store.detection.results, store.detection.language)
  downloadFile(md, `analysis_report_${Date.now()}.md`, 'text/markdown')
}

const getScoreClass = (score) => {
  if (score >= 90) return 'text-success'
  if (score >= 70) return 'text-warning'
  return 'text-danger'
}
</script>

<style scoped>
/* 布局样式 */
.container {
  width: 100%;
  max-width: 1300px;
  padding: 0 20px;
  margin: 0 auto;
}

.detection-layout {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 20px;
  height: calc(100vh - 100px);
}
.sidebar, .result-sidebar { background: var(--panel-color); padding: 20px; border-radius: 8px; overflow-y: auto; display: flex; flex-direction: column; }
.form-group { margin-bottom: 20px; }
select { width: 100%; padding: 8px; background: var(--bg-color); color: #fff; border: 1px solid var(--border-color); border-radius: 4px; }
.full-width { width: 100%; margin-top: 20px; }

/* 按钮样式 */
.btn-danger { background: var(--danger); color: white; transition: all 0.2s; }
.btn-danger:hover { background: #b91c1c; }

/* Tabs 样式 */
.tabs-header {
  display: flex;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  margin: -20px -20px 20px -20px; /* 抵消 result-sidebar 的 padding */
  padding: 0 10px;
}
.tab-btn {
  flex: 1;
  background: transparent;
  color: var(--text-secondary);
  padding: 12px 0;
  font-size: 0.95rem;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.tab-btn:hover { color: var(--text-primary); }
.tab-btn.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
.tab-content { flex: 1; display: flex; flex-direction: column; }

/* 打印样式 */
@media print {
  body * { visibility: hidden; }
  #print-area, #print-area * { visibility: visible; }
  #print-area { position: absolute; left: 0; top: 0; width: 100%; color: black; }
  .issue-item { break-inside: avoid; border: 1px solid #ccc; color: black; }
  .badge { border: 1px solid #000; }
}

/* 导出工具栏样式 */
.sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.export-tools { display: flex; gap: 5px; }
.btn-icon { background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-secondary); cursor: pointer; border-radius: 4px; padding: 2px 6px; font-size: 0.75rem; transition: all 0.2s; }
.btn-icon:hover { color: var(--primary-color); border-color: var(--primary-color); }

/* 结果样式 */
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

.error-msg { color: var(--danger); margin-top: 10px; font-size: 0.9rem; text-align: center; }
.loading-state { text-align: center; padding: 40px 0; color: var(--text-secondary); }
.tip { display: block; margin-top: 10px; font-size: 0.8rem; opacity: 0.7; }
.spinner { border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top: 3px solid var(--primary-color); width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 15px;}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* 指令编辑框样式 */
.instruction-box { background: var(--panel-color); border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 12px; padding: 8px 12px; }
.instruction-input { 
  width: 100%; 
  box-sizing: border-box; /* 防止宽度溢出 */
  background: var(--bg-color); 
  color: var(--text-primary); 
  border: 1px solid var(--border-color); 
  border-radius: 6px; 
  padding: 8px; 
  font-family: inherit; /* 保持字体一致 */
  resize: vertical; /* 允许用户垂直拉伸，禁止水平拉伸破坏布局 */
}

/* CodeEditor 高度调整 */
.editor-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}
</style>