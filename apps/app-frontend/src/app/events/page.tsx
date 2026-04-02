"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/src/components/navbar/Navbar';
import Footer from '@/src/components/footer/Footer';
import EventCard from '@/src/components/events/EventCard';
import { USE_MOCK, API_BASE } from '@/src/config';
import * as mockApi from '../../lib/mockApi';
import type { EventItem } from "@/src/types/events";

export default function EventsPage(){
  const [events, setEvents] = useState<EventItem []>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = USE_MOCK ? await mockApi.fetchEvents() : await fetch(`${API_BASE}/events`).then(r=>r.json());
        if (!mounted) return;
        setEvents(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    })();
    return () => { mounted = false; }
  }, []);

 // const filtered = events.filter(e => e.title.toLowerCase().includes(q.toLowerCase()));

  // This ensures 'filtered' is always an array, even if 'events' isn't
  const filtered = Array.isArray(events) 
    ? events.filter(e => e.title.toLowerCase().includes(q.toLowerCase()))
    : [];

  return (
    <main className="min-h-screen bg-white text-[#1a1a1b]">
      <Navbar />
      
      {/* 1. HERO HEADER STYLE */}
      <section className="pt-32 pb-16 px-6 lg:px-12 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16 text-center">
            <span className="text-[#E0BE53] text-xs uppercase tracking-[0.5em] font-black block mb-4">The Calendar</span>
            <h1 className="text-5xl md:text-8xl font-serif font-black italic tracking-tighter leading-none">
              Sacred <span className="text-[#E0BE53] not-italic">Encounters.</span>
            </h1>
            <p className="mt-6 text-gray-500 font-serif italic text-lg max-w-2xl mx-auto">Upcoming events and ways to register.</p>
          </header>

          {/* 2. SEARCH BAR STYLE */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative group">
              <input 
                value={q} 
                onChange={e=>setQ(e.target.value)} 
                className="w-full pl-6 pr-6 py-4 bg-white shadow-xl shadow-gold/5 rounded-full text-sm font-medium outline-none border border-transparent focus:border-[#E0BE53]/30 transition-all" 
                placeholder="Search events..." 
              />
            </div>
          </div>

          {/* 3. EVENT LIST STYLE */}
          <section className="max-w-5xl mx-auto space-y-6 pb-24">
            {loading ? (
              <div className="text-center py-20 font-serif italic text-gray-400 text-2xl animate-pulse">
                Consulting the calendar...
              </div>
            ) : (
              <div className="space-y-6">
                {filtered.map(ev => (
                  <div key={ev.id} className="transition-transform duration-300 hover:scale-[1.01]">
                    <EventCard ev={ev} />
                  </div>
                ))}
              </div>
            )}
            
            {!loading && filtered.length === 0 && (
              <div className="p-12 bg-white rounded-[3rem] border border-dashed border-gray-200 text-center shadow-sm">
                <p className="font-serif italic text-gray-400 text-xl">No events found matching your search.</p>
              </div>
            )}
          </section>
        </div>
      </section>

      <Footer />
    </main>
  )
}