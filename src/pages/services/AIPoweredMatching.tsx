import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, Target, Sparkles, TrendingUp, CheckCircle, ArrowRight, Cpu, Network } from 'lucide-react';

const AIPoweredMatching = () => {
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
              <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 text-sm font-medium text-purple-700 mb-6">
                <Brain className="w-4 h-4" />
                Advanced AI Technology
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                AI-Powered 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-600">
                  Matching
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with ideal candidates using our advanced machine learning algorithms. 
                Our AI analyzes skills, experience, and cultural fit to deliver perfect matches.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/hire-candidate">
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl group">
                    Find Matches
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

        {/* AI Capabilities */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Intelligent Matching Technology</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our proprietary AI engine analyzes multiple dimensions to find the perfect candidate-role fit.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Skills Analysis</h3>
                <p className="text-gray-600">Deep technical skills assessment using natural language processing and code analysis.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Network className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cultural Fit</h3>
                <p className="text-gray-600">Behavioral analysis to assess alignment with company culture and team dynamics.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Trajectory</h3>
                <p className="text-gray-600">Predictive modeling of career growth and long-term potential within your organization.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Success Prediction</h3>
                <p className="text-gray-600">ML algorithms predict candidate success probability based on historical performance data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How AI Matching Works */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">How Our AI Finds Perfect Matches</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced algorithms analyze hundreds of factors to deliver precisely matched candidates.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Ingestion</h3>
                <p className="text-gray-600 mb-6">Our AI processes job requirements, candidate profiles, and performance data from multiple sources.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Technical skills and certifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Work experience and achievements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Behavioral and cultural indicators
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Algorithm Processing</h3>
                <p className="text-gray-600 mb-6">Machine learning models analyze patterns and calculate compatibility scores across multiple dimensions.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Natural language processing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Predictive modeling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Multi-factor scoring
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Recommendations</h3>
                <p className="text-gray-600 mb-6">Ranked candidate recommendations with detailed fit analysis and success probability.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Compatibility scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Success probability metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Detailed fit explanations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Matching Dimensions */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Multi-Dimensional Analysis</h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our AI evaluates candidates across multiple dimensions to ensure comprehensive compatibility assessment.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Cpu className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Proficiency</h3>
                      <p className="text-gray-600">Deep analysis of programming languages, frameworks, tools, and technical achievements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Network className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Cultural Alignment</h3>
                      <p className="text-gray-600">Assessment of work style, communication patterns, and value alignment with company culture.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Potential</h3>
                      <p className="text-gray-600">Predictive analysis of learning ability, adaptability, and career progression potential.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Matching Accuracy</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Technical Skills</span>
                      <span className="text-purple-600 font-bold">95%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Cultural Fit</span>
                      <span className="text-purple-600 font-bold">88%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Role Suitability</span>
                      <span className="text-purple-600 font-bold">92%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Success Prediction</span>
                      <span className="text-purple-600 font-bold">91%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Proven Results</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Companies using our AI-powered matching see significant improvements in hiring quality and retention.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-600 font-medium">Match Accuracy</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
                <div className="text-gray-600 font-medium">Faster Placements</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-gray-600 font-medium">Retention Rate</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-purple-600 mb-2">70%</div>
                <div className="text-gray-600 font-medium">Reduced Hiring Costs</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Experience AI-Powered Precision
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Discover how our intelligent matching technology can transform your hiring success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hire-candidate">
                <Button className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  Find Your Match
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

export default AIPoweredMatching;