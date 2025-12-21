-- ============================================
-- SEED DATA FOR VOLUNTEERHUB
-- Password: password123
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. ACCOUNTS (20 users)
-- ============================================
INSERT INTO account (account_id, username, password, email, account_status, role, create_at) VALUES
-- ADMIN (3)
('a0000001-0000-0000-0000-000000000001', 'admin1', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'admin1@volunteerhub.com', 'ACTIVE', 'ADMIN', NOW() - INTERVAL 180 DAY),
('a0000001-0000-0000-0000-000000000002', 'admin2', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'admin2@volunteerhub.com', 'ACTIVE', 'ADMIN', NOW() - INTERVAL 170 DAY),
('a0000001-0000-0000-0000-000000000003', 'admin3', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'admin3@volunteerhub.com', 'INACTIVE', 'ADMIN', NOW() - INTERVAL 160 DAY),
-- MANAGER (6)
('b0000001-0000-0000-0000-000000000001', 'manager1', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'manager1@volunteerhub.com', 'ACTIVE', 'MANAGER', NOW() - INTERVAL 150 DAY),
('b0000001-0000-0000-0000-000000000002', 'manager2', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'manager2@volunteerhub.com', 'ACTIVE', 'MANAGER', NOW() - INTERVAL 140 DAY),
('b0000001-0000-0000-0000-000000000003', 'manager3', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'manager3@volunteerhub.com', 'ACTIVE', 'MANAGER', NOW() - INTERVAL 130 DAY),
('b0000001-0000-0000-0000-000000000004', 'manager4', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'manager4@volunteerhub.com', 'ACTIVE', 'MANAGER', NOW() - INTERVAL 120 DAY),
('b0000001-0000-0000-0000-000000000005', 'manager5', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'manager5@volunteerhub.com', 'ACTIVE', 'MANAGER', NOW() - INTERVAL 110 DAY),
('b0000001-0000-0000-0000-000000000006', 'manager6', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'manager6@volunteerhub.com', 'INACTIVE', 'MANAGER', NOW() - INTERVAL 100 DAY),
-- USER (11)
('c0000001-0000-0000-0000-000000000001', 'user1', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user1@volunteerhub.com', 'ACTIVE', 'USER', NOW() - INTERVAL 90 DAY),
('c0000001-0000-0000-0000-000000000002', 'user2', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user2@volunteerhub.com', 'ACTIVE', 'USER', NOW() - INTERVAL 85 DAY),
('c0000001-0000-0000-0000-000000000003', 'user3', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user3@volunteerhub.com', 'ACTIVE', 'USER', NOW() - INTERVAL 80 DAY),
('c0000001-0000-0000-0000-000000000004', 'user4', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user4@volunteerhub.com', 'ACTIVE', 'USER', NOW() - INTERVAL 75 DAY),
('c0000001-0000-0000-0000-000000000005', 'user5', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user5@volunteerhub.com', 'ACTIVE', 'USER', NOW() - INTERVAL 70 DAY),
('c0000001-0000-0000-0000-000000000006', 'user6', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user6@volunteerhub.com', 'ACTIVE', 'USER', NOW() - INTERVAL 65 DAY),
('c0000001-0000-0000-0000-000000000007', 'user7', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user7@volunteerhub.com', 'ACTIVE', 'USER', NOW() - INTERVAL 60 DAY),
('c0000001-0000-0000-0000-000000000008', 'user8', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user8@volunteerhub.com', 'ACTIVE', 'USER', NOW() - INTERVAL 55 DAY),
('c0000001-0000-0000-0000-000000000009', 'user9', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user9@volunteerhub.com', 'INACTIVE', 'USER', NOW() - INTERVAL 50 DAY),
('c0000001-0000-0000-0000-000000000010', 'user10', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user10@volunteerhub.com', 'INACTIVE', 'USER', NOW() - INTERVAL 45 DAY),
('c0000001-0000-0000-0000-000000000011', 'user11', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user11@volunteerhub.com', 'BANNED', 'USER', NOW() - INTERVAL 40 DAY);

-- ============================================
-- 2. USER_INFO
-- ============================================
INSERT INTO user_info (account_id, first_name, last_name, date_of_birth, country, city, address, organization) VALUES
('a0000001-0000-0000-0000-000000000001', 'Nguyễn', 'Văn Admin', '1985-01-15', 'Vietnam', 'Hà Nội', '123 Hoàn Kiếm', 'VolunteerHub'),
('a0000001-0000-0000-0000-000000000002', 'Trần', 'Thị Admin', '1987-03-20', 'Vietnam', 'HCM', '456 Quận 1', 'VolunteerHub'),
('a0000001-0000-0000-0000-000000000003', 'Lê', 'Văn Admin', '1990-05-10', 'Vietnam', 'Đà Nẵng', '789 Hải Châu', 'VolunteerHub'),
('b0000001-0000-0000-0000-000000000001', 'Phạm', 'Văn Quản', '1992-02-14', 'Vietnam', 'Hà Nội', '111 Cầu Giấy', 'Green Earth'),
('b0000001-0000-0000-0000-000000000002', 'Hoàng', 'Thị Mai', '1991-07-25', 'Vietnam', 'HCM', '222 Quận 7', 'Youth Action'),
('b0000001-0000-0000-0000-000000000003', 'Vũ', 'Văn Tùng', '1993-11-08', 'Vietnam', 'Hà Nội', '333 Đống Đa', 'Community Care'),
('b0000001-0000-0000-0000-000000000004', 'Đặng', 'Thị Lan', '1990-04-18', 'Vietnam', 'Đà Nẵng', '444 Sơn Trà', 'Red Cross'),
('b0000001-0000-0000-0000-000000000005', 'Bùi', 'Văn Hùng', '1989-06-22', 'Vietnam', 'Hải Phòng', '555 Lê Chân', 'Volunteer VN'),
('b0000001-0000-0000-0000-000000000006', 'Ngô', 'Thị Hương', '1994-09-30', 'Vietnam', 'Cần Thơ', '666 Ninh Kiều', 'Help Center'),
('c0000001-0000-0000-0000-000000000001', 'Đinh', 'Văn An', '1995-01-05', 'Vietnam', 'Hà Nội', '777 Ba Đình', 'UET'),
('c0000001-0000-0000-0000-000000000002', 'Lý', 'Thị Bình', '1996-03-12', 'Vietnam', 'HCM', '888 Quận 3', 'FPT'),
('c0000001-0000-0000-0000-000000000003', 'Trương', 'Văn Cường', '1997-05-20', 'Vietnam', 'Đà Nẵng', '999 Thanh Khê', 'ĐHBK'),
('c0000001-0000-0000-0000-000000000004', 'Cao', 'Thị Dung', '1998-07-28', 'Vietnam', 'Huế', '100 Phú Xuân', 'ĐHKH'),
('c0000001-0000-0000-0000-000000000005', 'Đỗ', 'Văn Em', '1999-09-15', 'Vietnam', 'Hà Nội', '200 Hai Bà Trưng', 'NEU'),
('c0000001-0000-0000-0000-000000000006', 'Hồ', 'Thị Phương', '2000-11-22', 'Vietnam', 'HCM', '300 Bình Thạnh', 'RMIT'),
('c0000001-0000-0000-0000-000000000007', 'Nguyễn', 'Văn Giang', '1994-02-08', 'Vietnam', 'Hải Phòng', '400 Ngô Quyền', 'HPU'),
('c0000001-0000-0000-0000-000000000008', 'Trần', 'Thị Hà', '1993-04-16', 'Vietnam', 'Nha Trang', '500 Vĩnh Hải', 'NTU'),
('c0000001-0000-0000-0000-000000000009', 'Lê', 'Văn Khoa', '1992-06-24', 'Vietnam', 'Cần Thơ', '600 Cái Răng', 'CTU'),
('c0000001-0000-0000-0000-000000000010', 'Phạm', 'Thị Linh', '1991-08-02', 'Vietnam', 'Đà Lạt', '700 Phường 1', 'DLU'),
('c0000001-0000-0000-0000-000000000011', 'Hoàng', 'Văn Minh', '1990-10-10', 'Vietnam', 'Vinh', '800 Cửa Nam', 'VU');

-- ============================================
-- 3. EVENTS (15 events - attendee_count=0, like_count=0 initially)
-- ============================================
INSERT INTO event (event_id, title, description, category, location, status, create_at, start_at, end_at, attendee_count, like_count, created_by_account_id) VALUES
-- PENDING (3)
(1, 'Dọn rác bãi biển Mỹ Khê', 'Hoạt động dọn vệ sinh và bảo vệ môi trường biển', 'ENVIRONMENT', 'Bãi biển Mỹ Khê, Đà Nẵng', 'PENDING', NOW() - INTERVAL 5 DAY, NOW() + INTERVAL 30 DAY, NOW() + INTERVAL 30 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000001'),
(2, 'Trồng cây xanh Sóc Sơn', 'Trồng 500 cây xanh tại khu vực đồi trọc', 'ENVIRONMENT', 'Sóc Sơn, Hà Nội', 'PENDING', NOW() - INTERVAL 3 DAY, NOW() + INTERVAL 45 DAY, NOW() + INTERVAL 45 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000002'),
(3, 'Quyên góp sách cho trẻ em vùng cao', 'Thu gom và tặng sách vở cho học sinh vùng cao', 'EDUCATION', 'Sapa, Lào Cai', 'PENDING', NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 60 DAY, NOW() + INTERVAL 62 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000003'),
-- SCHEDULED (4)
(4, 'Hiến máu nhân đạo', 'Chương trình hiến máu tình nguyện tại BV Bạch Mai', 'HEALTHCARE', 'Bệnh viện Bạch Mai, Hà Nội', 'SCHEDULED', NOW() - INTERVAL 10 DAY, NOW() + INTERVAL 7 DAY, NOW() + INTERVAL 7 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000001'),
(5, 'Chạy bộ từ thiện 5K', 'Chạy bộ gây quỹ cho trẻ em mồ côi', 'CHARITY', 'Hồ Hoàn Kiếm, Hà Nội', 'SCHEDULED', NOW() - INTERVAL 15 DAY, NOW() + INTERVAL 14 DAY, NOW() + INTERVAL 14 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000002'),
(6, 'Dạy tiếng Anh miễn phí', 'Lớp học tiếng Anh cho trẻ em có hoàn cảnh khó khăn', 'EDUCATION', 'Nhà văn hóa Quận 7, HCM', 'SCHEDULED', NOW() - INTERVAL 20 DAY, NOW() + INTERVAL 21 DAY, NOW() + INTERVAL 90 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000003'),
(7, 'Phát cơm từ thiện', 'Phát cơm miễn phí cho người vô gia cư', 'CHARITY', 'Quận 1, HCM', 'SCHEDULED', NOW() - INTERVAL 8 DAY, NOW() + INTERVAL 3 DAY, NOW() + INTERVAL 3 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000004'),
(16, 'Phát khô gà', 'Phát khô gà miễn phí cho fan anh', 'CHARITY', 'Quận 3, HCM', 'SCHEDULED', NOW() - INTERVAL 8 DAY, NOW() + INTERVAL 3 DAY, NOW() + INTERVAL 3 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000004'),
-- STARTED (3)
(8, 'Thăm và tặng quà người già neo đơn', 'Thăm hỏi và tặng quà tại viện dưỡng lão', 'HEALTHCARE', 'Viện dưỡng lão Thiên Ân, Hà Nội', 'STARTED', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 5 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000001'),
(9, 'Dọn vệ sinh sông Tô Lịch', 'Hoạt động làm sạch dòng sông ô nhiễm', 'ENVIRONMENT', 'Sông Tô Lịch, Hà Nội', 'STARTED', NOW() - INTERVAL 25 DAY, NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 7 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000005'),
(10, 'Xây nhà tình thương', 'Xây dựng nhà cho hộ nghèo tại Quảng Bình', 'CHARITY', 'Quảng Bình', 'STARTED', NOW() - INTERVAL 35 DAY, NOW() - INTERVAL 5 DAY, NOW() + INTERVAL 10 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000002'),
(17, 'Xây trường', 'Xây dựng trường học cho học sinh miền núi', 'CHARITY', 'Cao Bằng', 'STARTED', NOW() - INTERVAL 35 DAY, NOW() - INTERVAL 5 DAY, NOW() + INTERVAL 10 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000002'),
-- FINISHED (3)
(11, 'Cứu trợ lũ lụt miền Trung', 'Phát quà cứu trợ cho bà con vùng lũ', 'CHARITY', 'Quảng Trị', 'FINISHED', NOW() - INTERVAL 60 DAY, NOW() - INTERVAL 50 DAY, NOW() - INTERVAL 45 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000003'),
(12, 'Khám bệnh miễn phí', 'Chương trình khám bệnh từ thiện cho người nghèo', 'HEALTHCARE', 'Bình Phước', 'FINISHED', NOW() - INTERVAL 45 DAY, NOW() - INTERVAL 35 DAY, NOW() - INTERVAL 33 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000004'),
(13, 'Trao học bổng cho sinh viên nghèo', 'Trao 50 suất học bổng cho SV có hoàn cảnh khó khăn', 'EDUCATION', 'ĐH Quốc Gia, HCM', 'FINISHED', NOW() - INTERVAL 40 DAY, NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000005'),
-- CANCELLED (2)
(14, 'Tình nguyện mùa hè xanh', 'Chương trình tình nguyện mùa hè (đã hủy do dịch)', 'COMMUNITY', 'Nghệ An', 'CANCELLED', NOW() - INTERVAL 50 DAY, NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 10 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000001'),
(15, 'Hội chợ từ thiện', 'Hội chợ gây quỹ (đã hủy do thời tiết)', 'CHARITY', 'Công viên Thống Nhất, Hà Nội', 'CANCELLED', NOW() - INTERVAL 55 DAY, NOW() - INTERVAL 25 DAY, NOW() - INTERVAL 24 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000002');

-- ============================================
-- 4. EVENT_USER (managers + attendees)
-- ============================================
-- Managers (creators) first
INSERT INTO event_user (account_id, event_id, registered_at, status, event_user_role) VALUES
('b0000001-0000-0000-0000-000000000001', 1, NOW() - INTERVAL 5 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000002', 2, NOW() - INTERVAL 3 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000003', 3, NOW() - INTERVAL 2 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000001', 4, NOW() - INTERVAL 10 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000002', 5, NOW() - INTERVAL 15 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000003', 6, NOW() - INTERVAL 20 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000004', 7, NOW() - INTERVAL 8 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000001', 8, NOW() - INTERVAL 30 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000005', 9, NOW() - INTERVAL 25 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000002', 10, NOW() - INTERVAL 35 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000003', 11, NOW() - INTERVAL 60 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000004', 12, NOW() - INTERVAL 45 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000005', 13, NOW() - INTERVAL 40 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000001', 14, NOW() - INTERVAL 50 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000002', 15, NOW() - INTERVAL 55 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000004', 16, NOW() - INTERVAL 55 DAY, 'APPROVED', 'MANAGER'),
('b0000001-0000-0000-0000-000000000002', 17, NOW() - INTERVAL 55 DAY, 'APPROVED', 'MANAGER');

-- Attendees for events (mixed statuses)
INSERT INTO event_user (account_id, event_id, registered_at, status, event_user_role) VALUES
-- Event 4 (SCHEDULED) - attendees
('c0000001-0000-0000-0000-000000000001', 4, NOW() - INTERVAL 8 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000002', 4, NOW() - INTERVAL 7 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000003', 4, NOW() - INTERVAL 6 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000004', 4, NOW() - INTERVAL 5 DAY, 'PENDING', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000005', 4, NOW() - INTERVAL 4 DAY, 'PENDING', 'ATTENDEE'),
-- Event 5 (SCHEDULED)
('c0000001-0000-0000-0000-000000000001', 5, NOW() - INTERVAL 10 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000006', 5, NOW() - INTERVAL 9 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000007', 5, NOW() - INTERVAL 8 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000008', 5, NOW() - INTERVAL 7 DAY, 'REJECTED', 'ATTENDEE'),
-- Event 6 (SCHEDULED)
('c0000001-0000-0000-0000-000000000002', 6, NOW() - INTERVAL 15 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000003', 6, NOW() - INTERVAL 14 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000004', 6, NOW() - INTERVAL 13 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000005', 6, NOW() - INTERVAL 12 DAY, 'APPROVED', 'ATTENDEE'),
-- Event 8 (STARTED)
('c0000001-0000-0000-0000-000000000001', 8, NOW() - INTERVAL 25 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000002', 8, NOW() - INTERVAL 24 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000003', 8, NOW() - INTERVAL 23 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000006', 8, NOW() - INTERVAL 22 DAY, 'PENDING', 'ATTENDEE'),
-- Event 9 (STARTED)
('c0000001-0000-0000-0000-000000000004', 9, NOW() - INTERVAL 20 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000005', 9, NOW() - INTERVAL 19 DAY, 'APPROVED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000007', 9, NOW() - INTERVAL 18 DAY, 'APPROVED', 'ATTENDEE'),
-- Event 11 (FINISHED)
('c0000001-0000-0000-0000-000000000001', 11, NOW() - INTERVAL 55 DAY, 'FINISHED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000002', 11, NOW() - INTERVAL 54 DAY, 'FINISHED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000003', 11, NOW() - INTERVAL 53 DAY, 'FINISHED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000004', 11, NOW() - INTERVAL 52 DAY, 'UNFINISHED', 'ATTENDEE'),
-- Event 12 (FINISHED)
('c0000001-0000-0000-0000-000000000005', 12, NOW() - INTERVAL 40 DAY, 'FINISHED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000006', 12, NOW() - INTERVAL 39 DAY, 'FINISHED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000007', 12, NOW() - INTERVAL 38 DAY, 'FINISHED', 'ATTENDEE'),
-- Event 13 (FINISHED)
('c0000001-0000-0000-0000-000000000008', 13, NOW() - INTERVAL 35 DAY, 'FINISHED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000001', 13, NOW() - INTERVAL 34 DAY, 'FINISHED', 'ATTENDEE'),
('c0000001-0000-0000-0000-000000000002', 13, NOW() - INTERVAL 33 DAY, 'FINISHED', 'ATTENDEE');

-- Update attendee_count for each event
UPDATE event SET attendee_count = (SELECT COUNT(*) FROM event_user WHERE event_user.event_id = event.event_id AND event_user.status IN ('APPROVED', 'FINISHED')) WHERE event_id > 0;

-- ============================================
-- 5. MEDIA (40 images from images/ directory)
-- ============================================
INSERT INTO media (id, url, file_path, file_type, mime_type, size_bytes, uploaded_at, uploaded_by) VALUES
('d0000001-0000-0000-0000-000000000001', 'http://localhost:8080/api/media/download/1.jpg', '1.jpg', 'jpg', 'image/jpeg', 176693, NOW() - INTERVAL 60 DAY, 'b0000001-0000-0000-0000-000000000001'),
('d0000001-0000-0000-0000-000000000002', 'http://localhost:8080/api/media/download/2.jpg', '2.jpg', 'jpg', 'image/jpeg', 577187, NOW() - INTERVAL 59 DAY, 'b0000001-0000-0000-0000-000000000002'),
('d0000001-0000-0000-0000-000000000003', 'http://localhost:8080/api/media/download/3.jpg', '3.jpg', 'jpg', 'image/jpeg', 215153, NOW() - INTERVAL 58 DAY, 'b0000001-0000-0000-0000-000000000003'),
('d0000001-0000-0000-0000-000000000004', 'http://localhost:8080/api/media/download/4.jpg', '4.jpg', 'jpg', 'image/jpeg', 111293, NOW() - INTERVAL 57 DAY, 'b0000001-0000-0000-0000-000000000004'),
('d0000001-0000-0000-0000-000000000005', 'http://localhost:8080/api/media/download/5.jpg', '5.jpg', 'jpg', 'image/jpeg', 152916, NOW() - INTERVAL 56 DAY, 'b0000001-0000-0000-0000-000000000005'),
('d0000001-0000-0000-0000-000000000006', 'http://localhost:8080/api/media/download/6.jpg', '6.jpg', 'jpg', 'image/jpeg', 572828, NOW() - INTERVAL 55 DAY, 'c0000001-0000-0000-0000-000000000001'),
('d0000001-0000-0000-0000-000000000007', 'http://localhost:8080/api/media/download/7.jpg', '7.jpg', 'jpg', 'image/jpeg', 408141, NOW() - INTERVAL 54 DAY, 'c0000001-0000-0000-0000-000000000002'),
('d0000001-0000-0000-0000-000000000008', 'http://localhost:8080/api/media/download/8.jpg', '8.jpg', 'jpg', 'image/jpeg', 154590, NOW() - INTERVAL 53 DAY, 'c0000001-0000-0000-0000-000000000003'),
('d0000001-0000-0000-0000-000000000009', 'http://localhost:8080/api/media/download/9.jpg', '9.jpg', 'jpg', 'image/jpeg', 462047, NOW() - INTERVAL 52 DAY, 'c0000001-0000-0000-0000-000000000004'),
('d0000001-0000-0000-0000-000000000010', 'http://localhost:8080/api/media/download/10.jpg', '10.jpg', 'jpg', 'image/jpeg', 399675, NOW() - INTERVAL 51 DAY, 'c0000001-0000-0000-0000-000000000005'),
('d0000001-0000-0000-0000-000000000011', 'http://localhost:8080/api/media/download/11.jpg', '11.jpg', 'jpg', 'image/jpeg', 239771, NOW() - INTERVAL 50 DAY, 'b0000001-0000-0000-0000-000000000001'),
('d0000001-0000-0000-0000-000000000012', 'http://localhost:8080/api/media/download/12.jpg', '12.jpg', 'jpg', 'image/jpeg', 38589, NOW() - INTERVAL 49 DAY, 'b0000001-0000-0000-0000-000000000002'),
('d0000001-0000-0000-0000-000000000013', 'http://localhost:8080/api/media/download/13.jpg', '13.jpg', 'jpg', 'image/jpeg', 146859, NOW() - INTERVAL 48 DAY, 'b0000001-0000-0000-0000-000000000003'),
('d0000001-0000-0000-0000-000000000014', 'http://localhost:8080/api/media/download/14.jpg', '14.jpg', 'jpg', 'image/jpeg', 4383001, NOW() - INTERVAL 47 DAY, 'b0000001-0000-0000-0000-000000000004'),
('d0000001-0000-0000-0000-000000000015', 'http://localhost:8080/api/media/download/15.jpg', '15.jpg', 'jpg', 'image/jpeg', 593876, NOW() - INTERVAL 46 DAY, 'b0000001-0000-0000-0000-000000000005'),
('d0000001-0000-0000-0000-000000000016', 'http://localhost:8080/api/media/download/16.jpg', '16.jpg', 'jpg', 'image/jpeg', 147620, NOW() - INTERVAL 45 DAY, 'c0000001-0000-0000-0000-000000000006'),
('d0000001-0000-0000-0000-000000000017', 'http://localhost:8080/api/media/download/17.jpg', '17.jpg', 'jpg', 'image/jpeg', 216931, NOW() - INTERVAL 44 DAY, 'c0000001-0000-0000-0000-000000000007'),
('d0000001-0000-0000-0000-000000000018', 'http://localhost:8080/api/media/download/18.jpg', '18.jpg', 'jpg', 'image/jpeg', 1352633, NOW() - INTERVAL 43 DAY, 'c0000001-0000-0000-0000-000000000008'),
('d0000001-0000-0000-0000-000000000019', 'http://localhost:8080/api/media/download/19.jpg', '19.jpg', 'jpg', 'image/jpeg', 198465, NOW() - INTERVAL 42 DAY, 'b0000001-0000-0000-0000-000000000001'),
('d0000001-0000-0000-0000-000000000020', 'http://localhost:8080/api/media/download/20.jpg', '20.jpg', 'jpg', 'image/jpeg', 316216, NOW() - INTERVAL 41 DAY, 'b0000001-0000-0000-0000-000000000002'),
('d0000001-0000-0000-0000-000000000021', 'http://localhost:8080/api/media/download/21.jpg', '21.jpg', 'jpg', 'image/jpeg', 80602, NOW() - INTERVAL 40 DAY, 'b0000001-0000-0000-0000-000000000003'),
('d0000001-0000-0000-0000-000000000022', 'http://localhost:8080/api/media/download/22.jpg', '22.jpg', 'jpg', 'image/jpeg', 168657, NOW() - INTERVAL 39 DAY, 'b0000001-0000-0000-0000-000000000004'),
('d0000001-0000-0000-0000-000000000023', 'http://localhost:8080/api/media/download/23.jpg', '23.jpg', 'jpg', 'image/jpeg', 261287, NOW() - INTERVAL 38 DAY, 'b0000001-0000-0000-0000-000000000005'),
('d0000001-0000-0000-0000-000000000024', 'http://localhost:8080/api/media/download/24.jpg', '24.jpg', 'jpg', 'image/jpeg', 208270, NOW() - INTERVAL 37 DAY, 'c0000001-0000-0000-0000-000000000001'),
('d0000001-0000-0000-0000-000000000025', 'http://localhost:8080/api/media/download/25.jpg', '25.jpg', 'jpg', 'image/jpeg', 421599, NOW() - INTERVAL 36 DAY, 'c0000001-0000-0000-0000-000000000002'),
('d0000001-0000-0000-0000-000000000026', 'http://localhost:8080/api/media/download/26.jpg', '26.jpg', 'jpg', 'image/jpeg', 154459, NOW() - INTERVAL 35 DAY, 'c0000001-0000-0000-0000-000000000003'),
('d0000001-0000-0000-0000-000000000027', 'http://localhost:8080/api/media/download/27.jpg', '27.jpg', 'jpg', 'image/jpeg', 288696, NOW() - INTERVAL 34 DAY, 'c0000001-0000-0000-0000-000000000004'),
('d0000001-0000-0000-0000-000000000028', 'http://localhost:8080/api/media/download/28.jpg', '28.jpg', 'jpg', 'image/jpeg', 42086, NOW() - INTERVAL 33 DAY, 'c0000001-0000-0000-0000-000000000005'),
('d0000001-0000-0000-0000-000000000029', 'http://localhost:8080/api/media/download/29.jpg', '29.jpg', 'jpg', 'image/jpeg', 132359, NOW() - INTERVAL 32 DAY, 'c0000001-0000-0000-0000-000000000006'),
('d0000001-0000-0000-0000-000000000030', 'http://localhost:8080/api/media/download/30.jpg', '30.jpg', 'jpg', 'image/jpeg', 607612, NOW() - INTERVAL 31 DAY, 'c0000001-0000-0000-0000-000000000007'),
('d0000001-0000-0000-0000-000000000031', 'http://localhost:8080/api/media/download/31.jpg', '31.jpg', 'jpg', 'image/jpeg', 378020, NOW() - INTERVAL 30 DAY, 'b0000001-0000-0000-0000-000000000001'),
('d0000001-0000-0000-0000-000000000032', 'http://localhost:8080/api/media/download/32.jpg', '32.jpg', 'jpg', 'image/jpeg', 349229, NOW() - INTERVAL 29 DAY, 'b0000001-0000-0000-0000-000000000002'),
('d0000001-0000-0000-0000-000000000033', 'http://localhost:8080/api/media/download/33.jpg', '33.jpg', 'jpg', 'image/jpeg', 205067, NOW() - INTERVAL 28 DAY, 'b0000001-0000-0000-0000-000000000003'),
('d0000001-0000-0000-0000-000000000034', 'http://localhost:8080/api/media/download/34.jpg', '34.jpg', 'jpg', 'image/jpeg', 234635, NOW() - INTERVAL 27 DAY, 'b0000001-0000-0000-0000-000000000004'),
('d0000001-0000-0000-0000-000000000035', 'http://localhost:8080/api/media/download/35.jpg', '35.jpg', 'jpg', 'image/jpeg', 174052, NOW() - INTERVAL 26 DAY, 'b0000001-0000-0000-0000-000000000005'),
('d0000001-0000-0000-0000-000000000036', 'http://localhost:8080/api/media/download/36.jpg', '36.jpg', 'jpg', 'image/jpeg', 146044, NOW() - INTERVAL 25 DAY, 'c0000001-0000-0000-0000-000000000008'),
('d0000001-0000-0000-0000-000000000037', 'http://localhost:8080/api/media/download/37.jpg', '37.jpg', 'jpg', 'image/jpeg', 167600, NOW() - INTERVAL 24 DAY, 'c0000001-0000-0000-0000-000000000001'),
('d0000001-0000-0000-0000-000000000038', 'http://localhost:8080/api/media/download/38.jpg', '38.jpg', 'jpg', 'image/jpeg', 126748, NOW() - INTERVAL 23 DAY, 'c0000001-0000-0000-0000-000000000002'),
('d0000001-0000-0000-0000-000000000039', 'http://localhost:8080/api/media/download/39.jpg', '39.jpg', 'jpg', 'image/jpeg', 168494, NOW() - INTERVAL 22 DAY, 'c0000001-0000-0000-0000-000000000003'),
('d0000001-0000-0000-0000-000000000040', 'http://localhost:8080/api/media/download/40.jpg', '40.jpg', 'jpg', 'image/jpeg', 390555, NOW() - INTERVAL 21 DAY, 'c0000001-0000-0000-0000-000000000004');

-- ============================================
-- 6. ACCOUNT_MEDIA (avatars - 10 accounts)
-- ============================================
INSERT INTO account_media (account_id, media_id) VALUES
('b0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001'),
('b0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002'),
('b0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000003'),
('b0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000004'),
('b0000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000005'),
('c0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000006'),
('c0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000007'),
('c0000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000008'),
('c0000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000009'),
('c0000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000010');

-- ============================================
-- 7. EVENT_MEDIA (2-3 images per event)
-- ============================================
INSERT INTO event_media (event_id, media_id) VALUES
(1, 'd0000001-0000-0000-0000-000000000011'), (1, 'd0000001-0000-0000-0000-000000000012'),
(2, 'd0000001-0000-0000-0000-000000000013'), (2, 'd0000001-0000-0000-0000-000000000014'),
(3, 'd0000001-0000-0000-0000-000000000015'), (3, 'd0000001-0000-0000-0000-000000000016'),
(4, 'd0000001-0000-0000-0000-000000000017'), (4, 'd0000001-0000-0000-0000-000000000018'),
(5, 'd0000001-0000-0000-0000-000000000019'), (5, 'd0000001-0000-0000-0000-000000000020'),
(6, 'd0000001-0000-0000-0000-000000000021'), (6, 'd0000001-0000-0000-0000-000000000022'),
(7, 'd0000001-0000-0000-0000-000000000023'), (7, 'd0000001-0000-0000-0000-000000000024'),
(8, 'd0000001-0000-0000-0000-000000000025'), (8, 'd0000001-0000-0000-0000-000000000026'),
(9, 'd0000001-0000-0000-0000-000000000027'), (9, 'd0000001-0000-0000-0000-000000000028'),
(10, 'd0000001-0000-0000-0000-000000000029'), (10, 'd0000001-0000-0000-0000-000000000030'),
(11, 'd0000001-0000-0000-0000-000000000031'), (11, 'd0000001-0000-0000-0000-000000000032'),
(12, 'd0000001-0000-0000-0000-000000000033'), (12, 'd0000001-0000-0000-0000-000000000034'),
(13, 'd0000001-0000-0000-0000-000000000035'), (13, 'd0000001-0000-0000-0000-000000000036');

-- ============================================
-- 8. POSTS (30+ posts, multiple per event with images)
-- ============================================
INSERT INTO post (post_id, post_type, event_id, created_by_account_id, create_at, content, status) VALUES
-- Event 4: Hiến máu nhân đạo (4 posts)
(1, 'EVENT', 4, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 9 DAY, 'Chuẩn bị cho chương trình hiến máu! Mọi người nhớ ăn uống đầy đủ trước khi đến nhé.', 'CREATED'),
(2, 'ANNOUNCEMENT', 4, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 8 DAY, 'Thông báo: Địa điểm hiến máu đã được xác nhận tại Bệnh viện Bạch Mai, tầng 2!', 'CREATED'),
(3, 'DISCUSSION', 4, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 7 DAY, 'Lần đầu hiến máu, hồi hộp quá! Có tips gì cho người mới không ạ?', 'CREATED'),
(4, 'EVENT', 4, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 6 DAY, 'Đã đăng ký thành công! Ai đi cùng không ạ?', 'CREATED'),
-- Event 4: Thêm 15 posts để test scroll (posts 39-53)
(39, 'DISCUSSION', 4, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 5 DAY, 'Mình đã hiến máu 3 lần rồi! Cảm giác rất tuyệt vời khi giúp được người khác.', 'CREATED'),
(40, 'EVENT', 4, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 5 DAY, 'Nhóm sinh viên FPT sẽ đến tham gia đông đủ! Ai ở khu vực đó nhé!', 'CREATED'),
(41, 'ANNOUNCEMENT', 4, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 4 DAY, 'Cập nhật: Đã có 50 người đăng ký! Cảm ơn mọi người nhiều!', 'CREATED'),
(42, 'DISCUSSION', 4, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 4 DAY, 'Sau khi hiến máu có được nghỉ ngơi không ạ? Mình hơi lo lắng!', 'CREATED'),
(43, 'EVENT', 4, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 4 DAY, 'Mình sẽ mang theo nước và bánh để chia sẻ cho mọi người sau khi hiến máu!', 'CREATED'),
(44, 'DISCUSSION', 4, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 3 DAY, 'Hiến máu có đau không ạ? Mình sợ kim tiêm quá!', 'CREATED'),
(45, 'ANNOUNCEMENT', 4, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 3 DAY, 'Nhắc nhở: Mọi người uống đủ nước và ngủ đủ giấc trước ngày hiến máu nhé!', 'CREATED'),
(46, 'EVENT', 4, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 3 DAY, 'Team UET đây! Chúng mình sẽ đi 10 người. Ai muốn join không?', 'CREATED'),
(47, 'DISCUSSION', 4, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 2 DAY, 'Mình cân nặng 48kg có được hiến máu không ạ?', 'CREATED'),
(48, 'ANNOUNCEMENT', 4, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 2 DAY, 'Trả lời: Cân nặng tối thiểu để hiến máu là 45kg. Bạn hoàn toàn có thể tham gia!', 'CREATED'),
(49, 'EVENT', 4, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 2 DAY, 'Đã 80 người đăng ký! Sự kiện sẽ rất hoành tráng!', 'CREATED'),
(50, 'DISCUSSION', 4, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 1 DAY, 'Có ai biết sau hiến máu bao lâu thì có thể tập thể dục lại không?', 'CREATED'),
(51, 'ANNOUNCEMENT', 4, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 1 DAY, 'Thông tin: Sau hiến máu nên nghỉ ngơi 24h, sau đó có thể hoạt động bình thường!', 'CREATED'),
(52, 'EVENT', 4, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 1 DAY, 'Countdown! Chỉ còn 1 ngày nữa thôi! Ai chưa đăng ký thì nhanh tay nhé!', 'CREATED'),
(53, 'DISCUSSION', 4, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 12 HOUR, 'Đã đến 100 người đăng ký! Cảm ơn cộng đồng VolunteerHub!', 'CREATED'),
-- Event 5: Chạy bộ từ thiện 5K (4 posts)
(5, 'EVENT', 5, 'b0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 14 DAY, 'Chạy bộ 5K sắp diễn ra! Đăng ký ngay để cùng gây quỹ cho trẻ em mồ côi.', 'CREATED'),
(6, 'ANNOUNCEMENT', 5, 'b0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 13 DAY, 'Lịch chạy: 6h sáng Chủ nhật tuần sau. Tập trung tại cổng chính Hồ Hoàn Kiếm!', 'CREATED'),
(7, 'DISCUSSION', 5, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 12 DAY, 'Có ai muốn lập team chạy bộ không? Mình đang tìm đồng đội!', 'CREATED'),
(8, 'EVENT', 5, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 11 DAY, 'Đãtem đăng ký 5 người rồi! Háo hức quá!', 'CREATED'),
-- Event 6: Dạy tiếng Anh miễn phí (3 posts)
(9, 'EVENT', 6, 'b0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 19 DAY, 'Lớp học tiếng Anh miễn phí chính thức khai giảng! Chào mừng các em nhỏ!', 'CREATED'),
(10, 'DISCUSSION', 6, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 13 DAY, 'Có ai biết lịch học tiếng Anh tuần này không ạ?', 'CREATED'),
(11, 'ANNOUNCEMENT', 6, 'b0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 10 DAY, 'Thông báo: Lớp học nghỉ tuần này do lễ. Tuần sau học bình thường!', 'CREATED'),
-- Event 7: Phát cơm từ thiện (3 posts)
(12, 'EVENT', 7, 'b0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 7 DAY, 'Chuẩn bị nguyên liệu xong xuôi! Ngày mai sẽ nấu 200 suất cơm.', 'CREATED'),
(13, 'DISCUSSION', 7, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 6 DAY, 'Mọi người có thể đóng góp thêm rau củ không ạ?', 'CREATED'),
(14, 'ANNOUNCEMENT', 7, 'b0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 5 DAY, 'Địa điểm phát cơm: Công viên 23/9, từ 11h-13h!', 'CREATED'),
-- Event 8: Thăm viện dưỡng lão (4 posts)
(15, 'ANNOUNCEMENT', 8, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 28 DAY, 'Thông báo: Chương trình thăm viện dưỡng lão sẽ bắt đầu lúc 8h sáng!', 'CREATED'),
(16, 'EVENT', 8, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 27 DAY, 'Danh sách quà tặng đã chuẩn bị: bánh, sữa, khăn ấm cho các cụ.', 'CREATED'),
(17, 'DISCUSSION', 8, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 26 DAY, 'Các cụ thích được nghe hát lắm! Ai biết hát dân ca không?', 'CREATED'),
(18, 'EVENT', 8, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 25 DAY, 'Hôm nay thăm các cụ xong, cảm động quá! Các cụ vui lắm!', 'CREATED'),
-- Event 9: Dọn vệ sinh sông Tô Lịch (3 posts)
(19, 'EVENT', 9, 'b0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 24 DAY, 'Cập nhật tiến độ: Đã dọn được 500m bờ sông Tô Lịch!', 'CREATED'),
(20, 'DISCUSSION', 9, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 23 DAY, 'Hôm nay thu được 50kg rác thải! Mọi người cố gắng quá!', 'CREATED'),
(21, 'ANNOUNCEMENT', 9, 'b0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 22 DAY, 'Ngày mai tiếp tục dọn đoạn còn lại. Mang găng tay theo nhé!', 'CREATED'),
-- Event 10: Xây nhà tình thương (4 posts)
(22, 'EVENT', 10, 'b0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 30 DAY, 'Xây nhà tình thương - Ngôi nhà thứ 3 sắp hoàn thành!', 'CREATED'),
(23, 'DISCUSSION', 10, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 29 DAY, 'Công trình tiến độ tốt! Dự kiến hoàn thành trong 1 tuần nữa.', 'CREATED'),
(24, 'EVENT', 10, 'b0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 28 DAY, 'Gia đình nhận nhà rất xúc động! Cảm ơn tất cả mọi người!', 'CREATED'),
(25, 'ANNOUNCEMENT', 10, 'b0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 27 DAY, 'Thông báo: Lễ trao nhà sẽ diễn ra vào Chủ nhật tuần sau!', 'CREATED'),
-- Event 11: Cứu trợ lũ lụt miền Trung (3 posts)
(26, 'EVENT', 11, 'b0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 55 DAY, 'Đoàn cứu trợ đã đến vùng lũ! Bắt đầu phát quà cho bà con.', 'CREATED'),
(27, 'DISCUSSION', 11, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 48 DAY, 'Cảm ơn mọi người đã tham gia cứu trợ lũ lụt. Rất ý nghĩa!', 'CREATED'),
(28, 'ANNOUNCEMENT', 11, 'b0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 46 DAY, 'Tổng kết: Đã phát 500 phần quà cho bà con vùng lũ!', 'CREATED'),
-- Event 12: Khám bệnh miễn phí (3 posts)
(29, 'EVENT', 12, 'b0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 40 DAY, 'Chương trình khám bệnh miễn phí bắt đầu! Đã có 100 người đăng ký.', 'CREATED'),
(30, 'DISCUSSION', 12, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 38 DAY, 'Chương trình khám bệnh quá tuyệt vời! Cảm ơn các bác sĩ.', 'CREATED'),
(31, 'ANNOUNCEMENT', 12, 'b0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 35 DAY, 'Kết thúc chương trình: Đã khám cho 300 người dân!', 'CREATED'),
-- Event 13: Trao học bổng (3 posts)
(32, 'EVENT', 13, 'b0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 35 DAY, 'Hồ sơ xét học bổng đã được tiếp nhận. Đang trong quá trình duyệt!', 'CREATED'),
(33, 'ANNOUNCEMENT', 13, 'b0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 32 DAY, 'Danh sách sinh viên nhận học bổng đã được công bố!', 'CREATED'),
(34, 'DISCUSSION', 13, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 30 DAY, 'Cảm ơn chương trình! Em đã nhận được học bổng!', 'CREATED'),
-- General articles and ads (không thuộc event)
(35, 'ARTICLE', NULL, 'b0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 20 DAY, 'Tình nguyện viên - Những người mang lại nụ cười cho cộng đồng.', 'CREATED'),
(36, 'ARTICLE', NULL, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 18 DAY, '10 lý do bạn nên tham gia hoạt động tình nguyện ngay hôm nay!', 'CREATED'),
(37, 'ADVERTISEMENT', NULL, 'b0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 15 DAY, 'Tuyển tình nguyện viên cho các hoạt động từ thiện năm 2024!', 'HIDDEN'),
(38, 'ARTICLE', NULL, 'b0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 12 DAY, 'Câu chuyện cảm động của một tình nguyện viên trẻ.', 'CREATED');

-- ============================================
-- 9. POST_MEDIA (multiple images per post)
-- ============================================
INSERT INTO post_media (media_id, post_id) VALUES
-- Event 4 posts (posts 1-4)
('d0000001-0000-0000-0000-000000000011', 1),
('d0000001-0000-0000-0000-000000000012', 1),
('d0000001-0000-0000-0000-000000000037', 1),
('d0000001-0000-0000-0000-000000000013', 2),
('d0000001-0000-0000-0000-000000000014', 2),
('d0000001-0000-0000-0000-000000000015', 3),
('d0000001-0000-0000-0000-000000000016', 3),
('d0000001-0000-0000-0000-000000000017', 4),
('d0000001-0000-0000-0000-000000000018', 4),
-- Event 4: Additional posts (39-53) - 2 images each
('d0000001-0000-0000-0000-000000000019', 39),
('d0000001-0000-0000-0000-000000000020', 39),
('d0000001-0000-0000-0000-000000000021', 40),
('d0000001-0000-0000-0000-000000000022', 40),
('d0000001-0000-0000-0000-000000000023', 41),
('d0000001-0000-0000-0000-000000000024', 41),
('d0000001-0000-0000-0000-000000000025', 42),
('d0000001-0000-0000-0000-000000000026', 42),
('d0000001-0000-0000-0000-000000000027', 43),
('d0000001-0000-0000-0000-000000000028', 43),
('d0000001-0000-0000-0000-000000000029', 44),
('d0000001-0000-0000-0000-000000000030', 44),
('d0000001-0000-0000-0000-000000000031', 45),
('d0000001-0000-0000-0000-000000000032', 45),
('d0000001-0000-0000-0000-000000000033', 46),
('d0000001-0000-0000-0000-000000000034', 46),
('d0000001-0000-0000-0000-000000000035', 47),
('d0000001-0000-0000-0000-000000000036', 47),
('d0000001-0000-0000-0000-000000000037', 48),
('d0000001-0000-0000-0000-000000000038', 48),
('d0000001-0000-0000-0000-000000000039', 49),
('d0000001-0000-0000-0000-000000000040', 49),
('d0000001-0000-0000-0000-000000000011', 50),
('d0000001-0000-0000-0000-000000000012', 50),
('d0000001-0000-0000-0000-000000000013', 51),
('d0000001-0000-0000-0000-000000000014', 51),
('d0000001-0000-0000-0000-000000000015', 52),
('d0000001-0000-0000-0000-000000000016', 52),
('d0000001-0000-0000-0000-000000000017', 53),
('d0000001-0000-0000-0000-000000000018', 53),
-- Event 5 posts (posts 5-8)
('d0000001-0000-0000-0000-000000000019', 5),
('d0000001-0000-0000-0000-000000000020', 5),
('d0000001-0000-0000-0000-000000000038', 5),
('d0000001-0000-0000-0000-000000000021', 6),
('d0000001-0000-0000-0000-000000000022', 6),
('d0000001-0000-0000-0000-000000000023', 7),
('d0000001-0000-0000-0000-000000000024', 7),
('d0000001-0000-0000-0000-000000000025', 8),
('d0000001-0000-0000-0000-000000000026', 8),
-- Event 6 posts (posts 9-11)
('d0000001-0000-0000-0000-000000000027', 9),
('d0000001-0000-0000-0000-000000000028', 9),
('d0000001-0000-0000-0000-000000000039', 9),
('d0000001-0000-0000-0000-000000000029', 10),
('d0000001-0000-0000-0000-000000000030', 10),
('d0000001-0000-0000-0000-000000000031', 11),
('d0000001-0000-0000-0000-000000000032', 11),
-- Event 7 posts (posts 12-14)
('d0000001-0000-0000-0000-000000000033', 12),
('d0000001-0000-0000-0000-000000000034', 12),
('d0000001-0000-0000-0000-000000000035', 13),
('d0000001-0000-0000-0000-000000000036', 13),
('d0000001-0000-0000-0000-000000000001', 14),
('d0000001-0000-0000-0000-000000000002', 14),
-- Event 8 posts (posts 15-18)
('d0000001-0000-0000-0000-000000000003', 15),
('d0000001-0000-0000-0000-000000000004', 15),
('d0000001-0000-0000-0000-000000000040', 15),
('d0000001-0000-0000-0000-000000000005', 16),
('d0000001-0000-0000-0000-000000000006', 16),
('d0000001-0000-0000-0000-000000000007', 17),
('d0000001-0000-0000-0000-000000000008', 17),
('d0000001-0000-0000-0000-000000000009', 18),
('d0000001-0000-0000-0000-000000000010', 18),
-- Event 9 posts (posts 19-21)
('d0000001-0000-0000-0000-000000000011', 19),
('d0000001-0000-0000-0000-000000000012', 19),
('d0000001-0000-0000-0000-000000000013', 20),
('d0000001-0000-0000-0000-000000000014', 20),
('d0000001-0000-0000-0000-000000000015', 21),
('d0000001-0000-0000-0000-000000000016', 21),
-- Event 10 posts (posts 22-25)
('d0000001-0000-0000-0000-000000000017', 22),
('d0000001-0000-0000-0000-000000000018', 22),
('d0000001-0000-0000-0000-000000000019', 22),
('d0000001-0000-0000-0000-000000000020', 23),
('d0000001-0000-0000-0000-000000000021', 23),
('d0000001-0000-0000-0000-000000000022', 24),
('d0000001-0000-0000-0000-000000000023', 24),
('d0000001-0000-0000-0000-000000000024', 25),
('d0000001-0000-0000-0000-000000000025', 25),
-- Event 11 posts (posts 26-28)
('d0000001-0000-0000-0000-000000000026', 26),
('d0000001-0000-0000-0000-000000000027', 26),
('d0000001-0000-0000-0000-000000000028', 26),
('d0000001-0000-0000-0000-000000000029', 27),
('d0000001-0000-0000-0000-000000000030', 27),
('d0000001-0000-0000-0000-000000000031', 28),
('d0000001-0000-0000-0000-000000000032', 28),
-- Event 12 posts (posts 29-31)
('d0000001-0000-0000-0000-000000000033', 29),
('d0000001-0000-0000-0000-000000000034', 29),
('d0000001-0000-0000-0000-000000000035', 30),
('d0000001-0000-0000-0000-000000000036', 30),
('d0000001-0000-0000-0000-000000000037', 31),
('d0000001-0000-0000-0000-000000000038', 31),
-- Event 13 posts (posts 32-34)
('d0000001-0000-0000-0000-000000000039', 32),
('d0000001-0000-0000-0000-000000000040', 32),
('d0000001-0000-0000-0000-000000000001', 33),
('d0000001-0000-0000-0000-000000000002', 33),
('d0000001-0000-0000-0000-000000000003', 34),
('d0000001-0000-0000-0000-000000000004', 34),
-- General articles (posts 35-38)
('d0000001-0000-0000-0000-000000000005', 35),
('d0000001-0000-0000-0000-000000000006', 35),
('d0000001-0000-0000-0000-000000000007', 35),
('d0000001-0000-0000-0000-000000000008', 36),
('d0000001-0000-0000-0000-000000000009', 36),
('d0000001-0000-0000-0000-000000000010', 37),
('d0000001-0000-0000-0000-000000000011', 38),
('d0000001-0000-0000-0000-000000000012', 38);

-- ============================================
-- 10. COMMENTS (3-5 per post)
-- ============================================
INSERT INTO comment (comment_id, created_by_account_id, post_id, create_at, content, reply_to) VALUES
-- Post 1: Chuẩn bị cho chương trình hiến máu (5 comments)
(1, 'c0000001-0000-0000-0000-000000000001', 1, NOW() - INTERVAL 8 DAY, 'Tuyệt vời! Em sẽ tham gia!', NULL),
(2, 'c0000001-0000-0000-0000-000000000002', 1, NOW() - INTERVAL 8 DAY, 'Đăng ký ở đâu ạ?', NULL),
(3, 'b0000001-0000-0000-0000-000000000001', 1, NOW() - INTERVAL 8 DAY, 'Đăng ký trên app nhé bạn!', 2),
(4, 'c0000001-0000-0000-0000-000000000003', 1, NOW() - INTERVAL 7 DAY, 'Có cần mang gì theo không ạ?', NULL),
(5, 'c0000001-0000-0000-0000-000000000004', 1, NOW() - INTERVAL 7 DAY, 'Địa điểm có xa không?', NULL),
-- Post 2: Thông báo địa điểm hiến máu (4 comments)
(6, 'c0000001-0000-0000-0000-000000000001', 2, NOW() - INTERVAL 7 DAY, 'Cảm ơn thông tin!', NULL),
(7, 'c0000001-0000-0000-0000-000000000005', 2, NOW() - INTERVAL 7 DAY, 'Tầng 2 có thang máy không ạ?', NULL),
(8, 'b0000001-0000-0000-0000-000000000001', 2, NOW() - INTERVAL 7 DAY, 'Có thang máy và cầu thang bộ nhé!', 7),
(9, 'c0000001-0000-0000-0000-000000000006', 2, NOW() - INTERVAL 6 DAY, 'Đã note địa điểm rồi!', NULL),
-- Post 3: Lần đầu hiến máu (5 comments)
(10, 'c0000001-0000-0000-0000-000000000002', 3, NOW() - INTERVAL 6 DAY, 'Mình cũng lần đầu nè, cùng đi nhé!', NULL),
(11, 'b0000001-0000-0000-0000-000000000001', 3, NOW() - INTERVAL 6 DAY, 'Nhớ ăn sáng đầy đủ và ngủ đủ giấc nhé!', NULL),
(12, 'c0000001-0000-0000-0000-000000000007', 3, NOW() - INTERVAL 6 DAY, 'Không đau lắm đâu, yên tâm!', NULL),
(13, 'c0000001-0000-0000-0000-000000000008', 3, NOW() - INTERVAL 5 DAY, 'Mình hiến lần 2 rồi, rất nhẹ nhàng!', NULL),
(14, 'c0000001-0000-0000-0000-000000000003', 3, NOW() - INTERVAL 5 DAY, 'Cảm ơn mọi người chia sẻ!', 11),
-- Post 4: Đã đăng ký thành công (4 comments)
(15, 'c0000001-0000-0000-0000-000000000002', 4, NOW() - INTERVAL 5 DAY, 'Mình đi cùng nha!', NULL),
(16, 'c0000001-0000-0000-0000-000000000005', 4, NOW() - INTERVAL 5 DAY, 'Count me in!', NULL),
(17, 'c0000001-0000-0000-0000-000000000006', 4, NOW() - INTERVAL 4 DAY, 'Hẹn gặp cả nhà!', NULL),
(18, 'c0000001-0000-0000-0000-000000000001', 4, NOW() - INTERVAL 4 DAY, 'Let gooo!', 15),
-- Post 5: Chạy bộ 5K sắp diễn ra (5 comments)
(19, 'c0000001-0000-0000-0000-000000000001', 5, NOW() - INTERVAL 13 DAY, 'Háo hức quá!', NULL),
(20, 'c0000001-0000-0000-0000-000000000006', 5, NOW() - INTERVAL 13 DAY, 'Đăng ký ngay thôi!', NULL),
(21, 'c0000001-0000-0000-0000-000000000007', 5, NOW() - INTERVAL 12 DAY, 'Có được chạy bộ không ạ hay phải chạy nhanh?', NULL),
(22, 'b0000001-0000-0000-0000-000000000002', 5, NOW() - INTERVAL 12 DAY, 'Ai cũng có thể tham gia, đi bộ cũng được!', 21),
(23, 'c0000001-0000-0000-0000-000000000008', 5, NOW() - INTERVAL 11 DAY, 'Quá tuyệt vời!', NULL),
-- Post 6: Lịch chạy (4 comments)
(24, 'c0000001-0000-0000-0000-000000000003', 6, NOW() - INTERVAL 12 DAY, 'Sáng sớm thật, nhưng sẽ cố!', NULL),
(25, 'c0000001-0000-0000-0000-000000000004', 6, NOW() - INTERVAL 12 DAY, '6h sáng lạnh quá!', NULL),
(26, 'b0000001-0000-0000-0000-000000000002', 6, NOW() - INTERVAL 11 DAY, 'Chạy xong ấm ngay thôi!', 25),
(27, 'c0000001-0000-0000-0000-000000000005', 6, NOW() - INTERVAL 11 DAY, 'Mọi người nhớ mặc áo ấm!', NULL),
-- Post 7: Team chạy bộ (3 comments)
(28, 'c0000001-0000-0000-0000-000000000001', 7, NOW() - INTERVAL 11 DAY, 'Mình join team!', NULL),
(29, 'c0000001-0000-0000-0000-000000000002', 7, NOW() - INTERVAL 11 DAY, 'Có team rồi á, inbox mình!', NULL),
(30, 'c0000001-0000-0000-0000-000000000006', 7, NOW() - INTERVAL 10 DAY, 'Mình cũng muốn tham gia!', 29),
-- Post 8: Team 5 người (4 comments)
(31, 'c0000001-0000-0000-0000-000000000003', 8, NOW() - INTERVAL 10 DAY, 'Team mấy người vậy?', NULL),
(32, 'c0000001-0000-0000-0000-000000000007', 8, NOW() - INTERVAL 10 DAY, '5 người rồi nè!', 31),
(33, 'c0000001-0000-0000-0000-000000000004', 8, NOW() - INTERVAL 9 DAY, 'Ghê quá!', NULL),
(34, 'c0000001-0000-0000-0000-000000000008', 8, NOW() - INTERVAL 9 DAY, 'Fighting!', NULL),
-- Post 9: Lớp tiếng Anh (5 comments)
(35, 'c0000001-0000-0000-0000-000000000002', 9, NOW() - INTERVAL 18 DAY, 'Chương trình rất ý nghĩa!', NULL),
(36, 'c0000001-0000-0000-0000-000000000003', 9, NOW() - INTERVAL 18 DAY, 'Các em nhỏ sẽ rất vui!', NULL),
(37, 'c0000001-0000-0000-0000-000000000004', 9, NOW() - INTERVAL 17 DAY, 'Mình muốn đăng ký làm tình nguyện viên dạy!', NULL),
(38, 'b0000001-0000-0000-0000-000000000003', 9, NOW() - INTERVAL 17 DAY, 'Inbox mình để đăng ký nhé!', 37),
(39, 'c0000001-0000-0000-0000-000000000005', 9, NOW() - INTERVAL 16 DAY, 'Cảm ơn các anh chị!', NULL),
-- Post 10: Lịch học tiếng Anh (4 comments)
(40, 'c0000001-0000-0000-0000-000000000003', 10, NOW() - INTERVAL 12 DAY, 'Cũng muốn biết ạ!', NULL),
(41, 'b0000001-0000-0000-0000-000000000003', 10, NOW() - INTERVAL 12 DAY, 'Thứ 7 hàng tuần từ 9h-11h nhé!', NULL),
(42, 'c0000001-0000-0000-0000-000000000002', 10, NOW() - INTERVAL 11 DAY, 'Cảm ơn thầy/cô!', 41),
(43, 'c0000001-0000-0000-0000-000000000006', 10, NOW() - INTERVAL 11 DAY, 'Noted!', NULL),
-- Post 11: Thông báo nghỉ (3 comments)
(44, 'c0000001-0000-0000-0000-000000000001', 11, NOW() - INTERVAL 9 DAY, 'Đã hiểu ạ!', NULL),
(45, 'c0000001-0000-0000-0000-000000000004', 11, NOW() - INTERVAL 9 DAY, 'Tuần sau học lại nhé!', NULL),
(46, 'c0000001-0000-0000-0000-000000000007', 11, NOW() - INTERVAL 8 DAY, 'Mọi người nghỉ ngơi vui vẻ!', NULL),
-- Post 12: Chuẩn bị nấu cơm (5 comments)
(47, 'c0000001-0000-0000-0000-000000000001', 12, NOW() - INTERVAL 6 DAY, 'Tuyệt vời quá!', NULL),
(48, 'c0000001-0000-0000-0000-000000000002', 12, NOW() - INTERVAL 6 DAY, '200 suất nhiều ghê!', NULL),
(49, 'c0000001-0000-0000-0000-000000000005', 12, NOW() - INTERVAL 5 DAY, 'Mình có thể đóng góp gạo!', NULL),
(50, 'b0000001-0000-0000-0000-000000000004', 12, NOW() - INTERVAL 5 DAY, 'Cảm ơn bạn nhiều!', 49),
(51, 'c0000001-0000-0000-0000-000000000008', 12, NOW() - INTERVAL 5 DAY, 'Rất mong được giúp đỡ!', NULL),
-- Post 13: Đóng góp rau củ (4 comments)
(52, 'c0000001-0000-0000-0000-000000000001', 13, NOW() - INTERVAL 5 DAY, 'Mình có rau xanh!', NULL),
(53, 'c0000001-0000-0000-0000-000000000003', 13, NOW() - INTERVAL 5 DAY, 'Mình góp cà rốt nhé!', NULL),
(54, 'b0000001-0000-0000-0000-000000000004', 13, NOW() - INTERVAL 4 DAY, 'Tuyệt vời! Mang đến trước 7h sáng mai nhé!', NULL),
(55, 'c0000001-0000-0000-0000-000000000004', 13, NOW() - INTERVAL 4 DAY, 'Mình mang thêm đậu phụ!', NULL),
-- Post 14: Địa điểm phát cơm (3 comments)
(56, 'c0000001-0000-0000-0000-000000000002', 14, NOW() - INTERVAL 4 DAY, 'Có cần người phụ phát cơm không?', NULL),
(57, 'b0000001-0000-0000-0000-000000000004', 14, NOW() - INTERVAL 4 DAY, 'Cần chứ! Đến sớm 30 phút nhé!', 56),
(58, 'c0000001-0000-0000-0000-000000000006', 14, NOW() - INTERVAL 3 DAY, 'Mình sẽ đến!', NULL),
-- Post 15: Thăm viện dưỡng lão (4 comments)
(59, 'c0000001-0000-0000-0000-000000000001', 15, NOW() - INTERVAL 27 DAY, 'Đã note lịch!', NULL),
(60, 'c0000001-0000-0000-0000-000000000002', 15, NOW() - INTERVAL 27 DAY, 'Mọi người nhớ đến sớm nhé!', NULL),
(61, 'c0000001-0000-0000-0000-000000000003', 15, NOW() - INTERVAL 26 DAY, 'Sẽ mang quà gì cho các cụ?', NULL),
(62, 'b0000001-0000-0000-0000-000000000001', 15, NOW() - INTERVAL 26 DAY, 'Bánh, sữa và khăn ấm nhé!', 61),
-- Post 16: Danh sách quà tặng (3 comments)
(63, 'c0000001-0000-0000-0000-000000000004', 16, NOW() - INTERVAL 26 DAY, 'Chuẩn bị chu đáo quá!', NULL),
(64, 'c0000001-0000-0000-0000-000000000005', 16, NOW() - INTERVAL 25 DAY, 'Các cụ sẽ vui lắm!', NULL),
(65, 'c0000001-0000-0000-0000-000000000006', 16, NOW() - INTERVAL 25 DAY, 'Mình muốn góp thêm bánh!', NULL),
-- Post 17: Hát dân ca (5 comments)
(66, 'c0000001-0000-0000-0000-000000000007', 17, NOW() - INTERVAL 25 DAY, 'Mình biết hát Bèo dạt mây trôi!', NULL),
(67, 'c0000001-0000-0000-0000-000000000002', 17, NOW() - INTERVAL 25 DAY, 'Mình biết Làng tôi!', NULL),
(68, 'c0000001-0000-0000-0000-000000000001', 17, NOW() - INTERVAL 24 DAY, 'Hay quá! Cùng biểu diễn nhé!', NULL),
(69, 'b0000001-0000-0000-0000-000000000001', 17, NOW() - INTERVAL 24 DAY, 'Tuyệt vời! Các cụ sẽ rất thích!', NULL),
(70, 'c0000001-0000-0000-0000-000000000008', 17, NOW() - INTERVAL 24 DAY, 'Mình chơi đàn guitar được!', NULL),
-- Post 18: Thăm các cụ xong (4 comments)
(71, 'c0000001-0000-0000-0000-000000000003', 18, NOW() - INTERVAL 24 DAY, 'Cảm động quá!', NULL),
(72, 'c0000001-0000-0000-0000-000000000004', 18, NOW() - INTERVAL 24 DAY, 'Các cụ vui lắm!', NULL),
(73, 'c0000001-0000-0000-0000-000000000005', 18, NOW() - INTERVAL 23 DAY, 'Rất ý nghĩa!', NULL),
(74, 'b0000001-0000-0000-0000-000000000001', 18, NOW() - INTERVAL 23 DAY, 'Cảm ơn mọi người đã tham gia!', NULL),
-- Post 19: Dọn sông Tô Lịch (3 comments)
(75, 'c0000001-0000-0000-0000-000000000004', 19, NOW() - INTERVAL 23 DAY, 'Tiến độ tốt quá!', NULL),
(76, 'c0000001-0000-0000-0000-000000000005', 19, NOW() - INTERVAL 23 DAY, 'Mọi người cố gắng!', NULL),
(77, 'c0000001-0000-0000-0000-000000000007', 19, NOW() - INTERVAL 22 DAY, 'Dòng sông sẽ sạch thôi!', NULL),
-- Post 20: Thu rác 50kg (4 comments)
(78, 'c0000001-0000-0000-0000-000000000001', 20, NOW() - INTERVAL 22 DAY, 'Ghê quá 50kg!', NULL),
(79, 'c0000001-0000-0000-0000-000000000002', 20, NOW() - INTERVAL 22 DAY, 'Mọi người làm việc hiệu quả!', NULL),
(80, 'b0000001-0000-0000-0000-000000000005', 20, NOW() - INTERVAL 21 DAY, 'Cảm ơn các bạn!', NULL),
(81, 'c0000001-0000-0000-0000-000000000006', 20, NOW() - INTERVAL 21 DAY, 'Ngày mai tiếp tục!', NULL),
-- Post 21: Tiếp tục dọn (3 comments)
(82, 'c0000001-0000-0000-0000-000000000003', 21, NOW() - INTERVAL 21 DAY, 'Mình mang găng tay rồi!', NULL),
(83, 'c0000001-0000-0000-0000-000000000004', 21, NOW() - INTERVAL 20 DAY, 'Hẹn gặp mai!', NULL),
(84, 'c0000001-0000-0000-0000-000000000005', 21, NOW() - INTERVAL 20 DAY, 'Fighting!', NULL),
-- Post 22: Xây nhà tình thương (5 comments)
(85, 'c0000001-0000-0000-0000-000000000001', 22, NOW() - INTERVAL 29 DAY, 'Công việc rất ý nghĩa!', NULL),
(86, 'c0000001-0000-0000-0000-000000000003', 22, NOW() - INTERVAL 29 DAY, 'Ngôi nhà thứ 3 rồi á!', NULL),
(87, 'c0000001-0000-0000-0000-000000000005', 22, NOW() - INTERVAL 28 DAY, 'Tuyệt vời!', NULL),
(88, 'b0000001-0000-0000-0000-000000000002', 22, NOW() - INTERVAL 28 DAY, 'Cảm ơn mọi người hỗ trợ!', NULL),
(89, 'c0000001-0000-0000-0000-000000000007', 22, NOW() - INTERVAL 27 DAY, 'Hạnh phúc quá!', NULL),
-- Post 23: Tiến độ công trình (3 comments)
(90, 'c0000001-0000-0000-0000-000000000002', 23, NOW() - INTERVAL 28 DAY, 'Tiến độ nhanh ghê!', NULL),
(91, 'c0000001-0000-0000-0000-000000000004', 23, NOW() - INTERVAL 27 DAY, 'Gia đình sẽ rất vui!', NULL),
(92, 'c0000001-0000-0000-0000-000000000006', 23, NOW() - INTERVAL 27 DAY, 'Mong hoàn thành sớm!', NULL),
-- Post 24: Gia đình nhận nhà (4 comments)
(93, 'c0000001-0000-0000-0000-000000000001', 24, NOW() - INTERVAL 27 DAY, 'Xúc động quá!', NULL),
(94, 'c0000001-0000-0000-0000-000000000003', 24, NOW() - INTERVAL 27 DAY, 'Mừng cho gia đình!', NULL),
(95, 'c0000001-0000-0000-0000-000000000005', 24, NOW() - INTERVAL 26 DAY, 'Công việc ý nghĩa!', NULL),
(96, 'c0000001-0000-0000-0000-000000000008', 24, NOW() - INTERVAL 26 DAY, 'Rất cảm động!', NULL),
-- Post 25: Lễ trao nhà (3 comments)
(97, 'c0000001-0000-0000-0000-000000000002', 25, NOW() - INTERVAL 26 DAY, 'Sẽ đến dự!', NULL),
(98, 'c0000001-0000-0000-0000-000000000004', 25, NOW() - INTERVAL 25 DAY, 'Mình cũng đến!', NULL),
(99, 'c0000001-0000-0000-0000-000000000006', 25, NOW() - INTERVAL 25 DAY, 'Hẹn gặp mọi người!', NULL),
-- Post 26: Cứu trợ lũ lụt (4 comments)
(100, 'c0000001-0000-0000-0000-000000000001', 26, NOW() - INTERVAL 54 DAY, 'Thương bà con quá!', NULL),
(101, 'c0000001-0000-0000-0000-000000000002', 26, NOW() - INTERVAL 54 DAY, 'Cầu mong mọi người an toàn!', NULL),
(102, 'c0000001-0000-0000-0000-000000000003', 26, NOW() - INTERVAL 53 DAY, 'Đoàn cứu trợ cố gắng!', NULL),
(103, 'b0000001-0000-0000-0000-000000000003', 26, NOW() - INTERVAL 53 DAY, 'Cảm ơn sự quan tâm của mọi người!', NULL),
-- Post 27: Cảm ơn cứu trợ (3 comments)
(104, 'c0000001-0000-0000-0000-000000000002', 27, NOW() - INTERVAL 47 DAY, 'Rất xúc động!', NULL),
(105, 'c0000001-0000-0000-0000-000000000003', 27, NOW() - INTERVAL 47 DAY, 'Lần sau nhớ gọi em!', NULL),
(106, 'b0000001-0000-0000-0000-000000000003', 27, NOW() - INTERVAL 46 DAY, 'Cảm ơn tất cả mọi người!', NULL),
-- Post 28: Tổng kết cứu trợ (4 comments)
(107, 'c0000001-0000-0000-0000-000000000004', 28, NOW() - INTERVAL 45 DAY, '500 phần quà nhiều ghê!', NULL),
(108, 'c0000001-0000-0000-0000-000000000005', 28, NOW() - INTERVAL 45 DAY, 'Tuyệt vời!', NULL),
(109, 'c0000001-0000-0000-0000-000000000006', 28, NOW() - INTERVAL 44 DAY, 'Rất ý nghĩa!', NULL),
(110, 'c0000001-0000-0000-0000-000000000007', 28, NOW() - INTERVAL 44 DAY, 'Cảm ơn đoàn cứu trợ!', NULL),
-- Post 29: Khám bệnh miễn phí (5 comments)
(111, 'c0000001-0000-0000-0000-000000000005', 29, NOW() - INTERVAL 39 DAY, 'Chương trình rất hay!', NULL),
(112, 'c0000001-0000-0000-0000-000000000006', 29, NOW() - INTERVAL 39 DAY, 'Cảm ơn các bác sĩ!', NULL),
(113, 'c0000001-0000-0000-0000-000000000007', 29, NOW() - INTERVAL 38 DAY, 'Người dân rất vui!', NULL),
(114, 'b0000001-0000-0000-0000-000000000004', 29, NOW() - INTERVAL 38 DAY, 'Tiếp tục cố gắng!', NULL),
(115, 'c0000001-0000-0000-0000-000000000001', 29, NOW() - INTERVAL 37 DAY, 'Rất ý nghĩa!', NULL),
-- Post 30: Chương trình khám bệnh (3 comments)
(116, 'c0000001-0000-0000-0000-000000000006', 30, NOW() - INTERVAL 37 DAY, 'Các bác sĩ rất tận tâm!', NULL),
(117, 'c0000001-0000-0000-0000-000000000007', 30, NOW() - INTERVAL 36 DAY, 'Cảm ơn chương trình!', NULL),
(118, 'c0000001-0000-0000-0000-000000000005', 30, NOW() - INTERVAL 36 DAY, 'Rất vui được tham gia!', 116),
-- Post 31: Kết thúc khám bệnh (4 comments)
(119, 'c0000001-0000-0000-0000-000000000001', 31, NOW() - INTERVAL 34 DAY, '300 người! Quá tuyệt!', NULL),
(120, 'c0000001-0000-0000-0000-000000000002', 31, NOW() - INTERVAL 34 DAY, 'Cảm ơn ban tổ chức!', NULL),
(121, 'c0000001-0000-0000-0000-000000000003', 31, NOW() - INTERVAL 33 DAY, 'Năm sau làm tiếp nhé!', NULL),
(122, 'b0000001-0000-0000-0000-000000000004', 31, NOW() - INTERVAL 33 DAY, 'Chắc chắn rồi!', 121),
-- Post 32: Hồ sơ học bổng (3 comments)
(123, 'c0000001-0000-0000-0000-000000000008', 32, NOW() - INTERVAL 34 DAY, 'Mong được xét duyệt!', NULL),
(124, 'c0000001-0000-0000-0000-000000000001', 32, NOW() - INTERVAL 33 DAY, 'Chúc các bạn may mắn!', NULL),
(125, 'c0000001-0000-0000-0000-000000000002', 32, NOW() - INTERVAL 33 DAY, 'Hồi hộp quá!', NULL),
-- Post 33: Danh sách học bổng (4 comments)
(126, 'c0000001-0000-0000-0000-000000000003', 33, NOW() - INTERVAL 31 DAY, 'Xin chúc mừng các bạn!', NULL),
(127, 'c0000001-0000-0000-0000-000000000004', 33, NOW() - INTERVAL 31 DAY, 'Tuyệt vời!', NULL),
(128, 'c0000001-0000-0000-0000-000000000008', 33, NOW() - INTERVAL 30 DAY, 'Em đậu rồi!', NULL),
(129, 'b0000001-0000-0000-0000-000000000005', 33, NOW() - INTERVAL 30 DAY, 'Chúc mừng em!', 128),
-- Post 34: Cảm ơn học bổng (3 comments)
(130, 'c0000001-0000-0000-0000-000000000001', 34, NOW() - INTERVAL 29 DAY, 'Chúc mừng bạn!', NULL),
(131, 'c0000001-0000-0000-0000-000000000002', 34, NOW() - INTERVAL 29 DAY, 'Xứng đáng lắm!', NULL),
(132, 'b0000001-0000-0000-0000-000000000005', 34, NOW() - INTERVAL 28 DAY, 'Cố gắng học tập nhé!', NULL),
-- Post 35: Bài viết về tình nguyện viên (4 comments)
(133, 'c0000001-0000-0000-0000-000000000001', 35, NOW() - INTERVAL 19 DAY, 'Bài viết hay quá!', NULL),
(134, 'c0000001-0000-0000-0000-000000000003', 35, NOW() - INTERVAL 19 DAY, 'Cảm ơn tác giả!', NULL),
(135, 'c0000001-0000-0000-0000-000000000005', 35, NOW() - INTERVAL 18 DAY, 'Rất truyền cảm hứng!', NULL),
(136, 'c0000001-0000-0000-0000-000000000007', 35, NOW() - INTERVAL 18 DAY, 'Chia sẻ cho bạn bè!', NULL),
-- Post 36: 10 lý do tham gia (5 comments)
(137, 'c0000001-0000-0000-0000-000000000002', 36, NOW() - INTERVAL 17 DAY, 'Đúng quá!', NULL),
(138, 'c0000001-0000-0000-0000-000000000004', 36, NOW() - INTERVAL 17 DAY, 'Mình đồng ý!', NULL),
(139, 'c0000001-0000-0000-0000-000000000006', 36, NOW() - INTERVAL 16 DAY, 'Sẽ tham gia nhiều hơn!', NULL),
(140, 'c0000001-0000-0000-0000-000000000008', 36, NOW() - INTERVAL 16 DAY, 'Cảm ơn bài viết!', NULL),
(141, 'b0000001-0000-0000-0000-000000000001', 36, NOW() - INTERVAL 15 DAY, 'Rất vui được chia sẻ!', NULL),
-- Post 38: Câu chuyện tình nguyện viên (4 comments)
(142, 'c0000001-0000-0000-0000-000000000001', 38, NOW() - INTERVAL 11 DAY, 'Câu chuyện cảm động!', NULL),
(143, 'c0000001-0000-0000-0000-000000000003', 38, NOW() - INTERVAL 11 DAY, 'Xúc động quá!', NULL),
(144, 'c0000001-0000-0000-0000-000000000005', 38, NOW() - INTERVAL 10 DAY, 'Rất truyền cảm hứng!', NULL),
(145, 'c0000001-0000-0000-0000-000000000007', 38, NOW() - INTERVAL 10 DAY, 'Cảm ơn đã chia sẻ!', NULL),
-- Post 39-53: Additional posts for Event 4 (3 comments each)
(146, 'c0000001-0000-0000-0000-000000000003', 39, NOW() - INTERVAL 4 DAY, 'Bạn thật tuyệt vời!', NULL),
(147, 'c0000001-0000-0000-0000-000000000004', 39, NOW() - INTERVAL 4 DAY, 'Mình cũng muốn hiến máu!', NULL),
(148, 'c0000001-0000-0000-0000-000000000005', 39, NOW() - INTERVAL 3 DAY, 'Cảm ơn bạn đã chia sẻ!', NULL),
(149, 'c0000001-0000-0000-0000-000000000001', 40, NOW() - INTERVAL 4 DAY, 'FPT đông quá!', NULL),
(150, 'c0000001-0000-0000-0000-000000000002', 40, NOW() - INTERVAL 4 DAY, 'UET cũng đến nha!', NULL),
(151, 'c0000001-0000-0000-0000-000000000006', 40, NOW() - INTERVAL 3 DAY, 'Háo hức quá!', NULL),
(152, 'c0000001-0000-0000-0000-000000000003', 41, NOW() - INTERVAL 3 DAY, '50 người rồi á!', NULL),
(153, 'c0000001-0000-0000-0000-000000000004', 41, NOW() - INTERVAL 3 DAY, 'Tuyệt vời!', NULL),
(154, 'c0000001-0000-0000-0000-000000000007', 41, NOW() - INTERVAL 2 DAY, 'Còn tăng nữa!', NULL),
(155, 'c0000001-0000-0000-0000-000000000001', 42, NOW() - INTERVAL 3 DAY, 'Có chỗ nghỉ ngơi!', NULL),
(156, 'b0000001-0000-0000-0000-000000000001', 42, NOW() - INTERVAL 3 DAY, 'Có phòng nghỉ và đồ ăn nhẹ!', NULL),
(157, 'c0000001-0000-0000-0000-000000000005', 42, NOW() - INTERVAL 2 DAY, 'Yên tâm rồi!', 156),
(158, 'c0000001-0000-0000-0000-000000000002', 43, NOW() - INTERVAL 3 DAY, 'Bạn tốt quá!', NULL),
(159, 'c0000001-0000-0000-0000-000000000003', 43, NOW() - INTERVAL 3 DAY, 'Mình mang thêm trái cây!', NULL),
(160, 'c0000001-0000-0000-0000-000000000008', 43, NOW() - INTERVAL 2 DAY, 'Cảm ơn các bạn!', NULL),
(161, 'c0000001-0000-0000-0000-000000000001', 44, NOW() - INTERVAL 2 DAY, 'Không đau đâu!', NULL),
(162, 'c0000001-0000-0000-0000-000000000002', 44, NOW() - INTERVAL 2 DAY, 'Chỉ như kiến cắn thôi!', NULL),
(163, 'b0000001-0000-0000-0000-000000000001', 44, NOW() - INTERVAL 2 DAY, 'Y tá rất nhẹ nhàng!', NULL),
(164, 'c0000001-0000-0000-0000-000000000004', 45, NOW() - INTERVAL 2 DAY, 'Đã uống nhiều nước!', NULL),
(165, 'c0000001-0000-0000-0000-000000000005', 45, NOW() - INTERVAL 2 DAY, 'Ngủ sớm tối nay!', NULL),
(166, 'c0000001-0000-0000-0000-000000000006', 45, NOW() - INTERVAL 1 DAY, 'Sẵn sàng!', NULL),
(167, 'c0000001-0000-0000-0000-000000000001', 46, NOW() - INTERVAL 2 DAY, 'UET mạnh quá!', NULL),
(168, 'c0000001-0000-0000-0000-000000000002', 46, NOW() - INTERVAL 2 DAY, 'Join team UET!', NULL),
(169, 'c0000001-0000-0000-0000-000000000003', 46, NOW() - INTERVAL 1 DAY, 'Mình ở NEU cũng muốn join!', NULL),
(170, 'c0000001-0000-0000-0000-000000000004', 47, NOW() - INTERVAL 1 DAY, '48kg được nha!', NULL),
(171, 'b0000001-0000-0000-0000-000000000001', 47, NOW() - INTERVAL 1 DAY, 'Đủ điều kiện rồi!', NULL),
(172, 'c0000001-0000-0000-0000-000000000001', 47, NOW() - INTERVAL 1 DAY, 'Yay!', 171),
(173, 'c0000001-0000-0000-0000-000000000005', 48, NOW() - INTERVAL 1 DAY, 'Cảm ơn thông tin!', NULL),
(174, 'c0000001-0000-0000-0000-000000000006', 48, NOW() - INTERVAL 1 DAY, 'Hữu ích quá!', NULL),
(175, 'c0000001-0000-0000-0000-000000000007', 48, NOW() - INTERVAL 1 DAY, 'Noted!', NULL),
(176, 'c0000001-0000-0000-0000-000000000001', 49, NOW() - INTERVAL 1 DAY, '80 người! Wow!', NULL),
(177, 'c0000001-0000-0000-0000-000000000002', 49, NOW() - INTERVAL 1 DAY, 'Hoành tráng ghê!', NULL),
(178, 'b0000001-0000-0000-0000-000000000001', 49, NOW() - INTERVAL 1 DAY, 'Cảm ơn mọi người!', NULL),
(179, 'c0000001-0000-0000-0000-000000000003', 50, NOW() - INTERVAL 23 HOUR, 'Nghỉ 24h là được!', NULL),
(180, 'b0000001-0000-0000-0000-000000000001', 50, NOW() - INTERVAL 22 HOUR, 'Đúng rồi!', 179),
(181, 'c0000001-0000-0000-0000-000000000002', 50, NOW() - INTERVAL 21 HOUR, 'OK noted!', NULL),
(182, 'c0000001-0000-0000-0000-000000000004', 51, NOW() - INTERVAL 22 HOUR, 'Cảm ơn!', NULL),
(183, 'c0000001-0000-0000-0000-000000000005', 51, NOW() - INTERVAL 21 HOUR, 'Hữu ích!', NULL),
(184, 'c0000001-0000-0000-0000-000000000006', 51, NOW() - INTERVAL 20 HOUR, 'Yên tâm rồi!', NULL),
(185, 'c0000001-0000-0000-0000-000000000001', 52, NOW() - INTERVAL 20 HOUR, 'Countdown!', NULL),
(186, 'c0000001-0000-0000-0000-000000000002', 52, NOW() - INTERVAL 19 HOUR, 'Háo hức!', NULL),
(187, 'c0000001-0000-0000-0000-000000000003', 52, NOW() - INTERVAL 18 HOUR, 'Sẵn sàng!', NULL),
(188, 'c0000001-0000-0000-0000-000000000007', 53, NOW() - INTERVAL 11 HOUR, '100 người!', NULL),
(189, 'c0000001-0000-0000-0000-000000000008', 53, NOW() - INTERVAL 10 HOUR, 'Amazing!', NULL),
(190, 'b0000001-0000-0000-0000-000000000001', 53, NOW() - INTERVAL 9 HOUR, 'Cảm ơn cộng đồng!', NULL);

-- ============================================
-- 11. EVENT_LIKE (random likes)
-- ============================================
INSERT INTO event_like (account_id, event_id, create_at) VALUES
('c0000001-0000-0000-0000-000000000001', 4, NOW() - INTERVAL 9 DAY),
('c0000001-0000-0000-0000-000000000002', 4, NOW() - INTERVAL 8 DAY),
('c0000001-0000-0000-0000-000000000003', 4, NOW() - INTERVAL 7 DAY),
('c0000001-0000-0000-0000-000000000004', 4, NOW() - INTERVAL 6 DAY),
('c0000001-0000-0000-0000-000000000005', 4, NOW() - INTERVAL 5 DAY),
('c0000001-0000-0000-0000-000000000001', 5, NOW() - INTERVAL 14 DAY),
('c0000001-0000-0000-0000-000000000006', 5, NOW() - INTERVAL 13 DAY),
('c0000001-0000-0000-0000-000000000007', 5, NOW() - INTERVAL 12 DAY),
('c0000001-0000-0000-0000-000000000002', 6, NOW() - INTERVAL 18 DAY),
('c0000001-0000-0000-0000-000000000003', 6, NOW() - INTERVAL 17 DAY),
('c0000001-0000-0000-0000-000000000004', 6, NOW() - INTERVAL 16 DAY),
('c0000001-0000-0000-0000-000000000001', 8, NOW() - INTERVAL 28 DAY),
('c0000001-0000-0000-0000-000000000002', 8, NOW() - INTERVAL 27 DAY),
('c0000001-0000-0000-0000-000000000004', 9, NOW() - INTERVAL 23 DAY),
('c0000001-0000-0000-0000-000000000005', 9, NOW() - INTERVAL 22 DAY),
('c0000001-0000-0000-0000-000000000001', 11, NOW() - INTERVAL 52 DAY),
('c0000001-0000-0000-0000-000000000002', 11, NOW() - INTERVAL 51 DAY),
('c0000001-0000-0000-0000-000000000003', 11, NOW() - INTERVAL 50 DAY),
('c0000001-0000-0000-0000-000000000005', 12, NOW() - INTERVAL 42 DAY),
('c0000001-0000-0000-0000-000000000006', 12, NOW() - INTERVAL 41 DAY);

-- Update like_count for each event
UPDATE event SET like_count = (SELECT COUNT(*) FROM event_like WHERE event_like.event_id = event.event_id) WHERE event_id > 0;

-- ============================================
-- 12. POST_LIKE (random likes for each post)
-- ============================================
INSERT INTO post_like (post_id, account_id, create_at) VALUES
-- Post 1: 5 likes
(1, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 8 DAY),
(1, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 8 DAY),
(1, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 7 DAY),
(1, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 7 DAY),
(1, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 6 DAY),
-- Post 2: 4 likes
(2, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 7 DAY),
(2, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 7 DAY),
(2, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 6 DAY),
(2, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 6 DAY),
-- Post 3: 6 likes
(3, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 6 DAY),
(3, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 6 DAY),
(3, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 5 DAY),
(3, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 5 DAY),
(3, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 5 DAY),
(3, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 5 DAY),
-- Post 4: 4 likes
(4, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 5 DAY),
(4, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 5 DAY),
(4, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 4 DAY),
(4, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 4 DAY),
-- Post 5: 5 likes
(5, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 13 DAY),
(5, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 13 DAY),
(5, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 12 DAY),
(5, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 12 DAY),
(5, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 11 DAY),
-- Post 6: 4 likes
(6, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 12 DAY),
(6, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 12 DAY),
(6, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 11 DAY),
(6, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 11 DAY),
-- Post 7: 3 likes
(7, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 11 DAY),
(7, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 10 DAY),
(7, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 10 DAY),
-- Post 8: 4 likes
(8, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 10 DAY),
(8, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 10 DAY),
(8, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 9 DAY),
(8, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 9 DAY),
-- Post 9: 5 likes
(9, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 18 DAY),
(9, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 18 DAY),
(9, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 17 DAY),
(9, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 17 DAY),
(9, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 16 DAY),
-- Post 10: 3 likes
(10, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 12 DAY),
(10, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 11 DAY),
(10, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 11 DAY),
-- Post 11: 4 likes
(11, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 9 DAY),
(11, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 9 DAY),
(11, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 8 DAY),
(11, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 8 DAY),
-- Post 12: 5 likes
(12, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 6 DAY),
(12, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 6 DAY),
(12, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 5 DAY),
(12, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 5 DAY),
(12, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 5 DAY),
-- Post 13: 4 likes
(13, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 5 DAY),
(13, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 5 DAY),
(13, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 4 DAY),
(13, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 4 DAY),
-- Post 14: 3 likes
(14, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 4 DAY),
(14, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 3 DAY),
(14, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 3 DAY),
-- Post 15: 4 likes
(15, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 27 DAY),
(15, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 27 DAY),
(15, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 26 DAY),
(15, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 26 DAY),
-- Post 16: 3 likes
(16, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 26 DAY),
(16, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 25 DAY),
(16, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 25 DAY),
-- Post 17: 5 likes
(17, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 25 DAY),
(17, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 25 DAY),
(17, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 24 DAY),
(17, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 24 DAY),
(17, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 24 DAY),
-- Post 18: 4 likes
(18, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 24 DAY),
(18, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 24 DAY),
(18, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 23 DAY),
(18, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 23 DAY),
-- Post 19: 3 likes
(19, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 23 DAY),
(19, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 23 DAY),
(19, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 22 DAY),
-- Post 20: 4 likes
(20, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 22 DAY),
(20, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 22 DAY),
(20, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 21 DAY),
(20, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 21 DAY),
-- Post 21: 3 likes
(21, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 21 DAY),
(21, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 20 DAY),
(21, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 20 DAY),
-- Post 22: 5 likes
(22, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 29 DAY),
(22, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 29 DAY),
(22, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 28 DAY),
(22, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 28 DAY),
(22, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 27 DAY),
-- Post 23: 3 likes
(23, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 28 DAY),
(23, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 27 DAY),
(23, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 27 DAY),
-- Post 24: 4 likes
(24, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 27 DAY),
(24, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 27 DAY),
(24, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 26 DAY),
(24, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 26 DAY),
-- Post 25: 3 likes
(25, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 26 DAY),
(25, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 25 DAY),
(25, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 25 DAY),
-- Post 26: 5 likes
(26, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 54 DAY),
(26, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 54 DAY),
(26, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 53 DAY),
(26, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 53 DAY),
(26, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 53 DAY),
-- Post 27: 4 likes
(27, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 47 DAY),
(27, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 47 DAY),
(27, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 46 DAY),
(27, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 46 DAY),
-- Post 28: 4 likes
(28, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 45 DAY),
(28, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 45 DAY),
(28, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 44 DAY),
(28, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 44 DAY),
-- Post 29: 5 likes
(29, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 39 DAY),
(29, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 39 DAY),
(29, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 38 DAY),
(29, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 38 DAY),
(29, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 37 DAY),
-- Post 30: 3 likes
(30, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 37 DAY),
(30, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 36 DAY),
(30, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 36 DAY),
-- Post 31: 4 likes
(31, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 34 DAY),
(31, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 34 DAY),
(31, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 33 DAY),
(31, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 33 DAY),
-- Post 32: 3 likes
(32, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 34 DAY),
(32, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 33 DAY),
(32, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 33 DAY),
-- Post 33: 4 likes
(33, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 31 DAY),
(33, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 31 DAY),
(33, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 30 DAY),
(33, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 30 DAY),
-- Post 34: 3 likes
(34, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 29 DAY),
(34, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 29 DAY),
(34, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 28 DAY),
-- Post 35: 5 likes
(35, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 19 DAY),
(35, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 19 DAY),
(35, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 18 DAY),
(35, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 18 DAY),
(35, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 17 DAY),
-- Post 36: 5 likes
(36, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 17 DAY),
(36, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 17 DAY),
(36, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 16 DAY),
(36, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 16 DAY),
(36, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 15 DAY),
-- Post 38: 4 likes
(38, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 11 DAY),
(38, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 11 DAY),
(38, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 10 DAY),
(38, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 10 DAY),
-- Post 39-53: Additional posts with 2-4 likes each
(39, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 4 DAY),
(39, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 4 DAY),
(39, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 3 DAY),
(40, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 4 DAY),
(40, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 4 DAY),
(40, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 3 DAY),
(40, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 3 DAY),
(41, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 3 DAY),
(41, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 3 DAY),
(41, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 2 DAY),
(42, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 3 DAY),
(42, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 2 DAY),
(42, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 2 DAY),
(43, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 3 DAY),
(43, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 2 DAY),
(43, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 2 DAY),
(44, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 2 DAY),
(44, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 2 DAY),
(44, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 2 DAY),
(45, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 2 DAY),
(45, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 2 DAY),
(45, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 1 DAY),
(46, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 2 DAY),
(46, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 2 DAY),
(46, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 1 DAY),
(46, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 1 DAY),
(47, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 1 DAY),
(47, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 1 DAY),
(48, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 1 DAY),
(48, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 1 DAY),
(48, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 1 DAY),
(49, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 1 DAY),
(49, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 1 DAY),
(49, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 1 DAY),
(50, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 23 HOUR),
(50, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 22 HOUR),
(51, 'c0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 22 HOUR),
(51, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 21 HOUR),
(51, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 20 HOUR),
(52, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 20 HOUR),
(52, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 19 HOUR),
(52, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 18 HOUR),
(52, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 18 HOUR),
(53, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 11 HOUR),
(53, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 10 HOUR),
(53, 'c0000001-0000-0000-0000-000000000007', NOW() - INTERVAL 10 HOUR),
(53, 'c0000001-0000-0000-0000-000000000008', NOW() - INTERVAL 9 HOUR);

-- ============================================
-- 13. FOLLOW_USER (random follows)
-- ============================================
INSERT INTO follow_user (account_id, followed_by_account_id) VALUES
('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001'),
('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002'),
('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003'),
('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001'),
('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000004'),
('b0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000002'),
('b0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000005'),
('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001'),
('c0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002'),
('c0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001'),
('c0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001'),
('c0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000005'),
('c0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000004'),
('c0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000001'),
('c0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000002');

-- ============================================
-- 14. NOTIFICATION
-- ============================================
INSERT INTO notification (sender_account_id, receiver_account_id, type, content, is_read, is_deleted, create_at) VALUES
('c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'NEW_FOLLOWER', 'user1 đã theo dõi bạn', true, false, NOW() - INTERVAL 30 DAY),
('c0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'POST_LIKE', 'user2 đã thích bài viết của bạn', true, false, NOW() - INTERVAL 8 DAY),
('c0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'POST_COMMENT', 'user1 đã bình luận bài viết của bạn', false, false, NOW() - INTERVAL 7 DAY),
('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'EVENT_JOIN_APPROVED', 'Bạn đã được chấp nhận tham gia sự kiện Hiến máu nhân đạo', true, false, NOW() - INTERVAL 8 DAY),
('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'EVENT_JOIN_APPROVED', 'Bạn đã được chấp nhận tham gia sự kiện Hiến máu nhân đạo', true, false, NOW() - INTERVAL 7 DAY),
('b0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000008', 'EVENT_JOIN_REJECTED', 'Yêu cầu tham gia sự kiện đã bị từ chối', true, false, NOW() - INTERVAL 7 DAY),
('a0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'SYSTEM_ANNOUNCEMENT', 'Chào mừng bạn đến với VolunteerHub!', true, false, NOW() - INTERVAL 90 DAY),
('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'COMMENT_REPLY', 'manager1 đã trả lời bình luận của bạn', false, false, NOW() - INTERVAL 7 DAY);

-- ============================================
-- 15. REQUEST (role upgrade requests)
-- ============================================
INSERT INTO request (account_id, status, reason, admin_response, created_at, updated_at) VALUES
('c0000001-0000-0000-0000-000000000001', 'WAITING', 'Em muốn trở thành quản lý để tổ chức các hoạt động tình nguyện tại trường đại học.', NULL, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),
('c0000001-0000-0000-0000-000000000002', 'WAITING', 'Em đã tham gia nhiều hoạt động và muốn đóng góp nhiều hơn.', NULL, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
('c0000001-0000-0000-0000-000000000003', 'APPROVED', 'Em có kinh nghiệm tổ chức sự kiện và muốn xin quyền Manager.', 'Đã duyệt. Chào mừng bạn trở thành Manager!', NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 18 DAY),
('c0000001-0000-0000-0000-000000000004', 'APPROVED', 'Em muốn tổ chức các hoạt động từ thiện cho cộng đồng.', 'Approved. Chúc bạn thành công!', NOW() - INTERVAL 25 DAY, NOW() - INTERVAL 22 DAY),
('c0000001-0000-0000-0000-000000000005', 'REJECTED', 'Xin nâng cấp tài khoản.', 'Vui lòng cung cấp thêm lý do chi tiết và kinh nghiệm của bạn.', NOW() - INTERVAL 15 DAY, NOW() - INTERVAL 14 DAY),
('c0000001-0000-0000-0000-000000000006', 'REJECTED', 'Muốn làm manager.', 'Bạn cần tham gia thêm hoạt động trước khi nâng cấp.', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 28 DAY);

-- ============================================
-- VERIFICATION QUERIES (run to verify data)
-- ============================================
-- SELECT 'Accounts' as entity, COUNT(*) as count FROM account
-- UNION ALL SELECT 'Events', COUNT(*) FROM event
-- UNION ALL SELECT 'EventUsers', COUNT(*) FROM event_user
-- UNION ALL SELECT 'Posts', COUNT(*) FROM post
-- UNION ALL SELECT 'Comments', COUNT(*) FROM comment
-- UNION ALL SELECT 'Media', COUNT(*) FROM media
-- UNION ALL SELECT 'EventLikes', COUNT(*) FROM event_like
-- UNION ALL SELECT 'PostLikes', COUNT(*) FROM post_like
-- UNION ALL SELECT 'Follows', COUNT(*) FROM follow_user
-- UNION ALL SELECT 'Notifications', COUNT(*) FROM notification
-- UNION ALL SELECT 'Requests', COUNT(*) FROM request;

SET FOREIGN_KEY_CHECKS = 1;
