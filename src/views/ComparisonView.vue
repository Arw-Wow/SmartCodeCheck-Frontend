<template>
  <div class="comparison-view">
    <div class="ambient-bg">
      <div class="glow-spot spot-1"></div>
      <div class="glow-spot spot-2"></div>
    </div>

    <div class="content-wrapper">
      
      <div class="top-bar glass-panel">
        <div class="header-left">
          <h2>⚔️ 代码对比</h2>
        </div>

        <div class="header-controls">
          <div class="status-pills" @click="showConfig = !showConfig" title="点击展开详细配置">
            <div class="pill">
              <span class="icon">🤖</span> {{ store.comparison.modelName }}
            </div>
            <div class="pill">
              <span class="icon">📐</span> {{ store.comparison.selectedDimensions.length }} 维度
            </div>
            <div class="pill">
              <span class="icon">🌐</span> {{ store.comparison.language }}
            </div>
            <div class="pill-toggle">
              <span class="icon" :class="{ rotated: showConfig }">▼</span>
            </div>
          </div>

          <div class="divider"></div>

          <button v-if="!isComparing" class="btn-action primary" @click="handleCompare">
            <span class="icon">⚡</span> 运行对比
          </button>
          <button v-else class="btn-action danger pulsate" @click="handleStop">
            <span class="icon">🛑</span> 终止
          </button>
        </div>
      </div>

      <transition name="expand">
        <div v-show="showConfig" class="config-panel glass-panel">
          <div class="config-grid">
            
            <div class="config-col">
              <h4 class="col-title">基础环境</h4>
              <div class="form-item">
                <label>语言</label>
                <div class="select-wrapper">
                  <select v-model="store.comparison.language" class="custom-select">
                    <option value="Auto">自动检测</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Go">Go</option>
                  </select>
                </div>
              </div>
              <div class="form-item">
                <label>模型选择</label>
                <div class="model-list">
                  <button
                    v-for="m in modelOptions"
                    :key="m.value"
                    class="model-chip"
                    :class="{ active: store.comparison.modelName === m.value }"
                    @click="store.comparison.modelName = m.value"
                  >
                    {{ m.label }}
                  </button>
                </div>
              </div>
            </div>

            <div class="config-col flex-grow">
              <h4 class="col-title">
                检测维度 
                <span class="sub-info" v-if="customCount > 0"></span>
              </h4>
              <div class="dimension-area">
                <DimensionSelector v-model="store.comparison.selectedDimensions" />
              </div>
            </div>

            <div class="config-col">
              <h4 class="col-title">生成指令（可选）</h4>
              <textarea
                v-model="store.comparison.generationInstruction"
                class="instruction-input"
                placeholder="在此输入统一的生成指令或约束条件..."
              ></textarea>
            </div>
          </div>
          
          <div class="panel-footer" @click="showConfig = false">
            <span class="close-hint">收起配置 ▲</span>
          </div>
        </div>
      </transition>
      
      <div class="split-pane">
        <div class="pane">
          <div class="pane-head">
            <div class="pane-title"><span class="dot a-dot"></span> Code A</div>
          </div>
          <div class="editor-frame">
            <CodeEditor v-model="store.comparison.codeA" :language="store.comparison.language" />
          </div>
        </div>

        <div class="pane">
          <div class="pane-head">
            <div class="pane-title"><span class="dot b-dot"></span> Code B</div>
          </div>
          <div class="editor-frame">
            <CodeEditor v-model="store.comparison.codeB" :language="store.comparison.language" />
          </div>
        </div>
      </div>
      
      <div class="bottom-panel glass-panel">
        <div class="tabs-header">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'result' }"
            @click="activeTab = 'result'"
          >
            📊 对比报告
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'history' }"
            @click="loadHistory"
          >
            🕒 历史记录
          </button>
        </div>

        <div class="tab-scroll-area">
          <transition name="fade" mode="out-in">
            <div v-if="activeTab === 'result'" key="result" class="result-container">
              
              <div v-if="!store.comparison.results && !isComparing" class="empty-state">
                <div class="empty-icon">⚖️</div>
                <p>配置完成? 输入代码并点击右上角“运行对比”</p>
              </div>

              <div v-if="isComparing" class="loading-state">
                 <div class="spinner"></div>
                 <p>AI 正在进行 A/B 深度对比...</p>
                 <span class="sub-text">分析逻辑差异、性能瓶颈与潜在风险</span>
              </div>

              <div v-if="store.comparison.results" class="diff-result">
                <div class="result-header">
                  <h3>🏆 分析总结</h3>
                  <div class="export-group">
                    <button @click="exportJSON" class="btn-xs">JSON</button>
                    <button @click="exportMD" class="btn-xs">Markdown</button>
                  </div>
                </div>

                <div class="summary-box">
                  <p>{{ store.comparison.results.summary }}</p>
                </div>

                <div class="metrics-dashboard">
                  <div class="pk-card">
                    <div class="score-col">
                      <span class="label">Code A</span>
                      <span class="score-val color-a">{{ store.comparison.results.score_a }}</span>
                    </div>
                    <div class="vs-divider">VS</div>
                    <div class="score-col">
                      <span class="label">Code B</span>
                      <span class="score-val color-b">{{ store.comparison.results.score_b }}</span>
                    </div>
                  </div>

                  <div class="bars-card">
                    <div v-for="(scores, dim) in store.comparison.results.dimension_scores" :key="dim" class="dim-row">
                      <div class="dim-label" :title="dim">{{ dim }}</div>
                      <div class="chart-area">
                        <div class="bar-track">
                          <div class="bar-fill fill-a" :style="{ width: scores[0] + '%' }"></div>
                          <span class="bar-num">{{ scores[0] }}</span>
                        </div>
                        <div class="bar-track">
                          <div class="bar-fill fill-b" :style="{ width: scores[1] + '%' }"></div>
                          <span class="bar-num">{{ scores[1] }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else key="history" class="history-container">
               <HistoryList 
                :records="store.historyList" 
                :loading="historyLoading"
                @restore="handleRestore"
                @delete="handleDeleteHistory"
              />
            </div>
          </transition>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGlobalDataStore } from '@/stores/index'
