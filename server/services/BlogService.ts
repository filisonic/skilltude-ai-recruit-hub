/**
 * Blog Service
 * 
 * Handles business logic for blog operations including fetching articles,
 * managing view counts, and caching.
 */

import { query } from '../utils/database.js';
import logger from '../utils/logger.js';
import {
  BlogArticle,
  BlogArticleRow,
  BlogCategory,
  BlogArticleFilters,
  BlogAuthor,
} from '../types/blog.types.js';

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T;
  expires: number;
}

/**
 * Blog Service for database operations
 */
export class BlogService {
  private articleCache: Map<string, CacheEntry<BlogArticle>>;
  private articlesListCache: Map<string, CacheEntry<BlogArticle[]>>;
  private categoriesCache: CacheEntry<BlogCategory[]> | null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.articleCache = new Map();
    this.articlesListCache = new Map();
    this.categoriesCache = null;
  }

  /**
   * Get all published articles with optional filters
   * 
   * @param filters - Optional filters for category, search, pagination
   * @returns Promise<BlogArticle[]> - Array of published articles
   */
  async getPublishedArticles(filters?: BlogArticleFilters): Promise<BlogArticle[]> {
    try {
      // Generate cache key based on filters
      const cacheKey = this.generateCacheKey(filters);
      
      // Check cache first
      const cached = this.getCachedArticlesList(cacheKey);
      if (cached) {
        logger.debug('Returning cached articles list', { cacheKey });
        return cached;
      }

      // Build SQL query
      let sql = `
        SELECT 
          a.id,
          a.uuid,
          a.title,
          a.slug,
          a.excerpt,
          a.content,
          a.featured_image_url,
          a.category,
          a.tags,
          a.status,
          a.published_at,
          a.created_at,
          a.updated_at,
          a.views,
          u.id as author_id,
          u.first_name as author_first_name,
          u.last_name as author_last_name,
          u.email as author_email
        FROM blog_articles a
        LEFT JOIN admin_users u ON a.author_id = u.id
        WHERE a.status = 'published'
      `;

      const params: any[] = [];

      // Add category filter
      if (filters?.category) {
        sql += ' AND a.category = ?';
        params.push(filters.category);
      }

      // Add search filter
      if (filters?.search) {
        sql += ' AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Order by published date (newest first)
      sql += ' ORDER BY a.published_at DESC';

      // Add pagination
      if (filters?.limit) {
        sql += ' LIMIT ?';
        params.push(filters.limit);
      }

      if (filters?.offset) {
        sql += ' OFFSET ?';
        params.push(filters.offset);
      }

      // Execute query
      const rows = await query<BlogArticleRow[]>(sql, params);

      // Transform rows to BlogArticle objects
      const articles = rows.map(row => this.transformRowToArticle(row));

      // Cache the results
      this.setCachedArticlesList(cacheKey, articles);

      logger.info('Fetched published articles', {
        count: articles.length,
        filters,
      });

      return articles;
    } catch (error) {
      logger.error('Failed to fetch published articles', { error, filters });
      throw error;
    }
  }

  /**
   * Get single article by slug
   * 
   * @param slug - Article slug
   * @returns Promise<BlogArticle | null> - Article or null if not found
   */
  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    try {
      // Check cache first
      const cached = this.getCachedArticle(slug);
      if (cached) {
        logger.debug('Returning cached article', { slug });
        return cached;
      }

      // Query database
      const sql = `
        SELECT 
          a.id,
          a.uuid,
          a.title,
          a.slug,
          a.excerpt,
          a.content,
          a.featured_image_url,
          a.category,
          a.tags,
          a.status,
          a.published_at,
          a.created_at,
          a.updated_at,
          a.views,
          u.id as author_id,
          u.first_name as author_first_name,
          u.last_name as author_last_name,
          u.email as author_email
        FROM blog_articles a
        LEFT JOIN admin_users u ON a.author_id = u.id
        WHERE a.slug = ? AND a.status = 'published'
        LIMIT 1
      `;

      const rows = await query<BlogArticleRow[]>(sql, [slug]);

      if (rows.length === 0) {
        logger.info('Article not found', { slug });
        return null;
      }

      const article = this.transformRowToArticle(rows[0]);

      // Cache the article
      this.setCachedArticle(slug, article);

      logger.info('Fetched article by slug', { slug, articleId: article.id });

      return article;
    } catch (error) {
      logger.error('Failed to fetch article by slug', { error, slug });
      throw error;
    }
  }

  /**
   * Increment view count for an article
   * 
   * @param articleId - Article ID
   * @returns Promise<void>
   */
  async incrementViewCount(articleId: number): Promise<void> {
    try {
      const sql = 'UPDATE blog_articles SET views = views + 1 WHERE id = ?';
      await query(sql, [articleId]);

      logger.debug('Incremented view count', { articleId });
    } catch (error) {
      logger.error('Failed to increment view count', { error, articleId });
      // Don't throw - view count increment failure shouldn't break the request
    }
  }

  /**
   * Get related articles from the same category
   * 
   * @param articleId - Current article ID to exclude
   * @param category - Category to match
   * @param limit - Maximum number of related articles
   * @returns Promise<BlogArticle[]> - Array of related articles
   */
  async getRelatedArticles(
    articleId: number,
    category: string,
    limit: number = 3
  ): Promise<BlogArticle[]> {
    try {
      const sql = `
        SELECT 
          a.id,
          a.uuid,
          a.title,
          a.slug,
          a.excerpt,
          a.content,
          a.featured_image_url,
          a.category,
          a.tags,
          a.status,
          a.published_at,
          a.created_at,
          a.updated_at,
          a.views,
          u.id as author_id,
          u.first_name as author_first_name,
          u.last_name as author_last_name,
          u.email as author_email
        FROM blog_articles a
        LEFT JOIN admin_users u ON a.author_id = u.id
        WHERE a.category = ? 
          AND a.id != ? 
          AND a.status = 'published'
        ORDER BY a.published_at DESC
        LIMIT ?
      `;

      const rows = await query<BlogArticleRow[]>(sql, [category, articleId, limit]);
      const articles = rows.map(row => this.transformRowToArticle(row));

      logger.debug('Fetched related articles', {
        articleId,
        category,
        count: articles.length,
      });

      return articles;
    } catch (error) {
      logger.error('Failed to fetch related articles', {
        error,
        articleId,
        category,
      });
      throw error;
    }
  }

  /**
   * Get all blog categories
   * 
   * @returns Promise<BlogCategory[]> - Array of categories
   */
  async getCategories(): Promise<BlogCategory[]> {
    try {
      // Check cache first
      if (this.categoriesCache && this.categoriesCache.expires > Date.now()) {
        logger.debug('Returning cached categories');
        return this.categoriesCache.data;
      }

      // Query database for distinct categories from articles
      const sql = `
        SELECT DISTINCT 
          category as name,
          category as slug,
          NULL as description,
          '#4F46E5' as color
        FROM blog_articles
        WHERE status = 'published'
        ORDER BY category ASC
      `;

      const rows = await query<any[]>(sql);

      // Transform to BlogCategory objects with generated IDs
      const categories: BlogCategory[] = rows.map((row, index) => ({
        id: index + 1,
        name: row.name,
        slug: row.slug.toLowerCase().replace(/\s+/g, '-'),
        description: row.description,
        color: row.color,
      }));

      // Cache the categories
      this.categoriesCache = {
        data: categories,
        expires: Date.now() + this.CACHE_TTL,
      };

      logger.info('Fetched categories', { count: categories.length });

      return categories;
    } catch (error) {
      logger.error('Failed to fetch categories', { error });
      throw error;
    }
  }

  /**
   * Transform database row to BlogArticle object
   * 
   * @param row - Database row
   * @returns BlogArticle - Transformed article object
   */
  private transformRowToArticle(row: BlogArticleRow): BlogArticle {
    // Parse tags from JSON string
    let tags: string[] = [];
    if (row.tags) {
      try {
        tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags;
      } catch (error) {
        logger.warn('Failed to parse tags JSON', { articleId: row.id, tags: row.tags });
        tags = [];
      }
    }

    // Build author object
    const author: BlogAuthor = {
      id: row.author_id,
      first_name: row.author_first_name || 'Unknown',
      last_name: row.author_last_name || 'Author',
      email: row.author_email || '',
    };

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = row.content.split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / 200);
    const read_time = `${readTimeMinutes} min read`;

    return {
      id: row.id,
      uuid: row.uuid,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      featured_image_url: row.featured_image_url,
      category: row.category,
      tags,
      author,
      status: row.status,
      published_at: row.published_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      views: row.views,
      read_time,
    };
  }

  /**
   * Generate cache key from filters
   * 
   * @param filters - Article filters
   * @returns string - Cache key
   */
  private generateCacheKey(filters?: BlogArticleFilters): string {
    if (!filters) {
      return 'all';
    }

    const parts: string[] = [];
    if (filters.category) parts.push(`cat:${filters.category}`);
    if (filters.search) parts.push(`search:${filters.search}`);
    if (filters.limit) parts.push(`limit:${filters.limit}`);
    if (filters.offset) parts.push(`offset:${filters.offset}`);

    return parts.length > 0 ? parts.join('|') : 'all';
  }

  /**
   * Get cached article by slug
   * 
   * @param slug - Article slug
   * @returns BlogArticle | null - Cached article or null
   */
  private getCachedArticle(slug: string): BlogArticle | null {
    const cached = this.articleCache.get(slug);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  }

  /**
   * Cache an article
   * 
   * @param slug - Article slug
   * @param article - Article to cache
   */
  private setCachedArticle(slug: string, article: BlogArticle): void {
    this.articleCache.set(slug, {
      data: article,
      expires: Date.now() + this.CACHE_TTL,
    });
  }

  /**
   * Get cached articles list
   * 
   * @param cacheKey - Cache key
   * @returns BlogArticle[] | null - Cached articles or null
   */
  private getCachedArticlesList(cacheKey: string): BlogArticle[] | null {
    const cached = this.articlesListCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  }

  /**
   * Cache articles list
   * 
   * @param cacheKey - Cache key
   * @param articles - Articles to cache
   */
  private setCachedArticlesList(cacheKey: string, articles: BlogArticle[]): void {
    this.articlesListCache.set(cacheKey, {
      data: articles,
      expires: Date.now() + this.CACHE_TTL,
    });
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.articleCache.clear();
    this.articlesListCache.clear();
    this.categoriesCache = null;
    logger.info('Blog service cache cleared');
  }
}

export default BlogService;
