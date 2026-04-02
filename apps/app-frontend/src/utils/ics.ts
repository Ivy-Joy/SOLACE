export function eventToIcs(event) {
  const uid = `event-${event.id}@yourdomain.com`;
  function fmt(d) { return new Date(d).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'; }
  const start = fmt(event.startAt);
  const end = fmt(event.endAt || new Date(new Date(event.startAt).getTime() + 60*60*1000));
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

function escapeText(s) { return (s||'').replace(/,/g,'\,').replace(/\n/g,'\\n'); }