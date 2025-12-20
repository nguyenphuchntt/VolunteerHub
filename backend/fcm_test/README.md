# FCM Test App - VolunteerHub

Ứng dụng web đơn giản để test Firebase Cloud Messaging với backend VolunteerHub.

## Cách chạy

**Yêu cầu:** Backend phải đang chạy ở `http://localhost:8080`

### Cách 1: Dùng VS Code Live Server (khuyên dùng)
1. Cài extension "Live Server" trong VS Code
2. Click chuột phải vào `index.html` → "Open with Live Server"
3. Truy cập: `http://127.0.0.1:5500/fcm_test/index.html`

### Cách 2: Dùng Python
```bash
cd c:\Users\Admin\Documents\VolunteerHub\backend
python -m http.server 5500
```
Truy cập: `http://localhost:5500/fcm_test/index.html`

### Cách 3: Dùng Node.js
```bash
npx serve -l 5500 c:\Users\Admin\Documents\VolunteerHub\backend
```
Truy cập: `http://localhost:5500/fcm_test/index.html`

## Các chức năng test

1. **Đăng nhập** - Lấy JWT token từ backend
2. **Subscribe FCM** - Xin quyền notification + lấy FCM token + gửi lên server
3. **Unsubscribe** - Hủy đăng ký token hiện tại
4. **Unsubscribe All** - Hủy tất cả token của user
5. **Đăng ký Event** - Nhập Event ID để đăng ký tham gia
6. **Xin làm Manager** - Tạo request xin quyền manager
7. **Test gửi Notification** - Gửi notification cho chính mình

## Lưu ý CORS

Nếu gặp lỗi CORS, đảm bảo backend cho phép origin của test app.
Kiểm tra file `CorsConfig.java` có cho phép `http://localhost:5500` và `http://127.0.0.1:5500`.
