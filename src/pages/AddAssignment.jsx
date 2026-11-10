import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import { addAssignment, knownClasses } from '../api.js';
import { COLORS, DEFAULT_COLOR, colorLabel } from '../colors.js';
import { todayISO } from '../dates.js';
import { useBackLink } from '../navigation.js';

// Required fields can be converted to use validation microservice
const REQUIRED = ['name', 'className', 'due'];

const MESSAGES = {
  name: 'Please give it a name.',
  className: 'Please say which class.',
  due: 'Please pick a due date.',
};

function validate(form) {
  const errors = {};
  REQUIRED.forEach((field) => {
    if (!form[field].trim()) {
      errors[field] = MESSAGES[field];
    }
  });
  return errors;
}

export default function AddAssignment() {
  const navigate = useNavigate();
  const onBack = useBackLink();

  const [form, setForm] = useState(() => ({
    name: '',
    className: '',
    color: DEFAULT_COLOR,
    due: todayISO(),
    note: '',
  }));

  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [colorPicked, setColorPicked] = useState(false);
  const [saving, setSaving] = useState(false);

  const fieldRefs = { name: useRef(null), className: useRef(null), due: useRef(null) };

  useEffect(() => {
    knownClasses().then(setClasses);
  }, []);

  function update(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      // Reuse the color picked last time for a class, unless the user chose one here.
      if (field === 'className' && !colorPicked) {
        const known = classes.find((c) => c.name.toLowerCase() === value.trim().toLowerCase());
        if (known) {
          next.color = known.color;
        }
      }
      return next;
    });

    if (errors[field] && value.trim()) {
      setErrors(({ [field]: _cleared, ...rest }) => rest);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) {
      return;
    }

    const found = validate(form);
    setErrors(found);
    const firstBad = REQUIRED.find((f) => found[f]);
    
    if (firstBad) {
      fieldRefs[firstBad].current?.focus();
      return;
    }

    setSaving(true);
    const item = await addAssignment(form);
    navigate('/', { state: { addedId: item.id } });
  }

  const describedBy = (field, hintId) =>
    [errors[field] ? `${field}-error` : null, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <>
      <div className="page-head">
        <div>
          <PageTitle docTitle="New assignment">New assignment</PageTitle>
          <p className="subtitle">
            Three fields plus an optional note. About a minute. The ones with * are required.
          </p>
          <p className="subtitle-aside">Once it’s saved, you get a study guide with a plan for the days you have left.</p>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="name">
            What is it? <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <input
            ref={fieldRefs.name}
            id="name"
            className="input"
            type="text"
            autoComplete="off"
            placeholder="e.g. CS 361 Assignment 2"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy('name')}
          />
          {errors.name && (
            <p id="name-error" className="field__error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="className">
            Which class? <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <input
            ref={fieldRefs.className}
            id="className"
            className="input"
            type="text"
            autoComplete="off"
            list="known-classes"
            placeholder="e.g. CS 361"
            value={form.className}
            onChange={(e) => update('className', e.target.value)}
            aria-invalid={Boolean(errors.className)}
            aria-describedby={describedBy('className')}
          />
          <datalist id="known-classes">
            {classes.map((c) => (
              <option key={c.name} value={c.name} />
            ))}
          </datalist>
          {errors.className && (
            <p id="className-error" className="field__error">
              {errors.className}
            </p>
          )}

          <div className="colors" role="radiogroup" aria-labelledby="colors-label">
            <span id="colors-label" className="colors__label">
              Color for this class:
            </span>
            {COLORS.map((c) => (
              <label key={c.id} className="swatch" title={c.label}>
                <input
                  type="radio"
                  name="color"
                  value={c.id}
                  checked={form.color === c.id}
                  onChange={() => {
                    setColorPicked(true);
                    update('color', c.id);
                  }}
                  aria-label={c.label}
                />
                <span style={{ '--swatch': c.hex }} />
              </label>
            ))}
            <span className="colors__hint" aria-hidden="true">
              {colorLabel(form.color)}, optional
            </span>
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="due">
            When is it due? <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </label>
          <input
            ref={fieldRefs.due}
            id="due"
            className="input input--date"
            type="date"
            value={form.due}
            onChange={(e) => update('due', e.target.value)}
            aria-invalid={Boolean(errors.due)}
            aria-describedby={describedBy('due', 'due-hint')}
          />
          {errors.due && (
            <p id="due-error" className="field__error">
              {errors.due}
            </p>
          )}
          <p id="due-hint" className="field__hint">
            Your browser’s date picker. Today is filled in.
          </p>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="note">
            What does it ask for? <span className="field__optional">optional</span>
          </label>
          <textarea
            id="note"
            className="input input--tall"
            rows={4}
            maxLength={20000}
            placeholder="Paste the instructions from Canvas, or jot a note"
            value={form.note}
            onChange={(e) => update('note', e.target.value)}
            aria-describedby="note-hint"
          />
          <p id="note-hint" className="field__hint">
            The note is shown on the assignment’s study guide, so the instructions are right next to your plan.
          </p>
        </div>

        <div className="actions">
          <button type="submit" className="btn btn--solid" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <Link to="/" className="link link--lg" onClick={onBack}>
            cancel, go back
          </Link>
        </div>
      </form>
    </>
  );
}
