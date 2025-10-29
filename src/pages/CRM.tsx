import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  Zap, 
  Target, 
  BarChart3, 
  Settings,
  CheckCircle,
  ArrowRight,
  Star,
  Crown,
  Shield,
  Globe,
  Calendar,
  MessageSquare,
  Database,
  Workflow,
  TrendingUp,
  UserCheck,
  Clock,
  DollarSign
} from 'lucide-react';

const CRM = () => {
  const [selectedPlan, setSelectedPlan] = useState('freelancer');

  const freelancerFeatures = [
    { icon: Users, title: 'Candidate Pipeline Management', description: 'Track up to 500 candidates with smart tagging and filtering' },
    { icon: Calendar, title: 'Interview Scheduling', description: 'Automated calendar integration and reminder system' },
    { icon: MessageSquare, title: 'Communication Hub', description: 'Centralized messaging with email templates and follow-ups' },
    { icon: BarChart3, title: 'Performance Analytics', description: 'Track placement rates, time-to-hire, and revenue metrics' },
    { icon: Database, title: 'Client Management', description: 'Organize client relationships and project histories' },
    { icon: Target, title: 'Job Matching', description: 'AI-powered candidate-to-role matching suggestions' },
    { icon: Shield, title: 'Data Security', description: 'Bank-level encryption and GDPR compliance' },
    { icon: Globe, title: 'Mobile Access', description: 'Full-featured mobile app for on-the-go recruiting' }
  ];

  const enterpriseFeatures = [
    { icon: Users, title: 'Unlimited Candidate Management', description: 'Scale without limits with advanced search and filtering' },
    { icon: Workflow, title: 'Custom Workflows', description: 'Design automated recruitment processes for your team' },
    { icon: UserCheck, title: 'Team Collaboration', description: 'Multi-user access with role-based permissions' },
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Comprehensive dashboards with custom reporting' },
    { icon: Settings, title: 'API Integration', description: 'Connect with your existing HR tech stack' },
    { icon: Crown, title: 'White Glove Setup', description: 'Dedicated implementation and training support' },
    { icon: Shield, title: 'Enterprise Security', description: 'SSO, audit logs, and advanced compliance features' },
    { icon: Globe, title: 'Global Support', description: '24/7 priority support with dedicated account manager' }
  ];

  const pricingPlans = {
    freelancer: {
      name: 'Freelancer Pro',
      price: '$49',
      period: 'per month',
      description: 'Perfect for independent recruiters and small agencies',
      features: [
        'Up to 500 active candidates',
        '10 active job requisitions',
        'Basic analytics dashboard',
        'Email support',
        'Mobile app access',
        'Standard integrations'
      ],
      highlight: false
    },
    company: {
      name: 'Company Essential',
      price: '$149',
      period: 'per user/month',
      description: 'Ideal for growing recruitment teams',
      features: [
        'Unlimited candidates',
        'Unlimited job requisitions',
        'Team collaboration tools',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Workflow automation'
      ],
      highlight: true
    },
    enterprise: {
      name: 'White Glove Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'Fully customized solution with dedicated support',
      features: [
        'Everything in Company Essential',
        'Custom feature development',
        'Dedicated account manager',
        'White glove onboarding',
        'Custom integrations',
        'SLA guarantees',
        'Advanced security features'
      ],
      highlight: false
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-white via-blue-50/30 to-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 text-sm font-semibold text-blue-700 mb-8">
              <Zap className="w-4 h-4" />
              <span>AI-Powered CRM Solution</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="text-gray-900">Recruiter</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                CRM Platform
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light mb-16">
              The only CRM built specifically for recruiters. Manage candidates, clients, and placements with 
              <span className="font-semibold text-gray-800"> AI-powered automation</span>
            </p>

            {/* Feature Toggle */}
            <div className="flex justify-center mb-12">
              <div className="bg-gray-100 rounded-2xl p-2 inline-flex">
                <button
                  onClick={() => setSelectedPlan('freelancer')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedPlan === 'freelancer'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Freelancer Recruiters
                </button>
                <button
                  onClick={() => setSelectedPlan('company')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedPlan === 'company'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Company Teams
                </button>
              </div>
            </div>

            {/* Demo CTA */}
            <a href="mailto:hr@skilltude.com?subject=CRM Demo Request" className="inline-flex">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group">
                <Calendar className="w-6 h-6 mr-3" />
                Request Demo
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                {selectedPlan === 'freelancer' ? 'Freelancer' : 'Enterprise'} Features
              </h2>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {selectedPlan === 'freelancer' 
                  ? 'Everything you need to manage your independent recruiting business efficiently'
                  : 'Powerful tools designed for recruitment teams and enterprise organizations'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(selectedPlan === 'freelancer' ? freelancerFeatures : enterpriseFeatures).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-gray-50 to-white backdrop-blur-sm hover:scale-105">
                    <CardContent className="p-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 text-sm font-semibold text-blue-700 mb-8">
                <DollarSign className="w-4 h-4" />
                <span>Transparent Pricing</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Plan</span>
              </h2>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Start with a plan that fits your needs, upgrade as you grow
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {Object.entries(pricingPlans).map(([key, plan]) => (
                <Card key={key} className={`relative overflow-hidden ${plan.highlight ? 'border-2 border-blue-500 shadow-2xl scale-105' : 'border border-gray-200 hover:shadow-xl'} transition-all duration-300`}>
                  {plan.highlight && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardContent className={`p-8 ${plan.highlight ? 'pt-16' : ''}`}>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-6">{plan.description}</p>
                      <div className="mb-6">
                        <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600 ml-2">{plan.period}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <a href="mailto:hr@skilltude.com?subject=CRM Pricing Inquiry" className="block">
                      <Button className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        plan.highlight 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}>
                        {key === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* White Glove Section */}
        <section className="py-32 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-semibold mb-8">
                  <Crown className="w-4 h-4" />
                  <span>Premium Service</span>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  White Glove
                  <span className="block">Customization</span>
                </h2>
                
                <p className="text-2xl text-blue-100 mb-8 leading-relaxed">
                  Get a completely customized CRM solution tailored to your unique recruitment process, 
                  complete with dedicated support and training.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Custom feature development',
                    'Dedicated implementation team',
                    'Personalized training program',
                    'Priority technical support',
                    'Custom integrations',
                    'Ongoing optimization'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                      <span className="text-xl text-blue-100">{feature}</span>
                    </div>
                  ))}
                </div>

                <a href="mailto:hr@skilltude.com?subject=White Glove CRM Consultation" className="inline-flex">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl group">
                    <Crown className="w-6 h-6 mr-3" />
                    Schedule Consultation
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Users, title: 'Dedicated Team', desc: 'Personal implementation specialists' },
                  { icon: Settings, title: 'Custom Build', desc: 'Tailored to your exact needs' },
                  { icon: Clock, title: 'Fast Setup', desc: '30-day implementation guarantee' },
                  { icon: Star, title: 'Premium Support', desc: '24/7 priority assistance' }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 mb-4">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold mb-2">{item.title}</h4>
                        <p className="text-blue-100 text-sm">{item.desc}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ROI Section */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                Proven <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">ROI</span>
              </h2>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Recruiters using our CRM see immediate improvements in efficiency and revenue
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '65%', label: 'Faster Placements', icon: Clock },
                { value: '40%', label: 'More Revenue', icon: TrendingUp },
                { value: '80%', label: 'Time Saved', icon: Zap },
                { value: '95%', label: 'User Satisfaction', icon: Star }
              ].map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{metric.value}</div>
                    <div className="text-gray-600 font-medium">{metric.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Recruiting?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of recruiters who have revolutionized their business with our CRM platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:hr@skilltude.com?subject=CRM Demo Request" className="inline-flex">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl">
                  Start Free Trial
                </Button>
              </a>
              <a href="mailto:hr@skilltude.com?subject=CRM Information Request" className="inline-flex">
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-500 bg-white text-gray-700 hover:text-blue-600 px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CRM;