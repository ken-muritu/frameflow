import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/sections/PricingSection";

export const metadata = {
  title: "Pricing — FrameFlow",
  description: "Start free, upgrade when you&apos;re ready. FrameFlow plans for individuals, teams, and developers.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#08080F] text-white">
      <Navbar />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-3">Pricing</p>
          <h1 className="text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="max-w-lg mx-auto text-white/50">
            Start free forever. Upgrade when your content needs grow.
            No surprises, no hidden fees.
          </p>
        </div>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
