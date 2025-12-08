<template>
  <div class="dimension-selector">
    <div class="section-label">预设维度</div>
    <div class="checkbox-group">
      <label 
        v-for="dim in defaultOptions" 
        :key="dim.id" 
        class="dim-checkbox"
        :class="{ active: modelValue.includes(dim.id) }"
      >
        <input 
          type="checkbox" 
          :value="dim.id" 
          :checked="modelValue.includes(dim.id)"
          @change="toggle(dim.id)"
        >
        <span class="dim-name">{{ dim.name }}</span>
      </label>
    </div>

    <div v-if="hasCustomDims" class="section-label mt-3">自定义维度</div>
    <div class="checkbox-group">
      <label 
        v-for="(desc, name) in customDefinitions" 
        :key="name" 
        class="dim-checkbox custom-style"
        :class="{ active: modelValue.includes(name) }"
      >
        <input 
          type="checkbox" 
          :value="name" 
          :checked="modelValue.includes(name)"
          @change="toggle(name)"
        >
        <span class="dim-name">{{ name }}</span>
        <button @click.stop.prevent="removeCustom(name)" class="btn-remove" title="删除此维度">×</button>
      </label>
    </div>

    <div class="add-section">
      <button v-if="!isAdding" @click="isAdding = true" class="btn-show-add">
        + 添加自定义维度
      </button>
      
      <div v-else class="add-form">
        <input 
          v-model="newDimName" 
          placeholder="维度名称 (例: 命名规范)" 
          class="input-name"
          ref="nameInput"
        />
        <textarea 
          v-model="newDimDesc" 
          placeholder="详细定义 (例: 检查变量名是否符合驼峰命名法...)" 
          class="input-desc"
        ></textarea>
        <div class="form-actions">
          <button @click="cancelAdd" class="btn-cancel">取消</button>
          <button @click="confirmAdd" class="btn-confirm" :disabled="!newDimName">确认添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  customDefinitions: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'update:customDefinitions'])

const defaultOptions = [
  { id: 'correctness', name: '正确性' },
  { id: 'security', name: '安全性' },
  { id: 'robustness', name: '鲁棒性' },
  { id: 'efficiency', name: '效率' },
  { id: 'maintainability', name: '可维护性' }
]

const isAdding = ref(false)
const newDimName = ref('')
const newDimDesc = ref('')

const hasCustomDims = computed(() => Object.keys(props.customDefinitions).length > 0)

// 切换选中状态
const toggle = (id) => {
  const newValue = [...props.modelValue]
  if (newValue.includes(id)) {
    newValue.splice(newValue.indexOf(id), 1)
  } else {
    newValue.push(id)
  }
  emit('update:modelValue', newValue)
}

// 确认添加自定义维度
const confirmAdd = () => {
  if (!newDimName.value.trim()) return

  const name = newDimName.value.trim()
  const desc = newDimDesc.value.trim()

  // 1. 更新定义对象
  const newDefs = { ...props.customDefinitions, [name]: desc }
  emit('update:customDefinitions', newDefs)

  // 2. 自动选中新维度
  if (!props.modelValue.includes(name)) {
    const newSelected = [...props.modelValue, name]
    emit('update:modelValue', newSelected)
  }

  // 3. 重置表单
  cancelAdd()
}

// 删除自定义维度
const removeCustom = (name) => {
  // 1. 从定义中移除
  const newDefs = { ...props.customDefinitions }
  delete newDefs[name]
  emit('update:customDefinitions', newDefs)

  // 2. 如果已选中，从选中列表中移除
  if (props.modelValue.includes(name)) {
    const newSelected = props.modelValue.filter(id => id !== name)
    emit('update:modelValue', newSelected)
  }
}

const cancelAdd = () => {
  isAdding.value = false
  newDimName.value = ''
  newDimDesc.value = ''
}
</script>

<style scoped>
.dimension-selector { display: flex; flex-direction: column; gap: 8px; }
.section-label { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px; font-weight: 600; }
.checkbox-group { display: flex; flex-direction: column; gap: 8px; }
.mt-3 { margin-top: 15px; }

/* 复选框样式 */
.dim-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: var(--panel-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.dim-checkbox:hover { border-color: var(--primary-color); }
.dim-checkbox.active { background: rgba(59, 130, 246, 0.1); border-color: var(--primary-color); }
.custom-style { border-style: dashed; }

.dim-checkbox input { display: none; }
.dim-name { font-size: 0.9rem; }

/* 删除按钮 */
.btn-remove {
  margin-left: auto;
  background: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  line-height: 1;
  padding: 0 4px;
  border-radius: 4px;
}
.btn-remove:hover { color: var(--danger); background: rgba(218, 54, 51, 0.1); }

/* 添加区域样式 */
.btn-show-add {
  width: 100%;
  border: 1px dashed var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  padding: 8px;
  margin-top: 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  transition: color 0.2s;
}
.btn-show-add:hover { color: var(--primary-color); border-color: var(--primary-color); }

.add-form {
  margin-top: 10px;
  padding: 12px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-name, .input-desc {
  width: 100%;
  background: #0d1117;
  border: 1px solid var(--border-color);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.85rem;
  box-sizing: border-box;
}
.input-desc { resize: vertical; min-height: 50px; }
.form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
.btn-cancel, .btn-confirm { padding: 4px 12px; border-radius: 4px; font-size: 0.8rem; }
.btn-cancel { background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); }
.btn-confirm { background: var(--primary-color); color: white; }
.btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
</style>