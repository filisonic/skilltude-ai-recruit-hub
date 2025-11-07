

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import ServiceOverview from '@/components/ServiceOverview';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonial from '@/components/Testimonial';
import IndustriesGrid from '@/components/IndustriesGrid';
import BlogPreview from '@/components/BlogPreview';
import CtaSection from '@/components/CtaSection';
import FloatingAnt from '@/components/FloatingAnt';
import { Button } from '@/components/ui/button';
import { FileCheck, ArrowRight, Sparkles } from 'lucide-react';

const Index = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
          <Hero />
          
          {/* CV Analysis CTA Section */}
          <section className="py-16 bg-gradient-to-br from-teal-50 via-white to-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-teal-100 p-8 md:p-12">
                <div className="text-center max-w-3xl mx-auto">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200 rounded-full px-6 py-3 text-sm font-semibold text-teal-700 mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span>Free Professional CV Analysis</span>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Heading */}
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    <span className="text-gray-900">Get Your CV</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500">
                      Professionally Analyzed
                    </span>
                  </h2>
                  
                  {/* Description */}
                  <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                    Upload your CV and receive expert feedback within 24-48 hours. 
                    Discover how to optimize your CV for ATS systems and stand out to recruiters.
                  </p>
                  
                  {/* Benefits */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <FileCheck className="w-5 h-5 text-teal-600" />
                      <span>ATS Optimized</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <Sparkles className="w-5 h-5 text-teal-600" />
                      <span>Expert Feedback</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <FileCheck className="w-5 h-5 text-teal-600" />
                      <span>100% Free</span>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <Link to="/upload-cv">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
                    >
                      <FileCheck className="w-6 h-6 mr-3" />
                      Get Free CV Analysis
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    No credit card required • 24-48 hour turnaround • Completely confidential
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <ServiceOverview />
          <WhyChooseUs />
          <Testimonial />
          <IndustriesGrid />
          <BlogPreview />
          <CtaSection />
        </main>
      </PageLayout>
      <Footer />
      <FloatingAnt />
    </div>
  );
};

export default Index;
