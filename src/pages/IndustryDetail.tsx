
import React, { useEffect } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IndustryHero from '@/components/industries/IndustryHero';
import IndustryOverview from '@/components/industries/IndustryOverview';
import IndustryRoles from '@/components/industries/IndustryRoles';
import IndustryCta from '@/components/industries/IndustryCta';
import { industriesData } from '@/data/industriesData';

const IndustryDetail = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const location = useLocation();
  const industry = industryId ? industriesData[industryId as keyof typeof industriesData] : null;
  
  useEffect(() => {
    // Scroll to top when component mounts or when location changes
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <IndustryHero industry={industry} />
        <IndustryOverview industry={industry} />
        <IndustryRoles industry={industry} />
        <IndustryCta industry={industry} />
      </main>
      <Footer />
    </div>
  );
};

export default IndustryDetail;
