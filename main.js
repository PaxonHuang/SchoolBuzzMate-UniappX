import App from './App.vue'
import { createSSRApp } from 'vue'

// 导入粗野主义手绘风格UI组件库
import BrutalistUI from './components'

export function createApp() {
  const app = createSSRApp(App)
  
  // 全局注册组件库
  app.use(BrutalistUI)
  
  return {
    app
  }
}