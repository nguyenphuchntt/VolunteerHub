-- Test data for VolunteerHub
-- Password for all accounts: "password123" (BCrypt encoded)
-- BCrypt hash: $2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O

-- ============================================
-- ACCOUNTS (10 users: 2 ADMIN, 3 MANAGER, 5 USER)
-- ============================================

INSERT IGNORE INTO account (account_id, username, password, email, account_status, role, create_at) VALUES
(UUID_TO_BIN('11111111-1111-1111-1111-111111111111'), 'admin1', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'admin1@volunteerhub.com', 'ACTIVE', 'ADMIN', NOW()),
(UUID_TO_BIN('22222222-2222-2222-2222-222222222222'), 'admin2', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'admin2@volunteerhub.com', 'ACTIVE', 'ADMIN', NOW()),
(UUID_TO_BIN('33333333-3333-3333-3333-333333333333'), 'manager1', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'manager1@volunteerhub.com', 'ACTIVE', 'MANAGER', NOW()),
(UUID_TO_BIN('44444444-4444-4444-4444-444444444444'), 'manager2', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'manager2@volunteerhub.com', 'ACTIVE', 'MANAGER', NOW()),
(UUID_TO_BIN('55555555-5555-5555-5555-555555555555'), 'manager3', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'manager3@volunteerhub.com', 'ACTIVE', 'MANAGER', NOW()),
(UUID_TO_BIN('66666666-6666-6666-6666-666666666666'), 'user1', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user1@volunteerhub.com', 'ACTIVE', 'USER', NOW()),
(UUID_TO_BIN('77777777-7777-7777-7777-777777777777'), 'user2', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user2@volunteerhub.com', 'ACTIVE', 'USER', NOW()),
(UUID_TO_BIN('88888888-8888-8888-8888-888888888888'), 'user3', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user3@volunteerhub.com', 'ACTIVE', 'USER', NOW()),
(UUID_TO_BIN('99999999-9999-9999-9999-999999999999'), 'user4', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user4@volunteerhub.com', 'ACTIVE', 'USER', NOW()),
(UUID_TO_BIN('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'user5', '$2a$10$.7IIaQnSdyX3Fp/YqgbI2ukptdgFjFKUEIL9VzG38MCDVvFMViZ0O', 'user5@volunteerhub.com', 'INACTIVE', 'USER', NOW());

-- ============================================
-- USER_INFO
-- ============================================

INSERT IGNORE INTO user_info (account_id, first_name, last_name, date_of_birth, country, city, address, organization) VALUES
(UUID_TO_BIN('11111111-1111-1111-1111-111111111111'), 'Admin', 'One', '1990-01-15', 'Vietnam', 'Hanoi', '123 Admin Street', 'VolunteerHub HQ'),
(UUID_TO_BIN('22222222-2222-2222-2222-222222222222'), 'Admin', 'Two', '1988-05-20', 'Vietnam', 'Ho Chi Minh', '456 Admin Ave', 'VolunteerHub HQ'),
(UUID_TO_BIN('33333333-3333-3333-3333-333333333333'), 'Manager', 'One', '1992-03-10', 'Vietnam', 'Hanoi', '789 Manager Rd', 'Green Earth NGO'),
(UUID_TO_BIN('44444444-4444-4444-4444-444444444444'), 'Manager', 'Two', '1991-07-25', 'Vietnam', 'Da Nang', '321 Manager Blvd', 'Youth Action'),
(UUID_TO_BIN('55555555-5555-5555-5555-555555555555'), 'Manager', 'Three', '1993-11-08', 'Vietnam', 'Hanoi', '654 Manager Lane', 'Community Care'),
(UUID_TO_BIN('66666666-6666-6666-6666-666666666666'), 'Nguyen', 'Van A', '1995-02-14', 'Vietnam', 'Hanoi', '111 User St', 'UET'),
(UUID_TO_BIN('77777777-7777-7777-7777-777777777777'), 'Tran', 'Thi B', '1996-08-30', 'Vietnam', 'Ho Chi Minh', '222 User Ave', 'FPT University'),
(UUID_TO_BIN('88888888-8888-8888-8888-888888888888'), 'Le', 'Van C', '1994-12-05', 'Vietnam', 'Da Nang', '333 User Rd', 'Freelancer'),
(UUID_TO_BIN('99999999-9999-9999-9999-999999999999'), 'Pham', 'Thi D', '1997-04-18', 'Vietnam', 'Hanoi', '444 User Blvd', 'NEU'),
(UUID_TO_BIN('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), 'Hoang', 'Van E', '1998-06-22', 'Vietnam', 'Hai Phong', '555 User Lane', 'Student');

-- ============================================
-- EVENTS (10 events with various statuses)
-- ============================================

INSERT IGNORE INTO event (title, description, category, location, status, create_at, start_at, end_at, attendee_count, like_count, created_by_account_id) VALUES
('Beach Cleanup Campaign', 'Join us to clean the beautiful beaches of Da Nang', 'Environment', 'My Khe Beach, Da Nang', 'SCHEDULED', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY), 25, 50, UUID_TO_BIN('33333333-3333-3333-3333-333333333333')),
('Blood Donation Drive', 'Annual blood donation event at National Hospital', 'Healthcare', 'Bach Mai Hospital, Hanoi', 'SCHEDULED', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), DATE_ADD(NOW(), INTERVAL 14 DAY), 100, 200, UUID_TO_BIN('44444444-4444-4444-4444-444444444444')),
('Tree Planting Day', 'Plant 1000 trees in the city park', 'Environment', 'Yen So Park, Hanoi', 'PENDING', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), 0, 15, UUID_TO_BIN('33333333-3333-3333-3333-333333333333')),
('Teach Kids English', 'Free English classes for underprivileged children', 'Education', 'Community Center, District 7, HCMC', 'STARTED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), 30, 75, UUID_TO_BIN('55555555-5555-5555-5555-555555555555')),
('Food Distribution', 'Distribute food packages to homeless people', 'Charity', 'District 1, Ho Chi Minh City', 'FINISHED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), 50, 120, UUID_TO_BIN('44444444-4444-4444-4444-444444444444')),
('Senior Care Visit', 'Visit and support elderly at nursing home', 'Healthcare', 'Thien An Nursing Home, Hanoi', 'SCHEDULED', NOW(), DATE_ADD(NOW(), INTERVAL 21 DAY), DATE_ADD(NOW(), INTERVAL 21 DAY), 15, 40, UUID_TO_BIN('33333333-3333-3333-3333-333333333333')),
('Coding Workshop', 'Free coding bootcamp for beginners', 'Education', 'UET, Hanoi', 'CANCELLED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), 0, 10, UUID_TO_BIN('55555555-5555-5555-5555-555555555555')),
('River Cleanup', 'Clean up To Lich River', 'Environment', 'To Lich River, Hanoi', 'SCHEDULED', NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 10 DAY), 40, 85, UUID_TO_BIN('33333333-3333-3333-3333-333333333333')),
('Charity Run 5K', 'Run for charity - all proceeds go to orphanages', 'Charity', 'Hoan Kiem Lake, Hanoi', 'SCHEDULED', NOW(), DATE_ADD(NOW(), INTERVAL 45 DAY), DATE_ADD(NOW(), INTERVAL 45 DAY), 200, 500, UUID_TO_BIN('44444444-4444-4444-4444-444444444444')),
('Animal Shelter Help', 'Help take care of rescued animals', 'Charity', 'Hanoi Pet Rescue Center', 'PENDING', NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), DATE_ADD(NOW(), INTERVAL 60 DAY), 0, 25, UUID_TO_BIN('55555555-5555-5555-5555-555555555555'));

-- ============================================
-- EVENT_USER (some registrations)
-- ============================================

INSERT IGNORE INTO event_user (account_id, event_id, registered_at, status, event_user_role) VALUES
(UUID_TO_BIN('66666666-6666-6666-6666-666666666666'), 1, NOW(), 'APPROVED', 'ATTENDEE'),
(UUID_TO_BIN('77777777-7777-7777-7777-777777777777'), 1, NOW(), 'APPROVED', 'ATTENDEE'),
(UUID_TO_BIN('88888888-8888-8888-8888-888888888888'), 1, NOW(), 'PENDING', 'ATTENDEE'),
(UUID_TO_BIN('66666666-6666-6666-6666-666666666666'), 2, NOW(), 'APPROVED', 'ATTENDEE'),
(UUID_TO_BIN('99999999-9999-9999-9999-999999999999'), 2, NOW(), 'APPROVED', 'ATTENDEE'),
(UUID_TO_BIN('77777777-7777-7777-7777-777777777777'), 4, NOW(), 'APPROVED', 'ATTENDEE'),
(UUID_TO_BIN('88888888-8888-8888-8888-888888888888'), 4, NOW(), 'APPROVED', 'ATTENDEE'),
(UUID_TO_BIN('33333333-3333-3333-3333-333333333333'), 1, NOW(), 'APPROVED', 'MANAGER'),
(UUID_TO_BIN('44444444-4444-4444-4444-444444444444'), 2, NOW(), 'APPROVED', 'MANAGER'),
(UUID_TO_BIN('55555555-5555-5555-5555-555555555555'), 4, NOW(), 'APPROVED', 'MANAGER');
