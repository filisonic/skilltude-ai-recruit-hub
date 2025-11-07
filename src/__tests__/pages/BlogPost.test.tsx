import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BlogPost from '@/pages/BlogPost';
import { blogApi } from '@/lib/api';

// Mock the components that are not under test
vi.mock('@/components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('@/components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('@/components/PageLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

// Mock window.alert
global.alert = vi.fn();

// Mock blog post data
const mockArticle = {
  id: 'article-1',
  title: 'Test Article Title',
  excerpt: 'This is a test excerpt',
  content: `# Introduction

This is the main content of the article.

## Section 1

Some content here with **bold text**.

- List item 1
- List item 2

## Section 2

More content here.`,
  author: 'John Doe',
  date: '2024-01-15',
  category: 'Technology',
  image: '/test-image.jpg',
  slug: 'test-article-title',
  tags: ['testing', 'react', 'typescript'],
  readTime: '5 min read',
  views: 1234,
};

const mockRelatedArticles = [
  {
    id: 'related-1',
    title: 'Related Article 1',
    excerpt: 'Related excerpt 1',
    author: 'Jane Smith',
    date: '2024-01-14',
    category: 'Technology',
    image: '/related-1.jpg',
    slug: 'related-article-1',
    tags: ['testing'],
    readTime: '3 min read',
    views: 500,
  },
  {
    id: 'related-2',
    title: 'Related Article 2',
    excerpt: 'Related excerpt 2',
    author: 'Bob Johnson',
    date: '2024-01-13',
    category: 'Technology',
    image: '/related-2.jpg',
    slug: 'related-article-2',
    tags: ['react'],
    readTime: '4 min read',
    views: 750,
  },
];

describe('BlogPost Detail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  const renderBlogPost = (slug = 'test-article-title') => {
    return render(
      <MemoryRouter initialEntries={[`/blog/${slug}`]}>
        <Routes>
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('displays loading state correctly', () => {
    // Mock fetch to never resolve
    global.fetch = vi.fn(() => new Promise(() => {}));

    renderBlogPost();

    expect(screen.getByText('Loading article...')).toBeInTheDocument();
  });

  it('renders article after successful fetch', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        article: mockArticle,
        relatedArticles: mockRelatedArticles,
      }),
    });

    renderBlogPost();

    await waitFor(() => {
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
    expect(screen.getByText('1,234 views')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders article content with proper formatting', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        article: mockArticle,
        relatedArticles: [],
      }),
    });

    renderBlogPost();

    await waitFor(() => {
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    // Check that content is rendered
    expect(screen.getByText(/This is the main content/i)).toBeInTheDocument();
    expect(screen.getByText(/Some content here with/i)).toBeInTheDocument();
  });

  it('displays 404 state for missing article', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    renderBlogPost();

    await waitFor(() => {
      expect(screen.getByText('Article Not Found')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Article not found. It may have been removed or the link is incorrect./i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to blog/i })).toBeInTheDocument();
  });

  it('displays error state for network errors', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    renderBlogPost();

    await waitFor(() => {
      expect(screen.getByText('Error Loading Article')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Unable to load article. Please check your connection and try again./i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('displays related articles', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        article: mockArticle,
        relatedArticles: mockRelatedArticles,
      }),
    });

    renderBlogPost();

    await waitFor(() => {
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    expect(screen.getByText('Related Articles')).toBeInTheDocument();
    expect(screen.getByText('Related Article 1')).toBeInTheDocument();
    expect(screen.getByText('Related Article 2')).toBeInTheDocument();
  });

  it('does not display related articles section when none exist', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        article: mockArticle,
        relatedArticles: [],
      }),
    });

    renderBlogPost();

    await waitFor(() => {
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    expect(screen.queryByText('Related Articles')).not.toBeInTheDocument();
  });

  it('displays article tags', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        article: mockArticle,
        relatedArticles: [],
      }),
    });

    renderBlogPost();

    await waitFor(() => {
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('handles retry button functionality', async () => {
    // First call fails
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    renderBlogPost();

    await waitFor(() => {
      expect(screen.getByText('Error Loading Article')).toBeInTheDocument();
    });

    // Second call succeeds
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        article: mockArticle,
        relatedArticles: mockRelatedArticles,
      }),
    });

    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });
  });

  it('handles share button click', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        article: mockArticle,
        relatedArticles: [],
      }),
    });

    renderBlogPost();

    await waitFor(() => {
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    // Should copy URL to clipboard
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  it('calls correct API endpoint with slug', async () => {
    const fetchSpy = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        article: mockArticle,
        relatedArticles: [],
      }),
    });
    global.fetch = fetchSpy;

    renderBlogPost('test-article-title');

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(blogApi.getArticle('test-article-title'));
    });
  });

  it('scrolls to top when component mounts', async () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        article: mockArticle,
        relatedArticles: [],
      }),
    });

    renderBlogPost();

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });

  it('displays author information', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        article: mockArticle,
        relatedArticles: [],
      }),
    });

    renderBlogPost();

    await waitFor(() => {
      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    expect(screen.getByText('About the Author')).toBeInTheDocument();
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
  });
});
