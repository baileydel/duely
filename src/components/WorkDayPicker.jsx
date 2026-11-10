import { addDays } from '../dates.js';

/** The day before it's due, or today if that has already passed. */
export function defaultWorkDay(due, today) {
  const dayBefore = addDays(due, -1);
  return dayBefore < today ? today : dayBefore;
}

/** Returns an error message for a planned day, or ''. */
export function checkWorkDay(workOn, due, today) {
  if (!workOn) {
    return 'Please pick a day to work on it.';
  }
  if (workOn < today) {
    return 'Pick today or a later day.';
  }
  if (due && workOn > due) {
    return 'Pick a day on or before the due date.';
  }
  return '';
}

export default function WorkDayPicker({ id, value, due, today, onChange, inputRef, invalid, describedBy }) {
  const picks = [
    { label: 'Today', date: today },
    { label: 'Tomorrow', date: addDays(today, 1) },
    { label: 'Day before it’s due', date: addDays(due, -1) },
  ].filter((p, i, all) => p.date >= today && p.date <= due && all.findIndex((q) => q.date === p.date) === i);

  return (
    <div className="inline">
      <input
        ref={inputRef}
        id={id}
        className="input input--short"
        type="date"
        min={today}
        max={due}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={describedBy}
      />
      {picks.map((p) => (
        <button
          key={p.date}
          type="button"
          className="btn chip"
          aria-pressed={value === p.date}
          onClick={() => onChange(p.date)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
