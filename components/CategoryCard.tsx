"use client";
import React from "react";

type Props = {
  title: string;
  description?: string;
  accent?: string;
};

export default function CategoryCard({ title, description, accent }: Props) {
  return (
    <article className="border rounded-lg p-4 shadow-sm" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="h-40 rounded-md mb-3" style={{ backgroundColor: accent || "var(--color-muted)" }} />
      <h3 className="font-semibold text-lg">{title}</h3>
      {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
    </article>
  );
}
