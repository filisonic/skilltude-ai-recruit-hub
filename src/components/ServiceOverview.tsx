
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Cog, Target, Sparkles, ArrowRight, Zap } from 'lucide-react';
import AntCharacter from '@/components/AntCharacter';
import SuperAntCharacter from '@/components/SuperAntCharacter';

const services = [
  {
    id: 'talent-acquisition',
    title: 'Smart Talent Acquisition',
    description: 'Discover exceptional tech professionals through our data-driven recruitment strategies and industry expertise.',
    icon: Target,
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100/50',
    antPose: 'pointing' as const,
  },
  {
    id: 'recruitment-automation',
    title: 'Intelligent Automation',
    description: 'Transform your hiring workflow with AI-powered automation that saves time and improves quality.',
    icon: Cog,
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100/50',
    antPose: 'thinking' as const,
  },
  {
    id: 'ai-powered-matching',
    title: 'AI-Powered Matching',
    description: 'Connect perfect candidates with ideal opportunities using advanced machine learning algorithms.',
    icon: Brain,
    gradient: 'from-blue-800 to-orange-600',
    bgGradient: 'from-teal-50 to-orange-50/50',
    antPose: 'presenting' as const,
  },
  {
    id: 'candidate-experience',
    title: 'Premium Experience',
    description: 'Deliver exceptional candidate journeys from first contact through successful onboarding.',
    icon: Sparkles,
    gradient: 'from-orange-500 to-orange-600',
    bgGradient: 'from-orange-50 to-orange-100/50',
    antPose: 'celebrating' as const,
  },
];

const ServiceOverview = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Side Multitasking Ant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200 rounded-full px-6 py-3 text-sm font-semibold text-blue-700 mb-6">
              <Zap className="w-4 h-4" />
              <span>Comprehensive Solutions</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-900 to-orange-600">Services</span>
            </h2>
            <p className="text-2xl text-gray-600 leading-relaxed">
              End-to-end recruitment solutions designed to transform how talent and opportunities connect in the tech industry
            </p>
          </div>

          {/* Right side - Multitasking Ant Character - Much Bigger */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-[600px] h-[600px] md:w-[750px] md:h-[750px] lg:w-[900px] lg:h-[900px]">
              <SuperAntCharacter pose="flying" className="" />
            </div>
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Link key={service.id} to={`/services/${service.id}`} className="block">
                <Card className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${service.bgGradient} backdrop-blur-sm hover:scale-105 overflow-hidden relative cursor-pointer`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm"></div>
                  
                  <CardContent className="relative p-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-gray-800 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* CTA */}
                    <div className="inline-flex items-center group/link">
                      <span className="text-gray-700 group-hover:text-gray-900 font-semibold text-lg group-hover:text-gray-800 transition-colors">
                        Explore Service
                        <ArrowRight className="w-5 h-5 ml-2 inline group-hover/link:translate-x-1 transition-transform" />
                      </span>
                    </div>
                    
                    {/* Decoration */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${service.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center">
          <Link to="/services">
            <Button size="lg" className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-10 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl group">
              Explore All Services
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceOverview;
