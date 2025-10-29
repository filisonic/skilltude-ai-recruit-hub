

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
];

const BlogPreview = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Insights</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert articles on recruitment trends, career advice, and technology industry insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden card-hover">
              <Link to={`/blog/${post.id}`} className="block h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.category}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  <Link to={`/blog/${post.id}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center">
                  <div className="text-sm">
                    <p className="text-gray-900 font-medium">{post.author}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/blog">
            <Button className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white">
              Read More Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
