export function parseISO(iso) {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d)
    return null;
  return dt;
}

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addMonths(date, delta) {
  const d = new Date(date);
  const targetMonth = d.getMonth() + delta;
  d.setMonth(targetMonth);
  return d;
}

export function addYears(date, delta) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + delta);
  return d;
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}

export function getMonthMatrix(current, weekStartsOn = 1) {
  const firstOfMonth = startOfMonth(current);
  const year = firstOfMonth.getFullYear();
  const month = firstOfMonth.getMonth();

  const firstWeekday = firstOfMonth.getDay();

  const shift = (firstWeekday - weekStartsOn + 7) % 7;

  const start = new Date(year, month, 1 - shift);
  const out = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i
    );
    const inCurrentMonth = d.getMonth() === month;
    const today = new Date();
    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    out.push({ date: d, iso: toISO(d), inCurrentMonth, isToday });
  }
  return out;
}