import { useToastStore } from '@/stores/toast'
import api from '@/api'
import { downloadFile, generateComparisonMarkdown } from '@/utils/export'
import CodeEditor from '@/components/analysis/CodeEditor.vue'
import DimensionSelector from '@/components/analysis/DimensionSelector.vue'
import HistoryList from '@/components/common/HistoryList.vue'

const store = useGlobalDataStore()
const toast = useToastStore()

const isComparing = ref(false)
const showConfig = ref(false) // 控制配置面板展开
const activeTab = ref('result')
const historyLoading = ref(false)
let abortController = null

const customCount = computed(() => Object.keys(store.customDefinitions).length)

const modelOptions = [
  { value: 'deepseek-v3.1', label: 'DeepSeek V3.1' },
  { value: 'qwen3-coder-plus', label: 'Qwen3 Coder+' },
  { value: 'gpt-5-mini', label: 'GPT-5 Mini' },
  { value: 'gpt-5', label: 'GPT-5' },
  { value: 'gemini-3-pro-preview', label: 'Gemini 3 Pro' },
  { value: 'my-finetuned-model', label: '官方微调模型' }
]

const handleCompare = async () => {
  if (!store.comparison.codeA || !store.comparison.codeB) return toast.warning('请确保两边都输入了代码')
  if (store.comparison.selectedDimensions.length === 0) {
    showConfig.value = true // 自动展开提示
    return toast.warning('请至少选择一个对比维度')
  }
  
  isComparing.value = true
  showConfig.value = false // 开始分析时自动收起配置，专注结果
  store.comparison.results = null
  activeTab.value = 'result'
  
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
    store.saveToHistory('comparison').catch(err => console.error('History save failed:', err))

  } catch (error) {
    if (error.name !== 'CanceledError') {
      toast.error('对比失败: ' + error.message)
    }
  } finally {
    isComparing.value = false
    abortController = null
  }
}

