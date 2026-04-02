// apps/app-frontend/src/utils/date.ts
export function fmtDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
export function fmtMonthYear(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}