import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  Share2, 
  BookOpen,
  Tag,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { blogApi } from '@/lib/api';
import { BlogPostData } from '@/types/blog.types';
import '@/styles/blog-content.css';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch article from API
  const fetchArticle = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(blogApi.getArticle(slug));
      
      if (response.status === 404) {
        setError('Article not found. It may have been removed or the link is incorrect.');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to load article');
      }
      
      const data = await response.json();
      
      if (data.success && data.article) {
        setPost(data.article);
        setRelatedPosts(data.relatedArticles || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Unable to load article. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to top when component mounts or ID changes
    window.scrollTo(0, 0);
    
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying URL to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Article URL copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Article URL copied to clipboard!');
    }
  };

  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg text-gray-600">Loading article...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center py-8">
                    <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {error.includes('not found') ? 'Article Not Found' : 'Error Loading Article'}
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md">
                      {error}
                    </p>
                    <div className="flex gap-4">
                      <Button onClick={() => id && fetchArticle(id)} variant="default">
                        Try Again
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/blog">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Blog
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </PageLayout>
    );
  }

  // No post found (shouldn't happen if error handling is correct)
  if (!post) {
    return (
      <PageLayout>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center py-8">
                    <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
                    <p className="text-gray-600 mb-6">
                      The article you're looking for doesn't exist.
                    </p>
                    <Button asChild variant="default">
                      <Link to="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </PageLayout>
    );
  }

  // Render the blog post
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
          <div className="absolute inset-0">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-blue-900/80" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-6">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>

            <div className="mb-6">
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                {post.category}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <article className="blog-content text-gray-700">
                  <div dangerouslySetInnerHTML={{ 
                    __html: post.content.startsWith('<') 
                      ? post.content // Already HTML from rich text editor
                      : (() => {
                          // Strip frontmatter from markdown before parsing
                          let cleaned = post.content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
                          cleaned = cleaned.replace(/\n---\s*\n\*\*Tags:\*\*[\s\S]*$/, '');
                          // Fix spacing: Convert double-space line breaks to paragraph breaks
                          cleaned = cleaned.replace(/  \n/g, '\n\n');
                          
                          // Add blank lines between paragraphs
                          const lines = cleaned.split('\n');
                          const fixed: string[] = [];
                          for (let i = 0; i < lines.length; i++) {
                            const line = lines[i];
                            const nextLine = lines[i + 1];
                            fixed.push(line);
                            if (line.trim() && nextLine && nextLine.trim() && 
                                !nextLine.startsWith('#') && !nextLine.startsWith('-') && 
                                !nextLine.startsWith('*') && !nextLine.startsWith('>')) {
                              fixed.push('');
                            }
                          }
                          cleaned = fixed.join('\n').trim();
                          
                          return marked.parse(cleaned, {
                            breaks: false,
                            gfm: true
                          });
                        })()
                  }} />
                </article>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Author Info */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">About the Author</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{post.author}</p>
                          <p className="text-sm text-gray-600">Senior Writer</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Expert in recruitment technology and workplace trends with over 10 years of industry experience.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Related Posts */}
                  {relatedPosts.length > 0 && (
                    <Card>
                      <CardHeader>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Related Articles
                        </h3>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {relatedPosts.map((relatedPost) => (
                          <Link 
                            key={relatedPost.id}
                            to={`/blog/${relatedPost.slug}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              <img 
                                src={relatedPost.image}
                                alt={relatedPost.title}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                                  {relatedPost.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {relatedPost.date}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default BlogPost;
