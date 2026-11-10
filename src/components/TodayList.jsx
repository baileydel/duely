import AssignmentRow from './AssignmentRow.jsx';
import { daysFromToday } from '../dates.js';
import { formatHours } from '../hours.js';

/**
 * The assignments planned for today, at the top of Due soon. A planned day that has
 * passed without the assignment being done moves to today, so nothing is lost.
 * Past-due assignments are left out: they are already listed under Overdue.
 */
export default function TodayList({ items, today, onDone }) {
  const planned = items
    .filter((a) => !a.done && a.workOn <= today && a.due >= today)
    .map((a) => ({ ...a, days: daysFromToday(a.due, today) }))
    .sort((a, b) => a.due.localeCompare(b.due) || a.createdAt - b.createdAt);
  const totalHours = planned.reduce((sum, a) => sum + (a.hours ?? 0), 0);

  return (
    <section className="section" aria-labelledby="today-heading">
      <h2 id="today-heading" className="title spread">
        Today
        {totalHours > 0 && <small>about {formatHours(totalHours)} of work</small>}
      </h2>

      {planned.length === 0 && <p className="muted line">Nothing planned for today.</p>}

      <ul className="list">
        {planned.map((a) => (
          <AssignmentRow key={a.id} item={a} today={today} onDone={onDone} inToday />
        ))}
      </ul>
    </section>
  );
}
