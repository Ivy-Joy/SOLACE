// app/classes/page.tsx

import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";
import ClassesGrid from "@/src/components/solaceclasses/ClassesGrid";

export default function ClassesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-[#C6A15A] text-[10px] uppercase tracking-[0.5em] font-black">
            Solace Classes
          </span>

          <h1 className="mt-5 text-4xl md:text-6xl font-serif font-black text-zinc-950">
            Growth. Identity. Purpose.
          </h1>

          <p className="mt-4 text-zinc-600 max-w-2xl mx-auto">
            Every class is intentionally designed to guide young people through
            spiritual formation, identity discovery, and meaningful growth.
          </p>
        </div>
      </section>

      <ClassesGrid />

      <Footer />
    </main>
  );
}