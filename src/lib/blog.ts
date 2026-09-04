/**
 * Normalize blog API payloads into the shape the React UI expects.
 * Render returns author as an object; rendering that in JSX crashes the whole app.
 */

export type NormalizedBlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  slug: string;
  content?: string;
  tags?: string[];
  readTime?: string;
  views?: number;
  status?: string;
};

function formatAuthor(author: unknown): string {
  if (!author) return 'SkillTude Team';
  if (typeof author === 'string') return author;
  if (typeof author === 'object') {
    const a = author as { first_name?: string; last_name?: string; name?: string; email?: string };
    if (a.name) return a.name;
    const full = [a.first_name, a.last_name].filter(Boolean).join(' ').trim();
    if (full && full !== 'Unknown Author') return full;
  }
  return 'SkillTude Team';
}

function formatDate(value: unknown): string {
  if (!value || typeof value !== 'string') return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function normalizeBlogPost(raw: any): NormalizedBlogPost {
  const slug = String(raw?.slug || raw?.id || '');
  return {
    id: String(raw?.uuid || raw?.id || slug),
    title: String(raw?.title || ''),
    excerpt: String(raw?.excerpt || ''),
    author: formatAuthor(raw?.author ?? raw?.author_name),
    date: formatDate(raw?.published_at || raw?.created_at || raw?.date),
    category: String(raw?.category || 'General'),
    image: String(raw?.featured_image_url || raw?.image || '/placeholder.svg'),
    slug,
    content: raw?.content != null ? String(raw.content) : undefined,
    tags: Array.isArray(raw?.tags)
      ? raw.tags.map(String)
      : typeof raw?.tags === 'string'
        ? (() => {
            try {
              const parsed = JSON.parse(raw.tags);
              return Array.isArray(parsed) ? parsed.map(String) : [];
            } catch {
              return [];
            }
          })()
        : [],
    readTime: raw?.read_time || raw?.readTime || undefined,
    views: typeof raw?.views === 'number' ? raw.views : Number(raw?.views) || 0,
    status: raw?.status || (raw?.published_at ? 'published' : 'draft'),
  };
}

export function normalizeBlogPosts(articles: unknown): NormalizedBlogPost[] {
  if (!Array.isArray(articles)) return [];
  return articles.map(normalizeBlogPost).filter((p) => p.slug || p.title);
}
