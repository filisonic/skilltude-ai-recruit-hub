
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Industries from "./pages/Industries";
import IndustryDetail from "./pages/IndustryDetail";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import ClientLogin from "./pages/ClientLogin";
import HireCandidate from "./pages/HireCandidate";
import UploadCV from "./pages/UploadCV";
import Demo from "./pages/Demo";
import Careers from "./pages/Careers";
import CRM from "./pages/CRM";
import SpeakerRegistration from "./pages/SpeakerRegistration";
import SpeakersDirectory from "./pages/SpeakersDirectory";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboardEnhanced from "./pages/AdminDashboardEnhanced";
import AdminArticleEditor from "./pages/AdminArticleEditor";
import AdminCVManagement from "./pages/AdminCVManagement";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import TalentAcquisition from "./pages/services/TalentAcquisition";
import RecruitmentAutomation from "./pages/services/RecruitmentAutomation";
import AIPoweredMatching from "./pages/services/AIPoweredMatching";
import CandidateExperience from "./pages/services/CandidateExperience";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/industries/:industryId" element={<IndustryDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/speaker-registration" element={<SpeakerRegistration />} />
          <Route path="/speakers-directory" element={<SpeakersDirectory />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboardEnhanced />} />
          <Route path="/admin/cv-management" element={<AdminCVManagement />} />
          <Route path="/admin/articles/create" element={<AdminArticleEditor />} />
          <Route path="/admin/articles/edit/:id" element={<AdminArticleEditor />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/hire-candidate" element={<HireCandidate />} />
          <Route path="/upload-cv" element={<UploadCV />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/services/talent-acquisition" element={<TalentAcquisition />} />
          <Route path="/services/recruitment-automation" element={<RecruitmentAutomation />} />
          <Route path="/services/ai-powered-matching" element={<AIPoweredMatching />} />
          <Route path="/services/candidate-experience" element={<CandidateExperience />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
