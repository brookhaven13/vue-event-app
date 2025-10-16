#!/bin/bash

# Vue 應用程式部署腳本
# 使用方法: ./deploy.sh [您的VPS IP或域名] [SSH用戶名]

set -e  # 如果任何命令失敗就退出

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 從環境變數或參數讀取配置
VPS_HOST=${1:-${VPS_HOST:-"your-vps-ip"}}
SSH_USER=${2:-${SSH_USER:-"root"}}
REMOTE_PATH=${REMOTE_PATH:-"/var/www/event-app/frontend"}
LOCAL_DIST_PATH="./dist"

# 檢查是否設定了 VPS IP
if [ "$VPS_HOST" = "your-vps-ip" ]; then
    echo -e "${RED}❌ 請設定 VPS IP！${NC}"
    echo -e "${YELLOW}方法 1: 使用參數 ./deploy.sh [VPS_IP] [SSH_USER]${NC}"
    echo -e "${YELLOW}方法 2: 設定環境變數 export VPS_HOST=your_ip${NC}"
    echo -e "${YELLOW}方法 3: 創建 .env.deploy 檔案${NC}"
    exit 1
fi

# 載入 .env.deploy 檔案（如果存在）
if [ -f ".env.deploy" ]; then
    source .env.deploy
    VPS_HOST=${VPS_HOST:-${1:-"your-vps-ip"}}
    SSH_USER=${SSH_USER:-${2:-"root"}}
fi

echo -e "${BLUE}🚀 開始部署 Vue 事件管理應用程式...${NC}"

# 檢查 dist 目錄是否存在
if [ ! -d "$LOCAL_DIST_PATH" ]; then
    echo -e "${RED}❌ dist 目錄不存在，請先執行 npm run build${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 正在建置最新版本...${NC}"
npm run build

echo -e "${YELLOW}📡 正在連接到 VPS: ${VPS_HOST}...${NC}"

# 創建遠端目錄
ssh ${SSH_USER}@${VPS_HOST} "mkdir -p ${REMOTE_PATH}"

echo -e "${YELLOW}📤 正在上傳檔案到 VPS...${NC}"

# 上傳 dist 目錄的所有內容
rsync -avz --delete ${LOCAL_DIST_PATH}/ ${SSH_USER}@${VPS_HOST}:${REMOTE_PATH}/

echo -e "${YELLOW}⚙️  正在設定 Nginx 配置...${NC}"

# 創建 Nginx 配置檔案
ssh ${SSH_USER}@${VPS_HOST} "cat > /etc/nginx/sites-available/event-app << 'EOF'
server {
    listen 80;
    server_name 107.172.190.223;
    root /var/www/event-app/frontend;
    index index.html;

    # 支援 Vue Router 的 history mode
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 靜態資源緩存
    location /assets/ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # 安全性標頭
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;

    # Gzip 壓縮
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF"

# 啟用網站
ssh ${SSH_USER}@${VPS_HOST} "ln -sf /etc/nginx/sites-available/event-app /etc/nginx/sites-enabled/"

# 測試 Nginx 配置
ssh ${SSH_USER}@${VPS_HOST} "nginx -t"

# 重新載入 Nginx
ssh ${SSH_USER}@${VPS_HOST} "systemctl reload nginx"

echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}🌐 您的應用程式現在可以在以下網址訪問：${NC}"
echo -e "${GREEN}   http://107.172.190.223${NC}"
echo ""
echo -e "${BLUE}📋 後續步驟建議：${NC}"
echo -e "1. 設定 SSL 憑證 (Let's Encrypt)"
echo -e "2. 配置防火牆規則"
echo -e "3. 設定自動部署 (可選)"