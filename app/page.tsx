"use client";

import { useState } from "react";
import SearchRentals from "../components/admin/SearchRentals";

export default function Home() {
  const [availableSuitcases, setAvailableSuitcases] = useState<string[] | null>(null);

  // Tu kasneje dodamo funkcijo, ki bo poizvedovala Firebase in nastavljala rezultate
  const handleSearch = () => {
    // Za test bo zaenkrat samo placeholder
    setAvailableSuitcases([
      "Kovček A",
      "Kovček B",
      "Kovček C",
    ]);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dobrodošli na ATB storitve</h1>

      <SearchRentals onSearch={handleSearch} />

      {availableSuitcases && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Prosti kovčki:</h2>
          <ul className="list-disc list-inside">
            {availableSuitcases.map((suitcase, i) => (
              <li key={i}>{suitcase}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
