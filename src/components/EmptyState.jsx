import { Link } from 'react-router-dom';
import sadCalendar from '../assets/sad-calendar.svg';

export default function EmptyState() {
  return (
    <>
      <section className="empty" aria-labelledby="empty-heading">
        <img src={sadCalendar} alt="" width="104" height="104" />
        <h2 id="empty-heading">No assignments yet</h2>
        <p>
          Add one and pick the day you’ll work on it. On that day it shows up under Today, so you always know what to
          do next.
        </p>
        <Link to="/add" className="btn btn--solid">
          + Add assignment
        </Link>
      </section>

      <section className="notes" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="label">
          A few things worth knowing
        </h2>
        <p className="muted">
          <strong>Today</strong> at the top of this page lists what you planned to work on today. Missed a day? It
          stays under Today until it’s done, so nothing slips.
        </p>
        <p className="muted">
          Below that, everything is grouped into <strong>Overdue</strong>, <strong>This week</strong> and{' '}
          <strong>Later</strong>, so the thing that needs you most is at the top.
        </p>
        <p className="muted">
          Finished something? Click the circle next to it. There is always an undo if you clicked the wrong one.
        </p>
        <p className="muted">
          Nothing is ever deleted, and nothing is saved until you press Save. If you are not sure how something
          works, <Link to="/help">Help</Link> is one page long.
        </p>
      </section>
    </>
  );
}
