
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const categories = [
  'All', 'AI Trends', 'Career Advice', 'Industry Insights', 
  'Tech Hiring', 'Workplace Culture', 'Future of Work'
];

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
  {
    id: 'building-diverse-teams',
    title: 'Building Diverse Technical Teams: Strategies That Work',
    excerpt: 'Practical approaches to increasing diversity in your tech hiring while strengthening team performance.',
    author: 'James Wilson',
    date: 'March 22, 2023',
    category: 'Workplace Culture',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3'
  },
  {
    id: 'remote-work-policies',
    title: 'Creating Effective Remote Work Policies for Tech Teams',
    excerpt: 'Best practices for managing distributed technical teams in the post-pandemic workplace.',
    author: 'Lisa Chen',
    date: 'March 12, 2023',
    category: 'Future of Work',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3'
  },
  {
    id: 'hiring-mistakes',
    title: '5 Common Tech Hiring Mistakes and How to Avoid Them',
    excerpt: 'Learn how to identify and prevent the most frequent errors companies make when recruiting technical talent.',
    author: 'Robert Kim',
    date: 'February 28, 2023',
    category: 'Tech Hiring',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3'
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & Insights</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" className="w-9 h-9 p-0">1</Button>
                    <Button variant="outline" size="sm" className="w-9 h-9 p-0">2</Button>
                    <Button variant="outline" size="sm" className="w-9 h-9 p-0">3</Button>
                    <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                      <span className="sr-only">Next page</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3 space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Search</h3>
                  <div className="flex">
                    <Input 
                      placeholder="Search articles..." 
                      className="rounded-r-none border-r-0"
                    />
                    <Button variant="default" className="rounded-l-none">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category}>
                        <Link 
                          to={`/blog/category/${category.toLowerCase().replace(' ', '-')}`}
                          className="text-gray-600 hover:text-primary"
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
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
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Subscribe
                    </Button>
                  </form>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
                  <ul className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <li key={post.id}>
                        <Link to={`/blog/${post.id}`} className="flex group">
                          <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden">
                            <img 
                              src={post.image}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-primary">{post.title}</p>
                            <p className="text-xs text-gray-500">{post.date}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
