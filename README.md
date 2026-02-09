# SchoolBUZZUniAPPUnicloudTESTTEST 项目说明

## 项目概述

校园社交系统（校趣闪搭）基于 UniAPP + Vue3 + UniCloud，支持微信小程序与 H5，集成 uni-id 统一身份认证、uni-admin 管理后台。注意该分支仅仅用于粗野主义登录样式前端展示，无后端。

## 图片预览

<img src="https://njts1-1332869940.cos.ap-shanghai.myqcloud.com/mergeSchoolBuzz.JPG" style="zoom: 25%;" />

# 技术栈

- 前端：UniAPP (Vue3)
- 后端：UniCloud 阿里云
- 认证：uni-id（微信小程序登录、短信验证码登录）
- 管理：uni-admin
- 数据库：UniCloud 云数据库（原 Supabase/Mongo 逻辑已迁移）

## 环境准备

1. **HBuilderX** 最新版（支持 Vue3）
2. **微信开发者工具** 稳定版
3. Node.js >= 16
4. 微信小程序 AppID（在微信公众平台申请）

## 项目结构

```
├─ pages/                 # 页面
├─ components/            # 组件
├─ static/               # 静态资源
│  └─ images/            # 图片（tabBar、logo 等）
├─ uniCloud-aliyun/      # UniCloud 云函数与数据库
├─ manifest.json         # 应用配置（含 vueVersion: 3）
├─ pages.json            # 路由与 tabBar 配置
└─ main.js               # 入口文件
```

## 迁移说明

本项目已由    Vue2 升级至 Vue3：

- 使用 `createSSRApp` 创建实例
- 生命周期 `beforeDestroy` → `beforeUnmount`
- 组件注册由 `Vue.component` 改为 `app.component`
- 所有网络请求通过 UniCloud 云函数中转

## 配置步骤

### 1. 微信小程序 AppID

- 在 `manifest.json` → 微信小程序配置中填写 AppID
- 微信开发者工具中登录同一账号并导入项目

### 2. uni-id 配置

路径：`uniCloud-aliyun/cloudfunctions/common/uni-config-center/uni-id/config.json`

```json
{
  "oauth": {
    "weixin": {
      "appid": "你的小程序AppID",
      "appsecret": "你的小程序AppSecret"
    }
  },
  "service": {
    "sms": {
      "templateId": "你的短信模板ID",
      "sign": "你的短信签名"
    }
  }
}
```

上传云函数使配置生效。

### 3. 云函数部署

- 在 HBuilderX 右键 `uniCloud-aliyun` → 关联云服务空间或选择阿里云
- 右键云函数目录 → 上传所有云函数与公共模块

### 4. 数据库初始化

- 在 uniCloud web 控制台创建集合（如 `uni-id-users`, `posts`, `comments`）
- 设置云函数对应权限（可读写）

### 5. 静态资源

将所需图片（如 `logo.png`, tabBar 图标）放入 `static/images/`，确保 `pages.json` 路径正确。

## 运行项目

1. HBuilderX 中打开项目
2. 点击 **运行** → **运行到小程序模拟器** → **微信开发者工具**
3. 微信开发者工具中确认可正常编译并显示首页

## 常见问题

### 微信授权失败

- 检查 `uni-id` 中微信 AppID/Secret 与公众平台一致
- 确认云函数 `loginByWeixin` 调用无误
- 微信开发者工具 → 详情 → 本地设置 → 不校验合法域名（测试）

### 短信登录失败 / mongo_cell_decision_not_found

- 确保所有数据库操作经过 UniCloud 云函数
- 检查集合名与字段名是否与数据库一致
- 查看云函数日志定位具体查询错误

### 静态资源 500 错误

- 确认 `static/images/` 中存在引用文件
- 删除或更正错误路径

## 维护与扩展

- 新增页面在 `pages.json` 注册
- 新增组件放入 `components/` 并在页面引入
- 业务逻辑写在 `uniCloud-aliyun` 云函数中，通过 `uni.request` 调用

---

© 2025 SchoolBUZZ Team
