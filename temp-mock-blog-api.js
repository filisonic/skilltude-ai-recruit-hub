/**
 * Temporary mock blog API server
 * Run this to test your blog frontend while fixing database credentials
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Mock blog articles (same as what you added to database)
const mockArticles = [
  {
    id: 1,
    uuid: 'uuid-1',
    title: 'Welcome to SkillTude Blog',
    slug: 'welcome-to-skilltude-blog',
    excerpt: 'Discover how SkillTude is revolutionizing recruitment with AI-powered solutions.',
    content: '# Welcome to SkillTude Blog\n\nWe are excited to launch our blog where we will share insights about recruitment, AI technology, and career development.\n\n## What to Expect\n\n- Industry insights\n- Recruitment best practices\n- Career advice\n- Technology updates\n\nStay tuned for more content!',
    featured_image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    category: 'Company News',
    tags: ['announcement', 'welcome', 'blog'],
    author: {
      id: 1,
      first_name: 'SkillTude',
      last_name: 'Team',
      email: 'admin@skilltude.com'
    },
    status: 'published',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views: 0,
    read_time: '2 min read'
  },
  {
    id: 2,
    uuid: 'uuid-2',
    title: 'The Future of AI in Recruitment',
    slug: 'future-of-ai-in-recruitment',
    excerpt: 'Explore how artificial intelligence is transforming the recruitment landscape.',
    content: '# The Future of AI in Recruitment\n\nArtificial Intelligence is revolutionizing how companies find and hire talent.\n\n## Key Benefits\n\n1. **Faster Screening**: AI can process thousands of CVs in minutes\n2. **Better Matching**: Advanced algorithms match candidates to roles\n3. **Reduced Bias**: AI helps eliminate unconscious bias\n4. **Improved Experience**: Candidates get faster responses\n\n## The Road Ahead\n\nAs AI technology continues to evolve, we can expect even more innovations in recruitment.',
    featured_image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    category: 'Technology',
    tags: ['AI', 'recruitment', 'technology', 'innovation'],
    author: {
      id: 1,
      first_name: 'SkillTude',
      last_name: 'Team',
      email: 'admin@skilltude.com'
    },
    status: 'published',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views: 0,
    read_time: '3 min read'
  },
  {
    id: 3,
    uuid: 'uuid-3',
    title: '10 Tips for Writing a Winning CV',
    slug: '10-tips-for-winning-cv',
    excerpt: 'Learn how to create a CV that stands out and gets you noticed by recruiters.',
    content: '# 10 Tips for Writing a Winning CV\n\nYour CV is your first impression. Here are 10 tips to make it count:\n\n## 1. Keep it Concise\nAim for 2 pages maximum.\n\n## 2. Use Action Verbs\nStart bullet points with strong action verbs.\n\n## 3. Quantify Achievements\nUse numbers to demonstrate impact.\n\n## 4. Tailor to the Role\nCustomize your CV for each application.\n\n## 5. Highlight Key Skills\nMake your relevant skills easy to find.',
    featured_image_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
    category: 'Career',
    tags: ['CV', 'career', 'tips', 'job search'],
    author: {
      id: 1,
      first_name: 'SkillTude',
      last_name: 'Team',
      email: 'admin@skilltude.com'
    },
    status: 'published',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views: 0,
    read_time: '4 min read'
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'mock'
  });
});

// Get all articles
app.get('/api/blog/articles', (req, res) => {
  console.log('📄 Mock API: Serving blog articles');
  res.json({
    success: true,
    articles: mockArticles,
    count: mockArticles.length
  });
});

// Get single article
app.get('/api/blog/articles/:slug', (req, res) => {
  const { slug } = req.params;
  const article = mockArticles.find(a => a.slug === slug);
  
  if (!article) {
    return res.status(404).json({
      success: false,
      error: 'Article not found'
    });
  }
  
  res.json({
    success: true,
    article,
    relatedArticles: mockArticles.filter(a => a.id !== article.id).slice(0, 3)
  });
});

// Get categories
app.get('/api/blog/categories', (req, res) => {
  const categories = [...new Set(mockArticles.map(a => a.category))].map((name, index) => ({
    id: index + 1,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    description: null,
    color: '#4F46E5'
  }));
  
  res.json({
    success: true,
    categories,
    count: categories.length
  });
});

app.listen(PORT, () => {
  console.log(`
🚀 MOCK Blog API Server running on http://localhost:${PORT}
📄 Serving ${mockArticles.length} mock articles
🔗 Your blog should work at http://localhost:5173/blog
  `);
});