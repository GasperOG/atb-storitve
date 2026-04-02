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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              onClick={handleLogoClick} 
              className="flex items-center flex-shrink-0 relative z-50 group" 
              style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
            >
              <span className={`text-2xl font-extrabold tracking-tight transition-all duration-500 hover:scale-110 ${
                scrolled ? "text-[#1a56db]" : "text-[#1a56db]"
              } ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
              }`}>ATB</span>
              <span className={`text-2xl font-extrabold tracking-tight ml-1.5 transition-all duration-500 delay-75 group-hover:translate-x-1 ${
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
                  className={`group relative px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 cursor-pointer ${
                    scrolled
                      ? "text-gray-700 hover:text-[#1a56db] hover:bg-blue-50"
                      : "text-white/90 hover:text-white hover:bg-white/20"
                  } ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                  } hover:scale-105 active:scale-95`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Animated underline */}
                  <span className={`absolute bottom-1 left-1/2 h-0.5 w-0 group-hover:w-3/4 -translate-x-1/2 transition-all duration-300 ${
                    scrolled ? "bg-[#1a56db]" : "bg-white"
                  }`} />
                </a>
              ))}
            </nav>

            {/* CTA desktop */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#kontakt"
                onClick={(e) => handleAnchorClick(e, "#kontakt")}
                className={`group relative overflow-hidden flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white text-sm font-bold shadow-lg hover:shadow-2xl transition-all duration-300 delay-150 cursor-pointer ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                } hover:scale-105 hover:-translate-y-0.5 active:scale-95`}
              >
                {/* Shine effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="relative z-10">Rezervacija</span>
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md relative z-50"
              aria-label={open ? "Zapri meni" : "Odpri meni"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <svg className={`h-6 w-6 ${scrolled ? "text-gray-800" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
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
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop with blur */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm transition-all duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)} 
        />
        
        {/* Slide-in menu panel */}
        <nav 
          className={`absolute top-20 right-4 w-[280px] bg-gradient-to-br from-[#0c2d6b] via-[#1a56db] to-[#2563eb] rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out ${
            open ? "translate-x-0 opacity-100" : "translate-x-[320px] opacity-0"
          }`}
        >
          {/* Navigation items */}
          <div className="py-4 px-3 space-y-1">
            {navItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                style={{ 
                  transitionDelay: open ? `${idx * 40}ms` : "0ms",
                  animation: open ? `slideIn 0.3s ease-out ${idx * 40}ms both` : "none"
                }}
                className="group flex items-center gap-2.5 py-2.5 px-3 text-sm font-semibold text-white/90 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-200">
                  {idx === 0 && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {idx === 3 && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {idx === 4 && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <span className="flex-1">{item.label}</span>
                <svg className="w-3.5 h-3.5 text-white/50 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}

            {/* Rezervacija CTA - Highlighted */}
            <a
              href="#kontakt"
              onClick={(e) => handleAnchorClick(e, "#kontakt")}
              style={{ 
                transitionDelay: open ? `${navItems.length * 40}ms` : "0ms",
                animation: open ? `slideIn 0.3s ease-out ${navItems.length * 40}ms both` : "none"
              }}
              className="group flex items-center gap-2.5 py-3 px-3 mt-2 text-sm font-bold text-[#1a56db] bg-white rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a56db]/10 group-hover:bg-[#1a56db]/20 transition-all duration-200">
                <svg className="w-4 h-4 text-[#1a56db]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="flex-1">Rezervacija</span>
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#1a56db] group-hover:bg-[#2563eb] transition-all duration-200">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
        </nav>
      </div>

      {/* Add keyframe animation */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
