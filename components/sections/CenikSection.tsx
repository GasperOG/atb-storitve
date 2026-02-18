"use client";
import React from "react";
import { useReveal } from "../../hooks/useReveal";

const plans = [
  {
    title: "Strešni kovček",
    price: "15€",
    unit: "dan",
    features: [
      "Thule kovček 300–600L",
      "Montaža vključena",
      "Zaklepanje vključeno",
      "Prevzem in vračilo v delavnici",
    ],
    popular: false,
      color: "bg-gray-900",
    },
  {
    title: "Komplet (kovček + nosilci)",
    price: "25€",
    unit: "dan",
    features: [
      "Thule kovček + prečni nosilci",
      "Montaža vključena",
      "Za vse tipe vozil",
      "Cenejše kot posamezno",
    ],
    popular: true,
    color: "bg-gray-900",
  },
  {
    title: "Nosilci za kolesa",
    price: "12€",
    unit: "dan",
    features: [
      "Za 1–4 kolesa",
      "Streha ali vlečna kljuka",
      "Enostavna uporaba",
      "Varnostno zaklepanje",
    ],
    popular: false,
    color: "bg-gray-900",
  },
];

export default function CenikSection() {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className="py-14 sm:py-20 bg-gray-50" id="cenik">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-14 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            Transparentne cene
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Jasne cene brez skritih stroškov. Za daljša obdobja ponujamo ugodne popuste.
          </p>
          
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-start">
          {plans.map((plan, i) => (
            <div
              key={plan.title}
              style={{ transitionDelay: `${i * 120 + 150}ms` }}
              className={`relative rounded-2xl overflow-hidden shadow-md transition-all duration-700 ${
                plan.popular ? "ring-2 ring-[#1a56db]" : ""
              } ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-[#1a56db] text-white text-xs font-bold px-3 py-1 rounded-full">
                  NAJBOLJ PRILJUBLJEN
                </div>
              )}
              <div className={`${plan.color} px-6 py-8 text-white`}>
                <div className="text-sm font-medium opacity-80 mb-2">{plan.title}</div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-base opacity-70 mb-1">/ {plan.unit}</span>
                </div>
              </div>

              <div className="bg-white px-6 py-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="h-4 w-4 text-[#1a56db] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                
                
              </div>
              
            </div>
            
          ))}
        </div>

        <p style={{ transitionDelay: "450ms" }} className={`text-center text-sm text-gray-400 mt-8 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}>
          * Cene so informativne. Za mehanične storitve nas kontaktirajte za individualno ponudbo.
        </p>

      </div>
    </section>
  );
}
