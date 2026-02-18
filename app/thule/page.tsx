import SiteTheme from "../../components/SiteTheme";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CategoryGrid from "../../components/CategoryGrid";

export default function ThulePage() {
  const items = [
    { id: "t1", title: "Thule Motion XT", description: "Prostoren kovček za daljše poti.", accent: "#0b4fa1" },
    { id: "t2", title: "Thule Wingbar", description: "Strešni nosilec z enostavnim montažnim sistemom.", accent: "#0b4fa1" },
    { id: "t3", title: "Kovček 75L", description: "Robusten in vodotesen kovček.", accent: "#0b4fa1" },
  ];

  return (
    <SiteTheme>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Thule / Kovčki</h2>
        <p className="mb-6 text-gray-700">Izberi kovček ali nosilec za svoje potrebe.</p>
        <CategoryGrid items={items} />
      </main>
      <Footer />
    </SiteTheme>
  );
}
