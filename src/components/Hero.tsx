export default function Hero() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background – plynulý červený gradient do bílé */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #b91c1c 0%, #dc2626 25%, #ef4444 45%, #f87171 60%, #fca5a5 72%, #fecaca 82%, #fee2e2 90%, #ffffff 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <img
            src="/images/logo.png"
            alt="SDH Pořín Logo"
            className="h-24 w-24 md:h-32 md:w-32 rounded-full ring-4 ring-white/20 shadow-2xl"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight mb-4">
          SDH Pořín
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto mb-10">
          Dobrovolný hasičský sbor · od roku 1899
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#udalosti"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:scale-105"
          >
            Události
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:scale-105"
          >
            Kontaktujte nás
          </a>
        </div>
      </div>
    </section>
  );
}
