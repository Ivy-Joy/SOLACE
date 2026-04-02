// apps/app-frontend/src/components/events/EventCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EventItem } from '@/src/types/events';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function EventCard({ ev }: { ev: EventItem }) {
  const start = new Date(ev.startAt);
  const seatsRemaining = ev.tickets.reduce((acc, t) => acc + (t.capacity - t.sold), 0);

  return (
    <article className="group relative flex flex-col md:flex-row items-center gap-8 p-8 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-2xl hover:shadow-gold/5 transition-all">
      
      {/* 1. DATE BADGE STYLE */}
      <div className="flex flex-col items-center justify-center w-24 h-24 rounded-3xl bg-[#F9F7F2] border border-gray-50 group-hover:bg-[#E0BE53] transition-colors text-[#1a1a1b] group-hover:text-black shrink-0">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
          {format(start, 'MMM')}
        </span>
        <span className="text-3xl font-serif font-black italic">
          {format(start, 'd')}
        </span>
      </div>

      {/* 2. IMAGE PREVIEW */}
      <div className="w-full md:w-48 h-32 relative rounded-[1.5rem] overflow-hidden bg-[#F9F7F2] shrink-0">
        {ev.image ? (
          <Image 
            src={ev.image} 
            alt={ev.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Calendar size={32} />
          </div>
        )}
      </div>

      {/* 3. CONTENT AREA */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
          <span className="text-[#E0BE53] text-[9px] font-black uppercase tracking-[0.2em]">
            {format(start, 'EEEE')}
          </span>
          <div className="h-1 w-1 bg-gray-200 rounded-full" />
          <span className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1">
            <Clock size={10} /> {format(start, 'h:mm a')}
          </span>
        </div>

        <h3 className="text-2xl font-black text-[#1a1a1b] mb-3 group-hover:text-[#E0BE53] transition-colors tracking-tight">
          {ev.title}
        </h3>

        <p className="text-gray-500 text-sm font-light line-clamp-2 max-w-xl italic">
          {ev.description}
        </p>

        {/* METADATA: SEATS & LOCATION */}
        <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <MapPin size={12} className="text-[#E0BE53]" /> 
            {/* Note: Rendering location property based on your EventItem type */}
            {/* {typeof ev.location === 'object' ? (ev.location as any).name : ev.location} */}
             {ev.location.name}
    
          </div>
          <div className="px-3 py-1 rounded-full bg-gray-50 text-[9px] font-black uppercase tracking-tighter text-gray-400">
            {seatsRemaining} seats left
          </div>
        </div>
      </div>

      {/* 4. ACTION BUTTON */}
      <div className="shrink-0 w-full md:w-auto">
        <Link 
          href={`/events/${ev.slug}`} 
          className="flex items-center justify-center gap-2 bg-[#1a1a1b] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#E0BE53] hover:text-black transition-all shadow-lg active:scale-95"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}