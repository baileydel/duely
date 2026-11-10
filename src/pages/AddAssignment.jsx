import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Field, { describedBy } from '../components/Field.jsx';
import PageTitle from '../components/PageTitle.jsx';
import WorkDayPicker, { checkWorkDay, defaultWorkDay } from '../components/WorkDayPicker.jsx';
import { addAssignment, knownClasses } from '../api.js';
import { COLORS, DEFAULT_COLOR } from '../colors.js';
import { todayISO } from '../dates.js';
import { formatHours, readHours } from '../hours.js';
import { useBackLink } from '../navigation.js';

// Required fields can be converted to use validation microservice
const REQUIRED = ['name', 'className', 'due', 'hours', 'workOn'];

const MESSAGES = {
  name: 'Please give it a name.',
  className: 'Please say which class.',
  due: 'Please pick a due date.',
};

// quick buttons next to the hours box (IH#7)
const QUICK_HOURS = [0.5, 1, 2, 4];

const HINTS = {
  due: 'Your browser’s date picker. Today is filled in.',
  hours: 'A rough guess is fine. It shows on the assignment and adds up under Today.',
  workOn: 'Starts on the day before it’s due. On that day it shows up under Today.',
  note: 'The note is shown on the assignment’s study guide, so the instructions are right next to your plan.',
};

function validate(form, today) {
  const errors = {};
  for (const field in MESSAGES) {
    if (!form[field].trim()) errors[field] = MESSAGES[field];
  }

  const hoursError = readHours(form.hours).error;
  if (hoursError) errors.hours = hoursError;

  const workOnError = checkWorkDay(form.workOn, form.due, today);
  if (workOnError) errors.workOn = workOnError;

  return errors;
}

export default function AddAssignment() {
  const navigate = useNavigate();
  const onBack = useBackLink();
  const today = todayISO();

  const [form, setForm] = useState(() => ({
    name: '',
    className: '',
    color: DEFAULT_COLOR,
    due: today,
    hours: '',
    workOn: today,
    note: '',
  }));

  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [colorPicked, setColorPicked] = useState(false);
  const [workOnPicked, setWorkOnPicked] = useState(false);
  const [saving, setSaving] = useState(false);

  const fieldRefs = {
    name: useRef(null),
    className: useRef(null),
    due: useRef(null),
    hours: useRef(null),
    workOn: useRef(null),
  };

  useEffect(() => {
    knownClasses().then(setClasses);
  }, []);

  function update(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      // Reuse the color picked last time for a class, unless the user chose one here.
      if (field === 'className' && !colorPicked) {
        const known = classes.find((c) => c.name.toLowerCase() === value.trim().toLowerCase());
        if (known) next.color = known.color;
      }
      // Keep the work day on the day before it's due until the user picks one.
      if (field === 'due' && value && !workOnPicked) {
        next.workOn = defaultWorkDay(value, today);
      }
      return next;
    });

    // clear the error once they start fixing it
    if (errors[field] && value.trim()) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;

    const newErrors = validate(form, today);
    setErrors(newErrors);

    // jump to the first field with a problem
    const firstError = REQUIRED.find((f) => newErrors[f]);
    if (firstError) {
      fieldRefs[firstError].current?.focus();
      return;
    }

    setSaving(true);
    await addAssignment({ ...form, hours: readHours(form.hours).hours });
    
    navigate('/');
  }

  // shared props for each input
  const bind = (field) => ({
    id: field,
    ref: fieldRefs[field],
    value: form[field],
    onChange: (e) => update(field, e.target.value),
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': describedBy(field, { error: errors[field], hint: HINTS[field] }),
  });

  return (
    <>
      <div className="page-head">
        <div>
          <PageTitle docTitle="New assignment">New assignment</PageTitle>
          <p className="subtitle">
            Four quick questions, plus an optional time estimate and note. About a minute. The ones with * are
            required.
          </p>
          <p className="muted">
            Pick the day you’ll work on it, and on that day it shows up under Today.
          </p>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field id="name" label="What is it?" required error={errors.name}>
          <input className="input" type="text" autoComplete="off" placeholder="e.g. CS 361 Assignment 2" {...bind('name')} />
        </Field>

        <Field
          id="className"
          label="Which class?"
          required
          error={errors.className}
          after={
            <div className="inline" role="radiogroup" aria-labelledby="colors-label">
              <span id="colors-label" className="muted">
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
            </div>
          }
        >
          <input
            className="input"
            type="text"
            autoComplete="off"
            list="known-classes"
            placeholder="e.g. CS 361"
            {...bind('className')}
          />
          <datalist id="known-classes">
            {classes.map((c) => (
              <option key={c.name} value={c.name} />
            ))}
          </datalist>
        </Field>

        <Field id="due" label="When is it due?" required error={errors.due} hint={HINTS.due}>
          <input className="input input--short" type="date" {...bind('due')} />
        </Field>

        <Field id="hours" label="About how long will it take?" error={errors.hours} hint={HINTS.hours}>
          <div className="inline">
            <input
              className="input input--hours"
              type="number"
              inputMode="decimal"
              min="0.25"
              max="100"
              step="0.25"
              {...bind('hours')}
            />
            <span className="muted">hours</span>
            {QUICK_HOURS.map((h) => (
              <button
                key={h}
                type="button"
                className="btn chip"
                aria-pressed={Number(form.hours) === h}
                onClick={() => update('hours', String(h))}
              >
                {formatHours(h)}
              </button>
            ))}
          </div>
        </Field>

        <Field id="workOn" label="When will you work on it?" required error={errors.workOn} hint={HINTS.workOn}>
          <WorkDayPicker
            id="workOn"
            inputRef={fieldRefs.workOn}
            value={form.workOn}
            due={form.due || today}
            today={today}
            onChange={(value) => {
              setWorkOnPicked(true);
              update('workOn', value);
            }}
            invalid={Boolean(errors.workOn)}
            describedBy={bind('workOn')['aria-describedby']}
          />
        </Field>

        <Field id="note" label="What does it ask for?" hint={HINTS.note}>
          <textarea
            className="input"
            rows={4}
            maxLength={20000}
            placeholder="Paste the instructions from Canvas, or jot a note"
            {...bind('note')}
          />
        </Field>

        <div className="inline">
          <button type="submit" className="btn btn--solid" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <Link to="/" className="link" onClick={onBack}>
            cancel, go back
          </Link>
        </div>
      </form>
    </>
  );
}
