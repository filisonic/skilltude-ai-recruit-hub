/**
 * Email Service Tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { EmailService } from '../../services/EmailService';
import { CVAnalysisResult, UserData } from '../../types/cv.types';

// Create mock functions that we can control
const mockSendMail = vi.fn();
const mockVerify = vi.fn();

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: mockSendMail,
      verify: mockVerify,
    })),
  },
}));

describe('EmailService', () => {
  let emailService: EmailService;
  let mockAnalysisResult: CVAnalysisResult;
  let mockUserData: UserData;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });
    mockVerify.mockResolvedValue(true);

    emailService = new EmailService();

    mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    };

    mockAnalysisResult = {
      overallScore: 75,
      atsCompatibility: 80,
      strengths: [
        'Clear contact information with professional email',
        'Strong action verbs used throughout experience section',
        'Quantifiable achievements with specific metrics',
      ],
      improvements: [
        {
          category: 'Professional Summary',
          priority: 'high',
          issue: 'Missing professional summary section',
          suggestion: 'Add a 3-4 sentence summary highlighting your key skills and career objectives',
          example: 'Results-driven software engineer with 5+ years...',
        },
        {
          category: 'Skills Section',
          priority: 'medium',
          issue: 'Skills are not organized by category',
          suggestion: 'Group skills into categories like Technical Skills, Soft Skills, and Tools',
        },
      ],
      sectionCompleteness: {
        contactInfo: true,
        summary: false,
        experience: true,
        education: true,
        skills: true,
      },
      detailedFeedback: 'Overall good CV with room for improvement',
      analyzedAt: new Date(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('sendCVAnalysis', () => {
    it('should send email successfully', async () => {
      const result = await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
    });

    it('should include user name in email greeting', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain(`Dear ${mockUserData.firstName}`);
      expect(emailCall.text).toContain(`Dear ${mockUserData.firstName}`);
    });

    it('should include score in subject line', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.subject).toBe('Your CV Analysis Results - 75/100');
    });

    it('should send to correct recipient', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.to).toBe(mockUserData.email);
    });

    it('should include both HTML and plain text versions', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toBeDefined();
      expect(emailCall.text).toBeDefined();
      expect(emailCall.html.length).toBeGreaterThan(0);
      expect(emailCall.text.length).toBeGreaterThan(0);
    });
  });

  describe('score interpretation', () => {
    it('should provide excellent interpretation for high scores (85+)', async () => {
      mockAnalysisResult.overallScore = 90;
      
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain('Excellent');
      expect(emailCall.text).toContain('Excellent');
    });

    it('should provide good interpretation for scores 70-84', async () => {
      mockAnalysisResult.overallScore = 75;
      
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain('Good work');
      expect(emailCall.text).toContain('Good work');
    });

    it('should provide needs improvement interpretation for scores 50-69', async () => {
      mockAnalysisResult.overallScore = 60;
      
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain('shows potential');
      expect(emailCall.text).toContain('shows potential');
    });

    it('should provide significant improvement interpretation for low scores (<50)', async () => {
      mockAnalysisResult.overallScore = 40;
      
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain('needs significant improvements');
      expect(emailCall.text).toContain('needs significant improvements');
    });

    it('should include score in both HTML and text versions', async () => {
      mockAnalysisResult.overallScore = 82;
      
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain('82/100');
      expect(emailCall.text).toContain('82/100');
    });
  });

  describe('email content formatting', () => {
    it('should include all strengths in the email', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      mockAnalysisResult.strengths.forEach(strength => {
        expect(emailCall.html).toContain(strength);
        expect(emailCall.text).toContain(strength);
      });
    });

    it('should format improvements with priority levels', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      
      // Check that improvements are included in HTML
      mockAnalysisResult.improvements.forEach(improvement => {
        expect(emailCall.html).toContain(improvement.category);
        expect(emailCall.html).toContain(improvement.issue);
        expect(emailCall.html).toContain(improvement.suggestion);
        expect(emailCall.html).toContain(improvement.priority);
      });
      
      // Check that improvements are included in text (uppercase category)
      mockAnalysisResult.improvements.forEach(improvement => {
        expect(emailCall.text).toContain(improvement.category.toUpperCase());
        expect(emailCall.text).toContain(improvement.issue);
        expect(emailCall.text).toContain(improvement.suggestion);
      });
    });

    it('should include improvement examples when provided', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      const improvementWithExample = mockAnalysisResult.improvements.find(i => i.example);
      
      if (improvementWithExample?.example) {
        expect(emailCall.html).toContain(improvementWithExample.example);
        expect(emailCall.text).toContain(improvementWithExample.example);
      }
    });

    it('should include CTA section with contact information', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      
      // Check for CTA elements
      expect(emailCall.html).toContain('Ready to Take Your CV to the Next Level');
      expect(emailCall.html).toContain('ATS-optimized');
      expect(emailCall.html).toContain('15% off');
      
      expect(emailCall.text).toContain('READY TO TAKE YOUR CV TO THE NEXT LEVEL');
      expect(emailCall.text).toContain('ATS-optimized');
      expect(emailCall.text).toContain('15% off');
    });

    it('should handle empty strengths array gracefully', async () => {
      mockAnalysisResult.strengths = [];
      
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain('identify your strengths');
      expect(emailCall.text).toContain('identify your strengths');
    });

    it('should handle empty improvements array gracefully', async () => {
      mockAnalysisResult.improvements = [];
      
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain('Great job');
      expect(emailCall.text).toContain('Great job');
    });

    it('should include proper HTML structure', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      
      // Check for essential HTML elements
      expect(emailCall.html).toContain('<!DOCTYPE html>');
      expect(emailCall.html).toContain('<html');
      expect(emailCall.html).toContain('<head>');
      expect(emailCall.html).toContain('<body>');
      expect(emailCall.html).toContain('</html>');
    });

    it('should include SkillTude branding', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain('SkillTude');
      expect(emailCall.text).toContain('SkillTude');
    });

    it('should include unsubscribe link', async () => {
      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain('Unsubscribe');
      expect(emailCall.text).toContain('unsubscribe');
    });
  });

  describe('retry logic', () => {
    it('should retry on SMTP failure', async () => {
      // First two attempts fail, third succeeds
      mockSendMail
        .mockRejectedValueOnce(new Error('SMTP connection failed'))
        .mockRejectedValueOnce(new Error('SMTP connection failed'))
        .mockResolvedValueOnce({ messageId: 'test-message-id' });

      const result = await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(3);
    });

    it('should succeed on first retry', async () => {
      // First attempt fails, second succeeds
      mockSendMail
        .mockRejectedValueOnce(new Error('Temporary network error'))
        .mockResolvedValueOnce({ messageId: 'test-message-id' });

      const result = await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max retries exceeded', async () => {
      // All attempts fail
      mockSendMail.mockRejectedValue(new Error('Persistent SMTP failure'));

      await expect(
        emailService.sendCVAnalysis(
          mockUserData.email,
          mockAnalysisResult,
          mockUserData
        )
      ).rejects.toThrow();

      expect(mockSendMail).toHaveBeenCalledTimes(3); // Max retries
    });

    it('should implement exponential backoff between retries', async () => {
      const startTime = Date.now();
      
      // All attempts fail
      mockSendMail.mockRejectedValue(new Error('SMTP failure'));

      try {
        await emailService.sendCVAnalysis(
          mockUserData.email,
          mockAnalysisResult,
          mockUserData
        );
      } catch (error) {
        // Expected to fail
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should have delays: 1s + 2s = 3s minimum (before 3rd attempt)
      // Allow some tolerance for test execution time
      expect(duration).toBeGreaterThanOrEqual(2900);
      expect(mockSendMail).toHaveBeenCalledTimes(3);
    });

    it('should handle different error types during retry', async () => {
      mockSendMail
        .mockRejectedValueOnce(new Error('Network timeout'))
        .mockRejectedValueOnce(new Error('Connection refused'))
        .mockResolvedValueOnce({ messageId: 'test-message-id' });

      const result = await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(3);
    });

    it('should preserve email content across retries', async () => {
      mockSendMail
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce({ messageId: 'test-message-id' });

      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      // Check that both calls had the same content
      const firstCall = mockSendMail.mock.calls[0][0];
      const secondCall = mockSendMail.mock.calls[1][0];

      expect(firstCall.to).toBe(secondCall.to);
      expect(firstCall.subject).toBe(secondCall.subject);
      expect(firstCall.html).toBe(secondCall.html);
      expect(firstCall.text).toBe(secondCall.text);
    });
  });

  describe('email content generation with various analysis results', () => {
    it('should handle high score with no improvements', async () => {
      mockAnalysisResult.overallScore = 95;
      mockAnalysisResult.improvements = [];
      mockAnalysisResult.strengths = [
        'Excellent formatting and structure',
        'Strong professional summary',
        'Comprehensive skills section',
        'Quantifiable achievements throughout',
      ];

      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.subject).toContain('95/100');
      expect(emailCall.html).toContain('Excellent');
      expect(emailCall.html).toContain('Great job');
    });

    it('should handle low score with many improvements', async () => {
      mockAnalysisResult.overallScore = 35;
      mockAnalysisResult.strengths = ['Basic contact information present'];
      mockAnalysisResult.improvements = [
        {
          category: 'Professional Summary',
          priority: 'high',
          issue: 'Missing professional summary',
          suggestion: 'Add a compelling summary',
        },
        {
          category: 'Experience',
          priority: 'high',
          issue: 'Lacks quantifiable achievements',
          suggestion: 'Add metrics and numbers',
        },
        {
          category: 'Skills',
          priority: 'high',
          issue: 'Skills section is incomplete',
          suggestion: 'List relevant technical and soft skills',
        },
        {
          category: 'Formatting',
          priority: 'medium',
          issue: 'Inconsistent formatting',
          suggestion: 'Use consistent fonts and spacing',
        },
      ];

      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.subject).toContain('35/100');
      expect(emailCall.html).toContain('needs significant improvements');
      
      // All improvements should be included
      mockAnalysisResult.improvements.forEach(improvement => {
        expect(emailCall.html).toContain(improvement.category);
        expect(emailCall.html).toContain(improvement.issue);
      });
    });

    it('should handle mixed priority improvements', async () => {
      mockAnalysisResult.improvements = [
        {
          category: 'Critical Issue',
          priority: 'high',
          issue: 'High priority issue',
          suggestion: 'Fix this immediately',
        },
        {
          category: 'Medium Issue',
          priority: 'medium',
          issue: 'Medium priority issue',
          suggestion: 'Address this soon',
        },
        {
          category: 'Minor Issue',
          priority: 'low',
          issue: 'Low priority issue',
          suggestion: 'Consider this improvement',
        },
      ];

      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      
      // All priority levels should be present
      expect(emailCall.html).toContain('priority-high');
      expect(emailCall.html).toContain('priority-medium');
      expect(emailCall.html).toContain('priority-low');
      
      expect(emailCall.text).toContain('HIGH PRIORITY');
      expect(emailCall.text).toContain('MEDIUM PRIORITY');
      expect(emailCall.text).toContain('LOW PRIORITY');
    });

    it('should handle special characters in user data', async () => {
      mockUserData.firstName = "O'Brien";
      mockUserData.lastName = "Smith-Jones";

      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain("O'Brien");
      expect(emailCall.text).toContain("O'Brien");
    });

    it('should handle long improvement suggestions', async () => {
      mockAnalysisResult.improvements = [
        {
          category: 'Detailed Improvement',
          priority: 'high',
          issue: 'This is a very long issue description that goes into detail about multiple aspects of the problem',
          suggestion: 'This is an equally long suggestion that provides comprehensive guidance on how to address the issue with multiple steps and considerations',
          example: 'Here is a detailed example that demonstrates exactly what the improved version should look like with specific formatting and content recommendations',
        },
      ];

      await emailService.sendCVAnalysis(
        mockUserData.email,
        mockAnalysisResult,
        mockUserData
      );

      const emailCall = mockSendMail.mock.calls[0][0];
      expect(emailCall.html).toContain(mockAnalysisResult.improvements[0].issue);
      expect(emailCall.html).toContain(mockAnalysisResult.improvements[0].suggestion);
      expect(emailCall.html).toContain(mockAnalysisResult.improvements[0].example);
    });
  });

  describe('verifyConnection', () => {
    it('should verify email service connection', async () => {
      const result = await emailService.verifyConnection();
      expect(result).toBe(true);
      expect(mockVerify).toHaveBeenCalledTimes(1);
    });

    it('should return false when verification fails', async () => {
      mockVerify.mockRejectedValueOnce(new Error('Connection failed'));
      
      const result = await emailService.verifyConnection();
      expect(result).toBe(false);
    });
  });
});
