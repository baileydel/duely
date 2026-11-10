import { useEffect, useRef } from 'react';

/**
 * Confirmation note after an action, with a one-click undo when the action
 * can be undone. The live region is always rendered so screen readers
 * announce the message when it appears.
 *
 * strip: { message, undoable, undoLabel, focus } | null
 */
export default function UndoStrip({ strip, onUndo }) {
  const undoRef = useRef(null);

  useEffect(() => {
    if (strip?.focus) {
      undoRef.current?.focus();
    }
  }, [strip]);

  return (
    <div className="strip-slot" role="status" aria-live="polite">
      {strip && (
        <div className="strip spread">
          <span>{strip.message}</span>
          {strip.undoable && (
            <button ref={undoRef} type="button" className="link" onClick={onUndo} aria-label={strip.undoLabel}>
              undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
