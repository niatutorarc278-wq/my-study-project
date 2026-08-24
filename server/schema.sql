-- MySQL DDL Schema for STUDY LMS Portal

CREATE DATABASE IF NOT EXISTS studylms_db;
USE studylms_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    avatar TEXT,
    joined_date VARCHAR(50),
    enrolled_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    phone VARCHAR(50),
    bio TEXT,
    referral_code VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    original_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    students_count INT DEFAULT 0,
    instructor VARCHAR(255),
    instructor_title VARCHAR(255),
    instructor_avatar TEXT,
    thumbnail TEXT,
    youtube_url TEXT,
    duration VARCHAR(100),
    lessons_count INT DEFAULT 0,
    level VARCHAR(50) DEFAULT 'All Levels',
    status VARCHAR(50) DEFAULT 'Published',
    enrolled TINYINT(1) DEFAULT 0,
    progress INT DEFAULT 0,
    last_accessed VARCHAR(100),
    badge VARCHAR(50),
    description TEXT,
    features JSON,
    curriculum JSON,
    units JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Units Table
CREATE TABLE IF NOT EXISTS units (
    id VARCHAR(100) PRIMARY KEY,
    course_id VARCHAR(100),
    unit_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
    id VARCHAR(100) PRIMARY KEY,
    unit_id VARCHAR(100),
    course_id VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    youtube_url TEXT,
    summary TEXT,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100),
    course_id VARCHAR(100),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INT DEFAULT 0,
    UNIQUE KEY user_course_unique (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Completed Chapters Tracking Table
CREATE TABLE IF NOT EXISTS completed_chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100),
    course_id VARCHAR(100),
    chapter_id VARCHAR(100) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_course_chapter_unique (user_id, course_id, chapter_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_spend DECIMAL(10, 2) DEFAULT 0.00,
    expiry_date VARCHAR(50),
    usage_limit INT DEFAULT 500,
    usage_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(100) PRIMARY KEY,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    course_title VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    coupon_code VARCHAR(100),
    date VARCHAR(100),
    payment_method VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(100) PRIMARY KEY,
    target VARCHAR(50) DEFAULT 'all',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'actions',
    type VARCHAR(50) DEFAULT 'info',
    time VARCHAR(50),
    `read` TINYINT(1) DEFAULT 0,
    timestamp BIGINT,
    link TEXT,
    action_label VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
    user_id VARCHAR(100) PRIMARY KEY,
    referral_code VARCHAR(100),
    referral_link TEXT,
    total_earned DECIMAL(10, 2) DEFAULT 0.00,
    pending_rewards DECIMAL(10, 2) DEFAULT 0.00,
    total_invites INT DEFAULT 0,
    successful_conversions INT DEFAULT 0,
    milestones JSON,
    invites_list JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
