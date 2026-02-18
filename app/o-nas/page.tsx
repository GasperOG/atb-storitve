import SiteTheme from "../../components/SiteTheme";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ONasPage() {
  return (
    <SiteTheme>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">O nas</h2>
        <p className="mb-4 text-gray-700">ATB Storitve se ukvarja z najemom in prodajo strešnih kovčkov, nosilcev ter izvajanjem servisnih storitev. Naša ekipa ima dolgoletne izkušnje in zagotavlja kakovostno storitev.</p>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Naša zgodba</h3>
            <p className="text-sm text-gray-600">Začeli smo kot mala delavnica in rastli v ekipo strokovnjakov, ki razumejo potrebe potnikov in športnikov.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Kontakt</h3>
            <p className="text-sm text-gray-600">Telefon: +386 40 000 000 (primer) <br/> E-pošta: info@atb-storitve.si (nastavi pravo e-pošto)</p>
          </div>
        </section>
      </main>
      <Footer />
    </SiteTheme>
  );
}
