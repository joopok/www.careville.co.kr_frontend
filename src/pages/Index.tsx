import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServiceMenuSection from "@/components/ServiceMenuSection";
import StatsSection from "@/components/StatsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import HomeCleaningSection from "@/components/HomeCleaningSection";
import BusinessCleaningSection from "@/components/BusinessCleaningSection";
import SpecialCleaningSection from "@/components/SpecialCleaningSection";
import ReviewsSection from "@/components/ReviewsSection";
import NoticeSection from "@/components/NoticeSection";
import ContactSection from "@/components/ContactSection";
import AdditionalSection from "@/components/AdditionalSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServiceMenuSection />
      <HomeCleaningSection />
      <BusinessCleaningSection />
      <SpecialCleaningSection />
      <StatsSection />
      <ReviewsSection />
      <HowItWorksSection />
      <NoticeSection />
      <ContactSection />
      <AdditionalSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
