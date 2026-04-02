//apps/app-frontend/src/app/events/[slug]/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/src/components/navbar/Navbar'
import Footer from '@/src/components/footer/Footer'
import { USE_MOCK, API_BASE } from '@/src/config'
import * as mockApi from '@/src/lib/mockApi'
import { eventToIcs } from '@/src/utils/ics'
import type { EventItem } from '@/src/types/events'
import type { EventRegistration } from '@/src/types/registrations'
import { Calendar, Clock, MapPin, Share2, Ticket, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function EventDetailPage() {
  const params = useParams() as { slug?: string }
  const slug = params?.slug || ''
  const router = useRouter()

  const [event, setEvent] = useState<EventItem | null>(null)
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [qr, setQr] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const ev: EventItem = USE_MOCK
          ? await mockApi.fetchEventBySlug(slug)
          : await fetch(`${API_BASE}/events/${slug}`).then(r => r.json())

        if (!mounted || !ev) return

        setEvent(ev)
        // auto-select first ticket if present
        if (ev.tickets && ev.tickets.length > 0) setSelectedTicket(ev.tickets[0].id)

        const regs: EventRegistration[] = USE_MOCK
          ? await mockApi.getRegistrationsForEvent(ev.id)
          : await fetch(`${API_BASE}/events/${ev.id}/registrations`).then(r => r.json())

        setRegistrations(Array.isArray(regs) ? regs : [])
      } catch (err) {
        console.error('Failed to load event', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
        <div className="text-2xl font-serif italic animate-pulse text-gray-400">Preparing the altar…</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-serif italic text-gray-400">Encounter not found.</div>
      </div>
    )
  }

  // seats left computation (safe)
  const seatsLeft = (event.tickets || []).reduce((acc, t) => acc + Math.max(0, (t.capacity || 0) - (t.sold || 0)), 0)
  const isSoldOut = seatsLeft <= 0

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!event) return
    if (!selectedTicket) {
      setFeedback('Please select a ticket.')
      return
    }

    setSubmitting(true)
    setFeedback(null)
    setQr(null)

    try {
      const payload = { eventId: event.id, name, email, phone, ticketTypeId: selectedTicket }

      const res = USE_MOCK
        ? await mockApi.registerForEvent(payload)
        : await fetch(`${API_BASE}/events/${event.id}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).then(r => r.json())

      // res.status expected to be 'confirmed' | 'waitlisted'
      setFeedback(res.status === 'waitlisted' ? 'You were added to the waitlist.' : 'Registered successfully — check email for confirmation.')
      if (res.qr) setQr(res.qr)

      // refresh registrations & event (so seats update)
      const [regs, refreshedEvent] = await Promise.all([
        USE_MOCK ? mockApi.getRegistrationsForEvent(event.id) : fetch(`${API_BASE}/events/${event.id}/registrations`).then(r => r.json()),
        USE_MOCK ? mockApi.fetchEventBySlug(slug) : fetch(`${API_BASE}/events/${slug}`).then(r => r.json())
      ])

      setRegistrations(Array.isArray(regs) ? regs : [])
      setEvent(refreshedEvent || event)
      // optional: clear form fields on success
      if (res.status === 'confirmed') {
        setName('')
        setEmail('')
        setPhone('')
      }
    } catch (err) {
      console.error('Registration error', err)
      setFeedback('Registration failed. Try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  function downloadIcs() {
    const ics = eventToIcs(event)
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.slug}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  function getGoogleCalendarLink() {
    const start = new Date(event.startAt).toISOString().replace(/-|:|\.\d\d\d/g, '')
    const endAt = event.endAt ? new Date(event.endAt) : new Date(new Date(event.startAt).getTime() + 3600000)
    const end = endAt.toISOString().replace(/-|:|\.\d\d\d/g, '')
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${start}/${end}`,
      details: event.description || '',
      location: event.location?.address || event.location?.name || ''
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  async function handleShare() {
    const shareData = {
      title: event.title,
      text: event.description || '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.warn('Share cancelled', err)
      }
    } else {
      // fallback - copy link
      try {
        await navigator.clipboard.writeText(window.location.href)
        setFeedback('Link copied to clipboard')
        setTimeout(() => setFeedback(null), 2500)
      } catch {
        setFeedback('Unable to copy link')
      }
    }
  }

  // presentational helpers
  const priceText = (p?: number) => (typeof p === 'number' && p > 0 ? `KSH ${(p / 100).toFixed(2)}` : 'Free')

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-28 pb-8 lg:pt-32 lg:pb-12 bg-gradient-to-b from-[#F9F7F2] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[#E0BE53] text-xs uppercase tracking-widest font-black block mb-4">Sacred Encounter Details</span>
              <h1 className="text-4xl md:text-6xl font-serif font-black italic tracking-tight leading-tight mb-6">{event.title}</h1>

              <div className="flex flex-wrap gap-6 items-center text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#E0BE53]" />
                  <span>{new Date(event.startAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[#E0BE53]" />
                  <span>{new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span>{event.location?.name || ''}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={downloadIcs} className="px-4 py-2 rounded-full bg-white border border-gray-100 text-xs font-bold shadow-sm hover:shadow-md transition">Add to .ics</button>
                <a href={getGoogleCalendarLink()} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-white border border-gray-100 text-xs font-bold shadow-sm hover:shadow-md transition">Google Calendar</a>
                <button onClick={handleShare} className="px-4 py-2 rounded-full bg-white border border-gray-100 text-xs font-bold shadow-sm hover:shadow-md transition flex items-center gap-2">
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <div className="relative h-56 md:h-72 w-full bg-gray-100">
                  <Image src={event.image || '/images/mission-visual.jpg'} alt={event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 560px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* left */}
          <div className="lg:col-span-7 space-y-10">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-2xl font-serif font-black italic mb-6 flex items-center gap-3">
                <Ticket className="text-[#E0BE53]" /> Ticket Offerings
              </h3>

              <div className="grid gap-4">
                {(event.tickets || []).length === 0 && (
                  <div className="p-6 rounded-xl bg-white border text-sm text-gray-600">No ticket types available.</div>
                )}

                {(event.tickets || []).map((t) => {
                  const remaining = Math.max(0, (t.capacity || 0) - (t.sold || 0))
                  const selected = selectedTicket === t.id
                  return (
                    <label key={t.id} className={`group flex justify-between items-center p-5 rounded-2xl border ${selected ? 'border-[#E0BE53] bg-[#FFFBEB] shadow-lg' : 'border-gray-100 bg-white hover:shadow-sm'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${selected ? 'bg-[#E0BE53] text-black' : 'border border-gray-200 text-gray-500'}`}>
                          {selected ? <CheckCircle2 size={14} /> : <span className="text-xs font-bold"> </span>}
                        </div>

                        <div>
                          <div className="text-lg font-black uppercase">{t.name}</div>
                          <div className="text-xs tracking-widest text-[#E0BE53] font-black mt-1">{remaining} Spots Remaining</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-serif font-black italic text-xl">{priceText(t.price)}</div>
                        <input className="hidden" type="radio" name="ticket" checked={selected} onChange={() => setSelectedTicket(t.id)} />
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h4 className="text-xl font-black mb-4">Attendees ({registrations.length})</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {registrations.map(r => (
                  <li key={r.id} className="flex justify-between items-center">
                    <div>{r.name}</div>
                    <div className="text-xs text-gray-500">{r.status}{r.checkedInAt ? ' • checked in' : ''}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* right (sticky) */}
          <aside className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="p-8 rounded-[2rem] bg-[#111827] text-white shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-[#E0BE53] font-black uppercase tracking-widest mb-1">Secure Your Spot</div>
                    <div className="text-2xl font-black">{isSoldOut ? 'Waitlist' : `${seatsLeft} seats left`}</div>
                  </div>
                  <div className="text-right text-sm text-gray-300">Hosted by S.O.L.A.C.E</div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <input value={name} onChange={e => setName(e.target.value)} required placeholder="Full name" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/40 outline-none" />
                  <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="Email address" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/40 outline-none" />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/40 outline-none" />

                  <button disabled={submitting || (!selectedTicket) || (isSoldOut && !event.published)} type="submit" className="w-full py-4 rounded-xl bg-[#E0BE53] text-black font-black uppercase tracking-widest hover:opacity-95 disabled:opacity-60 transition">
                    {submitting ? 'Processing…' : (isSoldOut ? 'Join Waitlist' : 'Complete Registration')}
                  </button>
                </form>

                {feedback && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-3 rounded-lg bg-white/5 text-center">
                    <div className="text-sm font-bold text-[#E0BE53]">{feedback}</div>
                    {qr && <div className="mt-2 text-xs text-gray-200">Your QR: <code className="bg-white/10 px-2 py-1 rounded">{qr}</code></div>}
                  </motion.div>
                )}

                <div className="mt-6 text-[10px] text-white/30 uppercase tracking-widest text-center">Secure checkout powered by S.O.L.A.C.E</div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}