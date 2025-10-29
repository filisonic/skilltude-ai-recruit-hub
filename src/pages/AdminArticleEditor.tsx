import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Image, 
  Tag, 
  Calendar,
  User,
  FileText,
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured_image_url: string;
  status: 'draft' | 'published' | 'archived';
}

const AdminArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState<ArticleData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featured_image_url: '',
    status: 'draft'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newTag, setNewTag] = useState('');

  const categories = [
    'AI Trends',
    'Career Advice', 
    'Industry Insights',
    'Tech Hiring',
    'Workplace Culture',
    'Future of Work'
  ];

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    // If editing, load article data (in production, fetch from database)
    if (isEditing && id) {
      // Sample data for editing - you can modify this to load actual article data
      setFormData({
        title: 'The Future of AI in Recruiting: What 2024 Holds',
        slug: 'future-of-ai-recruiting-2024',
        excerpt: 'Explore the latest AI innovations transforming talent acquisition, from predictive analytics to automated screening processes.',
        content: `# The Future of AI in Recruiting: What 2024 Holds

Artificial Intelligence is revolutionizing the recruitment industry at an unprecedented pace. As we navigate through 2024, AI technologies are becoming more sophisticated, accessible, and integral to successful talent acquisition strategies.

## The Current State of AI in Recruiting

### Market Adoption
- **78% of companies** are now using some form of AI in their recruitment process
- **$3.2 billion** invested in HR tech AI solutions in 2024
- **45% reduction** in average time-to-hire across industries
- **60% improvement** in candidate quality scores

## Breakthrough Innovations in 2024

### 1. Conversational AI Recruiters
Advanced chatbots are now conducting initial candidate screenings with human-like conversations:
- **24/7 availability** for candidate interactions
- **Multi-language support** for global recruitment
- **Emotional intelligence** to assess soft skills
- **Real-time feedback** to candidates

### 2. Predictive Performance Analytics
AI models can now predict candidate success with remarkable accuracy:
- **85% accuracy** in predicting 12-month retention
- **Career trajectory mapping** for long-term planning
- **Team compatibility analysis** for cultural fit
- **Performance potential scoring** based on historical data

## The Human-AI Collaboration Model

The future of AI in recruiting is not about replacing human recruiters—it's about augmenting their capabilities and enabling them to focus on what they do best: building relationships, making strategic decisions, and creating exceptional candidate experiences.

Organizations that embrace AI thoughtfully and strategically will gain significant competitive advantages in the war for talent.`,
        category: 'AI Trends',
        tags: ['AI', 'Recruitment', 'Technology', 'Future of Work', 'HR Tech', 'Innovation'],
        featured_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3',
        status: 'published'
      });
    }
  }, [navigate, isEditing, id]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug when title changes
      ...(name === 'title' && { slug: generateSlug(value) })
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setIsSaving(true);
    setMessage('');

    try {
      // Validate required fields
      if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
        setMessage('Please fill in all required fields');
        setIsSaving(false);
        return;
      }

      // In production, this would send to your database API
      const articleData = {
        ...formData,
        status,
        updated_at: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage(`Article ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);

    } catch (error) {
      setMessage('Error saving article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Article' : 'Create New Article'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSave('draft')}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={() => handleSave('published')}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Globe className="w-4 h-4 mr-2" />
                {isSaving ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
            message.includes('Error') 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {message.includes('Error') ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-semibold"
                      placeholder="Enter article title..."
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="url-friendly-slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      URL: /blog/{formData.slug || 'article-slug'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Excerpt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  name="excerpt"
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the article..."
                  value={formData.excerpt}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500 mt-2">
                  This will appear in article previews and search results.
                </p>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Content *</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  name="content"
                  required
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Write your article content here... (Markdown supported)"
                  value={formData.content}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500 mt-2">
                  You can use Markdown formatting for headers, links, lists, etc.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant={formData.status === 'published' ? 'default' : 'secondary'}
                  className={
                    formData.status === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }
                >
                  {formData.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select category...</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button size="sm" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Image className="w-4 h-4" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="url"
                  name="featured_image_url"
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={formData.featured_image_url}
                  onChange={handleInputChange}
                />
                {formData.featured_image_url && (
                  <div className="mt-3">
                    <img 
                      src={formData.featured_image_url} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminArticleEditor;