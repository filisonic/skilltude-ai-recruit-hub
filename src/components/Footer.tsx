
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-6 group">
              <div className="flex items-center gap-3">
                {/* Footer Logo Icon */}
                <div className="relative group-hover:scale-105 transition-all duration-300">
                  <div className="w-9 h-9 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-700 rounded-xl rotate-12 opacity-90"></div>
                    <div className="absolute inset-0.5 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-black text-sm" style={{ fontFamily: 'Poppins, system-ui, -apple-system, sans-serif' }}>S</span>
                    </div>
                  </div>
                </div>
                
                {/* Footer Logo Text */}
                <div className="flex items-baseline">
                  <span className="text-xl font-black text-white tracking-tight group-hover:text-gray-100 transition-colors duration-300" 
                        style={{ fontFamily: 'Poppins, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                    Skill
                  </span>
                  <span className="text-xl font-black bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent tracking-tight"
                        style={{ fontFamily: 'Poppins, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                    Tude
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-gray-400 mb-6">
              Empowering Tech Talent with AI-Driven Recruitment Solutions across 16 specialized tech sectors.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/skilltude-careers/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/skilltude?igsh=cWw3OXBrbzBlcXM3" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.01 6.71.048 5.493.087 4.73.222 4.058.42a5.916 5.916 0 0 0-2.134 1.384A5.916 5.916 0 0 0 .42 4.058C.222 4.73.087 5.493.048 6.71.01 7.929 0 8.396 0 12.017s.01 4.087.048 5.303c.039 1.218.174 1.98.372 2.653a5.916 5.916 0 0 0 1.384 2.134 5.916 5.916 0 0 0 2.134 1.384c.673.198 1.435.333 2.653.372 1.216.039 1.683.048 5.303.048s4.087-.01 5.303-.048c1.218-.039 1.98-.174 2.653-.372a5.916 5.916 0 0 0 2.134-1.384 5.916 5.916 0 0 0 1.384-2.134c.198-.673.333-1.435.372-2.653.039-1.216.048-1.683.048-5.303s-.01-4.087-.048-5.303c-.039-1.218-.174-1.98-.372-2.653a5.916 5.916 0 0 0-1.384-2.134A5.916 5.916 0 0 0 19.942.42C19.27.222 18.507.087 17.29.048 16.071.01 15.604 0 12.017 0zm0 2.16c3.833 0 4.286.01 5.8.048 1.401.064 2.161.264 2.668.44.671.261 1.15.572 1.653 1.075.503.503.814.982 1.075 1.653.176.507.376 1.267.44 2.668.038 1.514.048 1.967.048 5.8s-.01 4.286-.048 5.8c-.064 1.401-.264 2.161-.44 2.668-.261.671-.572 1.15-1.075 1.653-.503.503-.982.814-1.653 1.075-.507.176-1.267.376-2.668.44-1.514.038-1.967.048-5.8.048s-4.286-.01-5.8-.048c-1.401-.064-2.161-.264-2.668-.44-.671-.261-1.15-.572-1.653-1.075-.503-.503-.814-.982-1.075-1.653-.176-.507-.376-1.267-.44-2.668-.038-1.514-.048-1.967-.048-5.8s.01-4.286.048-5.8c.064-1.401.264-2.161.44-2.668.261-.671.572-1.15 1.075-1.653.503-.503.982-.814 1.653-1.075.507-.176 1.267-.376 2.668-.44 1.514-.038 1.967-.048 5.8-.048z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.017 5.838a6.179 6.179 0 1 0 0 12.358 6.179 6.179 0 0 0 0-12.358zM12.017 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.624-10.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@skillyai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                <span className="sr-only">YouTube</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
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
              <p className="mb-3">HD-193, WeWork, Embassy TechVillage</p>
              <p className="mb-3">Bellandur, Bengaluru, Karnataka 560103</p>
              <p className="mb-3">India</p>
            </address>
            <p className="mb-3">
              <a href="tel:+919986704400" className="text-gray-400 hover:text-primary-light">+91 9986704400</a>
            </p>
            <p>
              <a href="mailto:hr@skilltude.com" className="text-gray-400 hover:text-primary-light">hr@skilltude.com</a>
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
