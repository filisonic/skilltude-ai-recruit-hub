
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SuperAntCharacter from '@/components/SuperAntCharacter';

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Side Hello Ant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200 rounded-full px-6 py-3 text-sm font-semibold text-teal-700 mb-8">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Why Choose 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500">
                SkillTude
              </span>
            </h2>
            <p className="text-2xl text-gray-600 leading-relaxed">
              Leading the way in tech recruitment with specialized expertise and cutting-edge AI solutions that deliver exceptional results.
            </p>
          </div>

          {/* Right side - Hello Ant Character - Much Bigger */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px]">
              <SuperAntCharacter pose="greeting" animate={false} className="" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-t-4 border-t-teal-500 card-hover group">
            <CardContent className="p-8">
              <div className="h-16 w-16 bg-gradient-to-br from-teal-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-teal-700 transition-colors">Expertise in 16 Tech Sectors</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Specialized knowledge across diverse technology fields including AI & Machine Learning, Semiconductors, Cloud Computing, and more.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-orange-500 card-hover group">
            <CardContent className="p-8">
              <div className="h-16 w-16 bg-gradient-to-br from-orange-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-orange-700 transition-colors">AI-Powered Efficiency</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our AI tools reduce hiring time by up to 50%, streamlining the recruitment process while improving match quality.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-cyan-500 card-hover group">
            <CardContent className="p-8">
              <div className="h-16 w-16 bg-gradient-to-br from-cyan-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-cyan-700 transition-colors">Trusted by Tech Leaders</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Serving Fortune 500 companies and fast-growing startups alike with our proven recruitment methodologies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
