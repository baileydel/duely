import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { colorHex } from '../colors.js';
import { formatShort, relativeLabel } from '../dates.js';
import { formatHours } from '../hours.js';

/** First line of the note, kept short, so pasted instructions don't swamp the list. */
function shortNote(note) {
  const first = (note ?? '').trim().split('\n')[0].trim();
  return first.length > 90 ? `${first.slice(0, 88).trimEnd()}…` : first;
}

/** In the Today list every row is for today, so only say when a planned day slipped past. */
function workOnLabel(workOn, today, inToday) {
  if (inToday) {
    return workOn < today ? `planned ${formatShort(workOn, today)}` : null;
  }
  return `work on ${workOn <= today ? 'today' : formatShort(workOn, today)}`;
}

export default function AssignmentRow({ item, today, onDone, focusMe, inToday = false }) {
  const workOn = workOnLabel(item.workOn, today, inToday);
  const buttonRef = useRef(null);
  const late = item.days < 0;

  useEffect(() => {
    if (focusMe) {
      buttonRef.current?.focus();
    }
  }, [focusMe]);

  return (
    <li className="row line">
      <button
        ref={buttonRef}
        type="button"
        className="circle"
        onClick={() => onDone(item)}
        aria-label={`Mark "${item.name}" done`}
        title="Mark done"
      />

      <div>
        <h3>
          <Link to={`/guide/${item.id}`}>{item.name}</Link>
        </h3>
        <p className="muted">
          <span className="dot" style={{ background: colorHex(item.color) }} aria-hidden="true" />
          {item.className}
          {item.hours && (
            <>
              {' · '}
              <span className="hours">about {formatHours(item.hours)}</span>
            </>
          )}
          {workOn && <> · {workOn}</>}
          {item.note && <> · {shortNote(item.note)}</>}
        </p>
      </div>

      <div className="row__due">
        <strong className={late ? 'late' : ''}>{relativeLabel(item.days)}</strong>
        <p className="muted">
          {late ? 'was ' : ''}
          {formatShort(item.due, today)}
        </p>
      </div>
    </li>
  );
}
