import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings, Zap, Clock, BarChart3, CheckCircle, ArrowRight, Bot, Workflow } from 'lucide-react';

const RecruitmentAutomation = () => {
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
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-6">
                <Settings className="w-4 h-4" />
                AI-Powered Automation
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Recruitment 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                  Automation
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your hiring process with AI-powered automation tools and workflows. 
                Reduce manual work by 80% while improving candidate quality and experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl group">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/careers">
                  <Button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200">
                    View Opportunities
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Automation That Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our intelligent automation platform handles repetitive tasks so your team can focus on strategic hiring decisions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">CV Screening</h3>
                <p className="text-gray-600">Automatically screen and rank CVs based on job requirements and company preferences.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Workflow className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Interview Scheduling</h3>
                <p className="text-gray-600">Smart scheduling that coordinates with all stakeholders automatically.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Follow-up Automation</h3>
                <p className="text-gray-600">Automated candidate communication and status updates throughout the process.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h3>
                <p className="text-gray-600">Real-time insights and metrics to optimize your recruitment process.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Automation Benefits */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Transform Your Hiring Process</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our automation platform reduces manual effort while improving hiring outcomes across every stage of recruitment.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">80% Faster Screening</h3>
                      <p className="text-gray-600">Instantly screen hundreds of applications with AI-powered analysis and ranking.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">50% Reduced Time-to-Hire</h3>
                      <p className="text-gray-600">Streamlined workflows eliminate bottlenecks and accelerate hiring decisions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
                      <p className="text-gray-600">Track performance metrics and optimize your recruitment strategy continuously.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Automation Features</h3>
                <div className="space-y-4">
                  {[
                    'Intelligent CV parsing and analysis',
                    'Automated candidate ranking and scoring',
                    'Smart interview scheduling coordination',
                    'Personalized candidate communication',
                    'Workflow automation and triggers',
                    'Integration with existing HR systems',
                    'Real-time reporting and analytics',
                    'Compliance and audit tracking'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">How Automation Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our intelligent platform automates every step of your recruitment process seamlessly.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Setup & Configuration</h3>
                <p className="text-gray-600">Configure automation rules, criteria, and workflows to match your hiring process and requirements.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Processing</h3>
                <p className="text-gray-600">Our AI analyzes applications, screens candidates, and handles routine tasks automatically in real-time.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Human Review</h3>
                <p className="text-gray-600">Focus on strategic decisions while automation handles the heavy lifting and presents qualified candidates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Measurable Results</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Companies using our automation platform see immediate improvements in efficiency and quality.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">80%</div>
                <div className="text-gray-600 font-medium">Reduction in Manual Work</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">50%</div>
                <div className="text-gray-600 font-medium">Faster Time-to-Hire</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
                <div className="text-gray-600 font-medium">Candidate Satisfaction</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">3x</div>
                <div className="text-gray-600 font-medium">ROI Within 6 Months</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Automate Your Hiring?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Transform your recruitment process with intelligent automation that saves time and improves results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/careers">
                <Button className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200">
                  View Opportunities
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

export default RecruitmentAutomation;