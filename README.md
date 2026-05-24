# 校趣闪搭校园服务平台

claude code 牛逼

claude傻逼公司

## 项目概述

校趣闪搭是一个为校园学生提供全方位服务的平台，包括：

- **找搭子**：寻找学习伙伴、运动搭档
- **外卖跑腿**：代取快递、食堂带饭
- **云打印**：文件上传、就近打印
- **实时消息**：站内沟通、通知提醒

## 技术栈

### 前端技术

- **框架**: UniAppX (支持多端发布)
- **语言**: UTS (UniApp TypeScript) + Vue 3 Composition API
- **状态管理**: Pinia
- **UI设计**: Brutalist 手绘风格（粗黑边框、不规则线条、大胆色块）

### 后端技术

- **云服务**: UniCloud (阿里云/腾讯云)
- **数据库**: UniCloud DB (NoSQL 文档型数据库)
- **认证**: uni-id (统一用户认证)
- **支付**: uni-pay (微信支付集成)

### 核心特性

- ✅ **UTS 类型安全**：所有组件使用 `<script setup lang="uts">` 强制类型检查
- ✅ **Brutalist UI 一致性**：通过统一组件库确保界面一致性
- ✅ **支付闭环**：完整的沙箱环境支付流程

## 项目结构

```
E:\codeplace\test\
├── components/           # 组件目录
│   └── brutalist/        # Brutalist 手绘风格组件
│       ├── BrutalistCard.vue
│       ├── BrutalistButton.vue
│       ├── BrutalistInput.vue
│       ├── HandDrawnIcon.vue
│       └── TabBar.vue
├── pages/               # 页面目录
│   ├── index/           # 首页
│   ├── buddy/           # 找搭子
│   ├── delivery/         # 外卖跑腿
│   ├── print/            # 云打印
│   ├── payment/          # 支付页面
│   └── chat/             # 聊天页面
├── stores/              # Pinia 状态管理
│   └── user.uts         # 用户状态
├── uniCloud/            # UniCloud 云端代码
│   ├── cloudfunctions/  # 云函数
│   │   ├── uni-id-cf/   # uni-id 认证云函数
│   │   └── createPayment/ # 支付云函数
│   ├── database/        # 数据库
│   │   └── schema/      # 数据库 Schema
│   └── uni-config.json  # UniCloud 配置
├── static/              # 静态资源
├── App.vue              # 应用入口
├── main.ts              # 主入口文件
├── pages.json           # 页面配置
├── manifest.json        # 应用配置
└── package.json         # 项目依赖

```

## 数据库设计

### users 集合（用户信息）

```typescript
interface User {
  _id: string
  uid: string              // uni-id 关联 ID
  nickname: string         // 用户昵称
  avatar: string           // 用户头像
  campus: string           // 所属校区
  tags: string[]           // 用户标签
  createTime: Timestamp
  updateTime: Timestamp
}
```

### requests 集合（需求请求）

```typescript
interface Request {
  _id: string
  type: 'buddy' | 'delivery' | 'carpool' | 'print' | 'secondhand'
  title: string            // 请求标题
  description: string      // 详细描述
  location?: GeoPoint      // 地理位置
  time?: Timestamp        // 约定时间
  maxParticipants?: number // 最大参与人数
  status: 'open' | 'filled' | 'completed'
  tags: string[]          // 标签列表
  creator: string         // 创建者 ID
  createTime: Timestamp
  updateTime: Timestamp
}
```

### orders 集合（订单）

```typescript
interface Order {
  _id: string
  requestId: string       // 关联请求 ID
  amount: number          // 订单金额
  status: 'unpaid' | 'paid' | 'refunded'
  paymentTime?: Timestamp
  createTime: Timestamp
  updateTime: Timestamp
}
```

### messages 集合（消息）

```typescript
interface Message {
  _id: string
  content: string         // 消息内容
  sender: string          // 发送者 ID
  receiver: string        // 接收者 ID
  timestamp: Timestamp    // 发送时间
  read: boolean           // 是否已读
}
```

## 快速开始

### 环境要求

