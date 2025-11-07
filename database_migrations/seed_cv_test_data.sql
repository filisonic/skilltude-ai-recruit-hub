-- Seed Data: CV Analysis System Test Data
-- Date: 2024-12-25
-- Description: Creates sample CV submission records with various statuses for testing admin dashboard

-- Note: This seed data is for development/testing purposes only
-- Run this after applying the add_cv_analysis_columns migration

-- =============================================================================
-- SAMPLE CV SUBMISSIONS WITH VARIOUS STATUSES
-- =============================================================================

-- 1. New submission - High quality CV, not yet reviewed
INSERT INTO cv_submissions (
    uuid, first_name, last_name, email, phone, location,
    current_position, experience_years, skills, expertise_areas,
    remote_work_preference, cv_filename, cv_file_path, cv_file_size, cv_mime_type,
    status, analysis_score, analysis_results, email_sent_at,
    ip_address, user_agent, source, submitted_at
) VALUES (
    UUID(),
    'Sarah',
    'Johnson',
    'sarah.johnson@email.com',
    '+1-555-0101',
    'San Francisco, CA',
    'Senior Software Engineer',
    '5-10',
    '["JavaScript", "React", "Node.js", "TypeScript", "AWS", "Docker"]',
    '["Web Development", "Cloud Computing", "DevOps"]',
    'hybrid',
    'sarah-johnson-cv.pdf',
    '/uploads/cvs/2024/12/a1b2c3d4-e5f6-7890-abcd-ef1234567890-sarah-johnson-cv.pdf',
    245678,
    'application/pdf',
    'new',
    87,
    JSON_OBJECT(
        'overallScore', 87,
        'atsCompatibility', 90,
        'strengths', JSON_ARRAY(
            'Clear contact information with professional email',
            'Strong action verbs used throughout experience section',
            'Quantifiable achievements with specific metrics',
            'Well-structured sections with consistent formatting',
            'Relevant technical skills prominently displayed'
        ),
        'improvements', JSON_ARRAY(
            JSON_OBJECT(
                'category', 'Professional Summary',
                'priority', 'medium',
                'issue', 'Summary could be more impactful',
                'suggestion', 'Consider adding specific achievements and years of experience in the opening statement'
            ),
            JSON_OBJECT(
                'category', 'Keywords',
                'priority', 'low',
                'issue', 'Could include more industry-specific keywords',
                'suggestion', 'Add keywords like "Agile", "CI/CD", "Microservices" to improve ATS matching'
            )
        ),
        'sectionCompleteness', JSON_OBJECT(
            'contactInfo', true,
            'summary', true,
            'experience', true,
            'education', true,
            'skills', true
        ),
        'analyzedAt', NOW()
    ),
    NOW(),
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'website',
    DATE_SUB(NOW(), INTERVAL 2 HOUR)
);

-- 2. Reviewed submission - Average CV, email sent
INSERT INTO cv_submissions (
    uuid, first_name, last_name, email, phone, location,
    current_position, experience_years, skills, expertise_areas,
    remote_work_preference, cv_filename, cv_file_path, cv_file_size, cv_mime_type,
    status, analysis_score, analysis_results, email_sent_at, reviewed_by, reviewed_at,
    admin_notes, ip_address, user_agent, source, submitted_at
) VALUES (
    UUID(),
    'Michael',
    'Chen',
    'michael.chen@email.com',
    '+1-555-0102',
    'New York, NY',
    'Data Analyst',
    '3-5',
    '["Python", "SQL", "Tableau", "Excel", "Power BI"]',
    '["Data Science", "Analytics"]',
    'remote-only',
    'michael-chen-cv.pdf',
    '/uploads/cvs/2024/12/b2c3d4e5-f6g7-8901-bcde-fg2345678901-michael-chen-cv.pdf',
    198432,
    'application/pdf',
    'reviewed',
    68,
    JSON_OBJECT(
        'overallScore', 68,
        'atsCompatibility', 65,
        'strengths', JSON_ARRAY(
            'Good technical skills section',
            'Education clearly listed',
            'Contact information complete'
        ),
        'improvements', JSON_ARRAY(
            JSON_OBJECT(
                'category', 'Experience Section',
                'priority', 'high',
                'issue', 'Lacks quantifiable achievements',
                'suggestion', 'Add specific metrics and results to your work experience'
            )
        ),
        'sectionCompleteness', JSON_OBJECT(
            'contactInfo', true,
            'summary', false,
            'experience', true,
            'education', true,
            'skills', true
        ),
        'analyzedAt', DATE_SUB(NOW(), INTERVAL 1 DAY)
    ),
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    2,
    DATE_SUB(NOW(), INTERVAL 12 HOUR),
    'Good candidate for junior data analyst positions.',
    '192.168.1.101',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'website',
    DATE_SUB(NOW(), INTERVAL 1 DAY)
);

