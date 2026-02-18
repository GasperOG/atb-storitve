import SiteTheme from "../../components/SiteTheme";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function RezervacijaPage() {
  return (
    <SiteTheme>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Rezervacija</h2>
        <p className="mb-6 text-gray-700">Rezervirajte opremo ali termin v naši delavnici. Za hitro rezervacijo izpolnite spodnji obrazec in kontaktirali vas bomo.</p>

        <section className="bg-white rounded-lg p-6 shadow-sm">
          <form className="grid grid-cols-1 gap-4 max-w-xl">
            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Ime in priimek</span>
              <input name="name" className="border rounded px-3 py-2" placeholder="Vaše ime" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Telefon ali e-pošta</span>
              <input name="contact" className="border rounded px-3 py-2" placeholder="Telefon ali email" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Kaj želite rezervirati</span>
              <input name="item" className="border rounded px-3 py-2" placeholder="Npr. Kovček - tedenski najem" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Želeni termin</span>
              <input name="date" type="date" className="border rounded px-3 py-2" />
            </label>

            <div>
              <button type="button" className="bg-[color:var(--color-primary)] text-white px-4 py-2 rounded hover:opacity-90">
                Pošlji povpraševanje
              </button>
              <p className="text-xs text-gray-500 mt-2">Opomba: obrazec je zaenkrat informativen — povežemo ga z e-pošto po dogovoru.</p>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </SiteTheme>
  );
}
