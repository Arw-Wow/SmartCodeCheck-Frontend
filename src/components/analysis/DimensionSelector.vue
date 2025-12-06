<template>
  <div class="dimension-selector">
    <label 
      v-for="dim in options" 
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
</template>

<script setup>
const props = defineProps({
  modelValue: Array
})
const emit = defineEmits(['update:modelValue'])

const options = [
  { id: 'correctness', name: '正确性' },
  { id: 'security', name: '安全性' },
  { id: 'robustness', name: '鲁棒性' },
  { id: 'maintainability', name: '可维护性' },
  { id: 'efficiency', name: '效率' }
]

const toggle = (id) => {
  const newValue = [...props.modelValue]
  if (newValue.includes(id)) {
    newValue.splice(newValue.indexOf(id), 1)
  } else {
    newValue.push(id)
  }
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.dimension-selector { display: flex; flex-direction: column; gap: 10px; }
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
}
.dim-checkbox:hover { border-color: var(--primary-color); }
.dim-checkbox.active { background: rgba(59, 130, 246, 0.1); border-color: var(--primary-color); }
input { display: none; }
</style>