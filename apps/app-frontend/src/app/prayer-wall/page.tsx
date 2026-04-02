//apps/app-frontend/src/app/prayer-wall/page.tsx
"use client";

import Footer from "@/src/components/footer/Footer";
import Navbar from "@/src/components/navbar/Navbar";
import PrayerWall from "@/src/components/prayer/PrayerWall";
import { Footprints } from "lucide-react";

/*export default function PrayerWallPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 container mx-auto px-6 bg-white min-h-screen text-gray-800">
        <h1 className="text-3xl font-bold mb-4">SOLACE Prayer Wall</h1>
        <p className="text-gray-600 mb-6 max-w-2xl">
          Share a prayer request or stand with others in prayer. Your request can be anonymous.
          Sensitive details remain private and are only visible to pastoral staff.
        </p>

        <PrayerWall />
      </main>
    </>
  );
}*/
// apps/app-frontend/src/app/prayer-wall/page.tsx
export default function PrayerWallPage() {
  return (
    <div className="bg-[#F9F7F2] min-h-screen"> {/* The Warm Alabaster */}
      <Navbar />
      
      <main className="pt-32 pb-20 container mx-auto px-6">
        <header className="text-center mb-16">
          <span className="text-[#C6A15A] text-xs uppercase tracking-[0.4em] font-bold mb-4 block">
            Community Intercession
          </span>
          {/* <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">
            The <span className="text-[#C6A15A] not-italic">Prayer</span> Wall
          </h1> */}
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter">
          The <span className="text-[#C6A15A] italic font-serif">Prayer</span> Wall
        </h1>
        <p className="text-gray-600 mt-4 max-w-lg mx-auto font-light leading-relaxed">
          For where two or three gather in my name, there am I with them. Submit your request and let the community stand with you.
        </p>
          <div className="h-1 w-12 bg-[#C6A15A] mx-auto mt-6" />
        </header>

        {/* Prayer Wall Component */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <PrayerWall />
        </div>
      </main>
      <Footer />
    </div>
  );
}