# Sử dụng Node.js làm base image
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng cho ứng dụng (ví dụ: cổng 3000)
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]
