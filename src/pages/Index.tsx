

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import CVUploadHero from '@/components/CVUploadHero';
import ServiceOverview from '@/components/ServiceOverview';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonial from '@/components/Testimonial';
import IndustriesGrid from '@/components/IndustriesGrid';
import BlogPreview from '@/components/BlogPreview';
import CtaSection from '@/components/CtaSection';
import FloatingAnt from '@/components/FloatingAnt';

const Index = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
          <Hero />
          <CVUploadHero />
          <ServiceOverview />
          <WhyChooseUs />
          <Testimonial />
          <IndustriesGrid />
          <BlogPreview />
          <CtaSection />
        </main>
      </PageLayout>
      <Footer />
      <FloatingAnt />
    </div>
  );
};

export default Index;
