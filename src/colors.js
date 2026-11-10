
// Class colors offered on the Add page. The class name is always shown next
// to the dot, so color is never the only cue.
export const COLORS = [
  { id: 'blue', label: 'blue', hex: '#2F6DB5' },
  { id: 'green', label: 'green', hex: '#2E8653' },
  { id: 'amber', label: 'amber', hex: '#B7791F' },
  { id: 'red', label: 'red', hex: '#C53030' },
  { id: 'purple', label: 'purple', hex: '#6B46C1' },
  { id: 'slate', label: 'slate', hex: '#718096' },
];

export const DEFAULT_COLOR = 'blue';

export function colorHex(id) {
  return (COLORS.find((c) => c.id === id) ?? COLORS[0]).hex;
}
