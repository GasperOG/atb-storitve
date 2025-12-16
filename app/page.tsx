import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-400 to-blue-900">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl px-10 py-16 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 drop-shadow-lg text-center">
          Dobrodošli v sistemu za najem kovčkov
        </h1>
        <p className="text-lg text-blue-800 mb-10 text-center max-w-xl">
          Upravljajte najeme, kovčke in stranke na enem mestu. Za dostop do administracije kliknite spodnji gumb.
        </p>
        <Link
          href="/admin"
          className="bg-blue-700 hover:bg-blue-800 text-white text-xl font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none"
        >
          Vstop v admin
        </Link>
      </div>
    </div>
  );
}
