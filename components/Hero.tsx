"use client";
import React from "react";

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6">
      {/* Heading */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-4xl mx-auto">
        Izposoja Thule opreme &amp;{" "}
        <span className="text-blue-400">avtomehanika</span>
      </h1>

      {/* Subtext */}
      <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-2">
        Strešni kovčki, prečni nosilci, nosilci za kolesa in profesionalna mehanična
        delavnica – vse na enem mestu.
      </p>

      {/* CTAs */}
      <div className="mt-8 sm:mt-10 flex flex-col xs:flex-row sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none">
        <button
          onClick={() => handleScroll("#izposoja")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1a56db] text-white rounded-lg text-base font-semibold shadow-lg hover:bg-[#1648c8] transition-colors duration-200"
        >
          Rezerviraj zdaj
        </button>
        <button
          onClick={() => handleScroll("#cenik")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-lg text-base font-semibold hover:bg-white/20 transition-colors duration-200"
        >
          Cenik
        </button>
      </div>
    </div>
  );
}
