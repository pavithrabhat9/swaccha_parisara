import { plasticTypes, commonlyConfused } from '../data/learnContent';

// Tips come from the existing Learn content, so the wording matches the Learn page.
const TIPS = [
  ...plasticTypes.map(p => ({
    id: `resin-${p.code}`,
    title: `#${p.code} ${p.name}`,
    text: p.tip,
  })),
  ...commonlyConfused.map(c => ({
    id: c.id,
    title: c.title,
    text: c.description,
  })),
];

/** Rotating tip: the same tip all day, a different one tomorrow. */
export function getTipOfTheDay(date = new Date()) {
  const startOfYear = Date.UTC(date.getFullYear(), 0, 0);
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOfYear = Math.floor((today - startOfYear) / 86400000);
  return TIPS[dayOfYear % TIPS.length];
}

