
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const industries = [
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: '🧠', description: 'Specialized recruitment for artificial intelligence and machine learning roles across research, development, and implementation.' },
  { id: 'semiconductors', name: 'Semiconductors', icon: '🔌', description: 'Connecting top talent with semiconductor manufacturers, design houses, and equipment suppliers.' },
  { id: 'automotive', name: 'Automotive', icon: '🚗', description: 'Recruitment solutions for autonomous vehicles, electric cars, and smart mobility technologies.' },
  { id: 'battery-tech', name: 'Battery Tech', icon: '🔋', description: 'Finding specialized talent for energy storage development, production, and research.' },
  { id: 'web-tech', name: 'Web Tech', icon: '🌐', description: 'Connecting companies with front-end, back-end, and full-stack developers across all modern frameworks.' },
  { id: 'embedded-systems', name: 'Embedded Systems', icon: '💻', description: 'Recruiting embedded software and hardware engineers for IoT, consumer electronics, and industrial applications.' },
  { id: 'blockchain', name: 'Blockchain & Crypto', icon: '⛓️', description: 'Talent acquisition for blockchain platforms, cryptocurrency exchanges, and decentralized applications.' },
  { id: 'wireless-iot', name: 'Wireless & IoT', icon: '📶', description: 'Recruiting for roles in wireless communication, IoT infrastructure, and connected devices.' },
  { id: 'cloud-computing', name: 'Cloud Computing', icon: '☁️', description: 'Finding skilled professionals in cloud architecture, DevOps, and platform engineering.' },
  { id: 'gaming-ar-vr', name: 'Gaming AR/VR', icon: '🎮', description: 'Specialized recruitment for game development, augmented reality, and virtual reality technologies.' },
  { id: 'engineering', name: 'Engineering', icon: '⚙️', description: 'Connecting companies with mechanical, electrical, and systems engineers across multiple industries.' },
  { id: 'life-science', name: 'Life Science', icon: '🧬', description: 'Talent solutions for biotech, medical technology, and pharmaceutical technology roles.' },
  { id: 'cyber-security', name: 'Cyber Security', icon: '🔒', description: 'Recruiting information security specialists, ethical hackers, and security architects.' },
  { id: 'data-science', name: 'Data Science', icon: '📊', description: 'Finding data scientists, analysts, and engineers to help companies leverage their data assets.' },
  { id: 'fintech', name: 'Fintech', icon: '💰', description: 'Specialized recruitment for financial technology roles in banking, payments, and insurance tech.' },
  { id: 'industry-research', name: 'Industry Research', icon: '🔍', description: 'Connecting researchers and R&D specialists with companies pushing the boundaries of technology.' },
];

const Industries = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Industries We Serve</h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Specialized recruitment expertise across 16 technical sectors, tailored to each industry's unique challenges and opportunities.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry) => (
                <Link to={`/industries/${industry.id}`} key={industry.id}>
                  <Card className="h-full card-hover">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-4">{industry.icon}</div>
                      <h3 className="text-xl font-semibold mb-3">{industry.name}</h3>
                      <p className="text-gray-600">{industry.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Industry Expertise That Makes a Difference</h2>
                <p className="text-lg text-gray-700 mb-6">
                  At SkillTude, we understand that each technical field has its own language, challenges, and talent requirements. Our specialized recruiters have backgrounds in the industries they serve, ensuring they can effectively evaluate candidates and understand your needs.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  We stay ahead of industry trends, maintaining a pulse on emerging technologies and evolving skill requirements to help you build teams that drive innovation and growth.
                </p>
                <p className="text-lg text-gray-700">
                  Whether you're hiring for established roles or emerging positions in cutting-edge fields, our industry-specific recruitment strategies ensure you connect with the right talent.
                </p>
              </div>
              
              <div className="order-first lg:order-last mb-8 lg:mb-0">
                <img 
                  src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3" 
                  alt="Industry Expertise" 
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Industries;
