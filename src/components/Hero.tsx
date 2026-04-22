import Image from "next/image";

export default function Hero() {
  return (
    <section
      aria-label="Úvod – SDH Pořín"
      className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background – plynulý červený gradient do bílé (v CSS třídě pro lepší paint) */}
      <div aria-hidden="true" className="absolute inset-0 hero-gradient" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Logo SDH Pořín – Sbor dobrovolných hasičů Pořín"
            width={128}
            height={128}
            priority
            fetchPriority="high"
            className="h-24 w-24 md:h-32 md:w-32 rounded-full ring-4 ring-white/20 shadow-2xl object-cover"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight mb-4">
          SDH Pořín
          <span className="sr-only">
            {" "}– Sbor dobrovolných hasičů Pořín, Dolní Hořice, založen 1899
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto mb-10">
          Dobrovolný hasičský sbor · od roku 1899
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#udalosti"
            aria-label="Přejít na sekci Události"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:scale-105"
          >
            Události
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
          <a
            href="#kontakt"
            aria-label="Přejít na sekci Kontakt"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:scale-105"
          >
            Kontaktujte nás
          </a>
        </div>
      </div>
    </section>
  );
}
