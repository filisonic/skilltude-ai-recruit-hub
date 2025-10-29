import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, Sparkles, ChevronDown } from 'lucide-react';
import SuperAntCharacter from '@/components/SuperAntCharacter';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Pure white background for clean GIF display */}
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200 rounded-full px-6 py-3 text-sm font-semibold text-teal-700 mb-8">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Recruitment Platform</span>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
        
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-gray-900">Transform Your</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 bg-size-200 bg-pos-0 animate-gradient">
                Talent Journey
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-light">
              Connect exceptional tech talent with innovative companies through 
              <span className="font-semibold text-gray-800"> AI-driven matching</span> and 
              <span className="font-semibold text-gray-800"> personalized experiences</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center mb-16">
              <Link to="/careers" className="w-full sm:w-auto">
                <Button size="lg" className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto group">
                  <Users className="w-6 h-6 mr-3" />
                  Find Your Dream Job
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 hover:shadow-xl w-full sm:w-auto group">
                  <Briefcase className="w-6 h-6 mr-3" />
                  Hire Top Talent
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - SuperAnt Character */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Hero-sized SuperAnt Character - Bigger */}
              <div className="w-96 h-96 md:w-[450px] md:h-[450px] lg:w-[600px] lg:h-[600px]">
                <SuperAntCharacter pose="power" className="" />
              </div>
              
              {/* Floating text bubble - repositioned to avoid navbar */}
              <div className="absolute top-4 -left-8 bg-white rounded-2xl px-6 py-3 shadow-xl border border-teal-200 animate-pulse max-w-xs">
                <p className="text-base font-semibold text-teal-700">Hi! I'm Skilly! Ready to supercharge your recruitment? 🚀</p>
                <div className="absolute top-full right-8 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white"></div>
              </div>
              
              {/* Pure white background for clean GIF display */}
            </div>
          </div>
        </div>

        {/* Stats Grid - moved below */}
        <div className="mt-20 text-center">
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto mb-16">
            <div className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 hover:border-teal-200 transition-all duration-300 hover:shadow-lg">
                <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">16+</div>
                <div className="text-lg text-gray-600 font-medium">Tech Specializations</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 hover:border-teal-200 transition-all duration-300 hover:shadow-lg">
                <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">500+</div>
                <div className="text-lg text-gray-600 font-medium">Successful Placements</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 hover:border-teal-200 transition-all duration-300 hover:shadow-lg">
                <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">95%</div>
                <div className="text-lg text-gray-600 font-medium">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="flex flex-col items-center text-gray-400">
          <span className="text-sm font-medium mb-2">Discover More</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;