import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 导入 path 模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 定义 @ 为 src 目录的绝对路径
    },
  },
})