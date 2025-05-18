
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ServiceOverview from '@/components/ServiceOverview';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonial from '@/components/Testimonial';
import IndustriesGrid from '@/components/IndustriesGrid';
import BlogPreview from '@/components/BlogPreview';
import CtaSection from '@/components/CtaSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ServiceOverview />
        <WhyChooseUs />
        <Testimonial />
        <IndustriesGrid />
        <BlogPreview />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
