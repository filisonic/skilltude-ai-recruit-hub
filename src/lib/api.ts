/**
 * Centralized API configuration for the application
 *
 * Frontend is hosted on Hostinger; API runs on Render.
 * Always call the Render base URL — relative /api/* paths hit Hostinger HTML and break JSON.parse.
 */

export const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://skilltude-ai-recruit-hub.onrender.com'
).replace(/\/$/, '');

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalized}`;
}

export function getAdminToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function getAuthHeaders(extra: HeadersInit = {}): HeadersInit {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function adminFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(getAuthHeaders());
  if (init.headers) {
    const extra = new Headers(init.headers);
    extra.forEach((value, key) => headers.set(key, value));
  }

  // Let the browser set Content-Type for FormData / blobs
  if (init.body instanceof FormData) {
    headers.delete('Content-Type');
  }

  return fetch(apiUrl(path), {
    ...init,
    headers,
  });
}

/**
 * Blog API endpoints (Node backend on Render)
 */
export const blogApi = {
  getArticles: (): string => apiUrl('/api/blog/articles'),
  getArticle: (slug: string): string => apiUrl(`/api/blog/articles/${encodeURIComponent(slug)}`),
  getCategories: (): string => apiUrl('/api/blog/categories'),
};

// Backwards-compatible alias used by older imports
export const BLOG_API_URL = API_URL;
