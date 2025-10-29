import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Star, 
  Calendar, 
  DollarSign,
  Globe,
  Video,
  Users,
  Clock,
  BookOpen,
  Award,
  Mic,
  ChevronDown,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';

const SpeakersDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [feeRange, setFeeRange] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Sample data - this would come from your Hostinger database
  const speakers = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      title: 'Senior AI Research Scientist',
      company: 'Google DeepMind',
      location: 'San Francisco, USA',
      bio: 'Leading researcher in machine learning and neural networks with 10+ years of experience. Published 50+ papers and spoke at major conferences worldwide.',
      expertise: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning'],
      languages: ['English', 'Mandarin'],
      rating: 4.9,
      reviewCount: 47,
      fee: '$2,500',
      feeType: 'fixed',
      virtualAvailable: true,
      travelPreference: 'international',
      profileImage: '/images/speakers/sarah-chen.jpg',
      topics: [
        'Future of AI in Healthcare',
        'Ethics in Machine Learning',
        'Neural Network Architecture',
        'AI Career Paths'
      ],
      availability: ['2024-10-15', '2024-10-22', '2024-11-05', '2024-11-12'],
      speakingExperience: 'Keynote speaker at NeurIPS, ICML, and Google I/O. Delivered 100+ talks worldwide.',
      testimonials: [
        'Dr. Chen\'s presentation was exceptional and greatly inspired our students.',
        'Incredible depth of knowledge delivered in an accessible way.'
      ]
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'Chief Technology Officer',
      company: 'TechStartup Inc',
      location: 'Austin, USA',
      bio: 'Serial entrepreneur and tech executive with experience building and scaling technology companies from startup to IPO.',
      expertise: ['Entrepreneurship', 'Leadership', 'Web Development'],
      languages: ['English', 'Spanish'],
      rating: 4.8,
      reviewCount: 32,
      fee: 'Negotiable',
      feeType: 'negotiable',
      virtualAvailable: true,
      travelPreference: 'national',
      profileImage: '/images/speakers/marcus-rodriguez.jpg',
      topics: [
        'Building Successful Startups',
        'Technology Leadership',
        'Scaling Engineering Teams',
        'Innovation in Tech'
      ],
      availability: ['2024-10-18', '2024-10-25', '2024-11-08', '2024-11-15'],
      speakingExperience: 'Regular speaker at SXSW, TechCrunch Disrupt, and university career fairs.',
      testimonials: [
        'Marcus provided invaluable insights into the startup ecosystem.',
        'Students were highly engaged throughout his presentation.'
      ]
    },
    {
      id: 3,
      name: 'Prof. Aisha Patel',
      title: 'Cybersecurity Director',
      company: 'IBM Security',
      location: 'London, UK',
      bio: 'Cybersecurity expert with extensive experience in threat intelligence and digital forensics. Former government security advisor.',
      expertise: ['Cybersecurity', 'Digital Forensics', 'Risk Management'],
      languages: ['English', 'Hindi', 'French'],
      rating: 5.0,
      reviewCount: 28,
      fee: 'Free',
      feeType: 'free',
      virtualAvailable: true,
      travelPreference: 'international',
      profileImage: '/images/speakers/aisha-patel.jpg',
      topics: [
        'Cybersecurity Best Practices',
        'Threat Intelligence',
        'Digital Privacy Rights',
        'Career in Cybersecurity'
      ],
      availability: ['2024-10-20', '2024-10-27', '2024-11-10', '2024-11-17'],
      speakingExperience: 'Keynote at RSA Conference, Black Hat, and DEF CON. Regular university guest lecturer.',
      testimonials: [
        'Outstanding presentation on cybersecurity fundamentals.',
        'Prof. Patel made complex topics very understandable.'
      ]
    },
    {
      id: 4,
      name: 'James Kim',
      title: 'Product Design Director',
      company: 'Apple',
      location: 'Cupertino, USA',
      bio: 'Award-winning product designer with 12 years of experience creating user-centered products used by millions worldwide.',
      expertise: ['UI/UX Design', 'Product Management', 'Design Thinking'],
      languages: ['English', 'Korean'],
      rating: 4.7,
      reviewCount: 41,
      fee: '$1,800',
      feeType: 'fixed',
      virtualAvailable: true,
      travelPreference: 'national',
      profileImage: '/images/speakers/james-kim.jpg',
      topics: [
        'Human-Centered Design',
        'Design Thinking Process',
        'Building Design Teams',
        'Future of UX'
      ],
      availability: ['2024-10-16', '2024-10-23', '2024-11-06', '2024-11-13'],
      speakingExperience: 'Speaker at Design+Research, UX Week, and various design schools.',
      testimonials: [
        'James brought incredible real-world design insights.',
        'Students loved the hands-on design exercises.'
      ]
    },
    {
      id: 5,
      name: 'Dr. Emily Watson',
      title: 'Sustainability Tech Lead',
      company: 'Tesla',
      location: 'Berlin, Germany',
      bio: 'Environmental engineer turned tech leader, focused on sustainable technology solutions and green innovation.',
      expertise: ['Sustainability', 'Clean Technology', 'Innovation'],
      languages: ['English', 'German', 'Spanish'],
      rating: 4.9,
      reviewCount: 35,
      fee: '$2,200',
      feeType: 'fixed',
      virtualAvailable: true,
      travelPreference: 'international',
      profileImage: '/images/speakers/emily-watson.jpg',
      topics: [
        'Sustainable Technology',
        'Climate Tech Innovation',
        'Green Career Paths',
        'Environmental Impact of Tech'
      ],
      availability: ['2024-10-19', '2024-10-26', '2024-11-09', '2024-11-16'],
      speakingExperience: 'TED speaker, COP27 presenter, and regular at sustainability conferences.',
      testimonials: [
        'Dr. Watson inspired our students about climate tech careers.',
        'Excellent balance of technical depth and accessibility.'
      ]
    },
    {
      id: 6,
      name: 'Raj Sharma',
      title: 'Blockchain Architect',
      company: 'Ethereum Foundation',
      location: 'Toronto, Canada',
      bio: 'Blockchain technology pioneer with deep expertise in decentralized systems and cryptocurrency protocols.',
      expertise: ['Blockchain', 'Cryptocurrency', 'Decentralized Systems'],
      languages: ['English', 'Hindi', 'Punjabi'],
      rating: 4.6,
      reviewCount: 29,
      fee: '$1,500',
      feeType: 'fixed',
      virtualAvailable: true,
      travelPreference: 'international',
      profileImage: '/images/speakers/raj-sharma.jpg',
      topics: [
        'Blockchain Fundamentals',
        'Cryptocurrency Economics',
        'DeFi and Web3',
        'Blockchain Career Opportunities'
      ],
      availability: ['2024-10-21', '2024-10-28', '2024-11-11', '2024-11-18'],
      speakingExperience: 'Speaker at Ethereum DevCon, Consensus, and major blockchain conferences.',
      testimonials: [
        'Raj made blockchain technology very accessible to students.',
        'Great insights into the future of decentralized technology.'
      ]
    }
  ];

  const expertiseAreas = [
    'Artificial Intelligence', 'Machine Learning', 'Cybersecurity', 'Web Development',
    'Mobile Development', 'Cloud Computing', 'DevOps', 'Blockchain',
    'UI/UX Design', 'Product Management', 'Digital Marketing', 'Entrepreneurship',
    'Leadership', 'Innovation', 'Sustainability', 'Finance'
  ];

  const locations = [
    'San Francisco, USA', 'Austin, USA', 'London, UK', 'Cupertino, USA',
    'Berlin, Germany', 'Toronto, Canada', 'New York, USA', 'Singapore',
    'Sydney, Australia', 'Tokyo, Japan'
  ];

  const filteredSpeakers = speakers.filter(speaker => {
    const matchesSearch = speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         speaker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         speaker.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         speaker.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         speaker.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExpertise = !selectedExpertise || speaker.expertise.includes(selectedExpertise);
    const matchesLocation = !selectedLocation || speaker.location === selectedLocation;
    const matchesFee = !feeRange || 
      (feeRange === 'free' && speaker.feeType === 'free') ||
      (feeRange === 'low' && (speaker.feeType === 'free' || (speaker.fee && parseInt(speaker.fee.replace(/[^0-9]/g, '')) < 1000))) ||
      (feeRange === 'medium' && speaker.fee && parseInt(speaker.fee.replace(/[^0-9]/g, '')) >= 1000 && parseInt(speaker.fee.replace(/[^0-9]/g, '')) <= 2000) ||
      (feeRange === 'high' && speaker.fee && parseInt(speaker.fee.replace(/[^0-9]/g, '')) > 2000) ||
      (feeRange === 'negotiable' && speaker.feeType === 'negotiable');
    
    const matchesAvailability = !availabilityFilter || 
      (availabilityFilter === 'virtual' && speaker.virtualAvailable) ||
      (availabilityFilter === 'local' && speaker.travelPreference === 'local') ||
      (availabilityFilter === 'international' && speaker.travelPreference === 'international');

    return matchesSearch && matchesExpertise && matchesLocation && matchesFee && matchesAvailability;
  });

  const handleBookSpeaker = (speaker: any) => {
    const emailSubject = `Speaking Engagement Request - ${speaker.name}`;
    const emailBody = `
Dear ${speaker.name},

I am writing to inquire about your availability for a speaking engagement at our institution.

Speaker: ${speaker.name}
Title: ${speaker.title}
Company: ${speaker.company}

We are interested in having you speak about one of your topics:
${speaker.topics.map(topic => `• ${topic}`).join('\n')}

Please let us know your availability and we can discuss the details.

Best regards,
[Your Name]
[Institution Name]
[Contact Information]
    `.trim();

    window.location.href = `mailto:hr@skilltude.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-purple-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 text-sm font-semibold text-blue-700 mb-8">
                <Users className="w-4 h-4" />
                <span>For Educational Institutions</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Speakers</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
                Connect with industry professionals and thought leaders to inspire your students. 
                Browse our curated network of expert speakers available for talks, workshops, and career sessions.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, company, expertise, or topic..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedExpertise}
                      onChange={(e) => setSelectedExpertise(e.target.value)}
                    >
                      <option value="">All Areas</option>
                      {expertiseAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fee Range</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={feeRange}
                      onChange={(e) => setFeeRange(e.target.value)}
                    >
                      <option value="">Any Fee</option>
                      <option value="free">Free</option>
                      <option value="low">Under $1,000</option>
                      <option value="medium">$1,000 - $2,000</option>
                      <option value="high">Over $2,000</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                    >
                      <option value="">Any Format</option>
                      <option value="virtual">Virtual Available</option>
                      <option value="local">Local Only</option>
                      <option value="international">International Travel</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredSpeakers.length} Speaker{filteredSpeakers.length !== 1 ? 's' : ''} Found
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Updated daily</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredSpeakers.map((speaker) => (
                <Card key={speaker.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
                        <p className="text-lg font-semibold text-blue-600 mb-1">{speaker.title}</p>
                        <p className="text-gray-600 mb-3">{speaker.company}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{speaker.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{speaker.rating} ({speaker.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 mb-1">{speaker.fee}</div>
                        <div className="text-sm text-gray-600 capitalize">{speaker.feeType}</div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">{speaker.bio}</p>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Expertise Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {speaker.expertise.map((area, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Speaking Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {speaker.topics.slice(0, 3).map((topic, index) => (
                            <Badge key={index} variant="outline" className="border-purple-200 text-purple-700">
                              {topic}
                            </Badge>
                          ))}
                          {speaker.topics.length > 3 && (
                            <Badge variant="outline" className="border-gray-200 text-gray-600">
                              +{speaker.topics.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <span>Languages: {speaker.languages.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {speaker.virtualAvailable ? (
                            <>
                              <Video className="w-4 h-4 text-green-500" />
                              <span className="text-green-600">Virtual Available</span>
                            </>
                          ) : (
                            <>
                              <Video className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">In-person Only</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleBookSpeaker(speaker)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Speaker
                      </Button>
                      <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSpeakers.length === 0 && (
              <div className="text-center py-16">
                <Mic className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No speakers found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Can't Find the Right Speaker?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Let us help you find the perfect speaker for your event. Our team can match you with experts in any field.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:hr@skilltude.com?subject=Custom Speaker Request" className="inline-flex">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl text-lg font-semibold">
                  <Mail className="w-5 h-5 mr-2" />
                  Request Custom Match
                </Button>
              </a>
              <a href="/speaker-registration" className="inline-flex">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold">
                  <Mic className="w-5 h-5 mr-2" />
                  Become a Speaker
                </Button>
              </a>
            </div>
          </div>
        </section>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default SpeakersDirectory;