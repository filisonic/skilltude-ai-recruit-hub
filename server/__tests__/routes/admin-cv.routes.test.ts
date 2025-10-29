/**
 * Admin CV Routes Integration Tests
 */

// Import database mock first to prevent real database connections
import '../mocks/database.mock';

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../index';
import { query } from '../../utils/database';
import { jwtConfig } from '../../config';

describe('Admin CV Routes', () => {
  let authToken: string;
  let testSubmissionId: number;
  
  beforeAll(async () => {
    // Create a test admin user if not exists
    const existingUser = await query(
      'SELECT id FROM admin_users WHERE email = ?',
      ['test-admin@skilltude.com']
    );
    
    let userId: number;
    
    if (existingUser.length === 0) {
      const result = await query(
        `INSERT INTO admin_users (uuid, username, email, password_hash, first_name, last_name, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'test-admin-uuid',
          'testadmin',
          'test-admin@skilltude.com',
          'hashed-password',
          'Test',
          'Admin',
          'admin',
          'active'
        ]
      );
      userId = (result as any).insertId;
    } else {
      userId = existingUser[0].id;
    }
    
    // Generate JWT token for testing
    authToken = jwt.sign({ userId }, jwtConfig.secret, { expiresIn: '1h' });
    
    // Create a test CV submission
    const submissionResult = await query(
      `INSERT INTO cv_submissions (
        uuid, first_name, last_name, email, phone,
        cv_filename, cv_file_path, cv_file_size, cv_mime_type,
        status, analysis_score, analysis_results,
        ip_address, user_agent, consent_given, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'test-submission-uuid',
        'John',
        'Doe',
        'john.doe@example.com',
        '+1234567890',
        'test-cv.pdf',
        '/uploads/cvs/test-cv.pdf',
        1024,
        'application/pdf',
        'new',
        75,
        JSON.stringify({
          overallScore: 75,
          strengths: ['Good formatting', 'Clear structure'],
          improvements: [],
          atsCompatibility: 80,
          sectionCompleteness: {
            contactInfo: true,
            summary: true,
            experience: true,
            education: true,
            skills: true,
          },
          detailedFeedback: 'Test feedback',
          analyzedAt: new Date(),
        }),
        '127.0.0.1',
        'test-agent',
        true,
      ]
    );
    
    testSubmissionId = (submissionResult as any).insertId;
  });
  
  afterAll(async () => {
    // Clean up test data
    await query('DELETE FROM cv_submissions WHERE uuid = ?', ['test-submission-uuid']);
    await query('DELETE FROM admin_users WHERE email = ?', ['test-admin@skilltude.com']);
  });
  
  describe('GET /api/admin/cv-submissions', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/admin/cv-submissions')
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should return list of submissions with authentication', async () => {
      const response = await request(app)
        .get('/api/admin/cv-submissions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('submissions');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.submissions)).toBe(true);
    });
    
    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/admin/cv-submissions?status=new')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.submissions.every((s: any) => s.status === 'new')).toBe(true);
    });
    
    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/admin/cv-submissions?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.page).toBe(1);
      expect(response.body.submissions.length).toBeLessThanOrEqual(5);
    });
    
    it('should support search', async () => {
      const response = await request(app)
        .get('/api/admin/cv-submissions?search=John')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.submissions.length).toBeGreaterThan(0);
    });
  });
  
  describe('GET /api/admin/cv-submissions/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/api/admin/cv-submissions/${testSubmissionId}`)
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should return submission details with authentication', async () => {
      const response = await request(app)
        .get(`/api/admin/cv-submissions/${testSubmissionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('uuid');
      expect(response.body).toHaveProperty('firstName');
      expect(response.body).toHaveProperty('analysisResults');
      expect(response.body.id).toBe(testSubmissionId);
    });
    
    it('should return 404 for non-existent submission', async () => {
      const response = await request(app)
        .get('/api/admin/cv-submissions/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('PUT /api/admin/cv-submissions/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put(`/api/admin/cv-submissions/${testSubmissionId}`)
        .send({ status: 'reviewed' })
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should update submission status', async () => {
      const response = await request(app)
        .put(`/api/admin/cv-submissions/${testSubmissionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'reviewed' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.submission.status).toBe('reviewed');
    });
    
    it('should update admin notes', async () => {
      const notes = 'Test admin notes';
      const response = await request(app)
        .put(`/api/admin/cv-submissions/${testSubmissionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ adminNotes: notes })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.submission.adminNotes).toBe(notes);
    });
    
    it('should mark as converted to premium', async () => {
      const response = await request(app)
        .put(`/api/admin/cv-submissions/${testSubmissionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ convertedToPremium: true })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.submission.convertedToPremium).toBe(true);
      expect(response.body.submission.conversionDate).toBeTruthy();
    });
    
    it('should return 404 for non-existent submission', async () => {
      const response = await request(app)
        .put('/api/admin/cv-submissions/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'reviewed' })
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should validate status values', async () => {
      const response = await request(app)
        .put(`/api/admin/cv-submissions/${testSubmissionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid-status' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('GET /api/admin/cv-submissions/:id/download', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/api/admin/cv-submissions/${testSubmissionId}/download`)
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should return 404 for non-existent submission', async () => {
      const response = await request(app)
        .get('/api/admin/cv-submissions/999999/download')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
    
    // Note: Testing actual file download requires creating a test file
    // This is covered in the file storage service tests
  });
  
  describe('Authorization', () => {
    it('should reject invalid tokens', async () => {
      const response = await request(app)
        .get('/api/admin/cv-submissions')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should reject expired tokens', async () => {
      const expiredToken = jwt.sign(
        { userId: 1 },
        jwtConfig.secret,
        { expiresIn: '0s' }
      );
      
      // Wait a moment to ensure token is expired
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await request(app)
        .get('/api/admin/cv-submissions')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
  });
});
