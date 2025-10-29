-- Speaker Portal Database Setup for MariaDB/MySQL
-- Run these commands in your phpMyAdmin SQL panel

-- 1. speakers table
CREATE TABLE speakers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    profile_image_url VARCHAR(500),
    
    job_title VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    years_experience ENUM('1-3', '4-7', '8-12', '13-20', '20+') NOT NULL,
    linkedin_url VARCHAR(500),
    website_url VARCHAR(500),
    
    fee_amount DECIMAL(10,2),
    fee_type ENUM('free', 'fixed', 'hourly', 'negotiable') DEFAULT 'negotiable',
    travel_preference ENUM('local', 'national', 'international') DEFAULT 'local',
    virtual_available BOOLEAN DEFAULT TRUE,
    speaking_experience TEXT,
    
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_talks INT DEFAULT 0,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_location (location),
    INDEX idx_fee_type (fee_type),
    INDEX idx_travel_preference (travel_preference),
    INDEX idx_virtual_available (virtual_available)
);

-- 2. speaker_expertise table
CREATE TABLE speaker_expertise (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    expertise_area VARCHAR(100) NOT NULL,
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_speaker_expertise (speaker_id, expertise_area),
    INDEX idx_expertise_area (expertise_area)
);

-- 3. speaker_languages table
CREATE TABLE speaker_languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    proficiency ENUM('native', 'fluent', 'conversational') DEFAULT 'fluent',
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_speaker_language (speaker_id, language),
    INDEX idx_language (language)
);

-- 4. speaker_topics table
CREATE TABLE speaker_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    topic VARCHAR(200) NOT NULL,
    description TEXT,
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    INDEX idx_speaker_id (speaker_id),
    INDEX idx_topic (topic)
);

-- 5. speaker_availability table
CREATE TABLE speaker_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    available_date DATE NOT NULL,
    time_slot ENUM('morning', 'afternoon', 'evening', 'full-day') DEFAULT 'full-day',
    is_booked BOOLEAN DEFAULT FALSE,
    notes TEXT,
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_speaker_date_slot (speaker_id, available_date, time_slot),
    INDEX idx_available_date (available_date),
    INDEX idx_is_booked (is_booked)
);

-- 6. institutions table
CREATE TABLE institutions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    type ENUM('university', 'college', 'community-college', 'technical-school', 'other') NOT NULL,
    location VARCHAR(255) NOT NULL,
    website_url VARCHAR(500),
    contact_person VARCHAR(200),
    contact_phone VARCHAR(20),
    
    status ENUM('pending', 'verified', 'suspended') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_location (location),
    INDEX idx_type (type)
);

-- 7. speaking_requests table
CREATE TABLE speaking_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    institution_id INT NOT NULL,
    speaker_id INT NOT NULL,
    
    event_title VARCHAR(255) NOT NULL,
    event_description TEXT,
    requested_date DATE NOT NULL,
    requested_time_slot ENUM('morning', 'afternoon', 'evening', 'full-day') DEFAULT 'full-day',
    duration_minutes INT DEFAULT 60,
    audience_size INT,
    event_type ENUM('keynote', 'workshop', 'panel', 'career-talk', 'guest-lecture', 'other') NOT NULL,
    location_type ENUM('in-person', 'virtual', 'hybrid') NOT NULL,
    venue_details TEXT,
    
    requested_topic VARCHAR(255),
    special_requirements TEXT,
    technical_requirements TEXT,
    
    status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    event_completed_at TIMESTAMP NULL,
    
    institution_notes TEXT,
    speaker_notes TEXT,
    admin_notes TEXT,
    
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_requested_date (requested_date),
    INDEX idx_institution_id (institution_id),
    INDEX idx_speaker_id (speaker_id)
);

-- 8. speaker_reviews table
CREATE TABLE speaker_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    institution_id INT NOT NULL,
    speaking_request_id INT NOT NULL,
    
    overall_rating TINYINT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    content_quality TINYINT CHECK (content_quality >= 1 AND content_quality <= 5),
    presentation_skills TINYINT CHECK (presentation_skills >= 1 AND presentation_skills <= 5),
    engagement TINYINT CHECK (engagement >= 1 AND engagement >= 5),
    professionalism TINYINT CHECK (professionalism >= 1 AND professionalism <= 5),
    
    review_title VARCHAR(255),
    review_text TEXT,
    would_recommend BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
    FOREIGN KEY (speaking_request_id) REFERENCES speaking_requests(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (speaking_request_id),
    INDEX idx_speaker_id (speaker_id),
    INDEX idx_overall_rating (overall_rating),
    INDEX idx_is_public (is_public)
);

-- 9. speaker_documents table
CREATE TABLE speaker_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    document_type ENUM('resume', 'speaker-reel', 'testimonial', 'certification', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    INDEX idx_speaker_id (speaker_id),
    INDEX idx_document_type (document_type)
);

-- 10. system_settings table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES 
('expertise_areas', '["Artificial Intelligence", "Machine Learning", "Data Science", "Cybersecurity", "Web Development", "Mobile Development", "Cloud Computing", "DevOps", "Blockchain", "IoT", "UI/UX Design", "Product Management", "Digital Marketing", "Entrepreneurship", "Leadership", "Innovation", "Sustainability", "Finance", "Healthcare Tech", "EdTech"]', 'json', 'Available expertise areas for speakers');

INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES 
('available_languages', '["English", "Spanish", "French", "German", "Mandarin", "Hindi", "Arabic", "Portuguese", "Russian", "Japanese", "Korean", "Italian"]', 'json', 'Available languages for speakers');

-- 11. admin_users table
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

-- 12. blog_articles table
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

-- 13. blog_categories table
CREATE TABLE blog_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug)
);

-- Insert default admin user (password: admin123 - change this!)
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