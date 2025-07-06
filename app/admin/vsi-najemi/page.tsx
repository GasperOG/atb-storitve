"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Kovcek, Rental } from "@/lib/types";
import RentalsTable from "@/components/admin/RentalsTable";
import Link from "next/link";

export default function NajemiPage() {
  const [kovcki, setKovcki] = useState<Kovcek[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Za iskanje

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10">
        {/* Header + Action buttons */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Pregled vseh najemov
          </h1>

          <Link
            href="/admin"
            className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-xl shadow transition duration-200 transform hover:scale-110"
          >
            ⬅ Nazaj v admin
          </Link>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6 text-sm">
          Tukaj si lahko ogledaš vse oddane najeme kovčkov in jih razvrstiš po datumu ali filtriraš po posameznem kovčku.
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

        {/* Tabela najemov */}
        <RentalsTable rentals={filteredRentals} kovcki={kovcki}  />
      </div>
    </div>
  );
}
