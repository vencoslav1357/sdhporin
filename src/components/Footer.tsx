import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="bg-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and name */}
          <Link
            href="/"
            aria-label="SDH Pořín – domů"
            className="flex items-center gap-3"
          >
            <Image
              src="/images/logo.png"
              alt="Logo SDH Pořín"
              width={40}
              height={40}
              loading="lazy"
              className="h-10 w-10 rounded-full ring-2 ring-white/10 object-cover"
            />
            <span className="font-bold text-lg">SDH Pořín</span>
          </Link>

          {/* Links */}
          <nav aria-label="Patička – navigace">
            <ul className="flex items-center gap-6 text-sm text-gray-400 list-none m-0 p-0">
              <li>
                <a
                  href="#udalosti"
                  className="hover:text-white transition-colors"
                >
                  Události
                </a>
              </li>
              <li>
                <a
                  href="#akce"
                  className="hover:text-white transition-colors"
                >
                  Akce
                </a>
              </li>
              <li>
                <a
                  href="#o-nas"
                  className="hover:text-white transition-colors"
                >
                  O nás
                </a>
              </li>
              <li>
                <a
                  href="#kontakt"
                  className="hover:text-white transition-colors"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </nav>

          {/* Copyright */}
          <div className="text-sm text-gray-500 text-center md:text-right">
            <p>
              © {currentYear}{" "}
              <span itemProp="name">SDH Pořín</span> – Sbor dobrovolných hasičů Pořín
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Vytvořil Jan Veselý
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
