import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Target, Award, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

const TalentAcquisition = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-4 py-2 text-sm font-medium text-lime-700 mb-6">
                <Users className="w-4 h-4" />
                Talent Acquisition Specialists
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Talent 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-lime-600">
                  Acquisition
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Find the perfect tech talent for your organization with our specialized recruitment services. 
                We connect brilliant minds with forward-thinking companies across 16 specialized tech sectors.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/hire-candidate">
                  <Button className="bg-lime-500 hover:bg-lime-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl group">
                    Start Hiring
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200">
                    Get Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Our Talent Acquisition?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We go beyond traditional recruitment to deliver strategic talent solutions that drive business growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-lime-100 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Strategic Hiring</h3>
                <p className="text-gray-600">Align talent acquisition with your business objectives and long-term growth strategy.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-lime-100 rounded-2xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Candidates</h3>
                <p className="text-gray-600">Access to pre-vetted, high-quality candidates from our extensive talent network.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-lime-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Faster Hiring</h3>
                <p className="text-gray-600">Reduce time-to-hire by 50% with our streamlined recruitment processes.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-lime-100 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Support</h3>
                <p className="text-gray-600">Dedicated recruitment specialists with deep tech industry expertise.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Talent Acquisition Process</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A proven methodology that ensures we find the right talent for your specific needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-lime-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements Analysis</h3>
                <p className="text-gray-600 mb-6">We deep-dive into your specific role requirements, company culture, and strategic objectives.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-500" />
                    Detailed job specification review
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-500" />
                    Company culture assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-500" />
                    Market analysis and benchmarking
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-lime-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Candidate Sourcing</h3>
                <p className="text-gray-600 mb-6">Multi-channel sourcing strategy to identify and engage top-tier candidates.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-500" />
                    Active and passive candidate outreach
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-500" />
                    Industry network leveraging
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-500" />
                    AI-powered candidate matching
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-lime-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Selection & Onboarding</h3>
                <p className="text-gray-600 mb-6">Rigorous screening and seamless onboarding to ensure successful placements.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-500" />
                    Technical and cultural fit assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-500" />
                    Reference and background checks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime-500" />
                    Onboarding support and follow-up
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Industries We Serve */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Specialized Talent Across Tech Sectors</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We recruit top talent across 16 specialized technology sectors.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                'AI & Machine Learning',
                'Cloud Computing',
                'Cybersecurity',
                'Data Science',
                'Fintech',
                'Automotive Tech',
                'Semiconductors',
                'Blockchain'
              ].map((sector) => (
                <div key={sector} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-sm font-medium text-gray-700">{sector}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/industries">
                <Button variant="outline" className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-full font-medium transition-all duration-200">
                  View All Industries
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-lime-500 to-lime-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Find Your Next Star Performer?
            </h2>
            <p className="text-xl text-lime-100 mb-8">
              Let our talent acquisition experts help you build a world-class team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hire-candidate">
                <Button className="bg-white text-lime-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  Start Your Search
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200">
                  Schedule Consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default TalentAcquisition;