"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Link from "next/link";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

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

  const startEditing = (k: Kovcek) => {
    setEditingId(k.id);
    setEditName(k.name);
    setEditDesc(k.desc);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditDesc("");
  };

  const saveEdit = async () => {
    if (!editName.trim()) return alert("Ime ne sme biti prazno!");
    if (!editingId) return;

    await updateDoc(doc(db, "kovcki", editingId), {
      name: editName.trim(),
      desc: editDesc.trim(),
    });
    setEditingId(null);
    setEditName("");
    setEditDesc("");
    fetchKovcki();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Si prepričan, da želiš izbrisati kovček?")) {
      await deleteDoc(doc(db, "kovcki", id));
      fetchKovcki();
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 p-8 text-gray-900">
    <div className="max-w-4xl mx-auto bg-gray-100 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-2">
        <h1 className="text-3xl font-semibold">
          Urejanje kovčkov
        </h1>
        <Link
          href="/admin"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm shadow font-semibold"
        >
          Nazaj v admin
        </Link>
      </div>

        
        
        {/* Dodaj nov kovček */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">Ime</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="npr. MotionL"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">Opis</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="npr. N234"
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition"
          >
            Dodaj
          </button>
        </div>

        {/* Pregled obstoječih kovčkov */}
        {loading ? (
          <p className="text-gray-600">Nalaganje...</p>
        ) : kovcki.length === 0 ? (
          <p className="text-gray-600">Ni kovčkov.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-gray-300">
            <table className="w-full table-auto border-collapse text-gray-900 text-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border border-gray-300 px-4 py-2 w-12">#</th>
                  <th className="border border-gray-300 px-4 py-2">Ime</th>
                  <th className="border border-gray-300 px-4 py-2">Opis</th>
                  <th className="border border-gray-300 px-4 py-2 w-36 text-center">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {kovcki.map((k, index) => {
                  const isEditing = editingId === k.id;
                  return (
                    <tr key={k.id} className="even:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={isEditing ? editName : k.name}
                          disabled={!isEditing}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`w-full border rounded px-2 py-1 transition focus:outline-none ${
                            isEditing
                              ? "border-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white text-gray-900"
                              : "border-gray-300 bg-gray-100 cursor-not-allowed text-gray-500"
                          }`}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={isEditing ? editDesc : k.desc}
                          disabled={!isEditing}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className={`w-full border rounded px-2 py-1 transition focus:outline-none ${
                            isEditing
                              ? "border-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white text-gray-900"
                              : "border-gray-300 bg-gray-100 cursor-not-allowed text-gray-500"
                          }`}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center flex gap-2 justify-center">
                        {isEditing ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md shadow-sm transition"
                              title="Shrani spremembe"
                            >
                              Shrani
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md shadow-sm transition"
                              title="Prekliči urejanje"
                            >
                              Prekliči
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(k)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1 rounded-md shadow-sm transition"
                              title="Uredi kovček"
                            >
                              Uredi
                            </button>
                            <button
                              onClick={() => handleDelete(k.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-sm transition"
                              title="Izbriši kovček"
                            >
                              Izbriši
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