const handleStop = () => {
  if (abortController) abortController.abort()
}

const loadHistory = async () => {
  activeTab.value = 'history'
  historyLoading.value = true
  await store.fetchHistory('comparison')
  historyLoading.value = false
}

const handleRestore = (record) => {
  if (confirm('恢复记录将覆盖当前的 Code A 和 Code B，确定吗？')) {
    store.restoreHistory(record)
    activeTab.value = 'result'
    toast.success('已恢复历史记录')
  }
}

const handleDeleteHistory = async (id) => {
  if (confirm('确定删除这条记录吗？')) {
    await store.removeHistory(id, 'comparison')
    toast.success('删除成功')
  }
}

const exportJSON = () => {
  const data = JSON.stringify(store.comparison.results, null, 2)
  downloadFile(data, `comparison_report_${Date.now()}.json`, 'application/json')
}

const exportMD = () => {
  const md = generateComparisonMarkdown(store.comparison.results, store.comparison.language)
  downloadFile(md, `comparison_report_${Date.now()}.md`, 'text/markdown')
}
</script>

<style scoped>
/* 全局容器 */
.comparison-view {
  position: relative;
  min-height: calc(100vh - 64px);
  padding: 16px;
  box-sizing: border-box;
}

.ambient-bg {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;
}
.glow-spot { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.15; }
.spot-1 { top: -10%; left: 30%; width: 40vw; height: 40vw; background: var(--primary-color); }
.spot-2 { bottom: -10%; right: 20%; width: 35vw; height: 35vw; background: var(--accent-color); }

.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

/* 玻璃通用样式 */
.glass-panel {
  background: rgba(22, 27, 34, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
}

/* --- Top Bar --- */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}
.header-left h2 { margin: 0; font-size: 1.1rem; color: var(--text-primary); }

.header-controls { display: flex; align-items: center; gap: 16px; }
.divider { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }

/* 状态概览胶囊 */
.status-pills {
  display: flex; gap: 8px; cursor: pointer; padding: 4px; border-radius: 8px; transition: background 0.2s;
}
.status-pills:hover { background: rgba(255,255,255,0.05); }
.pill {
  background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); color: var(--text-secondary);
  padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;
}
.pill-toggle { display: flex; align-items: center; color: var(--text-secondary); font-size: 0.7rem; padding: 0 4px; }
.pill-toggle .icon { transition: transform 0.3s; }
.pill-toggle .icon.rotated { transform: rotate(180deg); }

/* 按钮 */
.btn-action {
  padding: 8px 18px; border-radius: 6px; font-weight: 600; display: flex; align-items: center; gap: 6px; font-size: 0.9rem; transition: all 0.2s;
}
.btn-action.primary { background: var(--primary-color); color: white; }
.btn-action.primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
.btn-action.danger { background: rgba(218,54,51,0.2); color: #ff6b6b; border: 1px solid rgba(218,54,51,0.3); }
.pulsate { animation: pulse 2s infinite; }

/* --- Config Panel (核心修改区域) --- */
.config-panel {
  overflow: hidden; /* 关键：配合高度动画 */
}

.config-grid {
  display: grid;
  grid-template-columns: 240px 540px 1fr; /* 三列布局：基础、维度、指令(弹性) */
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.config-col { display: flex; flex-direction: column; gap: 12px; }
.col-title { margin: 0 0 4px 0; font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
.sub-info { font-size: 0.75rem; color: var(--primary-color); text-transform: none; }

.form-item label { display: block; font-size: 0.8rem; margin-bottom: 4px; color: var(--text-secondary); }
.select-wrapper select {
  width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); color: white;
  padding: 6px 10px; border-radius: 6px; font-size: 0.85rem;
}

.model-list { display: flex; flex-wrap: wrap; gap: 6px; }
.model-chip {
  background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary);
  padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; transition: all 0.2s;
}
.model-chip:hover { border-color: var(--primary-color); color: var(--text-primary); }
.model-chip.active { background: rgba(59,130,246,0.1); border-color: var(--primary-color); color: var(--primary-color); }

.dimension-area {
  background: rgba(0,0,0,0.2); border-radius: 8px; padding: 10px; border: 1px solid var(--border-color);
  max-height: 300px; overflow-y: auto;
}

.instruction-input {
  width: 100%; height: 100%; min-height: 200px;
  background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); color: white;
  padding: 10px; border-radius: 6px; font-family: inherit; font-size: 0.9rem; resize: none;
  box-sizing: border-box;
}

