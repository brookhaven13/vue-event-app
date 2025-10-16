# Vue Event App 部署指南

## 📦 已建置完成

您的 Vue 應用程式已成功建置，所有靜態檔案都在 `dist/` 目錄中。

## 🚀 部署選項

### 選項 1: 使用部署腳本 (推薦)

**首先設定部署配置：**

```bash
# 複製範本檔案
cp .env.deploy.example .env.deploy

# 編輯配置檔案，填入您的 VPS 資訊
nano .env.deploy
```

**然後執行部署：**

```bash
# 使用配置檔案部署
./deploy.sh

# 或直接使用參數
./deploy.sh [您的VPS IP] [SSH用戶名]
```

### 選項 2: 手動部署

1. **上傳檔案到 VPS:**

```bash
# 使用 scp 上傳
scp -r dist/* root@107.172.190.223:/var/www/event-app/frontend/

# 或使用 rsync
rsync -avz dist/ root@107.172.190.223:/var/www/event-app/frontend/
```

2. **設定 Nginx:**

```bash
# 在 VPS 上創建 Nginx 配置
sudo nano /etc/nginx/sites-available/event-app
```

複製以下配置：

```nginx
server {
    listen 80;
    server_name 107.172.190.223;
    root /var/www/event-app/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **啟用網站:**

```bash
sudo ln -s /etc/nginx/sites-available/event-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 選項 3: Docker 部署

```bash
# 建置 Docker 映像
docker build -t event-app .

# 運行容器
docker run -d -p 80:80 --name event-app event-app

# 或使用 docker-compose
docker-compose up -d
```

## 🔧 環境配置

確保您的 VPS 有以下環境：

- Nginx
- 正確的防火牆設定 (開放 80/443 埠)

## 🌐 訪問應用程式

部署完成後，您可以在以下網址訪問應用程式：

- http://107.172.190.223

## 📋 檔案結構

```
dist/
├── index.html          # 主頁面
├── favicon.ico         # 網站圖標
└── assets/            # 靜態資源
    ├── *.css          # 樣式表
    └── *.js           # JavaScript 檔案
```

## 🔒 SSL 憑證 (可選)

使用 Let's Encrypt 設定 HTTPS：

```bash
# 安裝 certbot
sudo apt install certbot python3-certbot-nginx

# 取得憑證
sudo certbot --nginx -d 107.172.190.223

# 自動更新
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚨 故障排除

1. **404 錯誤**: 確保 Nginx 配置包含 `try_files $uri $uri/ /index.html;`
2. **API 連接失敗**: 檢查 `.env` 檔案中的 API URL 設定
3. **樣式未載入**: 確保 `assets/` 目錄權限正確

## 📞 支援

如果遇到問題，請檢查：

- Nginx 錯誤日誌: `/var/log/nginx/error.log`
- 應用程式控制台錯誤
- 網路連接和防火牆設定
