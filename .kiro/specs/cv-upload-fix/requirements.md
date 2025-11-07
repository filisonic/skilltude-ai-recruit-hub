# Requirements Document - CV Upload Fix

## Introduction

The CV upload functionality is currently failing with a "failed to fetch" error. Users are unable to submit their CVs for the free 24-hour assessment. This is a critical issue affecting the core value proposition of the website. The issue appears to be related to incorrect API endpoint configuration where the frontend cannot reach the backend server running on Render. Additionally, the CV upload form is currently on the home page, but it should be moved to a dedicated page until the functionality is fully fixed and tested.

## Requirements

### Requirement 1: Diagnose API Connection Issue

**User Story:** As a developer, I want to identify why the CV upload is failing, so that I can fix the connection between frontend and backend.

#### Acceptance Criteria

1. WHEN investigating the error THEN the system SHALL identify the root cause of the "failed to fetch" error
2. WHEN checking environment variables THEN the system SHALL verify the VITE_API_URL is correctly configured
3. WHEN testing the backend THEN the system SHALL confirm the API endpoint is accessible
4. IF the backend is not accessible THEN the system SHALL identify whether it's a URL, CORS, or server issue

### Requirement 2: Fix API Endpoint Configuration for Render

**User Story:** As a user, I want to upload my CV successfully, so that I can receive my free professional analysis within 24 hours.

#### Acceptance Criteria

1. WHEN a user submits the CV upload form THEN the system SHALL successfully connect to the backend API on Render
2. WHEN the API request is made THEN the system SHALL use the correct Render API URL
3. WHEN the backend receives the request THEN the system SHALL accept requests from the frontend domain (skilltude.com)
4. IF the environment configuration is incorrect THEN the system SHALL update VITE_API_URL to point to the Render backend
5. WHEN checking CORS THEN the system SHALL verify the Render backend allows requests from https://skilltude.com

### Requirement 3: Verify End-to-End Functionality

**User Story:** As a user, I want confirmation that my CV was uploaded successfully, so that I know my analysis is being processed.

#### Acceptance Criteria

1. WHEN a CV is uploaded successfully THEN the system SHALL display a success message to the user
2. WHEN the upload completes THEN the system SHALL store the CV file in the correct location
3. WHEN the submission is saved THEN the system SHALL create a database record with all required fields
4. WHEN testing the fix THEN the system SHALL verify the entire upload flow works from frontend to database

### Requirement 4: Move CV Upload to Dedicated Page

**User Story:** As a site visitor, I want the home page to be clean and focused, so that I can understand the company's services without being immediately prompted to upload my CV.

#### Acceptance Criteria

1. WHEN visiting the home page THEN the system SHALL NOT display the full CV upload form
2. WHEN the CV upload is moved THEN the system SHALL create a dedicated page at /cv-analysis or /free-cv-review
3. WHEN on the home page THEN the system SHALL display a call-to-action button that links to the CV upload page
4. WHEN clicking the CTA THEN the system SHALL navigate to the dedicated CV upload page
5. WHEN the CV upload page loads THEN the system SHALL display the full CVUploadHero component

### Requirement 5: Document the Solution

**User Story:** As a developer, I want clear documentation of the fix, so that similar issues can be prevented or quickly resolved in the future.

#### Acceptance Criteria

1. WHEN the fix is complete THEN the system SHALL document the root cause of the issue
2. WHEN documenting THEN the system SHALL explain the correct Render API URL configuration
3. WHEN providing guidance THEN the system SHALL include steps to verify the fix is working
4. WHEN updating documentation THEN the system SHALL note the Render backend URL and required environment variables
