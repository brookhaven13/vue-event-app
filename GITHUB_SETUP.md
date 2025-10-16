# 🐙 GitHub Repository 設定指南

## 📋 準備工作

在建立 GitHub repository 之前，請確保已完成以下安全設定：

### 🔒 保護敏感資訊

1. **檢查 .gitignore 檔案**
   - 已自動排除 `.env.deploy`（包含 VPS IP）
   - 已排除環境變數檔案
   - 已排除建置檔案和臨時檔案

2. **設定部署配置**

   ```bash
   # 複製範本檔案
   cp .env.deploy.example .env.deploy

   # 編輯您的實際 VPS 資訊
   nano .env.deploy
   ```

## 🚀 建立 GitHub Repository

### 方法 1: 使用 GitHub CLI (推薦)

```bash
# 安裝 GitHub CLI (如果尚未安裝)
brew install gh

# 登入 GitHub
gh auth login

# 建立 repository 並推送
gh repo create event-management-app --public --push --source=.
```

### 方法 2: 使用 GitHub 網頁介面

1. **在 GitHub 上建立新 repository**
   - 前往 https://github.com/new
   - Repository name: `event-management-app`
   - 描述: `Modern event management frontend built with Vue 3 + TypeScript`
   - 選擇 Public 或 Private
   - **不要**初始化 README、.gitignore 或 license

2. **連接本地 repository**

   ```bash
   # 添加遠端 repository
   git remote add origin https://github.com/YOUR_USERNAME/event-management-app.git

   # 推送到 GitHub
   git add .
   git commit -m "Initial commit: Vue 3 event management app"
   git push -u origin master
   ```

## 📝 提交前檢查清單

在推送到 GitHub 之前，請確認：

- [ ] `.env.deploy` 檔案已被 .gitignore 排除
- [ ] `.env` 和 `.env.local` 檔案已被排除
- [ ] 沒有硬編碼的 IP 地址或密碼
- [ ] README.md 已更新且不包含敏感資訊

## 🔧 測試部署腳本

```bash
# 測試快速部署（會檢查配置檔案）
./quick-deploy.sh

# 測試完整部署
./deploy.sh
```

## 🌟 推薦的 GitHub Actions (可選)

建立 `.github/workflows/deploy.yml` 來自動部署：

```yaml
name: Deploy to VPS

on:
  push:
    branches: [master, main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to VPS
        run: |
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > private_key
          chmod 600 private_key
          rsync -avz --delete -e "ssh -i private_key -o StrictHostKeyChecking=no" dist/ ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }}:${{ secrets.REMOTE_PATH }}/
```

**需要在 GitHub Secrets 中設定：**

- `SSH_PRIVATE_KEY`: 您的 SSH 私鑰
- `VPS_HOST`: VPS IP 地址
- `VPS_USER`: SSH 用戶名
- `REMOTE_PATH`: 遠端路徑

## 🛡️ 安全提醒

- 絕不將 `.env.deploy` 檔案提交到 GitHub
- 使用 SSH 金鑰而非密碼進行 VPS 連接
- 定期更新依賴套件
- 考慮使用私有 repository 來儲存部署腳本
