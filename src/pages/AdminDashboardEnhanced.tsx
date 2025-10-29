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
  ArrowLeft,
  Briefcase,
  Download,
  Users,
  TrendingUp,
  Clock,
  UserCheck,
  Building,
  Mail,
  Phone,
  MapPin
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
  phone: string;
  current_position: string;
  experience_years: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  submitted_at: string;
  cv_filename: string;
  location: string;
  skills: string[];
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
  salary_min: number;
  salary_max: number;
}

const AdminDashboardEnhanced = () => {
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

    // Load sample data (in production, fetch from database)
    setArticles([
      {
        id: 1,
        title: 'Top AI Recruitment Trends for 2024',
        slug: 'ai-recruitment-trends-2024',
        excerpt: 'Discover how artificial intelligence is transforming the recruitment landscape...',
        category: 'AI Trends',
        status: 'published',
        author: 'Admin User',
        created_at: '2024-01-15',
        views: 1250
      },
      {
        id: 2,
        title: 'Building Effective Remote Teams',
        slug: 'building-effective-remote-teams',
        excerpt: 'Best practices for managing and building successful remote development teams...',
        category: 'Future of Work',
        status: 'published',
        author: 'Admin User',
        created_at: '2024-01-10',
        views: 890
      }
    ]);

    setCvSubmissions([
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        current_position: 'Senior Software Engineer',
        experience_years: '5-10',
        status: 'new',
        submitted_at: '2024-01-20',
        cv_filename: 'john_doe_cv.pdf',
        location: 'San Francisco, CA',
        skills: ['React', 'Node.js', 'Python', 'AWS']
      },
      {
        id: 2,
        first_name: 'Sarah',
        last_name: 'Chen',
        email: 'sarah.chen@email.com',
        phone: '+1-555-0124',
        current_position: 'Data Scientist',
        experience_years: '3-5',
        status: 'reviewed',
        submitted_at: '2024-01-18',
        cv_filename: 'sarah_chen_cv.pdf',
        location: 'New York, NY',
        skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow']
      },
      {
        id: 3,
        first_name: 'Mike',
        last_name: 'Johnson',
        email: 'mike.johnson@email.com',
        phone: '+1-555-0125',
        current_position: 'UX Designer',
        experience_years: '3-5',
        status: 'shortlisted',
        submitted_at: '2024-01-16',
        cv_filename: 'mike_johnson_cv.pdf',
        location: 'Austin, TX',
        skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research']
      }
    ]);

    setJobListings([
      {
        id: 1,
        title: 'Senior Full Stack Developer',
        company: 'TechFlow Solutions',
        location: 'San Francisco, CA (Remote)',
        job_type: 'full-time',
        status: 'published',
        applications_count: 24,
        created_at: '2024-01-15',
        priority: 'featured',
        salary_min: 120000,
        salary_max: 180000
      },
      {
        id: 2,
        title: 'Data Science Manager',
        company: 'DataCorp Inc',
        location: 'New York, NY',
        job_type: 'full-time',
        status: 'published',
        applications_count: 18,
        created_at: '2024-01-12',
        priority: 'urgent',
        salary_min: 150000,
        salary_max: 220000
      },
      {
        id: 3,
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'Austin, TX',
        job_type: 'full-time',
        status: 'draft',
        applications_count: 0,
        created_at: '2024-01-10',
        priority: 'normal',
        salary_min: 80000,
        salary_max: 120000
      }
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const handleCVStatusChange = (cvId: number, newStatus: string) => {
    setCvSubmissions(prev => 
      prev.map(cv => 
        cv.id === cvId ? { ...cv, status: newStatus as any } : cv
      )
    );
  };

  const handleJobStatusChange = (jobId: number, newStatus: string) => {
    setJobListings(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, status: newStatus as any } : job
      )
    );
  };

  const downloadCV = (filename: string) => {
    // In production, this would download from your server
    alert(`Downloading ${filename}...`);
  };

  const filteredItems = () => {
    switch (activeTab) {
      case 'articles':
        return articles.filter(article => {
          const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
          return matchesSearch && matchesStatus;
        });
      case 'cvs':
        return cvSubmissions.filter(cv => {
          const matchesSearch = 
            cv.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cv.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cv.current_position.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = statusFilter === 'all' || cv.status === statusFilter;
          return matchesSearch && matchesStatus;
        });
      case 'jobs':
        return jobListings.filter(job => {
          const matchesSearch = 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
          return matchesSearch && matchesStatus;
        });
      default:
        return [];
    }
  };

  const overallStats = {
    totalArticles: articles.length,
    publishedArticles: articles.filter(a => a.status === 'published').length,
    totalCVs: cvSubmissions.length,
    newCVs: cvSubmissions.filter(cv => cv.status === 'new').length,
    totalJobs: jobListings.length,
    activeJobs: jobListings.filter(job => job.status === 'published').length,
    totalApplications: jobListings.reduce((sum, job) => sum + job.applications_count, 0),
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
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'articles', label: 'Blog Articles', icon: FileText },
              { id: 'cvs', label: 'CV Submissions', icon: Users, link: '/admin/cv-management' },
              { id: 'jobs', label: 'Job Listings', icon: Briefcase }
            ].map((tab) => {
              const IconComponent = tab.icon;
              
              if (tab.link) {
                return (
                  <Link
                    key={tab.id}
                    to={tab.link}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </Link>
                );
              }
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Blog Articles</p>
                      <p className="text-3xl font-bold text-gray-900">{overallStats.totalArticles}</p>
                      <p className="text-sm text-green-600">{overallStats.publishedArticles} published</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Link to="/admin/cv-management">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">CV Submissions</p>
                        <p className="text-3xl font-bold text-gray-900">{overallStats.totalCVs}</p>
                        <p className="text-sm text-orange-600">{overallStats.newCVs} new</p>
                      </div>
                      <Users className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Job Listings</p>
                      <p className="text-3xl font-bold text-gray-900">{overallStats.totalJobs}</p>
                      <p className="text-sm text-blue-600">{overallStats.activeJobs} active</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Applications</p>
                      <p className="text-3xl font-bold text-gray-900">{overallStats.totalApplications}</p>
                      <p className="text-sm text-purple-600">across all jobs</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Recent Articles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {articles.slice(0, 3).map((article) => (
                    <div key={article.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{article.title}</p>
                        <p className="text-xs text-gray-500">{article.views} views</p>
                      </div>
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                        {article.status}
                      </Badge>
                    </div>
                  ))}
                  <Link to="/admin/articles/create">
                    <Button size="sm" className="w-full mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      New Article
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    Recent CVs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cvSubmissions.slice(0, 3).map((cv) => (
                    <div key={cv.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{cv.first_name} {cv.last_name}</p>
                        <p className="text-xs text-gray-500">{cv.current_position}</p>
                      </div>
                      <Badge variant={cv.status === 'new' ? 'destructive' : 'default'}>
                        {cv.status}
                      </Badge>
                    </div>
                  ))}
                  <Link to="/admin/cv-management">
                    <Button size="sm" className="w-full mt-4">
                      <Eye className="w-4 h-4 mr-2" />
                      View All CVs
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-500" />
                    Active Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {jobListings.filter(job => job.status === 'published').slice(0, 3).map((job) => (
                    <div key={job.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-gray-500">{job.applications_count} applications</p>
                      </div>
                      <Badge variant={job.priority === 'urgent' ? 'destructive' : 'default'}>
                        {job.priority}
                      </Badge>
                    </div>
                  ))}
                  <Button size="sm" className="w-full mt-4" onClick={() => setActiveTab('jobs')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Job
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Content Tabs */}
        {(activeTab === 'articles' || activeTab === 'cvs' || activeTab === 'jobs') && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">
                  {activeTab === 'articles' && 'Blog Articles'}
                  {activeTab === 'cvs' && 'CV Submissions'}
                  {activeTab === 'jobs' && 'Job Listings'}
                </CardTitle>
                <div className="flex items-center gap-3">
                  {activeTab === 'articles' && (
                    <Link to="/admin/articles/create">
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        <Plus className="w-4 h-4 mr-2" />
                        New Article
                      </Button>
                    </Link>
                  )}
                  {activeTab === 'jobs' && (
                    <Button className="bg-purple-500 hover:bg-purple-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Job
                    </Button>
                  )}
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
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
                  {activeTab === 'articles' && (
                    <>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </>
                  )}
                  {activeTab === 'cvs' && (
                    <>
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </>
                  )}
                  {activeTab === 'jobs' && (
                    <>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="paused">Paused</option>
                      <option value="filled">Filled</option>
                      <option value="expired">Expired</option>
                    </>
                  )}
                </select>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredItems().length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 text-gray-300 mx-auto mb-4">
                      {activeTab === 'articles' && <FileText className="w-12 h-12" />}
                      {activeTab === 'cvs' && <Users className="w-12 h-12" />}
                      {activeTab === 'jobs' && <Briefcase className="w-12 h-12" />}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : `No ${activeTab} available yet`
                      }
                    </p>
                  </div>
                ) : (
                  filteredItems().map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        {/* Article Row */}
                        {activeTab === 'articles' && (
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{item.title}</h3>
                              <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                                {item.status}
                              </Badge>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{item.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                              <span>{item.views} views</span>
                              <span>by {item.author}</span>
                            </div>
                          </div>
                        )}

                        {/* CV Row */}
                        {activeTab === 'cvs' && (
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {item.first_name} {item.last_name}
                              </h3>
                              <Badge variant={item.status === 'new' ? 'destructive' : 'default'}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {item.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {item.phone}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {item.experience_years} years
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">{item.current_position}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.skills.slice(0, 4).map((skill: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {item.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.skills.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Job Row */}
                        {activeTab === 'jobs' && (
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{item.title}</h3>
                              <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                                {item.status}
                              </Badge>
                              <Badge variant={item.priority === 'urgent' ? 'destructive' : 'outline'}>
                                {item.priority}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {item.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.job_type}
                              </div>
                              <div className="flex items-center gap-1">
                                <UserCheck className="w-3 h-3" />
                                {item.applications_count} applications
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">
                              ${item.salary_min.toLocaleString()} - ${item.salary_max.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {activeTab === 'articles' && (
                          <>
                            {item.status === 'published' && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/blog/${item.slug}`} target="_blank">
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/admin/articles/edit/${item.id}`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                          </>
                        )}

                        {activeTab === 'cvs' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => downloadCV(item.cv_filename)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <select
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              value={item.status}
                              onChange={(e) => handleCVStatusChange(item.id, e.target.value)}
                            >
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="interviewed">Interviewed</option>
                              <option value="hired">Hired</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </>
                        )}

                        {activeTab === 'jobs' && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <select
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              value={item.status}
                              onChange={(e) => handleJobStatusChange(item.id, e.target.value)}
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="paused">Paused</option>
                              <option value="filled">Filled</option>
                              <option value="expired">Expired</option>
                              <option value="archived">Archived</option>
                            </select>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardEnhanced;