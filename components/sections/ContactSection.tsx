"use client";
import React from "react";
import { useReveal } from "../../hooks/useReveal";

const contactItems = [
  {
    icon: "📞",
    label: "Telefon",
    value: "+386 70 870 595",
    href: "tel:+38670870595",
    sub: "Pokličite zdaj",
  },
  {
    icon: "📧",
    label: "E-pošta",
    value: "atb.storitve@gmail.com",
    href: "mailto:atb.storitve@gmail.com",
    sub: "Pišite nam",
  },
  {
    icon: "📍",
    label: "Lokacija",
    value: "Vanča vas 54, 9251 Tišina",
    href: "https://www.google.com/maps/place//data=!4m2!3m1!1s0x476f156c1c96feb5:0x6425a8a8925a1ae1?sa=X&ved=1t:8290&ictx=111",
    sub: "Prevzem in vračilo opreme",
  },
  {
    icon: "🕐",
    label: "Delovni čas",
    value: "Pon–Pet: po dogovoru",
    href: "#kontakt",
    sub: "Po dogovoru tudi sobota",
  },
];

export default function ContactSection() {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className="py-14 sm:py-20 bg-gray-50" id="kontakt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-14 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            Rezervirajte ali nas kontaktirajte
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Pokličite nas ali pošljite sporočilo. Z veseljem vam pomagamo pri izbiri opreme
            ali terminu za servis.
          </p>
        </div>

        {/* Contact grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10 sm:mb-12">
          {contactItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
              className={`bg-gray-800 rounded-2xl p-4 sm:p-6 hover:bg-gray-700 transition-all duration-700 group ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">{item.icon}</div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {item.label}
              </div>
              <div className="text-white font-semibold text-xs sm:text-sm mb-1 group-hover:text-blue-400 transition-colors">
                {item.value}
              </div>
              <div className="text-gray-400 text-xs">{item.sub}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
