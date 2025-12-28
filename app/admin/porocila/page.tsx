"use client";

import React, { useEffect, useState } from "react";
import { ThuleItem, Kovcek, Nosilec, ThuleCategory } from "@/lib/types";
import {
  pridobiVseThule,
  updateThule,
  pridobiVseNosilce,
  pridobiVseKovcki,
  updateKovcek,
  updateNosilec,
} from "@/lib/firestore";

type ItemLike = {
  id?: string;
  series?: string;
  model?: string;
  title?: string;
  category?: string;
  quantity?: number;
  variant?: string;
  length?: number;
  note?: string;
  condition?: string;
  purchasePrice?: number;
  sellPrice?: number;
  name?: string;
  desc?: string;
};

export default function Porocila() {
  const [thuleItems, setThuleItems] = useState<ThuleItem[]>([]);
  const [kovcki, setKovcki] = useState<Kovcek[]>([]);
  const [nosilci, setNosilci] = useState<Nosilec[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<ThuleCategory | "kovcki" | "nosilec">("kit");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [editingItem, setEditingItem] = useState<ThuleItem | Kovcek | Nosilec | null>(null);
  const [editingType, setEditingType] = useState<"thule" | "kovcek" | "nosilec" | null>(null);
  const [purchaseInput, setPurchaseInput] = useState("");
  const [sellInput, setSellInput] = useState("");
  const [saving, setSaving] = useState(false);

  // poročila: no add/edit form here — only prices editable

  const categories: Array<{
    id: ThuleCategory;
    label: string;
    emoji: string;
    color: string;
    bgColor: string;
  }> = [
    { id: "kit", label: "Thule Kit", emoji: "📦", color: "bg-blue-700", bgColor: "bg-blue-50" },
    { id: "foot", label: "Noge", emoji: "🦶", color: "bg-green-700", bgColor: "bg-green-50" },
    { id: "bars", label: "Palice", emoji: "🎯", color: "bg-purple-700", bgColor: "bg-purple-50" },
    { id: "bike_stand", label: "Nosilec koles", emoji: "🚲", color: "bg-orange-700", bgColor: "bg-orange-50" },
    { id: "ski_stand", label: "Nosilec smuč", emoji: "⛷️", color: "bg-cyan-700", bgColor: "bg-cyan-50" },
  ];

  const load = async () => {
    setLoading(true);
    try {
      const [t, k, n] = await Promise.all([pridobiVseThule(), pridobiVseKovcki(), pridobiVseNosilce()]);
      setThuleItems(t || []);
      setKovcki(k || []);
      setNosilci(n || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  

  const openPriceModal = (item: ThuleItem | Kovcek | Nosilec, type: "thule" | "kovcek" | "nosilec") => {
    setEditingItem(item);
    setEditingType(type);
    const it = item as ItemLike;
    setPurchaseInput(it.purchasePrice != null ? String(it.purchasePrice) : "");
    setSellInput(it.sellPrice != null ? String(it.sellPrice) : "");
    setModalOpen(true);
  };

  const closeModal = () => {
    // play closing animation then actually unmount
    setModalClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      setEditingItem(null);
      setEditingType(null);
      setPurchaseInput("");
      setSellInput("");
    }, 220);
  };

  const savePrices = async () => {
    if (!editingItem || !editingType) return;
    type PriceUpdates = Partial<{ purchasePrice: number; sellPrice: number }>;
    const updates: PriceUpdates = {};
    if (purchaseInput.trim() !== "") {
      const v = Number(purchaseInput);
      if (!isNaN(v)) updates.purchasePrice = v;
    }
    if (sellInput.trim() !== "") {
      const v = Number(sellInput);
      if (!isNaN(v)) updates.sellPrice = v;
    }
    if (Object.keys(updates).length === 0) return;
    setSaving(true);
    try {
      const device = typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
      if (editingType === "thule") await updateThule((editingItem as ThuleItem).id, updates, { device });
      if (editingType === "kovcek") await updateKovcek((editingItem as Kovcek).id, updates, { device });
      if (editingType === "nosilec") await updateNosilec((editingItem as Nosilec).id, updates, { device });
      await load();
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Napaka pri shranjevanju cen.");
    } finally {
      setSaving(false);
    }
  };

  // No add/edit functions in poročila — only price edits allowed via modal

  const q = search.trim().toLowerCase();
  const filteredThule = thuleItems.filter((it) => {
    if (!q) return true;
    const ii = it as ItemLike;
    const hay = [String(ii.id), ii.series, ii.model, ii.title].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(q);
  });
  const filteredKovcki = kovcki.filter((k) => {
    if (!q) return true;
    return [String(k.id), k.name, k.desc].filter(Boolean).join(' ').toLowerCase().includes(q);
  });
  const filteredNosilci = nosilci.filter((n) => {
    if (!q) return true;
    return [String(n.id), n.name, n.desc].filter(Boolean).join(' ').toLowerCase().includes(q);
  });

  const thuleByCategory: Record<ThuleCategory, ThuleItem[]> = {
    kit: thuleItems.filter((it) => (it as ItemLike).category === 'kit'),
    foot: thuleItems.filter((it) => (it as ItemLike).category === 'foot'),
    bars: thuleItems.filter((it) => (it as ItemLike).category === 'bars'),
    bike_stand: thuleItems.filter((it) => (it as ItemLike).category === 'bike_stand'),
    ski_stand: thuleItems.filter((it) => (it as ItemLike).category === 'ski_stand'),
  };

  const getItemTitle = (item: ThuleItem | Kovcek | Nosilec) => {
    const it: ItemLike = item as ItemLike;
    const stripQuoted = (s: string) => String(s || "").replace(/['"“”].*['"“”]/, "").trim();
    if (it.category === "kit") {
      const candidate = (it.model && `Kit ${it.model}`) || (it.title && stripQuoted(it.title)) || `${it.series || ""} ${it.model || ""}`.trim();
      const base = String(candidate || "").trim();
      return it.quantity ? `${base} (${it.quantity})` : base;
    }
    if (it.category === "foot") {
      const base = `Noge ${it.model || ""}`.trim();
      return it.quantity ? `${base} (${it.quantity})` : base;
    }
    if (it.category === "bars") {
      const base = `Palice ${it.model || (it.length ? it.length + " cm" : "")}`.trim();
      return it.quantity ? `${base} (${it.quantity})` : base;
    }
    if (it.category === "bike_stand" || it.category === "ski_stand") {
      const base = `Nosilec ${it.model || ""}`.trim();
      return it.quantity ? `${base} (${it.quantity})` : base;
    }
    if (it.name) return it.name;
    if (it.title) return stripQuoted(it.title);
    return `${it.series || ""} ${it.model || ""}`.trim();
  };

  const getCategoryLabel = (cat?: string) => {
    switch (cat) {
      case "kit": return "Kit";
      case "foot": return "Noge";
      case "bars": return "Palice";
      case "bike_stand": return "Nosilec koles";
      case "ski_stand": return "Nosilec smuč";
      default: return cat ?? '';
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
            <h1 className="text-3xl font-semibold text-black drop-shadow-sm">Poročila — cene artiklov</h1>
            <a href="/admin" className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-xl shadow">⬅ Nazaj v admin</a>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Išči po šifri, modelu, imenu ali opombi..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); }}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all text-left ${selectedCategory === cat.id ? `${cat.color} text-white shadow-lg` : `${cat.bgColor} text-gray-700 hover:shadow`}`}
                  >
                    <span className="text-lg mr-2">{cat.emoji}</span>
                    {cat.label}
                    <span className="ml-2 text-sm opacity-75">({thuleByCategory[cat.id].length})</span>
                  </button>
                ))}

                <button onClick={() => setSelectedCategory('kovcki')} className={`w-full py-3 px-4 rounded-lg font-medium transition-all text-left ${selectedCategory === 'kovcki' ? 'bg-yellow-700 text-white shadow-lg' : 'bg-yellow-50 text-gray-700 hover:shadow'}`}>
                  <span className="text-lg mr-2">🧳</span> Kovčki <span className="ml-2 text-sm opacity-75">({kovcki.length})</span>
                </button>
              </div>
            </div>

            <main className="lg:col-span-2 space-y-6">
              {loading ? (
                <p className="text-gray-600">Nalagam...</p>
              ) : q ? (
                <div className="space-y-6">
                  {filteredThule.length > 0 && (
                    <section>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Thule artikli ({filteredThule.length})</h4>
                      <div className="space-y-3">
                        {filteredThule.map((item) => (
                          <article key={item.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-700">#{item.id}</div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{getItemTitle(item)}</h3>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {(() => {
                                      const cat = (item as ItemLike).category ?? '';
                                      return (
                                        !['kit','foot','bars','bike_stand','ski_stand'].includes(cat) && <span className="mr-2">{getCategoryLabel(cat)}</span>
                                      );
                                    })()}
                                    {item.condition && <span className="mr-2">Stanje: <span className="font-medium">{item.condition}</span></span>}
                                    {(() => {
                                      const cat = (item as ItemLike).category ?? '';
                                      return (!['kit','foot','bars','bike_stand','ski_stand'].includes(cat) && item.quantity && <span className="mr-2">Količina: <span className="font-medium">{item.quantity}</span></span>);
                                    })()}
                                    {(item as ItemLike).variant && <span className="mr-2">Varianta: <span className="font-medium">{(item as ItemLike).variant}</span></span>}
                                    {(item as ItemLike).length && <span className="mr-2">Dolžina: <span className="font-medium">{(item as ItemLike).length} cm</span></span>}
                                  </div>
                                    {(item as ItemLike).note && <span className="text-sm text-gray-500">Opomba: <span className="font-medium">{(item as ItemLike).note}</span></span>}
                                </div>
                              </div>
                              <div className="flex gap-2 items-center sm:mt-0 mt-3">
                                {(item as ItemLike).purchasePrice !== undefined && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-50 text-green-800 border border-green-100">Nab: {(item as ItemLike).purchasePrice}€</span>}
                                {(item as ItemLike).sellPrice !== undefined && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-800 border border-blue-100">Prod: {(item as ItemLike).sellPrice}€</span>}
                                <button onClick={() => openPriceModal(item, 'thule')} className="px-3 py-2 bg-yellow-400 rounded text-sm">Uredi cene</button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredKovcki.length > 0 && (
                    <section>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Kovčki ({filteredKovcki.length})</h4>
                      <div className="space-y-3">
                        {filteredKovcki.map((k) => (
                          <article key={k.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div>
                                <h3 className="font-semibold text-gray-900">{k.name}</h3>
                                {k.desc && <p className="text-sm text-gray-600">{k.desc}</p>}
                              </div>
                              <div className="flex gap-2 items-center sm:mt-0 mt-3">
                                {(k as ItemLike).purchasePrice !== undefined && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-50 text-green-800 border border-green-100">Nab: {(k as ItemLike).purchasePrice}€</span>}
                                {(k as ItemLike).sellPrice !== undefined && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-800 border border-blue-100">Prod: {(k as ItemLike).sellPrice}€</span>}
                                <button onClick={() => openPriceModal(k, 'kovcek')} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Uredi cene</button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredNosilci.length > 0 && (
                    <section>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Nosilci ({filteredNosilci.length})</h4>
                      <div className="space-y-3">
                        {filteredNosilci.map((n) => (
                          <article key={n.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div>
                                <h3 className="font-semibold text-gray-900">{n.name}</h3>
                                {n.desc && <p className="text-sm text-gray-600">{n.desc}</p>}
                              </div>
                              <div className="flex gap-2 items-center sm:mt-0 mt-3">
                                {(n as ItemLike).purchasePrice !== undefined && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-50 text-green-800 border border-green-100">Nab: {(n as ItemLike).purchasePrice}€</span>}
                                {(n as ItemLike).sellPrice !== undefined && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-800 border border-blue-100">Prod: {(n as ItemLike).sellPrice}€</span>}
                                <button onClick={() => openPriceModal(n, 'nosilec')} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Uredi cene</button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                // Selected category view
                <div>
                  {selectedCategory === 'kovcki' ? (
                    <div className="p-6 rounded-lg bg-yellow-50">
                      <h2 className="text-2xl font-bold mb-4 text-gray-900">Kovčki ({kovcki.length})</h2>
                      <div className="space-y-3">
                        {kovcki.map((k) => (
                          <div key={k.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold text-gray-900">{k.name}</h3>
                                {k.desc && <p className="text-sm text-gray-600">{k.desc}</p>}
                              </div>
                              <div className="flex gap-2 items-center">
                                {(k as ItemLike).purchasePrice !== undefined && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-800 border border-green-100">Nab: {(k as ItemLike).purchasePrice}€</span>}
                                {(k as ItemLike).sellPrice !== undefined && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-800 border border-blue-100">Prod: {(k as ItemLike).sellPrice}€</span>}
                                <button onClick={() => openPriceModal(k, 'kovcek')} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Uredi cene</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : selectedCategory === 'nosilec' ? (
                    <div className="p-6 rounded-lg bg-indigo-50">
                      <h2 className="text-2xl font-bold mb-4 text-gray-900">Nosilci ({nosilci.length})</h2>
                      <div className="space-y-3">
                        {nosilci.map((n) => (
                          <div key={n.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold text-gray-900">{n.name}</h3>
                                {n.desc && <p className="text-sm text-gray-600">{n.desc}</p>}
                              </div>
                              <div className="flex gap-2 items-center">
                                {(n as ItemLike).purchasePrice !== undefined && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-800 border border-green-100">Nab: {(n as ItemLike).purchasePrice}€</span>}
                                {(n as ItemLike).sellPrice !== undefined && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-800 border border-blue-100">Prod: {(n as ItemLike).sellPrice}€</span>}
                                <button onClick={() => openPriceModal(n, 'nosilec')} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Uredi cene</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-lg bg-white">
                      <h2 className="text-2xl font-bold mb-4 text-gray-900">Thule ({thuleItems.length})</h2>
                      <div className="space-y-3">
                          {(thuleByCategory[selectedCategory as ThuleCategory] || []).map((t) => (
                            <article key={t.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-700">#{t.id}</div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{getItemTitle(t)}</h3>
                                    <div className="text-sm text-gray-600 mt-1">
                                      {(() => {
                                        const cat = (t as ItemLike).category ?? '';
                                        return (!['kit','foot','bars','bike_stand','ski_stand'].includes(cat) && <span className="mr-2">{getCategoryLabel(cat)}</span>);
                                      })()}
                                      {t.condition && <span className="mr-2">Stanje: <span className="font-medium">{t.condition}</span></span>}
                                      {(() => {
                                        const cat = (t as ItemLike).category ?? '';
                                        return (!['kit','foot','bars','bike_stand','ski_stand'].includes(cat) && t.quantity && <span className="mr-2">Količina: <span className="font-medium">{t.quantity}</span></span>);
                                      })()}
                                      {(t as ItemLike).variant && <span className="mr-2">Varianta: <span className="font-medium">{(t as ItemLike).variant}</span></span>}
                                      {(t as ItemLike).length && <span className="mr-2">Dolžina: <span className="font-medium">{(t as ItemLike).length} cm</span></span>}
                                    </div>
                                    {(t as ItemLike).note && <span className="text-sm text-gray-500">Opomba: <span className="font-medium">{(t as ItemLike).note}</span></span>}
                                  </div>
                                </div>
                                <div className="flex gap-2 items-center sm:mt-0 mt-3">
                                  {(t as ItemLike).purchasePrice !== undefined && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-800 border border-green-100">Nab: {(t as ItemLike).purchasePrice}€</span>}
                                  {(t as ItemLike).sellPrice !== undefined && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-800 border border-blue-100">Prod: {(t as ItemLike).sellPrice}€</span>}
                                  <div className="flex gap-2">
                                    <button onClick={() => openPriceModal(t, 'thule')} className="px-3 py-1 bg-blue-600 text-white rounded">Uredi cene</button>
                                  </div>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {(modalOpen || modalClosing) && editingItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl ${modalClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
            <h3 className="text-2xl font-bold mb-3">Uredi cene — {(((editingItem as ItemLike).model) || ((editingItem as ItemLike).title) || ((editingItem as ItemLike).name) || ((editingItem as ItemLike).series))}</h3>
            <p className="text-sm text-gray-600 mb-4">Izpolni polja za nabavno in/ali prodajno ceno.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nabavna cena (€)</label>
                <input type="number" value={purchaseInput} onChange={(e) => setPurchaseInput(e.target.value)} placeholder="Nabavna cena" className="w-full px-3 py-2 border rounded-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prodajna cena (€)</label>
                <input type="number" value={sellInput} onChange={(e) => setSellInput(e.target.value)} placeholder="Prodajna cena" className="w-full px-3 py-2 border rounded-full" />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={savePrices} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium">Shrani</button>
                <button onClick={() => closeModal()} className="flex-1 bg-gray-200 px-4 py-2 rounded-full">Prekliči</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 220ms ease-out; }
        @keyframes fade-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(6px); } }
        .animate-fade-out { animation: fade-out 180ms ease-in; }
      `}</style>
    </div>
  );
}
