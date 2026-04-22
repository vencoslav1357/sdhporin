"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "#udalosti", label: "Události" },
  { href: "#akce", label: "Akce" },
  { href: "#o-nas", label: "O nás" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Hlavní navigace"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            aria-label="SDH Pořín – domů"
            className="flex items-center gap-3 group"
          >
            <Image
              src="/images/logo.png"
              alt="Logo SDH Pořín"
              width={48}
              height={48}
              priority
              className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-red-500/20 group-hover:ring-red-500/50 transition-all"
            />
            <span
              className={`font-bold text-lg md:text-xl tracking-tight transition-colors ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
            >
              SDH Pořín
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-red-500/10 hover:text-red-600 ${
                    scrolled ? "text-gray-700" : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={isOpen}
            aria-controls="mobilni-menu"
          >
            <div className="flex flex-col gap-1.5" aria-hidden="true">
              <span
                className={`block w-6 h-0.5 rounded-full transition-all duration-300 ${
                  scrolled ? "bg-gray-900" : "bg-white"
                } ${isOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 rounded-full transition-all duration-300 ${
                  scrolled ? "bg-gray-900" : "bg-white"
                } ${isOpen ? "opacity-0 scale-0" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 rounded-full transition-all duration-300 ${
                  scrolled ? "bg-gray-900" : "bg-white"
                } ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobilni-menu"
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3 space-y-1 list-none m-0">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-red-50 hover:text-red-600 transition-all"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
