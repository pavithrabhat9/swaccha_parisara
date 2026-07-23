// Mock pickup data for the Home Pickup feature
// Simulates a logged-in user's pickup history and points

export const DK_LOCALITIES = [
  'Kadri', 'Bejai', 'Kankanady', 'Bunder', 'Hampankatta',
  'Surathkal', 'Ullal', 'Bantwal', 'Puttur', 'Moodabidri',
  'Belthangady', 'Lalbagh', 'Pumpwell', 'Mangaladevi', 'Panambur',
];

export const QUANTITY_TIERS = [
  { id: 'small', label: 'Small Bag', description: '~1-2 kg', points: 50 },
  { id: 'medium', label: 'Medium Bag', description: '~3-5 kg', points: 120 },
  { id: 'large', label: 'Large Bag', description: '~6-10 kg', points: 250 },
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

// Mock user profile (loaded after login)
export const mockUserProfile = {
  name: 'Priya Shetty',
  phone: '9876543210',
  locality: 'Kadri',
  points: 1240,
  totalKgDiverted: 52,
};

// Mock pickup history
export const mockPickupHistory = [
  {
    id: 'PU-001',
    date: '2026-07-18',
    quantity: 'Large Bag',
    status: 'Completed',
    pointsEarned: 250,
    locality: 'Kadri',
  },
  {
    id: 'PU-002',
    date: '2026-07-10',
    quantity: 'Medium Bag',
    status: 'Completed',
    pointsEarned: 120,
    locality: 'Kadri',
  },
  {
    id: 'PU-003',
    date: '2026-07-03',
    quantity: 'Small Bag',
    status: 'Completed',
    pointsEarned: 50,
    locality: 'Kadri',
  },
  {
    id: 'PU-004',
    date: '2026-06-25',
    quantity: 'Large Bag',
    status: 'Completed',
    pointsEarned: 250,
    locality: 'Kadri',
  },
  {
    id: 'PU-005',
    date: '2026-06-15',
    quantity: 'Medium Bag',
    status: 'Completed',
    pointsEarned: 120,
    locality: 'Kadri',
  },
  {
    id: 'PU-006',
    date: '2026-07-21',
    quantity: 'Medium Bag',
    status: 'Scheduled',
    pointsEarned: null,
    locality: 'Kadri',
  },
  {
    id: 'PU-007',
    date: '2026-07-20',
    quantity: 'Small Bag',
    status: 'Requested',
    pointsEarned: null,
    locality: 'Bejai',
  },
];
