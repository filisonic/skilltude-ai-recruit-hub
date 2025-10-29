-- SkillTude Complete Database Schema
-- Includes: Admin System, Blog, CV Management, Job Listings, Speaker Portal
-- Compatible with MySQL 5.7+ and MariaDB 10.2+

-- =============================================================================
-- 1. ADMIN & USER MANAGEMENT
-- =============================================================================

-- Admin users table for backend management
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'admin', 'editor', 'hr_manager') DEFAULT 'editor',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- =============================================================================
-- 2. CV MANAGEMENT SYSTEM
-- =============================================================================

-- CV uploads from candidates
CREATE TABLE cv_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    
    -- Professional Information
    current_position VARCHAR(200),
    experience_years ENUM('0-1', '1-3', '3-5', '5-10', '10-15', '15+') NOT NULL,
    desired_salary_min DECIMAL(10,2),
    desired_salary_max DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    availability ENUM('immediate', '2-weeks', '1-month', '2-months', 'other') DEFAULT 'immediate',
    notice_period VARCHAR(100),
    
    -- Skills and Preferences
    skills JSON, -- Array of skills
    expertise_areas JSON, -- Array of expertise areas
    preferred_locations JSON, -- Array of preferred work locations
    remote_work_preference ENUM('remote-only', 'hybrid', 'office-only', 'flexible') DEFAULT 'flexible',
    
    -- CV File Information
    cv_filename VARCHAR(255) NOT NULL,
    cv_file_path VARCHAR(500) NOT NULL,
    cv_file_size INT, -- in bytes
    cv_mime_type VARCHAR(100),
    
    -- Additional Information
    cover_letter TEXT,
    additional_notes TEXT,
    
    -- Application Status
    status ENUM('new', 'reviewed', 'shortlisted', 'interviewed', 'hired', 'rejected') DEFAULT 'new',
    admin_notes TEXT,
    reviewed_by INT NULL,
    reviewed_at TIMESTAMP NULL,
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    source VARCHAR(100) DEFAULT 'website',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_experience_years (experience_years),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_reviewed_by (reviewed_by)
);

-- CV tags for categorization
CREATE TABLE cv_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cv_id INT NOT NULL,
    tag VARCHAR(100) NOT NULL,
    added_by INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cv_id) REFERENCES cv_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (added_by) REFERENCES admin_users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cv_tag (cv_id, tag),
    INDEX idx_tag (tag)
);

-- =============================================================================
-- 3. JOB LISTINGS MANAGEMENT
-- =============================================================================

-- Job postings created by admin
CREATE TABLE job_listings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Basic Job Information
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    company VARCHAR(200) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    job_type ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance') NOT NULL,
    work_arrangement ENUM('remote', 'hybrid', 'on-site') NOT NULL,
    
    -- Job Details
    description LONGTEXT NOT NULL,
    requirements LONGTEXT NOT NULL,
    responsibilities LONGTEXT NOT NULL,
    benefits TEXT,
    
    -- Compensation
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period ENUM('hourly', 'monthly', 'annually') DEFAULT 'annually',
    salary_negotiable BOOLEAN DEFAULT TRUE,
    
    -- Experience and Skills
    experience_level ENUM('entry', 'mid', 'senior', 'lead', 'executive') NOT NULL,
    experience_years_min INT DEFAULT 0,
    experience_years_max INT,
    required_skills JSON, -- Array of required skills
    preferred_skills JSON, -- Array of preferred skills
    education_level ENUM('high-school', 'associate', 'bachelor', 'master', 'phd', 'not-specified') DEFAULT 'not-specified',
    
    -- Application Information
    application_deadline DATE,
    application_email VARCHAR(255),
    application_url VARCHAR(500),
    application_instructions TEXT,
    
    -- Job Status and Metadata
    status ENUM('draft', 'published', 'paused', 'filled', 'expired', 'archived') DEFAULT 'draft',
    priority ENUM('normal', 'featured', 'urgent') DEFAULT 'normal',
    is_trending BOOLEAN DEFAULT FALSE,
    
    -- SEO and Marketing
    meta_description TEXT,
    featured_image_url VARCHAR(500),
    tags JSON, -- Array of tags for categorization
    
    -- Admin Information
    posted_by INT NOT NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Analytics
    views INT DEFAULT 0,
    applications_count INT DEFAULT 0,
    
    FOREIGN KEY (posted_by) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_company (company),
    INDEX idx_location (location),
    INDEX idx_job_type (job_type),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_experience_level (experience_level),
    INDEX idx_priority (priority),
    INDEX idx_is_trending (is_trending)
);

-- Job categories for organization
CREATE TABLE job_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- Icon name for UI
    color VARCHAR(7) DEFAULT '#3B82F6',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order)
);

-- Junction table for job-category relationships
CREATE TABLE job_category_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    category_id INT NOT NULL,
    
    FOREIGN KEY (job_id) REFERENCES job_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES job_categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_job_category (job_id, category_id)
);

-- Job applications tracking
CREATE TABLE job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    job_id INT NOT NULL,
    cv_id INT NULL, -- Link to CV submission if exists
    
    -- Applicant Information (if not from CV submission)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Application Details
    cover_letter TEXT,
    cv_filename VARCHAR(255),
    cv_file_path VARCHAR(500),
    additional_files JSON, -- Array of additional file paths
    
    -- Application Status
    status ENUM('applied', 'reviewed', 'screening', 'interview', 'offer', 'hired', 'rejected', 'withdrawn') DEFAULT 'applied',
    admin_notes TEXT,
    interview_scheduled_at TIMESTAMP NULL,
    
    -- Metadata
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reviewed_by INT NULL,
    reviewed_at TIMESTAMP NULL,
    
    FOREIGN KEY (job_id) REFERENCES job_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (cv_id) REFERENCES cv_submissions(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_job_id (job_id),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_applied_at (applied_at)
);

-- =============================================================================
-- 4. BLOG SYSTEM
-- =============================================================================

-- Blog articles
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

-- Blog categories
CREATE TABLE blog_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug)
);

-- =============================================================================
-- 5. SPEAKER PORTAL SYSTEM
-- =============================================================================

-- Speakers registration
CREATE TABLE speakers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    profile_image_url VARCHAR(500),
    
    -- Professional Information
    job_title VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    years_experience ENUM('1-3', '4-7', '8-12', '13-20', '20+') NOT NULL,
    linkedin_url VARCHAR(500),
    website_url VARCHAR(500),
    
    -- Speaking Information
    fee_amount DECIMAL(10,2),
    fee_type ENUM('free', 'fixed', 'hourly', 'negotiable') DEFAULT 'negotiable',
    travel_preference ENUM('local', 'national', 'international') DEFAULT 'local',
    virtual_available BOOLEAN DEFAULT TRUE,
    speaking_experience TEXT,
    
    -- Ratings and Reviews
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

-- Speaker expertise areas
CREATE TABLE speaker_expertise (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    expertise_area VARCHAR(100) NOT NULL,
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_speaker_expertise (speaker_id, expertise_area),
    INDEX idx_expertise_area (expertise_area)
);

-- Speaker languages
CREATE TABLE speaker_languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    proficiency ENUM('native', 'fluent', 'conversational') DEFAULT 'fluent',
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_speaker_language (speaker_id, language),
    INDEX idx_language (language)
);

-- Speaker topics
CREATE TABLE speaker_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    topic VARCHAR(200) NOT NULL,
    description TEXT,
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    INDEX idx_speaker_id (speaker_id),
    INDEX idx_topic (topic)
);

-- =============================================================================
-- 6. INSTITUTIONS (for speaker portal)
-- =============================================================================

-- Educational institutions
CREATE TABLE institutions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Institution Information
    type ENUM('university', 'college', 'community-college', 'technical-school', 'other') NOT NULL,
    location VARCHAR(255) NOT NULL,
    website_url VARCHAR(500),
    contact_person VARCHAR(200),
    contact_phone VARCHAR(20),
    
    -- Status
    status ENUM('pending', 'verified', 'suspended') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_location (location),
    INDEX idx_type (type)
);

-- =============================================================================
-- 7. SYSTEM SETTINGS & CONFIGURATION
-- =============================================================================

-- System-wide settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
);

-- =============================================================================
-- 8. INSERT DEFAULT DATA
-- =============================================================================

