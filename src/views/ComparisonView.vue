<template>
  <div class="container comparison-view">
    <div class="toolbar">
      <h2>模型代码对比</h2>
      
      <div class="controls">
         <select v-model="language">
            <option value="Auto">Auto</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="JavaScript">JavaScript</option>
         </select>
         <button class="btn btn-primary" @click="handleCompare" :disabled="isComparing">
            {{ isComparing ? '对比分析中...' : '运行对比分析' }}
         </button>
      </div>
    </div>

    <div class="split-pane">
      <div class="pane">
        <div class="pane-head">模型 A</div>
        <CodeEditor v-model="codeA" :language="language" />
      </div>

      <div class="pane">
        <div class="pane-head">模型 B</div>
        <CodeEditor v-model="codeB" :language="language" />
      </div>
    </div>
    
    <div v-if="result" class="diff-result">
      <div class="summary-section">
        <h3>🏆 分析总结</h3>
        <p class="summary-text">{{ result.summary }}</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <h4>总体评分</h4>
          <div class="score-row">
            <span>Model A: <strong class="color-a">{{ result.score_a }}</strong></span>
            <span>Model B: <strong class="color-b">{{ result.score_b }}</strong></span>
          </div>
        </div>

        <div class="metric-card">
          <h4>维度明细</h4>
          <div v-for="(scores, dim) in result.dimension_scores" :key="dim" class="dim-row">
            <span class="dim-name">{{ dim }}</span>
            <div class="bar-container">
              <div class="bar bar-a" :style="{ width: scores[0] + '%' }" :title="'Model A: ' + scores[0]"></div>
              <div class="bar bar-b" :style="{ width: scores[1] + '%' }" :title="'Model B: ' + scores[1]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodeEditor from '@/components/analysis/CodeEditor.vue'
import api from '@/api'

const language = ref('Python')
const codeA = ref('# Paste code from Model A')
const codeB = ref('# Paste code from Model B')
const isComparing = ref(false)
const result = ref(null)

const handleCompare = async () => {
  if (!codeA.value || !codeB.value) return alert('请确保两边都输入了代码')
  
  isComparing.value = true
  result.value = null
  
  try {
    const payload = {
      code_a: codeA.value,
      code_b: codeB.value,
      language: language.value,
      dimensions: ['correctness', 'efficiency', 'robustness', 'security'] // 默认全选或从UI传入
    }

    const res = await api.compareCodes(payload)
    result.value = res.data

  } catch (error) {
    console.error(error)
    alert('对比失败: ' + error.message)
  } finally {
    isComparing.value = false
  }
}
</script>

<style scoped>
.comparison-view { padding-top: 20px; padding-bottom: 50px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.controls { display: flex; gap: 10px; }
/* select { width: 100%; padding: 8px; background: var(--bg-color); color: #fff; border: 1px solid var(--border-color); border-radius: 4px; } */
.split-pane { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 400px; margin-bottom: 30px; }
.pane { display: flex; flex-direction: column; }
.pane-head { margin-bottom: 10px; font-weight: bold; color: var(--accent-color); }

/* 结果样式 */
.diff-result { background: var(--panel-color); border-radius: 8px; padding: 30px; border: 1px solid var(--border-color); }
.summary-text { font-size: 1.1rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color); }
.metrics-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 40px; }
.score-row { display: flex; flex-direction: column; gap: 10px; font-size: 1.2rem; margin-top: 15px; }
.color-a { color: var(--primary-color); }
.color-b { color: var(--accent-color); }

/* 简单的条形对比图样式 */
.dim-row { display: flex; align-items: center; margin-bottom: 12px; }
.dim-name { width: 100px; font-size: 0.9rem; color: var(--text-secondary); }
.bar-container { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.bar { height: 8px; border-radius: 4px; transition: width 1s ease; }
.bar-a { background-color: var(--primary-color); opacity: 0.8; }
.bar-b { background-color: var(--accent-color); opacity: 0.8; }
</style>