import SiteTheme from "../../components/SiteTheme";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CategoryGrid from "../../components/CategoryGrid";

export default function IzposojaPage() {
  const items = [
    { id: "r1", title: "Kovček - dnevni najem", description: "Majhen kovček za krajše poti.", accent: "var(--color-primary)" },
    { id: "r2", title: "Kovček - tedenski najem", description: "Velik kovček za daljše potovanje.", accent: "var(--color-primary)" },
    { id: "r3", title: "Nosilec za kolo - najem", description: "Enostavna montaža in varno pritrjevanje.", accent: "#d61f26" },
  ];

  return (
    <SiteTheme>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Izposoja</h2>
        <p className="mb-6 text-gray-700">Izberite tip izposoje in termin. Za rezervacijo kliknite posamezen izdelek.</p>
        <CategoryGrid items={items} />
      </main>
      <Footer />
    </SiteTheme>
  );
}
