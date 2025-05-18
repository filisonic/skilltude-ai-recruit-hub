
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="relative bg-white shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Skill<span className="text-primary-dark">Tude</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link to="/about" className="text-gray-600 hover:text-primary font-medium">About</Link>
              <Link to="/services" className="text-gray-600 hover:text-primary font-medium">Services</Link>
              <Link to="/industries" className="text-gray-600 hover:text-primary font-medium">Industries</Link>
              <Link to="/solutions" className="text-gray-600 hover:text-primary font-medium">Solutions</Link>
              <Link to="/jobs" className="text-gray-600 hover:text-primary font-medium">Jobs</Link>
              <Link to="/blog" className="text-gray-600 hover:text-primary font-medium">Blog</Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary font-medium">Contact</Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link to="/client-login">
                <Button variant="outline" size="sm">Client Login</Button>
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              className="text-gray-600 hover:text-primary"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link to="/about" className="block py-2 text-gray-600 hover:text-primary" onClick={toggleMenu}>About</Link>
            <Link to="/services" className="block py-2 text-gray-600 hover:text-primary" onClick={toggleMenu}>Services</Link>
            <Link to="/industries" className="block py-2 text-gray-600 hover:text-primary" onClick={toggleMenu}>Industries</Link>
            <Link to="/solutions" className="block py-2 text-gray-600 hover:text-primary" onClick={toggleMenu}>Solutions</Link>
            <Link to="/jobs" className="block py-2 text-gray-600 hover:text-primary" onClick={toggleMenu}>Jobs</Link>
            <Link to="/blog" className="block py-2 text-gray-600 hover:text-primary" onClick={toggleMenu}>Blog</Link>
            <Link to="/contact" className="block py-2 text-gray-600 hover:text-primary" onClick={toggleMenu}>Contact</Link>
            <div className="pt-2">
              <Link to="/client-login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">Client Login</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
