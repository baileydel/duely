import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import AssignmentRow from '../components/AssignmentRow.jsx';
import DoneList from '../components/DoneList.jsx';
import UndoStrip from '../components/UndoStrip.jsx';
import EmptyState from '../components/EmptyState.jsx';
import TodayList from '../components/TodayList.jsx';
import { listAssignments, setDone } from '../api.js';
import { countWord, daysFromToday, formatLong, todayISO } from '../dates.js';

const SHOW_DONE_KEY = 'duely.showDone';

const GROUPS = [
  { key: 'overdue', label: 'Overdue', test: (d) => d < 0 },
  { key: 'week', label: 'This week', test: (d) => d >= 0 && d <= 7 },
  { key: 'later', label: 'Later', test: (d) => d > 7 },
];

function readShowDone() {
  try {
    return localStorage.getItem(SHOW_DONE_KEY) !== 'false';
  }
  catch {
    return true;
  }
}

function subtitleFor(today, upcomingCount, total) {
  const date = formatLong(today);
  if (total === 0) {
    return `${date}. Nothing added yet.`;
  }
  if (upcomingCount === 0) {
    return `${date}. Nothing left. Everything is done.`;
  }
  if (upcomingCount === 1) {
    return `${date}. One thing left.`;
  }
  return `${date}. ${countWord(upcomingCount)} things left, soonest first.`;
}

export default function Home() {
  const [items, setItems] = useState(null);
  const [strip, setStrip] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const [showDone, setShowDone] = useState(readShowDone);

  const today = todayISO();

  useEffect(() => {
    listAssignments().then(setItems);
  }, []);

  const { groups, done, upcomingCount } = useMemo(() => {
    const list = items ?? [];
    const upcoming = list
      .filter((a) => !a.done)
      .map((a) => ({ ...a, days: daysFromToday(a.due, today) }))
      .sort((a, b) => a.days - b.days || a.createdAt - b.createdAt);

    return {
      upcomingCount: upcoming.length,
      groups: GROUPS.map((g) => ({ ...g, items: upcoming.filter((a) => g.test(a.days)) })).filter(
        (g) => g.items.length > 0,
      ),
      done: list.filter((a) => a.done).sort((a, b) => b.doneAt - a.doneAt),
    };
  }, [items, today]);

  async function handleDone(item) {
    await setDone(item.id, true);
    setItems(await listAssignments());
    setFocusId(null);
    setStrip({
      id: item.id,
      message: `Marked “${item.name}” done.`,
      undoable: true,
      undoLabel: `Undo, put "${item.name}" back in the list`,
      focus: true,
    });
  }

  async function handleUndo(id) {
    await setDone(id, false);
    setItems(await listAssignments());
    setStrip((s) => (s?.id === id ? null : s));
    setFocusId(id);
  }

  function toggleDone() {
    setShowDone((open) => {
      try {
        localStorage.setItem(SHOW_DONE_KEY, String(!open));
      }
      catch {
        /* preference just won't persist */
      }
      return !open;
    });
  }

  if (items === null) {
    return null;
  }

  const isEmpty = items.length === 0;

  const renderGroup = (g) => (
    <section key={g.key} className={`group group--${g.key}`} aria-labelledby={`group-${g.key}`}>
      <h2 id={`group-${g.key}`} className="title">
        {g.label}
      </h2>
      <ul className="list">
        {g.items.map((a) => (
          <AssignmentRow key={a.id} item={a} today={today} onDone={handleDone} focusMe={a.id === focusId} />
        ))}
      </ul>
    </section>
  );

  return (
    <>
      <div className="page-head spread">
        <div>
          <PageTitle docTitle="Due soon">Due soon</PageTitle>
          <p className="subtitle">{subtitleFor(today, upcomingCount, items.length)}</p>
        </div>
        {!isEmpty && (
          <Link to="/add" className="btn">
            + Add one
          </Link>
        )}
      </div>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {groups.filter((g) => g.key === 'overdue').map(renderGroup)}

          {upcomingCount > 0 && (
            <TodayList items={items} today={today} onDone={handleDone} />
          )}

          {groups.filter((g) => g.key !== 'overdue').map(renderGroup)}

          {upcomingCount === 0 && <p className="muted line">All caught up. New assignments will show up here.</p>}

          <DoneList items={done} open={showDone} onToggle={toggleDone} onUndo={handleUndo} />
          <UndoStrip strip={strip} onUndo={() => strip && handleUndo(strip.id)} />
        </>
      )}
    </>
  );
}
