export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and name */}
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="SDH Pořín"
              className="h-10 w-10 rounded-full ring-2 ring-white/10"
            />
            <span className="font-bold text-lg">SDH Pořín</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#udalosti" className="hover:text-white transition-colors">
              Události
            </a>
            <a href="#akce" className="hover:text-white transition-colors">
              Akce
            </a>
            <a href="#o-nas" className="hover:text-white transition-colors">
              O nás
            </a>
            <a href="#kontakt" className="hover:text-white transition-colors">
              Kontakt
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500 text-center md:text-right">
            <p>© {currentYear} SDH Pořín</p>
            <p className="text-gray-600 text-xs mt-1">
              Vytvořil Jan Veselý
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
