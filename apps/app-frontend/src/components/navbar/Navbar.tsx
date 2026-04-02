"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Classes", href: "/solaceclasses" },
    { name: "Discipleship", href: "/discipleship" },
    { name: "Events", href: "/events" },
    { name: "Prayer Wall", href: "/prayer-wall" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-zinc-200 shadow-sm">
      <div className="max-w-[1300px] mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <div className="relative w-32 h-10 md:w-40 md:h-12">
            <Image
              src="/logos/solace_logo.png"
              alt="Solace"
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-[11px] uppercase tracking-[0.25em] font-semibold transition ${
                  isActive
                    ? "text-black"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                {link.name}

                {/* underline */}
                <span
                  className={`absolute left-0 -bottom-2 h-[2px] bg-[#E0BE53] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <Link
            href="/give"
            className="hidden lg:block text-[11px] uppercase tracking-[0.25em] text-zinc-600 hover:text-black"
          >
            Giving
          </Link>

          <Link
            href="/join"
            className="hidden sm:inline-flex bg-[#E0BE53] text-black text-[11px] font-bold uppercase tracking-[0.25em] px-6 py-3 rounded-full hover:bg-black hover:text-white transition"
          >
            Join Us
          </Link>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-zinc-200 px-6 py-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-700 uppercase tracking-[0.2em] text-sm"
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/join"
            className="bg-[#E0BE53] text-black text-center py-3 rounded-full uppercase text-sm font-bold"
          >
            Join Us
          </Link>
        </div>
      )}
    </nav>
  );
}