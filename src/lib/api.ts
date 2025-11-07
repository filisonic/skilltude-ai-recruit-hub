/**
 * Centralized API configuration for the application
 * 
 * This module provides a single source of truth for API URLs and endpoints.
 * It uses environment variables with fallback values for development.
 */

// CV/Upload API URL (Render server - keep unchanged)
export const API_URL = 'https://skilltude-ai-recruit-hub.onrender.com';

// Blog API URL (Simple PHP on Hostinger)
export const BLOG_API_URL = 'https://skilltude.com';

/**
 * Blog API endpoints
 * 
 * Provides methods to construct URLs for blog-related API calls
 */
export const blogApi = {
  /**
   * Get URL for fetching all blog articles
   * @returns Full URL for the articles list endpoint
   */
  getArticles: (): string => `${BLOG_API_URL}/api/blog/articles.php`,
  
  /**
   * Get URL for fetching a single blog article by slug
   * @param slug - The article slug
   * @returns Full URL for the specific article endpoint
   */
  getArticle: (slug: string): string => `${BLOG_API_URL}/api/blog/article.php?slug=${slug}`,
  
  /**
   * Get URL for fetching all blog categories
   * @returns Full URL for the categories endpoint
   */
  getCategories: (): string => `${BLOG_API_URL}/api/blog/categories.php`,
};
