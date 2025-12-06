<template>
  <div class="container comparison-view">
    <div class="toolbar">
      <h2>模型代码对比 (A/B Test)</h2>
      <button class="btn btn-primary" @click="startDiff">运行对比分析</button>
    </div>

    <div class="split-pane">
      <div class="pane">
        <div class="pane-head">模型 A (基准)</div>
        <CodeEditor v-model="codeA" language="Python" />
      </div>

      <div class="pane">
        <div class="pane-head">模型 B (测试)</div>
        <CodeEditor v-model="codeB" language="Python" />
      </div>
    </div>
    
    <div v-if="showResult" class="diff-result">
      <h3>分析结论</h3>
      <p>模型 A 在 <strong>可维护性</strong> 上得分更高，注释更完整。模型 B 代码更简洁，但在 <strong>边界情况</strong> 处理上存在缺失。</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodeEditor from '@/components/analysis/CodeEditor.vue'

const codeA = ref('# Paste Model A code here...')
const codeB = ref('# Paste Model B code here...')
const showResult = ref(false)

const startDiff = () => {
  showResult.value = true
}
</script>

<style scoped>
.comparison-view { padding-top: 20px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.split-pane { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 500px; }
.pane-head { margin-bottom: 10px; font-weight: bold; color: var(--accent-color); }
.diff-result { margin-top: 30px; padding: 20px; background: var(--panel-color); border-radius: 8px; }
</style>