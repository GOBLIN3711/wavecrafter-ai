import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { MusicPlayerSection } from "@/components/MusicPlayerSection";
import { WhyCustomSection } from "@/components/WhyCustomSection";
import { PricingSection } from "@/components/PricingSection";
import { GlobalSection } from "@/components/GlobalSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <MusicPlayerSection />
        <WhyCustomSection />
        <PricingSection />
        <GlobalSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
