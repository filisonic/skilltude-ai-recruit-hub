
import React from 'react';
import { IndustryData } from '@/types/industry';

interface IndustryRolesProps {
  industry: IndustryData;
}

const IndustryRoles = ({ industry }: IndustryRolesProps) => {
  const LucideIcon = industry.lucideIcon;
  
  return (
    <section className={`${industry.color} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-10 text-center">Key Roles We Recruit For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industry.keyRoles.map((role, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${industry.accentColor}`}>
              {index === 0 && <LucideIcon className={`h-6 w-6 ${industry.textColor} mb-3`} />}
              {index !== 0 && <div className="h-6 mb-3"></div>}
              <h3 className="font-medium">{role}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryRoles;
