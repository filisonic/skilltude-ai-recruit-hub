# Speaker Portal Database Schema

This document outlines the database schema required for the Speaker Portal feature, designed to work with Hostinger's MySQL/MariaDB database.

## Overview

The Speaker Portal consists of two main user types:
1. **Speakers** - Industry professionals who want to speak at colleges
2. **Institutions** - Colleges and universities looking for speakers

## Database Tables

### 1. speakers

Main table storing speaker information and profiles.

```sql
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
```

### 2. speaker_expertise

Stores speaker expertise areas (many-to-many relationship).

```sql
CREATE TABLE speaker_expertise (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    expertise_area VARCHAR(100) NOT NULL,
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_speaker_expertise (speaker_id, expertise_area),
    INDEX idx_expertise_area (expertise_area)
);
```

### 3. speaker_languages

Stores languages speakers can present in.

```sql
CREATE TABLE speaker_languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    proficiency ENUM('native', 'fluent', 'conversational') DEFAULT 'fluent',
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_speaker_language (speaker_id, language),
    INDEX idx_language (language)
);
```

### 4. speaker_topics

Stores speaking topics for each speaker.

```sql
CREATE TABLE speaker_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    topic VARCHAR(200) NOT NULL,
    description TEXT,
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    INDEX idx_speaker_id (speaker_id),
    INDEX idx_topic (topic)
);
```

### 5. speaker_availability

Stores speaker availability dates.

```sql
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
```

### 6. institutions

Stores information about colleges and universities.

```sql
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
```

### 7. speaking_requests

Stores requests from institutions to speakers.

```sql
CREATE TABLE speaking_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    
    -- Parties involved
    institution_id INT NOT NULL,
    speaker_id INT NOT NULL,
    
    -- Event details
    event_title VARCHAR(255) NOT NULL,
    event_description TEXT,
    requested_date DATE NOT NULL,
    requested_time_slot ENUM('morning', 'afternoon', 'evening', 'full-day') DEFAULT 'full-day',
    duration_minutes INT DEFAULT 60,
    audience_size INT,
    event_type ENUM('keynote', 'workshop', 'panel', 'career-talk', 'guest-lecture', 'other') NOT NULL,
    location_type ENUM('in-person', 'virtual', 'hybrid') NOT NULL,
    venue_details TEXT,
    
    -- Topic and requirements
    requested_topic VARCHAR(255),
    special_requirements TEXT,
    technical_requirements TEXT,
    
    -- Status and timeline
    status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    event_completed_at TIMESTAMP NULL,
    
    -- Notes
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
```

### 8. speaker_reviews

Stores reviews and ratings from institutions.

```sql
CREATE TABLE speaker_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    institution_id INT NOT NULL,
    speaking_request_id INT NOT NULL,
    
    -- Rating (1-5)
    overall_rating TINYINT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    content_quality TINYINT CHECK (content_quality >= 1 AND content_quality <= 5),
    presentation_skills TINYINT CHECK (presentation_skills >= 1 AND presentation_skills <= 5),
    engagement TINYINT CHECK (engagement >= 1 AND engagement <= 5),
    professionalism TINYINT CHECK (professionalism >= 1 AND professionalism <= 5),
    
    -- Review text
    review_title VARCHAR(255),
    review_text TEXT,
    would_recommend BOOLEAN DEFAULT TRUE,
    
    -- Metadata
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
```

### 9. speaker_documents

Stores uploaded documents (resumes, speaker reels, etc.).

```sql
CREATE TABLE speaker_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    speaker_id INT NOT NULL,
    document_type ENUM('resume', 'speaker-reel', 'testimonial', 'certification', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INT, -- in bytes
    mime_type VARCHAR(100),
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    INDEX idx_speaker_id (speaker_id),
    INDEX idx_document_type (document_type)
);
```

### 10. system_settings

Stores system-wide settings and configurations.

```sql
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
);
```

## Sample Data Inserts

### Expertise Areas
```sql
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES 
('expertise_areas', '["Artificial Intelligence", "Machine Learning", "Data Science", "Cybersecurity", "Web Development", "Mobile Development", "Cloud Computing", "DevOps", "Blockchain", "IoT", "UI/UX Design", "Product Management", "Digital Marketing", "Entrepreneurship", "Leadership", "Innovation", "Sustainability", "Finance", "Healthcare Tech", "EdTech"]', 'json', 'Available expertise areas for speakers');
```

### Languages
```sql
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES 
('available_languages', '["English", "Spanish", "French", "German", "Mandarin", "Hindi", "Arabic", "Portuguese", "Russian", "Japanese", "Korean", "Italian"]', 'json', 'Available languages for speakers');
```

## API Endpoints Structure

When implementing the backend (PHP/Node.js), consider these endpoint patterns:

### Public Endpoints
- `GET /api/speakers` - Get list of approved speakers with filters
- `GET /api/speakers/{id}` - Get speaker details
- `GET /api/expertise-areas` - Get available expertise areas
- `GET /api/languages` - Get available languages

### Speaker Endpoints (Authenticated)
- `POST /api/speakers/register` - Register new speaker
- `POST /api/speakers/login` - Speaker login
- `GET /api/speakers/profile` - Get own profile
- `PUT /api/speakers/profile` - Update profile
- `POST /api/speakers/availability` - Add availability dates
- `GET /api/speakers/requests` - Get speaking requests
- `PUT /api/speakers/requests/{id}` - Respond to request

### Institution Endpoints (Authenticated)
- `POST /api/institutions/register` - Register institution
- `POST /api/institutions/login` - Institution login
- `POST /api/speaking-requests` - Create speaking request
- `GET /api/speaking-requests` - Get own requests
- `POST /api/reviews` - Submit speaker review

## File Storage

For file uploads (profile images, documents), use:

1. **Local Storage**: Store in `uploads/speakers/{speaker_id}/` directory
2. **CDN/Cloud Storage**: Use services like AWS S3, Cloudinary, or similar
3. **Security**: Validate file types, scan for malware, limit file sizes

## Search and Filtering

Implement search functionality with:

1. **Full-text search** on speaker names, bios, companies
2. **Tag-based filtering** for expertise areas, topics
3. **Geographic filtering** by location
4. **Availability filtering** by date ranges
5. **Fee range filtering**

## Security Considerations

1. **Password hashing**: Use bcrypt or similar
2. **Input validation**: Sanitize all user inputs
3. **File uploads**: Validate file types and sizes
4. **Email verification**: Verify email addresses during registration
5. **Rate limiting**: Prevent spam and abuse
6. **SQL injection prevention**: Use prepared statements
7. **CSRF protection**: Implement CSRF tokens for forms

## Hostinger Integration

For Hostinger hosting:

1. **Database**: Use MySQL/MariaDB (included in most Hostinger plans)
2. **File storage**: Use local file system or integrate with cloud storage
3. **Email**: Use Hostinger's email service for notifications
4. **SSL**: Enable SSL certificate for secure data transmission
5. **Backups**: Set up regular database backups

## Migration Script

Create a migration script to set up the database:

```sql
-- Run this script to create all tables in order
-- Make sure to update foreign key constraints as needed

-- Create speakers table first (no dependencies)
-- Then create dependent tables in order
-- Add indexes for performance
-- Insert default system settings
```

This schema provides a robust foundation for the speaker portal with room for future enhancements like messaging systems, payment processing, calendar integrations, and analytics.