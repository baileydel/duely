import CheckIcon from './CheckIcon.jsx';

export default function DoneList({ items, open, onToggle, onUndo }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="done-heading">
      <div className="inline">
        <h2 id="done-heading" className="label muted">
          Done ({items.length})
        </h2>
        <button type="button" className="link" onClick={onToggle} aria-expanded={open} aria-controls="done-list">
          {open ? 'hide' : 'show'}
        </button>
      </div>

      {open && (
        <ul id="done-list" className="list">
          {items.map((a) => (
            <li key={a.id} className="row line">
              <span className="circle circle--done">
                <CheckIcon />
              </span>
              <p className="muted">
                <s>{a.name}</s>
                <span className="visually-hidden"> (done)</span>
                <span className="tag">{a.className}</span>
              </p>
              <button
                type="button"
                className="link"
                onClick={() => onUndo(a.id)}
                aria-label={`Undo, put "${a.name}" back in the list`}
              >
                undo
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
