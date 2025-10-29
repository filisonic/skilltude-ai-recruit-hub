# EmailService Documentation

## Overview

The `EmailService` class handles sending CV analysis emails to users with professional formatting, retry logic, and support for multiple email providers.

## Features

- ✅ **Multiple Provider Support**: SMTP, SendGrid, AWS SES (planned), Mailgun (planned)
- ✅ **Retry Logic**: Automatic retry with exponential backoff (3 attempts)
- ✅ **HTML & Plain Text**: Beautiful HTML emails with plain text fallback
- ✅ **Dynamic Content**: Personalized emails based on analysis results
- ✅ **Score Interpretation**: Context-aware messaging based on CV score
- ✅ **Professional Branding**: Consistent with SkillTude design
- ✅ **CTA Integration**: Compelling call-to-action for premium services

## Installation

The EmailService requires `nodemailer` which is already included in the project dependencies:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## Configuration

Configure the email service through environment variables in your `.env` file:

### SMTP Configuration

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM_ADDRESS=noreply@skilltude.com
EMAIL_FROM_NAME=SkillTude Team
```

### SendGrid Configuration

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM_ADDRESS=noreply@skilltude.com
EMAIL_FROM_NAME=SkillTude Team
```

## Usage

### Basic Usage

```typescript
import { EmailService } from './services/EmailService';
import { CVAnalysisResult, UserData } from './types/cv.types';

// Initialize the service
const emailService = new EmailService();

// Prepare user data
const userData: UserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
};

// Prepare analysis results
const analysisResult: CVAnalysisResult = {
  overallScore: 75,
  atsCompatibility: 80,
  strengths: [
    'Clear contact information',
    'Strong action verbs',
    'Quantifiable achievements',
  ],
  improvements: [
    {
      category: 'Professional Summary',
      priority: 'high',
      issue: 'Missing professional summary',
      suggestion: 'Add a 3-4 sentence summary',
      example: 'Results-driven professional with...',
    },
  ],
  sectionCompleteness: {
    contactInfo: true,
    summary: false,
    experience: true,
    education: true,
    skills: true,
  },
  detailedFeedback: 'Good CV with room for improvement',
  analyzedAt: new Date(),
};

// Send the email
try {
  const success = await emailService.sendCVAnalysis(
    userData.email,
    analysisResult,
    userData
  );
  
  if (success) {
    console.log('Email sent successfully!');
  }
} catch (error) {
  console.error('Failed to send email:', error);
}
```

### Verify Connection

Before sending emails, you can verify the email service configuration:

```typescript
const isConnected = await emailService.verifyConnection();
if (!isConnected) {
  console.error('Email service not properly configured');
}
```

## Email Content

### Subject Line

The subject line includes the user's CV score:

```
Your CV Analysis Results - 75/100
```

### Email Sections

1. **Header**: SkillTude branding and logo
2. **Greeting**: Personalized with user's first name
3. **Score Section**: Large, prominent score display with interpretation
4. **Strengths Section**: Bullet-pointed list of what the user is doing well
5. **Improvements Section**: Detailed improvement suggestions with:
   - Category (e.g., "Professional Summary")
   - Priority level (high/medium/low)
   - Issue description
   - Actionable suggestion
   - Example (when applicable)
6. **CTA Section**: Call-to-action for premium CV writing services with:
   - Service benefits
   - Contact information
   - Limited-time discount offer
7. **Footer**: Contact details, social links, unsubscribe option

### Score Interpretation

The email content adapts based on the CV score:

- **85-100**: "Excellent! Your CV is well-structured and professional..."
- **70-84**: "Good work! Your CV has a solid foundation..."
- **50-69**: "Your CV shows potential, but there are several areas..."
- **0-49**: "Your CV needs significant improvements..."

## Retry Logic

The service automatically retries failed email sends with exponential backoff:

- **Attempt 1**: Immediate
- **Attempt 2**: After 1 second
- **Attempt 3**: After 2 seconds
- **Attempt 4**: After 4 seconds

If all attempts fail, an error is thrown.

## Error Handling

The service throws `CVUploadException` errors with appropriate error codes:

```typescript
try {
  await emailService.sendCVAnalysis(email, result, userData);
} catch (error) {
  if (error instanceof CVUploadException) {
    console.error(`Error ${error.code}: ${error.message}`);
    // Handle specific error codes
  }
}
```

## Testing

Run the test suite:

```bash
npm test server/__tests__/services/EmailService.test.ts
```

The test suite covers:
- Email sending functionality
- Score interpretation for different ranges
- Content formatting (strengths, improvements, CTA)
- Edge cases (empty arrays, etc.)
- Connection verification

## Email Templates

### HTML Template

The HTML template includes:
- Responsive design (mobile-friendly)
- Professional styling with gradients
- Color-coded priority levels
- Branded header and footer
- Accessible markup

### Plain Text Template

A plain text version is automatically generated for email clients that don't support HTML, maintaining:
- Clear structure with ASCII dividers
- All content from HTML version
- Readable formatting

## Provider-Specific Notes

### SMTP

- Works with any SMTP server (Gmail, Outlook, custom)
- Requires app-specific password for Gmail
- Port 587 (TLS) or 465 (SSL) recommended

### SendGrid

- Requires SendGrid API key
- Uses SMTP relay (smtp.sendgrid.net)
- Recommended for production use
- Better deliverability and analytics

### AWS SES (Planned)

- Not yet implemented
- Will require AWS SDK integration

### Mailgun (Planned)

- Not yet implemented
- Will require Mailgun SDK integration

## Best Practices

1. **Always verify connection** before sending emails in production
2. **Log all email attempts** for debugging and analytics
3. **Monitor delivery rates** to catch configuration issues
4. **Use environment variables** for sensitive credentials
5. **Test with different score ranges** to ensure proper interpretation
6. **Implement database logging** to track email status

## Integration Example

Here's how to integrate the EmailService into your CV upload workflow:

```typescript
import { EmailService } from './services/EmailService';
import { CVAnalysisEngine } from './services/CVAnalysisEngine';
import { TextExtractionService } from './services/TextExtractionService';

async function processCVSubmission(file: File, userData: UserData) {
  // 1. Extract text from CV
  const textExtractor = new TextExtractionService();
  const cvText = await textExtractor.extractText(file.path, file.mimetype);
  
  // 2. Analyze CV
  const analysisEngine = new CVAnalysisEngine();
  const analysisResult = await analysisEngine.analyzeCV(cvText);
  
  // 3. Save to database
  // ... database code ...
  
  // 4. Send email
  const emailService = new EmailService();
  await emailService.sendCVAnalysis(
    userData.email,
    analysisResult,
    userData
  );
  
  console.log('CV processed and email sent successfully!');
}
```

## Troubleshooting

### Email Not Sending

1. Check environment variables are set correctly
2. Verify SMTP credentials
3. Check firewall/network settings
4. Review logs for specific error messages
5. Test connection with `verifyConnection()`

### Gmail SMTP Issues

- Enable "Less secure app access" or use App Password
- Use port 587 with TLS
- Check Gmail sending limits

### SendGrid Issues

- Verify API key is valid
- Check SendGrid account status
- Review SendGrid activity logs
- Ensure sender email is verified

## Future Enhancements

- [ ] AWS SES provider implementation
- [ ] Mailgun provider implementation
- [ ] Email open tracking
- [ ] Click tracking for CTA links
- [ ] A/B testing for email templates
- [ ] Scheduled email delivery
- [ ] Email queue system for bulk sending
- [ ] Template customization per industry
- [ ] Multi-language support

## License

Part of the SkillTude CV Analysis System.
