/**
 * This file will later be converted into a Date microservice that our team is working on, for now It's my personal service.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayISO() {
  return toISO(new Date());
}

function parse(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

function toLocalDate(iso) {
  const { y, m, d } = parse(iso);
  return new Date(y, m - 1, d);
}

export function addDays(iso, days) {
  const date = toLocalDate(iso);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

/** Whole days from `today` to `iso`. Negative means the date has passed. */
export function daysFromToday(iso, today = todayISO()) {
  const a = parse(iso);
  const b = parse(today);
  return Math.round((Date.UTC(a.y, a.m - 1, a.d) - Date.UTC(b.y, b.m - 1, b.d)) / DAY_MS);
}

/** "Fri, Oct 16" (adds the year when it is not this year). */
export function formatShort(iso, today = todayISO()) {
  const sameYear = parse(iso).y === parse(today).y;
  return toLocalDate(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/** "Sunday, Oct 18" */
export function formatLong(iso) {
  return toLocalDate(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

/** "2 days late", "due today", "tomorrow", "in 5 days" */
export function relativeLabel(days) {
  if (days < 0) {
    const late = -days;
    return late === 1 ? '1 day late' : `${late} days late`;
  }
  if (days === 0) {
    return 'due today';
  }
  if (days === 1) {
    return 'tomorrow';
  }
  return `in ${days} days`;
}

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/** "Four" for small counts, digits after twelve. */
export function countWord(n) {
  return WORDS[n] ?? String(n);
}
