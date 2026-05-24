# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Development server (default platform)
npm run dev

# Development for WeChat Mini Program (primary target)
npm run dev:mp-weixin

# Production build
npm run build

# Production build for WeChat Mini Program
npm run build:mp-weixin
```

**No linting, testing, or CI is configured.** Manual testing in HBuilderX and WeChat DevTools is the only quality gate.

## Key Tool Paths

- **HBuilderX:** `E:\HbuilderX\HBuilderX\HBuilderX.exe`
- **WeChat DevTools:** `E:\Tencent微信web开发者工具\微信web开发者工具\微信开发者工具.exe`

Workflow: `npm run dev:mp-weixin` compiles to `dist/dev/mp-weixin/`, then open that folder in WeChat DevTools to preview.

## Architecture

### Tech Stack
- **Framework:** UniApp X (DCloud) — cross-platform mini-program framework
- **Language:** UTS (Uni TypeScript) — mandatory for all script blocks. NOT regular TypeScript.
- **UI:** Vue 3 Composition API with `<script setup lang="uts">`
- **State:** Pinia (composition API pattern in `stores/`)
- **Backend:** UniCloud (serverless, Alibaba Cloud)
- **Auth:** uni-id via `uni-id-cf` cloud function
- **Payments:** uni-pay via `createPayment` cloud function

### App Structure
- `App.vue` — App entry, initializes uni-id WeChat login, sets status bar height
- `main.ts` — Creates SSR app with Pinia
- `pages.json` — Route config with custom tabBar (`"custom": true`)
- `components/brutalist/TabBar.vue` — Custom bottom nav (5 tabs: home, buddy, delivery, forum, messages). Must be manually included in tab page templates.

### Page Routing
Tab pages use `uni.switchTab()`, non-tab pages use `uni.navigateTo()`. The custom TabBar component must be imported and placed in every tab page template.

### Database (UniCloud)
5 collections with schemas in `uniCloud-alipay/database/schema/`:

| Collection | Purpose | Key Relations |
|---|---|---|
| `users` | User profiles | Linked to uni-id via `uid` |
| `requests` | Buddy/delivery requests | `creator` -> `users._id` |
| `orders` | Payment orders | `requestId` -> `requests._id` |
| `messages` | In-app notifications | `sender`/`receiver` -> `users._id` |
| `posts` | Forum posts | `creator` -> `users._id` |

Schema permissions use `auth.uid` for row-level security. `messages` requires `required: ["type", "content", "sender", "receiver"]`.

### Mock Fallback Pattern
Cloud functions are not always deployed. The codebase uses a degradation pattern: try UniCloud call -> on failure, fall back to mock/local data. This is intentional for development. See `stores/user.uts:loginMock()` and page-level `catch` blocks.

## Critical Constraints

### UTS is NOT TypeScript
Every `.vue` file MUST use `<script setup lang="uts">`. UTS has different semantics from TypeScript:
- `uni.login()` returns an object in UTS, not a callback-based API
- Type assertions use `as` but some TS patterns (generics, utility types) are unsupported
- Array/object spread may behave differently

### Design System: Brutalist + Hand-drawn
All UI must use the existing brutalist components. The design tokens (defined locally in each component's SCSS):

```scss
$black: #000000;
$white: #ffffff;
$red: #FF6B6B;
$teal: #4ECDC4;
$yellow: #FFE66D;
```

Components: `BrutalistCard` (taped/dashed/doodle/accent variants), `BrutalistButton` (accent/large/small/disabled/outline/taped/arrow), `BrutalistInput`, `HandDrawnIcon`, `TabBar`.

Visual signatures: 4rpx solid black borders, hard `box-shadow`, `clip-path` for torn-paper edges, tape decorations, animated doodles (star/circle glyphs with CSS spin/pulse animations).

### Styling Rules
- Use `rpx` units exclusively (responsive pixels, 750rpx = screen width)
- SCSS is scoped per component
- No global SCSS variables file — colors are redeclared in each component
- Images must use `lazy-load` directive
- `v-for` must always have a unique `:key`

### WeChat Mini Program Specifics
- Conditional compilation: `// #ifdef MP-WEIXIN` / `// #endif` for WeChat-only code
- `uni-config.json` stores WeChat appid/secret — currently placeholder values
- Token storage uses `uni.setStorageSync`/`uni.getStorageSync`

## Cloud Function Deployment

Cloud functions live in `uniCloud-alipay/cloudfunctions/`. To deploy:
1. Right-click `uniCloud` directory in HBuilderX -> "Associate Cloud Space"
2. Right-click individual cloud function -> "Upload and Deploy"
3. Import schemas via UniCloud web console

The `uni-id-cf` function handles auth; `createPayment` handles order creation. Both require the cloud space to be associated first.

## Deployment Checklist

- [ ] All components use `<script setup lang="uts">`
- [ ] HBuilderX console shows no type errors
- [ ] Cloud functions uploaded to UniCloud
- [ ] Database schemas imported in UniCloud console
- [ ] `uni-config.json` has real WeChat appid/secret (not `YOUR_WECHAT_APPID`)
- [ ] `pages.json` routes match actual page files
- [ ] Custom TabBar component included in all tab page templates
- [ ] Test login flow in WeChat DevTools
- [ ] Test payment in sandbox environment
- [ ] Verify responsive layout on mobile
