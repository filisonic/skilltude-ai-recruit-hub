/**
 * Unit tests for CVAnalysisEngine
 * 
 * Tests CV analysis with different quality samples:
 * - High-quality CV (expected score 85-95)
 * - Average CV (expected score 60-75)
 * - Poor CV (expected score 30-50)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CVAnalysisEngine } from '../../services/CVAnalysisEngine';
import { CVUploadException } from '../../types/cv.types';

describe('CVAnalysisEngine', () => {
  let engine: CVAnalysisEngine;

  beforeEach(() => {
    engine = new CVAnalysisEngine();
  });

  // ============================================================================
  // High-Quality CV Sample (Expected Score: 85-95)
  // ============================================================================

  describe('High-Quality CV Analysis', () => {
    const highQualityCVText = `
John Smith
Senior Software Engineer
Email: john.smith@email.com | Phone: +1 (555) 123-4567
LinkedIn: linkedin.com/in/johnsmith | GitHub: github.com/johnsmith

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 8+ years of experience in full-stack development.
Proven track record of delivering scalable solutions and leading cross-functional teams to achieve
business objectives. Expertise in cloud architecture, microservices, and agile methodologies.

WORK EXPERIENCE

Senior Software Engineer | Tech Corp | Jan 2020 - Present
• Led development of microservices architecture serving 1M+ users, improving system reliability by 45%
• Implemented automated CI/CD pipeline, reducing deployment time from 4 hours to 15 minutes
• Managed team of 8 developers, achieving 98% sprint completion rate over 12 months
• Optimized database queries, reducing average response time by 60% and saving $50K annually in infrastructure costs
• Developed RESTful APIs handling 10K+ requests per second with 99.9% uptime

Software Engineer | Innovation Labs | Jun 2017 - Dec 2019
• Built real-time analytics dashboard processing 500K+ events daily, increasing user engagement by 35%
• Designed and implemented authentication system supporting OAuth 2.0 and JWT, securing 100K+ user accounts
• Collaborated with product team to deliver 15+ features, resulting in 25% increase in customer satisfaction
• Reduced technical debt by 40% through systematic refactoring and code review processes
• Mentored 5 junior developers, improving team productivity by 30%

Junior Developer | StartupXYZ | Jan 2016 - May 2017
• Developed responsive web applications using React and Node.js for 50+ clients
• Improved application performance by 50% through code optimization and caching strategies
• Participated in agile ceremonies and contributed to sprint planning and retrospectives

EDUCATION

Bachelor of Science in Computer Science | University of Technology | 2015
GPA: 3.8/4.0 | Dean's List | Graduated with Honors
Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems

TECHNICAL SKILLS

Languages: JavaScript, TypeScript, Python, Java, SQL
Frameworks: React, Node.js, Express, Django, Spring Boot
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, Terraform
Databases: PostgreSQL, MongoDB, Redis, MySQL
Tools: Git, JIRA, Confluence, Postman

SOFT SKILLS

Leadership, Communication, Problem-solving, Team Collaboration, Project Management, Agile Methodology

CERTIFICATIONS

AWS Certified Solutions Architect - Professional | 2022
Certified Scrum Master (CSM) | 2021
`;

    it('should score high-quality CV between 85-100', async () => {
      const result = await engine.analyzeCV(highQualityCVText);
      
      expect(result.overallScore).toBeGreaterThanOrEqual(85);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    it('should detect all major sections', async () => {
      const result = await engine.analyzeCV(highQualityCVText);
      
      expect(result.sectionCompleteness.contactInfo).toBe(true);
      expect(result.sectionCompleteness.summary).toBe(true);
      expect(result.sectionCompleteness.experience).toBe(true);
      expect(result.sectionCompleteness.education).toBe(true);
      expect(result.sectionCompleteness.skills).toBe(true);
    });

    it('should have high ATS compatibility score', async () => {
      const result = await engine.analyzeCV(highQualityCVText);
      
      expect(result.atsCompatibility).toBeGreaterThanOrEqual(80);
    });

    it('should identify multiple strengths', async () => {
      const result = await engine.analyzeCV(highQualityCVText);
      
      expect(result.strengths.length).toBeGreaterThanOrEqual(3);
      expect(result.strengths.some(s => s.includes('contact'))).toBe(true);
      expect(result.strengths.some(s => s.includes('action verb'))).toBe(true);
      expect(result.strengths.some(s => s.includes('Quantifiable'))).toBe(true);
    });

    it('should have minimal or no high-priority improvements', async () => {
      const result = await engine.analyzeCV(highQualityCVText);
      
      const highPriorityImprovements = result.improvements.filter(
        imp => imp.priority === 'high'
      );
      
      expect(highPriorityImprovements.length).toBe(0);
    });

    it('should generate positive detailed feedback', async () => {
      const result = await engine.analyzeCV(highQualityCVText);
      
      expect(result.detailedFeedback).toContain('Excellent');
    });

    it('should include analyzedAt timestamp', async () => {
      const result = await engine.analyzeCV(highQualityCVText);
      
      expect(result.analyzedAt).toBeInstanceOf(Date);
    });
  });

  // ============================================================================
  // Average CV Sample (Expected Score: 60-75)
  // ============================================================================

  describe('Average CV Analysis', () => {
    const averageCVText = `
Jane Doe
Marketing Specialist
jane.doe@email.com | (555) 987-6543

OBJECTIVE
Looking for a marketing position where I can use my skills and experience.

EXPERIENCE

Marketing Specialist | ABC Company | 2020 - Present
Responsible for managing social media accounts and creating content.
Worked on email campaigns and helped with marketing projects.
Assisted with market research and competitor analysis.
Coordinated with team members on various initiatives.

Marketing Assistant | XYZ Corp | 2018 - 2020
Helped with social media posts and content creation.
Supported the marketing team with daily tasks.
Participated in brainstorming sessions for campaigns.

EDUCATION

Bachelor of Arts in Marketing | State University | 2018

SKILLS

Social Media, Content Creation, Email Marketing, Microsoft Office, Communication
`;

    it('should score average CV between 60-85', async () => {
      const result = await engine.analyzeCV(averageCVText);
      
      expect(result.overallScore).toBeGreaterThanOrEqual(60);
      expect(result.overallScore).toBeLessThanOrEqual(85);
    });

    it('should detect basic sections', async () => {
      const result = await engine.analyzeCV(averageCVText);
      
      expect(result.sectionCompleteness.contactInfo).toBe(true);
      expect(result.sectionCompleteness.experience).toBe(true);
      expect(result.sectionCompleteness.education).toBe(true);
      expect(result.sectionCompleteness.skills).toBe(true);
    });

    it('should identify lack of action verbs as improvement', async () => {
      const result = await engine.analyzeCV(averageCVText);
      
      const actionVerbImprovement = result.improvements.find(
        imp => imp.category === 'Action Verbs'
      );
      
      expect(actionVerbImprovement).toBeDefined();
      expect(actionVerbImprovement?.priority).toBe('medium');
    });

    it('should identify lack of quantifiable achievements', async () => {
      const result = await engine.analyzeCV(averageCVText);
      
      const achievementImprovement = result.improvements.find(
        imp => imp.category === 'Quantifiable Achievements'
      );
      
      expect(achievementImprovement).toBeDefined();
      expect(achievementImprovement?.suggestion).toContain('numbers');
    });

    it('should have some strengths and improvements', async () => {
      const result = await engine.analyzeCV(averageCVText);
      
      expect(result.strengths.length).toBeGreaterThanOrEqual(1);
      expect(result.improvements.length).toBeGreaterThanOrEqual(2);
    });

    it('should generate constructive feedback', async () => {
      const result = await engine.analyzeCV(averageCVText);
      
      expect(result.detailedFeedback).toMatch(/Good|potential|improvement/i);
    });

    it('should have moderate to high ATS compatibility', async () => {
      const result = await engine.analyzeCV(averageCVText);
      
      expect(result.atsCompatibility).toBeGreaterThanOrEqual(50);
      expect(result.atsCompatibility).toBeLessThanOrEqual(100);
    });
  });

  // ============================================================================
  // Poor CV Sample (Expected Score: 30-50)
  // ============================================================================

  describe('Poor CV Analysis', () => {
    const poorCVText = `
Bob Johnson

I am looking for a job in sales. I have some experience and I am a hard worker.

Jobs:
- Worked at Store A for 2 years
- Also worked at Store B
- Did some freelance work

School:
Went to college

Skills:
Good with people
Computer skills
`;

    it('should score poor CV between 30-50', async () => {
      const result = await engine.analyzeCV(poorCVText);
      
      expect(result.overallScore).toBeGreaterThanOrEqual(30);
      expect(result.overallScore).toBeLessThanOrEqual(50);
    });

    it('should detect missing critical sections', async () => {
      const result = await engine.analyzeCV(poorCVText);
      
      expect(result.sectionCompleteness.contactInfo).toBe(false);
      expect(result.sectionCompleteness.summary).toBe(false);
    });

    it('should identify multiple high-priority improvements', async () => {
      const result = await engine.analyzeCV(poorCVText);
      
      const highPriorityImprovements = result.improvements.filter(
        imp => imp.priority === 'high'
      );
      
      expect(highPriorityImprovements.length).toBeGreaterThanOrEqual(2);
    });

    it('should flag missing contact information', async () => {
      const result = await engine.analyzeCV(poorCVText);
      
      const contactImprovement = result.improvements.find(
        imp => imp.category === 'Contact Information'
      );
      
      expect(contactImprovement).toBeDefined();
      expect(contactImprovement?.priority).toBe('high');
      expect(contactImprovement?.suggestion).toContain('contact details');
    });

    it('should flag missing professional summary', async () => {
      const result = await engine.analyzeCV(poorCVText);
      
      const summaryImprovement = result.improvements.find(
        imp => imp.category === 'Professional Summary'
      );
      
      expect(summaryImprovement).toBeDefined();
      expect(summaryImprovement?.priority).toBe('high');
    });

    it('should have low to moderate ATS compatibility', async () => {
      const result = await engine.analyzeCV(poorCVText);
      
      expect(result.atsCompatibility).toBeLessThanOrEqual(75);
    });

    it('should generate critical feedback', async () => {
      const result = await engine.analyzeCV(poorCVText);
      
      expect(result.detailedFeedback).toMatch(/requires|needs|improvement/i);
    });

    it('should provide specific examples in improvements', async () => {
      const result = await engine.analyzeCV(poorCVText);
      
      const improvementsWithExamples = result.improvements.filter(
        imp => imp.example && imp.example.length > 0
      );
      
      expect(improvementsWithExamples.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ============================================================================
  // Edge Cases and Error Handling
  // ============================================================================

  describe('Edge Cases', () => {
    it('should throw error for empty CV text', async () => {
      await expect(engine.analyzeCV('')).rejects.toThrow(CVUploadException);
    });

    it('should throw error for whitespace-only CV text', async () => {
      await expect(engine.analyzeCV('   \n\t  ')).rejects.toThrow(CVUploadException);
    });

    it('should handle very short CV', async () => {
      const shortCV = 'John Doe\njohn@email.com\nExperience: Developer';
      const result = await engine.analyzeCV(shortCV);
      
      expect(result.overallScore).toBeLessThan(60);
      expect(result.improvements.some(imp => imp.category === 'CV Length')).toBe(true);
    });

    it('should handle very long CV', async () => {
      const longCV = 'John Doe\njohn@email.com\n' + 'Lorem ipsum dolor sit amet. '.repeat(500);
      const result = await engine.analyzeCV(longCV);
      
      const lengthImprovement = result.improvements.find(imp => imp.category === 'CV Length');
      if (lengthImprovement) {
        expect(lengthImprovement.issue).toContain('too long');
      }
    });

    it('should handle CV with special characters', async () => {
      const cvWithSpecialChars = `
        José García
        Email: jose.garcia@email.com | Phone: +34 123-456-789
        
        Professional Summary
        Experienced developer with 5+ years in software development.
        
        Experience
        Senior Developer | Tech Company | 2020 - Present
        • Developed applications using React & Node.js
        • Improved performance by 50%
        
        Education
        Bachelor's Degree in Computer Science | 2019
        
        Skills
        JavaScript, Python, SQL
      `;
      
      const result = await engine.analyzeCV(cvWithSpecialChars);
      
      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.sectionCompleteness.contactInfo).toBe(true);
    });
  });

  // ============================================================================
  // Improvement Suggestions Validation
  // ============================================================================

  describe('Improvement Suggestions', () => {
    it('should provide actionable suggestions with examples', async () => {
      const basicCV = `
        John Smith
        Developer
        
        Experience:
        Worked at Company A
        Did some projects
        
        Education:
        College degree
      `;
      
      const result = await engine.analyzeCV(basicCV);
      
      result.improvements.forEach(improvement => {
        expect(improvement.category).toBeTruthy();
        expect(improvement.priority).toMatch(/high|medium|low/);
        expect(improvement.issue).toBeTruthy();
        expect(improvement.suggestion).toBeTruthy();
        expect(improvement.suggestion.length).toBeGreaterThan(20);
      });
    });

    it('should prioritize improvements correctly', async () => {
      const incompleteCV = 'Some text without proper structure';
      const result = await engine.analyzeCV(incompleteCV);
      
      // High priority improvements should come first
      const priorities = result.improvements.map(imp => imp.priority);
      const firstHighIndex = priorities.indexOf('high');
      const lastLowIndex = priorities.lastIndexOf('low');
      
      if (firstHighIndex !== -1 && lastLowIndex !== -1) {
        expect(firstHighIndex).toBeLessThan(lastLowIndex);
      }
    });

    it('should limit improvements to reasonable number', async () => {
      const poorCV = 'Minimal content';
      const result = await engine.analyzeCV(poorCV);
      
      expect(result.improvements.length).toBeLessThanOrEqual(8);
    });
  });

  // ============================================================================
  // Specific Feature Detection
  // ============================================================================

  describe('Feature Detection', () => {
    it('should detect action verbs correctly', async () => {
      const cvWithActionVerbs = `
        John Doe | john@email.com
        
        Professional Summary
        Experienced professional with proven track record.
        
        Experience
        • Achieved 50% increase in sales
        • Developed new marketing strategy
        • Implemented automated processes
        • Led team of 10 people
        • Managed multiple projects
        • Optimized workflow efficiency
        
        Education
        Bachelor's Degree | 2020
        
        Skills
        Leadership, Management, Communication
      `;
      
      const result = await engine.analyzeCV(cvWithActionVerbs);
      
      expect(result.strengths.some(s => s.includes('action verb'))).toBe(true);
    });

    it('should detect quantifiable achievements', async () => {
      const cvWithMetrics = `
        Jane Smith | jane@email.com
        
        Professional Summary
        Results-driven professional with 5+ years of experience.
        
        Experience
        • Increased revenue by 45%
        • Managed team of 12 developers
        • Reduced costs by $100K annually
        • Improved efficiency by 60%
        • Served 1000+ customers
        
        Education
        Master's Degree | 2018
        
        Skills
        Project Management, Analytics
      `;
      
      const result = await engine.analyzeCV(cvWithMetrics);
      
      expect(result.strengths.some(s => s.includes('Quantifiable'))).toBe(true);
    });

    it('should detect professional keywords', async () => {
      const cvWithKeywords = `
        Professional Summary
        Experienced project manager with strong leadership and team management skills.
        
        Experience
        Led multiple projects using agile methodology and strategic planning.
        Focused on innovation, optimization, and quality improvement.
        Strong communication and collaboration with stakeholders.
        
        Skills
        Project Management, Leadership, Strategy, Analysis, Development
      `;
      
      const result = await engine.analyzeCV(cvWithKeywords);
      
      expect(result.strengths.some(s => s.includes('keyword'))).toBe(true);
    });
  });
});
