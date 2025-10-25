"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Rental, Kovcek } from "@/lib/types";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface RentalsTableProps {
  rentals: Rental[];
  kovcki: Kovcek[];
  showArchive?: boolean; // če je true, prikaži gumb Zaključi
}

export default function RentalsTable({ rentals, kovcki, showArchive = true }: RentalsTableProps) {
  const [sortBy, setSortBy] = useState<"startDate" | "endDate" | "id">("startDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedKovcekId, setSelectedKovcekId] = useState<string | null>(null);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null); // Za modal
  const [modalOpen, setModalOpen] = useState(false); // Za odpiranje in zapiranje modala
  const [archiveModal, setArchiveModal] = useState<{open: boolean, rental: Rental | null}>({open: false, rental: null});
  const [archiving, setArchiving] = useState(false);

  // Handle query params from mobile anchors (e.g. ?details=ID or ?archive=ID)
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!searchParams) return;
    const details = searchParams.get("details");
    const archive = searchParams.get("archive");

    // If rentals not yet loaded, wait until they are (rentals in deps)
    if (details) {
      const r = rentals.find((rt) => rt.id === details);
      if (r) {
        setSelectedRental(r);
        setModalOpen(true);
        // remove query param without adding to history — replace with current pathname
        try {
          router.replace(pathname || "/");
        } catch {
          /* ignore */
        }
      }
    }

    if (archive) {
      const r = rentals.find((rt) => rt.id === archive);
      if (r) {
        setArchiveModal({ open: true, rental: r });
        try {
          router.replace(pathname || "/");
        } catch {
          /* ignore */
        }
      }
    }
  }, [searchParams, rentals, router, pathname]);

  const sortedFilteredRentals = [...rentals]
    .filter((rental) => !selectedKovcekId || rental.itemId === selectedKovcekId)
    .sort((a, b) => {
      let valA, valB;
      if (sortBy === "id") {
        valA = parseInt(a.id, 10);
        valB = parseInt(b.id, 10);
      } else {
        valA = new Date(a[sortBy]).getTime();
        valB = new Date(b[sortBy]).getTime();
      }
      return sortDir === "asc" ? valA - valB : valB - valA;
    });

  const handleReset = () => {
    setSortBy("startDate");
    setSortDir("asc");
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

  const openArchiveModal = (rental: Rental) => {
    setArchiveModal({open: true, rental});
  };
  const closeArchiveModal = () => {
    setArchiveModal({open: false, rental: null});
  };
  const handleArchive = async () => {
    if (!archiveModal.rental) return;
    setArchiving(true);
    try {
      // Dodaj v archivedRentals
      await addDoc(collection(db, "archivedRentals"), archiveModal.rental);
      // Izbriši iz rentals
      await deleteDoc(doc(db, "rentals", archiveModal.rental.id));
      window.location.reload(); // Zaenkrat reload, lahko kasneje optimiziramo
    } catch (error) {
      alert("Napaka pri arhiviranju: " + error);
    } finally {
      setArchiving(false);
      closeArchiveModal();
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 overflow-x-auto">
      {/* Legenda */}
      <div className="mb-2 flex flex-wrap gap-4 text-sm text-gray-700 items-center">
        <span><b>ID</b> – številka najema</span>
        <span><b>Stranka</b> – ime stranke</span>
        <span><b>Kovček</b> – naziv kovčka</span>
        <span><b>Začetek</b> – začetek najema</span>
        <span><b>Konec</b> – konec najema</span>
        <span><b>Podrobnosti</b> – več informacij</span>
        {showArchive && <span><b>Zaključi</b> – arhiviraj najem</span>}
      </div>
      <h2 className="text-xl font-semibold mb-4">Pregled najemov</h2>

      {/* Filter & Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <label className="mr-2 text-sm">Sortiraj po:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "startDate" | "endDate" | "id")}
            className="border rounded px-2 py-1"
          >
            <option value="startDate">Začetek najema</option>
            <option value="endDate">Konec najema</option>
            <option value="id">ID</option>
          </select>
          {sortBy === "id" && (
            <button onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
              className="ml-2 px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200">
              {sortDir === "asc" ? "↑" : "↓"}
            </button>
          )}
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
            {showArchive && <th className="py-2 px-4 border-b border-gray-300">Zaključi</th>}
          </tr>
        </thead>
        <tbody>
          {sortedFilteredRentals.length === 0 ? (
            <tr key="empty">
              <td colSpan={showArchive ? 7 : 6} className="text-center py-4 text-gray-500">
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
                  {showArchive && (
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        onClick={() => openArchiveModal(rental)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full shadow-md transition-all duration-200 transform hover:scale-110"
                      >
                        Zaključi
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && selectedRental && (typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 bg-opacity-80 backdrop-blur-lg flex items-center justify-center z-[99999]">
          <div className="bg-gray-300 p-8 rounded-xl shadow-2xl w-11/12 max-w-4xl animate-fade-in text-center">
            <h2 className="text-3xl font-bold mb-6 text-black border-b-2 border-gray-200 pb-4">Podrobnosti najema</h2>

            {/* Podrobnosti najema */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
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
                  <span className="text-black font-bold">{kovcki.find((k) => k.id === selectedRental.itemId)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Opis kovčka:</strong>
                  <span className="text-black font-bold">{kovcki.find((k) => k.id === selectedRental.itemId)?.desc}</span>
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
        </div>, document.body) : null)}

      {/* Modal za arhiviranje */}
      {showArchive && archiveModal.open && archiveModal.rental && (typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 bg-opacity-80 backdrop-blur-lg flex items-center justify-center z-[99999]">
          <div className="bg-gray-300 p-6 rounded-xl shadow-2xl w-11/12 max-w-3xl animate-fade-in text-center">
            <h3 className="text-2xl font-bold mb-4 text-black border-b-2 border-gray-200 pb-3">Zaključi najem</h3>
            <p className="mb-4 text-gray-800 text-base">Ali želiš arhivirati in zaključiti najem <b>ID: {archiveModal.rental.id}</b> za stranko <b>{archiveModal.rental.customer}</b>?</p>
            <div className="flex gap-4 justify-center mt-6">
              <button onClick={handleArchive} disabled={archiving} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow-md text-base disabled:opacity-60 transition-all duration-200 transform hover:scale-105">Da, arhiviraj</button>
              <button onClick={closeArchiveModal} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full font-semibold shadow-md text-base transition-all duration-200 transform hover:scale-105">Ne</button>
            </div>
          </div>
        </div>, document.body) : null)}

      <style jsx global>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
