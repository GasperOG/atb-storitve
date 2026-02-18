"use client";
import React from "react";

type Props = { image?: string; blur?: "sm" | "md" | "lg" };

export default function BackgroundSimple({ image = "/hero.jpg", blur = "md" }: Props) {
  const blurClass = blur === "sm" ? "blur-sm" : blur === "lg" ? "blur-lg" : "blur-md";

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className={`absolute inset-0 bg-cover bg-center transform-gpu ${blurClass}`}
        style={{ backgroundImage: `url('${image}')`, willChange: "filter, transform", transform: "translateY(var(--bg-parallax, 0px))" }}
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
