// apps/app-frontend/src/lib/mockApi.ts
import { EventItem } from '@/src/types/events';
import { EventRegistration } from '@/src/types/registrations';
import { nanoid } from 'nanoid';

// In-memory mock DB
const now = new Date();
const mockEvents: EventItem[] = [
  {
    id: 'e1',
    slug: 'second-game-night',
    title: 'Second Game Night 2026',
    description:
      'An evening of strategy, fellowship, and high-energy competition for the 18-25 generation.',
    location: { name: 'Main Sanctuary (MPH)', address: '123 Church St' },
    startAt: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(
      now.getTime() + 11 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ).toISOString(),
    category: 'MPH',
    image: '/events/SecondGameNight.png',
    featured: true,
    capacity: 120,
    tickets: [
      { id: 't1', name: 'General', price: 0, capacity: 100, sold: 78 },
      { id: 't2', name: 'VIP', price: 2500, capacity: 20, sold: 12 }
    ],
    published: true
  },
  {
    id: 'e2',
    slug: 'friday-night-live',
    title: 'Friday Night Live',
    description:
      'Monthly high-octane encounter for teens to experience God through music and word.',
    location: { name: 'The Hub', address: '45 Youth Ave' },
    startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ).toISOString(),
    category: 'TEENS',
    image: '/events/FridayNightLive.png',
    featured: false,
    capacity: 200,
    tickets: [{ id: 't3', name: 'Youth', price: 0, capacity: 200, sold: 54 }],
    published: true
  }
];

const registrations: EventRegistration[] = [
  {
    id: 'r1',
    eventId: 'e1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+254700111222',
    ticketTypeId: 't1',
    status: 'confirmed',
    qr: 'QR_R1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'r2',
    eventId: 'e1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+254700222333',
    ticketTypeId: 't2',
    status: 'confirmed',
    qr: 'QR_R2',
    createdAt: new Date().toISOString()
  }
];

// utilities
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchEvents(): Promise<EventItem[]> {
  await delay();
  // Return a deep copy to avoid accidental mutation
  return JSON.parse(JSON.stringify(mockEvents)) as EventItem[];
}

export async function fetchEventBySlug(slug: string): Promise<EventItem> {
  await delay();
  const e = mockEvents.find((x) => x.slug === slug);
  if (!e) throw new Error('NOT_FOUND');
  return JSON.parse(JSON.stringify(e));
}

export async function registerForEvent(payload: {
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  ticketTypeId?: string;
}): Promise<EventRegistration> {
  await delay(400);
  const ev = mockEvents.find((e) => e.id === payload.eventId);
  if (!ev) throw new Error('Event not found');

  // basic validation
  if (!payload.name) throw new Error('Name required');

  // find ticket (fallback to first ticket)
  const ticket =
    ev.tickets.find((t) => t.id === payload.ticketTypeId) || ev.tickets[0];
  if (!ticket) throw new Error('No ticket types available');

  // seats left for this ticket
  const seatsLeftForTicket = ticket.capacity - (ticket.sold || 0);

  // optional overall event capacity check
  const totalSold = ev.tickets.reduce((acc, t) => acc + (t.sold || 0), 0);
  const eventSeatsLeft = typeof ev.capacity === 'number' ? ev.capacity - totalSold : Infinity;

  const status =
    seatsLeftForTicket > 0 && eventSeatsLeft > 0 ? 'confirmed' : 'waitlisted';

  const reg: EventRegistration = {
    id: nanoid(8),
    eventId: ev.id,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    ticketTypeId: ticket.id,
    status,
    qr: status === 'confirmed' ? `QR_${nanoid(8)}` : undefined,
    createdAt: new Date().toISOString()
  };

  registrations.push(reg);

  if (status === 'confirmed') {
    ticket.sold = (ticket.sold || 0) + 1;
  }

  return reg;
}

export async function getRegistrationsForEvent(
  eventId: string
): Promise<EventRegistration[]> {
  await delay();
  return registrations.filter((r) => r.eventId === eventId).slice().reverse();
}

export async function exportRegistrationsCsv(eventId: string): Promise<string> {
  await delay();
  const list = await getRegistrationsForEvent(eventId);
  const header = 'id,name,email,phone,status,createdAt\n';
  const body = list
    .map(
      (r) =>
        `${r.id},"${(r.name || '').replace(/"/g, '""')}",${r.email || ''},${
          r.phone || ''
        },${r.status},${r.createdAt}`
    )
    .join('\n');
  return header + body;
}

export async function checkInRegistration(
  registrationId: string
): Promise<EventRegistration> {
  await delay();
  const r = registrations.find((x) => x.id === registrationId);
  if (!r) throw new Error('Not found');
  r.status = 'confirmed';
  r.checkedInAt = new Date().toISOString();
  return r;
}

export async function getAnalyticsForEvent(eventId: string) {
  await delay();
  const regs = registrations.filter((r) => r.eventId === eventId);
  const total = regs.length;
  const confirmed = regs.filter((r) => r.status === 'confirmed').length;
  const waitlisted = regs.filter((r) => r.status === 'waitlisted').length;
  const checkedIn = regs.filter((r) => !!r.checkedInAt).length;
  return { total, confirmed, waitlisted, checkedIn };
}