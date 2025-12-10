<template>
  <div class="code-editor-wrapper">
    <div class="editor-header">
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: mode === 'paste' }"
          @click="mode = 'paste'"
        >
          ✏️ 编辑模式
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: mode === 'upload' }"
          @click="mode = 'upload'"
        >
          📂 文件上传
        </button>
      </div>
      
      <div class="header-info">
        <span class="lang-tag">{{ language }}</span>
      </div>
    </div>

    <textarea
      v-show="mode === 'paste'"
      class="mock-editor"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="// 在此处粘贴代码，或使用上传功能..."
      spellcheck="false"
    ></textarea>

    <div v-show="mode === 'upload'" class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
      <div class="upload-box">
        <div class="icon">☁️</div>
        <p>将文件拖拽至此，或</p>
        <label class="upload-btn">
          点击选择文件
          <input type="file" ref="fileInput" @change="handleFileSelect" accept=".py,.java,.cpp,.js,.ts,.go,.c,.h" />
        </label>
        <p class="limit-tip">支持 .py, .java, .cpp 等常见格式 (Max 1MB)</p>
        <p class="limit-tip">上传后将自动读取内容至编辑器</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: String,
  language: { type: String, default: 'Text' }
})
const emit = defineEmits(['update:modelValue'])

const mode = ref('paste') // 'paste' | 'upload'
const fileInput = ref(null)

// 处理文件读取逻辑
const processFile = (file) => {
  // 1. 格式校验 (简单的后缀名检查)
  const validExts = ['.py', '.java', '.cpp', '.js', '.ts', '.go', '.c', '.h', '.txt', '.md']
  const isExtValid = validExts.some(ext => file.name.toLowerCase().endsWith(ext))
  
  // 2. 大小校验 (1MB)
  const maxSize = 1 * 1024 * 1024 
  
  if (!isExtValid) {
    return alert(`不支持的文件格式: ${file.name}\n请上传源码文件。`)
  }
  if (file.size > maxSize) {
    return alert(`文件过大 (${(file.size/1024).toFixed(1)}KB)。\n请上传 1MB 以内的代码文件。`)
  }

  // 3. 读取内容
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target.result
    emit('update:modelValue', content)
    // 读取成功后自动切回编辑模式，方便用户查看
    mode.value = 'paste'
  }
  reader.onerror = () => alert('文件读取失败')
  reader.readAsText(file)
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) processFile(file)
  // 清空 input 允许重复上传同名文件
  event.target.value = '' 
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) processFile(file)
}
</script>

<style scoped>
.code-editor-wrapper {
  background: #0d1117;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
}

/* 顶部 Tab 样式 */
.editor-header {
  background: var(--panel-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 40px;
}
.tabs { display: flex; height: 100%; }
.tab-btn {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0 15px;
  font-size: 0.85rem;
  height: 100%;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover { color: var(--text-primary); }
.tab-btn.active { color: var(--primary-color); border-bottom-color: var(--primary-color); background: rgba(59, 130, 246, 0.05); }

.lang-tag { font-size: 0.75rem; color: var(--text-secondary); background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; }

/* 编辑器样式 */
.mock-editor {
  flex: 1;
  background: transparent;
  color: #e6edf3;
  border: none;
  padding: 15px;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  resize: none;
  outline: none;
  line-height: 1.5;
}

/* 上传区域样式 */
.upload-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.02);
}
.upload-box {
  text-align: center;
  border: 2px dashed var(--border-color);
  padding: 40px;
  border-radius: 12px;
  color: var(--text-secondary);
  transition: all 0.2s;
}
.upload-box:hover { border-color: var(--primary-color); background: rgba(59, 130, 246, 0.05); }
.icon { font-size: 3rem; margin-bottom: 15px; opacity: 0.7; }
.upload-btn {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 8px 20px;
  border-radius: 6px;
  margin: 10px 0;
  cursor: pointer;
  font-size: 0.9rem;
  transition: filter 0.2s;
}
.upload-btn:hover { filter: brightness(1.1); }
.upload-btn input { display: none; }
.limit-tip { font-size: 0.8rem; opacity: 0.6; margin: 5px 0; }
</style>