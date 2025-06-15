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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <main className="p-4 sm:p-8 md:p-12 max-w-5xl mx-auto font-sans">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-12 text-center text-gray-800 drop-shadow-lg">
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
                bg-white/80 border border-gray-200
                rounded-3xl shadow-xl
                hover:shadow-2xl hover:scale-[1.04] hover:bg-blue-100/60
                transition-all duration-200
                text-center text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide
                outline-none focus:ring-4 focus:ring-blue-200
                ${idx % 2 === 0 ? "animate-fade-in-up" : "animate-fade-in-down"}
              `}
              tabIndex={0}
            >
              <span className="mb-2 text-blue-700 drop-shadow-sm">{item.label}</span>
              <span className="mt-2 w-8 h-1 md:w-16 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-70"></span>
            </Link>
          ))}
        </div>
        <style jsx global>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(30px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-30px);}
            100% { opacity: 1; transform: translateY(0);}
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