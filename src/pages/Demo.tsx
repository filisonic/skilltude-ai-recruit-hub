
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';

const Demo = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Demo request form submitted');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Request a Demo</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See our AI recruitment tools in action and discover how they can transform your hiring process
            </p>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Demo Request</CardTitle>
              <CardDescription>
                Fill out the form below to schedule a personalized demo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                    <Input id="name" placeholder="Full name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">Company Name</label>
                    <Input id="company" placeholder="Your company name" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Business Email</label>
                    <Input id="email" type="email" placeholder="you@company.com" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                    <Input id="phone" placeholder="Your phone number" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Your Role</label>
                  <Input id="role" placeholder="e.g. HR Manager, CTO, Hiring Manager" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="companySize" className="text-sm font-medium">Company Size</label>
                  <Input id="companySize" placeholder="e.g. 1-10, 11-50, 51-200, 201+" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="interests" className="text-sm font-medium">What aspects of our solution are you most interested in?</label>
                  <Textarea 
                    id="interests" 
                    placeholder="e.g. AI matching, recruitment automation, candidate screening"
                    rows={3}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">Schedule Demo</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;
