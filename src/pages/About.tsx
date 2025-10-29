
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Sparkles, Target, Eye, Users, Award, TrendingUp, ChevronRight } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '500+', label: 'Successful Placements', icon: Award },
    { number: '16', label: 'Tech Specializations', icon: Target },
    { number: '95%', label: 'Client Satisfaction', icon: TrendingUp },
    { number: '200+', label: 'Partner Companies', icon: Users },
  ];

  const values = [
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI and technology to revolutionize recruitment processes.',
    },
    {
      icon: Users,
      title: 'Human-Centric',
      description: 'Placing people at the heart of everything we do, fostering meaningful connections.',
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Delivering exceptional results through meticulous attention to detail and quality.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-white via-lime-50/30 to-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-lime-100/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-lime-200/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-6 py-3 text-sm font-semibold text-lime-700 mb-8">
              <Sparkles className="w-4 h-4" />
              <span>About Our Mission</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Transforming
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-lime-600">
                Tech Recruitment
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Where AI-driven innovation meets human expertise to create exceptional 
              <span className="font-semibold text-gray-800"> talent connections</span>
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lime-50 text-lime-600 mb-4 group-hover:bg-lime-100 transition-colors">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Story Section */}
        <section className="py-32 bg-gradient-to-b from-white to-gray-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-6 py-3 text-sm font-semibold text-lime-700 mb-8">
                  <Target className="w-4 h-4" />
                  <span>Our Story</span>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                  Welcome To
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-lime-600">
                    SkillTude
                  </span>
                </h2>
                
                <div className="space-y-6 text-xl text-gray-600 leading-relaxed">
                  <p>
                    SkillTude represents the evolution of recruitment—where cutting-edge AI technology 
                    meets deep human understanding to create transformative career connections.
                  </p>
                  <p>
                    Our approach transcends traditional talent acquisition. We craft personalized 
                    career journeys that align with individual aspirations while building 
                    high-performing teams that drive innovation.
                  </p>
                  <p>
                    With expertise spanning 16 specialized tech sectors, we bridge the gap between 
                    exceptional talent and forward-thinking organizations, creating lasting partnerships 
                    that fuel growth and success.
                  </p>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 to-lime-600/20 rounded-3xl transform rotate-3"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3" 
                    alt="SkillTude team collaboration" 
                    className="relative rounded-3xl shadow-2xl w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission & Vision */}
        <section className="py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-6 py-3 text-sm font-semibold text-lime-700 mb-8">
                <Eye className="w-4 h-4" />
                <span>Our Purpose</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                Mission & <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-lime-600">Vision</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="group">
                <div className="bg-white rounded-3xl p-12 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-lime-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-8">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    To revolutionize tech recruitment by combining human expertise with cutting-edge AI, 
                    creating perfect matches between talented individuals and forward-thinking organizations 
                    that drive innovation and growth.
                  </p>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-white rounded-3xl p-12 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-lime-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-lime-500 to-lime-600 text-white mb-8">
                    <Eye className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    A world where every tech professional finds fulfilling work that leverages their unique skills, 
                    and every company builds diverse, high-performing teams that drive meaningful innovation 
                    and create lasting positive impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-6 py-3 text-sm font-semibold text-lime-700 mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Core Values</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                What Drives <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-lime-600">Us</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="group">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 h-full border border-gray-100 hover:border-lime-200 hover:shadow-xl transition-all duration-500">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-lime-500 to-lime-600 text-white mb-8 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">{value.title}</h3>
                      <p className="text-lg text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        

        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default About;
