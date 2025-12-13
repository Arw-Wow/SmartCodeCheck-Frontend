// store.js 实现数据暂存

import { reactive } from 'vue'

export const store = reactive({
  // 检测页状态
  detection: {
    language: 'Python',
    code: 'def example():\n    print("Hello World")',
    selectedDimensions: ['correctness', 'security'],
    customDefinitions: {}, // { "维度名": "定义" }
    generationInstruction: '',
    results: null
  },
  // 对比页状态
  comparison: {
    language: 'Python',
    codeA: '',
    codeB: '',
    selectedDimensions: ['correctness', 'efficiency'],
    customDefinitions: {},
    generationInstruction: '',
    results: null
  }
})