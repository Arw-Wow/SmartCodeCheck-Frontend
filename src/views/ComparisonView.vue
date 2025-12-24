<template>
  <div class="container comparison-view">
    
    <div class="top-bar">
      <div class="header-left">
        <h2>代码对比</h2>
      </div>

      <div class="header-controls">
        <select v-model="store.comparison.language" class="lang-select">
          <option value="Auto">Auto</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Go">Go</option>
        </select>

        <button v-if="!isComparing" class="btn btn-primary" @click="handleCompare">
          运行对比分析
        </button>
        <button v-else class="btn btn-danger" @click="handleStop">
          🛑 终止
        </button>
      </div>
    </div>

    <div class="config-panel">
      <details>
        <summary>
          🤖 模型选择
        </summary>
        <div class="panel-content">
          <div class="model-group">
            <button
              v-for="m in modelOptions"
              :key="m"
              type="button"
              class="model-btn"
              :class="{ active: store.comparison.modelName === m }"
              @click="store.comparison.modelName = m"
            >
              {{ m }}
            </button>
          </div>
        </div>
      </details>
      <details>
        <summary>
          ⚙️ 维度配置 
          <span class="summary-info">
            (已选 {{ store.comparison.selectedDimensions.length }} 项 
            <span v-if="customCount > 0">, 含 {{ customCount }} 个自定义</span>)
          </span>
        </summary>
        <div class="panel-content">
          <DimensionSelector 
            v-model="store.comparison.selectedDimensions" 
          />
        </div>
      </details>
    </div>

    <details class="instruction-box">
      <summary>📝 统一代码生成指令（可选，A/B 共用）</summary>
      <textarea
        v-model="store.comparison.generationInstruction"
        class="instruction-input"
        rows="8"
        placeholder="例如：实现相同功能的两段代码应遵循该指令的接口命名与异常处理约定。"
      ></textarea>
    </details>
    
    <div class="split-pane">
      <div class="pane">
        <div class="pane-head">Code A</div>
        <CodeEditor v-model="store.comparison.codeA" :language="store.comparison.language" />
      </div>

      <div class="pane">
        <div class="pane-head">Code B</div>
        <CodeEditor v-model="store.comparison.codeB" :language="store.comparison.language" />
      </div>
    </div>
    
    <div v-if="store.comparison.results" id="diff-print-area" class="diff-result">
      
      <div class="result-header">
        <h3>🏆 分析报告</h3>
        <div class="export-group">
          <button @click="exportJSON" class="btn-xs" title="导出 JSON">JSON</button>
          <button @click="exportMD" class="btn-xs" title="导出 Markdown">Markdown</button>
          <!-- <button @click="printPDF" class="btn-xs" title="打印或保存为 PDF">🖨️ PDF</button> -->
        </div>
      </div>

      <div class="summary-section">
        <p class="summary-text">{{ store.comparison.results.summary }}</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <h4>总体评分</h4>
          <div class="score-row">
            <div class="score-item">
              <span class="label">Model A</span>
              <span class="val color-a">{{ store.comparison.results.score_a }}</span>
            </div>
            <div class="vs">VS</div>
            <div class="score-item">
              <span class="label">Model B</span>
              <span class="val color-b">{{ store.comparison.results.score_b }}</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <h4>维度明细</h4>
          <div v-for="(scores, dim) in store.comparison.results.dimension_scores" :key="dim" class="dim-row">
            <span class="dim-name" :title="dim">{{ dim }}</span>
            <div class="bar-container">
              <div class="bar-wrapper">
                <div class="bar bar-a" :style="{ width: scores[0] + '%' }"></div>
                <span class="bar-val">{{ scores[0] }}</span>
              </div>
              <div class="bar-wrapper">
                <div class="bar bar-b" :style="{ width: scores[1] + '%' }"></div>
                <span class="bar-val">{{ scores[1] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isComparing && !store.comparison.results" class="comparing-overlay">
       <div class="spinner"></div>
       <p>正在对比两段代码的逻辑与性能...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGlobalDataStore } from '@/stores/index'
import api from '@/api'
import { downloadFile, generateComparisonMarkdown } from '@/utils/export'
import CodeEditor from '@/components/analysis/CodeEditor.vue'
import DimensionSelector from '@/components/analysis/DimensionSelector.vue'

// 创建store实例
const store = useGlobalDataStore()

const isComparing = ref(false)
let abortController = null

const customCount = computed(() => Object.keys(store.customDefinitions).length)

// 可选模型列表（单选）
const modelOptions = [
  'deepseek-v3.1',
  'qwen3-coder-plus',
  'gpt-5-mini',
  'gpt-5',
  'gemini-3-pro-preview',
  'my-finetuned-model'
]

const handleCompare = async () => {
  if (!store.comparison.codeA || !store.comparison.codeB) return alert('请确保两边都输入了代码')
  if (store.comparison.selectedDimensions.length === 0) return alert('请至少选择一个对比维度')
  
  isComparing.value = true
  store.comparison.results = null
  abortController = new AbortController()
  
  try {
    const payload = {
      code_a: store.comparison.codeA,
      code_b: store.comparison.codeB,
      language: store.comparison.language,
      model_name: store.comparison.modelName,
      dimensions: store.comparison.selectedDimensions,
      custom_definitions: store.customDefinitions,
      generation_instruction: store.comparison.generationInstruction?.trim() || undefined
    }

    const res = await api.compareCodes(payload, abortController.signal)
    store.comparison.results = res.data

  } catch (error) {
    if (error.name !== 'CanceledError') {
      alert('对比失败: ' + error.message)
    }
  } finally {
    isComparing.value = false
    abortController = null
  }
}

const handleStop = () => {
  if (abortController) abortController.abort()
}

// 导出功能实现
const exportJSON = () => {
  const data = JSON.stringify(store.comparison.results, null, 2)
  downloadFile(data, `comparison_report_${Date.now()}.json`, 'application/json')
}

const exportMD = () => {
  const md = generateComparisonMarkdown(store.comparison.results, store.comparison.language)
  downloadFile(md, `comparison_report_${Date.now()}.md`, 'text/markdown')
}

const printPDF = () => {
  window.print()
}
</script>

<style scoped>
.comparison-view { padding-top: 20px; padding-bottom: 50px; position: relative; }

/* 顶部栏 */
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.header-controls { display: flex; gap: 10px; align-items: center; }
.lang-select { width: 120px; padding: 8px; border-radius: 6px; background: var(--panel-color); color: white; border: 1px solid var(--border-color); }
.btn-danger { background: var(--danger); color: white; }

/* 维度配置折叠面板 */
.config-panel { margin-bottom: 20px; background: var(--panel-color); border-radius: 8px; border: 1px solid var(--border-color); }
details { padding: 10px 15px; }
summary { cursor: pointer; font-weight: 600; color: var(--text-primary); user-select: none; outline: none; }
summary:hover { color: var(--primary-color); }
.summary-info { font-weight: normal; color: var(--text-secondary); font-size: 0.9rem; margin-left: 10px; }
.panel-content { margin-top: 15px; border-top: 1px dashed var(--border-color); padding-top: 15px; max-width: 600px; }

/* 代码输入区 */
.split-pane { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 500px; margin-bottom: 30px; }
.pane { display: flex; flex-direction: column; }
.pane-head { margin-bottom: 10px; font-weight: bold; color: var(--accent-color); font-size: 1.1rem; }

/* 结果区域容器 */
.diff-result { background: var(--panel-color); border-radius: 8px; padding: 30px; border: 1px solid var(--border-color); }

/* 结果头部样式 */
.result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px; }
.result-header h3 { margin: 0; font-size: 1.4rem; display: flex; align-items: center; gap: 10px; }

