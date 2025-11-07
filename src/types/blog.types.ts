/**
 * Frontend Blog Types
 * 
 * These types match the API response structure from the backend
 * and are used by the Blog and BlogPost pages.
 */

/**
 * BlogPost represents a blog article in list views
 * Used in the Blog list page for displaying article cards
 */
export interface BlogPost {
  id: string; // uuid from backend
  title: string;
  excerpt: string;
  author: string; // Full name (first_name + last_name)
  date: string; // Formatted date string
  category: string;
  image: string; // featured_image_url
  slug: string;
}

/**
 * BlogPostData extends BlogPost with full article details
 * Used in the BlogPost detail page for displaying complete article
 */
export interface BlogPostData extends BlogPost {
  content: string; // Full markdown content
  tags: string[]; // Array of tag strings
  readTime: string; // Calculated read time (e.g., "5 min read")
  views: number; // View count
}
