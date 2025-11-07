# Design Document

## Overview

This design document outlines the architecture for integrating the blog frontend with the backend database. The solution follows the existing codebase patterns, using Express.js for the backend API, MySQL for data storage, and React with TypeScript for the frontend. The design ensures that blog articles created through the admin interface are immediately available to website visitors.

## Architecture

### System Components

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │◄────────┤  Express API     │◄────────┤  MySQL Database │
│  (Blog Pages)   │  HTTP   │  (Blog Routes)   │  Query  │  (blog_articles)│
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

### Data Flow

1. **Blog List Page Load**:
   - Frontend requests `/api/blog/articles`
   - Backend queries database for published articles
   - Backend returns articles with author information
   - Frontend displays articles with search/filter capabilities

2. **Blog Post Detail Page Load**:
   - Frontend requests `/api/blog/articles/:slug`
   - Backend queries database for specific article
   - Backend increments view count
   - Backend fetches related articles from same category
   - Frontend displays full article with related content

## Components and Interfaces

### Backend Components

#### 1. Blog Routes (`server/routes/blog.routes.ts`)

**Purpose**: Handle HTTP requests for blog articles

**Endpoints**:
- `GET /api/blog/articles` - List all published articles
- `GET /api/blog/articles/:slug` - Get single article by slug
- `GET /api/blog/categories` - Get all blog categories

**Responsibilities**:
- Request validation
- Database queries
- Response formatting
- Error handling
- View count tracking

#### 2. Blog Service (`server/services/BlogService.ts`)

**Purpose**: Business logic for blog operations

**Methods**:
```typescript
class BlogService {
  // Get all published articles with optional filters
  async getPublishedArticles(filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<BlogArticle[]>
  
  // Get single article by slug
  async getArticleBySlug(slug: string): Promise<BlogArticle | null>
  
  // Increment view count
  async incrementViewCount(articleId: number): Promise<void>
  
  // Get related articles
  async getRelatedArticles(articleId: number, category: string, limit: number): Promise<BlogArticle[]>
  
  // Get all categories
  async getCategories(): Promise<BlogCategory[]>
}
```

**Responsibilities**:
- Database interactions
- Data transformation
- Business logic validation
- Caching logic

### Frontend Components

#### 1. Blog List Page (`src/pages/Blog.tsx`)

**Current State**: Uses hardcoded `blogPosts` array

**Updated Design**:
- Remove hardcoded data
- Add API integration using React hooks
- Implement loading states
- Implement error handling
- Maintain existing search/filter UI
- Add retry mechanism for failed requests

**Key Changes**:
```typescript
// Replace hardcoded array with API call
const [posts, setPosts] = useState<BlogPost[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchBlogPosts();
}, []);

const fetchBlogPosts = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/api/blog/articles`);
    const data = await response.json();
    setPosts(data.articles);
  } catch (err) {
    setError('Failed to load articles');
  } finally {
    setLoading(false);
  }
};
```

#### 2. Blog Post Detail Page (`src/pages/BlogPost.tsx`)

**Current State**: Uses hardcoded `samplePosts` object

**Updated Design**:
- Remove hardcoded data
- Add API integration for single article
- Fetch related articles from API
- Implement loading states
- Implement 404 handling
- Add retry mechanism

**Key Changes**:
```typescript
// Replace hardcoded data with API call
const [post, setPost] = useState<BlogPostData | null>(null);
const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchArticle(id);
}, [id]);

const fetchArticle = async (slug: string) => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/api/blog/articles/${slug}`);
    if (response.status === 404) {
      setError('Article not found');
      return;
    }
    const data = await response.json();
    setPost(data.article);
    setRelatedPosts(data.relatedArticles);
  } catch (err) {
    setError('Failed to load article');
  } finally {
    setLoading(false);
  }
};
```

#### 3. API Configuration (`src/lib/api.ts`)

