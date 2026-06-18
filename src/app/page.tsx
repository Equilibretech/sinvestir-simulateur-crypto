import { Header } from "@/components/Header";
import { Simulator } from "@/components/Simulator";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        <div className="mb-7 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Simulateur d&apos;investissement crypto
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Mesurez ce qu&apos;aurait donné un investissement passé en cryptomonnaie,
            en apport unique ou en versements réguliers (DCA), sur la base des prix
            historiques réels.
          </p>
        </div>
        <Simulator />
      </main>
      <Footer />
    </>
  );
}
