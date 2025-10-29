import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import CVUploadInline from '@/components/CVUploadInline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Filter, 
  Search, 
  Calendar,
  ChevronRight,
  Building2,
  Globe,
  TrendingUp
} from 'lucide-react';

// Job data with trending positions from July 2024 to now
// TODO: In production, fetch from database using job_listings table
// API endpoint: GET /api/jobs?status=published&trending=true
const jobListings = [
  {
    id: 1,
    title: 'Senior AI/ML Engineer',
    company: 'TechFlow AI',
    location: 'Bangalore, India',
    type: 'Full-time',
    salary: '₹15L - ₹25L',
    posted: '2024-12-20',
    category: 'AI & Machine Learning',
    experience: 'Senior',
    remote: true,
    trending: true,
    description: 'Lead the development of cutting-edge AI models for enterprise applications. Work with large language models, computer vision, and deep learning frameworks.'
  },
  {
    id: 2,
    title: 'Full Stack Developer (React/Node)',
    company: 'FinanceCore',
    location: 'Mumbai, India',
    type: 'Full-time',
    salary: '₹12L - ₹18L',
    posted: '2024-12-18',
    category: 'Web Development',
    experience: 'Mid-level',
    remote: false,
    trending: true,
    description: 'Build scalable fintech applications using React, Node.js, and cloud technologies. Experience with financial systems preferred.'
  },
  {
    id: 3,
    title: 'DevOps Engineer - Kubernetes',
    company: 'CloudScale Solutions',
    location: 'Hyderabad, India',
    type: 'Full-time',
    salary: '₹14L - ₹22L',
    posted: '2024-12-15',
    category: 'DevOps & Infrastructure',
    experience: 'Senior',
    remote: true,
    trending: false,
    description: 'Design and implement containerized infrastructure using Kubernetes, Docker, and cloud-native technologies.'
  },
  {
    id: 4,
    title: 'Product Manager - AI Products',
    company: 'InnovateAI',
    location: 'Pune, India',
    type: 'Full-time',
    salary: '₹16L - ₹28L',
    posted: '2024-12-12',
    category: 'Product Management',
    experience: 'Senior',
    remote: true,
    trending: true,
    description: 'Drive product strategy for AI-powered SaaS solutions. Work with engineering teams to deliver innovative AI features.'
  },
  {
    id: 5,
    title: 'Cybersecurity Analyst',
    company: 'SecureNet Systems',
    location: 'Delhi, India',
    type: 'Full-time',
    salary: '₹8L - ₹15L',
    posted: '2024-12-08',
    category: 'Cybersecurity',
    experience: 'Mid-level',
    remote: false,
    trending: false,
    description: 'Monitor and analyze security threats, implement security protocols, and ensure compliance with industry standards.'
  },
  {
    id: 6,
    title: 'Senior iOS Developer',
    company: 'MobileFirst Inc',
    location: 'Chennai, India',
    type: 'Full-time',
    salary: '₹14L - ₹20L',
    posted: '2024-12-05',
    category: 'Mobile Development',
    experience: 'Senior',
    remote: true,
    trending: false,
    description: 'Develop high-performance iOS applications using Swift and SwiftUI. Experience with ARKit and Core ML preferred.'
  },
  {
    id: 7,
    title: 'Data Scientist - Healthcare',
    company: 'MedTech Analytics',
    location: 'Kolkata, India',
    type: 'Full-time',
    salary: '₹10L - ₹16L',
    posted: '2024-11-28',
    category: 'Data Science',
    experience: 'Mid-level',
    remote: true,
    trending: true,
    description: 'Apply machine learning to healthcare data to improve patient outcomes. Work with medical imaging and clinical data.'
  },
  {
    id: 8,
    title: 'Frontend Engineer - React/TypeScript',
    company: 'WebCraft Studios',
    location: 'Ahmedabad, India',
    type: 'Full-time',
    salary: '₹9L - ₹14L',
    posted: '2024-11-25',
    category: 'Frontend Development',
    experience: 'Mid-level',
    remote: true,
    trending: false,
    description: 'Build responsive web applications using React, TypeScript, and modern frontend technologies.'
  },
  {
    id: 9,
    title: 'Cloud Architect - AWS',
    company: 'CloudMasters',
    location: 'Gurgaon, India',
    type: 'Full-time',
    salary: '₹18L - ₹30L',
    posted: '2024-11-20',
    category: 'Cloud Computing',
    experience: 'Senior',
    remote: true,
    trending: true,
    description: 'Design and implement enterprise-scale cloud solutions on AWS. Lead cloud migration and optimization projects.'
  },
  {
    id: 10,
    title: 'Blockchain Developer',
    company: 'CryptoTech Labs',
    location: 'Noida, India',
    type: 'Full-time',
    salary: '₹16L - ₹24L',
    posted: '2024-11-15',
    category: 'Blockchain',
    experience: 'Senior',
    remote: true,
    trending: true,
    description: 'Develop DeFi applications and smart contracts using Solidity, Web3, and blockchain technologies.'
  },
  {
    id: 11,
    title: 'QA Automation Engineer',
    company: 'TestPro Solutions',
    location: 'Kochi, India',
    type: 'Full-time',
    salary: '₹7L - ₹12L',
    posted: '2024-11-10',
    category: 'Quality Assurance',
    experience: 'Mid-level',
    remote: false,
    trending: false,
    description: 'Design and implement automated testing frameworks using Selenium, Cypress, and CI/CD pipelines.'
  },
  {
    id: 12,
    title: 'UX/UI Designer - B2B SaaS',
    company: 'DesignFlow',
    location: 'Indore, India',
    type: 'Full-time',
    salary: '₹8L - ₹14L',
    posted: '2024-10-30',
    category: 'Design',
    experience: 'Mid-level',
    remote: true,
    trending: false,
    description: 'Create intuitive user experiences for enterprise software. Work closely with product and engineering teams.'
  },
  {
    id: 13,
    title: 'Backend Engineer - Python/Django',
    company: 'DataStream Corp',
    location: 'Jaipur, India',
    type: 'Full-time',
    salary: '₹10L - ₹16L',
    posted: '2024-10-25',
    category: 'Backend Development',
    experience: 'Mid-level',
    remote: true,
    trending: false,
    description: 'Build scalable backend systems using Python, Django, and PostgreSQL. Experience with microservices architecture.'
  },
  {
    id: 14,
    title: 'Game Developer - Unity',
    company: 'GameStudio Interactive',
    location: 'Chandigarh, India',
    type: 'Full-time',
    salary: '₹8L - ₹12L',
    posted: '2024-10-20',
    category: 'Game Development',
    experience: 'Mid-level',
    remote: false,
    trending: false,
    description: 'Develop immersive gaming experiences using Unity and C#. Work on mobile and console game projects.'
  },
  {
    id: 15,
    title: 'Site Reliability Engineer',
    company: 'ScaleOps',
    location: 'Bhubaneswar, India',
    type: 'Full-time',
    salary: '₹12L - ₹18L',
    posted: '2024-10-15',
    category: 'DevOps & Infrastructure',
    experience: 'Senior',
    remote: true,
    trending: true,
    description: 'Ensure high availability and performance of large-scale distributed systems. Work with monitoring and observability tools.'
  },
  {
    id: 16,
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'Thiruvananthapuram, India',
    type: 'Full-time',
    salary: '₹11L - ₹17L',
    posted: '2024-09-28',
    category: 'AI & Machine Learning',
    experience: 'Mid-level',
    remote: true,
    trending: true,
    description: 'Deploy ML models into production using MLOps practices. Work with TensorFlow, PyTorch, and cloud ML platforms.'
  },
  {
    id: 17,
    title: 'Embedded Systems Engineer',
    company: 'IoT Solutions Inc',
    location: 'Coimbatore, India',
    type: 'Full-time',
    salary: '₹9L - ₹14L',
    posted: '2024-09-20',
    category: 'Embedded Systems',
    experience: 'Senior',
    remote: false,
    trending: false,
    description: 'Design and develop embedded software for IoT devices using C/C++ and real-time operating systems.'
  },
  {
    id: 18,
    title: 'Database Administrator - PostgreSQL',
    company: 'DataVault Systems',
    location: 'Nagpur, India',
    type: 'Full-time',
    salary: '₹8L - ₹13L',
    posted: '2024-08-15',
    category: 'Database Administration',
    experience: 'Mid-level',
    remote: true,
    trending: false,
    description: 'Manage and optimize PostgreSQL databases for high-performance applications. Ensure data security and backup strategies.'
  },
  {
    id: 19,
    title: 'Technical Writer - API Documentation',
    company: 'DocCraft',
    location: 'Remote (India)',
    type: 'Full-time',
    salary: '₹6L - ₹10L',
    posted: '2024-08-05',
    category: 'Technical Writing',
    experience: 'Mid-level',
    remote: true,
    trending: false,
    description: 'Create comprehensive API documentation and developer guides. Work with engineering teams to improve developer experience.'
  },
  {
    id: 20,
    title: 'Solutions Architect - Enterprise',
    company: 'Enterprise Solutions Ltd',
    location: 'Mysore, India',
    type: 'Full-time',
    salary: '₹15L - ₹22L',
    posted: '2024-07-20',
    category: 'Solutions Architecture',
    experience: 'Senior',
    remote: true,
    trending: false,
    description: 'Design enterprise software solutions and guide technical decision-making for large-scale implementations.'
  }
];

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const categories = ['All', 'AI & Machine Learning', 'Web Development', 'DevOps & Infrastructure', 'Mobile Development', 'Data Science', 'Cybersecurity', 'Blockchain', 'Cloud Computing'];
  const jobTypes = ['All', 'Full-time', 'Contract', 'Part-time'];

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-white via-teal-50/30 to-orange-50/20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200 rounded-full px-6 py-3 text-sm font-semibold text-teal-700 mb-8">
              <TrendingUp className="w-4 h-4" />
              <span>20+ Trending Opportunities</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="text-gray-900">Your Next</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500">
                Career Move
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light mb-12">
              Discover trending tech positions from the world's most innovative companies.
              <span className="font-semibold text-gray-800"> Your dream job awaits.</span>
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">20+</div>
                <div className="text-gray-600 font-medium">Open Positions</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">15+</div>
                <div className="text-gray-600 font-medium">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">85%</div>
                <div className="text-gray-600 font-medium">Remote Options</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">₹14L</div>
                <div className="text-gray-600 font-medium">Avg. Salary</div>
              </div>
            </div>
          </div>
        </section>

        {/* CV Upload Inline Component */}
        <CVUploadInline />

        {/* Search and Filters */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Search */}
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-lg"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-lg bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-lg bg-white"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {filteredJobs.length} Available Positions
              </h2>
              <div className="text-gray-600">
                Showing results for {selectedCategory !== 'All' ? selectedCategory : 'all categories'}
              </div>
            </div>

            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="bg-white border border-gray-200 hover:border-lime-300 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-lime-700 transition-colors">
                                {job.title}
                              </h3>
                              {job.trending && (
                                <Badge className="bg-gradient-to-r from-teal-100 to-orange-100 text-teal-700 border-teal-200">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                            </div>
                            <p className="text-xl text-gray-600 font-semibold mb-1">{job.company}</p>
                            <p className="text-gray-500 mb-4">{job.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(job.posted)}
                          </div>
                          {job.remote && (
                            <div className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              Remote Available
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            {job.category}
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            {job.experience}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <a href="mailto:hr@skilltude.com" className="inline-flex">
                          <Button className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group">
                            Apply Now
                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-teal-50 via-cyan-50/50 to-orange-50/30">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Don't See Your Perfect Role?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're constantly adding new opportunities. Get in touch with our team 
              and let us help you find your ideal position.
            </p>
            <a href="mailto:hr@skilltude.com" className="inline-flex">
              <Button size="lg" className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl">
                Contact Our Team
                <ChevronRight className="w-6 h-6 ml-3" />
              </Button>
            </a>
          </div>
        </section>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default Careers;