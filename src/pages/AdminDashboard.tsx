import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  LogOut, 
  User, 
  BarChart3,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  ArrowLeft,
  Briefcase,
  Download,
  Users,
  TrendingUp,
  Clock,
  UserCheck,
  Building
} from 'lucide-react';

interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  created_at: string;
  views: number;
}

interface CVSubmission {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  current_position: string;
  experience_years: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  submitted_at: string;
  cv_filename: string;
}

interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  status: 'draft' | 'published' | 'paused' | 'filled' | 'expired' | 'archived';
  applications_count: number;
  created_at: string;
  priority: 'normal' | 'featured' | 'urgent';
}

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [cvSubmissions, setCvSubmissions] = useState<CVSubmission[]>([]);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const adminUser = localStorage.getItem('admin_user');

    if (!isLoggedIn || !adminUser) {
      navigate('/admin/login');
      return;
    }

    setUser(JSON.parse(adminUser));

    // Load sample articles (in production, fetch from database)
    setArticles([
      {
        id: 1,
        title: 'The Future of AI in Recruiting: What 2024 Holds',
        slug: 'future-of-ai-recruiting-2024',
        excerpt: 'Explore the latest AI innovations transforming talent acquisition, from predictive analytics to automated screening processes.',
        category: 'AI Trends',
        status: 'published',
        author: 'Dr. Sarah Mitchell',
        created_at: '2024-12-15',
        views: 2150
      },
      {
        id: 2,
        title: 'Tech Salary Trends: What Developers Can Expect in 2024',
        slug: 'tech-salary-trends-2024',
        excerpt: 'Comprehensive analysis of compensation trends across different tech roles, experience levels, and geographic markets.',
        category: 'Career Advice',
        status: 'published',
        author: 'Alex Chen',
        created_at: '2024-12-10',
        views: 1890
      },
      {
        id: 3,
        title: 'Remote-First Hiring: Building Global Tech Teams',
        slug: 'remote-first-hiring-strategies',
        excerpt: 'How companies are adapting their recruitment strategies to build successful distributed teams across time zones.',
        category: 'Industry Insights',
        status: 'published',
        author: 'Maria Rodriguez',
        created_at: '2024-12-05',
        views: 1456
      },
      {
        id: 4,
        title: 'Bridging the Cybersecurity Talent Gap: Innovative Solutions',
        slug: 'cybersecurity-talent-gap',
        excerpt: 'Addressing the critical shortage of cybersecurity professionals through creative recruitment and training approaches.',
        category: 'Tech Hiring',
        status: 'published',
        author: 'David Park',
        created_at: '2024-11-28',
        views: 1234
      },
      {
        id: 5,
        title: 'Startup vs Enterprise: Different Approaches to Tech Recruiting',
        slug: 'startup-vs-enterprise-recruiting',
        excerpt: 'Understanding how recruitment strategies differ between startups and large enterprises, and what works best for each.',
        category: 'Industry Insights',
        status: 'published',
        author: 'Jennifer Kim',
        created_at: '2024-11-20',
        views: 987
      },
      {
        id: 6,
        title: 'Developer Experience: The Key to Tech Talent Retention',
        slug: 'developer-experience-retention',
        excerpt: 'How creating exceptional developer experiences can significantly improve retention rates and attract top talent.',
        category: 'Workplace Culture',
        status: 'published',
        author: 'Ryan Thompson',
        created_at: '2024-11-15',
        views: 1678
      }
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const handleDeleteArticle = (id: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(prev => prev.filter(article => article.id !== id));
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status === 'draft').length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0)
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Site</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user.first_name} {user.last_name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Articles</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-green-600">{stats.published}</p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.drafts}</p>
                </div>
                <Edit className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">Blog Articles</CardTitle>
              <Link to="/admin/articles/create">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Article
                </Button>
              </Link>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Get started by creating your first blog article'
                    }
                  </p>
                  <Link to="/admin/articles/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Article
                    </Button>
                  </Link>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{article.title}</h3>
                        <Badge 
                          variant={article.status === 'published' ? 'default' : 'secondary'}
                          className={
                            article.status === 'published' ? 'bg-green-100 text-green-800' :
                            article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {article.status}
                        </Badge>
                        <Badge variant="outline">{article.category}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views} views
                        </span>
                        <span>by {article.author}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {article.status === 'published' && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/blog/${article.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/articles/edit/${article.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;