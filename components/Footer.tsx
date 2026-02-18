"use client";
import Link from "next/link";
import React from "react";

const navLinks = [
  { label: "Izposoja", href: "#izposoja" },
  { label: "Thule", href: "#thule" },
  { label: "Avtomehanika", href: "#delavnica" },
  { label: "Cenik", href: "#cenik" },
  { label: "O nas", href: "#o-nas" },
  { label: "Kontakt", href: "#kontakt" },
];

function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href.startsWith("#")) {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {/* Brand */}
          <div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-flex items-center mb-4 cursor-pointer"
              style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
            >
              <span className="text-2xl font-extrabold text-[#1a56db]">ATB</span>
              <span className="text-2xl font-extrabold text-white ml-1.5">Storitve</span>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed">
              Izposoja Thule opreme in profesionalna mehanična delavnica. Vaš zanesljiv partner.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <div className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navigacija</div>
            <ul className="space-y-2">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleAnchor(e, item.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Kontakt</div>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="tel:+38670870595" className="hover:text-white transition-colors">📞 +386 70 870 595</a>
              </li>
              <li>
                <a href="mailto:atb.storitve@gmail.com" className="hover:text-white transition-colors">📧 atb.storitve@gmail.com</a>
              </li>
              <li>📍 Vanča vas 54, 9251 Tišina</li>
              <li>🕐 Pon–Pet: 8:00–17:00</li>
            </ul>

            
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <nav className="flex flex-wrap gap-4 text-xs text-gray-500">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleAnchor(e, item.href)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="text-xs text-gray-600">
            <Link href="/admin" className="hover:text-gray-400 transition-colors">© {new Date().getFullYear()} ATB Storitve</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
