
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const WhyChooseUs = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SkillTude</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leading the way in tech recruitment with specialized expertise and cutting-edge AI solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-t-4 border-t-primary card-hover">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Expertise in 16 Tech Sectors</h3>
              <p className="text-gray-600">
                Specialized knowledge across diverse technology fields including AI & Machine Learning, Semiconductors, Cloud Computing, and more.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-primary card-hover">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Efficiency</h3>
              <p className="text-gray-600">
                Our AI tools reduce hiring time by up to 50%, streamlining the recruitment process while improving match quality.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-primary card-hover">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Trusted by Tech Leaders</h3>
              <p className="text-gray-600">
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
