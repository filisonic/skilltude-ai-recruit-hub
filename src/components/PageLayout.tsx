import { ReactNode } from 'react';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  const isScrolled = useHeaderScroll();

  return (
    <div 
      className={`page-layout ${isScrolled ? 'page-layout--scrolled' : ''} ${className}`}
      style={{
        paddingTop: isScrolled ? 'var(--header-height-scrolled)' : 'var(--header-height-default)',
        transition: 'padding-top 300ms ease'
      }}
    >
      {children}
    </div>
  );
};

export default PageLayout;