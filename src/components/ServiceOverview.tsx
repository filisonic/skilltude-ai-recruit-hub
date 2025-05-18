
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  {
    id: 'talent-acquisition',
    title: 'Talent Acquisition',
    description: 'Find the perfect tech talent for your organization with our specialized recruitment services.',
    icon: '👥',
  },
  {
    id: 'recruitment-automation',
    title: 'Recruitment Automation',
    description: 'Streamline your hiring process with AI-powered automation tools and workflows.',
    icon: '⚙️',
  },
  {
    id: 'ai-matching',
    title: 'AI-Powered Matching',
    description: 'Connect with ideal candidates using our advanced machine learning algorithms.',
    icon: '🔄',
  },
  {
    id: 'candidate-experience',
    title: 'Candidate Experience',
    description: 'Provide an exceptional journey for candidates from application to onboarding.',
    icon: '⭐',
  },
];

const ServiceOverview = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive recruitment solutions tailored for both job seekers and employers in the tech industry.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="card-hover">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link to={`/services/${service.id}`}>
                  <Button variant="link" className="text-primary p-0">Learn more &rarr;</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceOverview;
