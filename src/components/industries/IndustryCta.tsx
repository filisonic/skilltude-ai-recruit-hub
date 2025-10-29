
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IndustryData } from '@/types/industry';

interface IndustryCtaProps {
  industry: IndustryData;
}

const IndustryCta = ({ industry }: IndustryCtaProps) => {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Top {industry.name} Talent?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Connect with our specialized {industry.name} recruitment team to discuss your hiring needs or explore opportunities in this exciting field.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-6 py-3 rounded-md text-lg w-full sm:w-auto">
              Contact a Specialist
            </Button>
          </Link>
          <Link to="/hire-candidate">
            <Button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-6 py-3 rounded-md text-lg w-full sm:w-auto">
              Submit Hiring Request
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IndustryCta;
