"use client";

import Link from "next/link";

const menuItems = [
  { href: "/admin/dodaj-najem", label: "Dodaj najem" },
  { href: "/admin/vsi-najemi", label: "Pregled vseh najemov" },
  { href: "/admin/kovcki", label: "Kovčki (urejanje)" },
  { href: "/admin/inventura", label: "Inventura" },
  { href: "/admin/porocila", label: "Poročila & statistika" },
  { href: "/admin/arhivirani-najemi", label: "Arhivirani najemi" },
];

export default function AdminHome() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-300 via-gray-600 to-blue-900 transition-colors duration-500">
      <main className="p-4 sm:p-8 md:p-12 max-w-5xl mx-auto font-sans">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-12 text-center text-gray-900 drop-shadow-md">
          Admin Nadzorna Plošča
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {menuItems.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center
                p-8 sm:p-12 md:p-16 lg:p-20
                bg-blue-50 border border-blue-300
                rounded-3xl shadow-lg
                transition-all duration-300 ease-out
                text-center text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide
                outline-none focus:ring-4 focus:ring-blue-400
                group
                hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-100 hover:via-blue-200 hover:to-blue-300 hover:border-blue-500
                active:scale-100
                animate-fade-in-block
              `}
              style={{ animationDelay: `${idx * 80}ms` }}
              tabIndex={0}
            >
              <span className="mb-2 text-blue-800 drop-shadow-sm group-hover:text-blue-900 transition-colors duration-200">{item.label}</span>
              <span className="mt-2 w-8 h-1 md:w-16 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 rounded-full opacity-70 group-hover:opacity-100 transition-all duration-200"></span>
            </Link>
          ))}
        </div>
        {/* Gumb za vrnitev na javno stran spodaj */}
        <div className="flex justify-center mt-16 mb-8">
          <Link
            href="/"
            className="bg-white/80 hover:bg-white text-blue-900 hover:text-blue-700 border border-blue-300 rounded-full px-8 py-3 font-semibold shadow-lg transition-all duration-300 text-lg focus:outline-none animate-fade-in-up group hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-100 hover:via-blue-200 hover:to-blue-300 hover:border-blue-500 active:scale-100"
            style={{ minWidth: 220, textAlign: 'center', animationDelay: `${menuItems.length * 80 + 200}ms`, animationFillMode: 'both' }}
          >
            ⬅ Nazaj na javno stran
          </Link>
        </div>
        <style jsx global>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in-block {
            0% { opacity: 0; transform: scale(0.95) translateY(30px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-fade-in-block {
            animation: fade-in-block 0.6s cubic-bezier(0.4,0,0.2,1) both;
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.7s cubic-bezier(0.4,0,0.2,1) both;
          }
        `}</style>
      </main>
    </div>
  );
}
