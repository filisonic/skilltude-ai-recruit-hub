import { useState, useEffect } from 'react';

/**
 * Custom hook to manage header scroll state and synchronize it across components
 * This ensures the Header and PageLayout components stay in sync
 */
export const useHeaderScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      
      // Update CSS custom properties for layout system synchronization
      const root = document.documentElement;
      if (scrolled) {
        root.style.setProperty('--current-header-height', 'var(--header-height-scrolled)');
        document.body.classList.add('header-scrolled');
      } else {
        root.style.setProperty('--current-header-height', 'var(--header-height-default)');
        document.body.classList.remove('header-scrolled');
      }
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up CSS properties on unmount
      document.documentElement.style.removeProperty('--current-header-height');
      document.body.classList.remove('header-scrolled');
    };
  }, []);

  return isScrolled;
};