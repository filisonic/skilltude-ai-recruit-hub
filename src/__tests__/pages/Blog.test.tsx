import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Blog from '@/pages/Blog';
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

vi.mock('@/components/LazyImage', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

// Mock blog data
const mockArticles = [
  {
    id: 'article-1',
    title: 'Test Article 1',
    excerpt: 'This is a test excerpt for article 1',
    author: 'John Doe',
    date: '2024-01-15',
    category: 'Technology',
    image: '/test-image-1.jpg',
    slug: 'test-article-1',
  },
  {
    id: 'article-2',
    title: 'Test Article 2',
    excerpt: 'This is a test excerpt for article 2',
    author: 'Jane Smith',
    date: '2024-01-14',
    category: 'Career',
    image: '/test-image-2.jpg',
    slug: 'test-article-2',
  },
  {
    id: 'article-3',
    title: 'Another Technology Post',
    excerpt: 'More technology content here',
    author: 'Bob Johnson',
    date: '2024-01-13',
    category: 'Technology',
    image: '/test-image-3.jpg',
    slug: 'another-technology-post',
  },
];

describe('Blog List Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  const renderBlog = () => {
    return render(
      <BrowserRouter>
        <Blog />
      </BrowserRouter>
    );
  };

  it('displays loading state correctly', () => {
    // Mock fetch to never resolve
    global.fetch = vi.fn(() => new Promise(() => {}));

    renderBlog();

    expect(screen.getByText('Loading articles...')).toBeInTheDocument();
    // Check for spinner by class since it doesn't have a role
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders articles after successful fetch', async () => {
    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: mockArticles }),
    });

    renderBlog();

    // Wait for articles to load
    await waitFor(() => {
      expect(screen.getAllByText('Test Article 1').length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText('Test Article 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Another Technology Post').length).toBeGreaterThan(0);
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Jane Smith').length).toBeGreaterThan(0);
  });

  it('displays error state correctly', async () => {
    // Mock failed API response
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    renderBlog();

    await waitFor(() => {
      expect(screen.getByText('Unable to load articles')).toBeInTheDocument();
    });

    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('allows retry after error', async () => {
    // First call fails
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    renderBlog();

    await waitFor(() => {
      expect(screen.getByText('Unable to load articles')).toBeInTheDocument();
    });

    // Second call succeeds
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: mockArticles }),
    });

    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getAllByText('Test Article 1').length).toBeGreaterThan(0);
    });
  });

  it('filters articles by search term', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: mockArticles }),
    });

    renderBlog();

    await waitFor(() => {
      expect(screen.getAllByText('Test Article 1').length).toBeGreaterThan(0);
    });

    // Search for "Technology"
    const searchInput = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(searchInput, { target: { value: 'Technology' } });

    // Should show articles with "Technology" in title or excerpt
    await waitFor(() => {
      expect(screen.getAllByText('Another Technology Post').length).toBeGreaterThan(0);
    });

    // Should not show articles without "Technology" in main grid
    const mainGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    expect(mainGrid?.textContent).not.toContain('Test Article 2');
  });

  it('filters articles by category', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: mockArticles }),
    });

    renderBlog();

    await waitFor(() => {
      expect(screen.getAllByText('Test Article 1').length).toBeGreaterThan(0);
    });

    // Select "Career" category
    const categorySelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(categorySelect, { target: { value: 'Career' } });

    await waitFor(() => {
      expect(screen.getAllByText('Test Article 2').length).toBeGreaterThan(0);
    });

    // Should not show Technology articles in main grid
    const mainGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    expect(mainGrid?.textContent).not.toContain('Test Article 1');
    expect(mainGrid?.textContent).not.toContain('Another Technology Post');
  });

  it('displays "no articles found" when filters match nothing', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: mockArticles }),
    });

    renderBlog();

    await waitFor(() => {
      expect(screen.getAllByText('Test Article 1').length).toBeGreaterThan(0);
    });

    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(searchInput, { target: { value: 'NonexistentArticle' } });

    await waitFor(() => {
      expect(screen.getByText('No articles found matching your criteria.')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('handles pagination correctly', async () => {
    // Create 10 articles to test pagination (6 per page)
    const manyArticles = Array.from({ length: 10 }, (_, i) => ({
      id: `article-${i}`,
      title: `Unique Article Title ${i}`,
      excerpt: `Excerpt ${i}`,
      author: 'Author',
      date: '2024-01-15',
      category: 'Technology',
      image: `/image-${i}.jpg`,
      slug: `article-${i}`,
    }));

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: manyArticles }),
    });

    renderBlog();

    await waitFor(() => {
      expect(screen.getAllByText('Unique Article Title 0').length).toBeGreaterThan(0);
    });

    // Should show first 6 articles (may appear in sidebar too)
    expect(screen.getAllByText('Unique Article Title 5').length).toBeGreaterThan(0);
    expect(screen.queryByText('Unique Article Title 6')).not.toBeInTheDocument();

    // Click page 2
    const page2Button = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2Button);

    await waitFor(() => {
      expect(screen.getAllByText('Unique Article Title 6').length).toBeGreaterThan(0);
    });

    // Should show articles 6-9
    expect(screen.getAllByText('Unique Article Title 9').length).toBeGreaterThan(0);
    // Article 0 might still be in sidebar, so just check it's not in main grid
    const mainGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    expect(mainGrid?.textContent).not.toContain('Unique Article Title 0');
  });

  it('resets to page 1 when search term changes', async () => {
    const manyArticles = Array.from({ length: 10 }, (_, i) => ({
      id: `article-${i}`,
      title: `Unique Title ${i}`,
      excerpt: `Excerpt ${i}`,
      author: 'Author',
      date: '2024-01-15',
      category: 'Technology',
      image: `/image-${i}.jpg`,
      slug: `article-${i}`,
    }));

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: manyArticles }),
    });

    renderBlog();

    await waitFor(() => {
      expect(screen.getAllByText('Unique Title 0').length).toBeGreaterThan(0);
    });

    // Go to page 2
    const page2Button = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2Button);

    await waitFor(() => {
      expect(screen.getAllByText('Unique Title 6').length).toBeGreaterThan(0);
    });

    // Search for something
    const searchInput = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(searchInput, { target: { value: 'Unique Title 0' } });

    // Should be back on page 1 and showing only the searched article
    await waitFor(() => {
      expect(screen.getAllByText('Unique Title 0').length).toBeGreaterThan(0);
      // Page 2 button should not exist anymore (only 1 result)
      expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument();
    });
  });

  it('calls correct API endpoint', async () => {
    const fetchSpy = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: mockArticles }),
    });
    global.fetch = fetchSpy;

    renderBlog();

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(blogApi.getArticles());
    });
  });
});
