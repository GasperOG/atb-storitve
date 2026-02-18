export default function KontaktPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-12">
      <div className="max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-4">Kontakt</h1>
        <p className="mb-6">Pišite nam ali nas pokličite. To je predogledna stran za kontakt.</p>
        <div className="space-y-2">
          <div className="font-semibold">Telefon: +386 40 123 456</div>
          <div className="font-semibold">E-pošta: info@atb-storitve.si</div>
          <div className="mt-4">Naslov: Praias de ... (posodobi z natančnim naslovom)</div>
        </div>
      </div>
    </main>
  );
}
