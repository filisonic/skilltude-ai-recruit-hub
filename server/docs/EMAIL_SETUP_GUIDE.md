# Email Service Setup Guide

This guide will help you configure the EmailService for different email providers.

## Table of Contents

1. [SMTP (Generic)](#smtp-generic)
2. [Gmail SMTP](#gmail-smtp)
3. [SendGrid](#sendgrid)
4. [Testing Locally](#testing-locally)
5. [Production Deployment](#production-deployment)

---

## SMTP (Generic)

Use this configuration for any SMTP server (custom mail server, hosting provider, etc.).

### Configuration

Add to your `.env` file:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=SkillTude Team
```

### Common SMTP Ports

- **587**: TLS (recommended)
- **465**: SSL
- **25**: Unencrypted (not recommended)

### Testing

```bash
# Test SMTP connection
telnet mail.yourdomain.com 587
```

---

## Gmail SMTP

Use Gmail's SMTP server for development or small-scale production.

### Prerequisites

1. Gmail account
2. App Password (if 2FA is enabled)

### Step 1: Enable App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### Step 2: Configuration

Add to your `.env` file:

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM_ADDRESS=your-email@gmail.com
EMAIL_FROM_NAME=SkillTude Team
```

### Important Notes

- Gmail has a sending limit of 500 emails per day
- Not recommended for high-volume production use
- Perfect for development and testing

### Troubleshooting

**Error: "Invalid login"**
- Ensure 2FA is enabled
- Use App Password, not your regular password
- Check that "Less secure app access" is not blocking

**Error: "Daily sending quota exceeded"**
- You've hit Gmail's 500 email/day limit
- Wait 24 hours or upgrade to Google Workspace

---

## SendGrid

SendGrid is recommended for production use with better deliverability and analytics.

### Prerequisites

1. SendGrid account (free tier available)
2. Verified sender email address

### Step 1: Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for a free account (100 emails/day)
3. Verify your email address

### Step 2: Create API Key

1. Go to Settings > [API Keys](https://app.sendgrid.com/settings/api_keys)
2. Click "Create API Key"
3. Name: "SkillTude CV Analysis"
4. Permissions: "Full Access" or "Mail Send" only
5. Copy the API key (you won't see it again!)

### Step 3: Verify Sender Identity

1. Go to Settings > [Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
2. Choose "Single Sender Verification" (easiest) or "Domain Authentication" (recommended for production)
3. Follow the verification steps

### Step 4: Configuration

Add to your `.env` file:

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=SkillTude Team
```

### SendGrid Free Tier Limits

- 100 emails per day
- All essential features included
- Perfect for testing and small deployments

### SendGrid Paid Plans

- **Essentials**: $19.95/mo - 50,000 emails/month
- **Pro**: $89.95/mo - 100,000 emails/month
- Better deliverability and support

### Monitoring

View email activity in SendGrid dashboard:
- Delivery status
- Open rates (if tracking enabled)
- Click rates
- Bounce rates
- Spam reports

---

## Testing Locally

For local development without sending real emails, use a test SMTP service.

### Option 1: Ethereal Email (Recommended)

Ethereal creates temporary test accounts for email testing.

1. Go to [Ethereal Email](https://ethereal.email/)
2. Click "Create Ethereal Account"
3. Copy the credentials

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ethereal-username
SMTP_PASS=your-ethereal-password
EMAIL_FROM_ADDRESS=test@ethereal.email
EMAIL_FROM_NAME=SkillTude Test
```

4. View sent emails at the Ethereal inbox URL provided

### Option 2: MailHog

MailHog runs a local SMTP server that captures emails.

1. Install MailHog:
```bash
# macOS
brew install mailhog

# Windows (using Chocolatey)
choco install mailhog

# Or download from https://github.com/mailhog/MailHog/releases
```

2. Start MailHog:
```bash
mailhog
```

3. Configure:
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
EMAIL_FROM_ADDRESS=test@localhost
EMAIL_FROM_NAME=SkillTude Test
```

4. View emails at http://localhost:8025

### Option 3: Mailtrap

Mailtrap is a hosted email testing service.

1. Sign up at [Mailtrap](https://mailtrap.io/)
2. Create an inbox
3. Copy SMTP credentials

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
EMAIL_FROM_ADDRESS=test@mailtrap.io
EMAIL_FROM_NAME=SkillTude Test
```

---

## Production Deployment

### Checklist

- [ ] Use a professional email provider (SendGrid, AWS SES, etc.)
- [ ] Verify sender domain (SPF, DKIM, DMARC records)
- [ ] Use environment variables for credentials
- [ ] Never commit credentials to version control
- [ ] Set up monitoring and alerts
- [ ] Configure proper error logging
- [ ] Test email deliverability
- [ ] Set up email bounce handling
- [ ] Implement rate limiting
- [ ] Monitor sending quotas

### Environment Variables

Ensure these are set in your production environment:

```env
# Required
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-production-api-key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=SkillTude

# Optional but recommended
EMAIL_DELAY_HOURS=24
NODE_ENV=production
```

### Domain Authentication

For best deliverability, authenticate your domain:

1. **SPF Record**: Add to DNS
```
v=spf1 include:sendgrid.net ~all
```

2. **DKIM**: Follow provider's instructions to add DKIM records

3. **DMARC**: Add DMARC policy
```
v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

### Monitoring

Set up monitoring for:
- Email delivery success rate
- Bounce rate
- Spam complaint rate
- API errors
- Sending quota usage

### Scaling Considerations

For high-volume email sending:

1. **Use a Queue System**: Implement Redis or RabbitMQ
2. **Batch Processing**: Send emails in batches
3. **Multiple Providers**: Have a backup provider
4. **Rate Limiting**: Respect provider limits
5. **Retry Logic**: Already implemented in EmailService

---

## Verification

Test your email configuration:

```typescript
import { EmailService } from './services/EmailService';

const emailService = new EmailService();

// Verify connection
const isConnected = await emailService.verifyConnection();
console.log('Email service connected:', isConnected);

// Send test email
const testResult = {
  overallScore: 75,
  // ... other fields
};

await emailService.sendCVAnalysis(
  'your-test-email@example.com',
  testResult,
  { firstName: 'Test', lastName: 'User', email: 'test@example.com', phone: '123' }
);
```

---

## Troubleshooting

### Common Issues

**"Connection timeout"**
- Check firewall settings
- Verify SMTP host and port
- Try different port (587 vs 465)

**"Authentication failed"**
- Verify username and password
- Check if 2FA requires app password
- Ensure account is active

**"Sender not verified"**
- Complete sender verification in provider dashboard
- Check SPF/DKIM records

**"Rate limit exceeded"**
- Check provider's sending limits
- Implement queue system
- Upgrade plan if needed

**"Emails going to spam"**
- Authenticate domain (SPF, DKIM, DMARC)
- Avoid spam trigger words
- Maintain good sender reputation
- Include unsubscribe link

---

## Support

For provider-specific issues:

- **SendGrid**: [Support Center](https://support.sendgrid.com/)
- **Gmail**: [Gmail Help](https://support.google.com/mail)
- **AWS SES**: [AWS Support](https://aws.amazon.com/ses/support/)

For EmailService issues:
- Check server logs
- Review test suite results
- Verify environment configuration
- Test with Ethereal/MailHog first
