// util/ics.ts
export function eventToIcs(event) {
  // basic RFC 5545 VEVENT snippet
  const uid = `event-${event._id}@yourdomain.com`;
  const start = formatAsUtcIcs(event.startAt);
  const end = formatAsUtcIcs(event.endAt || new Date(event.startAt.getTime() + 60*60*1000));

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YourOrg//ChurchEvents//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatAsUtcIcs(new Date())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description || "")}`,
    `LOCATION:${escapeText(event.location?.address || event.location?.name || "")}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}