
import React, { useState, useMemo, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Lazy load components that aren't immediately visible
const LazyImage = lazy(() => import('@/components/LazyImage'));

const categories = [
  'All', 'AI Trends', 'Career Advice', 'Industry Insights', 
  'Tech Hiring', 'Workplace Culture', 'Future of Work'
];

const blogPosts = [
  {
    id: 'future-of-ai-recruiting-2024',
    title: 'The Future of AI in Recruiting: What 2024 Holds',
    excerpt: 'Explore the latest AI innovations transforming talent acquisition, from predictive analytics to automated screening processes.',
    author: 'Dr. Sarah Mitchell',
    date: 'December 15, 2024',
    category: 'AI Trends',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3'
  },
  {
    id: 'tech-salary-trends-2024',
    title: 'Tech Salary Trends: What Developers Can Expect in 2024',
    excerpt: 'Comprehensive analysis of compensation trends across different tech roles, experience levels, and geographic markets.',
    author: 'Alex Chen',
    date: 'December 10, 2024',
    category: 'Career Advice',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3'
  },
  {
    id: 'remote-first-hiring-strategies',
    title: 'Remote-First Hiring: Building Global Tech Teams',
    excerpt: 'How companies are adapting their recruitment strategies to build successful distributed teams across time zones.',
    author: 'Maria Rodriguez',
    date: 'December 5, 2024',
    category: 'Industry Insights',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3'
  },
  {
    id: 'cybersecurity-talent-gap',
    title: 'Bridging the Cybersecurity Talent Gap: Innovative Solutions',
    excerpt: 'Addressing the critical shortage of cybersecurity professionals through creative recruitment and training approaches.',
    author: 'David Park',
    date: 'November 28, 2024',
    category: 'Tech Hiring',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3'
  },
  {
    id: 'startup-vs-enterprise-recruiting',
    title: 'Startup vs Enterprise: Different Approaches to Tech Recruiting',
    excerpt: 'Understanding how recruitment strategies differ between startups and large enterprises, and what works best for each.',
    author: 'Jennifer Kim',
    date: 'November 20, 2024',
    category: 'Industry Insights',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3'
  },
  {
    id: 'developer-experience-retention',
    title: 'Developer Experience: The Key to Tech Talent Retention',
    excerpt: 'How creating exceptional developer experiences can significantly improve retention rates and attract top talent.',
    author: 'Ryan Thompson',
    date: 'November 15, 2024',
    category: 'Workplace Culture',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3'
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Memoized filtered posts for better performance
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Memoized paginated posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Memoized recent posts for sidebar
  const recentPosts = useMemo(() => blogPosts.slice(0, 3), []);

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

                  {/* Posts Grid - Only render visible posts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <Link to={`/blog/${post.id}`} className="block h-48 overflow-hidden">
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
                            <Link to={`/blog/${post.id}`} className="hover:text-teal-600 transition-colors">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <p className="text-gray-900 font-medium">{post.author}</p>
                            </div>
                            <Link 
                              to={`/blog/${post.id}`}
                              className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
                            >
                              Read more →
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
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
                  {filteredPosts.length === 0 && (
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
                        <li key={post.id}>
                          <Link to={`/blog/${post.id}`} className="flex group">
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
