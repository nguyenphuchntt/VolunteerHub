-- ============================================
-- SEED DATA FOR VOLUNTEERHUB
-- Password: password123
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

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
(1, 'Dọn rác bãi biển Mỹ Khê', 'Hoạt động dọn vệ sinh và bảo vệ môi trường biển', 'Environment', 'Bãi biển Mỹ Khê, Đà Nẵng', 'PENDING', NOW() - INTERVAL 5 DAY, NOW() + INTERVAL 30 DAY, NOW() + INTERVAL 30 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000001'),
(2, 'Trồng cây xanh Sóc Sơn', 'Trồng 500 cây xanh tại khu vực đồi trọc', 'Environment', 'Sóc Sơn, Hà Nội', 'PENDING', NOW() - INTERVAL 3 DAY, NOW() + INTERVAL 45 DAY, NOW() + INTERVAL 45 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000002'),
(3, 'Quyên góp sách cho trẻ em vùng cao', 'Thu gom và tặng sách vở cho học sinh vùng cao', 'Education', 'Sapa, Lào Cai', 'PENDING', NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 60 DAY, NOW() + INTERVAL 62 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000003'),
-- SCHEDULED (4)
(4, 'Hiến máu nhân đạo', 'Chương trình hiến máu tình nguyện tại BV Bạch Mai', 'Healthcare', 'Bệnh viện Bạch Mai, Hà Nội', 'SCHEDULED', NOW() - INTERVAL 10 DAY, NOW() + INTERVAL 7 DAY, NOW() + INTERVAL 7 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000001'),
(5, 'Chạy bộ từ thiện 5K', 'Chạy bộ gây quỹ cho trẻ em mồ côi', 'Charity', 'Hồ Hoàn Kiếm, Hà Nội', 'SCHEDULED', NOW() - INTERVAL 15 DAY, NOW() + INTERVAL 14 DAY, NOW() + INTERVAL 14 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000002'),
(6, 'Dạy tiếng Anh miễn phí', 'Lớp học tiếng Anh cho trẻ em có hoàn cảnh khó khăn', 'Education', 'Nhà văn hóa Quận 7, HCM', 'SCHEDULED', NOW() - INTERVAL 20 DAY, NOW() + INTERVAL 21 DAY, NOW() + INTERVAL 90 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000003'),
(7, 'Phát cơm từ thiện', 'Phát cơm miễn phí cho người vô gia cư', 'Charity', 'Quận 1, HCM', 'SCHEDULED', NOW() - INTERVAL 8 DAY, NOW() + INTERVAL 3 DAY, NOW() + INTERVAL 3 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000004'),
(16, 'Phát khô gà', 'Phát khô gà miễn phí cho fan anh', 'Charity', 'Quận 3, HCM', 'SCHEDULED', NOW() - INTERVAL 8 DAY, NOW() + INTERVAL 3 DAY, NOW() + INTERVAL 3 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000004'),
-- STARTED (3)
(8, 'Thăm và tặng quà người già neo đơn', 'Thăm hỏi và tặng quà tại viện dưỡng lão', 'Healthcare', 'Viện dưỡng lão Thiên Ân, Hà Nội', 'STARTED', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 5 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000001'),
(9, 'Dọn vệ sinh sông Tô Lịch', 'Hoạt động làm sạch dòng sông ô nhiễm', 'Environment', 'Sông Tô Lịch, Hà Nội', 'STARTED', NOW() - INTERVAL 25 DAY, NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 7 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000005'),
(10, 'Xây nhà tình thương', 'Xây dựng nhà cho hộ nghèo tại Quảng Bình', 'Charity', 'Quảng Bình', 'STARTED', NOW() - INTERVAL 35 DAY, NOW() - INTERVAL 5 DAY, NOW() + INTERVAL 10 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000002'),
(17, 'Xây trường', 'Xây dựng trường học cho học sinh miền núi', 'Charity', 'Cao Bằng', 'STARTED', NOW() - INTERVAL 35 DAY, NOW() - INTERVAL 5 DAY, NOW() + INTERVAL 10 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000002'),
-- FINISHED (3)
(11, 'Cứu trợ lũ lụt miền Trung', 'Phát quà cứu trợ cho bà con vùng lũ', 'Charity', 'Quảng Trị', 'FINISHED', NOW() - INTERVAL 60 DAY, NOW() - INTERVAL 50 DAY, NOW() - INTERVAL 45 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000003'),
(12, 'Khám bệnh miễn phí', 'Chương trình khám bệnh từ thiện cho người nghèo', 'Healthcare', 'Bình Phước', 'FINISHED', NOW() - INTERVAL 45 DAY, NOW() - INTERVAL 35 DAY, NOW() - INTERVAL 33 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000004'),
(13, 'Trao học bổng cho sinh viên nghèo', 'Trao 50 suất học bổng cho SV có hoàn cảnh khó khăn', 'Education', 'ĐH Quốc Gia, HCM', 'FINISHED', NOW() - INTERVAL 40 DAY, NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000005'),
-- CANCELLED (2)
(14, 'Tình nguyện mùa hè xanh', 'Chương trình tình nguyện mùa hè (đã hủy do dịch)', 'Community', 'Nghệ An', 'CANCELLED', NOW() - INTERVAL 50 DAY, NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 10 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000001'),
(15, 'Hội chợ từ thiện', 'Hội chợ gây quỹ (đã hủy do thời tiết)', 'Charity', 'Công viên Thống Nhất, Hà Nội', 'CANCELLED', NOW() - INTERVAL 55 DAY, NOW() - INTERVAL 25 DAY, NOW() - INTERVAL 24 DAY, 0, 0, 'b0000001-0000-0000-0000-000000000002');

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
-- 8. POSTS (12 posts, linked to events)
-- ============================================
INSERT INTO post (post_id, post_type, event_id, created_by_account_id, create_at, content, status) VALUES
(1, 'EVENT', 4, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 9 DAY, 'Chuẩn bị cho chương trình hiến máu! Mọi người nhớ ăn uống đầy đủ trước khi đến nhé.', 'CREATED'),
(2, 'EVENT', 5, 'b0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 14 DAY, 'Chạy bộ 5K sắp diễn ra! Đăng ký ngay để cùng gây quỹ cho trẻ em mồ côi.', 'CREATED'),
(3, 'DISCUSSION', 6, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 13 DAY, 'Có ai biết lịch học tiếng Anh tuần này không ạ?', 'CREATED'),
(4, 'ANNOUNCEMENT', 8, 'b0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 28 DAY, 'Thông báo: Chương trình thăm viện dưỡng lão sẽ bắt đầu lúc 8h sáng!', 'CREATED'),
(5, 'EVENT', 9, 'b0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 24 DAY, 'Cập nhật tiến độ: Đã dọn được 500m bờ sông Tô Lịch!', 'CREATED'),
(6, 'DISCUSSION', 11, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 48 DAY, 'Cảm ơn mọi người đã tham gia cứu trợ lũ lụt. Rất ý nghĩa!', 'CREATED'),
(7, 'ARTICLE', NULL, 'b0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 20 DAY, 'Tình nguyện viên - Những người mang lại nụ cười cho cộng đồng.', 'CREATED'),
(8, 'DISCUSSION', 12, 'c0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 38 DAY, 'Chương trình khám bệnh quá tuyệt vời! Cảm ơn các bác sĩ.', 'CREATED'),
(9, 'EVENT', 10, 'b0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 30 DAY, 'Xây nhà tình thương - Ngôi nhà thứ 3 sắp hoàn thành!', 'CREATED'),
(10, 'ANNOUNCEMENT', 13, 'b0000001-0000-0000-0000-000000000005', NOW() - INTERVAL 32 DAY, 'Danh sách sinh viên nhận học bổng đã được công bố!', 'CREATED'),
(11, 'DISCUSSION', 4, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 7 DAY, 'Lần đầu hiến máu, hồi hộp quá!', 'CREATED'),
(12, 'ADVERTISEMENT', NULL, 'b0000001-0000-0000-0000-000000000004', NOW() - INTERVAL 15 DAY, 'Tuyển tình nguyện viên cho các hoạt động từ thiện năm 2024!', 'HIDDEN');

-- ============================================
-- 9. POST_MEDIA (images for posts)
-- ============================================
INSERT INTO post_media (media_id, post_id) VALUES
('d0000001-0000-0000-0000-000000000037', 1),
('d0000001-0000-0000-0000-000000000038', 2),
('d0000001-0000-0000-0000-000000000039', 4),
('d0000001-0000-0000-0000-000000000040', 5);

-- ============================================
-- 10. COMMENTS (10-12 per active post)
-- ============================================
INSERT INTO comment (comment_id, created_by_account_id, post_id, create_at, content, reply_to) VALUES
-- Post 1 comments
(1, 'c0000001-0000-0000-0000-000000000001', 1, NOW() - INTERVAL 8 DAY, 'Tuyệt vời! Em sẽ tham gia!', NULL),
(2, 'c0000001-0000-0000-0000-000000000002', 1, NOW() - INTERVAL 8 DAY, 'Đăng ký ở đâu ạ?', NULL),
(3, 'b0000001-0000-0000-0000-000000000001', 1, NOW() - INTERVAL 8 DAY, 'Đăng ký trên app nhé bạn!', 2),
(4, 'c0000001-0000-0000-0000-000000000003', 1, NOW() - INTERVAL 7 DAY, 'Có cần mang gì theo không ạ?', NULL),
(5, 'c0000001-0000-0000-0000-000000000004', 1, NOW() - INTERVAL 7 DAY, 'Địa điểm có xa không?', NULL),
(6, 'b0000001-0000-0000-0000-000000000001', 1, NOW() - INTERVAL 7 DAY, 'Chỉ cần mang CMND thôi bạn nhé!', 4),
(7, 'c0000001-0000-0000-0000-000000000005', 1, NOW() - INTERVAL 6 DAY, 'Cảm ơn admin!', 6),
(8, 'c0000001-0000-0000-0000-000000000006', 1, NOW() - INTERVAL 6 DAY, 'Rất mong được tham gia!', NULL),
(9, 'c0000001-0000-0000-0000-000000000007', 1, NOW() - INTERVAL 5 DAY, 'Đã đăng ký xong!', NULL),
(10, 'c0000001-0000-0000-0000-000000000008', 1, NOW() - INTERVAL 5 DAY, 'Hẹn gặp mọi người!', NULL),
-- Post 2 comments
(11, 'c0000001-0000-0000-0000-000000000001', 2, NOW() - INTERVAL 13 DAY, 'Chạy 5K có khó không ạ?', NULL),
(12, 'b0000001-0000-0000-0000-000000000002', 2, NOW() - INTERVAL 13 DAY, 'Không khó đâu, ai cũng có thể tham gia!', 11),
(13, 'c0000001-0000-0000-0000-000000000006', 2, NOW() - INTERVAL 12 DAY, 'Đã đăng ký!', NULL),
(14, 'c0000001-0000-0000-0000-000000000007', 2, NOW() - INTERVAL 12 DAY, 'Rất ý nghĩa!', NULL),
(15, 'c0000001-0000-0000-0000-000000000003', 2, NOW() - INTERVAL 11 DAY, 'Có phần thưởng không ạ?', NULL),
-- Post 3 comments
(16, 'b0000001-0000-0000-0000-000000000003', 3, NOW() - INTERVAL 12 DAY, 'Lịch học từ 9h-11h thứ 7 hàng tuần!', NULL),
(17, 'c0000001-0000-0000-0000-000000000002', 3, NOW() - INTERVAL 12 DAY, 'Cảm ơn!', 16),
(18, 'c0000001-0000-0000-0000-000000000004', 3, NOW() - INTERVAL 11 DAY, 'Có dạy online không?', NULL),
-- Post 4 comments
(19, 'c0000001-0000-0000-0000-000000000001', 4, NOW() - INTERVAL 27 DAY, 'Đã note lịch!', NULL),
(20, 'c0000001-0000-0000-0000-000000000002', 4, NOW() - INTERVAL 27 DAY, 'Mọi người nhớ đến sớm nhé!', NULL),
-- Post 6 comments
(21, 'c0000001-0000-0000-0000-000000000002', 6, NOW() - INTERVAL 47 DAY, 'Đúng vậy, rất xúc động!', NULL),
(22, 'c0000001-0000-0000-0000-000000000003', 6, NOW() - INTERVAL 47 DAY, 'Lần sau nhớ gọi em!', NULL),
(23, 'b0000001-0000-0000-0000-000000000003', 6, NOW() - INTERVAL 46 DAY, 'Cảm ơn tất cả mọi người!', NULL);

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
-- 12. POST_LIKE
-- ============================================
INSERT INTO post_like (post_id, account_id, create_at) VALUES
(1, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 8 DAY),
(1, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 7 DAY),
(1, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 6 DAY),
(2, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 13 DAY),
(2, 'c0000001-0000-0000-0000-000000000006', NOW() - INTERVAL 12 DAY),
(4, 'c0000001-0000-0000-0000-000000000001', NOW() - INTERVAL 27 DAY),
(4, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 26 DAY),
(6, 'c0000001-0000-0000-0000-000000000002', NOW() - INTERVAL 47 DAY),
(6, 'c0000001-0000-0000-0000-000000000003', NOW() - INTERVAL 46 DAY);

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
