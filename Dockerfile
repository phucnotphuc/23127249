# Sử dụng Node.js bản nhẹ (Alpine)
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy file package.json vào trước để cài thư viện
COPY package.json .

# Cài đặt thư viện (Express)
RUN npm install

# Copy toàn bộ code (server.js) vào
COPY . .

# Mở cổng 80
EXPOSE 80

# Chạy ứng dụng
CMD ["node", "server.js"]