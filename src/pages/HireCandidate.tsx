
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';

const HireCandidate = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Hire candidate form submitted');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Hire Top Tech Talent</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about your hiring needs and we'll connect you with pre-screened candidates that match your requirements.
            </p>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Hiring Requirements</CardTitle>
              <CardDescription>
                Fill out the form below to start your candidate search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">Company Name</label>
                  <Input id="company" placeholder="Your company name" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                    <Input id="name" placeholder="Full name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <Input id="email" type="email" placeholder="you@company.com" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium">Position to Fill</label>
                  <Input id="position" placeholder="e.g. Senior React Developer" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="requirements" className="text-sm font-medium">Job Requirements</label>
                  <Textarea 
                    id="requirements" 
                    placeholder="Describe the skills, experience, and qualifications needed"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">Location</label>
                  <Input id="location" placeholder="e.g. Remote, New York, etc." required />
                </div>
                
                <Button type="submit" className="w-full">Submit Hiring Request</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default HireCandidate;
