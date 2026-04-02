"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Second Game Night 2026",
    date: "MAR 24",
    time: "6:00 PM",
    location: "MPH",
    category: "Conference",
    image: "/events/SecondGameNight.png",
    featured: true,
  },
  {
    id: 2,
    title: "Friday Night Live (FNL)",
    date: "EVERY 3rd FRI",
    time: "6:00 PM",
    location: "MPH",
    category: "Monthly",
    image: "/events/FridayNightLive.png",
    featured: false,
  },
  {
    id: 3,
    title: "Bible Study",
    date: "APR 12",
    time: "6:00 PM",
    location: "MPH",
    category: "Workshop",
    image: "/events/BibleStudy.png",
    featured: false,
  },
];

export default function EventsPreview() {
  return (
    <section className="py-14 sm:py-16 bg-white text-[#1a1a1b]">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-lg">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold block mb-2"
            >
              Mark Your Calendar
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black italic tracking-tight"
            >
              Upcoming <span className="text-gold not-italic">Events.</span>
            </motion.h2>
          </div>

          <Link
            href="/events"
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 hover:text-gold transition-colors"
          >
            Full Calendar
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* FEATURED */}
          {events.filter(e => e.featured).map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 group relative h-[420px] rounded-[2rem] overflow-hidden shadow-xl border border-gray-100"
            >
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-5 left-5 bg-gold text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                Featured Encounter
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-3 text-gold mb-3">
                  <span className="text-3xl font-black font-serif italic">
                    {event.date.split(" ")[1]}
                  </span>
                  <div className="h-8 w-[1px] bg-white/30" />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-tight">
                    {event.date.split(" ")[0]} <br /> {event.time}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 group-hover:text-gold transition-colors tracking-tight">
                  {event.title}
                </h3>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-white/80">
                    <MapPin size={14} className="text-gold" /> {event.location}
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="bg-white text-black px-5 py-2 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-gold transition-all"
                  >
                    Secure Spot
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          {/* RIGHT SIDE */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {events.filter(e => !e.featured).map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="group flex items-center gap-4 bg-[#F9F7F2] border border-gray-100 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all"
              >
                <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 text-gold text-[9px] font-black uppercase tracking-widest mb-1">
                    <Calendar size={10} /> {event.date} • {event.time}
                  </div>

                  <h4 className="text-base font-black group-hover:text-gold transition-colors line-clamp-1">
                    {event.title}
                  </h4>

                  <div className="flex items-center gap-1 text-gray-400 text-[11px] mt-1">
                    <MapPin size={11} className="text-gold/50" /> {event.location}
                  </div>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-dark group-hover:bg-gold group-hover:text-black transition-all"
                >
                  <ChevronRight size={16} />
                </Link>
              </motion.div>
            ))}

            {/* CTA BOX */}
            <div className="mt-2 p-6 rounded-2xl bg-gold text-black relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Calendar size={60} />
              </div>

              <h4 className="text-lg font-black mb-1">Never miss a moment.</h4>
              <p className="text-xs text-black/70 mb-4">
                Sync our calendar to your device to stay updated on all youth encounters.
              </p>

              <button className="text-[9px] uppercase tracking-[0.25em] font-black flex items-center gap-2 hover:gap-3 transition-all">
                Sync Now <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronRight({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}