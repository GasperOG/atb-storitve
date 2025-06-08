"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // prilagodi svojo pot
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Kovcek {
  id: string;
  name: string;
  desc: string;
}

export default function KovckiPage() {
  const [kovcki, setKovcki] = useState<Kovcek[]>([]);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchKovcki = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "kovcki"));
    const data = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => Number(a.id) - Number(b.id)) as Kovcek[];
    setKovcki(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchKovcki();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;

    // Najdi naslednji številčni ID
    const nextId = kovcki.length > 0
      ? (Math.max(...kovcki.map(k => Number(k.id))) + 1).toString()
      : "1";

    await setDoc(doc(db, "kovcki", nextId), {
      name: newName.trim(),
      desc: newDesc.trim(),
    });

    setNewName("");
    setNewDesc("");
    fetchKovcki();
  };

  const handleUpdate = async (id: string, name: string, desc: string) => {
    await updateDoc(doc(db, "kovcki", id), { name, desc });
    fetchKovcki();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Si prepričan, da želiš izbrisati kovček?")) {
      await deleteDoc(doc(db, "kovcki", id));
      fetchKovcki();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Urejanje kovčkov</h1>

      {/* Dodaj nov kovček */}
      <div className="mb-6 flex gap-2 items-end">
        <div>
          <label className="block text-sm font-medium">Ime</label>
          <input
            className="border p-2 w-full rounded"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="npr. MotionL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Opis</label>
          <input
            className="border p-2 w-full rounded"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="npr. N234"
          />
        </div>
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Dodaj
        </button>
      </div>

      {/* Pregled obstoječih kovčkov */}
      {loading ? (
        <p>Nalaganje...</p>
      ) : kovcki.length === 0 ? (
        <p>Ni kovčkov.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Ime</th>
              <th className="border px-3 py-2">Opis</th>
              <th className="border px-3 py-2">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {kovcki.map((k, index) => (
              <tr key={k.id} className="even:bg-gray-50">
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">
                  <input
                    defaultValue={k.name}
                    className="w-full border px-2 py-1 rounded"
                    onBlur={(e) =>
                      handleUpdate(k.id, e.target.value, k.desc)
                    }
                  />
                </td>
                <td className="border px-3 py-2">
                  <input
                    defaultValue={k.desc}
                    className="w-full border px-2 py-1 rounded"
                    onBlur={(e) =>
                      handleUpdate(k.id, k.name, e.target.value)
                    }
                  />
                </td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleDelete(k.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Izbriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
