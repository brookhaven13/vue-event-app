# 🎯 Event Management System

現代化 Vue 3 功能完整的事件管理系統前端應用，採用於管理活動，提供使用者認證、個人化活動儀表板以及流暢的導航體驗。採用 Vue Router、Pinia 和 PrimeVue 打造，提供響應式且優雅的使用者介面。非常適合輕鬆組織、瀏覽和參與活動。

[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PrimeVue](https://img.shields.io/badge/PrimeVue-42b883?style=for-the-badge&logo=vue.js&logoColor=white)](https://primevue.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌟 專案特色

- 🚀 **現代化技術棧**：Vue 3 Composition API + TypeScript + Vite
- 🎨 **美觀 UI**：PrimeVue 組件庫 + Tailwind CSS 響應式設計
- 🔒 **完整認證**：JWT Token 管理 + 路由守衛保護
- 📱 **響應式設計**：支援桌面、平板、手機等各種設備
- ⚡ **高效能**：Vite 構建工具 + 懶加載路由
- 🛡️ **類型安全**：完整 TypeScript 支援

## 🚀 快速開始

### 環境要求

- Node.js 18+
- npm
- Go 1.19+ (用於後端 API)

### 🔧 完整運行步驟

#### 1️⃣ 設定後端 API

```bash
# 首先克隆並啟動後端服務
git clone https://github.com/brookhaven13/golang-event-api.git
cd golang-event-api
# 按照後端專案 README 啟動服務到 localhost:8080
```

#### 2️⃣ 設定前端應用

```bash
# 回到前端專案目錄
cd ../event-app

# 安裝依賴
npm install

# 創建環境配置檔案
cp .env.example .env
# 編輯 .env 檔案，確保 VITE_API_BASE_URL=http://localhost:8080/api/v1

# 啟動開發服務器
npm run dev
```

#### 3️⃣ 建構生產版本

```bash
npm run build
```

**重要**：確保後端 API 服務在 `localhost:8080` 正常運行，前端功能才能正常使用。

### 📁 專案結構

```
src/
├── assets/              # 靜態資源
├── components/          # Vue 組件
│   ├── layout/         # 佈局組件
│   └── icons/          # 圖標組件
├── composables/        # 組合式函數
├── router/             # 路由配置
├── services/           # API 服務
├── stores/             # Pinia 狀態管理
├── types/              # TypeScript 類型定義
├── views/              # 頁面組件
├── App.vue             # 根組件
└── main.ts             # 應用入口
```

### ⚙️ 後端 API 設定

本前端應用需要配合 Go 後端 API 使用。請先設定後端服務：

#### 🔧 後端 API 安裝

1. **克隆後端專案**：

```bash
git clone https://github.com/brookhaven13/golang-event-api.git
cd golang-event-api
```

2. **啟動後端服務**：

```bash
# 按照 golang-event-api 專案的 README 指示啟動服務
# 預設會在 localhost:8080 運行
```

#### ⚙️ 前端環境配置

創建 `.env` 檔案並配置 API 端點：

```bash
# API 配置 - 指向本地後端服務
VITE_API_BASE_URL=http://localhost:8080/api/v1

# 開發環境配置
VITE_APP_TITLE=Event Management System
VITE_APP_VERSION=1.0.0
```

**重要提醒**：

- 確保後端 API 服務已在 `localhost:8080` 正常運行
- 前端應用才能正常進行用戶認證和事件管理功能

## 📋 完整功能說明

### 🔐 用戶認證系統

- **用戶註冊**
  - 表單驗證（電子郵件格式、密碼強度）
  - 用戶名唯一性檢查
  - 註冊成功自動登入
- **用戶登入**
  - 安全的登入表單
  - JWT Token 自動管理
  - 記住登入狀態
  - 登入失敗提示

- **認證保護**
  - 路由守衛自動驗證
  - Token 過期自動跳轉
  - 安全登出功能

### 🎯 事件管理功能

#### 📋 事件瀏覽

- **事件列表頁面**
  - 分頁顯示所有事件
  - 事件卡片式佈局
  - 快速搜尋功能
  - 事件狀態標籤

#### 📝 事件操作

- **創建新事件**
  - 豐富的表單編輯器
  - 時間日期選擇器
  - 地點設定
  - 容量限制設定
  - 事件描述編輯

- **編輯事件**
  - 僅限事件創建者
  - 預填充現有資料
  - 實時保存提示

- **刪除事件**
  - 安全確認對話框
  - 僅限事件擁有者

#### 👥 參與管理

- **參與事件**
  - 一鍵參與/取消參與
  - 即時更新參與人數
  - 滿額提示

- **事件詳情**
  - 完整事件資訊顯示
  - 參與者列表
  - 事件創建者資訊
  - 社交分享功能

### 📊 個人儀表板

- **統計數據**
  - 我創建的事件數量
  - 我參與的事件數量
  - 活動參與度圖表

- **事件管理**
  - 我主辦的事件列表
  - 快速編輯/刪除
  - 事件狀態管理

- **參與記錄**
  - 我參與的事件
  - 參與歷史記錄
  - 取消參與管理

### 🎨 用戶界面特色

- **現代化設計**
  - 漸層色彩搭配
  - 圓角容器設計
  - 陰影效果
  - 平滑動畫轉場

- **響應式佈局**
  - 桌面端多欄佈局
  - 平板端自適應
  - 手機端單欄顯示
  - 觸控友善操作

- **互動體驗**
  - 載入狀態提示
  - 成功/錯誤訊息
  - 懸停效果
  - 點擊反饋

## 🛠️ 技術架構

### 🔄 系統架構

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Vue 3 前端     │ ←─── ─────────→ │   Go 後端 API   │
│  (本專案)        │     JSON        │  (另一個專案)    │
└─────────────────┘                 └─────────────────┘
```

### 前端技術棧

- **框架**：Vue 3.5+ (Composition API)
- **語言**：TypeScript 5.0+
- **構建工具**：Vite 6.0+
- **UI 庫**：PrimeVue 4.0+ (Aura 主題)
- **CSS 框架**：Tailwind CSS 3.0+
- **狀態管理**：Pinia
- **路由**：Vue Router 4
- **HTTP 客戶端**：Axios
- **圖標**：PrimeIcons

### 後端技術棧

- **後端專案**：[golang-event-api](https://github.com/brookhaven13/golang-event-api)
- **語言**：Go (Golang)
- **框架**：參考後端專案文檔
- **資料庫**：參考後端專案設定
- **認證**：JWT Token

### 開發工具

- **測試框架**：Vitest + Playwright
- **代碼檢查**：ESLint + Prettier
- **類型檢查**：vue-tsc
- **包管理**：npm

## 📸 功能截圖

### 🏠 主頁面

- 響應式導航欄
- 事件列表概覽
- 快速搜尋功能

### 🔐 認證頁面

- 現代化登入界面
- 美觀的註冊表單
- 表單驗證提示

### 📋 事件管理

- 事件列表分頁顯示
- 詳細的事件卡片
- 創建/編輯事件表單

### 📊 個人儀表板

- 統計數據可視化
- 我的事件管理
- 參與歷史記錄

## 🚀 開發指南

### 🔧 開發環境設置

**推薦 IDE 配置**

- [VS Code](https://code.visualstudio.com/)
- 安裝擴展：[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

**推薦瀏覽器工具**

- Chrome: [Vue.js DevTools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox: [Vue.js DevTools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### 📦 安裝與運行

```bash
# 克隆項目
git clone <repository-url>
cd event-app

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

### 🧪 測試

```bash
# 運行單元測試
npm run test:unit

# 安裝 E2E 測試瀏覽器（首次運行）
npx playwright install

# 運行 E2E 測試
npm run test:e2e

# 運行特定瀏覽器測試
npm run test:e2e -- --project=chromium

# 調試模式運行測試
npm run test:e2e -- --debug
```

### 🔍 代碼品質

```bash
# ESLint 檢查
npm run lint

# 類型檢查
npm run type-check

# 代碼格式化
npm run format
```

## 📦 部署指南

### 🚀 快速部署

```bash
# 構建項目
npm run build

# 使用部署腳本
./quick-deploy.sh
```

詳細部署說明請參考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 貢獻指南

### 🔀 開發流程

1. **Fork 項目** 到您的 GitHub 帳戶
2. **創建功能分支** `git checkout -b feature/amazing-feature`
3. **提交更改** `git commit -m 'Add some amazing feature'`
4. **推送分支** `git push origin feature/amazing-feature`
5. **提交 Pull Request**

### 📝 代碼規範

- 使用 TypeScript 進行類型安全開發
- 遵循 Vue 3 Composition API 最佳實踐
- 使用 ESLint + Prettier 保持代碼一致性
- 組件命名採用 PascalCase
- 文件命名採用 kebab-case

### 🧪 測試要求

- 新功能需要包含單元測試
- 確保所有測試通過
- E2E 測試覆蓋主要用戶流程

## 📋 API 文檔

### 🔗 後端專案

本前端應用對接 Go 語言開發的 RESTful API 後端：

**後端專案連結**：[golang-event-api](https://github.com/brookhaven13/golang-event-api)

**快速開始後端**：

```bash
# 克隆後端專案
git clone https://github.com/brookhaven13/golang-event-api.git
cd golang-event-api

# 啟動後端服務（預設 localhost:8080）
# 詳細啟動方式請參考後端專案的 README
```

### 🛠️ API 端點說明

後端 API 主要端點包括（基礎 URL: `http://localhost:8080/api/v1`）：

#### 🔐 認證 API

- `POST /auth/register` - 用戶註冊
- `POST /auth/login` - 用戶登入
- `POST /auth/logout` - 用戶登出
- `GET /auth/profile` - 獲取用戶資料

#### 🎯 事件 API

- `GET /events` - 獲取事件列表
- `POST /events` - 創建新事件
- `GET /events/:id` - 獲取事件詳情
- `PUT /events/:id` - 更新事件
- `DELETE /events/:id` - 刪除事件
- `POST /events/:id/join` - 參與事件
- `DELETE /events/:id/leave` - 取消參與

**注意**：完整的 API 文檔和使用說明請參考 [golang-event-api](https://github.com/brookhaven13/golang-event-api) 專案。

## 🐛 問題報告

如果您發現 bug 或有功能建議，請：

1. 查看 [Issues](../../issues) 確認問題未被報告
2. 創建新的 Issue 並提供：
   - 詳細的問題描述
   - 重現步驟
   - 預期行為
   - 實際行為
   - 環境資訊（瀏覽器、操作系統等）

## 📄 許可證

本項目採用 MIT 許可證 - 查看 [LICENSE](LICENSE) 文件了解詳情

## 🙏 致謝

- [Vue.js](https://vuejs.org/) - 漸進式 JavaScript 框架
- [PrimeVue](https://primevue.org/) - 豐富的 Vue UI 組件庫
- [Tailwind CSS](https://tailwindcss.com/) - 實用優先的 CSS 框架
- [Vite](https://vitejs.dev/) - 下一代前端構建工具

---

⭐ 如果這個項目對您有幫助，請給我們一個星星！
