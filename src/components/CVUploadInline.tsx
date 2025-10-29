import React from 'react';
import { FileCheck, Sparkles, TrendingUp } from 'lucide-react';
import CVUploadForm from '@/components/CVUploadForm';

interface CVUploadInlineProps {
  onSuccess?: (submissionId: string) => void;
  onError?: (error: Error) => void;
}

const CVUploadInline: React.FC<CVUploadInlineProps> = ({ onSuccess, onError }) => {
  return (
    <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-teal-50/50 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-teal-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-8">
            {/* Left Side - Value Proposition */}
            <div className="lg:col-span-2 bg-gradient-to-br from-teal-600 via-cyan-600 to-orange-500 p-6 sm:p-8 lg:p-10 text-white">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">Free Analysis</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                Get Your CV Professionally Analyzed
              </h2>
              
              <p className="text-teal-50 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                Before applying, let our experts review your CV and provide actionable feedback to maximize your chances.
              </p>

              {/* Quick Benefits */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center mt-0.5 sm:mt-1">
                    <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">ATS Optimized</div>
                    <p className="text-xs sm:text-sm text-teal-50">Pass automated screening systems</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center mt-0.5 sm:mt-1">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">Expert Feedback</div>
                    <p className="text-xs sm:text-sm text-teal-50">Detailed analysis within 24-48 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center mt-0.5 sm:mt-1">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">100% Free</div>
                    <p className="text-xs sm:text-sm text-teal-50">No credit card or payment required</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10">
              <CVUploadForm 
                variant="inline" 
                showBenefits={false}
                onSuccess={onSuccess}
                onError={onError}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CVUploadInline;
