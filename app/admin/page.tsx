"use client";

import React, { useState, useEffect } from "react";
import AddRentalForm from "@/components/admin/AddRentalForm";
import RentalsTable from "@/components/admin/RentalsTable";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Kovcek = {
  id: string;
  name: string;
  description: string;
};

type Rental = {
  customer: string;
  item: string;
  startDate: string;
  endDate: string;
};

export default function AdminPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [kovcki, setKovcki] = useState<Kovcek[]>([]);

  useEffect(() => {
    async function fetchKovcki() {
      const kovckiCol = collection(db, "kovcki");
      const kovckiSnapshot = await getDocs(kovckiCol);
      const kovckiList = kovckiSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Kovcek, "id">),
      }));
      setKovcki(kovckiList);
    }

    async function fetchRentals() {
      const rentalsCol = collection(db, "rentals");
      const rentalsSnapshot = await getDocs(rentalsCol);
      const rentalsList = rentalsSnapshot.docs.map(doc => ({
        ...(doc.data() as Rental),
      }));
      setRentals(rentalsList);
    }

    fetchKovcki();
    fetchRentals();
  }, []);

  console.log("rentals:", rentals);
console.log("kovcki:", kovcki);

  return (
    <main className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Nadzorna plošča</h1>
      <div className="flex gap-8">
        {/* Levi del: forma + tabela */}
        
        <section className="flex-1">
          <AddRentalForm rentals={rentals} setRentals={setRentals} kovcki={kovcki} />
          <RentalsTable rentals={rentals} kovcki={kovcki} />


        </section>

        {/* Desni del: seznam kovčkov */}
        <aside className="w-72 border-l border-gray-300 pl-6">
          <h2 className="text-2xl font-semibold mb-4">Razpoložljivi kovčki</h2>
          <ul className="list-disc list-inside space-y-2">
            {kovcki.map((k) => (
              <li key={k.id}>
                <strong>{k.name}</strong> ({k.desc})
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
