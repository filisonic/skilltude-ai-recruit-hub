/**
 * Database Mock for Integration Tests
 * This mock allows tests to run without a real database connection
 */

import { vi } from 'vitest';

// In-memory storage for test data
const cvSubmissions: Map<string, any> = new Map();
const adminUsers: Map<string, any> = new Map();
const blogArticles: Map<number, any> = new Map();
let cvAutoIncrementId = 1;
let adminAutoIncrementId = 1;
let blogAutoIncrementId = 1;

// Mock connection object
const createMockConnection = () => ({
  execute: vi.fn(async (sql: string, params?: any[]) => {
    const sqlUpper = sql.trim().toUpperCase();
    
    // Handle INSERT queries
    if (sqlUpper.startsWith('INSERT')) {
      // Admin users insert
      if (sql.includes('admin_users')) {
        const id = adminAutoIncrementId++;
        const uuid = params?.[0] || `admin-uuid-${id}`;
        const email = params?.[2];
        
        adminUsers.set(email, {
          id,
          uuid,
          username: params?.[1],
          email,
          password_hash: params?.[3],
          first_name: params?.[4],
          last_name: params?.[5],
          role: params?.[6],
          status: params?.[7],
        });
        
        return [{ insertId: id, affectedRows: 1 }, {}];
      }
      
      // CV submissions insert
      const id = cvAutoIncrementId++;
      const uuid = params?.[0] || `test-uuid-${id}`;
      
      cvSubmissions.set(uuid, {
        id,
        uuid,
        first_name: params?.[1],
        last_name: params?.[2],
        email: params?.[3],
        phone: params?.[4],
        cv_filename: params?.[5],
        cv_file_path: params?.[6],
        cv_file_size: params?.[7],
        cv_mime_type: params?.[8],
        status: params?.[9] || 'new',
        analysis_score: params?.[10],
        analysis_results: params?.[11],
        ip_address: params?.[12],
        user_agent: params?.[13],
        consent_given: params?.[14],
        converted_to_premium: 0,
        conversion_date: null,
        email_sent_at: null,
        email_opened_at: null,
        submitted_at: new Date(),
        reviewed_at: null,
        reviewed_by: null,
        admin_notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
      
      return [{ insertId: id, affectedRows: 1 }, {}];
    }
    
    // Handle SELECT queries
    if (sqlUpper.startsWith('SELECT')) {
      // Blog articles select
      if (sql.includes('blog_articles')) {
        let results = Array.from(blogArticles.values());
        
        // Filter by status (published only) - MUST be first
        if (sql.includes("status = 'published'") || (sql.includes('status = ?') && params)) {
          results = results.filter(r => r.status === 'published');
        }
        
        // Filter by slug
        if (sql.includes('slug = ?') && params) {
          const slug = params[0];
          results = results.filter(r => r.slug === slug);
          
          // Join with admin_users for author info
          if (results.length > 0 && sql.includes('admin_users')) {
            results = results.map(article => {
              const author = Array.from(adminUsers.values()).find(u => u.id === article.author_id);
              return {
                ...article,
                author_id: author?.id || article.author_id,
                author_first_name: author?.first_name || 'Unknown',
                author_last_name: author?.last_name || 'Author',
                author_email: author?.email || '',
              };
            });
          }
          
          return [results, {}];
        }
        
        // Filter by category
        if (sql.includes('category = ?') && params) {
          // Find the category parameter
          let categoryParam = null;
          if (sql.includes('id != ?')) {
            // For related articles query: category is first param, id is second
            categoryParam = params[0];
          } else {
            // For regular category filter
            categoryParam = params.find(p => typeof p === 'string' && p !== '%' && !p.includes('%'));
          }
          if (categoryParam) {
            results = results.filter(r => r.category === categoryParam);
          }
        }
        
        // Filter by search term
        if (sql.includes('LIKE ?') && params) {
          const searchPattern = params.find(p => typeof p === 'string' && p.includes('%'));
          if (searchPattern) {
            const searchTerm = searchPattern.replace(/%/g, '').toLowerCase();
            results = results.filter(r => 
              r.title?.toLowerCase().includes(searchTerm) ||
              r.excerpt?.toLowerCase().includes(searchTerm) ||
              r.content?.toLowerCase().includes(searchTerm)
            );
          }
        }
        
        // Exclude specific article (for related articles)
        if (sql.includes('id != ?') && params) {
          // Find the id parameter (usually second param after category)
          const excludeId = params[1] || params[0];
          if (excludeId) {
            results = results.filter(r => r.id !== excludeId);
          }
        }
        
        // Handle DISTINCT category queries
        if (sqlUpper.includes('DISTINCT') && sql.includes('category')) {
          // Only include categories from published articles
          const publishedResults = results.filter(r => r.status === 'published');
          const uniqueCategories = new Set<string>();
          publishedResults.forEach(r => {
            if (r.category) uniqueCategories.add(r.category);
          });
          
          return [
            Array.from(uniqueCategories).map(cat => ({
              name: cat,
              slug: cat.toLowerCase().replace(/\s+/g, '-'),
              description: null,
              color: '#4F46E5',
            })),
            {}
          ];
        }
        
        // Order by published_at DESC
        if (sql.includes('ORDER BY') && sql.includes('published_at DESC')) {
          results.sort((a, b) => {
            const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
            const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
            return dateB - dateA;
          });
        }
        
        // Apply OFFSET first, then LIMIT
        if (sql.includes('OFFSET ?') && params) {
          const offsetIndex = params.length - 1;
          const offset = params[offsetIndex];
          if (typeof offset === 'number') {
            results = results.slice(offset);
          }
        }
        
        // Apply LIMIT
        if (sql.includes('LIMIT ?') && params) {
          const limitIndex = sql.includes('OFFSET') ? params.length - 2 : params.length - 1;
          const limit = params[limitIndex];
          if (typeof limit === 'number') {
            results = results.slice(0, limit);
          }
        }
        
        // Join with admin_users for author info (if not already done)
        if (sql.includes('admin_users') && results.length > 0 && !results[0].author_first_name) {
          results = results.map(article => {
            const author = Array.from(adminUsers.values()).find(u => u.id === article.author_id);
            return {
              ...article,
              author_id: author?.id || article.author_id,
              author_first_name: author?.first_name || 'Unknown',
              author_last_name: author?.last_name || 'Author',
              author_email: author?.email || '',
            };
          });
        }
        
        return [results, {}];
      }
      
      // Admin users select
      if (sql.includes('admin_users')) {
        // Select by email
        if (sql.includes('WHERE email = ?')) {
          const email = params?.[0];
          if (email && adminUsers.has(email)) {
            return [[adminUsers.get(email)], {}];
          }
          return [[], {}];
        }
        
        // Select by id
        if (sql.includes('WHERE id = ?')) {
          const id = params?.[0];
          for (const user of adminUsers.values()) {
            if (user.id === id && user.status === 'active') {
              return [[user], {}];
            }
          }
          return [[], {}];
        }
        
        return [[], {}];
      }
      
      // CV submissions select by ID
      if (sql.includes('WHERE id = ?')) {
        const id = params?.[0];
        for (const submission of cvSubmissions.values()) {
          if (submission.id === id) {
            return [[submission], {}];
          }
        }
        return [[], {}];
      }
      
      // CV submissions select by UUID
      if (sql.includes('WHERE uuid = ?')) {
        const uuid = params?.[0];
        if (cvSubmissions.has(uuid)) {
          return [[cvSubmissions.get(uuid)], {}];
        }
        return [[], {}];
      }
      
      // CV submissions list with filters
      if (sql.includes('FROM cv_submissions')) {
        let results = Array.from(cvSubmissions.values());
        
        // Apply status filter
        if (sql.includes('status = ?')) {
          const statusIndex = params?.findIndex((p, i) => {
            return sql.split('?')[i]?.includes('status');
          });
          if (statusIndex !== undefined && statusIndex >= 0) {
            const status = params[statusIndex];
            results = results.filter(r => r.status === status);
          }
        }
        
        // Apply search filter
        if (sql.includes('LIKE ?')) {
          const searchPattern = params?.find(p => typeof p === 'string' && p.includes('%'));
          if (searchPattern) {
            const searchTerm = searchPattern.replace(/%/g, '').toLowerCase();
            results = results.filter(r => 
              r.first_name?.toLowerCase().includes(searchTerm) ||
              r.last_name?.toLowerCase().includes(searchTerm) ||
              r.email?.toLowerCase().includes(searchTerm) ||
              r.phone?.includes(searchTerm)
            );
          }
        }
        
        // Handle COUNT queries
        if (sqlUpper.includes('COUNT(*)')) {
          return [[{ total: results.length }], {}];
        }
        
        // Apply pagination
        if (sql.includes('LIMIT')) {
          const limitMatch = sql.match(/LIMIT\s+\?\s+OFFSET\s+\?/i);
          if (limitMatch && params) {
            const limit = params[params.length - 2];
            const offset = params[params.length - 1];
            results = results.slice(offset, offset + limit);
          }
        }
        
        return [results, {}];
      }
      
      return [[], {}];
    }
    
    // Handle UPDATE queries
    if (sqlUpper.startsWith('UPDATE')) {
      // Blog articles update (view count)
      if (sql.includes('blog_articles')) {
        if (sql.includes('views = views + 1')) {
          const id = params?.[0];
          const article = blogArticles.get(id);
          if (article) {
            article.views = (article.views || 0) + 1;
            article.updated_at = new Date();
            blogArticles.set(id, article);
            return [{ affectedRows: 1 }, {}];
          }
        }
        return [{ affectedRows: 0 }, {}];
      }
      
      if (sql.includes('cv_submissions')) {
        const id = params?.[params.length - 1];
        
        for (const [uuid, submission] of cvSubmissions.entries()) {
          if (submission.id === id) {
            // Parse SET clause to update fields
            if (sql.includes('status = ?')) {
              const statusIndex = sql.split('?').findIndex(s => s.includes('status'));
              if (statusIndex >= 0 && params[statusIndex] !== undefined) {
                submission.status = params[statusIndex];
              }
            }
            
            if (sql.includes('admin_notes = ?')) {
              const notesIndex = sql.split('?').findIndex(s => s.includes('admin_notes'));
              if (notesIndex >= 0 && params[notesIndex] !== undefined) {
                submission.admin_notes = params[notesIndex];
              }
            }
            
            if (sql.includes('converted_to_premium = ?')) {
              const convertedIndex = sql.split('?').findIndex(s => s.includes('converted_to_premium'));
              if (convertedIndex >= 0 && params[convertedIndex] !== undefined) {
                submission.converted_to_premium = params[convertedIndex] ? 1 : 0;
              }
            }
            
            if (sql.includes('conversion_date = NOW()')) {
              submission.conversion_date = new Date();
            }
            
            if (sql.includes('reviewed_at = NOW()')) {
              submission.reviewed_at = new Date();
            }
            
            if (sql.includes('reviewed_by = ?')) {
              const reviewedByIndex = sql.split('?').findIndex(s => s.includes('reviewed_by'));
              if (reviewedByIndex >= 0 && params[reviewedByIndex] !== undefined) {
                submission.reviewed_by = params[reviewedByIndex];
              }
            }
            
            submission.updated_at = new Date();
            cvSubmissions.set(uuid, submission);
            
            return [{ affectedRows: 1 }, {}];
          }
        }
      }
      
      return [{ affectedRows: 0 }, {}];
    }
    
    // Handle DELETE queries
    if (sqlUpper.startsWith('DELETE')) {
      // Delete admin users
      if (sql.includes('admin_users')) {
        const email = params?.[0];
        if (email && adminUsers.has(email)) {
          adminUsers.delete(email);
          return [{ affectedRows: 1 }, {}];
        }
        return [{ affectedRows: 0 }, {}];
      }
      
      // Delete CV submissions
      const uuid = params?.[0];
      if (uuid && cvSubmissions.has(uuid)) {
        cvSubmissions.delete(uuid);
        return [{ affectedRows: 1 }, {}];
      }
      
      return [{ affectedRows: 0 }, {}];
    }
    
    // Default response
    return [[], {}];
  }),
  
  beginTransaction: vi.fn().mockResolvedValue(undefined),
  commit: vi.fn().mockResolvedValue(undefined),
  rollback: vi.fn().mockResolvedValue(undefined),
  release: vi.fn(),
});

// Error simulation for testing error scenarios
let simulatedError: string | null = null;

export const simulateDatabaseError = (errorType: 'connection' | 'insert' | 'query' | 'update') => {
  simulatedError = errorType;
};

export const resetDatabaseError = () => {
  simulatedError = null;
};

// Update the mock connection to throw errors when simulated
const createMockConnectionWithErrors = () => {
  const conn = createMockConnection();
  const originalExecute = conn.execute;
  
  conn.execute = vi.fn(async (sql: string, params?: any[]) => {
    // Check if we should simulate an error
    if (simulatedError === 'connection') {
      throw new Error('ECONNREFUSED: Database connection refused');
    }
    
    const sqlUpper = sql.trim().toUpperCase();
    
    if (simulatedError === 'insert' && sqlUpper.startsWith('INSERT')) {
      throw new Error('ER_DUP_ENTRY: Duplicate entry for key');
    }
    
    if (simulatedError === 'query' && sqlUpper.startsWith('SELECT')) {
      throw new Error('ER_SYNTAX_ERROR: SQL syntax error');
    }
    
    if (simulatedError === 'update' && sqlUpper.startsWith('UPDATE')) {
      throw new Error('ER_LOCK_WAIT_TIMEOUT: Lock wait timeout exceeded');
    }
    
    // Otherwise, proceed with normal execution
    return originalExecute(sql, params);
  });
  
  return conn;
};

// Mock pool object
const mockPool = {
  execute: vi.fn(async (sql: string, params?: any[]) => {
    const conn = createMockConnectionWithErrors();
    return conn.execute(sql, params);
  }),
  
  query: vi.fn(async (sql: string, params?: any[]) => {
    const conn = createMockConnectionWithErrors();
    return conn.execute(sql, params);
  }),
  
  getConnection: vi.fn(async () => createMockConnectionWithErrors()),
  
  end: vi.fn().mockResolvedValue(undefined),
};

// Mock the database utility module
vi.mock('../../utils/database', () => ({
  getPool: () => mockPool,
  
  query: async (sql: string, params?: any[]) => {
    const conn = createMockConnection();
    const [rows] = await conn.execute(sql, params);
    return rows;
  },
  
  transaction: async (callback: any) => {
    const conn = createMockConnection();
    try {
      await conn.beginTransaction();
      const result = await callback(conn);
      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
  
  closePool: async () => {
    cvSubmissions.clear();
    adminUsers.clear();
    cvAutoIncrementId = 1;
    adminAutoIncrementId = 1;
    return mockPool.end();
  },
}));

// Export utilities for test cleanup
export const clearTestData = () => {
  cvSubmissions.clear();
  adminUsers.clear();
  blogArticles.clear();
  cvAutoIncrementId = 1;
  adminAutoIncrementId = 1;
  blogAutoIncrementId = 1;
};

export const getTestData = () => Array.from(cvSubmissions.values());

export const getTestDataByUuid = (uuid: string) => cvSubmissions.get(uuid);

export const getTestDataById = (id: number) => {
  for (const submission of cvSubmissions.values()) {
    if (submission.id === id) {
      return submission;
    }
  }
  return null;
};

export const getAllTestData = () => Array.from(cvSubmissions.values());

export const getAdminUsers = () => Array.from(adminUsers.values());

// Blog article helpers
export const addTestBlogArticle = (data: any) => {
  const id = blogAutoIncrementId++;
  const article = {
    id,
    uuid: data.uuid || `blog-uuid-${id}`,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    featured_image_url: data.featured_image_url || null,
    category: data.category,
    tags: data.tags || '[]',
    author_id: data.author_id,
    status: data.status || 'draft',
    published_at: data.published_at || null,
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || new Date(),
    views: data.views || 0,
  };
  
  blogArticles.set(id, article);
  return id;
};

export const addTestAdminUser = (data: any) => {
  const id = adminAutoIncrementId++;
  const user = {
    id,
    uuid: data.uuid || `admin-uuid-${id}`,
    username: data.username || data.email,
    email: data.email,
    password_hash: data.password_hash,
    first_name: data.first_name,
    last_name: data.last_name,
    role: data.role || 'admin',
    status: data.status || 'active',
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || new Date(),
  };
  
  adminUsers.set(user.email, user);
  return id;
};

export const getBlogArticles = () => Array.from(blogArticles.values());

export const getBlogArticleById = (id: number) => blogArticles.get(id);
