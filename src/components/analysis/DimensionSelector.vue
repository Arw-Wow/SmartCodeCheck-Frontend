<template>
  <div class="dimension-selector">
    <div class="section-header">
      <span class="label">预设检测维度</span>
      <span class="count-badge">{{ modelValue.length }} 已选</span>
    </div>
    
    <div class="chips-grid">
      <div 
        v-for="dim in defaultOptions" 
        :key="dim.id" 
        class="tech-chip"
        :class="{ active: modelValue.includes(dim.id) }"
        @click="toggle(dim.id)"
      >
        <div class="active-indicator"></div>
        <span class="chip-text">{{ dim.name }}</span>
        <span class="check-mark" v-if="modelValue.includes(dim.id)">✓</span>
      </div>
    </div>

    <div class="section-header mt-4">
      <span class="label">自定义维度</span>
      <button v-if="!isAdding" @click="isAdding = true" class="btn-text-add">
        + 添加
      </button>
    </div>

    <div class="chips-grid" v-if="hasCustomDims">
      <div 
        v-for="(desc, name) in customDefinitions" 
        :key="name" 
        class="tech-chip custom-chip"
        :class="{ active: modelValue.includes(name) }"
        @click="toggle(name)"
      >
        <span class="chip-text">{{ name }}</span>
        <button @click.stop.prevent="removeCustom(name)" class="btn-chip-del" title="删除">×</button>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-if="isAdding" class="add-panel">
        <div class="input-row">
          <input 
            v-model="newDimName" 
            placeholder="维度名称 (如: 变量命名)" 
            class="clean-input"
            ref="nameInput"
            @keyup.enter="confirmAdd"
          />
        </div>
        <div class="input-row">
          <textarea 
            v-model="newDimDesc" 
            placeholder="描述检测标准..." 
            class="clean-input area"
          ></textarea>
        </div>
        <div class="action-row">
          <button @click="cancelAdd" class="btn-text">取消</button>
          <button @click="confirmAdd" class="btn-solid" :disabled="!newDimName">
            确认
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGlobalDataStore } from '@/stores/index'
import { storeToRefs } from 'pinia'

const store = useGlobalDataStore()
const { customDefinitions } = storeToRefs(store)

const props = defineProps({
  modelValue: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const defaultOptions = [
  { id: 'correctness', name: '正确性' },
  { id: 'security', name: '安全性' },
  { id: 'robustness', name: '鲁棒性' },
  { id: 'efficiency', name: '执行效率' },
  { id: 'maintainability', name: '可维护性' }
]

const isAdding = ref(false)
const newDimName = ref('')
const newDimDesc = ref('')

const hasCustomDims = computed(() => Object.keys(customDefinitions.value).length > 0)

const toggle = (id) => {
  const newValue = [...props.modelValue]
  if (newValue.includes(id)) {
    newValue.splice(newValue.indexOf(id), 1)
  } else {
    newValue.push(id)
  }
  emit('update:modelValue', newValue)
}

const confirmAdd = async () => {
  if (!newDimName.value.trim()) return
  try {
    const name = newDimName.value.trim()
    const desc = newDimDesc.value.trim()
    await store.addCustomDefinition({ [name]: desc })
    if (!props.modelValue.includes(name)) {
      emit('update:modelValue', [...props.modelValue, name])
    }
    cancelAdd()
  } catch (error) {
    alert("Error: " + error.message)
  }
}

const removeCustom = async (name) => {
  if(!confirm(`删除自定义维度 "${name}"?`)) return
  try {
    await store.deleteCustomDefinition(name)
    if (props.modelValue.includes(name)) {
      emit('update:modelValue', props.modelValue.filter(id => id !== name))
    }
  } catch (error) {
    console.error(error)
  }
}

const cancelAdd = () => {
  isAdding.value = false
  newDimName.value = ''
  newDimDesc.value = ''
}
</script>

<style scoped>
.dimension-selector { display: flex; flex-direction: column; gap: 12px; }

.section-header {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.85rem; color: var(--text-secondary);
}
.mt-4 { margin-top: 12px; }
.count-badge {
  background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 10px; font-size: 0.75rem;
}

.chips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); /* 更紧凑 */
  gap: 10px;
}

/* 无图标版 Tech Chip */
.tech-chip {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  padding: 10px 14px;
  background: rgba(30, 36, 44, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  user-select: none;
  min-height: 40px;
}

.tech-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.tech-chip.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.1) inset;
}

/* 选中时的左侧亮条 */
.active-indicator {
  position: absolute; left: 0; top: 0; bottom: 0; width: 0;
  background: var(--primary-color);
  transition: width 0.2s;
}
.tech-chip.active .active-indicator { width: 3px; }

.chip-text { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; z-index: 1; }
.tech-chip.active .chip-text { color: #fff; }

.check-mark {
  margin-left: 6px; font-size: 0.8rem; color: var(--primary-color); font-weight: bold;
  animation: scaleIn 0.2s;
}
@keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }

/* 自定义维度特殊样式 */
.custom-chip { border-style: dashed; }
.btn-chip-del {
  margin-left: 8px; background: none; color: var(--text-secondary);
  font-size: 1.1rem; padding: 0 4px; border-radius: 4px;
}
.btn-chip-del:hover { color: var(--danger); background: rgba(255,255,255,0.1); }

/* Add Button & Panel */
.btn-text-add {
  background: none; color: var(--primary-color); font-size: 0.8rem;
  cursor: pointer; padding: 2px 6px; border-radius: 4px;
}
.btn-text-add:hover { background: rgba(59, 130, 246, 0.1); }

.add-panel {
  background: var(--panel-color); border: 1px solid var(--border-color);
  padding: 12px; border-radius: 8px; margin-top: 5px;
}
.clean-input {
  width: 100%; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color);
  color: white; padding: 8px; border-radius: 4px; font-size: 0.85rem;
  transition: border-color 0.2s; box-sizing: border-box;
}
.clean-input:focus { border-color: var(--primary-color); outline: none; }
.input-row { margin-bottom: 8px; }
.area { min-height: 60px; resize: vertical; }

.action-row { display: flex; justify-content: flex-end; gap: 8px; }
.btn-text { color: var(--text-secondary); background: none; font-size: 0.8rem; }
.btn-solid {
  background: var(--primary-color); color: white; padding: 4px 12px;
  border-radius: 4px; font-size: 0.8rem;
}
.btn-solid:disabled { opacity: 0.5; cursor: not-allowed; }

.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.2s; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-5px); }
</style>