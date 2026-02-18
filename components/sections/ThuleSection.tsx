"use client";
import React from "react";
import { useReveal } from "../../hooks/useReveal";

const highlights = [
  {
    icon: "🛡️",
    title: "Varnost",
    desc: "Certificirani izdelki po najvišjih standardih",
  },
  {
    icon: "⭐",
    title: "Kakovost",
    desc: "Premium materiali z dolgo življenjsko dobo",
  },
  {
    icon: "🏔️",
    title: "Avantura",
    desc: "Oprema za vsako aktivnost in destinacijo",
  },
];

const products = [
  { name: "Strešni kovčki", detail: "Od 300L do 600L" },
  { name: "Prečni nosilci", detail: "Univerzalni sistemi" },
  { name: "Nosilci za kolesa", detail: "Streha & kljuka" },
  { name: "Dodatki", detail: "Torbice & organizerji" },
];

export default function ThuleSection() {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className="py-14 sm:py-20 bg-gray-50" id="thule">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left */}
          <div className={`transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
              Thule – Oprema za aktivno življenje
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Thule je svetovno znana švedska blagovna znamka, specializirana za transport in
              shranjevanje opreme. Njihovi izdelki združujejo varnost, kakovost in inovativen
              dizajn za vse vaše avanture.
            </p>

            {/* Highlights */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {highlights.map((h) => (
                <div key={h.title} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-base sm:text-lg">
                    {h.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{h.title}</div>
                    <div className="text-gray-500 text-sm">{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Product tags */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {products.map((p) => (
                <div key={p.name} className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm">
                  <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{p.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image */}
          <div className={`relative transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}>
            <div
              className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl bg-cover bg-center shadow-xl"
              style={{ backgroundImage: "url(/thule_vse.png)" }}
            />
            <div className="absolute -bottom-4 -left-2 sm:-left-4 bg-white rounded-2xl shadow-lg p-3 sm:p-4 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1a56db] font-bold text-sm">T</div>
              <div>
                <div className="text-xs font-semibold text-gray-900">Thule uradna oprema</div>
                <div className="text-xs text-gray-400">Premium kakovost</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
