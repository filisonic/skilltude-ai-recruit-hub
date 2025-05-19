
import React from 'react';
import { IndustryData } from '@/types/industry';

interface IndustryOverviewProps {
  industry: IndustryData;
}

const IndustryOverview = ({ industry }: IndustryOverviewProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Industry Overview</h2>
          <p className="text-lg text-gray-700 mb-10 leading-relaxed">
            {industry.longDescription}
          </p>
          
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">Key Challenges</h3>
            <ul className="space-y-2">
              {industry.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start">
                  <span className={`${industry.accentColor} rounded-full p-1 text-white mr-3 flex-shrink-0 mt-1`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">Industry Statistics</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-4">
                {industry.stats.map((stat, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-2xl mr-4">📊</span>
                    <span className="text-lg">{stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryOverview;
