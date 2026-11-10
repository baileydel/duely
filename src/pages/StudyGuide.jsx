import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Section from '../components/Section.jsx';
import { getAssignment } from '../api.js';
import { colorHex } from '../colors.js';
import { daysFromToday, formatShort, relativeLabel, todayISO } from '../dates.js';
import { formatHours } from '../hours.js';
import { useBackLink } from '../navigation.js';

// Notes longer than this are folded behind "show all" (IH#3).
const LONG_NOTE = 400;

/** "due in 2 days, Wed, Nov 11", or "2 days late, Sat, Nov 7" with the lateness in bold red */
function dueLabelFor(item, today) {
  const daysLeft = daysFromToday(item.due, today);
  const relative = daysLeft <= 0 ? relativeLabel(daysLeft) : `due ${relativeLabel(daysLeft)}`;
  return (
    <>
      {daysLeft < 0 ? <strong className="late">{relative}</strong> : relative}, {formatShort(item.due, today)}
    </>
  );
}

function PageHeader({ title, children }) {
  return (
    <div className="page-head">
      <div>
        <PageTitle docTitle={title} small>
          {title}
        </PageTitle>
        <p className="subtitle">{children}</p>
      </div>
    </div>
  );
}

/** "today" or "Wed, Nov 11" */
const dayLabel = (iso, today) => (iso <= today ? 'today' : formatShort(iso, today));

/** The day the student plans to work on it. */
function PlanSection({ item, today }) {
  return (
    <Section id="guide-plan" title="Your plan">
      <p>
        You’re working on it <strong>{dayLabel(item.workOn, today)}</strong>
        {item.hours ? (
          <>
            {' '}
            for about <strong>{formatHours(item.hours)}</strong>.
          </>
        ) : (
          '. No time estimate yet.'
        )}
        {item.workOn < today && ` You’d planned ${formatShort(item.workOn, today)}, so it moved to today.`}
      </p>
    </Section>
  );
}

/** What the assignment asks for: its note, folded when long. */
function NoteSection({ note }) {
  const isLong = note.length > LONG_NOTE;

  return (
    <Section id="guide-note" title="What it asks for">
      {isLong && (
        <details>
          <summary className="note">
            {note.slice(0, LONG_NOTE).trimEnd()}… <span className="link">show all</span>
          </summary>
          <p className="note">{note}</p>
        </details>
      )}
      {!isLong && <p className="note">{note}</p>}
    </Section>
  );
}

export default function StudyGuide() {
  const { id } = useParams();
  const onBack = useBackLink();
  const today = todayISO();

  const [item, setItem] = useState(undefined); // undefined while loading, null if not found

  useEffect(() => {
    getAssignment(id).then(setItem);
  }, [id]);

  // One back link at the top (so it's right there), and the same one at the bottom of the page.
  const topBackLink = (
    <Link to="/" className="link back-link" onClick={onBack}>
      <span aria-hidden="true">← </span>back to Due soon
    </Link>
  );
  const bottomBackLink = (
    <Link to="/" className="link" onClick={onBack}>
      back to Due soon
    </Link>
  );

  if (item === undefined) {
    return null;
  }

  if (item === null) {
    return (
      <>
        {topBackLink}
        <PageHeader title="Not found">That assignment isn’t in duely.</PageHeader>
      </>
    );
  }

  return (
    <>
      {topBackLink}

      <PageHeader title={item.name}>
        <span className="dot" style={{ background: colorHex(item.color) }} aria-hidden="true" />
        {item.className} · {dueLabelFor(item, today)}
      </PageHeader>

      {item.done && <p className="muted">You’ve marked this one done. Nice work.</p>}

      {!item.done && <PlanSection item={item} today={today} />}

      {item.note && <NoteSection note={item.note} />}

      {bottomBackLink}
    </>
  );
}
