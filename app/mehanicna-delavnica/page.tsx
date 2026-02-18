import SiteTheme from "../../components/SiteTheme";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function MehanicnaPage() {
  return (
    <SiteTheme>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Mehanična delavnica</h2>
        <p className="mb-6 text-gray-700">Informacije o storitvah, terminih in cenah. Kontaktirajte nas za rezervacijo.</p>
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-2">Servis strešnih nosilcev</h3>
          <p className="text-sm text-gray-600">Popravila, nastavitve in pregled nosilcev ter kovčkov.</p>
        </section>
      </main>
      <Footer />
    </SiteTheme>
  );
}
