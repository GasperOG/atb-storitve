"use client";
import React from "react";
import Link from "next/link";
import { useReveal } from "../../hooks/useReveal";

const stats = [
  { value: "500+", label: "Zadovoljnih strank" },
  { value: "15  +", label: "Let izkušenj" },
  { value: "98%", label: "Zadovoljstvo" },
  { value: "1", label: "Lokacija" },
];

export default function AboutSection() {
  const { ref, visible } = useReveal();
  return (
    <section ref={ref} className="py-14 sm:py-20 bg-white" id="o-nas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left */}
          <div className={`transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
              Zanesljivost in kakovost
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
              ATB Storitve je družinsko podjetje, ki se ukvarja z izposojo Thule opreme in
              avtomehaničnimi storitvami. Naša prednost je oseben pristop do vsake stranke ter
              hitro in kakovostno opravljene storitve.
            </p>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Z dolgoletnimi izkušnjami v avtomobilski branži nudimo zanesljive rešitve za
              vaše potovalne in servisne potrebe. Vsako vozilo obravnavamo kot lastno.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-extrabold text-gray-900">{s.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <Link
              href="# kontakt"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-[#1a56db] text-white font-semibold text-sm hover:bg-[#1648c8] transition-colors"
            >
              KONTAKT &amp; REZERVACIJA
            </Link>
          </div>

          {/* Right image */}
          <div className={`relative transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}>
            <div
              className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl bg-cover bg-center shadow-xl"
              style={{
                backgroundImage:
                  "url(https://thule-trek-spark.lovable.app/assets/hero-bg-BJDRtPxc.jpg)",
              }}
            />
            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-green-500 text-white rounded-2xl shadow-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-extrabold">98%</div>
              <div className="text-xs font-medium opacity-80">Zadovoljstvo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
