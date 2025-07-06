"use client";

import Link from "next/link";

const menuItems = [
  { href: "/admin/dodaj-najem", label: "Dodaj najem" },
  { href: "/admin/vsi-najemi", label: "Pregled vseh najemov" },
  { href: "/admin/kovcki", label: "Kovčki (urejanje)" },
  { href: "/admin/nosilci", label: "Pregled nosilcev" },
  { href: "/admin/porocila", label: "Poročila & statistika" },
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
                hover:shadow-xl hover:scale-[1.04] hover:bg-blue-100
                transition-all duration-200
                text-center text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide
                outline-none focus:ring-4 focus:ring-blue-400
                ${idx % 2 === 0 ? "animate-fade-in-up" : "animate-fade-in-down"}
              `}
              tabIndex={0}
            >
              <span className="mb-2 text-blue-800 drop-shadow-sm">{item.label}</span>
              <span className="mt-2 w-8 h-1 md:w-16 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 rounded-full opacity-70"></span>
            </Link>
          ))}
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
          .animate-fade-in-up {
            animation: fade-in-up 0.7s cubic-bezier(.4,0,.2,1);
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.7s cubic-bezier(.4,0,.2,1);
          }
        `}</style>
      </main>
    </div>
  );
}
