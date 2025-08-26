import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServiceMenuSection from "@/components/ServiceMenuSection";
import Footer from "@/components/Footer";
import HomeCleaningSection from "@/components/HomeCleaningSection";
import BusinessCleaningSection from "@/components/BusinessCleaningSection";
import SpecialCleaningSection from "@/components/SpecialCleaningSection";
import AirConditionerSection from "@/components/AirConditionerSection";
import ReviewsSection from "@/components/ReviewsSection";
import NoticeSection from "@/components/NoticeSection";
import ContactSection from "@/components/ContactSection";
import AdditionalSection from "@/components/AdditionalSection";
import PricingSection from "@/components/PricingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <Header />
      <HeroSection />
      <ServiceMenuSection />
      <AirConditionerSection />
      <HomeCleaningSection />
      <BusinessCleaningSection />
      <SpecialCleaningSection />
      <PricingSection />
      <ReviewsSection />
      <NoticeSection />
      <ContactSection />
      <AdditionalSection />
      <Footer />
    </div>
  );
};

export default Index;
