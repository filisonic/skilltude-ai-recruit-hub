/**
 * BlogService Unit Tests
 * 
 * Tests for blog service methods including:
 * - Fetching published articles with filters
 * - Fetching single article by slug
 * - Incrementing view counts
 * - Fetching related articles
 * - Fetching categories
 * - Caching behavior
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import BlogService from '../../services/BlogService.js';
import { BlogArticle, BlogArticleRow, BlogCategory } from '../../types/blog.types.js';

// Mock the database module
const mockQuery = vi.fn();
vi.mock('../../utils/database.js', () => ({
  query: (...args: any[]) => mockQuery(...args),
}));

// Mock the logger
vi.mock('../../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('BlogService', () => {
  let blogService: BlogService;

  // Sample test data
  const mockArticleRow: BlogArticleRow = {
    id: 1,
    uuid: 'test-uuid-123',
    title: 'Test Article',
    slug: 'test-article',
    excerpt: 'This is a test excerpt',
    content: 'This is test content with multiple words to calculate read time properly.',
    featured_image_url: 'https://example.com/image.jpg',
    category: 'Technology',
    tags: '["javascript", "testing"]',
    author_id: 1,
    status: 'published',
    published_at: new Date('2024-01-15'),
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-15'),
    views: 100,
    author_first_name: 'John',
    author_last_name: 'Doe',
    author_email: 'john@example.com',
  };

  const mockArticleRow2: BlogArticleRow = {
    id: 2,
    uuid: 'test-uuid-456',
    title: 'Another Article',
    slug: 'another-article',
    excerpt: 'Another test excerpt',
    content: 'Another test content.',
    featured_image_url: 'https://example.com/image2.jpg',
    category: 'Technology',
    tags: '["nodejs", "backend"]',
    author_id: 1,
    status: 'published',
    published_at: new Date('2024-01-20'),
    created_at: new Date('2024-01-18'),
    updated_at: new Date('2024-01-20'),
    views: 50,
    author_first_name: 'John',
    author_last_name: 'Doe',
    author_email: 'john@example.com',
  };

  beforeEach(() => {
    blogService = new BlogService();
    mockQuery.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getPublishedArticles', () => {
    it('should fetch all published articles without filters', async () => {
      mockQuery.mockResolvedValue([mockArticleRow, mockArticleRow2]);

      const articles = await blogService.getPublishedArticles();

      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE a.status = \'published\''),
        []
      );
      expect(articles).toHaveLength(2);
      expect(articles[0].title).toBe('Test Article');
      expect(articles[0].author.first_name).toBe('John');
      expect(articles[0].tags).toEqual(['javascript', 'testing']);
    });

    it('should filter articles by category', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      const articles = await blogService.getPublishedArticles({ category: 'Technology' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('AND a.category = ?'),
        ['Technology']
      );
      expect(articles).toHaveLength(1);
      expect(articles[0].category).toBe('Technology');
    });

    it('should filter articles by search term', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      const articles = await blogService.getPublishedArticles({ search: 'test' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)'),
        ['%test%', '%test%', '%test%']
      );
      expect(articles).toHaveLength(1);
    });

    it('should apply pagination with limit and offset', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      const articles = await blogService.getPublishedArticles({ limit: 10, offset: 5 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT ?'),
        [10, 5]
      );
      expect(articles).toHaveLength(1);
    });

    it('should combine multiple filters', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      const articles = await blogService.getPublishedArticles({
        category: 'Technology',
        search: 'test',
        limit: 5,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('AND a.category = ?'),
        ['Technology', '%test%', '%test%', '%test%', 5]
      );
      expect(articles).toHaveLength(1);
    });

    it('should return cached results on second call', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      // First call - should hit database
      const articles1 = await blogService.getPublishedArticles();
      expect(mockQuery).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const articles2 = await blogService.getPublishedArticles();
      expect(mockQuery).toHaveBeenCalledTimes(1); // Still 1, not 2
      expect(articles2).toEqual(articles1);
    });

    it('should handle articles with null tags', async () => {
      const rowWithNullTags = { ...mockArticleRow, tags: null };
      mockQuery.mockResolvedValue([rowWithNullTags]);

      const articles = await blogService.getPublishedArticles();

      expect(articles[0].tags).toEqual([]);
    });

    it('should handle articles with invalid JSON tags', async () => {
      const rowWithInvalidTags = { ...mockArticleRow, tags: 'invalid-json' };
      mockQuery.mockResolvedValue([rowWithInvalidTags]);

      const articles = await blogService.getPublishedArticles();

      expect(articles[0].tags).toEqual([]);
    });

    it('should calculate read time correctly', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      const articles = await blogService.getPublishedArticles();

      expect(articles[0].read_time).toBeDefined();
      expect(articles[0].read_time).toMatch(/\d+ min read/);
    });

    it('should throw error when database query fails', async () => {
      mockQuery.mockRejectedValue(new Error('Database connection failed'));

      await expect(blogService.getPublishedArticles()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getArticleBySlug', () => {
    it('should fetch article by slug', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      const article = await blogService.getArticleBySlug('test-article');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE a.slug = ? AND a.status = \'published\''),
        ['test-article']
      );
      expect(article).not.toBeNull();
      expect(article?.slug).toBe('test-article');
      expect(article?.title).toBe('Test Article');
    });

    it('should return null when article not found', async () => {
      mockQuery.mockResolvedValue([]);

      const article = await blogService.getArticleBySlug('non-existent-slug');

      expect(article).toBeNull();
    });

    it('should return cached article on second call', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      // First call - should hit database
      const article1 = await blogService.getArticleBySlug('test-article');
      expect(mockQuery).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const article2 = await blogService.getArticleBySlug('test-article');
      expect(mockQuery).toHaveBeenCalledTimes(1); // Still 1, not 2
      expect(article2).toEqual(article1);
    });

    it('should handle missing author information gracefully', async () => {
      const rowWithoutAuthor = {
        ...mockArticleRow,
        author_first_name: undefined,
        author_last_name: undefined,
        author_email: undefined,
      };
      mockQuery.mockResolvedValue([rowWithoutAuthor]);

      const article = await blogService.getArticleBySlug('test-article');

      expect(article?.author.first_name).toBe('Unknown');
      expect(article?.author.last_name).toBe('Author');
      expect(article?.author.email).toBe('');
    });

    it('should throw error when database query fails', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(blogService.getArticleBySlug('test-article')).rejects.toThrow('Database error');
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count for article', async () => {
      mockQuery.mockResolvedValue({ affectedRows: 1 });

      await blogService.incrementViewCount(1);

      expect(mockQuery).toHaveBeenCalledWith(
        'UPDATE blog_articles SET views = views + 1 WHERE id = ?',
        [1]
      );
    });

    it('should not throw error when database update fails', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      // Should not throw - view count increment failure shouldn't break the request
      await expect(blogService.incrementViewCount(1)).resolves.toBeUndefined();
    });
  });

  describe('getRelatedArticles', () => {
    it('should fetch related articles from same category', async () => {
      mockQuery.mockResolvedValue([mockArticleRow2]);

      const relatedArticles = await blogService.getRelatedArticles(1, 'Technology', 3);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE a.category = ?'),
        ['Technology', 1, 3]
      );
      expect(relatedArticles).toHaveLength(1);
      expect(relatedArticles[0].category).toBe('Technology');
      expect(relatedArticles[0].id).not.toBe(1); // Should exclude current article
    });

    it('should limit number of related articles', async () => {
      mockQuery.mockResolvedValue([mockArticleRow2]);

      const relatedArticles = await blogService.getRelatedArticles(1, 'Technology', 5);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT ?'),
        ['Technology', 1, 5]
      );
    });

    it('should use default limit of 3 when not specified', async () => {
      mockQuery.mockResolvedValue([mockArticleRow2]);

      await blogService.getRelatedArticles(1, 'Technology');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.anything(),
        ['Technology', 1, 3]
      );
    });

    it('should return empty array when no related articles found', async () => {
      mockQuery.mockResolvedValue([]);

      const relatedArticles = await blogService.getRelatedArticles(1, 'Technology');

      expect(relatedArticles).toEqual([]);
    });

    it('should throw error when database query fails', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(blogService.getRelatedArticles(1, 'Technology')).rejects.toThrow('Database error');
    });
  });

  describe('getCategories', () => {
    it('should fetch all categories', async () => {
      const mockCategoryRows = [
        { name: 'Technology', slug: 'Technology', description: null, color: '#4F46E5' },
        { name: 'Business', slug: 'Business', description: null, color: '#4F46E5' },
      ];
      mockQuery.mockResolvedValue(mockCategoryRows);

      const categories = await blogService.getCategories();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT DISTINCT')
      );
      expect(categories).toHaveLength(2);
      expect(categories[0].name).toBe('Technology');
      expect(categories[0].slug).toBe('technology');
      expect(categories[1].name).toBe('Business');
    });

    it('should return cached categories on second call', async () => {
      const mockCategoryRows = [
        { name: 'Technology', slug: 'Technology', description: null, color: '#4F46E5' },
      ];
      mockQuery.mockResolvedValue(mockCategoryRows);

      // First call - should hit database
      const categories1 = await blogService.getCategories();
      expect(mockQuery).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const categories2 = await blogService.getCategories();
      expect(mockQuery).toHaveBeenCalledTimes(1); // Still 1, not 2
      expect(categories2).toEqual(categories1);
    });

    it('should generate slugs from category names', async () => {
      const mockCategoryRows = [
        { name: 'Web Development', slug: 'Web Development', description: null, color: '#4F46E5' },
      ];
      mockQuery.mockResolvedValue(mockCategoryRows);

      const categories = await blogService.getCategories();

      expect(categories[0].slug).toBe('web-development');
    });

    it('should assign sequential IDs to categories', async () => {
      const mockCategoryRows = [
        { name: 'Technology', slug: 'Technology', description: null, color: '#4F46E5' },
        { name: 'Business', slug: 'Business', description: null, color: '#4F46E5' },
        { name: 'Design', slug: 'Design', description: null, color: '#4F46E5' },
      ];
      mockQuery.mockResolvedValue(mockCategoryRows);

      const categories = await blogService.getCategories();

      expect(categories[0].id).toBe(1);
      expect(categories[1].id).toBe(2);
      expect(categories[2].id).toBe(3);
    });

    it('should throw error when database query fails', async () => {
      mockQuery.mockRejectedValue(new Error('Database error'));

      await expect(blogService.getCategories()).rejects.toThrow('Database error');
    });
  });

  describe('Cache behavior', () => {
    it('should cache articles list with different filter combinations separately', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      // Call with no filters
      await blogService.getPublishedArticles();
      expect(mockQuery).toHaveBeenCalledTimes(1);

      // Call with category filter - should hit database again
      await blogService.getPublishedArticles({ category: 'Technology' });
      expect(mockQuery).toHaveBeenCalledTimes(2);

      // Call with same category filter - should use cache
      await blogService.getPublishedArticles({ category: 'Technology' });
      expect(mockQuery).toHaveBeenCalledTimes(2); // Still 2
    });

    it('should expire cache after TTL', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      // First call
      await blogService.getPublishedArticles();
      expect(mockQuery).toHaveBeenCalledTimes(1);

      // Mock time passing (5 minutes + 1 second)
      vi.useFakeTimers();
      vi.advanceTimersByTime(5 * 60 * 1000 + 1000);

      // Second call after cache expiry - should hit database
      await blogService.getPublishedArticles();
      expect(mockQuery).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should clear all caches when clearCache is called', async () => {
      mockQuery.mockResolvedValue([mockArticleRow]);

      // Populate caches
      await blogService.getPublishedArticles();
      await blogService.getArticleBySlug('test-article');
      await blogService.getCategories();
      expect(mockQuery).toHaveBeenCalledTimes(3);

      // Clear cache
      blogService.clearCache();

      // Next calls should hit database
      await blogService.getPublishedArticles();
      await blogService.getArticleBySlug('test-article');
      await blogService.getCategories();
      expect(mockQuery).toHaveBeenCalledTimes(6);
    });
  });

  describe('Error handling', () => {
    it('should handle database connection errors', async () => {
      mockQuery.mockRejectedValue(new Error('ECONNREFUSED'));

      await expect(blogService.getPublishedArticles()).rejects.toThrow('ECONNREFUSED');
    });

    it('should handle SQL syntax errors', async () => {
      mockQuery.mockRejectedValue(new Error('ER_SYNTAX_ERROR'));

      await expect(blogService.getArticleBySlug('test')).rejects.toThrow('ER_SYNTAX_ERROR');
    });

    it('should handle timeout errors', async () => {
      mockQuery.mockRejectedValue(new Error('ER_LOCK_WAIT_TIMEOUT'));

      await expect(blogService.getRelatedArticles(1, 'Tech')).rejects.toThrow('ER_LOCK_WAIT_TIMEOUT');
    });

    it('should handle empty result sets gracefully', async () => {
      mockQuery.mockResolvedValue([]);

      const articles = await blogService.getPublishedArticles();
      expect(articles).toEqual([]);

      const article = await blogService.getArticleBySlug('test');
      expect(article).toBeNull();

      const related = await blogService.getRelatedArticles(1, 'Tech');
      expect(related).toEqual([]);
    });
  });
});
