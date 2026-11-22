import { getTodayIst } from '../utils/homeUtils';

export const DK_LOCALITIES = [
  'Kadri', 'Bejai', 'Kankanady', 'Bunder', 'Hampankatta',
  'Surathkal', 'Ullal', 'Bantwal', 'Puttur', 'Moodabidri',
  'Belthangady', 'Lalbagh', 'Pumpwell', 'Mangaladevi', 'Panambur',
];

export const QUANTITY_TIERS = [
  { id: 'small', label: 'Small Bag', description: '~1-2 kg', points: 50, weightKg: 2 },
  { id: 'medium', label: 'Medium Bag', description: '~3-5 kg', points: 120, weightKg: 4 },
  { id: 'large', label: 'Large Bag', description: '~6-10 kg', points: 250, weightKg: 8 },
];

export const TIME_WINDOWS = [
  { id: 'this-week', label: 'This Week' },
  { id: 'next-week', label: 'Next Week' },
];

export const BADGES = [
  { id: 'starter', label: 'Eco Starter', icon: '🌱', minPoints: 0, maxPoints: 299 },
  { id: 'bronze', label: 'Bronze Recycler', icon: '🥉', minPoints: 300, maxPoints: 999 },
  { id: 'silver', label: 'Silver Recycler', icon: '🥈', minPoints: 1000, maxPoints: 2499 },
  { id: 'gold', label: 'Gold Recycler', icon: '🥇', minPoints: 2500, maxPoints: 4999 },
  { id: 'champion', label: 'Eco Champion', icon: '🏆', minPoints: 5000, maxPoints: Infinity },
];

export function getBadgeForPoints(points) {
  return BADGES.find(b => points >= b.minPoints && points <= b.maxPoints) || BADGES[0];
}

/**
 * Helper to generate YYYY-MM-DD relative to today in IST (`Asia/Kolkata`).
 * When `forceCurrentMonth` is true, clamps the date to the 1st of the current IST month
 * if subtracting `offsetDays` would cross into the previous month.
 */
function relativeIstDate(offsetDays, { forceCurrentMonth = false, now = new Date() } = {}) {
  const todayStr = getTodayIst(now);
  const [y, m, d] = todayStr.split('-').map(Number);
  const target = new Date(Date.UTC(y, m - 1, d + offsetDays));
  const ty = target.getUTCFullYear();
  const tm = String(target.getUTCMonth() + 1).padStart(2, '0');
  const td = String(target.getUTCDate()).padStart(2, '0');
  const currentYm = todayStr.slice(0, 7);
  const candidate = `${ty}-${tm}-${td}`;

  if (forceCurrentMonth && candidate.slice(0, 7) !== currentYm) {
    return `${currentYm}-01`;
  }
  return candidate;
}

/**
 * Generates deterministic relative-dated seed pickups for the returning demo resident (`9876543210`):
 * - 5 Completed pickups totaling 52 kg (`3.4 + 3.0 + 18.6 + 15.0 + 12.0 = 52 kg`)
 *   and 1,340 earned points (`1,340 - 100 donated = 1,240 net points`).
 * - Current calendar month completed pickups total `3.4 + 3.0 = 6.4 kg`.
 * - 2 Upcoming pickups (`PU-006` Scheduled for tomorrow, `PU-007` Requested for +3 days).
 */
export function buildSeedPickups(now = new Date()) {
  return [
    {
      id: 'PU-001',
      date: relativeIstDate(-1, { forceCurrentMonth: true, now }),
      quantity: 'Large Bag',
      status: 'Completed',
      weightKg: 3.4,
      pointsEarned: 250,
      locality: 'Kadri',
    },
    {
      id: 'PU-002',
      date: relativeIstDate(-3, { forceCurrentMonth: true, now }),
      quantity: 'Medium Bag',
      status: 'Completed',
      weightKg: 3.0,
      pointsEarned: 120,
      locality: 'Kadri',
    },
    {
      id: 'PU-003',
      date: relativeIstDate(-35, { now }),
      quantity: 'Small Bag',
      status: 'Completed',
      weightKg: 12.0,
      pointsEarned: 200,
      locality: 'Kadri',
    },
    {
      id: 'PU-004',
      date: relativeIstDate(-45, { now }),
      quantity: 'Large Bag',
      status: 'Completed',
      weightKg: 18.6,
      pointsEarned: 450,
      locality: 'Kadri',
    },
    {
      id: 'PU-005',
      date: relativeIstDate(-60, { now }),
      quantity: 'Medium Bag',
      status: 'Completed',
      weightKg: 15.0,
      pointsEarned: 320,
      locality: 'Kadri',
    },
    {
      id: 'PU-006',
      date: relativeIstDate(2, { now }),
      quantity: 'Medium Bag',
      status: 'Scheduled',
      weightKg: null,
      pointsEarned: null,
      locality: 'Kadri',
      timeWindow: 'this-week',
    },
    {
      id: 'PU-007',
      date: relativeIstDate(4, { now }),
      quantity: 'Small Bag',
      status: 'Requested',
      weightKg: null,
      pointsEarned: null,
      locality: 'Bejai',
      timeWindow: 'next-week',
    },
  ];
}

// Mock user profile (loaded after login)
export const mockUserProfile = {
  name: 'Priya Shetty',
  phone: '9876543210',
  locality: 'Kadri',
  points: 1240,
  totalKgDiverted: 52,
};

export const mockPickupHistory = buildSeedPickups();
