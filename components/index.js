// 粗野主义手绘风格UI组件库入口文件
// 提供统一的组件导入方式

import BrutalistButton from './BrutalistButton/BrutalistButton.vue'
import BrutalistInput from './BrutalistInput/BrutalistInput.vue'
import BrutalistCard from './BrutalistCard/BrutalistCard.vue'
import BrutalistAvatar from './BrutalistAvatar/BrutalistAvatar.vue'
import BrutalistTabBar from './BrutalistTabBar/BrutalistTabBar.vue'
import BrutalistTitle from './BrutalistTitle/BrutalistTitle.vue'
import BrutalistDialog from './BrutalistDialog/BrutalistDialog.vue'
import BrutalistToast from './BrutalistToast/BrutalistToast.vue'
import BrutalistLoading from './BrutalistLoading/BrutalistLoading.vue'

// 全局注册组件
export const components = {
  BrutalistButton,
  BrutalistInput,
  BrutalistCard,
  BrutalistAvatar,
  BrutalistTabBar,
  BrutalistTitle,
  BrutalistDialog,
  BrutalistToast,
  BrutalistLoading
}

// 单独导出各组件
export {
  BrutalistButton,
  BrutalistInput,
  BrutalistCard,
  BrutalistAvatar,
  BrutalistTabBar,
  BrutalistTitle,
  BrutalistDialog,
  BrutalistToast,
  BrutalistLoading
}

// 提供全局安装方法（适配Vue3）
export const install = function(app) {
  Object.keys(components).forEach(key => {
    app.component(key, components[key])
  })
}

export default {
  install,
  ...components
}