
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-white">Skill<span className="text-primary-light">Tude</span></span>
            </Link>
            <p className="text-gray-400 mb-6">
              Empowering Tech Talent with AI-Driven Recruitment Solutions across 16 specialized tech sectors.
            </p>
            <div className="flex space-x-4">
              <a href="https://linkedin.com" className="text-gray-400 hover:text-primary-light">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-primary-light">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-primary-light">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-primary-light">About Us</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-primary-light">Services</Link></li>
              <li><Link to="/industries" className="text-gray-400 hover:text-primary-light">Industries</Link></li>
              <li><Link to="/solutions" className="text-gray-400 hover:text-primary-light">Solutions</Link></li>
              <li><Link to="/jobs" className="text-gray-400 hover:text-primary-light">Jobs</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-light">Contact</Link></li>
              <li><Link to="/client-login" className="text-gray-400 hover:text-primary-light">Client Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-gray-400 hover:text-primary-light">Blog</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-primary-light">Whitepapers</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-primary-light">Case Studies</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-primary-light">Webinars</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-primary-light">Careers at SkillTude</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <address className="text-gray-400 not-italic">
              <p className="mb-3">123 Tech Avenue</p>
              <p className="mb-3">Silicon Valley, CA 94043</p>
              <p className="mb-3">United States</p>
            </address>
            <p className="mb-3">
              <a href="tel:+1234567890" className="text-gray-400 hover:text-primary-light">+1 (234) 567-890</a>
            </p>
            <p>
              <a href="mailto:info@skilltude.com" className="text-gray-400 hover:text-primary-light">info@skilltude.com</a>
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} SkillTude. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-primary-light">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-primary-light">Terms of Service</Link></li>
              <li><Link to="/sitemap" className="text-gray-400 hover:text-primary-light">Sitemap</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