.panel-footer {
  text-align: center; padding: 6px; cursor: pointer; background: rgba(0,0,0,0.2); transition: background 0.2s;
}
.panel-footer:hover { background: rgba(0,0,0,0.4); }
.close-hint { font-size: 0.75rem; color: var(--text-secondary); }

/* 展开动画 */
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease-in-out; max-height: 900px; opacity: 1; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; }

/* --- Editors --- */
.split-pane { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 500px; }
.pane { display: flex; flex-direction: column; height: 100%; }
.pane-head { margin-bottom: 8px; font-weight: bold; color: var(--text-primary); display: flex; align-items: center; justify-content: space-between; }
.pane-title { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.a-dot { background: var(--primary-color); box-shadow: 0 0 8px var(--primary-color); }
.b-dot { background: var(--accent-color); box-shadow: 0 0 8px var(--accent-color); }

.editor-frame {
  flex: 1; border-radius: 8px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* --- Bottom Panel --- */
.bottom-panel { display: flex; flex-direction: column; min-height: 350px; overflow: hidden; }
.tabs-header { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); padding: 0 16px; }
.tab-btn {
  padding: 12px 20px; background: transparent; color: var(--text-secondary); font-weight: 500;
  border-bottom: 2px solid transparent; transition: all 0.2s;
}
.tab-btn:hover { color: var(--text-primary); }
.tab-btn.active { color: var(--primary-color); border-bottom-color: var(--primary-color); background: rgba(255,255,255,0.02); }

.tab-scroll-area { padding: 24px; overflow-y: auto; flex: 1; }

.empty-state, .loading-state { text-align: center; color: var(--text-secondary); padding: 40px; }
.empty-icon { font-size: 3rem; margin-bottom: 16px; opacity: 0.5; }
.spinner {
  width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1);
  border-top-color: var(--primary-color); border-radius: 50%;
  animation: spin 1s linear infinite; margin: 0 auto 16px;
}
.sub-text { font-size: 0.8rem; opacity: 0.6; display: block; margin-top: 6px; }

.result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-xs { background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; margin-left: 8px; cursor: pointer; }

.summary-box {
  background: rgba(59,130,246,0.05); border-left: 4px solid var(--primary-color);
  padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 30px;
  line-height: 1.6; color: var(--text-primary);
}

.metrics-dashboard { display: grid; grid-template-columns: 280px 1fr; gap: 40px; }
.pk-card {
  display: flex; justify-content: space-around; align-items: center;
  background: rgba(0,0,0,0.2); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color);
}
.score-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.score-val { font-size: 2.5rem; font-weight: 800; }
.color-a { color: var(--primary-color); }
.color-b { color: var(--accent-color); }
.vs-divider { font-style: italic; font-weight: 900; opacity: 0.3; font-size: 1.2rem; }

.dim-row { display: flex; align-items: center; margin-bottom: 12px; }
.dim-label { width: 100px; font-size: 0.85rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chart-area { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.bar-track { display: flex; align-items: center; gap: 8px; height: 6px; }
.bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease-out; }
.fill-a { background: var(--primary-color); }
.fill-b { background: var(--accent-color); }
.bar-num { font-size: 0.75rem; color: rgba(255,255,255,0.5); width: 24px; text-align: right; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>