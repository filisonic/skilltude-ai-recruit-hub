# CV Analysis System - Backend Server

This directory contains the backend server for the CV Analysis & Upload System.

## Setup

### 1. Install Dependencies

Dependencies are already installed at the project root level. The following packages are used:

- `express` - Web framework
- `multer` - File upload handling
- `pdf-parse` - PDF text extraction
- `mammoth` - DOC/DOCX text extraction
- `nodemailer` - Email delivery
- `express-validator` - Input validation
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration values.

### 3. Create Upload Directory

The upload directory structure is already created at `uploads/cvs/`.

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run server:dev
```

**Production mode:**
```bash
npm run server:build
npm run server:start
```

## Project Structure

```
server/
├── config/           # Configuration files
│   └── index.ts      # Main configuration loader
├── types/            # TypeScript type definitions
│   └── cv.types.ts   # CV-related types
├── services/         # Business logic services (to be added)
├── routes/           # API route handlers (to be added)
├── middleware/       # Custom middleware (to be added)
├── utils/            # Utility functions (to be added)
├── index.ts          # Server entry point
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health check

### CV Upload (to be implemented)
- `POST /api/cv/upload` - Upload CV and user information

### Admin Dashboard (to be implemented)
- `GET /api/admin/cv-submissions` - List all CV submissions
- `GET /api/admin/cv-submissions/:id` - Get submission details
- `PUT /api/admin/cv-submissions/:id` - Update submission
- `GET /api/admin/cv-submissions/:id/download` - Download CV file

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables
- `EMAIL_FROM_ADDRESS` - Email address for sending analysis results
- `DB_HOST` - Database host
- `DB_NAME` - Database name
- `DB_USER` - Database user

### Optional Variables
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- Email provider configuration (SendGrid, AWS SES, Mailgun, or SMTP)
- Rate limiting configuration
- File storage configuration

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Configured for frontend origin
- **Rate Limiting** - Prevents abuse
- **Input Validation** - Using express-validator
- **File Type Validation** - Magic number checking
- **Secure File Storage** - Files stored outside public directory

## Next Steps

The following components will be implemented in subsequent tasks:

1. File storage service
2. Text extraction service
3. CV analysis engine
4. Email service
5. API endpoints
6. Admin dashboard integration
7. Database integration
8. Testing suite

## Development Notes

- The server runs on port 3001 by default (configurable via PORT env var)
- Frontend runs on port 5173 (Vite default)
- CORS is configured to allow requests from the frontend
- All uploaded files are stored in `uploads/cvs/` directory
- TypeScript is used for type safety
- Environment variables are loaded from `.env` file

## Troubleshooting

### Port Already in Use
If port 3001 is already in use, change the PORT in your `.env` file.

### CORS Errors
Ensure FRONTEND_URL in `.env` matches your frontend URL.

### File Upload Issues
Check that the `uploads/cvs/` directory exists and has write permissions.

### Email Delivery Issues
Verify your email provider credentials in `.env` file.
