import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CheckIcon from './CheckIcon.jsx';
import { colorHex } from '../colors.js';
import { formatShort, relativeLabel } from '../dates.js';

function shortNote(note) {
  const first = (note ?? '').trim().split('\n')[0].trim();
  return first.length > 90 ? `${first.slice(0, 88).trimEnd()}…` : first;
}

export default function AssignmentRow({ item, today, onDone, isNew, focusMe }) {
  const buttonRef = useRef(null);
  const late = item.days < 0;

  useEffect(() => {
    if (focusMe) {
      buttonRef.current?.focus();
    }
  }, [focusMe]);

  return (
    <li className={`row${isNew ? ' row--new' : ''}`}>
      <button
        ref={buttonRef}
        type="button"
        className="check"
        onClick={() => onDone(item)}
        aria-label={`Mark "${item.name}" done`}
        title="Mark done"
      >
        <CheckIcon size={18} />
      </button>

      <div className="row__main">
        <h3 className="row__title">{item.name}</h3>
        <p className="row__meta">
          <span className="dot" style={{ background: colorHex(item.color) }} aria-hidden="true" />
          {item.className}
          {item.note && <> · {shortNote(item.note)}</>}
          {' · '}
          <Link to={`/guide/${item.id}`} className="row__guide">
            Study guide <span aria-hidden="true">→</span>
            <span className="visually-hidden"> for {item.name}</span>
          </Link>
        </p>
      </div>

      <div className="row__due">
        <span className={`row__rel${late ? ' row__rel--late' : ''}`}>{relativeLabel(item.days)}</span>
        <span className="row__date">
          {late ? 'was ' : ''}
          {formatShort(item.due, today)}
        </span>
      </div>
    </li>
  );
}