/* 导出按钮样式 */
.export-group { display: flex; gap: 8px; }
.btn-xs { 
  padding: 4px 10px; 
  font-size: 0.8rem; 
  background: var(--bg-color); 
  border: 1px solid var(--border-color); 
  color: var(--text-secondary); 
  border-radius: 4px; 
  cursor: pointer;
  transition: all 0.2s;
}
.btn-xs:hover { border-color: var(--primary-color); color: var(--primary-color); background: rgba(59, 130, 246, 0.05); }

/* 总结文本 */
.summary-section { margin-bottom: 30px; }
.summary-text { font-size: 1.1rem; line-height: 1.6; color: var(--text-primary); }

.metrics-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 40px; }

/* 评分卡片 */
.score-row { display: flex; align-items: center; justify-content: space-around; margin-top: 20px; }
.score-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.score-item .label { font-size: 0.9rem; color: var(--text-secondary); }
.score-item .val { font-size: 2.5rem; font-weight: bold; }
.vs { font-weight: bold; color: var(--text-secondary); opacity: 0.5; font-style: italic; }
.color-a { color: var(--primary-color); }
.color-b { color: var(--accent-color); }

/* 条形图细节 */
.dim-row { display: flex; align-items: center; margin-bottom: 15px; }
.dim-name { width: 120px; font-size: 0.9rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-container { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.bar-wrapper { display: flex; align-items: center; gap: 10px; height: 10px; }
.bar { height: 100%; border-radius: 4px; transition: width 1s ease; }
.bar-a { background-color: var(--primary-color); }
.bar-b { background-color: var(--accent-color); }
.bar-val { font-size: 0.75rem; color: var(--text-secondary); width: 25px; }

/* 加载遮罩 */
.comparing-overlay { text-align: center; padding: 40px; }
.spinner { border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top: 3px solid var(--primary-color); width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px;}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* 打印样式适配 */
@media print {
  body * { visibility: hidden; }
  #diff-print-area, #diff-print-area * { visibility: visible; }
  #diff-print-area { position: absolute; left: 0; top: 0; width: 100%; border: none; padding: 0; }
  .diff-result { background: white !important; color: black !important; }
  .export-group { display: none !important; } /* 打印时隐藏导出按钮 */
}

/* 指令编辑框样式 */
.instruction-box { background: var(--panel-color); border: 1px solid var(--border-color); border-radius: 8px; margin-top: 10px; padding: 8px 12px; }
.instruction-input { width: 100%; background: var(--bg-color); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; }

/* 模型按钮组（单选） */
.model-group { display: flex; flex-wrap: wrap; gap: 8px; }
.model-btn { 
  padding: 6px 10px;
  font-size: 0.9rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}
.model-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.model-btn.active { 
  background: rgba(59, 130, 246, 0.12);
  color: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15) inset;
}
</style>