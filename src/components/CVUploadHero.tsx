import React from 'react';
import { CheckCircle, Sparkles, TrendingUp, FileCheck, Award } from 'lucide-react';
import CVUploadForm from '@/components/CVUploadForm';

interface CVUploadHeroProps {
  onSuccess?: (submissionId: string) => void;
  onError?: (error: Error) => void;
}

const CVUploadHero: React.FC<CVUploadHeroProps> = ({ onSuccess, onError }) => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-teal-50 via-white to-orange-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-teal-700 mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Free Professional CV Analysis</span>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-4">
            <span className="text-gray-900">Get Your CV</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-500">
              Professionally Analyzed
            </span>
            <br />
            <span className="text-gray-900">For Free</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Upload your CV and receive expert feedback within 24-48 hours. 
            Discover how to optimize your CV for ATS systems and stand out to recruiters.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12 max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">ATS Optimization</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Ensure your CV passes automated screening systems used by 90% of companies
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Expert Feedback</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Get professional insights on content, structure, and formatting from industry experts
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Actionable Tips</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Receive specific, practical suggestions to immediately improve your CV's impact
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-lg group">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Detailed Analysis</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Get a comprehensive score and breakdown of your CV's strengths and weaknesses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-12">
            <CVUploadForm 
              variant="hero" 
              showBenefits={false}
              onSuccess={onSuccess}
              onError={onError}
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 sm:mt-10 md:mt-12 text-center px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">100% Free Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">24-48 Hour Turnaround</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Confidential & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">No Credit Card Required</span>
            </div>
          </div>
        </div>

        {/* Call-to-Action Text */}
        <div className="mt-12 sm:mt-14 md:mt-16 text-center max-w-3xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Get Your CV Analyzed?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            In today's competitive job market, your CV needs to be perfect. Our analysis helps you 
            identify gaps, optimize for ATS systems, and present your experience in the most compelling way. 
            <span className="font-semibold text-gray-800"> Join hundreds of job seekers who've improved their CVs and landed their dream jobs.</span>
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default CVUploadHero;
