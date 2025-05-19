
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const industries = [
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: '🧠' },
  { id: 'semiconductors', name: 'Semiconductors', icon: '🔌' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
  { id: 'battery-tech', name: 'Battery Tech', icon: '🔋' },
  { id: 'web-tech', name: 'Web Tech', icon: '🌐' },
  { id: 'embedded-systems', name: 'Embedded Systems', icon: '💻' },
  { id: 'blockchain', name: 'Blockchain & Crypto', icon: '⛓️' },
  { id: 'wireless-iot', name: 'Wireless & IoT', icon: '📶' },
  { id: 'cloud-computing', name: 'Cloud Computing', icon: '☁️' },
  { id: 'gaming-ar-vr', name: 'Gaming AR/VR', icon: '🎮' },
  { id: 'engineering', name: 'Engineering', icon: '⚙️' },
  { id: 'life-science', name: 'Life Science', icon: '🧬' },
  { id: 'cyber-security', name: 'Cyber Security', icon: '🔒' },
  { id: 'data-science', name: 'Data Science', icon: '📊' },
  { id: 'fintech', name: 'Fintech', icon: '💰' },
  { id: 'industry-research', name: 'Industry Research', icon: '🔍' },
];

const IndustriesGrid = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized recruitment solutions across 16 technical sectors, tailored to meet the unique needs of each industry.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry) => (
            <Link to={`/industries/${industry.id}`} key={industry.id}>
              <Card className="h-full card-hover">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{industry.icon}</div>
                  <h3 className="text-lg font-semibold">{industry.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/industries">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Explore All Industries
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IndustriesGrid;
