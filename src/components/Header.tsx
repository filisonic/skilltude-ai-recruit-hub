import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useHeaderScroll();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  // Handle mobile menu state for layout system
  useEffect(() => {
    const root = document.documentElement;
    if (isMenuOpen) {
      // Add class to body to indicate mobile menu is open
      document.body.classList.add('mobile-menu-open');
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('mobile-menu-open');
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg'
      : 'bg-white/90 backdrop-blur-sm border-b border-gray-100/50'
      }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'
          }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="flex items-center gap-3">
              {/* Your Actual Logo Image */}
              <div className="relative group-hover:scale-105 transition-all duration-300">
                <img
                  src="/images/skilltude-logo.png"
                  alt="SkillTude Logo"
                  className="h-10 w-auto object-contain"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                    transition: 'all 0.3s ease'
                  }}
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const nextElement = target.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />

                {/* Fallback Text Logo (hidden by default) */}
                <div className="hidden items-baseline gap-1" style={{ display: 'none' }}>
                  <span className="text-2xl font-black tracking-tight transition-colors duration-300"
                    style={{
                      fontFamily: 'Poppins, system-ui, sans-serif',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #d97706 75%, #ea580c 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                    SkillTude
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/about"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActiveLink('/about')
                ? 'bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 border border-teal-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              About
            </Link>
            <Link
              to="/services"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActiveLink('/services')
                ? 'bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 border border-teal-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Services
            </Link>
            <Link
              to="/careers"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActiveLink('/careers')
                ? 'bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 border border-teal-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Careers
            </Link>
            <Link
              to="/blog"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActiveLink('/blog')
                ? 'bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 border border-teal-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActiveLink('/contact')
                ? 'bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 border border-teal-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Contact
            </Link>
            <Link
              to="/crm"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActiveLink('/crm')
                ? 'bg-gradient-to-r from-blue-50 to-orange-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              CRM
            </Link>
            <Link
              to="/speakers-directory"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActiveLink('/speakers-directory')
                ? 'bg-gradient-to-r from-blue-50 to-orange-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Speakers
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/hire-candidate">
              <Button className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 hover:from-teal-700 hover:via-cyan-700 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                Hire Talent
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md absolute left-0 right-0 top-full z-40 shadow-lg">
            <nav className="py-6 space-y-1">
              <Link
                to="/about"
                className={`block px-6 py-3 rounded-xl mx-4 text-sm font-semibold transition-all duration-200 ${isActiveLink('/about')
                  ? 'bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="/services"
                className={`block px-6 py-3 rounded-xl mx-4 text-sm font-semibold transition-all duration-200 ${isActiveLink('/services')
                  ? 'bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={toggleMenu}
              >
                Services
              </Link>
              <Link
                to="/careers"
                className={`block px-6 py-3 rounded-xl mx-4 text-sm font-semibold transition-all duration-200 ${isActiveLink('/careers')
                  ? 'bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={toggleMenu}
              >
                Careers
              </Link>
              <Link
                to="/blog"
                className={`block px-6 py-3 rounded-xl mx-4 text-sm font-semibold transition-all duration-200 ${isActiveLink('/blog')
                  ? 'bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={toggleMenu}
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className={`block px-6 py-3 rounded-xl mx-4 text-sm font-semibold transition-all duration-200 ${isActiveLink('/contact')
                  ? 'bg-gradient-to-r from-teal-50 to-orange-50 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <Link
                to="/crm"
                className={`block px-6 py-3 rounded-xl mx-4 text-sm font-semibold transition-all duration-200 ${isActiveLink('/crm')
                  ? 'bg-gradient-to-r from-blue-50 to-orange-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={toggleMenu}
              >
                CRM
              </Link>
              <Link
                to="/speakers-directory"
                className={`block px-6 py-3 rounded-xl mx-4 text-sm font-semibold transition-all duration-200 ${isActiveLink('/speakers-directory')
                  ? 'bg-gradient-to-r from-blue-50 to-orange-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                onClick={toggleMenu}
              >
                Speakers
              </Link>

              {/* Mobile CTAs */}
              <div className="px-4 pt-4 space-y-3">
                <Link to="/hire-candidate" onClick={toggleMenu}>
                  <Button className="bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500 text-white w-full py-3 rounded-xl text-sm font-semibold shadow-lg">
                    Hire Talent
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;