-- 3. Low score submission - Needs improvement
INSERT INTO cv_submissions (
    uuid, first_name, last_name, email, phone, location,
    current_position, experience_years, skills, expertise_areas,
    remote_work_preference, cv_filename, cv_file_path, cv_file_size, cv_mime_type,
    status, analysis_score, analysis_results, email_sent_at, email_opened_at,
    reviewed_by, reviewed_at, admin_notes, ip_address, user_agent, source, submitted_at
) VALUES (
    UUID(),
    'Emily',
    'Rodriguez',
    'emily.rodriguez@email.com',
    '+1-555-0103',
    'Austin, TX',
    'Junior Developer',
    '1-3',
    '["HTML", "CSS", "JavaScript", "Git"]',
    '["Web Development"]',
    'flexible',
    'emily-rodriguez-cv.docx',
    '/uploads/cvs/2024/12/c3d4e5f6-g7h8-9012-cdef-gh3456789012-emily-rodriguez-cv.docx',
    156789,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'reviewed',
    45,
    JSON_OBJECT(
        'overallScore', 45,
        'atsCompatibility', 40,
        'strengths', JSON_ARRAY(
            'Shows enthusiasm and willingness to learn',
            'Basic technical skills listed'
        ),
        'improvements', JSON_ARRAY(
            JSON_OBJECT(
                'category', 'Professional Summary',
                'priority', 'high',
                'issue', 'No professional summary or objective',
                'suggestion', 'Add a clear career objective at the beginning'
            ),
            JSON_OBJECT(
                'category', 'Experience Section',
                'priority', 'high',
                'issue', 'Very limited work experience details',
                'suggestion', 'Expand on your projects and internships with specific responsibilities'
            )
        ),
        'sectionCompleteness', JSON_OBJECT(
            'contactInfo', true,
            'summary', false,
            'experience', true,
            'education', true,
            'skills', true
        ),
        'analyzedAt', DATE_SUB(NOW(), INTERVAL 3 DAY)
    ),
    DATE_SUB(NOW(), INTERVAL 3 DAY),
    DATE_SUB(NOW(), INTERVAL 2 DAY),
    2,
    DATE_SUB(NOW(), INTERVAL 2 DAY),
    'Contacted about premium CV rewrite service.',
    '192.168.1.102',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'website',
    DATE_SUB(NOW(), INTERVAL 3 DAY)
);

-- 4. Converted to premium - High score, successful conversion
INSERT INTO cv_submissions (
    uuid, first_name, last_name, email, phone, location, linkedin_url,
    current_position, experience_years, skills, expertise_areas,
    remote_work_preference, cv_filename, cv_file_path, cv_file_size, cv_mime_type,
    status, analysis_score, analysis_results, email_sent_at, email_opened_at,
    converted_to_premium, conversion_date, reviewed_by, reviewed_at,
    admin_notes, ip_address, user_agent, source, submitted_at
) VALUES (
    UUID(),
    'David',
    'Thompson',
    'david.thompson@email.com',
    '+1-555-0104',
    'Seattle, WA',
    'https://linkedin.com/in/davidthompson',
    'Product Manager',
    '5-10',
    '["Product Strategy", "Agile", "Roadmapping", "User Research", "Data Analysis"]',
    '["Product Management", "Leadership"]',
    'hybrid',
    'david-thompson-cv.pdf',
    '/uploads/cvs/2024/12/d4e5f6g7-h8i9-0123-defg-hi4567890123-david-thompson-cv.pdf',
    312456,
    'application/pdf',
    'shortlisted',
    82,
    JSON_OBJECT(
        'overallScore', 82,
        'atsCompatibility', 85,
        'strengths', JSON_ARRAY(
            'Strong quantifiable achievements throughout',
            'Clear career progression demonstrated',
            'Excellent use of action verbs',
            'Well-organized sections'
        ),
        'improvements', JSON_ARRAY(
            JSON_OBJECT(
                'category', 'Keywords',
                'priority', 'medium',
                'issue', 'Could optimize for specific product management keywords',
                'suggestion', 'Include terms like "OKRs", "Product-Market Fit" for better ATS matching'
            )
        ),
        'sectionCompleteness', JSON_OBJECT(
            'contactInfo', true,
            'summary', true,
            'experience', true,
            'education', true,
            'skills', true
        ),
        'analyzedAt', DATE_SUB(NOW(), INTERVAL 5 DAY)
    ),
    DATE_SUB(NOW(), INTERVAL 5 DAY),
    DATE_SUB(NOW(), INTERVAL 4 DAY),
    true,
    DATE_SUB(NOW(), INTERVAL 3 DAY),
    2,
    DATE_SUB(NOW(), INTERVAL 4 DAY),
    'Purchased premium CV optimization service. Client very satisfied.',
    '192.168.1.103',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'website',
    DATE_SUB(NOW(), INTERVAL 5 DAY)
);

