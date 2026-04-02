// List + create events UI
'use client'
import React, { useEffect, useState } from 'react';
import Navbar from '@/src/components/navbar/Navbar';
import Footer from '@/src/components/footer/Footer';
import EventCard from '@/components/events/EventCard';
import { USE_MOCK, API_BASE } from '../../src/config';
import * as mockApi from '../../lib/mockApi';

export default function EventsPage(){
  const [events, setEvents] = useState<any[]>([]);
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

  const filtered = events.filter(e => e.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-4xl font-serif font-black">Sacred Encounters — Events</h1>
          <p className="text-gray-600">Upcoming events and ways to register.</p>
        </header>

        <div className="mb-4 flex gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} className="flex-1 p-3 border rounded" placeholder="Search events..." />
        </div>

        <section className="space-y-4">
          {loading ? <div>Loading events...</div> : filtered.map(ev => (
            <EventCard key={ev.id} ev={ev} />
          ))}
          {!loading && filtered.length === 0 && <div className="p-6 bg-white rounded">No events found.</div>}
        </section>

      </div>
      <Footer />
    </main>
  )
}