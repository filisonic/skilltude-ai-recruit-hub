import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/PageLayout';
import CVUploadForm from '@/components/CVUploadForm';

const UploadCV = () => {
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
        <main className="flex-grow bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <CVUploadForm
              variant="hero"
              showBenefits={true}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        </main>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default UploadCV;
