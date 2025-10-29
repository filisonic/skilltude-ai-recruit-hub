import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Grid3X3 } from 'lucide-react';

const industries = [
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: '/images/ai.png', count: '120+' },
  { id: 'semiconductors', name: 'Semiconductors', icon: '/images/semi.png', count: '85+' },
  { id: 'automotive', name: 'Automotive', icon: '/images/automotive.png', count: '95+' },
  { id: 'battery-tech', name: 'Battery Tech', icon: '/images/battery-pack.png', count: '45+' },
  { id: 'web-tech', name: 'Web Tech', icon: '/images/technology.png', count: '150+' },
  { id: 'embedded-systems', name: 'Embedded Systems', icon: '/images/system.png', count: '70+' },
  { id: 'blockchain', name: 'Blockchain & Crypto', icon: '/images/crypto-currency.png', count: '65+' },
  { id: 'wireless-iot', name: 'Wireless & IoT', icon: '/images/wireless-charging.png', count: '80+' },
  { id: 'cloud-computing', name: 'Cloud Computing', icon: '/images/cloud-computing.png', count: '110+' },
  { id: 'gaming-ar-vr', name: 'Gaming AR/VR', icon: '/images/brain.png', count: '55+' },
  { id: 'engineering', name: 'Engineering', icon: '/images/system.png', count: '75+' },
  { id: 'life-science', name: 'Life Science', icon: '/images/virus.png', count: '60+' },
  { id: 'cyber-security', name: 'Cyber Security', icon: '/images/cyber-security.png', count: '90+' },
  { id: 'data-science', name: 'Data Science', icon: '/images/data-science.png', count: '100+' },
  { id: 'fintech', name: 'Fintech', icon: '/images/fintech.png', count: '85+' },
  { id: 'industry-research', name: 'Industry Research', icon: '/images/research-and-development.png', count: '40+' },
];

const IndustriesGrid = () => {
  return (
    <section className="py-32 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200 rounded-full px-6 py-3 text-sm font-semibold text-teal-700 mb-8">
            <Grid3X3 className="w-4 h-4" />
            <span>16 Specialized Tech Sectors</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Industries We
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500">
              Transform
            </span>
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Deep expertise across cutting-edge technology sectors with specialized recruitment strategies 
            and industry-specific insights that drive exceptional results
          </p>
        </div>
        
        {/* Enhanced Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {industries.map((industry, index) => (
            <Link 
              to={`/industries/${industry.id}`} 
              key={industry.id} 
              state={{ scrollToTop: true }}
              className="group"
            >
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 h-full transition-all duration-500 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100/20 hover:-translate-y-2 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-100/30 rounded-full blur-2xl group-hover:bg-teal-200/40 transition-all duration-500"></div>
                
                <div className="relative text-center">
                  {/* Icon container */}
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:from-teal-50 group-hover:to-orange-50 transition-all duration-300 group-hover:scale-110 shadow-sm">
                    <img 
                      src={industry.icon} 
                      alt={industry.name}
                      className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors duration-300">
                    {industry.name}
                  </h3>
                  
                  {/* Placement count */}
                  <div className="inline-flex items-center gap-1 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-teal-100 group-hover:to-orange-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-600 group-hover:text-teal-700 transition-all duration-300">
                    <span>{industry.count}</span>
                    <span>placements</span>
                  </div>
                  
                  {/* Hover arrow */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <ArrowRight className="w-5 h-5 mx-auto text-teal-600" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Enhanced CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-6">
            <Link to="/industries">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white rounded-2xl px-10 py-5 font-semibold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl group">
                <span>Explore All Industries</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <p className="text-gray-500 text-sm">
              Discover opportunities across 500+ successful placements
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesGrid;