
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About SkillTude</h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Transforming tech recruitment with AI-driven solutions and industry expertise.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-gray-700 mb-6">
                  SkillTude was born out of a simple observation: traditional recruitment methods weren't keeping pace with the rapidly evolving tech industry.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Our team of experienced HR professionals and AI researchers recognized the need for a specialized recruitment approach that could understand the nuanced requirements of technical roles while leveraging AI to streamline the matching process.
                </p>
                <p className="text-lg text-gray-700">
                  Today, SkillTude has grown into a leading HR consultancy serving clients across the globe, from innovative startups to established enterprises, all while maintaining our core commitment to connecting brilliant minds with forward-thinking companies.
                </p>
              </div>
              
              <div className="order-first lg:order-last mb-8 lg:mb-0">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3" 
                  alt="SkillTude team" 
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-gray-700">
                  To revolutionize tech recruitment by combining human expertise with cutting-edge AI, creating perfect matches between talented individuals and forward-thinking organizations.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                <p className="text-gray-700">
                  A world where every tech professional finds fulfilling work that leverages their unique skills, and every company builds diverse teams that drive innovation and progress.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the experts driving SkillTude's innovation and success.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3" 
                    alt="Chief Executive Officer" 
                    className="w-40 h-40 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Chief Executive Officer</h3>
                <p className="text-primary mb-2">Founder & CEO</p>
                <p className="text-gray-600">
                  AI researcher and tech executive with extensive industry experience.
                </p>
              </div>
              
              {/* Team Member 2 */}
              <div className="text-center">
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3" 
                    alt="Chief Technology Officer" 
                    className="w-40 h-40 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Chief Technology Officer</h3>
                <p className="text-primary mb-2">CTO</p>
                <p className="text-gray-600">
                  Machine learning expert specializing in recruitment algorithms and AI systems.
                </p>
              </div>
              
              {/* Team Member 3 */}
              <div className="text-center">
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3" 
                    alt="Head of Client Success" 
                    className="w-40 h-40 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Head of Client Success</h3>
                <p className="text-primary mb-2">Client Success</p>
                <p className="text-gray-600">
                  HR professional with extensive experience in talent acquisition and client relations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
