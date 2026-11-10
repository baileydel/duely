import CheckIcon from './CheckIcon.jsx';

export default function DoneList({ items, open, onToggle, onUndo }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="done" aria-labelledby="done-heading">
      <div className="done__head">
        <h2 id="done-heading" className="done__label">
          Done ({items.length})
        </h2>
        <button
          type="button"
          className="link"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="done-list"
        >
          {open ? 'hide' : 'show'}
        </button>
      </div>

      {open && (
        <ul id="done-list" className="done__list">
          {items.map((a) => (
            <li key={a.id} className="done-row">
              <span className="done-check">
                <CheckIcon size={15} white />
              </span>
              <span className="done-row__name">
                <s>{a.name}</s>
                <span className="visually-hidden"> (done)</span>
              </span>
              <span className="done-row__class">{a.className}</span>
              <button
                type="button"
                className="link done-row__undo"
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
