// Data layer for duely.
//
// Assignments are kept in the browser's localStorage for now. Every function
// is async and returns plain objects, so swapping these bodies for fetch()
// calls to a real backend later will not require any changes to the pages:
//
//   listAssignments()          GET   /api/assignments
//   getAssignment(id)          GET   /api/assignments/:id
//   addAssignment(data)        POST  /api/assignments
//   setDone(id, done)          PATCH /api/assignments/:id   { done }
//
// Nothing is ever deleted: "done" is a flag that undo flips back.

const STORAGE_KEY = 'duely.assignments.v1';

/**
 * Older versions kept AI study guides and file references on each assignment
 * (`guide`, `pdf`, `attachment`). Those features are gone, so the fields are dropped.
 */
function upgrade(assignment) {
  const { guide, pdf, attachment, ...rest } = assignment;
  return rest;
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.map(upgrade) : [];
  }
  catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function listAssignments() {
  return read();
}

export async function addAssignment({ name, className, color, due, note }) {
  const item = {
    id: newId(),
    name: name.trim(),
    className: className.trim(),
    color,
    due,
    note: (note ?? '').trim(),
    done: false,
    doneAt: null,
    createdAt: Date.now(),
  };
  write([...read(), item]);
  return item;
}

export async function getAssignment(id) {
  return read().find((a) => a.id === id) ?? null;
}

export async function setDone(id, done) {
  const list = read().map((a) =>
    a.id === id ? { ...a, done, doneAt: done ? Date.now() : null } : a,
  );
  write(list);
  return list.find((a) => a.id === id) ?? null;
}

/** Classes used before, newest first, with the color last picked for each. */
export async function knownClasses() {
  const seen = new Map();
  [...read()]
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((a) => {
      const key = a.className.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, { name: a.className, color: a.color });
      }
    });
  return [...seen.values()];
}