- Node.js >= 16.x
- HBuilderX (推荐最新版本)
- 微信开发者工具

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd campus-quick-match
```

2. **安装依赖**

```bash
npm install
```

3. **配置 UniCloud**

- 在 HBuilderX 中打开项目
- 右键 `uniCloud` 目录 → "关联云服务空间"
- 选择或创建阿里云/腾讯云服务空间

4. **配置微信小程序**

- 修改 `manifest.json` 中的 `appid`
- 配置 `uniCloud/uni-config.json` 中的微信 AppID 和 AppSecret
- 在微信公众平台配置服务器域名

5. **运行项目**

```bash
# 开发模式（运行到微信小程序）
npm run dev:mp-weixin

# 生产构建
npm run build:mp-weixin
```

### 环境变量配置

在 `uniCloud/uni-config.json` 中配置：

```json
{
  "mp-weixin": {
    "oauth": {
      "weixin": {
        "appid": "YOUR_WECHAT_APPID",
        "appsecret": "YOUR_WECHAT_APPSECRET"
      }
    }
  }
}
```

## 核心功能实现

### 1. 用户认证（uni-id）

- 使用 uni-id 统一认证体系
- 支持微信小程序登录
- 云函数：`uni-id-cf`

### 2. 找搭子模块

- 标签匹配算法：根据用户标签和需求标签进行匹配
- 地理位置过滤：使用 GeoPoint 进行位置查询
- 状态管理：open → filled → completed

### 3. 外卖跑腿模块

- 状态机管理：open → in_progress → completed
- 防重复提交机制
- 订单状态同步

### 4. 云打印模块

- 文件上传至 UniCloud 云存储
- 打印参数校验（双面/彩印）
- 价格计算逻辑

### 5. 支付系统（uni-pay）

- 微信支付集成
- 支付回调处理
- 交易状态同步

### 6. 实时消息系统

- 使用 UniCloud 消息队列
- 未读消息计数
- 实时消息推送

## Brutalist UI 设计规范

### 颜色方案

```scss
$black: #000;
$white: #fff;
--uni-color-primary: #4CAF50; // 绿色主题
```

### 组件样式示例

```scss
.brutalist-card {
  border: 4rpx solid $black;
  clip-path: polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%);
  background: $white;
  box-shadow: 8rpx 8rpx 0 var(--uni-color-primary);
  padding: 32rpx;
}
```

### 手绘图标

- 使用内联 SVG
- 关键属性：`stroke-width="1.5" vector-effect="non-scaling-stroke"`
- 不规则路径模拟手绘效果

## 开发规范

### UTS 类型安全

所有组件必须使用 `<script setup lang="uts">`：

```vue
<script setup lang="uts">
interface Props {
  title: string
}

const props = defineProps<Props>()
</script>
```

### 组件命名

- 页面组件：PascalCase（如 `BuddyList.vue`）
- 功能组件：Brutalist 前缀（如 `BrutalistCard.vue`）

### 代码风格

- 使用 Composition API
- 优先使用 `ref`、`computed`、`watch`
- 事件处理使用 `emit` 定义

## 部署流程

1. **上传云函数**

```bash
# 在 HBuilderX 中右键云函数目录
# 选择 "上传部署"
```

2. **初始化数据库**

```bash
# 在 UniCloud Web 控制台
# 创建数据库集合：users, requests, orders, messages
# 导入对应的 schema 文件
```

3. **发布小程序**

```bash
# 1. 运行到微信开发者工具
npm run dev:mp-weixin

# 2. 在微信开发者工具中预览
# 3. 上传代码
# 4. 提交审核
```

## 测试

### 沙箱环境测试

在微信开发者工具中进行：

- 用户登录流程
- 发布需求功能
- 支付流程（使用测试账号）
- 消息收发

### 关键验证点

- ✅ UTS 类型安全：所有组件通过类型检查
- ✅ UI 一致性：所有页面使用 Brutalist 组件
- ✅ 支付闭环：完成沙箱环境支付全流程

## 常见问题

### 1. 云函数调用失败

检查：

- 云函数是否已上传
- 服务空间是否关联
- 权限配置是否正确

### 2. 数据库操作失败

检查：

- Schema 是否已创建
- 权限规则是否正确
- 数据格式是否匹配

### 3. 支付失败

检查：

- uni-pay 配置是否正确
- 商户号配置是否正确
- 回调 URL 是否可访问

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证

## 联系方式

- 项目地址：[GitHub Repository]
- 问题反馈：[Issues]

---

**注意**: 本项目为校园服务平台，请在使用前仔细阅读相关法律法规。
