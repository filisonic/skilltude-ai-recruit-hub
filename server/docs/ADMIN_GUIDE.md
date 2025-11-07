# CV Analysis System - Admin Guide

## Overview

This guide provides comprehensive instructions for administrators managing CV submissions through the SkillTude admin dashboard.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Accessing the CV Management Dashboard](#accessing-the-cv-management-dashboard)
3. [Understanding the Submissions List](#understanding-the-submissions-list)
4. [Viewing Submission Details](#viewing-submission-details)
5. [Managing Submission Status](#managing-submission-status)
6. [Downloading CV Files](#downloading-cv-files)
7. [Adding Admin Notes](#adding-admin-notes)
8. [Tracking Conversions](#tracking-conversions)
9. [Following Up with Candidates](#following-up-with-candidates)
10. [Analytics and Reporting](#analytics-and-reporting)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

To manage CV submissions, you need:
- ✓ Admin account with appropriate permissions
- ✓ Access to the SkillTude admin dashboard
- ✓ Understanding of your organization's candidate follow-up process
- ✓ Familiarity with your premium service offerings

### Admin Permissions

CV management requires the following permissions:
- **View Submissions**: See list of all CV submissions
- **View Details**: Access full submission details and analysis results
- **Download CVs**: Download original CV files
- **Update Status**: Change submission status
- **Add Notes**: Add and edit admin notes
- **Track Conversions**: Mark submissions as converted to premium

### Logging In

1. Navigate to the admin dashboard: `https://skilltude.com/admin`
2. Enter your admin credentials
3. Click "Sign In"
4. Navigate to "CV Management" from the main menu

---

## Accessing the CV Management Dashboard

### Navigation

**From the Admin Dashboard:**
1. Click on "CV Management" in the left sidebar
2. Or navigate directly to `/admin/cv-management`

**Dashboard Sections:**
- **Submissions List**: Overview of all CV submissions
- **Submission Details**: Detailed view of individual submissions
- **Analytics**: Statistics and conversion metrics
- **Email Queue Monitor**: Track email delivery status

---

## Understanding the Submissions List

### List View Components

The submissions list displays key information in a table format:

| Column | Description |
|--------|-------------|
| **Name** | Candidate's full name (First + Last) |
| **Email** | Contact email address |
| **Phone** | Contact phone number |
| **Submitted** | Date and time of submission |
| **Status** | Current status (badge with color coding) |
| **Score** | Analysis score (0-100) |
| **Actions** | Quick action buttons |

### Status Badges

Submissions are color-coded by status:

- 🔵 **New** (Blue): Just submitted, not yet reviewed
- 🟡 **Reviewed** (Yellow): Admin has viewed the submission
- 🟢 **Contacted** (Green): Follow-up initiated with candidate
- ✅ **Hired** (Green): Candidate hired or converted to premium
- 🔴 **Rejected** (Red): Not a good fit or no response

### Filtering Submissions

**Filter by Status:**
1. Click the "Status" dropdown at the top of the list
2. Select one or more statuses to filter
3. Click "Apply Filter"
4. Clear filters by clicking "Show All"

**Available Filters:**
- All Submissions
- New (Unreviewed)
- Reviewed
- Contacted
- Hired/Converted
- Rejected

### Searching Submissions

**Search Functionality:**
- Search by candidate name
- Search by email address
- Search by phone number
- Search by submission ID

**How to Search:**
1. Enter search term in the search box
2. Results update automatically as you type
3. Clear search by clicking the "X" icon

---

## Viewing Submission Details

### Opening a Submission

**Method 1: Click Row**
- Click anywhere on a submission row
- Opens detail view in same window

**Method 2: Actions Menu**
- Click the "View" button in the Actions column
- Opens detail view

### Detail View Sections

#### 1. Candidate Information

**Personal Details:**
- Full Name
- Email Address
- Phone Number
- Submission Date
- Submission ID (UUID)

#### 2. CV Analysis Results

**Overall Score:**
- Displayed prominently at the top
- Score out of 100
- Visual indicator (progress bar or gauge)
- Score interpretation (Excellent, Good, Average, etc.)

**Strengths Identified:**
- Bulleted list of 3-5 strengths
- Specific examples from the CV

**Improvement Recommendations:**
- Detailed list of suggested improvements
- Priority level (High, Medium, Low)
- Specific suggestion for each issue

#### 3. Email Status

**Email Delivery Information:**
- Email Sent: Date and time
- Email Opened: Date and time (if tracked)
- Email Status: Sent, Pending, Failed

#### 4. Admin Section

**Status Management:**
- Current status dropdown
- Update button

**Admin Notes:**
- Text area for internal notes
- Visible only to admins

**Conversion Tracking:**
- "Mark as Converted" button
- Conversion date (if converted)

---

## Managing Submission Status

### Status Workflow

The typical workflow for CV submissions:

```
New → Reviewed → Contacted → Hired/Rejected
```

**Detailed Workflow:**

1. **New**: Initial submission, awaiting review
2. **Reviewed**: Admin has viewed the submission and analysis
3. **Contacted**: Admin has reached out to the candidate
4. **Hired**: Candidate hired or converted to premium service
5. **Rejected**: Not a good fit or candidate not interested

### Changing Status

**How to Update Status:**

1. Open the submission detail view
2. Locate the "Status" dropdown in the Admin Section
3. Select the new status from the dropdown
4. Click "Update Status" button
5. Status updates immediately

### When to Use Each Status

**New:**
- Default status for all submissions
- Keep as "New" until you've reviewed the details

**Reviewed:**
- Change to "Reviewed" after examining the submission
- Indicates you've seen the analysis results

**Contacted:**
- Use when you've reached out to the candidate
- Includes: phone calls, emails, messages

**Hired:**
- Candidate accepted a job offer
- Candidate purchased premium CV service

**Rejected:**
- Candidate not a good fit
- Candidate didn't respond to follow-up
- Add reason in Admin Notes

---

## Downloading CV Files

### Single File Download

**From Detail View:**
1. Open submission detail view
2. Click "Download CV" button
3. File downloads to your default download location

**From List View:**
1. Click the download icon in the Actions column
2. File downloads immediately

### Security Considerations

**Access Control:**
- Only authenticated admins can download files
- All downloads are logged
- Files are not publicly accessible

**File Handling:**
- Store downloaded CVs securely
- Don't share CVs without candidate permission
- Follow GDPR and data protection regulations

---

## Adding Admin Notes

### Purpose of Admin Notes

Use admin notes to:
- Record follow-up conversations
- Document candidate responses
- Track next steps
- Share information with other admins

### Adding Notes

**How to Add Notes:**

1. Open submission detail view
2. Scroll to "Admin Notes" section
3. Click in the text area
4. Type your notes
5. Notes auto-save when you click outside the text area

### Note Best Practices

**What to Include:**
- Date and time of contact
- Method of contact (phone, email)
- Summary of conversation
- Candidate's interest level
- Next steps or follow-up required

**Example Note:**
```
2024-12-27 10:30 AM - Called candidate
Spoke with John about premium CV service.
Very interested, requested pricing information.
Follow-up scheduled for 2024-12-30.
```

---

## Tracking Conversions

### What is a Conversion?

A conversion occurs when a CV submission leads to:
- Purchase of premium CV writing service
- Purchase of LinkedIn optimization
- Purchase of any other paid service

### Marking a Conversion

**How to Mark as Converted:**

1. Open submission detail view
2. Locate "Conversion Tracking" section
3. Click "Mark as Converted" button
4. Confirm the conversion
5. Status automatically updated to "Hired"

---

## Following Up with Candidates

### When to Follow Up

**Recommended Follow-Up Timeline:**

**Day 0-1:** Email sent with analysis results
- Wait for candidate response

**Day 3-4:** If email opened but no response
- Send gentle follow-up email
- Ask if they have questions

**Day 7:** If email not opened
- Resend analysis email
- Try alternative contact method (phone)

**Day 14:** If still no response
- Final follow-up attempt
- Mark as "Rejected" if no interest

### Follow-Up Methods

**Email Follow-Up:**
- Use professional, friendly tone
- Reference their CV analysis
- Offer to answer questions

**Phone Follow-Up:**
- Call during business hours
- Ask if they received the analysis
- Gauge interest in premium services

### Follow-Up Email Templates

**Template 1: Initial Follow-Up (Day 3-4)**

```
Subject: Following up on your CV analysis

Hi [FirstName],

I hope you received your CV analysis results. I wanted to follow up 
and see if you had any questions about the feedback.

Your CV scored [Score]/100, and we identified several opportunities 
to strengthen it.

Would you be available for a quick call this week?

Best regards,
[Your Name]
```

---

## Analytics and Reporting

### Accessing Analytics

**Navigation:**
1. Go to CV Management dashboard
2. Click "Analytics" tab
3. Or navigate to `/admin/cv-analytics`

### Key Metrics

**Overview Metrics:**
- **Total Submissions**: All-time CV submissions
- **This Month**: Submissions in current month
- **Conversion Rate**: Percentage converted to premium
- **Average Score**: Mean CV score

**Status Breakdown:**
- Count of submissions in each status
- Percentage distribution

**Monthly Trends:**
- Submissions per month (last 12 months)
- Conversions per month
- Conversion rate trend

---

## Best Practices

### Daily Tasks

**Morning Routine:**
1. Check for new submissions
2. Review overnight submissions
3. Respond to urgent inquiries
4. Follow up on scheduled contacts

**End of Day:**
1. Update status for reviewed submissions
2. Add notes for conversations
3. Schedule follow-ups for next day
4. Mark conversions

### Weekly Tasks

**Weekly Review:**
1. Review all "New" submissions
2. Follow up on "Contacted" submissions
3. Close out unresponsive submissions
4. Review conversion rate

### Candidate Experience

**Provide Excellent Service:**
- Respond promptly to inquiries
- Be professional and friendly
- Respect candidate decisions
- Provide value even if they don't convert

### Data Privacy

**Protect Candidate Data:**
- Only access submissions when necessary
- Don't share CV files without permission
- Follow GDPR and data protection laws
- Secure your admin account

---

## Troubleshooting

### Common Issues

**Issue: Can't Access Dashboard**
- Verify you're logged in
- Check permissions with administrator
- Clear browser cache

**Issue: Can't Download CV**
- Refresh the page
- Try a different browser
- Contact IT support

**Issue: Status Won't Update**
- Refresh the page
- Check internet connection
- Try again in a few minutes

### Getting Help

**Support Contacts:**
- Email: admin-support@skilltude.com
- Phone: +1 (555) 123-4567
- Documentation: https://skilltude.com/admin-docs

---

*Last Updated: December 2024*  
*Version: 1.0*
