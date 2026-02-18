"use client";
import React from "react";
import CategoryCard from "./CategoryCard";

type Item = { id: string; title: string; description?: string; accent?: string };

export default function CategoryGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((it) => (
        <CategoryCard key={it.id} title={it.title} description={it.description} accent={it.accent} />
      ))}
    </div>
  );
}
