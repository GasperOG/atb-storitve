"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Kovcek, Rental } from "@/lib/types";
import RentalsTable from "@/components/admin/RentalsTable";
import { useRouter, usePathname } from "next/navigation";

export default function ArhiviraniNajemiPage() {
  const [kovcki, setKovcki] = useState<Kovcek[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const kovckiSnapshot = await getDocs(collection(db, "kovcki"));
      const rentalsSnapshot = await getDocs(collection(db, "archivedRentals"));

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

  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 animate-fade-in">
        {/* Header + Action buttons */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Arhivirani najemi
          </h1>

          <button
            onClick={() => router.push("/admin")}
            className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-xl shadow transition duration-200 transform hover:scale-110 focus:outline-none"
          >
            ⬅ Nazaj v admin
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6 text-sm">
          Tukaj si lahko ogledaš vse arhivirane (zaključene) najeme kovčkov in jih razvrstiš ali filtriraš.
        </p>

        {/* Iskalnik */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Iskanje po stranki, kovčku ali IDju"
            className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Tabela najemov (desktop) */}
        <div className="hidden sm:block">
          <RentalsTable rentals={filteredRentals} kovcki={kovcki} showArchive={false} />
        </div>

        {/* Mobile cards - match design from Pregled vseh najemov but without 'Zaključi' */}
        <div className="block sm:hidden">
          {filteredRentals.length === 0 ? (
            <div className="text-center text-blue-900 py-8">Ni vnosov.</div>
          ) : (
            <div className="space-y-4">
              {filteredRentals.map((rental) => (
                <div key={rental.id} className="bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 rounded-2xl shadow-lg p-4 flex flex-col gap-2 border border-blue-300 animate-fade-in text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg truncate max-w-[60%]">
                      {rental.customer} <span className="text-blue-200">({rental.id})</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`${pathname || '/admin/arhivirani-najemi'}?details=${rental.id}`)}
                      className="flex-1 bg-blue-400 hover:bg-blue-500 text-white px-3 py-2 rounded-full shadow-md text-base font-semibold transition-all duration-200 text-center"
                      title="Podrobnosti"
                    >
                      Podrobnosti
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
