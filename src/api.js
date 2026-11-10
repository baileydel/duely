// Assignment storage. Uses localStorage for now

const STORAGE_KEY = 'duely.assignments.v1';

function read() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function newId() {
  // randomUUID only exists on https/localhost
  if (crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export async function listAssignments() {
  return read();
}

export async function getAssignment(id) {
  return read().find((a) => a.id === id) || null;
}

export async function addAssignment({ name, className, color, due, hours, workOn, note }) {
  const item = {
    id: newId(),
    name: name.trim(),
    className: className.trim(),
    color,
    due,
    hours,
    workOn,
    note: note ? note.trim() : '',
    done: false,
    doneAt: null,
    createdAt: Date.now(),
  };
  write([...read(), item]);
  return item;
}

export async function setDone(id, done) {
  const list = read();
  const item = list.find((a) => a.id === id);
  if (!item) return null;

  item.done = done;
  item.doneAt = done ? Date.now() : null;
  write(list);
  return item;
}

export async function knownClasses() {
  const list = read().sort((a, b) => b.createdAt - a.createdAt);
  const classes = new Map();
  
  for (const a of list) {
    const key = a.className.toLowerCase();
    
    if (!classes.has(key)) {
      classes.set(key, { name: a.className, color: a.color });
    }
  }
  return [...classes.values()];
}
