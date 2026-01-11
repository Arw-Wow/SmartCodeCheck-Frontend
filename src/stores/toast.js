import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nanoid } from 'nanoid' // 如果没有安装 nanoid，可以用 Date.now() + Math.random() 代替

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  /**
   * 添加消息
   * @param {string} message - 消息内容
   * @param {string} type - 类型: 'success' | 'error' | 'warning' | 'info'
   * @param {number} duration - 持续时间 (ms)
   */
  const add = (message, type = 'info', duration = 3000) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2)
    toasts.value.push({ id, message, type })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const remove = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (msg, duration) => add(msg, 'success', duration)
  const error = (msg, duration) => add(msg, 'error', duration)
  const warning = (msg, duration) => add(msg, 'warning', duration)

  return { toasts, add, remove, success, error, warning }
})