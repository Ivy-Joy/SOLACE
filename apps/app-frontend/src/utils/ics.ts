// 1. Define the interface for your event object
interface ICalendarEvent {
  id: string | number;
  startAt: string | Date;
  endAt?: string | Date; // Optional property
  title: string;
  description?: string; // Optional property
  location?: {
    address?: string;
    name?: string;
  };
}

// 2. Apply the type to the 'event' parameter
export function eventToIcs(event: ICalendarEvent): string {
  const uid = `event-${event.id}@yourdomain.com`;

  // 3. Add a type to the date parameter 'd'
  function fmt(d: string | Date | number): string { 
    return new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; 
  }

  const start = fmt(event.startAt);
  
  // Handle the logic for the default end date if endAt is missing
  const defaultEnd = new Date(new Date(event.startAt).getTime() + 60 * 60 * 1000);
  const end = fmt(event.endAt || defaultEnd);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YourOrg//ChurchEvents//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description || '')}`,
    `LOCATION:${escapeText(event.location?.address || event.location?.name || '')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return lines.join('\r\n');
}

function escapeText(s: string): string { 
  return (s || '').replace(/,/g, '\\,').replace(/\n/g, '\\n'); 
}