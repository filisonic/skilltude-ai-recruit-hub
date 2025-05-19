
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IndustryData } from '@/types/industry';

interface IndustryHeroProps {
  industry: IndustryData;
}

const IndustryHero = ({ industry }: IndustryHeroProps) => {
  const LucideIcon = industry.lucideIcon;
  
  return (
    <section className={`${industry.color} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4">{industry.icon}</span>
              <h1 className={`text-4xl md:text-5xl font-bold ${industry.textColor}`}>
                {industry.name}
              </h1>
            </div>
            <p className="text-xl text-gray-700 mb-8">
              {industry.description}
            </p>
            <Link to="/contact">
              <Button className={`${industry.buttonColor} text-white px-6 py-3 rounded-md text-lg`}>
                Talk to a Specialist
              </Button>
            </Link>
          </div>
          <div className="order-first lg:order-last mb-8 lg:mb-0">
            <img 
              src={industry.image} 
              alt={industry.name} 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryHero;
