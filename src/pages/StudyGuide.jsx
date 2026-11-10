import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import { getAssignment } from '../api.js';
import { colorHex } from '../colors.js';
import { addDays, daysFromToday, formatShort, relativeLabel, todayISO } from '../dates.js';
import { useBackLink } from '../navigation.js';

// Notes longer than this are folded behind "show all" (IH#3).
const LONG_NOTE = 400;

/**
 * A day-by-day plan for the days left before the due date.
 * Returns a list of { when, what } steps.
 */
function planFor(due, today) {
  const daysLeft = daysFromToday(due, today);

  if (daysLeft < 0) {
    return [
      { when: 'Today', what: 'Re-read what’s asked and do the smallest version that fully answers it.' },
      { when: 'Today', what: 'Hand it in, then check the syllabus for how late work is graded.' },
    ];
  }

  if (daysLeft === 0) {
    return [
      { when: 'Today', what: 'Read through what’s asked and list each part you need to hand in.' },
      { when: 'Today', what: 'Finish, check it against that list, and submit before the deadline.' },
    ];
  }

  const label = (date) => (date === today ? 'Today' : formatShort(date, today));
  const workDay = addDays(today, Math.max(1, Math.floor(daysLeft / 2)));
  const reviewDay = addDays(due, -1);

  const steps = [{ when: label(today), what: 'Read what’s asked and list each part you need to hand in.' }];
  if (workDay < reviewDay) {
    steps.push({ when: label(workDay), what: 'Do the main part. Leave the polishing for later.' });
  }
  steps.push({ when: label(reviewDay), what: 'Check it over against your list and fix anything missing.' });
  steps.push({ when: label(due), what: 'Submit it. Done early? Mark it done in duely.' });
  return steps;
}

/** "due in 2 days, Wed, Nov 11" or "2 days late, Sat, Nov 7" */
function dueLabelFor(item, today) {
  const daysLeft = daysFromToday(item.due, today);
  const relative = daysLeft <= 0 ? relativeLabel(daysLeft) : `due ${relativeLabel(daysLeft)}`;
  return `${relative}, ${formatShort(item.due, today)}`;
}

/** A titled section, styled like the Help page. */
function Section({ id, title, children }) {
  return (
    <section className="help-section" aria-labelledby={id}>
      <h2 id={id} className="help-heading">
        {title}
      </h2>
      {children}
    </section>
  );
}

function PageHeader({ docTitle, children }) {
  return (
    <div className="page-head">
      <div>
        <PageTitle docTitle={docTitle}>Study guide</PageTitle>
        <p className="subtitle">{children}</p>
      </div>
    </div>
  );
}

function StudyPlan({ due, today }) {
  return (
    <Section id="guide-plan" title="Your plan">
      <ol className="plan">
        {planFor(due, today).map((step, i) => (
          <li key={i}>
            <span className="plan__when">{step.when}</span>
            <span>{step.what}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** What the assignment asks for: its note, folded when long. */
function NoteSection({ note }) {
  const isLong = note.length > LONG_NOTE;

  return (
    <Section id="guide-note" title="What it asks for">
      {isLong && (
        <details className="guide-note-more">
          <summary className="guide-text">
            {note.slice(0, LONG_NOTE).trimEnd()}… <span className="guide-note-more__link">show all</span>
          </summary>
          <p className="guide-text">{note}</p>
        </details>
      )}
      {!isLong && <p className="guide-text">{note}</p>}
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
    <Link to="/" className="back-link" onClick={onBack}>
      <span aria-hidden="true">← </span>back to Due soon
    </Link>
  );
  const bottomBackLink = (
    <Link to="/" className="link link--lg" onClick={onBack}>
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
        <PageHeader docTitle="Study guide">That assignment isn’t in duely.</PageHeader>
      </>
    );
  }

  return (
    <>
      {topBackLink}

      <PageHeader docTitle={`Study guide: ${item.name}`}>
        <span className="guide-for">{item.name}</span>
        <span className="dot" style={{ background: colorHex(item.color) }} aria-hidden="true" />
        {item.className} · {dueLabelFor(item, today)}
      </PageHeader>

      {item.done && <p className="guide-done">You’ve marked this one done. Nice work.</p>}

      <StudyPlan due={item.due} today={today} />

      {item.note && <NoteSection note={item.note} />}

      {bottomBackLink}
    </>
  );
}
