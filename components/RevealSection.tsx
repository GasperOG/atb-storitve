"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  id?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  bgImage?: string;
  children?: React.ReactNode;
};

export default function RevealSection({ id, title, subtitle, ctaLabel, ctaHref, bgImage, children }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className="relative w-full overflow-hidden"
      style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      <div className="absolute inset-0 bg-black/25" aria-hidden />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 md:py-36 lg:py-44">
        <div className={`max-w-3xl mx-auto text-center transform transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">{title}</h2>
          {subtitle && <p className="mt-4 text-lg text-white/90">{subtitle}</p>}

          <div className="mt-8 flex items-center justify-center gap-4">
            {ctaHref && ctaLabel && (
              <a href={ctaHref} className="inline-block px-6 py-3 bg-[color:var(--color-accent)] text-white rounded-full font-semibold shadow-md hover:translate-y-[-2px] transition-transform">
                {ctaLabel}
              </a>
            )}
            {children}
          </div>
        </div>
      </div>
      <div className="h-32 md:h-40 lg:h-48" aria-hidden />
    </section>
  );
}
