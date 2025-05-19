import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const Hero = () => {
  return <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight gradient-text mb-6">
              Empowering Tech Talent with AI-Driven Recruitment
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Discover your dream role or build high-performing teams with SkillTude's cutting-edge solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/upload-cv">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md text-lg w-full sm:w-auto">
                  Upload CV
                </Button>
              </Link>
              <Link to="/hire-candidate">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-md text-lg w-full sm:w-auto">
                  Hire a Candidate
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <img alt="AI-Driven Recruitment" className="rounded-lg shadow-xl w-full h-auto object-cover" src="/lovable-uploads/a53ed9a2-e07f-4140-8b5f-22f39626cc0a.png" />
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;