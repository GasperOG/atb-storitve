"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { pridobiZadnjeSpremembe } from "@/lib/firestore";

export default function SpremembePage() {
  const [items, setItems] = useState<Array<Record<string, unknown> & { id?: string }>>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await pridobiZadnjeSpremembe(50);
      setItems(data || []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const fmt = (t: unknown) => {
    try {
      if (t && typeof (t as { toDate?: unknown }).toDate === "function") {
        const d = (t as { toDate: () => Date }).toDate();
        return d ? d.toLocaleString() : "";
      }
      const d = t ? new Date(String(t)) : null;
      return d && !Number.isNaN(d.getTime()) ? d.toLocaleString() : "";
    } catch { return String(t ?? ""); }
  };

  const pretty = (v: unknown) => {
    if (v === null) return 'null';
    if (v === undefined) return '';
    if (typeof v === 'object') {
      try { return JSON.stringify(v); } catch { return String(v); }
    }
    return String(v);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
            <div>
              <h1 className="text-3xl font-semibold text-black">Zadnje spremembe</h1>
              <p className="text-sm text-gray-600">Seznam zadnjih sprememb v sistemu (audit).</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin" className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-xl shadow">⬅ Nazaj v admin</Link>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Seznam</h2>
            <div className="flex items-center gap-2">
              <button onClick={load} className="px-3 py-1 bg-blue-600 text-white rounded">Osveži</button>
              <span className="text-sm text-gray-500">{loading ? 'Nalagam...' : `${items.length} zapisov`}</span>
            </div>
          </div>

          <div className="space-y-3">
            {items.length === 0 && !loading && <p className="text-gray-500">Ni zapisov.</p>}
            {items.map((a) => (
              <div key={String(a.id)} className="bg-white rounded-lg p-3 border">
                <div className="flex justify-between items-start">
                  <div className="pr-4">
                    <div className="font-medium text-gray-800">{String(a.message ?? (a.collection ? `${a.action || 'posodobitev'} ${String(a.collection)} ${String(a.itemId || '')}` : 'Sprememba'))}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {a.field ? (
                        <div>
                          <span className="text-xs text-gray-500 mr-2">{String(a.collection)}</span>
                          <div className="mt-1">{String(a.field)}: <span className="font-semibold">{pretty(a.oldValue)}</span> → <span className="font-semibold">{pretty(a.newValue)}</span></div>
                        </div>
                      ) : (
                        String(a.details ?? '')
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    <div>{fmt(a.timestamp)}</div>
                    {a.device ? <div className="mt-1 text-xs text-gray-600">{String(a.device)}</div> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 220ms ease-out; }
      `}</style>
    </div>
  );
}
