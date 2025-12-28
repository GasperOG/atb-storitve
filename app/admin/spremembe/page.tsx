"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { pridobiZadnjeSpremembe } from "@/lib/firestore";

export default function SpremembePage() {
  const [items, setItems] = useState<Array<Record<string, unknown> & { id?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [adminEmailCookie, setAdminEmailCookie] = useState<string>('');

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

  useEffect(() => {
    // Read admin_email cookie once on client mount
    if (typeof document === 'undefined') return;
    const m = document.cookie.match('(^|;)\\s*' + 'admin_email' + '\\s*=\\s*([^;]+)');
    const v = m ? decodeURIComponent(m[2]) : '';
    setAdminEmailCookie(String(v).toLowerCase());
  }, []);

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

  const getActor = (item: Record<string, unknown>) => {
    // Check common audit actor keys and nested objects for name/email
    const tryString = (v: unknown) => (typeof v === 'string' && v.trim()) ? v as string : null;
    const tryObject = (v: unknown) => {
      if (v && typeof v === 'object') {
        const o = v as Record<string, unknown>;
        return tryString(o.name) || tryString(o.email) || tryString(o.displayName) || tryString(o.username) || tryString(o.userName) || null;
      }
      return null;
    };

    const keys = ['user', 'actor', 'performedBy', 'performed_by', 'email', 'by', 'performedByEmail', 'performedByEmail', 'userId', 'performed_by_email', 'device'];
    for (const k of keys) {
      const v = (item as Record<string, unknown>)[k];
      const s = tryString(v) || tryObject(v);
      if (s) return s;
    }

    // Try message for an email
    const msg = tryString(item.message) || tryString(item.details) || '';
    const emailMatch = msg.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    if (emailMatch) return emailMatch[0];

    return 'neznan';
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
            {items.map((a) => {
              const actor = getActor(a);
              const adminEmail = String(adminEmailCookie ?? '').toLowerCase();
              let initials = 'NA';
              if (adminEmail && adminEmail.includes('branko')) initials = 'B';
              else if (adminEmail && adminEmail.includes('gasper')) initials = 'G';
              else {
                const lcActor = String(actor ?? '').toLowerCase();
                if (lcActor.includes('branko')) initials = 'B';
                else if (lcActor.includes('gasper')) initials = 'G';
                else if (actor && actor !== 'neznan') initials = actor.split(/[\s@._-]+/).map((s: string) => (s ? s.charAt(0) : '')).slice(0,2).join('').toUpperCase();
              }

              return (
                <div key={String(a.id)} className="bg-white rounded-lg p-4 border shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-semibold">{initials}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium text-gray-800">{String(a.message ?? (a.collection ? `${a.action || 'posodobitev'} ${String(a.collection)} ${String(a.itemId || '')}` : 'Sprememba'))}</div>
                          <div className="mt-1 text-xs text-gray-500">Avtor: <span className="font-medium text-gray-700">{actor}</span></div>
                        </div>
                        <div className="text-sm text-gray-500 text-right">
                          <div>{fmt(a.timestamp)}</div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">{String(a.action ?? 'posodobitev')}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">{String(a.collection ?? '')}</span>
                        </div>

                        {a.field ? (
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Polje: <span className="font-medium text-gray-700">{String(a.field)}</span></div>
                            <div className="flex gap-3 items-center">
                              <div className="text-sm text-gray-600">Staro: <span className="font-semibold">{pretty(a.oldValue)}</span></div>
                              <div className="text-sm text-gray-600">Novo: <span className="font-semibold">{pretty(a.newValue)}</span></div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">{String(a.details ?? '')}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