-- 5. Rejected submission - Spam
INSERT INTO cv_submissions (
    uuid, first_name, last_name, email, phone,
    experience_years, cv_filename, cv_file_path, cv_file_size, cv_mime_type,
    status, reviewed_by, reviewed_at, admin_notes,
    ip_address, user_agent, source, submitted_at
) VALUES (
    UUID(),
    'Test',
    'User',
    'test@test.com',
    '555-0000',
    '0-1',
    'test-file.pdf',
    '/uploads/cvs/2024/12/e5f6g7h8-i9j0-1234-efgh-ij5678901234-test-file.pdf',
    12345,
    'application/pdf',
    'rejected',
    1,
    DATE_SUB(NOW(), INTERVAL 7 DAY),
    'Spam submission. No valid content.',
    '192.168.1.104',
    'Mozilla/5.0',
    'website',
    DATE_SUB(NOW(), INTERVAL 7 DAY)
);

-- 6. New submission - Mid-level score
INSERT INTO cv_submissions (
    uuid, first_name, last_name, email, phone, location,
    current_position, experience_years, skills, expertise_areas,
    remote_work_preference, cv_filename, cv_file_path, cv_file_size, cv_mime_type,
    status, analysis_score, analysis_results,
    ip_address, user_agent, source, submitted_at
) VALUES (
    UUID(),
    'Jessica',
    'Martinez',
    'jessica.martinez@email.com',
    '+1-555-0105',
    'Chicago, IL',
    'UX Designer',
    '3-5',
    '["Figma", "Sketch", "Adobe XD", "User Research", "Prototyping"]',
    '["UI/UX Design", "Product Management"]',
    'remote-only',
    'jessica-martinez-cv.pdf',
    '/uploads/cvs/2024/12/f6g7h8i9-j0k1-2345-fghi-jk6789012345-jessica-martinez-cv.pdf',
    278901,
    'application/pdf',
    'new',
    73,
    JSON_OBJECT(
        'overallScore', 73,
        'atsCompatibility', 75,
        'strengths', JSON_ARRAY(
            'Portfolio link included',
            'Good balance of technical and soft skills',
            'Clear project descriptions'
        ),
        'improvements', JSON_ARRAY(
            JSON_OBJECT(
                'category', 'Experience Section',
                'priority', 'medium',
                'issue', 'Could add more quantifiable results',
                'suggestion', 'Include metrics like "Increased user engagement by 25%"'
            )
        ),
        'sectionCompleteness', JSON_OBJECT(
            'contactInfo', true,
            'summary', true,
            'experience', true,
            'education', true,
            'skills', true
        ),
        'analyzedAt', DATE_SUB(NOW(), INTERVAL 6 HOUR)
    ),
    '192.168.1.105',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'website',
    DATE_SUB(NOW(), INTERVAL 6 HOUR)
);

