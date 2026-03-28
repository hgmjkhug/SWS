# Sử dụng Nginx Alpine để tối ưu dung lượng (chỉ khoảng 20MB)
FROM nginx:alpine

# Xóa các file mặc định của Nginx để tránh rác
RUN rm -rf /usr/share/nginx/html/*

# Copy toàn bộ thư mục hiện tại vào thư mục chạy web của Nginx
# Lệnh này sẽ copy cả index.html, các folder icons, modules, css...
COPY . /usr/share/nginx/html

# Expose cổng 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]