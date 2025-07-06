"use client";

import React, { useEffect, useState } from "react";
import AddRentalForm from "@/components/admin/AddRentalForm";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Kovcek, Rental } from "@/lib/types";

export default function DodajNajemPage() {
  const [kovcki, setKovcki] = useState<Kovcek[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 text-black-800 font-semibold">
        Nalaganje...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 py-10 text-blue-900">
      <AddRentalForm kovcki={kovcki} rentals={rentals} setRentals={setRentals} />
    </div>
  );
}
