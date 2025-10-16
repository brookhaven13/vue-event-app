# 使用官方 Node.js 映像作為建置階段
FROM node:20-alpine AS build-stage

# 設定工作目錄
WORKDIR /app

# 複製 package*.json 檔案
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製原始碼
COPY . .

# 建置應用程式
RUN npm run build

# 使用 Nginx 作為生產階段
FROM nginx:alpine AS production-stage

# 複製自定義 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 複製建置後的檔案到 Nginx 目錄
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露 80 埠
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]