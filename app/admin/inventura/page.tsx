"use client";

import React, { useEffect, useState } from "react";
import { ThuleItem, ThuleCategory } from "@/lib/types";
import { 
  pridobiVseThule, dodajThule, updateThule, deleteThule 
} from "@/lib/firestore";

// Model options per category
const modelsByCategory: Record<ThuleCategory, string[]> = {
  kit: ["1***", "3***", "4***", "5***", "6***", "7***"],
  foot: ["753", "754", "755", "757", "7017", "7104", "7105", "7106", "7205", "7206"],
  bars: ["SquareBar", "AeroBar", "WingBar", "WingBar Evo", "WingBar Edge", "ProBar", "SlideBar"],
  bike_stand: ["591", "598", "532", "927", "926", "296", "298", "939", "933", "934"],
  ski_stand: ["7324", "7326", "725", "726", "748", "604"],
};

export default function InventuraPage() {
  const [thuleItems, setThuleItems] = useState<ThuleItem[]>([]);
  const [thuleLoading, setThuleLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ThuleCategory>("kit");
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formModel, setFormModel] = useState("");
  const [formKitNumber, setFormKitNumber] = useState(""); // NEW - za kit številko
  const [formVariant, setFormVariant] = useState(""); // for 'foot' (stari/novi)
  const [formLength, setFormLength] = useState(""); // for 'bars' length
  const [formCondition, setFormCondition] = useState<"NOVO" | "RABLJENO" | "NEPOPOLNO">("NOVO");
  const [formNote, setFormNote] = useState("");
  const [formQuantity, setFormQuantity] = useState<number>(1);
  const [globalSearch, setGlobalSearch] = useState("");
  const [formSaving, setFormSaving] = useState(false);
  const [formEditId, setFormEditId] = useState<string | null>(null);



  // Load Thule items
  const loadThule = async () => {
    setThuleLoading(true);
    try {
      const data = await pridobiVseThule();
      setThuleItems(data);
    } catch (err) {
      console.error("Napaka pri nalaganju Thule predmetov:", err);
      setThuleItems([]);
    } finally {
      setThuleLoading(false);
    }
  };

  useEffect(() => {
    loadThule();
  }, []);

  // Group items by category
  const thuleByCategory: Record<ThuleCategory, ThuleItem[]> = {
    kit: thuleItems.filter(item => item.category === "kit"),
    foot: thuleItems.filter(item => item.category === "foot"),
    bars: thuleItems.filter(item => item.category === "bars"),
    bike_stand: thuleItems.filter(item => item.category === "bike_stand"),
    ski_stand: thuleItems.filter(item => item.category === "ski_stand"),
  };

  // Items to display: when globalSearch is present, search across all items
  const searchTerm = globalSearch.trim().toLowerCase();
  const filteredItems = searchTerm
    ? thuleItems.filter((it) => {
        const hay = `${it.title} ${it.series || ""} ${it.model || ""} ${it.note || ""} ${it.condition || ""}`.toLowerCase();
        return hay.includes(searchTerm);
      })
    : thuleByCategory[selectedCategory];

  const getItemTitle = (item: ThuleItem) => {
    if (item.category === "kit") return item.title;
    if (item.category === "foot") return `Noge ${item.model || ""}`.trim();
    if (item.category === "bars") return `Palice ${item.model || (item.length ? item.length + " cm" : "")}`.trim();
    if (item.category === "bike_stand" || item.category === "ski_stand") return `Nosilec ${item.model || ""}`.trim();
    return item.title;
  };

  // Handle add/edit thule item
  const handleAddThule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validacija za KIT
    if (selectedCategory === "kit") {
      if (!formModel.trim()) {
        alert("Serija kita mora biti izbrana!");
        return;
      }
      if (!formKitNumber.trim()) {
        alert("Številka kita ne sme biti prazna!");
        return;
      }
      
      // Validacija dolžine
      if (formKitNumber.trim().length !== 4) {
        alert("Številka kita mora imeti točno 4 znake!");
        return;
      }
      
      // Validacija prve številke
      const seriesPrefix = formModel.charAt(0); // npr. "1" iz "1***"
      const kitFirstChar = formKitNumber.trim().charAt(0);
      if (kitFirstChar !== seriesPrefix) {
        alert(`Številka kita mora začeti z ${seriesPrefix} (izbrana serija: ${formModel})!`);
        return;
      }
    } else {
      if (!formModel.trim()) {
        alert("Model mora biti izbran!");
        return;
      }
    }

    setFormSaving(true);
    try {
      // Build payload without undefined fields to avoid Firestore errors
      const basePayload: Omit<ThuleItem, "id"> = {
        category: selectedCategory,
        title: selectedCategory === "kit" 
          ? `Kit ${formKitNumber}${formNote ? ` "${formNote}"` : ""}`
          : `${formModel}${formNote ? ` "${formNote}"` : ""}`,
        series: formModel,
        model: selectedCategory === "kit" ? formKitNumber : formModel,
        condition: formCondition,
        note: formNote || "",
        quantity: formEditId ? Math.max(1, formQuantity) : 1,
      };

      if (selectedCategory === "foot" && formVariant) basePayload.variant = formVariant;
      if (selectedCategory === "bars" && formLength) basePayload.length = formLength;

      const newItem: Omit<ThuleItem, "id"> = basePayload;

      if (formEditId) {
        await updateThule(formEditId, newItem);
      } else {
        await dodajThule(newItem);
      }

      await loadThule();
      handleCancelForm();
      setShowForm(false);
    } catch (err) {
      console.error("Napaka pri shranjevanju:", err);
      alert("Napaka pri shranjevanju!");
    } finally {
      setFormSaving(false);
    }
  };

  // Handle edit
  const handleEditThule = (item: ThuleItem) => {
    setFormEditId(item.id);
    setSelectedCategory(item.category);
    setFormModel(item.series || "");
    setFormKitNumber(item.model || "");
    setFormVariant(item.variant || "");
    setFormLength(item.length || "");
    setFormCondition(item.condition || "NOVO");
    setFormNote(item.note || "");
    setFormQuantity(item.quantity || 1);
    setShowForm(true);
  };

  // Handle delete
  const handleDeleteThule = async (id: string) => {
    if (confirm("Res želiš izbrisati ta predmet?")) {
      try {
        await deleteThule(id);
        await loadThule();
      } catch (err) {
        console.error("Napaka pri brisanju:", err);
        alert("Napaka pri brisanju!");
      }
    }
  };

  // Handle cancel edit
  const handleCancelForm = () => {
    setFormEditId(null);
    setFormModel("");
    setFormKitNumber("");
    setFormCondition("NOVO");
    setFormNote("");
    setFormQuantity(1);
    setFormVariant("");
    setFormLength("");
  };

  // Category config
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-lg p-6 sm:p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-2">
            <h1 className="text-3xl font-semibold text-black drop-shadow-sm">
              Inventura
            </h1>
            <a
              href="/admin"
              className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-xl shadow transition duration-200 transform hover:scale-110"
            >
              ⬅ Nazaj v admin
            </a>
          </div>
          {/* Global search */}
          <div className="mb-4">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Išči po šifri, modelu, imenu ali opombi..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Category Display only */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowForm(false);
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all text-left ${
                    selectedCategory === cat.id
                      ? `${cat.color} text-white shadow-lg`
                      : `${cat.bgColor} text-gray-700 hover:shadow`
                  }`}
                >
                  <span className="text-lg mr-2">{cat.emoji}</span>
                  {cat.label}
                  <span className="ml-2 text-sm opacity-75">
                    ({thuleByCategory[cat.id].length})
                  </span>
                </button>
              ))}

              <button
                onClick={() => {
                  setShowForm(true);
                  handleCancelForm();
                  setFormEditId(null);
                }}
                className="w-full py-3 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all text-center block mt-4"
              >
                ➕ Dodaj vnos
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {!showForm ? (
              <>
                {/* Display category items */}
                <div className={`p-6 rounded-lg ${categories.find(c => c.id === selectedCategory)?.bgColor}`}>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">
                    {searchTerm ? "Vsi izdelki" : categories.find(c => c.id === selectedCategory)?.label}
                  </h2>

                  {thuleLoading ? (
                    <p className="text-gray-600">Nalagam...</p>
                  ) : searchTerm ? (
                    filteredItems.length === 0 ? (
                      <p className="text-gray-600">Ni najdenih artiklov</p>
                    ) : (
                      <div className="space-y-6">
                        {categories.map((cat) => {
                          const matches = filteredItems.filter(it => it.category === cat.id);
                          if (matches.length === 0) return null;
                          return (
                            <div key={cat.id}>
                              <div className="mb-2 flex items-center gap-3">
                                <span className="text-sm text-gray-500">{cat.emoji}</span>
                                <h4 className="text-sm font-semibold text-gray-700">{cat.label} <span className="text-xs text-gray-500">({matches.length})</span></h4>
                              </div>
                              <div className="space-y-3">
                                {matches.map((item) => (
                                  <div
                                    key={item.id}
                                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 text-2xl font-bold text-gray-700">
                                        #{item.id}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h3 className="font-semibold text-gray-900">{getItemTitle(item)}</h3>
                                            {item.condition && (
                                              <p className="text-sm text-gray-600">Stanje: <span className="font-medium">{item.condition}</span></p>
                                            )}
                                            {item.quantity && (
                                              <p className="text-sm text-gray-600">Količina: <span className="font-medium">{item.quantity}</span></p>
                                            )}
                                            {item.variant && (
                                              <p className="text-sm text-gray-600">Varianta: <span className="font-medium">{item.variant}</span></p>
                                            )}
                                            {item.length && (
                                              <p className="text-sm text-gray-600">Dolžina: <span className="font-medium">{item.length} cm</span></p>
                                            )}
                                          </div>
                                          <div className="flex gap-2 ml-4">
                                            <button
                                              onClick={() => handleEditThule(item)}
                                              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                            >
                                              ✏️
                                            </button>
                                            <button
                                              onClick={() => handleDeleteThule(item.id)}
                                              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                            >
                                              🗑️
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : thuleByCategory[selectedCategory].length === 0 ? (
                    <p className="text-gray-600">Ni predmetov v tej kategoriji</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 text-2xl font-bold text-gray-700">
                              #{item.id}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                            <h3 className="font-semibold text-gray-900">{getItemTitle(item)}</h3>
                                  {item.condition && (
                                    <p className="text-sm text-gray-600">Stanje: <span className="font-medium">{item.condition}</span></p>
                                  )}
                                  {item.quantity && (
                                    <p className="text-sm text-gray-600">Količina: <span className="font-medium">{item.quantity}</span></p>
                                  )}
                                  {item.variant && (
                                    <p className="text-sm text-gray-600">Varianta: <span className="font-medium">{item.variant}</span></p>
                                  )}
                                  {item.length && (
                                    <p className="text-sm text-gray-600">Dolžina: <span className="font-medium">{item.length} cm</span></p>
                                  )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <button
                                    onClick={() => handleEditThule(item)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleDeleteThule(item.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Form */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    {formEditId ? "Uredi vnos" : "Dodaj nov vnos"}
                  </h3>

                  <form onSubmit={handleAddThule} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategorija *
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value as ThuleCategory);
                          setFormModel("");
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {selectedCategory === "kit" ? "Serija kita" : "Model"} *
                      </label>
                      <select
                        value={formModel}
                        onChange={(e) => setFormModel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Izberi {selectedCategory === "kit" ? "serijo" : "model"}...</option>
                        {modelsByCategory[selectedCategory].map((model) => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>

                    {selectedCategory === "kit" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Številka kita (4 znaki, začne z {formModel.charAt(0) || "X"}) *
                        </label>
                        <input
                          type="text"
                          value={formKitNumber}
                          onChange={(e) => setFormKitNumber(e.target.value.slice(0, 4))}
                          placeholder={`npr. ${formModel.charAt(0) || "X"}011`}
                          maxLength={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formKitNumber && (
                          <p className="text-xs mt-1">
                            {formKitNumber.length === 4 
                              ? (formKitNumber.charAt(0) === formModel.charAt(0) 
                                ? "✅ Veljavo" 
                                : "❌ Mora začeti z " + formModel.charAt(0))
                              : `❌ Potrebni še ${4 - formKitNumber.length} znaki`}
                          </p>
                        )}
                      </div>
                    )}

                    {selectedCategory === "foot" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                              Varianta (stari/novi)
                            </label>
                        <select
                          value={formVariant}
                          onChange={(e) => setFormVariant(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Izberi varianto...</option>
                          <option value="stari">Stari</option>
                          <option value="novi">Novi</option>
                        </select>
                      </div>
                    )}

                    {selectedCategory === "bars" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dolžina (npr. 120 cm)
                        </label>
                            <input
                              type="text"
                              value={formLength}
                              onChange={(e) => setFormLength(e.target.value.replace(/\D/g, ""))}
                              placeholder="npr. 120"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                      </div>
                    )}

                    {/* Serijsko število se ne prikazuje med vnosom — avtomatsko dodeljeno ob shranjevanju */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stanje *
                      </label>
                      <select
                        value={formCondition}
                        onChange={(e) => setFormCondition(e.target.value as "NOVO" | "RABLJENO" | "NEPOPOLNO")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="NOVO">NOVO</option>
                        <option value="RABLJENO">RABLJENO</option>
                        <option value="NEPOPOLNO">NEPOPOLNO</option>
                      </select>
                    </div>

                    {formEditId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Količina *
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={formQuantity}
                          onChange={(e) => setFormQuantity(Math.max(1, Number(e.target.value) || 1))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opomba
                      </label>
                      <textarea
                        value={formNote}
                        onChange={(e) => setFormNote(e.target.value)}
                        placeholder="Posebne opombe..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        type="submit"
                        disabled={formSaving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                      >
                        {formSaving ? "Shranjujem..." : formEditId ? "Shrani spremembe" : "Dodaj"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          handleCancelForm();
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Preklici
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
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
