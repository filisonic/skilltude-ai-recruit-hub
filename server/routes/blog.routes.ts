/**
 * Blog Routes
 * 
 * Public API endpoints for blog articles and categories
 */

import express, { Request, Response, NextFunction } from 'express';
import { param, query, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import BlogService from '../services/BlogService.js';
import logger from '../utils/logger.js';
import { ErrorCodes } from '../utils/errors.js';

const router = express.Router();
const blogService = new BlogService();

// ============================================================================
// Rate Limiting
// ============================================================================

/**
 * Rate limiter for blog API endpoints
 * More lenient than upload endpoints - 100 requests per 15 minutes
 */
const blogApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP address. Please try again later.',
    code: ErrorCodes.RATE_LIMIT_EXCEEDED,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown')
      .split(',')[0]
      .trim();
  },
});

// Apply rate limiting to all blog routes
router.use(blogApiLimiter);

// ============================================================================
// Validation Rules
// ============================================================================

const slugValidationRules = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Invalid slug format')
    .isLength({ min: 1, max: 255 }).withMessage('Slug must be between 1 and 255 characters'),
];

const articlesQueryValidationRules = [
  query('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category must be less than 100 characters'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Search query must be less than 200 characters'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  query('offset')
    .optional()
    .isInt({ min: 0 }).withMessage('Offset must be a positive integer')
    .toInt(),
];

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/blog/articles
 * Get all published blog articles with optional filtering
 * 
 * Query Parameters:
 * - category: Filter by category (optional)
 * - search: Search in title, excerpt, and content (optional)
 * - limit: Number of articles to return (optional, default: all)
 * - offset: Number of articles to skip (optional, default: 0)
 */
router.get(
  '/articles',
  articlesQueryValidationRules,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      // Extract query parameters
      const filters = {
        category: req.query.category as string | undefined,
        search: req.query.search as string | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      // Fetch articles from service
      const articles = await blogService.getPublishedArticles(filters);

      // Return success response
      return res.status(200).json({
        success: true,
        articles,
        count: articles.length,
      });

    } catch (error) {
      logger.error('Failed to fetch blog articles', {
        error,
        query: req.query,
        category: 'blog_api',
      });

      // Pass to error handler
      next(error);
    }
  }
);

/**
 * GET /api/blog/articles/:slug
 * Get a single blog article by slug
 * 
 * Path Parameters:
 * - slug: Article slug (required)
 * 
 * Returns:
 * - article: The requested article
 * - relatedArticles: Up to 3 related articles from the same category
 */
router.get(
  '/articles/:slug',
  slugValidationRules,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { slug } = req.params;

      // Fetch article from service
      const article = await blogService.getArticleBySlug(slug);

      // Handle article not found
      if (!article) {
        return res.status(404).json({
          success: false,
          error: 'Article not found',
          code: 'ARTICLE_NOT_FOUND',
        });
      }

      // Increment view count (async, don't wait)
      blogService.incrementViewCount(article.id).catch((error) => {
        logger.error('Failed to increment view count', {
          error,
          articleId: article.id,
          slug,
          category: 'blog_api',
        });
      });

      // Fetch related articles
      const relatedArticles = await blogService.getRelatedArticles(
        article.id,
        article.category,
        3
      );

      // Return success response
      return res.status(200).json({
        success: true,
        article,
        relatedArticles,
      });

    } catch (error) {
      logger.error('Failed to fetch blog article', {
        error,
        slug: req.params.slug,
        category: 'blog_api',
      });

      // Pass to error handler
      next(error);
    }
  }
);

/**
 * GET /api/blog/categories
 * Get all blog categories
 * 
 * Returns:
 * - categories: Array of all categories with article counts
 */
router.get(
  '/categories',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch categories from service
      const categories = await blogService.getCategories();

      // Return success response
      return res.status(200).json({
        success: true,
        categories,
        count: categories.length,
      });

    } catch (error) {
      logger.error('Failed to fetch blog categories', {
        error,
        category: 'blog_api',
      });

      // Pass to error handler
      next(error);
    }
  }
);

// ============================================================================
// Error Handler
// ============================================================================

/**
 * Blog routes error handler
 * Catches any errors not handled by route handlers
 */
router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Blog API error', {
    error,
    path: req.path,
    method: req.method,
    category: 'blog_api',
  });

  // Return generic error response
  return res.status(500).json({
    success: false,
    error: 'An error occurred while processing your request',
    code: 'INTERNAL_SERVER_ERROR',
  });
});

export default router;
