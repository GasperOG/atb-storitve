import SiteTheme from "../../components/SiteTheme";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function CenikPage() {
  return (
    <SiteTheme>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Cenik</h2>
        <p className="mb-6 text-gray-700">Tukaj je okvirni cenik naših najemov in storitev. Končne cene so odvisne od termina in trajanja.</p>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Storitev</th>
              <th className="py-2">Cena</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3">Dnevni najem kovčka</td>
              <td className="py-3">€10</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">Tedenski najem kovčka</td>
              <td className="py-3">€45</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">Najem nosilca za kolo (dan)</td>
              <td className="py-3">€8</td>
            </tr>
            <tr className="border-b">
              <td className="py-3">Montaža / servis nosilcev</td>
              <td className="py-3">od €25</td>
            </tr>
          </tbody>
        </table>
      </main>
      <Footer />
    </SiteTheme>
  );
}
