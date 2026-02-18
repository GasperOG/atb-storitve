"use client";
import React from "react";
import Link from "next/link";
import { useReveal } from "../../hooks/useReveal";

const products = [
  {
    title: "Thule kovčki",
    description:
      "Prostorni strešni kovčki za varno shranjevanje prtljage na daljših potovanjih. Različne velikosti za vsako potrebo.",
    features: ["300–600 litrov", "Enostavna montaža", "Zaklepanje"],
    image: "/thule_kovcek.png",
    href: "#kontakt",
  },
  {
    title: "Prečni nosilci",
    description:
      "Univerzalni in vozilno-specifični prečni nosilci za varen transport na strehi vašega vozila.",
    features: ["Univerzalni", "Za vsak avto", "Certificirani"],
    image: "/thule_nosilec.png",
    href: "#kontakt",
    
  },
  {
    title: "Nosilci za kolesa",
    description:
      "Kakovostni nosilci za kolo – na streho ali na vlečno kljuko. Preprost in varen transport koles.",
    features: ["1–4 kolesa", "Streha ali kljuka", "Hitra montaža"],
    image: "thule_kolo_nosilec.png",
    href: "#kontakt",
  },
];

export default function IzposojaSection() {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className="py-14 sm:py-20 bg-white" id="izposoja">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-14 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            Izposoja Thule opreme
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Izberite opremo za vaše naslednje potovanje. Kvalitetna Thule oprema po dostopnih cenah.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {products.map((product, i) => (
            <div
              key={product.title}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-700 flex flex-col ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                <p className="text-gray-500 text-sm mb-4 flex-1">{product.description}</p>

                {/* Features */}
                <ul className="space-y-1 mb-6">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="h-4 w-4 text-[#1a56db] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={product.href}
                  className="w-full text-center py-3 rounded-lg bg-[#1a56db] text-white font-semibold text-sm hover:bg-[#1648c8] transition-colors"
                >
                  Rezerviraj
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
