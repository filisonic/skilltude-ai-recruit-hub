
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Get in touch with our team to discuss how we can help you find top tech talent or advance your career.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                    <Input id="phone" placeholder="+1 (234) 567-8901" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="inquiry" className="text-sm font-medium text-gray-700">Inquiry Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employer">I'm an employer looking to hire</SelectItem>
                        <SelectItem value="jobseeker">I'm a job seeker</SelectItem>
                        <SelectItem value="partner">Partnership opportunity</SelectItem>
                        <SelectItem value="other">Other inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Please describe how we can help you..." 
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Send Message
                  </Button>
                </form>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Address</h3>
                    <address className="not-italic text-gray-600">
                      <p>SkillTude Headquarters</p>
                      <p>123 Tech Avenue</p>
                      <p>Silicon Valley, CA 94043</p>
                      <p>United States</p>
                    </address>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Phone:</span>{" "}
                      <a href="tel:+1234567890" className="hover:text-primary">+1 (234) 567-890</a>
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Email:</span>{" "}
                      <a href="mailto:info@skilltude.com" className="hover:text-primary">info@skilltude.com</a>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Support:</span>{" "}
                      <a href="mailto:support@skilltude.com" className="hover:text-primary">support@skilltude.com</a>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Hours of Operation</h3>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Monday-Friday:</span> 9:00 AM - 6:00 PM (PT)
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Saturday-Sunday:</span> Closed
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a href="https://linkedin.com" className="text-gray-600 hover:text-primary">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a href="https://twitter.com" className="text-gray-600 hover:text-primary">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                      <a href="https://facebook.com" className="text-gray-600 hover:text-primary">
                        <span className="sr-only">Facebook</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-gray-100 rounded-lg overflow-hidden h-80">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.638327417634!2d-122.08400708469259!3d37.42199997982367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fbc96de7d4d3d%3A0x92648e1b0d0a1d31!2sGoogleplex!5e0!3m2!1sen!2sus!4v1625007845742!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    title="Company Location Map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
