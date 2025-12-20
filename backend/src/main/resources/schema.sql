CREATE DATABASE IF NOT EXISTS volunteer_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE volunteer_hub;

CREATE TABLE IF NOT EXISTS account (
    account_id VARCHAR(36) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    account_status ENUM('ACTIVE', 'INACTIVE', 'BANNED') NOT NULL DEFAULT 'INACTIVE',
    role ENUM('ADMIN', 'MANAGER', 'USER') NOT NULL DEFAULT 'USER',
    create_at DATETIME(6) NOT NULL,
    PRIMARY KEY (account_id),
    UNIQUE KEY uk_account_username (username),
    UNIQUE KEY uk_account_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_info (
    account_id VARCHAR(36) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_birth DATE,
    country VARCHAR(255),
    city VARCHAR(255),
    address VARCHAR(255),
    organization VARCHAR(255),
    PRIMARY KEY (account_id),
    CONSTRAINT fk_user_info_account FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media (
    id VARCHAR(36) NOT NULL,
    url TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(255),
    mime_type VARCHAR(255),
    size_bytes INT,
    uploaded_at DATETIME(6),
    uploaded_by VARCHAR(36),
    PRIMARY KEY (id),
    CONSTRAINT fk_media_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES account(account_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS event (
    event_id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    category VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    status ENUM('PENDING', 'SCHEDULED', 'STARTED', 'FINISHED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    create_at DATETIME(6) NOT NULL,
    start_at DATETIME(6),
    end_at DATETIME(6),
    attendee_count INT NOT NULL DEFAULT 0,
    like_count INT NOT NULL DEFAULT 0,
    created_by_account_id VARCHAR(36) NULL,
    PRIMARY KEY (event_id),
    CONSTRAINT fk_event_created_by FOREIGN KEY (created_by_account_id) REFERENCES account(account_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS event_user (
    account_id VARCHAR(36) NOT NULL,
    event_id BIGINT NOT NULL,
    registered_at DATETIME(6),
    start_at DATETIME(6),
    end_at DATETIME(6),
    status ENUM('APPROVED', 'REJECTED', 'PENDING', 'FINISHED', 'UNFINISHED') NOT NULL DEFAULT 'PENDING',
    event_user_role ENUM('ATTENDEE', 'MANAGER') NOT NULL DEFAULT 'ATTENDEE',
    PRIMARY KEY (account_id, event_id),
    CONSTRAINT fk_event_user_account FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_event_user_event FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS event_like (
    account_id VARCHAR(36) NOT NULL,
    event_id BIGINT NOT NULL,
    create_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (account_id, event_id),
    CONSTRAINT fk_event_like_account FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_event_like_event FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post (
    post_id BIGINT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    post_type ENUM('DISCUSSION', 'ANNOUNCEMENT', 'ARTICLE', 'ADVERTISEMENT', 'EVENT') NOT NULL DEFAULT 'ARTICLE',
    status ENUM('CREATED', 'HIDDEN', 'DELETED') NOT NULL DEFAULT 'CREATED',
    create_at DATETIME(6) NOT NULL,
    event_id BIGINT,
    created_by_account_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (post_id),
    CONSTRAINT fk_post_event FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE SET NULL,
    CONSTRAINT fk_post_created_by FOREIGN KEY (created_by_account_id) REFERENCES account(account_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comment (
    comment_id BIGINT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    create_at DATETIME(6) NOT NULL,
    post_id BIGINT NOT NULL,
    created_by_account_id VARCHAR(36) NOT NULL,
    reply_to BIGINT,
    PRIMARY KEY (comment_id),
    CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_created_by FOREIGN KEY (created_by_account_id) REFERENCES account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_reply_to FOREIGN KEY (reply_to) REFERENCES comment(comment_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_like (
    account_id VARCHAR(36) NOT NULL,
    post_id BIGINT NOT NULL,
    create_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (post_id, account_id),
    CONSTRAINT fk_post_like_account FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_post_like_post FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notification (
    notification_id BIGINT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    type ENUM('POST_LIKE', 'POST_COMMENT', 'EVENT_START_REMINDER', 'EVENT_END_REMINDER', 'EVENT_JOIN_APPROVED', 'EVENT_JOIN_REJECTED', 'ROLE_REQUEST_APPROVED', 'ROLE_REQUEST_REJECTED', 'NEW_FOLLOWER', 'COMMENT_REPLY', 'OTHER', 'SYSTEM_ANNOUNCEMENT', 'NORMAL') NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    create_at DATETIME(6) NOT NULL,
    sender_account_id VARCHAR(36) NOT NULL,
    receiver_account_id VARCHAR(36) NOT NULL,
    destination_type VARCHAR(255),
    destination_id VARCHAR(255),
    PRIMARY KEY (notification_id),
    CONSTRAINT fk_notification_sender FOREIGN KEY (sender_account_id) REFERENCES account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_receiver FOREIGN KEY (receiver_account_id) REFERENCES account(account_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS follow_user (
    account_id VARCHAR(36) NOT NULL,
    followed_by_account_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (account_id, followed_by_account_id),
    CONSTRAINT fk_follow_user_account FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_follow_user_followed_by FOREIGN KEY (followed_by_account_id) REFERENCES account(account_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS account_media (
    account_id VARCHAR(36) NOT NULL,
    media_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (account_id, media_id),
    CONSTRAINT fk_account_media_account FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_account_media_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS event_media (
    event_id BIGINT NOT NULL,
    media_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (event_id, media_id),
    CONSTRAINT fk_event_media_event FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE,
    CONSTRAINT fk_event_media_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS post_media (
    post_id BIGINT NOT NULL,
    media_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (post_id, media_id),
    CONSTRAINT fk_post_media_post FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    CONSTRAINT fk_post_media_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS request (
    request_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id VARCHAR(36) NOT NULL,
    status ENUM('WAITING', 'APPROVED', 'REJECTED') DEFAULT 'WAITING',
    reason TEXT,
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_request_account FOREIGN KEY (account_id)
        REFERENCES account(account_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_event_created_by ON event(created_by_account_id);
CREATE INDEX idx_event_status ON event(status);
CREATE INDEX idx_event_user_event_id ON event_user(event_id);
CREATE INDEX idx_event_user_status ON event_user(status);
CREATE INDEX idx_post_event_id ON post(event_id);
CREATE INDEX idx_post_type ON post(post_type);
CREATE INDEX idx_post_status ON post(status);
CREATE INDEX idx_post_created_by ON post(created_by_account_id);
CREATE INDEX idx_comment_post_id ON comment(post_id);
CREATE INDEX idx_comment_created_by ON comment(created_by_account_id);
CREATE INDEX idx_notification_receiver_unread ON notification(receiver_account_id, is_read);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_media_file_type ON media(file_type);
CREATE INDEX idx_media_uploaded_at ON media(uploaded_at);
CREATE INDEX idx_account_media_media_id ON account_media(media_id);
CREATE INDEX idx_event_media_media_id ON event_media(media_id);
CREATE INDEX idx_post_media_media_id ON post_media(media_id);
