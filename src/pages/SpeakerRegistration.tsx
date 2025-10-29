import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Upload,
  Mic,
  Award,
  Globe,
  Users,
  Clock,
  Star
} from 'lucide-react';

const SpeakerRegistration = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      bio: '',
      profilePhoto: null
    },
    professionalInfo: {
      title: '',
      company: '',
      experience: '',
      expertise: [],
      linkedinUrl: '',
      websiteUrl: ''
    },
    speakingInfo: {
      topics: [],
      languages: [],
      audienceSize: '',
      speakingExperience: '',
      fee: '',
      feeType: 'fixed', // fixed, hourly, negotiable, free
      availability: [],
      travelPreference: 'local', // local, national, international
      virtualSpeaking: true
    },
    documents: {
      resume: null,
      speakerReel: null,
      testimonials: []
    }
  });

  const expertiseAreas = [
    'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cybersecurity',
    'Web Development', 'Mobile Development', 'Cloud Computing', 'DevOps',
    'Blockchain', 'IoT', 'UI/UX Design', 'Product Management',
    'Digital Marketing', 'Entrepreneurship', 'Leadership', 'Innovation',
    'Sustainability', 'Finance', 'Healthcare Tech', 'EdTech'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi',
    'Arabic', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Italian'
  ];

  const topicSuggestions = [
    'Future of AI in Business', 'Cybersecurity Best Practices', 'Digital Transformation',
    'Sustainable Technology', 'Career Development in Tech', 'Innovation Leadership',
    'Data-Driven Decision Making', 'Remote Work Culture', 'Startup Ecosystem',
    'Women in Technology', 'Diversity & Inclusion', 'Ethical Technology'
  ];

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (section: string, field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].includes(item) 
          ? prev[section][field].filter(i => i !== item)
          : [...prev[section][field], item]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the data to your Hostinger database
    console.log('Speaker registration data:', formData);
    
    // Create mailto with structured data for now
    const emailData = {
      subject: 'New Speaker Registration',
      body: `
Speaker Registration Details:

PERSONAL INFORMATION:
Name: ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}
Email: ${formData.personalInfo.email}
Phone: ${formData.personalInfo.phone}
Location: ${formData.personalInfo.location}

PROFESSIONAL INFORMATION:
Title: ${formData.professionalInfo.title}
Company: ${formData.professionalInfo.company}
Experience: ${formData.professionalInfo.experience} years
Expertise: ${formData.professionalInfo.expertise.join(', ')}

SPEAKING INFORMATION:
Topics: ${formData.speakingInfo.topics.join(', ')}
Languages: ${formData.speakingInfo.languages.join(', ')}
Fee: ${formData.speakingInfo.fee} (${formData.speakingInfo.feeType})
Travel: ${formData.speakingInfo.travelPreference}
Virtual Speaking: ${formData.speakingInfo.virtualSpeaking ? 'Yes' : 'No'}

BIO:
${formData.personalInfo.bio}
      `.trim()
    };

    window.location.href = `mailto:hr@skilltude.com?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-6 py-3 text-sm font-semibold text-purple-700 mb-8">
              <Mic className="w-4 h-4" />
              <span>Speaker Portal</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600">Speaker Network</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Share your expertise with colleges and universities worldwide. Register as a speaker and connect with institutions looking for industry professionals to inspire their students.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Reach Students</h3>
                <p className="text-gray-600 text-sm">Connect with eager learners across multiple institutions</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Globe className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Global Reach</h3>
                <p className="text-gray-600 text-sm">Speak virtually or in-person at institutions worldwide</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Build Authority</h3>
                <p className="text-gray-600 text-sm">Establish yourself as a thought leader in your field</p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="w-6 h-6 text-purple-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={formData.personalInfo.firstName}
                        onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={formData.personalInfo.lastName}
                        onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={formData.personalInfo.email}
                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={formData.personalInfo.phone}
                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location (City, Country) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., San Francisco, USA"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.personalInfo.location}
                      onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about yourself, your background, and what makes you a great speaker..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.personalInfo.bio}
                      onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Senior Data Scientist"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.professionalInfo.title}
                        onChange={(e) => handleInputChange('professionalInfo', 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Google, Microsoft"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.professionalInfo.company}
                        onChange={(e) => handleInputChange('professionalInfo', 'company', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.professionalInfo.experience}
                        onChange={(e) => handleInputChange('professionalInfo', 'experience', e.target.value)}
                      >
                        <option value="">Select experience</option>
                        <option value="1-3">1-3 years</option>
                        <option value="4-7">4-7 years</option>
                        <option value="8-12">8-12 years</option>
                        <option value="13-20">13-20 years</option>
                        <option value="20+">20+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.professionalInfo.linkedinUrl}
                        onChange={(e) => handleInputChange('professionalInfo', 'linkedinUrl', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Areas of Expertise * (Select all that apply)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {expertiseAreas.map((area) => (
                        <label key={area} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={formData.professionalInfo.expertise.includes(area)}
                            onChange={() => handleArrayToggle('professionalInfo', 'expertise', area)}
                          />
                          <span className="text-sm text-gray-700">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Speaking Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mic className="w-6 h-6 text-green-600" />
                    Speaking Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Speaking Topics * (Add your topics)</label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {topicSuggestions.map((topic) => (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => handleArrayToggle('speakingInfo', 'topics', topic)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              formData.speakingInfo.topics.includes(topic)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add custom topic and press Enter"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (value && !formData.speakingInfo.topics.includes(value)) {
                              handleArrayToggle('speakingInfo', 'topics', value);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Languages * (Select all you can speak in)</label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {languages.map((language) => (
                        <label key={language} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            checked={formData.speakingInfo.languages.includes(language)}
                            onChange={() => handleArrayToggle('speakingInfo', 'languages', language)}
                          />
                          <span className="text-sm text-gray-700">{language}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Speaking Fee</label>
                      <div className="flex gap-3">
                        <select
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={formData.speakingInfo.feeType}
                          onChange={(e) => handleInputChange('speakingInfo', 'feeType', e.target.value)}
                        >
                          <option value="free">Free</option>
                          <option value="fixed">Fixed Rate</option>
                          <option value="hourly">Hourly Rate</option>
                          <option value="negotiable">Negotiable</option>
                        </select>
                        {formData.speakingInfo.feeType !== 'free' && (
                          <input
                            type="text"
                            placeholder="$500, $50/hour, etc."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.speakingInfo.fee}
                            onChange={(e) => handleInputChange('speakingInfo', 'fee', e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Travel Preference *</label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={formData.speakingInfo.travelPreference}
                        onChange={(e) => handleInputChange('speakingInfo', 'travelPreference', e.target.value)}
                      >
                        <option value="local">Local only</option>
                        <option value="national">National</option>
                        <option value="international">International</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        checked={formData.speakingInfo.virtualSpeaking}
                        onChange={(e) => handleInputChange('speakingInfo', 'virtualSpeaking', e.target.checked)}
                      />
                      <span className="text-sm font-medium text-gray-700">Available for virtual speaking engagements</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Speaking Experience</label>
                    <textarea
                      rows={3}
                      placeholder="Describe your previous speaking experience, notable events, audience sizes, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={formData.speakingInfo.speakingExperience}
                      onChange={(e) => handleInputChange('speakingInfo', 'speakingExperience', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <CheckCircle className="w-6 h-6 mr-3" />
                  Register as Speaker
                </Button>
                <p className="text-gray-600 mt-4">
                  By registering, you agree to be contacted by educational institutions for speaking opportunities.
                </p>
              </div>
            </form>
          </div>
        </section>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default SpeakerRegistration;