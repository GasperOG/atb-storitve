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
  const [deleteModal, setDeleteModal] = useState<{open: boolean, kovcek: Kovcek | null}>({open: false, kovcek: null});
  const [searchTerm, setSearchTerm] = useState("");

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
    // open edit modal on all screen sizes for consistent UX
    setEditModalOpen(true);
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
    setEditModalOpen(false);
    fetchKovcki();
  };

  const openDeleteModal = (k: Kovcek) => setDeleteModal({open: true, kovcek: k});
  const closeDeleteModal = () => setDeleteModal({open: false, kovcek: null});
  const confirmDelete = async () => {
    if (!deleteModal.kovcek) return;
    await deleteDoc(doc(db, "kovcki", deleteModal.kovcek.id));
    closeDeleteModal();
    fetchKovcki();
  };

  const [editModalOpen, setEditModalOpen] = useState(false);

  const filteredKovcki = kovcki.filter((k) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.trim().toLowerCase();
    return k.name.toLowerCase().includes(q) || k.id.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 py-10 px-4 text-blue-900">
  <div className="max-w-6xl mx-auto bg-white/90 rounded-2xl shadow-lg p-6 sm:p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-2">
          <h1 className="text-3xl font-semibold text-black drop-shadow-sm">
            Urejanje kovčkov
          </h1>
          <Link
            href="/admin"
            className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-xl shadow transition duration-200 transform hover:scale-110 focus:outline-none"
          >
            ⬅ Nazaj v admin
          </Link>
        </div>
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Iskanje kovčka po imenu ali ID"
            className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Dodaj nov kovček */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">Ime</label>
            <input
              type="text"
              className="w-full border border-blue-300 rounded-full px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="npr. MotionL"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">Opis</label>
            <input
              type="text"
              className="w-full border border-blue-300 rounded-full px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="npr. N234"
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-2 rounded-xl shadow transition duration-200 transform hover:scale-110 focus:outline-none"
          >
            Dodaj kovček
          </button>
        </div>
        {/* Pregled obstoječih kovčkov */}
        {loading ? (
          <p className="text-gray-600">Nalaganje...</p>
        ) : kovcki.length === 0 ? (
          <p className="text-gray-600">Ni kovčkov.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            {filteredKovcki.map((k) => (
              <div key={k.id} className="bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 rounded-2xl shadow-lg p-8 flex flex-col justify-between border border-blue-300 text-white transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div>
                  <div className="flex items-start justify-between mb-3 gap-4">
                    <div className="flex-1">
                      <div className="text-xl font-bold leading-tight whitespace-normal break-words">{k.name}</div>
                      <div className="text-sm text-blue-200 mt-1">#{k.id}</div>
                    </div>
                  </div>
                  <div className="text-sm text-blue-100 mb-3 whitespace-normal break-words">{k.desc}</div>
                </div>
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => startEditing(k)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 font-medium"
                  >
                    Uredi
                  </button>
                  <button
                    onClick={() => openDeleteModal(k)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 font-medium"
                  >
                    Izbriši
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Modal za izbris kovčka */}
        {deleteModal.open && deleteModal.kovcek && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-11/12 max-w-md animate-fade-in text-center">
              <h3 className="text-2xl font-bold mb-4 text-black border-b-2 border-gray-200 pb-2">Izbriši kovček</h3>
              <p className="mb-6 text-gray-800 text-lg">
                Ali res želiš izbrisati kovček <b>{deleteModal.kovcek.name}</b> ({deleteModal.kovcek.desc})?
              </p>
              <div className="flex gap-6 justify-center mt-6">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-md text-lg transition-all duration-200 transform hover:scale-105"
                >
                  Da, izbriši
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full font-semibold shadow-md text-lg transition-all duration-200 transform hover:scale-105"
                >
                  Prekliči
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit modal for mobile */}
        {editModalOpen && editingId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-11/12 max-w-md animate-fade-in text-center">
              <h3 className="text-2xl font-bold mb-4 text-black border-b-2 border-gray-200 pb-2">Uredi kovček</h3>
              <div className="space-y-3 text-left">
                <label className="text-sm font-medium text-gray-700">Ime</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full border rounded-full px-3 py-2" />
                <label className="text-sm font-medium text-gray-700">Opis</label>
                <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full border rounded-full px-3 py-2" />
              </div>
              <div className="flex gap-4 justify-center mt-6">
                <button onClick={saveEdit} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow-md">Shrani</button>
                <button onClick={() => { setEditModalOpen(false); cancelEditing(); }} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full font-semibold shadow-md">Prekliči</button>
              </div>
            </div>
          </div>
        )}
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
    </div>
  );
}
