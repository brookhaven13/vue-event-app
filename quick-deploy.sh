#!/bin/bash

# 載入部署配置
if [ -f ".env.deploy" ]; then
    source .env.deploy
else
    echo "❌ 請創建 .env.deploy 檔案或設定環境變數"
    echo "範例: echo 'VPS_HOST=your-ip' > .env.deploy"
    exit 1
fi

# 檢查必要變數
if [ -z "$VPS_HOST" ]; then
    echo "❌ 請在 .env.deploy 中設定 VPS_HOST"
    exit 1
fi

VPS_USER=${VPS_USER:-"root"}
REMOTE_PATH=${REMOTE_PATH:-"/var/www/event-app/frontend"}

echo "🚀 開始部署到 $VPS_HOST..."

# 確保有最新的建置
npm run build

# 使用 rsync 部署
rsync -avz --delete dist/ ${VPS_USER}@${VPS_HOST}:${REMOTE_PATH}/

echo "✅ 部署完成！"
echo "🌐 訪問: http://$VPS_HOST"