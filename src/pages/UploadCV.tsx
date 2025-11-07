import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import CVUploadHero from '@/components/CVUploadHero';

const UploadCV = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSuccess = (submissionId: string) => {
    console.log('CV uploaded successfully:', submissionId);
  };

  const handleError = (error: Error) => {
    console.error('CV upload error:', error);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageLayout>
        <main className="flex-grow">
          <CVUploadHero 
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default UploadCV;
