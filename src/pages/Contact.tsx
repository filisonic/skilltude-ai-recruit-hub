

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
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
      <PageLayout>
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
                  <form 
                    action="mailto:hr@skilltude.com" 
                    method="post" 
                    encType="text/plain"
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                        <Input id="firstName" name="firstName" placeholder="John" required />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                        <Input id="lastName" name="lastName" placeholder="Doe" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                      <Input id="phone" name="phone" placeholder="+1 (234) 567-8901" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="inquiry" className="text-sm font-medium text-gray-700">Inquiry Type</label>
                      <Select name="inquiry">
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employer">I'm an employer looking to hire</SelectItem>
                          <SelectItem value="jobseeker">I'm a job seeker</SelectItem>
                          <SelectItem value="career-application">Career application inquiry</SelectItem>
                          <SelectItem value="partner">Partnership opportunity</SelectItem>
                          <SelectItem value="other">Other inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                      <Textarea 
                        id="message" 
                        name="message"
                        placeholder="Please describe how we can help you..." 
                        className="min-h-[150px]"
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white font-semibold">
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
                        <p>HD-193, WeWork, Embassy TechVillage</p>
                        <p>Bellandur, Bengaluru, Karnataka 560103</p>
                        <p>India</p>
                      </address>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Phone:</span>{" "}
                        <a href="tel:+919986704400" className="hover:text-primary">+91 9986704400</a>
                      </p>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Email:</span>{" "}
                        <a href="mailto:hr@skilltude.com" className="hover:text-primary">hr@skilltude.com</a>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                      <div className="flex space-x-4">
                        <a href="https://www.linkedin.com/company/skilltude-careers/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-teal-600 transition-colors duration-300">
                          <span className="sr-only">LinkedIn</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                        <a href="https://www.instagram.com/skilltude?igsh=cWw3OXBrbzBlcXM3" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600 transition-colors duration-300">
                          <span className="sr-only">Instagram</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.01 6.71.048 5.493.087 4.73.222 4.058.42a5.916 5.916 0 0 0-2.134 1.384A5.916 5.916 0 0 0 .42 4.058C.222 4.73.087 5.493.048 6.71.01 7.929 0 8.396 0 12.017s.01 4.087.048 5.303c.039 1.218.174 1.98.372 2.653a5.916 5.916 0 0 0 1.384 2.134 5.916 5.916 0 0 0 2.134 1.384c.673.198 1.435.333 2.653.372 1.216.039 1.683.048 5.303.048s4.087-.01 5.303-.048c1.218-.039 1.98-.174 2.653-.372a5.916 5.916 0 0 0 2.134-1.384 5.916 5.916 0 0 0 1.384-2.134c.198-.673.333-1.435.372-2.653.039-1.216.048-1.683.048-5.303s-.01-4.087-.048-5.303c-.039-1.218-.174-1.98-.372-2.653a5.916 5.916 0 0 0-1.384-2.134A5.916 5.916 0 0 0 19.942.42C19.27.222 18.507.087 17.29.048 16.071.01 15.604 0 12.017 0zm0 2.16c3.833 0 4.286.01 5.8.048 1.401.064 2.161.264 2.668.44.671.261 1.15.572 1.653 1.075.503.503.814.982 1.075 1.653.176.507.376 1.267.44 2.668.038 1.514.048 1.967.048 5.8s-.01 4.286-.048 5.8c-.064 1.401-.264 2.161-.44 2.668-.261.671-.572 1.15-1.075 1.653-.503.503-.982.814-1.653 1.075-.507.176-1.267.376-2.668.44-1.514.038-1.967.048-5.8.048s-4.286-.01-5.8-.048c-1.401-.064-2.161-.264-2.668-.44-.671-.261-1.15-.572-1.653-1.075-.503-.503-.814-.982-1.075-1.653-.176-.507-.376-1.267-.44-2.668-.038-1.514-.048-1.967-.048-5.8s.01-4.286.048-5.8c.064-1.401.264-2.161.44-2.668.261-.671.572-1.15 1.075-1.653.503-.503.982-.814 1.653-1.075.507-.176 1.267-.376 2.668-.44 1.514-.038 1.967-.048 5.8-.048z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M12.017 5.838a6.179 6.179 0 1 0 0 12.358 6.179 6.179 0 0 0 0-12.358zM12.017 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.624-10.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="https://www.youtube.com/@skillyai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors duration-300">
                          <span className="sr-only">YouTube</span>
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
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
      </PageLayout>
      <Footer />
    </div>
  );
};

export default Contact;
