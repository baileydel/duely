/**
 * One form question: its label (with * or "optional"), the input(s) passed as children,
 * then its error and hint. Inputs point at `${id}-error` and `${id}-hint` with
 * aria-describedby (see describedBy below).
 *
 * after: anything shown below the error, such as the class color swatches.
 */
export default function Field({ id, label, required = false, error, hint, after, children }) {
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}{' '}
        {required ? (
          <>
            <span aria-hidden="true">*</span>
            <span className="visually-hidden">(required)</span>
          </>
        ) : (
          <span className="muted">optional</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="error">
          {error}
        </p>
      )}
      {after}
      {hint && (
        <p id={`${id}-hint`} className="hint">
          {hint}
        </p>
      )}
    </div>
  );
}

/** The aria-describedby value for an input in a Field. */
export function describedBy(id, { error, hint }) {
  return [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
}
