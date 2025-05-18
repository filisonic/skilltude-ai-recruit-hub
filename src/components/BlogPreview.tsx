
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const blogPosts = [
  {
    id: 'ai-recruitment-trends',
    title: 'Top AI Recruitment Trends for 2023',
    excerpt: 'Discover how artificial intelligence is transforming the recruitment landscape and what to expect in the coming year.',
    author: 'Dr. Elena Park',
    date: 'May 15, 2023',
    category: 'AI Trends',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3'
  },
  {
    id: 'technical-interviewing',
    title: 'Mastering Technical Interviews: A Guide for Candidates',
    excerpt: 'Practical strategies to prepare for and excel in technical interviews across various tech disciplines.',
    author: 'Michael Rodriguez',
    date: 'April 28, 2023',
    category: 'Career Advice',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3'
  },
  {
    id: 'talent-shortage',
    title: 'Addressing the Global Tech Talent Shortage',
    excerpt: 'How companies can navigate the challenges of finding skilled tech professionals in a competitive market.',
    author: 'Sarah Johnson',
    date: 'April 10, 2023',
    category: 'Industry Insights',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3'
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
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
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
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Read More Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
