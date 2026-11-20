/**
 * Lightweight class name merger (`cn`) for conditional Tailwind CSS class composition.
 */
export function cn(...inputs) {
  const classes = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input.trim());
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key.trim());
      }
    }
  }
  return classes.filter(Boolean).join(' ');
}

export default cn;

