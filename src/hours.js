/** "30m", "1h", "1h 30m" */
export function formatHours(hours) {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  if (whole === 0) {
    return `${minutes}m`;
  }
  if (minutes === 0) {
    return `${whole}h`;
  }
  return `${whole}h ${minutes}m`;
}

/**
 * Reads the optional time estimate typed on the Add page.
 * Returns { hours } (null when left blank), rounded to the nearest quarter hour, or { error }.
 */
export function readHours(value) {
  const text = String(value ?? '').trim();
  if (text === '') {
    return { hours: null };
  }
  const n = Number(text);
  if (!Number.isFinite(n) || n <= 0) {
    return { error: 'Use a number of hours, like 2 or 0.5.' };
  }
  if (n > 100) {
    return { error: 'Keep it to 100 hours or less.' };
  }
  return { hours: Math.max(0.25, Math.round(n * 4) / 4) };
}
