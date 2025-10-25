"use client";

import React, { useEffect, useState } from "react";
import AddRentalForm from "@/components/admin/AddRentalForm";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Kovcek, Rental } from "@/lib/types";
import Link from "next/link";

export default function DodajNajemPage() {
  const [kovcki, setKovcki] = useState<Kovcek[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loadingKovcki, setLoadingKovcki] = useState(true);
  const [loadingRentals, setLoadingRentals] = useState(true);

  useEffect(() => {
    // Fetch kovcki first so the form can render as soon as kovcki are available.
    const fetchKovcki = async () => {
      try {
        const kovckiSnapshot = await getDocs(collection(db, "kovcki"));
        const fetchedKovcki: Kovcek[] = kovckiSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Kovcek[];
        setKovcki(fetchedKovcki);
      } catch (e) {
        console.error("Error fetching kovcki:", e);
      } finally {
        setLoadingKovcki(false);
      }
    };

    // Fetch rentals in parallel but don't block rendering of the form.
    const fetchRentals = async () => {
      try {
        const rentalsSnapshot = await getDocs(collection(db, "rentals"));
        const fetchedRentals: Rental[] = rentalsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Rental[];
        setRentals(fetchedRentals);
      } catch (e) {
        console.error("Error fetching rentals:", e);
      } finally {
        setLoadingRentals(false);
      }
    };

    fetchKovcki();
    fetchRentals();
  }, []);

  // Only block rendering until kovcki are loaded — rentals can arrive afterwards.
  if (loadingKovcki) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 text-black-800 font-semibold">
        Nalaganje kovčkov...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 py-10 px-4 text-blue-900">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-lg p-6 sm:p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-2">
          <h1 className="text-3xl font-semibold text-black drop-shadow-sm">
            Dodaj najem
          </h1>
          <Link
            href="/admin"
            className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-xl shadow transition duration-200 transform hover:scale-110 focus:outline-none"
            prefetch={false}
          >
            ⬅ Nazaj v admin
          </Link>
        </div>
        <AddRentalForm kovcki={kovcki} rentals={rentals} setRentals={setRentals} />
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