-- 7. Excellent CV - Converted to premium
INSERT INTO cv_submissions (
    uuid, first_name, last_name, email, phone, location, linkedin_url, portfolio_url,
    current_position, experience_years, skills, expertise_areas,
    remote_work_preference, cv_filename, cv_file_path, cv_file_size, cv_mime_type,
    status, analysis_score, analysis_results, email_sent_at, email_opened_at,
    converted_to_premium, conversion_date, reviewed_by, reviewed_at,
    admin_notes, ip_address, user_agent, source, submitted_at
) VALUES (
    UUID(),
    'Alex',
    'Kumar',
    'alex.kumar@email.com',
    '+1-555-0106',
    'Boston, MA',
    'https://linkedin.com/in/alexkumar',
    'https://alexkumar.dev',
    'Senior DevOps Engineer',
    '5-10',
    '["Kubernetes", "Docker", "AWS", "Terraform", "Jenkins", "Python", "Go"]',
    '["DevOps", "Cloud Computing", "Infrastructure"]',
    'remote-only',
    'alex-kumar-cv.pdf',
    '/uploads/cvs/2024/12/g7h8i9j0-k1l2-3456-ghij-kl7890123456-alex-kumar-cv.pdf',
    289543,
    'application/pdf',
    'shortlisted',
    91,
    JSON_OBJECT(
        'overallScore', 91,
        'atsCompatibility', 95,
        'strengths', JSON_ARRAY(
            'Exceptional technical depth and breadth',
            'Outstanding quantifiable achievements',
            'Perfect ATS-friendly formatting',
            'Strong action verbs and industry keywords'
        ),
        'improvements', JSON_ARRAY(
            JSON_OBJECT(
                'category', 'Minor Enhancement',
                'priority', 'low',
                'issue', 'Already excellent',
                'suggestion', 'Consider adding soft skills like team leadership in summary'
            )
        ),
        'sectionCompleteness', JSON_OBJECT(
            'contactInfo', true,
            'summary', true,
            'experience', true,
            'education', true,
            'skills', true
        ),
        'analyzedAt', DATE_SUB(NOW(), INTERVAL 4 DAY)
    ),
    DATE_SUB(NOW(), INTERVAL 4 DAY),
    DATE_SUB(NOW(), INTERVAL 3 DAY),
    true,
    DATE_SUB(NOW(), INTERVAL 2 DAY),
    2,
    DATE_SUB(NOW(), INTERVAL 3 DAY),
    'Purchased premium service for executive-level CV.',
    '192.168.1.106',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'website',
    DATE_SUB(NOW(), INTERVAL 4 DAY)
);

-- 8. Interviewed submission
INSERT INTO cv_submissions (
    uuid, first_name, last_name, email, phone, location,
    current_position, experience_years, skills, expertise_areas,
    remote_work_preference, cv_filename, cv_file_path, cv_file_size, cv_mime_type,
    status, analysis_score, analysis_results, email_sent_at, email_opened_at,
    reviewed_by, reviewed_at, admin_notes,
    ip_address, user_agent, source, submitted_at
) VALUES (
    UUID(),
    'Rachel',
    'Williams',
    'rachel.williams@email.com',
    '+1-555-0107',
    'Denver, CO',
    'Marketing Manager',
    '5-10',
    '["Digital Marketing", "SEO", "Content Strategy", "Analytics"]',
    '["Digital Marketing", "Leadership"]',
    'hybrid',
    'rachel-williams-cv.pdf',
    '/uploads/cvs/2024/12/h8i9j0k1-l2m3-4567-hijk-lm8901234567-rachel-williams-cv.pdf',
    234567,
    'application/pdf',
    'interviewed',
    79,
    JSON_OBJECT(
        'overallScore', 79,
        'atsCompatibility', 80,
        'strengths', JSON_ARRAY(
            'Strong marketing metrics and ROI examples',
            'Good mix of strategic and tactical skills',
            'Clear leadership experience'
        ),
        'improvements', JSON_ARRAY(
            JSON_OBJECT(
                'category', 'Experience Section',
                'priority', 'medium',
                'issue', 'Some achievements could be more specific',
                'suggestion', 'Add more specific campaign names and detailed results'
            )
        ),
        'sectionCompleteness', JSON_OBJECT(
            'contactInfo', true,
            'summary', true,
            'experience', true,
            'education', true,
            'skills', true
        ),
        'analyzedAt', DATE_SUB(NOW(), INTERVAL 6 DAY)
    ),
    DATE_SUB(NOW(), INTERVAL 6 DAY),
    DATE_SUB(NOW(), INTERVAL 5 DAY),
    2,
    DATE_SUB(NOW(), INTERVAL 5 DAY),
    'Scheduled for second interview. Strong candidate.',
    '192.168.1.107',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'website',
    DATE_SUB(NOW(), INTERVAL 6 DAY)
);

