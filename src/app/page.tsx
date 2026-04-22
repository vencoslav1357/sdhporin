import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";
import EventsSection from "@/components/EventsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const SITE_URL = "https://sdhporin.cz";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Domů",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Aktuality",
      item: `${SITE_URL}/#udalosti`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Připravované akce",
      item: `${SITE_URL}/#akce`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "O nás",
      item: `${SITE_URL}/#o-nas`,
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Kontakt",
      item: `${SITE_URL}/#kontakt`,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-white">
        <Navbar />
        <main id="hlavni-obsah">
          <Hero />
          <NewsSection />
          <EventsSection />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
