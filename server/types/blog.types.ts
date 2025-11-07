/**
 * Blog Types and Interfaces
 * 
 * Type definitions for blog articles, categories, and related data structures
 * used throughout the blog system.
 */

/**
 * Author information embedded in blog articles
 */
export interface BlogAuthor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

/**
 * Complete blog article with all fields from database
 */
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
  author: BlogAuthor;
  status: 'draft' | 'published' | 'archived';
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  views: number;
  read_time?: string; // Calculated field
}

/**
 * Blog category information
 */
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string;
}

/**
 * Filters for querying blog articles
 */
export interface BlogArticleFilters {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Database row structure for blog articles
 * Raw data from MySQL before transformation
 */
export interface BlogArticleRow {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  category: string;
  tags: string; // JSON string from database
  author_id: number;
  status: 'draft' | 'published' | 'archived';
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  views: number;
  // Author fields from JOIN
  author_first_name?: string;
  author_last_name?: string;
  author_email?: string;
}

/**
 * API response for list of articles
 */
export interface BlogArticlesResponse {
  success: boolean;
  articles: BlogArticle[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * API response for single article
 */
export interface BlogArticleResponse {
  success: boolean;
  article: BlogArticle;
  relatedArticles?: BlogArticle[];
}

/**
 * API response for categories
 */
export interface BlogCategoriesResponse {
  success: boolean;
  categories: BlogCategory[];
}

/**
 * Standard error response
 */
export interface BlogErrorResponse {
  success: false;
  error: string;
  details?: any;
}
