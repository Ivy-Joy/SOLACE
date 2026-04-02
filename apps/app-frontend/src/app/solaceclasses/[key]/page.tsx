// app/solaceclasses/[key]/page.tsx

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";
import { solaceClasses } from "@/src/lib/solaceClasses";
import ClassSections from "@/src/components/solaceclasses/ClassSections";

export default function ClassPage() {
  const { key } = useParams();
  
  // Normalize key to handle casing issues (e.g., /Ropes vs /ropes)
  const normalizedKey = (key as string)?.toLowerCase();
  const data = solaceClasses[normalizedKey];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900">
        <p className="text-xl font-serif italic mb-4">Class not found</p>
        <Link href="/solaceclasses" className="text-blue-600 underline">
          Return to all classes
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      
      {/* Navigation / Back Link */}
      <div className="pt-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Link 
            href="/solaceclasses" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors py-4"
          >
            <ChevronLeft size={14} />
            Back to Solace Classes
          </Link>
        </div>
      </div>

      {/* Force-wrapping ClassSections in a div with explicit text color 
          to resolve the "invisible text" issue caused by theme inheritance.
      */}
      <div className="text-gray-900">
        <ClassSections data={data} />
      </div>

      <Footer />
    </main>
  );
}