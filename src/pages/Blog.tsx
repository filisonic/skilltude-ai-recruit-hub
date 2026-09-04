
import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { blogApi } from '@/lib/api';
import { normalizeBlogPosts, NormalizedBlogPost } from '@/lib/blog';

// Lazy load components that aren't immediately visible
const LazyImage = lazy(() => import('@/components/LazyImage'));

const Blog = () => {
  const [posts, setPosts] = useState<NormalizedBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Fetch blog posts from API
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(blogApi.getArticles());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPosts(normalizeBlogPosts(data.articles));
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts and scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogPosts();
  }, []);

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const uniqueCategories = new Set(posts.map(post => post.category));
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [posts]);

  // Memoized filtered posts for better performance
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  // Memoized paginated posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Memoized recent posts for sidebar
  const recentPosts = useMemo(() => posts.slice(0, 3), [posts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
          {/* Hero Section - Optimized gradient */}
          <section className="bg-gradient-to-br from-teal-50 via-cyan-50/50 to-orange-50/30 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Blog & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500">Insights</span>
                </h1>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  Expert articles, industry insights, and career advice from our recruitment specialists.
                </p>
              </div>
            </div>
          </section>
          
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Main content */}
                <div className="lg:w-2/3">
                  {/* Search and Filter Bar */}
                  <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input 
                        placeholder="Search articles..." 
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full"
                      />
                    </div>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Loading State */}
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
                      <p className="text-gray-600">Loading articles...</p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                      <div className="text-red-600 mb-4">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-semibold">Unable to load articles</p>
                      </div>
                      <p className="text-gray-700 mb-4">{error}</p>
                      <Button 
                        onClick={fetchBlogPosts}
                        className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}

                  {/* Posts Grid - Only render visible posts */}
                  {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {paginatedPosts.map((post) => (
                      <Card key={post.slug || post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <Link to={`/blog/${post.slug}`} className="block h-48 overflow-hidden">
                          <Suspense fallback={
                            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                              <div className="text-gray-400">Loading...</div>
                            </div>
                          }>
                            <LazyImage 
                              src={post.image} 
                              alt={post.title} 
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </Suspense>
                        </Link>
                        <CardContent className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span className="px-2 py-1 bg-gradient-to-r from-teal-100 to-orange-100 text-teal-700 rounded-full text-xs font-medium">
                              {post.category}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{post.date}</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-3">
                            <Link to={`/blog/${post.slug}`} className="hover:text-teal-600 transition-colors">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <p className="text-gray-900 font-medium">{post.author}</p>
                            </div>
                            <Link 
                              to={`/blog/${post.slug}`}
                              className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
                            >
                              Read more →
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* Pagination - Only show if there are multiple pages */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button 
                            key={page}
                            variant={currentPage === page ? "default" : "outline"} 
                            size="sm" 
                            className="w-9 h-9 p-0"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No results message */}
                  {!loading && !error && filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                      <Button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All');
                          setCurrentPage(1);
                        }}
                        className="mt-4"
                        variant="outline"
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Sidebar - Memoized for performance */}
                <aside className="lg:w-1/3 space-y-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4">Categories</h3>
                    <ul className="space-y-2">
                      {categories.map((category) => (
                        <li key={category}>
                          <button
                            onClick={() => handleCategoryChange(category)}
                            className={`text-left w-full px-3 py-2 rounded-lg transition-colors ${
                              selectedCategory === category 
                                ? 'bg-gradient-to-r from-teal-100 to-orange-100 text-teal-700 font-medium' 
                                : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                            }`}
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4">Subscribe</h3>
                    <p className="text-gray-600 mb-4">
                      Stay updated with our latest articles, news, and insights.
                    </p>
                    <form className="space-y-4">
                      <Input 
                        type="email" 
                        placeholder="Your email address" 
                        required
                      />
                      <Button className="w-full bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600">
                        Subscribe
                      </Button>
                    </form>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
                    <ul className="space-y-4">
                      {recentPosts.map((post) => (
                        <li key={post.slug || post.id}>
                          <Link to={`/blog/${post.slug}`} className="flex group">
                            <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden">
                              <Suspense fallback={<div className="h-full w-full bg-gray-200 animate-pulse" />}>
                                <LazyImage 
                                  src={post.image}
                                  alt={post.title}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                              </Suspense>
                            </div>
                            <div className="ml-4 flex-1">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                                {post.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default Blog;
