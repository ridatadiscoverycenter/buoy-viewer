import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [vue()], // , checker({ vueTsc: true, eslint: { files: ['./src'], extensions: ['.vue', '.ts', '.js']} })
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // allows @ to work in template - https://github.com/vitejs/vite/issues/2003
      '/@': resolve(__dirname, './src'),
    },
  }
})
