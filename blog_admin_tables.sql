-- Blog and Admin System Tables
-- Run this separately if you only want to add blog functionality
-- OR run the complete database_setup.sql file for everything

-- 1. admin_users table
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- 2. blog_articles table
CREATE TABLE blog_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    featured_image_url VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    tags JSON,
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    views INT DEFAULT 0,
    
    FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_author_id (author_id)
);

-- 3. blog_categories table
CREATE TABLE blog_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug)
);

-- Insert default admin user (password: admin123 - CHANGE THIS!)
INSERT INTO admin_users (uuid, username, email, password_hash, first_name, last_name, role) VALUES 
(UUID(), 'admin', 'admin@skilltude.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'super_admin');

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES 
('AI Trends', 'ai-trends', 'Latest trends in artificial intelligence and machine learning', '#8B5CF6'),
('Career Advice', 'career-advice', 'Professional development and career guidance', '#10B981'),
('Industry Insights', 'industry-insights', 'Analysis and insights into tech industry trends', '#F59E0B'),
('Tech Hiring', 'tech-hiring', 'Best practices and strategies for technical recruitment', '#EF4444'),
('Workplace Culture', 'workplace-culture', 'Building positive and inclusive work environments', '#06B6D4'),
('Future of Work', 'future-of-work', 'Exploring the evolution of modern workplaces', '#84CC16');