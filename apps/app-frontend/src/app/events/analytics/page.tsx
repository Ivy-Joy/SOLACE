'use client'
import React, { useEffect, useState } from 'react';
import Navbar from '@/src/components/navbar/Navbar';
import Footer from '@/src/components/footer/Footer';
import { USE_MOCK } from '@/src/config';
import * as mockApi from '../../../lib/mockApi';

export default function AnalyticsPage(){
  const [stats, setStats] = useState<any>(null);
  useEffect(()=>{ (async ()=>{
    const e = await mockApi.fetchEvents();
    const first = e[0];
    const s = await mockApi.getAnalyticsForEvent(first.id);
    setStats({ event: first, stats: s });
  })() },[]);

  if (!stats) return <div className="p-8">Loading analytics...</div>;
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold">Analytics — {stats.event.title}</h2>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-white rounded">Total Registrations<div className="text-3xl font-bold">{stats.stats.total}</div></div>
          <div className="p-4 bg-white rounded">Confirmed<div className="text-3xl font-bold">{stats.stats.confirmed}</div></div>
          <div className="p-4 bg-white rounded">Waitlisted<div className="text-3xl font-bold">{stats.stats.waitlisted}</div></div>
          <div className="p-4 bg-white rounded">Checked In<div className="text-3xl font-bold">{stats.stats.checkedIn}</div></div>
        </div>
      </div>
      <Footer />
    </main>
  )
}