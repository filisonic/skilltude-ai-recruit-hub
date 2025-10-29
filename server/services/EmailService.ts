/**
 * CV Analysis System - Email Service
 * 
 * Handles sending CV analysis emails with retry logic and multiple provider support
 */

import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config/index';
import {
  CVAnalysisResult,
  UserData,
  EmailContent,
  CVUploadException,
  ErrorCodes,
  Improvement,
} from '../types/cv.types';

/**
 * Email Service for sending CV analysis results
 */
export class EmailService {
  private transporter: Transporter | null = null;
  private maxRetries = 3;
  private baseRetryDelay = 1000; // 1 second

  constructor() {
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter based on configured provider
   */
  private initializeTransporter(): void {
    try {
      if (config.email.provider === 'smtp') {
        // SMTP configuration
        this.transporter = nodemailer.createTransport({
          host: config.email.smtp?.host,
          port: config.email.smtp?.port,
          secure: config.email.smtp?.secure,
          auth: {
            user: config.email.smtp?.auth.user,
            pass: config.email.smtp?.auth.pass,
          },
        });
      } else if (config.email.provider === 'sendgrid') {
        // SendGrid configuration
        this.transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          secure: false,
          auth: {
            user: 'apikey',
            pass: config.email.apiKey,
          },
        });
      } else if (config.email.provider === 'ses') {
        // AWS SES configuration (requires aws-sdk)
        throw new Error('AWS SES provider not yet implemented. Please use SMTP or SendGrid.');
      } else if (config.email.provider === 'mailgun') {
        // Mailgun configuration
        throw new Error('Mailgun provider not yet implemented. Please use SMTP or SendGrid.');
      }

      console.log(`Email service initialized with provider: ${config.email.provider}`);
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
      throw new CVUploadException(
        ErrorCodes.EMAIL_SEND_FAILED,
        'Failed to initialize email service',
        500
      );
    }
  }

  /**
   * Send CV analysis email to user
   * 
   * @param recipient - Email address of the recipient
   * @param analysisResult - CV analysis results
   * @param userData - User information
   * @returns Promise<boolean> - True if email sent successfully
   */
  async sendCVAnalysis(
    recipient: string,
    analysisResult: CVAnalysisResult,
    userData: UserData
  ): Promise<boolean> {
    try {
      const emailContent = this.generateEmailContent(analysisResult, userData);
      
      return await this.sendEmailWithRetry(
        recipient,
        emailContent.subject,
        emailContent.html,
        emailContent.text
      );
    } catch (error) {
      console.error('Failed to send CV analysis email:', error);
      throw new CVUploadException(
        ErrorCodes.EMAIL_SEND_FAILED,
        `Failed to send email to ${recipient}`,
        500
      );
    }
  }

  /**
   * Send email with retry logic and exponential backoff
   * 
   * @param to - Recipient email address
   * @param subject - Email subject
   * @param html - HTML email content
   * @param text - Plain text email content
   * @returns Promise<boolean> - True if email sent successfully
   */
  private async sendEmailWithRetry(
    to: string,
    subject: string,
    html: string,
    text: string
  ): Promise<boolean> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        await this.sendEmail(to, subject, html, text);
        
        if (attempt > 0) {
          console.log(`Email sent successfully on attempt ${attempt + 1}`);
        }
        
        return true;
      } catch (error) {
        lastError = error as Error;
        console.error(`Email send attempt ${attempt + 1} failed:`, error);

        // Don't retry on the last attempt
        if (attempt < this.maxRetries - 1) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = this.baseRetryDelay * Math.pow(2, attempt);
          console.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    // All retries failed
    console.error(`Failed to send email after ${this.maxRetries} attempts`);
    throw lastError || new Error('Email send failed');
  }

  /**
   * Send email using configured transporter
   * 
   * @param to - Recipient email address
   * @param subject - Email subject
   * @param html - HTML email content
   * @param text - Plain text email content
   */
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string
  ): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    const mailOptions = {
      from: `${config.email.fromName} <${config.email.fromAddress}>`,
      to,
      subject,
      html,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Generate email content from analysis results
   * 
   * @param analysisResult - CV analysis results
   * @param userData - User information
   * @returns EmailContent - Formatted email content
   */
  private generateEmailContent(
    analysisResult: CVAnalysisResult,
    userData: UserData
  ): EmailContent {
    const subject = `Your CV Analysis Results - ${analysisResult.overallScore}/100`;
    
    const html = this.generateHTMLEmail(analysisResult, userData);
    const text = this.generatePlainTextEmail(analysisResult, userData);

    return {
      to: userData.email,
      subject,
      html,
      text,
    };
  }

  /**
   * Generate HTML email template
   * 
   * @param analysisResult - CV analysis results
   * @param userData - User information
   * @returns string - HTML email content
   */
  private generateHTMLEmail(
    analysisResult: CVAnalysisResult,
    userData: UserData
  ): string {
    const scoreInterpretation = this.getScoreInterpretation(analysisResult.overallScore);
    const strengthsHTML = this.formatStrengthsHTML(analysisResult.strengths);
    const improvementsHTML = this.formatImprovementsHTML(analysisResult.improvements);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your CV Analysis Results</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #4F46E5;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #4F46E5;
      margin-bottom: 10px;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .score-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      margin: 30px 0;
    }
    .score {
      font-size: 48px;
      font-weight: bold;
      margin: 10px 0;
    }
    .score-label {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
    }
    .interpretation {
      font-size: 16px;
      margin-top: 15px;
      line-height: 1.5;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #4F46E5;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    .section-icon {
      margin-right: 10px;
      font-size: 24px;
    }
    .divider {
      border: 0;
      height: 2px;
      background: linear-gradient(to right, #4F46E5, transparent);
      margin: 30px 0;
    }
    .strength-item, .improvement-item {
      background-color: #f8f9fa;
      padding: 15px;
      margin: 10px 0;
      border-radius: 6px;
      border-left: 4px solid #4F46E5;
    }
    .improvement-item {
      border-left-color: #F59E0B;
    }
    .improvement-category {
      font-weight: bold;
      color: #F59E0B;
      font-size: 14px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .improvement-priority {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      margin-left: 10px;
    }
    .priority-high {
      background-color: #FEE2E2;
      color: #DC2626;
    }
    .priority-medium {
      background-color: #FEF3C7;
      color: #D97706;
    }
    .priority-low {
      background-color: #DBEAFE;
      color: #2563EB;
    }
    .improvement-suggestion {
      margin-top: 8px;
      color: #555;
    }
    .cta-section {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin: 30px 0;
      text-align: center;
    }
    .cta-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .cta-text {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .cta-benefits {
      text-align: left;
      margin: 20px auto;
      max-width: 400px;
    }
    .cta-benefit {
      margin: 10px 0;
      padding-left: 25px;
      position: relative;
    }
    .cta-benefit:before {
      content: "✓";
      position: absolute;
      left: 0;
      font-weight: bold;
      font-size: 18px;
    }
    .cta-button {
      display: inline-block;
      background-color: white;
      color: #D97706;
      padding: 15px 40px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      margin-top: 20px;
    }
    .cta-discount {
      background-color: rgba(255,255,255,0.2);
      padding: 15px;
      border-radius: 6px;
      margin-top: 20px;
      font-size: 18px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .contact-info {
      margin: 15px 0;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-link {
      display: inline-block;
      margin: 0 10px;
      color: #4F46E5;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 10px;
      }
      .container {
        padding: 20px;
      }
      .score {
        font-size: 36px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SkillTude</div>
      <div style="color: #6b7280; font-size: 14px;">Professional CV Analysis</div>
    </div>

    <div class="greeting">
      Dear ${userData.firstName},
    </div>

    <p>
      Thank you for submitting your CV for analysis. We've completed a comprehensive 
      review and are excited to share our findings with you.
    </p>

    <div class="score-section">
      <div class="score-label">Your CV Score</div>
      <div class="score">${analysisResult.overallScore}/100</div>
      <div class="interpretation">${scoreInterpretation}</div>
    </div>

    <hr class="divider">

    <div class="section">
      <div class="section-title">
        <span class="section-icon">✅</span>
        What You're Doing Well
      </div>
      ${strengthsHTML}
    </div>

    <hr class="divider">

    <div class="section">
      <div class="section-title">
        <span class="section-icon">🎯</span>
        Key Improvements to Make
      </div>
      ${improvementsHTML}
    </div>

    <hr class="divider">

    <div class="cta-section">
      <div class="cta-title">🚀 Ready to Take Your CV to the Next Level?</div>
      <div class="cta-text">
        While these improvements will help, creating an ATS-optimized CV that stands 
        out to recruiters requires expertise and industry knowledge.
      </div>
      <div class="cta-benefits">
        <div class="cta-benefit">ATS-optimized formatting that passes automated screening</div>
        <div class="cta-benefit">Industry-specific keyword optimization</div>
        <div class="cta-benefit">Achievement-focused content that highlights your value</div>
        <div class="cta-benefit">Professional design that impresses hiring managers</div>
        <div class="cta-benefit">Unlimited revisions until you're 100% satisfied</div>
      </div>
      <div class="cta-text">
        📧 Reply to this email or call us at <strong>+1 (555) 123-4567</strong> to discuss 
        how we can help you create a CV that opens doors to your dream job.
      </div>
      <div class="cta-discount">
        💼 Limited Time: Mention this analysis for 15% off our CV writing service!
      </div>
    </div>

    <div class="footer">
      <div class="contact-info">
        <strong>SkillTude</strong><br>
        Email: ${config.email.fromAddress}<br>
        Phone: +1 (555) 123-4567
      </div>
      <div class="social-links">
        <a href="#" class="social-link">LinkedIn</a> |
        <a href="#" class="social-link">Twitter</a> |
        <a href="#" class="social-link">Facebook</a>
      </div>
      <div style="margin-top: 20px; font-size: 12px;">
        You're receiving this email because you submitted your CV for analysis on our website.<br>
        <a href="#" style="color: #6b7280;">Unsubscribe</a> | 
        <a href="#" style="color: #6b7280;">Privacy Policy</a>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate plain text email (fallback)
   * 
   * @param analysisResult - CV analysis results
   * @param userData - User information
   * @returns string - Plain text email content
   */
  private generatePlainTextEmail(
    analysisResult: CVAnalysisResult,
    userData: UserData
  ): string {
    const scoreInterpretation = this.getScoreInterpretation(analysisResult.overallScore);
    const strengthsText = this.formatStrengthsText(analysisResult.strengths);
    const improvementsText = this.formatImprovementsText(analysisResult.improvements);

    return `
SKILLTUDE - Your CV Analysis Results

Dear ${userData.firstName},

Thank you for submitting your CV for analysis. We've completed a comprehensive review and are excited to share our findings with you.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 YOUR CV SCORE: ${analysisResult.overallScore}/100

${scoreInterpretation}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ WHAT YOU'RE DOING WELL

${strengthsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 KEY IMPROVEMENTS TO MAKE

${improvementsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 READY TO TAKE YOUR CV TO THE NEXT LEVEL?

While these improvements will help, creating an ATS-optimized CV that stands out to recruiters requires expertise and industry knowledge.

Our professional CV writing service includes:
✓ ATS-optimized formatting that passes automated screening
✓ Industry-specific keyword optimization
✓ Achievement-focused content that highlights your value
✓ Professional design that impresses hiring managers
✓ Unlimited revisions until you're 100% satisfied

📧 Reply to this email or call us at +1 (555) 123-4567 to discuss how we can help you create a CV that opens doors to your dream job.

💼 Limited Time: Mention this analysis for 15% off our CV writing service!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
The SkillTude Team

Contact Information:
Email: ${config.email.fromAddress}
Phone: +1 (555) 123-4567

You're receiving this email because you submitted your CV for analysis on our website.
To unsubscribe, visit: [unsubscribe link]
Privacy Policy: [privacy policy link]
    `.trim();
  }

  /**
   * Get score interpretation based on score range
   * 
   * @param score - Overall CV score
   * @returns string - Score interpretation
   */
  private getScoreInterpretation(score: number): string {
    if (score >= 85) {
      return 'Excellent! Your CV is well-structured and professional. With a few minor tweaks, it will be ready to impress any hiring manager.';
    } else if (score >= 70) {
      return 'Good work! Your CV has a solid foundation. The improvements we\'ve identified will help you stand out even more to recruiters.';
    } else if (score >= 50) {
      return 'Your CV shows potential, but there are several areas that need attention. Implementing our suggestions will significantly improve your chances of getting interviews.';
    } else {
      return 'Your CV needs significant improvements to be competitive. Don\'t worry - we\'ve identified specific areas to focus on that will make a big difference.';
    }
  }

  /**
   * Format strengths as HTML list
   * 
   * @param strengths - Array of strength descriptions
   * @returns string - HTML formatted strengths
   */
  private formatStrengthsHTML(strengths: string[]): string {
    if (strengths.length === 0) {
      return '<div class="strength-item">We\'ll identify your strengths after a more detailed review.</div>';
    }

    return strengths
      .map(strength => `<div class="strength-item">${strength}</div>`)
      .join('\n');
  }

  /**
   * Format improvements as HTML list
   * 
   * @param improvements - Array of improvement objects
   * @returns string - HTML formatted improvements
   */
  private formatImprovementsHTML(improvements: Improvement[]): string {
    if (improvements.length === 0) {
      return '<div class="improvement-item">Great job! No major improvements needed at this time.</div>';
    }

    return improvements
      .map(improvement => `
        <div class="improvement-item">
          <div class="improvement-category">
            ${improvement.category}
            <span class="improvement-priority priority-${improvement.priority}">${improvement.priority}</span>
          </div>
          <div><strong>${improvement.issue}</strong></div>
          <div class="improvement-suggestion">${improvement.suggestion}</div>
          ${improvement.example ? `<div style="margin-top: 8px; font-style: italic; color: #6b7280;">Example: ${improvement.example}</div>` : ''}
        </div>
      `)
      .join('\n');
  }

  /**
   * Format strengths as plain text list
   * 
   * @param strengths - Array of strength descriptions
   * @returns string - Plain text formatted strengths
   */
  private formatStrengthsText(strengths: string[]): string {
    if (strengths.length === 0) {
      return '• We\'ll identify your strengths after a more detailed review.';
    }

    return strengths
      .map((strength, index) => `${index + 1}. ${strength}`)
      .join('\n\n');
  }

  /**
   * Format improvements as plain text list
   * 
   * @param improvements - Array of improvement objects
   * @returns string - Plain text formatted improvements
   */
  private formatImprovementsText(improvements: Improvement[]): string {
    if (improvements.length === 0) {
      return '• Great job! No major improvements needed at this time.';
    }

    return improvements
      .map((improvement, index) => {
        let text = `${index + 1}. ${improvement.category.toUpperCase()} [${improvement.priority.toUpperCase()} PRIORITY]\n`;
        text += `   Issue: ${improvement.issue}\n`;
        text += `   Suggestion: ${improvement.suggestion}`;
        if (improvement.example) {
          text += `\n   Example: ${improvement.example}`;
        }
        return text;
      })
      .join('\n\n');
  }

  /**
   * Retry a failed email delivery
   * 
   * @param submissionId - UUID of the CV submission
   * @returns Promise<boolean> - True if email sent successfully
   */
  async retryFailedEmail(submissionId: string): Promise<boolean> {
    // This would typically fetch the submission from database and retry
    // Implementation depends on database integration
    throw new Error('retryFailedEmail not yet implemented - requires database integration');
  }

  /**
   * Sleep utility for retry delays
   * 
   * @param ms - Milliseconds to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verify email service configuration
   * 
   * @returns Promise<boolean> - True if configuration is valid
   */
  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection verification failed:', error);
      return false;
    }
  }
}

export default EmailService;