-- 9. Recent graduate
INSERT INTO cv_submissions (
    uuid, first_name, last_name, email, phone, location,
    current_position, experience_years, skills, expertise_areas,
    remote_work_preference, cv_filename, cv_file_path, cv_file_size, cv_mime_type,
    status, analysis_score, analysis_results,
    ip_address, user_agent, source, submitted_at
) VALUES (
    UUID(),
    'Tom',
    'Anderson',
    'tom.anderson@email.com',
    '+1-555-0108',
    'Portland, OR',
    'Recent Graduate',
    '0-1',
    '["Java", "Python", "C++", "SQL", "Git"]',
    '["Software Engineering"]',
    'flexible',
    'tom-anderson-cv.pdf',
    '/uploads/cvs/2024/12/i9j0k1l2-m3n4-5678-ijkl-mn9012345678-tom-anderson-cv.pdf',
    167890,
    'application/pdf',
    'new',
    58,
    JSON_OBJECT(
        'overallScore', 58,
        'atsCompatibility', 55,
        'strengths', JSON_ARRAY(
            'Strong educational background',
            'Good foundation in programming languages'
        ),
        'improvements', JSON_ARRAY(
            JSON_OBJECT(
                'category', 'Professional Summary',
                'priority', 'high',
                'issue', 'Missing career objective',
                'suggestion', 'Add a clear objective statement highlighting your career goals'
            ),
            JSON_OBJECT(
                'category', 'Projects',
                'priority', 'high',
                'issue', 'Projects section needs more detail',
                'suggestion', 'Include technologies used, your role, and measurable results'
            )
        ),
        'sectionCompleteness', JSON_OBJECT(
            'contactInfo', true,
            'summary', false,
            'experience', true,
            'education', true,
            'skills', true
        ),
        'analyzedAt', DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ),
    '192.168.1.108',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'website',
    DATE_SUB(NOW(), INTERVAL 1 HOUR)
);

-- 10. Career changer
INSERT INTO cv_submissions (
    uuid, first_name, last_name, email, phone, location,
    current_position, experience_years, skills, expertise_areas,
    remote_work_preference, cv_filename, cv_file_path, cv_file_size, cv_mime_type,
    status, analysis_score, analysis_results, email_sent_at,
    reviewed_by, reviewed_at, admin_notes,
    ip_address, user_agent, source, submitted_at
) VALUES (
    UUID(),
    'Linda',
    'Brown',
    'linda.brown@email.com',
    '+1-555-0109',
    'Miami, FL',
    'Career Transition - Tech Sales',
    '5-10',
    '["Sales", "CRM", "Salesforce", "Negotiation", "Client Relations"]',
    '["Sales & Marketing", "Leadership"]',
    'hybrid',
    'linda-brown-cv.pdf',
    '/uploads/cvs/2024/12/j0k1l2m3-n4o5-6789-jklm-no0123456789-linda-brown-cv.pdf',
    223456,
    'application/pdf',
    'reviewed',
    71,
    JSON_OBJECT(
        'overallScore', 71,
        'atsCompatibility', 70,
        'strengths', JSON_ARRAY(
            'Strong sales track record with numbers',
            'Good transferable skills highlighted',
            'Clear career transition narrative'
        ),
        'improvements', JSON_ARRAY(
            JSON_OBJECT(
                'category', 'Technical Skills',
                'priority', 'high',
                'issue', 'Limited technical knowledge shown',
                'suggestion', 'Add technical certifications or courses to strengthen tech credibility'
            )
        ),
        'sectionCompleteness', JSON_OBJECT(
            'contactInfo', true,
            'summary', true,
            'experience', true,
            'education', true,
            'skills', true
        ),
        'analyzedAt', DATE_SUB(NOW(), INTERVAL 2 DAY)
    ),
    DATE_SUB(NOW(), INTERVAL 2 DAY),
    2,
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    'Career transition candidate. Follow up in 2 weeks.',
    '192.168.1.109',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'website',
    DATE_SUB(NOW(), INTERVAL 2 DAY)
);

-- =============================================================================
-- SUMMARY
-- =============================================================================

-- This seed data creates 10 CV submissions with:
-- Status distribution: new (3), reviewed (3), shortlisted (2), interviewed (1), rejected (1)
-- Score range: 45-91 (poor to excellent)
-- Conversions: 2 premium conversions (20% rate)
-- Email tracking: Various sent/opened states
-- Diverse profiles: Different roles, experience levels, locations
