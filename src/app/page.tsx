import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import Platforms from "@/components/sections/Platforms";
import PricingSection from "@/components/sections/PricingSection";
import CTA from "@/components/sections/CTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08080F] text-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <Platforms />
        <PricingSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
