import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Heart, MessageCircle, Users, CheckCircle, ArrowRight, Shield, Clock } from 'lucide-react';

const CandidateExperience = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-4 py-2 text-sm font-medium text-pink-700 mb-6">
                <Heart className="w-4 h-4" />
                Candidate-Centric Approach
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Candidate 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600">
                  Experience
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Provide an exceptional journey for candidates from application to onboarding. 
                Transform your hiring process into a positive brand experience that attracts top talent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upload-cv">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl group">
                    Experience It Yourself
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Pillars */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Exceptional at Every Step</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We've reimagined every touchpoint of the recruitment journey to create meaningful connections and positive experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Clear Communication</h3>
                <p className="text-gray-600">Transparent, timely updates throughout the entire recruitment process.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Respectful Process</h3>
                <p className="text-gray-600">Streamlined interviews that value candidates' time and expertise.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Support</h3>
                <p className="text-gray-600">Dedicated consultants providing guidance and career advice.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <Star className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Growth</h3>
                <p className="text-gray-600">Focus on long-term career development and opportunity matching.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Candidate Journey */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Journey With Us</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From first contact to successful placement, we ensure every interaction adds value to your career journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-pink-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Initial Connection</h3>
                <p className="text-gray-600 mb-6">Seamless application process with instant acknowledgment and clear next steps.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Simple CV upload process
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Immediate confirmation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Personalized welcome message
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-pink-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Consultation & Matching</h3>
                <p className="text-gray-600 mb-6">In-depth career consultation to understand your goals and find perfect matches.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Career goals assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Skill evaluation and feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Curated opportunity matching
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-pink-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview & Placement</h3>
                <p className="text-gray-600 mb-6">Comprehensive interview preparation and ongoing support through to successful placement.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Interview coaching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Negotiation support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-500" />
                    Onboarding assistance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">What Makes Our Experience Different</h2>
                <p className="text-xl text-gray-600 mb-8">
                  We believe that every candidate deserves respect, transparency, and genuine support throughout their career journey.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Always in the Loop</h3>
                      <p className="text-gray-600">Regular updates, honest feedback, and transparent communication at every step.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Approach</h3>
                      <p className="text-gray-600">Dedicated consultants who understand your unique skills and career aspirations.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Star className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Long-term Partnership</h3>
                      <p className="text-gray-600">Ongoing career support and guidance beyond just placement into your next role.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Candidate Testimonials</h3>
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-pink-500 text-pink-500" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-3">"The most professional and supportive recruitment experience I've ever had. They truly care about your career goals."</p>
                    <p className="text-sm text-gray-600 font-medium">Sarah Chen, Senior Developer</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-pink-500 text-pink-500" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-3">"Transparent communication and genuine support throughout the entire process. They found me the perfect role!"</p>
                    <p className="text-sm text-gray-600 font-medium">Marcus Johnson, Data Scientist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits for Candidates */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Candidates Choose Us</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of tech professionals who have transformed their careers with our support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Protection</h3>
                <p className="text-gray-600">Confidential job search with complete discretion and professional handling.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <Star className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium Opportunities</h3>
                <p className="text-gray-600">Access to exclusive roles and opportunities not available elsewhere.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Guidance</h3>
                <p className="text-gray-600">Industry specialists providing insider knowledge and career advice.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Candidate Success Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our focus on candidate experience delivers measurable results and career transformations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center bg-gray-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-pink-600 mb-2">96%</div>
                <div className="text-gray-600 font-medium">Candidate Satisfaction</div>
              </div>
              <div className="text-center bg-gray-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-pink-600 mb-2">85%</div>
                <div className="text-gray-600 font-medium">Salary Increases</div>
              </div>
              <div className="text-center bg-gray-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-pink-600 mb-2">92%</div>
                <div className="text-gray-600 font-medium">Long-term Placements</div>
              </div>
              <div className="text-center bg-gray-50 rounded-2xl p-6">
                <div className="text-3xl font-bold text-pink-600 mb-2">4.9</div>
                <div className="text-gray-600 font-medium">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-pink-500 to-pink-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready for Your Best Career Move?
            </h2>
            <p className="text-xl text-pink-100 mb-8">
              Experience recruitment that puts your success and satisfaction first.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload-cv">
                <Button className="bg-white text-pink-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  Upload Your CV
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200">
                  Speak to a Consultant
                </Button>
              </Link>
            </div>
          </div>
        </section>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default CandidateExperience;