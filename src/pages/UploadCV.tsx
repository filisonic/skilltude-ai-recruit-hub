
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';

const UploadCV = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('CV upload form submitted');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Upload Your CV</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let our AI-powered system match you with the perfect tech opportunities
            </p>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Complete your profile to help us find the best matches for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <Input id="firstName" placeholder="Your first name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <Input id="lastName" placeholder="Your last name" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <Input id="phone" placeholder="Your phone number" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="resume" className="text-sm font-medium">Upload Your CV/Resume</label>
                  <Input id="resume" type="file" className="cursor-pointer" required />
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="skills" className="text-sm font-medium">Key Skills</label>
                  <Input id="skills" placeholder="e.g. React, Python, Machine Learning" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="experience" className="text-sm font-medium">Years of Experience</label>
                  <Input id="experience" type="number" min="0" placeholder="e.g. 5" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">Professional Summary</label>
                  <Textarea 
                    id="bio" 
                    placeholder="Brief overview of your experience and career goals"
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full">Submit Profile</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadCV;
