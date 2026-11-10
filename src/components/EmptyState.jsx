import { Link } from 'react-router-dom';
import sadCalendar from '../assets/sad-calendar.svg';

export default function EmptyState() {
  return (
    <>
      <section className="empty" aria-labelledby="empty-heading">
        <img className="empty__art" src={sadCalendar} alt="" width="104" height="104" />
        <h2 id="empty-heading">No assignments yet</h2>
        <p>
          Add one and duely makes you a study guide for it: a day-by-day plan for the time you have left, so you
          know what to do today.
        </p>
        <Link to="/add" className="btn btn--solid">
          + Add assignment
        </Link>
      </section>

      <section className="notes" aria-labelledby="notes-heading">
        <h2 id="notes-heading">A few things worth knowing</h2>
        <p>
          Every assignment gets a <strong>Study guide</strong> link, so you always know what to do next instead of
          figuring out where to start the night before.
        </p>
        <p>
          Once you have a list, it is grouped into <strong>Overdue</strong>, <strong>This week</strong> and{' '}
          <strong>Later</strong>, so the thing that needs you most is always at the top.
        </p>
        <p>
          Finished something? Click the circle next to it. It moves to Done, and there is always an undo if you
          clicked the wrong one.
        </p>
        <p>
          Nothing is ever deleted, and nothing is saved until you press Save. If you are not sure how something
          works, <Link to="/help">Help</Link> is one page long.
        </p>
      </section>
    </>
  );
}
