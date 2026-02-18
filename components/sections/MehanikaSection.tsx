"use client";
import React from "react";
import Link from "next/link";
import { useReveal } from "../../hooks/useReveal";

const services = [
  { icon: "🔧", title: "Splošni servis", desc: "Redni servisi in vzdrževanje vozila" },
  { icon: "💻", title: "Diagnostika", desc: "Računalniška diagnostika napak" },
  { icon: "🛢️", title: "Menjava olja", desc: "Kvalitetna olja in filtri" },
  { icon: "🛑", title: "Zavore", desc: "Zamenjava zavornih ploščic in diskov" },
  { icon: "⚙️", title: "Menjalnik", desc: "Popravila menjalnikov in sklopk" },
  { icon: "✅", title: "Tehnični pregled", desc: "Priprava na tehnični pregled" },
];

export default function MehanikaSection() {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className="py-14 sm:py-20 bg-white" id="delavnica">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left image */}
          <div className={`relative order-2 lg:order-1 transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}>
            <div
              className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl bg-cover bg-center shadow-xl"
              style={{ backgroundImage: "url(/garaza_slika.png)" }}
            />
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-[#1a56db] text-white rounded-2xl shadow-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-extrabold">15+</div>
              <div className="text-xs font-medium opacity-80">Let izkušenj</div>
            </div>
          </div>

          {/* Right content */}
          <div className={`order-1 lg:order-2 transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
              Profesionalna avtomehanika
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Zaupajte vaše vozilo izkušenim mehanikom. Hitro, zanesljivo in po poštenih cenah.
            </p>

            {/* Services grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {services.map((s) => (
                <div key={s.title} className="flex items-start gap-2 sm:gap-3">
                  <div className="text-xl sm:text-2xl flex-shrink-0">{s.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{s.title}</div>
                    <div className="text-xs text-gray-400">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/#kontakt"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-[#1a56db] text-white font-semibold text-sm hover:bg-[#1648c8] transition-colors"
              >
                Naroči se na servis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
