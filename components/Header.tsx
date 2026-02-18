"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const navItems = [
  { label: "Izposoja", href: "#izposoja" },
  { label: "Thule", href: "#thule" },
  { label: "Avtomehanika", href: "#delavnica" },
  { label: "Cenik", href: "#cenik" },
  { label: "O nas", href: "#o-nas" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" onClick={handleLogoClick} className="flex items-center flex-shrink-0" style={{ fontFamily: "var(--font-jakarta), sans-serif" }}>
              <span className={`text-2xl font-extrabold tracking-tight transition-all duration-500 ${
                scrolled ? "text-[#1a56db]" : "text-[#1a56db]"
              } ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
              }`}>ATB</span>
              <span className={`text-2xl font-extrabold tracking-tight ml-1.5 transition-all duration-500 delay-75 ${
                scrolled ? "text-gray-700" : "text-white"
              } ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
              }`}>Storitve</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Glavna navigacija">
              {navItems.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  style={{ transitionDelay: `${i * 60 + 80}ms` }}
                  className={`px-4 py-2 rounded-md text-base font-medium transition-all duration-200 cursor-pointer ${
                    scrolled
                      ? "text-gray-700 hover:text-[#0c2d6b] hover:bg-blue-100"
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  } ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA desktop */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#kontakt"
                onClick={(e) => handleAnchorClick(e, "#kontakt")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-semibold shadow-md hover:bg-[#2563eb] transition-all duration-500 delay-150 cursor-pointer ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Rezervacija
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md"
              aria-label={open ? "Zapri meni" : "Odpri meni"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <svg className={`h-6 w-6 ${scrolled ? "text-gray-800" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className={`h-6 w-6 ${scrolled ? "text-gray-800" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
        <nav className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col pt-20 pb-8 px-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleAnchorClick(e, item.href)}
              className="block py-3 px-2 text-base font-medium text-gray-800 border-b border-gray-100 hover:text-[#0c2d6b] transition-colors cursor-pointer"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-6">
            <a
              href="#kontakt"
              onClick={(e) => handleAnchorClick(e, "#kontakt")}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg bg-[#3b82f6] text-white font-bold text-base shadow-md cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Rezervacija
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
