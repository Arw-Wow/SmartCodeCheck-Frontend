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

    <div class="editor-body-area">
      
      <div v-if="mode === 'paste'" class="cm-layout-fixer">
        <codemirror
          v-model="code"
          placeholder="// 在此处粘贴代码，或使用上传功能..."
          :style="{ height: '100%', fontSize: '14px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="4"
          :extensions="extensions"
          @change="handleChange"
        />
      </div>

      <div v-else class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { EditorView } from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { javascript } from '@codemirror/lang-javascript'
import { go } from '@codemirror/lang-go'

const props = defineProps({
  modelValue: String,
  language: { type: String, default: 'Python' }
})
const emit = defineEmits(['update:modelValue'])

const mode = ref('paste')
const code = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  if (newVal !== code.value) {
    code.value = newVal
  }
})

const handleChange = (newVal) => {
  emit('update:modelValue', newVal)
}

const extensions = computed(() => {
  const exts = [oneDark, EditorView.lineWrapping]
  switch (props.language) {
    case 'Python': exts.push(python()); break
    case 'Java': exts.push(java()); break
    case 'C++': case 'C': exts.push(cpp()); break
    case 'JavaScript': case 'TypeScript': exts.push(javascript()); break
    case 'Go': exts.push(go()); break
    default: break
  }
  return exts
})

// --- 文件上传逻辑 ---
const processFile = (file) => {
  const validExts = ['.py', '.java', '.cpp', '.js', '.ts', '.go', '.c', '.h', '.txt', '.md']
  const isExtValid = validExts.some(ext => file.name.toLowerCase().endsWith(ext))
  const maxSize = 1 * 1024 * 1024 
  
  if (!isExtValid) return alert(`不支持的文件格式: ${file.name}`)
  if (file.size > maxSize) return alert(`文件过大`)

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target.result
    code.value = content
    emit('update:modelValue', content)
    mode.value = 'paste'
  }
  reader.readAsText(file)
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) processFile(file)
  event.target.value = '' 
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) processFile(file)
}
</script>

<style scoped>
/* 1. 最外层包装器 */
.code-editor-wrapper {
  background: #000000;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  height: 100%;       /* 必须设置高度 */
  overflow: hidden;   /* 隐藏超出圆角的部分 */
}

/* 2. 顶部 Header (固定高度) */
.editor-header {
  flex: 0 0 40px;     /* 固定 40px 高度，不伸缩 */
  background: var(--panel-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

/* 3. 主体区域容器 (占据剩余空间) */
.editor-body-area {
  flex: 1;            /* 占据 Header 之外的所有空间 */
  position: relative; /* 作为绝对定位子元素的锚点 */
  min-height: 0;      /* 关键：允许 flex 子项收缩，防止被内容撑大 */
  width: 100%;
}

/* 4. CodeMirror 的绝对定位修正层 */
.cm-layout-fixer {
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  height: 100%;
}

/* 5. CodeMirror 深度样式覆盖 */
:deep(.cm-editor) {
  height: 100%; 
  outline: none;
  background: #0d0d0d !important;
}

:deep(.cm-scroller) {
  overflow: auto !important; /* 强制开启滚动 */
  height: 100% !important;
  font-family: 'Fira Code', 'Consolas', monospace;
  line-height: 1.6;
}

:deep(.cm-gutters) {
  background-color: var(--panel-color);
  border-right: 1px solid var(--border-color);
  color: var(--text-secondary);
}

/* --- 原有样式保持不变 --- */
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

/* 上传区域适配 */
.upload-area {
  height: 100%; /* 填满 .editor-body-area */
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