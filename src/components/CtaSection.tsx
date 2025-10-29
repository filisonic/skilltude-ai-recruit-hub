
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to transform your career or hiring process?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Whether you're looking for your next career move or seeking top tech talent, SkillTude has the AI-driven solutions to help you succeed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white px-8 py-3 rounded-md text-lg w-full sm:w-auto">
              Contact Us Today
            </Button>
          </Link>
          <Link to="/careers">
            <Button className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white px-8 py-3 rounded-md text-lg w-full sm:w-auto">
              View Open Positions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
