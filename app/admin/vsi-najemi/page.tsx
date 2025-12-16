"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Kovcek, Rental } from "@/lib/types";
import RentalsTable from "@/components/admin/RentalsTable";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function NajemiPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [kovcki, setKovcki] = useState<Kovcek[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Za iskanje
  const [sortOption, setSortOption] = useState("start_asc");

  useEffect(() => {
    const fetchData = async () => {
      const kovckiSnapshot = await getDocs(collection(db, "kovcki"));
      const rentalsSnapshot = await getDocs(collection(db, "rentals"));

      const fetchedKovcki: Kovcek[] = kovckiSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Kovcek[];

      const fetchedRentals: Rental[] = rentalsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Rental[];

      setKovcki(fetchedKovcki);
      setRentals(fetchedRentals);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 text-white text-lg font-semibold">
        Nalaganje podatkov...
      </div>
    );
  }

  // Funkcija za iskanje
  const filteredRentals = rentals.filter((rental) => {
    const search = searchTerm.toLowerCase();
    const customerMatch = rental.customer.toLowerCase().includes(search);
    const kovcekMatch =
      kovcki.find((k) => k.id === rental.itemId)?.name.toLowerCase().includes(search) ?? false;
    const rentalIdMatch = rental.id.toLowerCase().includes(search);

    return customerMatch || kovcekMatch || rentalIdMatch;
  });

  // sortiraj rezultate po izbrani opciji (ne mutiramo originalnega polja)
  const sortedRentals = filteredRentals.slice().sort((a, b) => {
    switch (sortOption) {
      case "start_asc":
        return (Date.parse(a.startDate) || 0) - (Date.parse(b.startDate) || 0);
      case "start_desc":
        return (Date.parse(b.startDate) || 0) - (Date.parse(a.startDate) || 0);
      case "id_asc":
        return (Number(a.id) || 0) - (Number(b.id) || 0);
      case "id_desc":
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 animate-fade-in">
        {/* Header + Action buttons */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Pregled vseh najemov
          </h1>
          <Link
            href="/admin"
            className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-xl shadow transition duration-200 transform hover:scale-110 focus:outline-none"
          >
            ⬅ Nazaj v admin
          </Link>
        </div>
        <p className="text-gray-600 mb-6 text-sm">
          Tukaj si lahko ogledaš vse oddane najeme kovčkov in jih razvrstiš po datumu ali filtriraš po posameznem kovčku.
        </p>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Iskanje po stranki, kovčku ali IDju"
            className="w-full sm:flex-1 max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-56 p-3 border border-gray-300 rounded-lg shadow-sm bg-white"
            aria-label="Sortiraj najeme"
          >
            <option value="start_asc">Datum začetka (najstarejši)</option>
            <option value="start_desc">Datum začetka (najnovejši)</option>
            <option value="id_asc">ID (najmanjši)</option>
            <option value="id_desc">ID (največji)</option>
          </select>
        </div>
        {/* Lista najemov kot kartice (desktop + mobile) */}
        {/* RentalsTable ostane priklopljen in skrit, da lahko upravlja modale preko query paramov */}
        <div className="hidden">
          <RentalsTable rentals={filteredRentals} kovcki={kovcki} />
        </div>

        {sortedRentals.length === 0 ? (
          <div className="text-center text-blue-900 py-8">Ni vnosov.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 animate-fade-in">
            {sortedRentals.map((rental) => {
              const kovcekName = kovcki.find((k) => k.id === rental.itemId)?.name || rental.itemId;
              return (
                <div key={rental.id} className="bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 rounded-2xl shadow-lg p-8 flex flex-col justify-between border border-blue-300 text-white transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
                  <div>
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <div className="flex-1">
                        <div className="text-2xl font-bold leading-tight whitespace-normal break-words text-white">{rental.customer}</div>
                        <div className="text-sm text-slate-200 mt-1">#{rental.id} • {kovcekName}</div>
                      </div>
                    </div>
                    <div className="text-base mb-3 whitespace-normal break-words text-white">
                      <span className="font-medium text-slate-200">Začetek:</span> <span className="ml-1">{rental.startDate}</span>
                      <br />
                      <span className="font-medium text-slate-200">Konec:</span> <span className="ml-1">{rental.endDate}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => router.push(`${pathname || '/admin/vsi-najemi'}?details=${rental.id}`)}
                      className="flex-1 bg-blue-400 hover:bg-blue-500 text-white px-4 py-3 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 font-medium text-lg"
                    >
                      Podrobnosti
                    </button>
                    <button
                      onClick={() => router.push(`${pathname || '/admin/vsi-najemi'}?archive=${rental.id}`)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 font-medium text-lg"
                    >
                      Zaključi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
