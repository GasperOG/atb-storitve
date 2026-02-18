import SiteTheme from "../components/SiteTheme";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import IzposojaSection from "../components/sections/IzposojaSection";
import ThuleSection from "../components/sections/ThuleSection";
import MehanikaSection from "../components/sections/MehanikaSection";
import CenikSection from "../components/sections/CenikSection";
import AboutSection from "../components/sections/AboutSection";
import ContactSection from "../components/sections/ContactSection";

export default function HomePage() {
  return (
    <SiteTheme>
      <Header />

      <main className="w-full">
        {/* Hero section with dark bg image overlay */}
        <section className="relative min-h-screen w-full overflow-hidden bg-gray-900">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-xs"
            style={{
              backgroundImage:
                "url(https://thule-trek-spark.lovable.app/assets/hero-bg-BJDRtPxc.jpg)",
            }}
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

          {/* Hero content */}
          <div className="relative z-10">
            <Hero />
          </div>
        </section>

        {/* Izposoja products section */}
        <IzposojaSection />

        {/* Thule brand section */}
        <ThuleSection />

        {/* Mehanika section */}
        <MehanikaSection />

        {/* Pricing section */}
        <CenikSection />

        {/* About / stats section */}
        <AboutSection />

        {/* Contact section */}
        <ContactSection />
      </main>

      <Footer />
    </SiteTheme>
  );
}

