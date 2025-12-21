# VolunteerHub

VolunteerHub là một nền tảng quản lý tình nguyện viên, được thiết kế để kết nối tình nguyện viên với các sự kiện cộng đồng một cách hiệu quả và thuận tiện.

## Mục lục

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cách tính năng chính ](#các-tính-năng-chính)
- [Cài đặt](#cài-đặt)
- [Cấu trúc dự án](#cấu-trúc-dự-án)

---

## Công nghệ sử dụng

### Backend
- **Java 17**, **Spring Boot 3.5.6**, Spring Security, Spring Data JPA
- **MySQL** (Database), **Redis** (Cache, Rate Limiting)
- JWT Authentication, MapStruct, Lombok
- Firebase Admin (Push Notifications), Thymeleaf (Email Templates)
- SpringDoc OpenAPI, Docker

### Frontend
- **React 19**, **Vite 7**, Material-UI
- React Router, Axios, Recharts
- Firebase (Push Notifications), TailwindCSS

---

## Các tính năng chính

### Quản lý người dùng
- Đăng ký và đăng nhập với JWT Authentication
- Xác thực email (Email Verification)
- Đặt lại mật khẩu (Password Reset)
- Quản lý hồ sơ cá nhân
- Phân quyền theo role: User, Manager, Admin
- Theo dõi (follow) người dùng

### Quản lý sự kiện
- Tìm kiếm và lọc sự kiện theo nhiều tiêu chí (lastest, hotest, newest, v.v)
- Đăng ký và hủy đăng ký tham gia sự kiện
- Quản lý trạng thái sự kiện, chỉnh sửa thông tin sự kiện
- Duyệt và quản lý người tham gia sự kiện 
- Like/Unlike sự kiện

### Bài viết và tương tác
- Đăng bài viết
- Bình luận
- Like bài viết
- Upload media (ảnh, video)

### Thông báo
- Hệ thống thông báo trong ứng dụng
- Push Notifications qua Firebase Cloud Messaging
- Thông báo phân loại theo vai trò (Admin, Manager, User)

### Dashboard và thống kê
- Dashboard Admin với thống kê tổng quan toàn bộ hệ thống 
- Dashboard Manager cho quản lý sự kiện mà Event manager quản lý
- Biểu đồ trực quan 
- Bảng xếp hạng sự kiện và người dùng
- Xuất dữ liệu thống kê 

### Bảo mật
- JWT Token Authentication
- Rate Limiting để chống spam và tấn công
- Phân quyền chi tiết theo role
- Validation input đầu vào

## Cài đặt

### Yêu cầu hệ thống
- Docker / Docker Desktop
### Cấu hình file .env tại thư mục gốc
```
# MySQL Configuration
MYSQL_ROOT_PASSWORD=
MYSQL_USER=
MYSQL_PASSWORD=

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=

# Frontend URLs
PASSWORD_RESET_FRONTEND_URL=http://localhost:5173/reset-password
EMAIL_VERIFICATION_FRONTEND_URL=http://localhost:5173/verify-email
```

### Hướng dẫn cài đặt sử dụng Docker
**Yêu cầu:** Máy tính đã cài đặt Docker


1. Mở terminal tại thư mục gốc của dự án (chứa thư mục `frontend/`, `backend/` và file <br> `docker-compose.yml` )
2. Chạy lệnh khởi động:


    ```bash
    docker compose up --build
    ```
3. Truy cập:
    - **Frontend:** `http://localhost:5173`
    - **Backend:** `http://localhost:8080`


Hiện tại trong database đã cài đặt có người dùng như `user1`, `manager1` và `admin1` với quyền truy cập giống username, mật khẩu là `password123`.




### Hướng dẫn cài đặt thủ công
#### Cài đặt cơ sở dữ liệu:
1. Chạy các lệnh sau để tạo database và user:
```
-- 1. Tạo Database
CREATE DATABASE IF NOT EXISTS volunteer_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 2. Tạo User
CREATE USER IF NOT EXISTS 'volunteer'@'localhost' IDENTIFIED BY 'volunteerpass';
GRANT ALL PRIVILEGES ON volunteer_hub.* TO 'volunteer'@'localhost';
FLUSH PRIVILEGES;
```


2. Import dữ liệu: Ở thư mục gốc của dự án, chạy các lệnh sau:
```
mysql -u <YOUR_ADMIN_USER> -p volunteer_hub < backend/src/main/resources/schema.sql
mysql -u <YOUR_ADMIN_USER> -p volunteer_hub < backend/src/main/resources/seed.sql
```


3. Cấu hình backend: Sửa file `backend/src/main/resources/application.properties` và cập nhật cấu hình database phù hợp để khớp với user vừa tạo ở trên:
```
# Sửa thành user 'volunteer' vừa tạo (hoặc user khác tùy người dùng)
spring.datasource.username=${DB_USERNAME:volunteer}
spring.datasource.password=${DB_PASSWORD:volunteerpass}
```


4. Ngoài ra cần đảm bảo Redis Server đang chạy
#### Backend
Mở terminal tại thư mục backend, chạy các lệnh sau:
```
chmod +x mvnw
./mvnw spring-boot:run
```
Sau khi chạy thành công, Backend sẽ hoạt động tại `http://localhost:8080`.


### Frontend
Mở terminal tại thư mục frontend, chạy các lệnh sau:


```bash
npm install
npm run build
npm run preview -- --port 5173
```
Frontend sẽ hoạt động tại `http://localhost:5173`.
Hiện tại trong database đã cài đặt có người dùng như `user1`, `manager1` và `admin1` với quyền truy cập giống username, mật khẩu là `password123`.

### API Documentation

Sau khi khởi động backend, truy cập Swagger UI tại:
```
http://localhost:8080/swagger-ui.html
```

---

## Cấu trúc dự án

```
VolunteerHub/
├── backend/
│   ├── src/main/java/com/uet/VolunteerHub/
│   │   ├── controller/       # REST Controllers
│   │   ├── service/          # Business Logic
│   │   ├── repository/       # Data Access Layer
│   │   ├── entity/           # JPA Entities
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── security/         # Security Configuration
│   │   ├── ratelimit/        # Rate Limiting
│   │   ├── events/           # Event-driven components
│   │   ├── exception/        # Exception Handling
│   │   └── configuration/    # App Configuration
│   ├── docker-compose.yml
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/              # API calls
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   └── utils/            # Utility functions
│   └── package.json
└── README.md
```

---

## Thành viên nhóm

Lớp học phần: Phát triển ứng dụng Web - INT3306_2

| Tên             | MSSV | Vai trò      |
|-----------------|--------------|--------------|
| Nguyễn Anh Sơn  | 23021684     | Backend Dev  |
| Nguyễn Văn Phúc | 23021664     | Backend Dev  |
| Thái Khắc Mạnh  | 23021620     | Frontend Dev |


