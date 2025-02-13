import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { COZE_COM_BASE_URL } from '@coze/api'

export default defineConfig({
  // base: '/byteDanceLLM/',
  base: '/byteDanceLLM/',
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase', // 可选：将类名转换为驼峰命名
    },
  },
  server: {
    hmr: {
      overlay: false, // 禁用 HMR 错误覆盖
    },
    proxy: {
      '/api': {
        target: COZE_COM_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom', // 模拟浏览器环境
  }
})