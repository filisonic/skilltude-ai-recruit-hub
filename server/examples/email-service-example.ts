/**
 * Email Service Usage Example
 * 
 * This file demonstrates how to use the EmailService to send CV analysis emails
 */

import { EmailService } from '../services/EmailService';
import { CVAnalysisResult, UserData } from '../types/cv.types';

/**
 * Example: Send a CV analysis email
 */
async function sendAnalysisEmailExample() {
  // Initialize the email service
  const emailService = new EmailService();

  // Verify email service connection (optional but recommended)
  const isConnected = await emailService.verifyConnection();
  if (!isConnected) {
    console.error('Email service connection failed. Please check your configuration.');
    return;
  }

  // Sample user data
  const userData: UserData = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567890',
  };

  // Sample CV analysis results
  const analysisResult: CVAnalysisResult = {
    overallScore: 78,
    atsCompatibility: 82,
    strengths: [
      'Clear and professional contact information',
      'Strong use of action verbs throughout experience section',
      'Quantifiable achievements with specific metrics and results',
      'Well-organized education section with relevant certifications',
    ],
    improvements: [
      {
        category: 'Professional Summary',
        priority: 'high',
        issue: 'Missing professional summary at the top of CV',
        suggestion: 'Add a compelling 3-4 sentence summary that highlights your key skills, experience, and career objectives',
        example: 'Results-driven Marketing Manager with 7+ years of experience in digital marketing and brand strategy...',
      },
      {
        category: 'Skills Section',
        priority: 'medium',
        issue: 'Skills are listed without categorization',
        suggestion: 'Organize skills into clear categories such as Technical Skills, Soft Skills, and Tools & Technologies',
      },
      {
        category: 'Formatting',
        priority: 'low',
        issue: 'Inconsistent date formatting across sections',
        suggestion: 'Use a consistent date format throughout (e.g., "Jan 2020 - Present" or "01/2020 - Present")',
      },
    ],
    sectionCompleteness: {
      contactInfo: true,
      summary: false,
      experience: true,
      education: true,
      skills: true,
    },
    detailedFeedback: 'Your CV demonstrates strong professional experience with clear achievements. Focus on adding a professional summary and improving the skills section organization to make it even more impactful.',
    analyzedAt: new Date(),
  };

  try {
    // Send the email
    console.log('Sending CV analysis email...');
    const success = await emailService.sendCVAnalysis(
      userData.email,
      analysisResult,
      userData
    );

    if (success) {
      console.log('✅ Email sent successfully!');
      console.log(`Recipient: ${userData.email}`);
      console.log(`Score: ${analysisResult.overallScore}/100`);
    } else {
      console.error('❌ Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

/**
 * Example: Send emails with different score ranges
 */
async function sendMultipleScoreExamples() {
  const emailService = new EmailService();

  const userData: UserData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+1234567890',
  };

  // High score example (85+)
  const highScoreResult: CVAnalysisResult = {
    overallScore: 92,
    atsCompatibility: 95,
    strengths: [
      'Exceptional formatting and structure',
      'Comprehensive skills section with relevant keywords',
      'Strong quantifiable achievements throughout',
    ],
    improvements: [
      {
        category: 'Minor Enhancement',
        priority: 'low',
        issue: 'Could add more industry-specific keywords',
        suggestion: 'Research job descriptions in your field and incorporate relevant terminology',
      },
    ],
    sectionCompleteness: {
      contactInfo: true,
      summary: true,
      experience: true,
      education: true,
      skills: true,
    },
    detailedFeedback: 'Excellent CV!',
    analyzedAt: new Date(),
  };

  // Low score example (<50)
  const lowScoreResult: CVAnalysisResult = {
    overallScore: 42,
    atsCompatibility: 38,
    strengths: [
      'Contact information is present',
    ],
    improvements: [
      {
        category: 'Professional Summary',
        priority: 'high',
        issue: 'Missing professional summary',
        suggestion: 'Add a compelling summary at the top of your CV',
      },
      {
        category: 'Experience Section',
        priority: 'high',
        issue: 'Lacks quantifiable achievements',
        suggestion: 'Add specific metrics and results to your experience descriptions',
      },
      {
        category: 'Skills Section',
        priority: 'high',
        issue: 'Skills section is missing or incomplete',
        suggestion: 'Create a comprehensive skills section with relevant technical and soft skills',
      },
    ],
    sectionCompleteness: {
      contactInfo: true,
      summary: false,
      experience: false,
      education: true,
      skills: false,
    },
    detailedFeedback: 'Significant improvements needed',
    analyzedAt: new Date(),
  };

  console.log('Sending high score example...');
  await emailService.sendCVAnalysis(userData.email, highScoreResult, userData);

  console.log('Sending low score example...');
  await emailService.sendCVAnalysis(userData.email, lowScoreResult, userData);
}

// Run examples (uncomment to test)
// sendAnalysisEmailExample();
// sendMultipleScoreExamples();

export { sendAnalysisEmailExample, sendMultipleScoreExamples };