-- Insert default admin user (password: admin123 - CHANGE THIS!)
INSERT INTO admin_users (uuid, username, email, password_hash, first_name, last_name, role) VALUES 
(UUID(), 'admin', 'admin@skilltude.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'super_admin');

-- Insert HR Manager for CV and job management
INSERT INTO admin_users (uuid, username, email, password_hash, first_name, last_name, role) VALUES 
(UUID(), 'hr_manager', 'hr@skilltude.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'HR', 'Manager', 'hr_manager');

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES 
('AI Trends', 'ai-trends', 'Latest trends in artificial intelligence and machine learning', '#8B5CF6'),
('Career Advice', 'career-advice', 'Professional development and career guidance', '#10B981'),
('Industry Insights', 'industry-insights', 'Analysis and insights into tech industry trends', '#F59E0B'),
('Tech Hiring', 'tech-hiring', 'Best practices and strategies for technical recruitment', '#EF4444'),
('Workplace Culture', 'workplace-culture', 'Building positive and inclusive work environments', '#06B6D4'),
('Future of Work', 'future-of-work', 'Exploring the evolution of modern workplaces', '#84CC16');

-- Insert default job categories
INSERT INTO job_categories (name, slug, description, icon, color, sort_order) VALUES 
('Software Engineering', 'software-engineering', 'Full-stack development, backend, frontend positions', 'code', '#3B82F6', 1),
('Data & Analytics', 'data-analytics', 'Data science, analytics, and machine learning roles', 'chart-bar', '#8B5CF6', 2),
('Product & Design', 'product-design', 'Product management, UX/UI design, and research roles', 'design', '#10B981', 3),
('DevOps & Infrastructure', 'devops-infrastructure', 'Cloud, DevOps, and infrastructure engineering', 'server', '#F59E0B', 4),
('Cybersecurity', 'cybersecurity', 'Information security and cybersecurity positions', 'shield', '#EF4444', 5),
('Mobile Development', 'mobile-development', 'iOS, Android, and cross-platform development', 'mobile', '#06B6D4', 6),
('AI & Machine Learning', 'ai-machine-learning', 'Artificial intelligence and ML engineering roles', 'brain', '#84CC16', 7),
('Quality Assurance', 'quality-assurance', 'Software testing and quality assurance roles', 'check-circle', '#F97316', 8),
('Management & Leadership', 'management-leadership', 'Technical leadership and management positions', 'users', '#6366F1', 9),
('Sales & Marketing', 'sales-marketing', 'Technical sales, marketing, and business development', 'trending-up', '#EC4899', 10);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES 
('site_name', 'SkillTude', 'string', 'Website name'),
('site_email', 'careers@skilltude.com', 'string', 'Main contact email'),
('max_cv_file_size', '10485760', 'number', 'Maximum CV file size in bytes (10MB)'),
('allowed_cv_types', '["pdf", "doc", "docx"]', 'json', 'Allowed CV file types'),
('job_application_deadline_days', '30', 'number', 'Default job application deadline in days'),
('enable_speaker_portal', 'true', 'boolean', 'Enable speaker registration portal'),
('expertise_areas', '["Artificial Intelligence", "Machine Learning", "Data Science", "Cybersecurity", "Web Development", "Mobile Development", "Cloud Computing", "DevOps", "Blockchain", "IoT", "UI/UX Design", "Product Management", "Digital Marketing", "Entrepreneurship", "Leadership", "Innovation", "Sustainability", "Finance", "Healthcare Tech", "EdTech"]', 'json', 'Available expertise areas'),
('available_languages', '["English", "Spanish", "French", "German", "Mandarin", "Hindi", "Arabic", "Portuguese", "Russian", "Japanese", "Korean", "Italian"]', 'json', 'Available languages for speakers'),
('default_currency', 'USD', 'string', 'Default currency for salaries'),
('enable_salary_display', 'true', 'boolean', 'Show salary ranges in job listings');

-- =============================================================================
-- 9. SAMPLE DATA FOR TESTING
-- =============================================================================

-- Sample job listing
INSERT INTO job_listings (
    uuid, title, slug, company, location, job_type, work_arrangement,
    description, requirements, responsibilities, 
    salary_min, salary_max, experience_level, required_skills, status, posted_by, published_at
) VALUES (
    UUID(), 
    'Senior Full Stack Developer', 
    'senior-full-stack-developer',
    'TechFlow Solutions',
    'San Francisco, CA (Remote)',
    'full-time',
    'remote',
    'We are looking for an experienced Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
    'Bachelor''s degree in Computer Science or related field. 5+ years of experience in full-stack development. Strong knowledge of React, Node.js, and databases.',
    'Develop and maintain web applications. Collaborate with cross-functional teams. Write clean, maintainable code. Participate in code reviews.',
    120000,
    180000,
    'senior',
    '["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"]',
    'published',
    1,
    NOW()
);

-- Sample blog article
INSERT INTO blog_articles (
    uuid, title, slug, excerpt, content, category, tags, author_id, status, published_at
) VALUES (
    UUID(),
    'The Future of Remote Work in Tech',
    'future-remote-work-tech',
    'Exploring how remote work is reshaping the technology industry and what it means for developers and companies.',
    '# The Future of Remote Work in Tech\n\nRemote work has become a permanent fixture in the tech industry...',
    'Future of Work',
    '["remote work", "technology", "career", "trends"]',
    1,
    'published',
    NOW()
);