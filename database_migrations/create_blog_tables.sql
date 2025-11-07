-- ============================================================================
-- Blog Database Tables Migration
-- ============================================================================
-- This script creates the necessary tables for the blog feature
-- Run this script in your MySQL database before using the blog feature
-- ============================================================================

-- Create admin_users table if it doesn't exist (for blog authors)
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) UNIQUE NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `role` ENUM('admin', 'editor', 'author') DEFAULT 'author',
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_login` DATETIME,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create blog_articles table
CREATE TABLE IF NOT EXISTS `blog_articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `excerpt` TEXT,
  `content` LONGTEXT NOT NULL,
  `featured_image_url` VARCHAR(500),
  `category` VARCHAR(100) NOT NULL,
  `tags` JSON,
  `author_id` INT,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `published_at` DATETIME,
  `views` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_status` (`status`),
  INDEX `idx_category` (`category`),
  INDEX `idx_published_at` (`published_at`),
  INDEX `idx_author_id` (`author_id`),
  FOREIGN KEY (`author_id`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL,
  FULLTEXT INDEX `idx_search` (`title`, `excerpt`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Insert Sample Data (Optional - for testing)
-- ============================================================================

-- Insert a default admin user (password: admin123)
-- Note: In production, use a secure password and hash it properly
INSERT IGNORE INTO `admin_users` (
  `uuid`, `email`, `password_hash`, `first_name`, `last_name`, `role`
) VALUES (
  UUID(),
  'admin@skilltude.com',
  '$2b$10$rKZqGxJxJxJxJxJxJxJxJeO', -- This is a placeholder, use proper bcrypt hash
  'Admin',
  'User',
  'admin'
);

-- Get the admin user ID for sample articles
SET @admin_id = (SELECT id FROM admin_users WHERE email = 'admin@skilltude.com' LIMIT 1);

-- Insert sample blog articles
INSERT IGNORE INTO `blog_articles` (
  `uuid`, `title`, `slug`, `excerpt`, `content`, `featured_image_url`, 
  `category`, `tags`, `author_id`, `status`, `published_at`
) VALUES
(
  UUID(),
  'Welcome to SkillTude Blog',
  'welcome-to-skilltude-blog',
  'Discover how SkillTude is revolutionizing recruitment with AI-powered solutions.',
  '# Welcome to SkillTude Blog\n\nWe are excited to launch our blog where we will share insights about recruitment, AI technology, and career development.\n\n## What to Expect\n\n- Industry insights\n- Recruitment best practices\n- Career advice\n- Technology updates\n\nStay tuned for more content!',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
  'Company News',
  '["announcement", "welcome", "blog"]',
  @admin_id,
  'published',
  NOW()
),
(
  UUID(),
  'The Future of AI in Recruitment',
  'future-of-ai-in-recruitment',
  'Explore how artificial intelligence is transforming the recruitment landscape.',
  '# The Future of AI in Recruitment\n\nArtificial Intelligence is revolutionizing how companies find and hire talent.\n\n## Key Benefits\n\n1. **Faster Screening**: AI can process thousands of CVs in minutes\n2. **Better Matching**: Advanced algorithms match candidates to roles\n3. **Reduced Bias**: AI helps eliminate unconscious bias\n4. **Improved Experience**: Candidates get faster responses\n\n## The Road Ahead\n\nAs AI technology continues to evolve, we can expect even more innovations in recruitment.',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
  'Technology',
  '["AI", "recruitment", "technology", "innovation"]',
  @admin_id,
  'published',
  NOW()
),
(
  UUID(),
  '10 Tips for Writing a Winning CV',
  '10-tips-for-winning-cv',
  'Learn how to create a CV that stands out and gets you noticed by recruiters.',
  '# 10 Tips for Writing a Winning CV\n\nYour CV is your first impression. Here are 10 tips to make it count:\n\n## 1. Keep it Concise\nAim for 2 pages maximum.\n\n## 2. Use Action Verbs\nStart bullet points with strong action verbs.\n\n## 3. Quantify Achievements\nUse numbers to demonstrate impact.\n\n## 4. Tailor to the Role\nCustomize your CV for each application.\n\n## 5. Highlight Key Skills\nMake your relevant skills easy to find.\n\n## 6. Use a Clean Format\nEnsure your CV is easy to read.\n\n## 7. Proofread Carefully\nEliminate all typos and errors.\n\n## 8. Include Keywords\nUse industry-specific keywords.\n\n## 9. Show Progression\nDemonstrate career growth.\n\n## 10. Keep it Current\nUpdate regularly with new achievements.',
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
  'Career',
  '["CV", "career", "tips", "job search"]',
  @admin_id,
  'published',
  NOW()
),
(
  UUID(),
  'Understanding the Modern Hiring Process',
  'understanding-modern-hiring-process',
  'A comprehensive guide to how companies hire in 2024.',
  '# Understanding the Modern Hiring Process\n\nThe hiring process has evolved significantly in recent years.\n\n## Typical Stages\n\n### 1. Application\nCandidates submit their CV and cover letter.\n\n### 2. Initial Screening\nRecruiters review applications.\n\n### 3. Phone Interview\nFirst conversation with the hiring team.\n\n### 4. Technical Assessment\nSkills testing or case studies.\n\n### 5. In-Person Interviews\nMeeting with team members.\n\n### 6. Final Decision\nOffer or rejection.\n\n## Tips for Success\n\n- Research the company\n- Prepare for common questions\n- Follow up after interviews\n- Be patient but proactive',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
  'Industry',
  '["hiring", "recruitment", "process", "guide"]',
  @admin_id,
  'published',
  NOW()
);

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Check if tables were created
SELECT 'Tables created successfully' AS status;

-- Count articles
SELECT COUNT(*) AS article_count FROM blog_articles;

-- Show sample articles
SELECT id, title, slug, category, status, published_at 
FROM blog_articles 
ORDER BY published_at DESC 
LIMIT 5;

-- ============================================================================
-- Done!
-- ============================================================================
