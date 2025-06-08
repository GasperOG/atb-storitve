"use client";

import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Rental, Kovcek } from "@/lib/types";
import { checkIfAvailable } from "@/lib/rentals";

type Props = {
  kovcki: Kovcek[];
  rentals: Rental[];
  setRentals: React.Dispatch<React.SetStateAction<Rental[]>>;
};

export default function AddRentalForm({ kovcki, rentals, setRentals }: Props) {
  const [formData, setFormData] = useState<Rental>({
    id: "",
    customer: "",
    itemId: "",
    startDate: "",
    endDate: "",
  });

  const [availableKovcki, setAvailableKovcki] = useState<Kovcek[]>([]);
  const [modalData, setModalData] = useState<{ endDate: string; customer: string } | null>(null);
  const [successModal, setSuccessModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchAvailable = async () => {
      if (formData.startDate && formData.endDate) {
        const filtered: Kovcek[] = [];

        for (const kovcek of kovcki) {
          const result = await checkIfAvailable(kovcek.id, formData.startDate, formData.endDate);
          if (!result.zaseden) {
            filtered.push(kovcek);
          }
        }

        setAvailableKovcki(filtered);
      } else {
        setAvailableKovcki([]);
      }
    };

    fetchAvailable();
  }, [formData.startDate, formData.endDate, kovcki]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("sl-SI");
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.itemId) {
    alert("Prosim izberi kovček.");
    return;
  }

  const result = await checkIfAvailable(formData.itemId, formData.startDate, formData.endDate);
  if (result.zaseden) {
  const { najem } = result;
  setModalData({
    endDate: najem?.endDate || "",
    customer: najem?.customer || "Nepoznano",
  });
  return;
}


  // 👉 Izračunaj naslednji ID
  const maxId = rentals.reduce((max, r) => {
    const idNum = parseInt(r.id || "0");
    return !isNaN(idNum) && idNum > max ? idNum : max;
  }, 0);
  const newId = (maxId + 1).toString();

  const newRentalWithId = {
    ...formData,
    id: newId,
  };

  // ✅ Shrani v Firestore
  await addDoc(collection(db, "rentals"), newRentalWithId);

  // ✅ Posodobi lokalni state
  setRentals([...rentals, newRentalWithId]);

  // 🧹 Počisti
  setSuccessModal(true);
  setFormData({ id: "", customer: "", itemId: "", startDate: "", endDate: "" });
  setAvailableKovcki([]);
};


  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">Dodaj najem</h2>

        <input
          className="w-full border rounded px-3 py-2 mb-3"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />

        {formData.startDate && formData.endDate && (
          <>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
              name="itemId"
              value={formData.itemId}
              onChange={handleChange}
              required
            >
              <option value="">-- Izberi razpoložljiv kovček --</option>
              {availableKovcki.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} ({k.desc})
                </option>
              ))}
            </select>

            <input
              className="w-full border rounded px-3 py-2 mb-3"
              type="text"
              name="customer"
              placeholder="Ime stranke"
              value={formData.customer}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Dodaj najem
            </button>
          </>
        )}
      </form>

      {/* ❌ Modal: Zaseden */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-red-600 mb-3">Kovček ni razpoložljiv</h3>
            <p className="text-gray-700 mb-2">
              Ta kovček je zaseden do{" "}
              <span className="font-semibold text-black">{formatDate(modalData.endDate)}</span>
            </p>
            <p className="text-gray-700">
              Najemnik: <span className="font-semibold text-black">{modalData.customer}</span>
            </p>

            <button
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setModalData(null)}
            >
              Zapri
            </button>
          </div>
        </div>
      )}

      {/* ✅ Modal: Uspešno dodan */}
      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-green-600 mb-3">Najem uspešno dodan</h3>
            <p className="text-gray-700 mb-4">Najem je bil shranjen v sistem.</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setSuccessModal(false)}
            >
              Zapri
            </button>
          </div>
        </div>
      )}
    </>
  );
}