**Purpose**: Centralized API configuration

**Content**:
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const blogApi = {
  getArticles: () => `${API_URL}/api/blog/articles`,
  getArticle: (slug: string) => `${API_URL}/api/blog/articles/${slug}`,
  getCategories: () => `${API_URL}/api/blog/categories`,
};
```

## Data Models

### Database Schema (Existing)

```sql
CREATE TABLE blog_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    featured_image_url VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    tags JSON,
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    views INT DEFAULT 0,
    
    FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at)
);
```

### TypeScript Interfaces

#### Backend Types (`server/types/blog.types.ts`)

```typescript
export interface BlogArticle {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  category: string;
  tags: string[];
  author: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  status: 'draft' | 'published' | 'archived';
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  views: number;
  read_time?: string; // Calculated field
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string;
}

export interface BlogArticleFilters {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
```

#### Frontend Types (`src/types/blog.types.ts`)

```typescript
export interface BlogPost {
  id: string; // uuid
  title: string;
  excerpt: string;
  author: string; // Full name
  date: string; // Formatted date
  category: string;
  image: string; // featured_image_url
  slug: string;
}

export interface BlogPostData extends BlogPost {
  content: string;
  tags: string[];
  readTime: string;
  views: number;
}
```

## Error Handling

### Backend Error Responses

**Standard Error Format**:
```typescript
{
  success: false,
  error: string,
  details?: any
}
```

**HTTP Status Codes**:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (article doesn't exist)
- `500` - Internal Server Error

**Error Logging**:
- Use existing `logger` utility
- Log all errors with context
- Include request details for debugging

### Frontend Error Handling

**Error States**:
```typescript
interface ErrorState {
  message: string;
  canRetry: boolean;
}
```

**Error Display**:
- User-friendly error messages
- Retry button for network errors
- 404 page for missing articles
- Fallback UI for partial failures

**Error Examples**:
- Network error: "Unable to load articles. Please check your connection."
- 404 error: "Article not found. It may have been removed or the link is incorrect."
- Server error: "Something went wrong. Please try again later."

## Testing Strategy

### Backend Tests

**Unit Tests** (`server/__tests__/services/BlogService.test.ts`):
- Test `getPublishedArticles()` with various filters
- Test `getArticleBySlug()` with valid and invalid slugs
- Test `incrementViewCount()` increments correctly
- Test `getRelatedArticles()` returns correct articles
- Mock database connections

**Integration Tests** (`server/__tests__/routes/blog.routes.test.ts`):
- Test GET `/api/blog/articles` returns published articles only
- Test GET `/api/blog/articles/:slug` returns correct article
- Test GET `/api/blog/articles/:slug` returns 404 for invalid slug
- Test view count increments on article view
- Test related articles are returned
- Test error handling for database failures

### Frontend Tests

**Component Tests** (`src/__tests__/pages/Blog.test.tsx`):
- Test loading state displays correctly
- Test articles render after successful fetch
- Test error state displays correctly
- Test search functionality filters articles
- Test category filter works correctly
- Test pagination works correctly
- Test retry button on error

**Component Tests** (`src/__tests__/pages/BlogPost.test.tsx`):
- Test loading state displays correctly
- Test article renders after successful fetch
- Test 404 state for missing article
- Test related articles display
- Test markdown content renders correctly
- Test retry button on error

### Manual Testing Checklist

- [ ] Create article in admin panel
- [ ] Verify article appears on blog list page
- [ ] Verify article can be opened and read
- [ ] Verify view count increments
- [ ] Verify search functionality works
- [ ] Verify category filter works
- [ ] Verify related articles display
- [ ] Test with slow network connection
- [ ] Test with network disconnected
- [ ] Test with invalid article slug

## Performance Considerations

### Backend Optimization

**Database Queries**:
- Use indexes on `slug`, `status`, `category`, `published_at`
- Limit query results with pagination
- Use JOIN to fetch author information in single query
- Cache frequently accessed articles

**Caching Strategy**:
```typescript
// Simple in-memory cache with TTL
const articleCache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedArticle(slug: string) {
  const cached = articleCache.get(slug);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  return null;
}

function setCachedArticle(slug: string, data: any) {
  articleCache.set(slug, {
    data,
    expires: Date.now() + CACHE_TTL,
  });
}
```

### Frontend Optimization

**Data Fetching**:
- Fetch only necessary fields
- Implement pagination (6 articles per page)
- Use lazy loading for images
- Cache API responses in component state

**Rendering**:
- Use React.memo for article cards
- Lazy load markdown renderer
- Implement virtual scrolling for long lists (future enhancement)
- Debounce search input

**Bundle Size**:
- Code split blog pages
- Lazy load markdown parser
- Optimize images with proper sizing

## Security Considerations

### Backend Security

**Input Validation**:
- Validate slug format (alphanumeric, hyphens only)
- Sanitize search queries to prevent SQL injection
- Use parameterized queries for all database operations

**Access Control**:
- Only return published articles to public API
- Verify article status before returning
- Rate limit API endpoints

**SQL Injection Prevention**:
```typescript
// Use parameterized queries
const [rows] = await connection.execute(
  'SELECT * FROM blog_articles WHERE slug = ? AND status = ?',
  [slug, 'published']
);
```

### Frontend Security

**XSS Prevention**:
- Sanitize markdown content before rendering
- Use DOMPurify for HTML sanitization
- Escape user-generated content in search

**API Security**:
- Use HTTPS in production
- Validate API responses
- Handle malicious responses gracefully

## Deployment Considerations

### Environment Variables

**Backend** (`.env`):
```
# Existing variables...

# Blog configuration (optional)
BLOG_CACHE_TTL=300000
BLOG_ARTICLES_PER_PAGE=6
```

**Frontend** (`vite` environment):
```
VITE_API_URL=https://api.skilltude.com
```

### Database Migration

**No migration needed** - `blog_articles` table already exists in schema

**Verification Steps**:
1. Verify table exists: `SHOW TABLES LIKE 'blog_articles';`
2. Verify indexes exist: `SHOW INDEX FROM blog_articles;`
3. Verify foreign key exists: `SHOW CREATE TABLE blog_articles;`

### Deployment Steps

1. **Backend**:
   - Deploy new blog routes
   - Verify database connection
   - Test API endpoints
   - Monitor error logs

2. **Frontend**:
   - Update environment variables
   - Build production bundle
   - Deploy to hosting
   - Verify API connectivity

3. **Testing**:
   - Smoke test all blog pages
   - Verify articles load correctly
   - Test error scenarios
   - Monitor performance metrics

## Future Enhancements

### Phase 2 Features (Not in Current Scope)

- **Comments System**: Allow users to comment on articles
- **Social Sharing**: Add share buttons for social media
- **Newsletter Integration**: Subscribe to blog updates
- **Article Recommendations**: ML-based article suggestions
- **Full-Text Search**: Elasticsearch integration for better search
- **Analytics Dashboard**: Track article performance
- **RSS Feed**: Generate RSS feed for blog
- **Article Series**: Link related articles in a series
- **Author Pages**: Dedicated pages for each author
- **Reading Progress**: Show reading progress indicator

### Performance Enhancements

- **CDN Integration**: Serve images from CDN
- **Server-Side Rendering**: SSR for better SEO
- **GraphQL API**: More efficient data fetching
- **Redis Caching**: Distributed caching layer
- **Image Optimization**: Automatic image resizing and optimization

## Conclusion

This design provides a robust, scalable solution for integrating the blog frontend with the database backend. It follows existing codebase patterns, ensures security and performance, and provides a solid foundation for future enhancements. The implementation will enable administrators to manage blog content dynamically while providing website visitors with a fast, reliable reading experience.
