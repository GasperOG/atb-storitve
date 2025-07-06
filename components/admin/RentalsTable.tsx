"use client";

import React, { useState } from "react";
import { Rental, Kovcek } from "@/lib/types";

interface RentalsTableProps {
  rentals: Rental[];
  kovcki: Kovcek[];
}

export default function RentalsTable({ rentals, kovcki }: RentalsTableProps) {
  const [sortBy, setSortBy] = useState<"startDate" | "endDate">("startDate");
  const [selectedKovcekId, setSelectedKovcekId] = useState<string | null>(null);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null); // Za modal
  const [modalOpen, setModalOpen] = useState(false); // Za odpiranje in zapiranje modala

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

  const openModal = (rental: Rental) => {
    setSelectedRental(rental);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRental(null);
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
          className="bg-gray-400 hover:bg-gray-500 text-sm px-3 py-1 rounded-full transform duration-200 transform hover:scale-110"
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
            <th className="py-2 px-4 border-b border-gray-300">Podrobnosti</th>
          </tr>
        </thead>
        <tbody>
          {sortedFilteredRentals.length === 0 ? (
            <tr key="empty">
              <td colSpan={6} className="text-center py-4 text-gray-500">
                Ni vnosov.
              </td>
            </tr>
          ) : (
            sortedFilteredRentals.map((rental, index) => {
              const kovcek = kovcki.find((k) => k.id === rental.itemId);
              return (
                <tr
                  key={rental.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-all`}
                >
                  <td className="py-2 px-4 border-b border-gray-200">{rental.id}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{rental.customer}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {kovcek ? `${kovcek.name} (${kovcek.desc})` : "Nepoznano"}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">{rental.startDate}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{rental.endDate}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      onClick={() => openModal(rental)}
                     className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-full shadow-md transition-all duration-200 transform hover:scale-110"
                    >
                      Podrobnosti
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Modal */}
{modalOpen && selectedRental && (
  <div className="fixed inset-0 bg-opacity-70 backdrop-blur-lg flex items-center justify-center z-50 transition-all duration-500">
    <div className="bg-gray-300 p-10 rounded-xl shadow-2xl w-11/12 max-w-3xl transform scale-100 opacity-100 transition-all duration-500 ease-out">
      <h2 className="text-3xl font-bold mb-6 text-black border-b-2 border-gray-200 pb-4">
        Podrobnosti najema
      </h2>

      {/* Podrobnosti najema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <strong className="text-gray-700">ID:</strong>
            <span className="text-black font-bold">{selectedRental.id}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Stranka:</strong>
            <span className="text-black font-bold">{selectedRental.customer}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Naslov:</strong>
            <span className="text-black font-bold">{selectedRental.address}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Telefon:</strong>
            <span className="text-black font-bold">{selectedRental.phone}</span>
          </div>

          <div className="flex justify-between">
            <strong className="text-gray-700">Začetek najema:</strong>
            <span className="text-black font-bold">{selectedRental.startDate}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Konec najema:</strong>
            <span className="text-black font-bold">{selectedRental.endDate}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Lastni kovček:</strong>
            <span className="text-black font-bold">{selectedRental.hasOwnKovcek ? "Da" : "Ne"}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Lastni nosilci:</strong>
            <span className="text-black font-bold">{selectedRental.hasOwnNosilci ? "Da" : "Ne"}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <strong className="text-gray-700">Kovček:</strong>
            <span className="text-black font-bold">
              {kovcki.find((k) => k.id === selectedRental.itemId)?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Opis kovčka:</strong>
            <span className="text-black font-bold">
              {kovcki.find((k) => k.id === selectedRental.itemId)?.desc}
            </span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Thule Kit:</strong>
            <span className="text-black font-bold">{selectedRental.thuleKit || "Ni na voljo"}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Thule Noge:</strong>
            <span className="text-black font-bold">{selectedRental.thuleNoge || "Ni na voljo"}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Thule Palice:</strong>
            <span className="text-black font-bold">{selectedRental.thulePalice || "Ni na voljo"}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-700">Številka ključa:</strong>
            <span className="text-black font-bold">{selectedRental.keyNumber || "Ni na voljo"}</span>
          </div>
        </div>
      </div>

      {/* Gumb Zapri */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={closeModal}
          className="px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
        >
          Zapri
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
