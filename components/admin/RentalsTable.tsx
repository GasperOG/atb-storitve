"use client";

import React, { useState } from "react";
import { Rental, Kovcek } from "@/lib/types";

interface RentalsTableProps {
  rentals: Rental[];
  kovcki: Kovcek[];
}

export default function RentalsTable({ rentals, kovcki}: RentalsTableProps) {
  const [sortBy, setSortBy] = useState<"startDate" | "endDate">("startDate");
  const [selectedKovcekId, setSelectedKovcekId] = useState<string | null>(null);

  const sortedFilteredRentals = [...rentals]
    .filter((rental) => !selectedKovcekId || rental.itemId === selectedKovcekId)
    .sort((a, b) => {
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      return dateA.getTime() - dateB.getTime();
    });

  const handleReset = () => {
    setSortBy("startDate");
    setSelectedKovcekId(null);
  };



  return (
    <div className="max-w-6xl mx-auto mt-8 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Pregled najemov</h2>

      {/* Filter & Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <label className="mr-2 text-sm">Sortiraj po:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "startDate" | "endDate")}
            className="border rounded px-2 py-1"
          >
            <option value="startDate">Začetek najema</option>
            <option value="endDate">Konec najema</option>
          </select>
        </div>

        <div>
          <label className="mr-2 text-sm">Filtriraj po kovčku:</label>
          <select
            value={selectedKovcekId || ""}
            onChange={(e) => setSelectedKovcekId(e.target.value || null)}
            className="border rounded px-2 py-1"
          >
            <option value="">Vsi kovčki</option>
            {kovcki.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name} ({k.desc})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
        >
          Ponastavi filtre
        </button>

        
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-200 rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border-b border-gray-300">ID</th>
            <th className="py-2 px-4 border-b border-gray-300">Stranka</th>
            <th className="py-2 px-4 border-b border-gray-300">Kovček</th>
            <th className="py-2 px-4 border-b border-gray-300">Začetek</th>
            <th className="py-2 px-4 border-b border-gray-300">Konec</th>
          </tr>
        </thead>
        <tbody>
  {sortedFilteredRentals.length === 0 ? (
    <tr key="empty">
      <td colSpan={5} className="text-center py-4 text-gray-500">
        Ni vnosov.
      </td>
    </tr>
  ) : (
    sortedFilteredRentals.map((rental) => {
      const kovcek = kovcki.find((k) => k.id === rental.itemId);
      return (
        <tr key={rental.id}>
          <td className="py-2 px-4 border-b border-gray-200">{rental.id}</td>
          <td className="py-2 px-4 border-b border-gray-200">{rental.customer}</td>
          <td className="py-2 px-4 border-b border-gray-200">
            {kovcek ? `${kovcek.name} (${kovcek.desc})` : "Nepoznano"}
          </td>
          <td className="py-2 px-4 border-b border-gray-200">{rental.startDate}</td>
          <td className="py-2 px-4 border-b border-gray-200">{rental.endDate}</td>
        </tr>
      );
    })
  )}
</tbody>

      </table>
    </div>
  );
}
