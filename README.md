# CV Analysis System

A full-stack web application for CV/resume analysis and talent acquisition, built with React, TypeScript, Node.js, and Express.

## 🚀 Features

- **CV Upload & Analysis**: Upload CVs in PDF format for automated analysis
- **Admin Dashboard**: Comprehensive admin panel for managing CV submissions
- **Email Notifications**: Automated email system for applicant communication
- **Analytics & Monitoring**: Track conversion rates and system health
- **Responsive Design**: Mobile-friendly interface
- **Security**: Rate limiting, input validation, and secure file handling

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- MySQL database
- PDF parsing (pdf-parse)
- Email service (Nodemailer)
- File upload handling (Multer)

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Install dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Set up environment variables

**Frontend (.env):**
```env
# API URL for backend connection
VITE_API_URL=http://localhost:3001
```

**Backend (server/.env):**
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@yourdomain.com

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_jwt_secret_key

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 4. Set up the database

Run the SQL migration scripts in order:
```bash
# From the project root
mysql -u your_user -p your_database < database_migrations/create_tables.sql
```

Or use the migration scripts:
```bash
cd database_migrations
node apply_migration.js
```

### 5. Build the backend
```bash
cd server
npm run build
```

## 🚀 Running the Application

### Development Mode

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
cd server
npm run dev
```

### Production Mode

**Build frontend:**
```bash
npm run build
```

**Start backend:**
```bash
cd server
npm start
```

## 📁 Project Structure

```
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom hooks
│   └── styles/            # CSS files
├── server/                # Backend source
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── database_migrations/   # SQL migration scripts
└── public/                # Static assets
```

## ⚙️ Environment Configuration

### Frontend Environment Variables

The frontend uses Vite's environment variable system. Variables must be prefixed with `VITE_` to be exposed to the client.

**Development (.env):**
```env
VITE_API_URL=http://localhost:3001
```

**Production (.env.production):**
```env
VITE_API_URL=https://api.yourdomain.com
```

The `VITE_API_URL` variable is used by the frontend to connect to the backend API. It's configured in `src/lib/api.ts` and used throughout the application for:
- Blog article fetching
- CV upload and status checking
- Admin dashboard operations

**Important Notes:**
- The API URL should point to your backend server
- In development, it typically points to `http://localhost:3001`
- In production, it should point to your deployed backend URL
- The variable is read at build time, so you need to rebuild the frontend if you change it

## 🔐 Security Features

- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file upload handling
- JWT-based authentication
- CORS configuration
- SQL injection prevention
- XSS protection

## 📊 API Endpoints

### Public Endpoints
- `POST /api/cv/upload` - Upload CV for analysis
- `GET /api/cv/status/:id` - Check CV processing status
- `GET /api/blog/articles` - Get all published blog articles
- `GET /api/blog/articles/:slug` - Get single blog article by slug
- `GET /api/blog/categories` - Get all blog categories

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/cv/submissions` - List all submissions
- `GET /api/admin/cv/:id` - Get submission details
- `PUT /api/admin/cv/:id/status` - Update submission status
- `POST /api/admin/cv/:id/email` - Send email to applicant

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Backend tests
cd server
npm test
```

## 📦 Deployment

See [DEPLOYMENT_BUILD_GUIDE.md](./DEPLOYMENT_BUILD_GUIDE.md) for detailed deployment instructions.

### Quick Deploy to Render

1. Push code to GitHub
2. Connect repository to Render
3. Configure environment variables
4. Deploy!

See [Render Deployment Guide](#) for step-by-step instructions.

## 📝 Documentation

- [API Documentation](./server/docs/API_DOCUMENTATION.md)
- [Admin Guide](./server/docs/ADMIN_GUIDE.md)
- [User Guide](./server/docs/USER_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_BUILD_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Your Name - [Your Website](https://yourwebsite.com)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for efficient CV processing
- Thanks to all contributors

---

**Note:** Remember to update environment variables before deploying to production!
