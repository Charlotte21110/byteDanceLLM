import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
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
  },
})