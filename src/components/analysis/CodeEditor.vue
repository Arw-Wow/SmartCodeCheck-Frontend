<!-- 注：这里使用 textarea 模拟 Monaco Editor 以保持代码轻量，实际生产中应集成 monaco-editor-vue3 -->

<template>
  <div class="code-editor-wrapper">
    <div class="editor-header">
      <span class="lang-tag">{{ language }}</span>
      <span class="copy-btn">复制</span>
    </div>
    <textarea
      class="mock-editor"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="// 在此处粘贴 LLM 生成的代码..."
      spellcheck="false"
    ></textarea>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  language: { type: String, default: 'Python' }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.code-editor-wrapper {
  background: #000;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
}
.editor-header {
  background: var(--panel-color);
  padding: 5px 10px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  justify-content: space-between;
}
.mock-editor {
  flex: 1;
  background: transparent;
  color: #fff;
  border: none;
  padding: 15px;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  resize: none;
  outline: none;
  line-height: 1.5;
}
</style>