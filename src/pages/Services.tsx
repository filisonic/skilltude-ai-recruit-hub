
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const services = [
  {
    id: 'talent-acquisition',
    title: 'Talent Acquisition',
    description: 'Our specialized talent acquisition service connects companies with top tech professionals across all experience levels. We leverage our deep industry knowledge and AI-powered matching to find candidates with the perfect blend of technical skills and cultural fit.',
    benefits: [
      'Access to a curated network of pre-vetted tech professionals',
      'Specialized recruiters with technical backgrounds in your industry',
      'Customized hiring strategies tailored to your organizational needs',
      'Comprehensive candidate assessments and skill verification'
    ],
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3'
  },
  {
    id: 'recruitment-automation',
    title: 'Recruitment Automation',
    description: 'Transform your hiring pipeline with our cutting-edge recruitment automation tools. Our platform streamlines repetitive tasks, accelerates screening processes, and provides valuable analytics to optimize your recruitment strategy.',
    benefits: [
      'Reduce administrative workload by up to 70%',
      'Decrease time-to-hire by implementing intelligent workflows',
      'Enhance consistency in your candidate evaluation process',
      'Scale your recruitment efforts efficiently during growth periods'
    ],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3'
  },
  {
    id: 'ai-matching',
    title: 'AI-Powered Matching',
    description: 'Our proprietary AI matching algorithms go beyond keyword matching to understand the nuanced requirements of technical roles and the complex skill sets of candidates, resulting in more successful placements and reduced turnover.',
    benefits: [
      'Advanced skill taxonomy that understands technical competencies',
      'Machine learning algorithms that improve with each placement',
      'Consideration of soft skills and cultural alignment',
      'Reduced bias in the candidate selection process'
    ],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3'
  },
  {
    id: 'candidate-experience',
    title: 'Candidate Experience Enhancement',
    description: 'Create an exceptional journey for candidates from application to onboarding. Our candidate experience services ensure that every interaction reflects your employer brand and keeps top talent engaged throughout the recruitment process.',
    benefits: [
      'Customized communication workflows for timely updates',
      'Interactive assessments that showcase your company culture',
      'Feedback mechanisms that improve your recruitment process',
      'Seamless transition from candidate to employee'
    ],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3'
  }
];

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Comprehensive recruitment solutions powered by AI technology and industry expertise.
              </p>
            </div>
          </div>
        </section>
        
        {services.map((service, index) => (
          <section key={service.id} className={`py-16 ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'lg:grid-flow-dense' : ''}`}>
                <div className={index % 2 !== 0 ? 'lg:col-start-2' : ''}>
                  <h2 className="text-3xl font-bold mb-6">{service.title}</h2>
                  <p className="text-lg text-gray-700 mb-6">
                    {service.description}
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-4">Key Benefits:</h3>
                  <ul className="space-y-3 mb-8">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="ml-3 text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={`/services/${service.id}`}>
                    <Button className="bg-primary hover:bg-primary/90">Learn More</Button>
                  </Link>
                </div>
                
                <div className={index % 2 !== 0 ? 'lg:col-start-1' : ''}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="rounded-lg shadow-xl w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}
        
        <section className="bg-primary py-16 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your recruitment process?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Contact us today to discuss how our services can be tailored to your specific needs.
            </p>
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-blue-800 via-blue-900 to-orange-600 hover:from-blue-900 hover:via-slate-900 hover:to-orange-700 text-white px-8 py-3">
                Get in Touch
              </Button>
            </Link>
          </div>
        </section>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default Services;
