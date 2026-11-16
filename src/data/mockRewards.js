// STUB: Sample data for the Rewards screen (badges, leaderboards, and NGO donation causes).
// All names are first-name + initial only; no political/official references.

export const BADGE_CATEGORIES = [
  { id: 'Pickup', labelKey: 'rewards_cat_pickup' },
  { id: 'Report', labelKey: 'rewards_cat_report' },
  { id: 'Streak', labelKey: 'rewards_cat_streak' },
  { id: 'Plastic type', labelKey: 'rewards_cat_plastic' },
];

export const REWARDS_BADGES = [
  // Pickup category
  {
    id: 'starter',
    category: 'Pickup',
    titleKey: 'pickup_badge_first_pickup',
    descKey: 'pickup_badge_first_pickup_desc',
    unlocked: true,
  },
  {
    id: 'bronze',
    category: 'Pickup',
    titleKey: 'pickup_badge_50kg',
    descKey: 'pickup_badge_50kg_desc',
    unlocked: true,
  },
  {
    id: 'gold',
    category: 'Pickup',
    titleKey: 'rewards_badge_10_pickups',
    descKey: 'rewards_badge_10_pickups_unlock',
    unlocked: false,
  },
  // Report category
  {
    id: 'starter',
    category: 'Report',
    titleKey: 'rewards_badge_first_report',
    descKey: 'rewards_badge_first_report_desc',
    unlocked: true,
  },
  {
    id: 'silver',
    category: 'Report',
    titleKey: 'rewards_badge_coastal_scout',
    descKey: 'rewards_badge_coastal_scout_unlock',
    unlocked: false,
  },
  // Streak category
  {
    id: 'bronze',
    category: 'Streak',
    titleKey: 'rewards_badge_3_week_streak',
    descKey: 'rewards_badge_3_week_streak_desc',
    unlocked: true,
  },
  {
    id: 'champion',
    category: 'Streak',
    titleKey: 'rewards_badge_month_streak',
    descKey: 'rewards_badge_month_streak_unlock',
    unlocked: false,
  },
  // Plastic type category
  {
    id: 'silver',
    category: 'Plastic type',
    titleKey: 'rewards_badge_pet_pro',
    descKey: 'rewards_badge_pet_pro_desc',
    unlocked: true,
  },
  {
    id: 'gold',
    category: 'Plastic type',
    titleKey: 'rewards_badge_hdpe_hero',
    descKey: 'rewards_badge_hdpe_hero_unlock',
    unlocked: false,
  },
];

// Sample Top 10 ranks for "My area" (first name + initial only)
export const SAMPLE_AREA_RANKS = [
  { rank: 1, name: 'Ananya K.', locality: 'Kadri', value: 2840, unit: 'pts' },
  { rank: 2, name: 'Rohan M.', locality: 'Bejai', value: 2390, unit: 'pts' },
  { rank: 3, name: 'Deepa S.', locality: 'Kadri', value: 1920, unit: 'pts' },
  { rank: 4, name: 'Karthik R.', locality: 'Kankanady', value: 1650, unit: 'pts' },
  { rank: 5, name: 'Meera P.', locality: 'Kadri', value: 1410, unit: 'pts' },
  { rank: 6, name: 'Priya S.', locality: 'Kadri', value: 1240, unit: 'pts', isCurrentUser: true },
  { rank: 7, name: 'Vikram N.', locality: 'Lalbagh', value: 1120, unit: 'pts' },
  { rank: 8, name: 'Shreya B.', locality: 'Bejai', value: 980, unit: 'pts' },
  { rank: 9, name: 'Arjun T.', locality: 'Hampankatta', value: 840, unit: 'pts' },
  { rank: 10, name: 'Kavya D.', locality: 'Kadri', value: 710, unit: 'pts' },
];

// Sample Top 10 ranks for "By plastic type" (PET & HDPE kg diverted, first name + initial only)
export const SAMPLE_PLASTIC_TYPE_RANKS = [
  { rank: 1, name: 'Rohan M.', detail: 'PET & HDPE', value: 84, unit: 'kg' },
  { rank: 2, name: 'Ananya K.', detail: 'PET', value: 76, unit: 'kg' },
  { rank: 3, name: 'Deepa S.', detail: 'HDPE & PP', value: 65, unit: 'kg' },
  { rank: 4, name: 'Priya S.', detail: 'PET & PP', value: 52, unit: 'kg', isCurrentUser: true },
  { rank: 5, name: 'Karthik R.', detail: 'PET', value: 47, unit: 'kg' },
  { rank: 6, name: 'Meera P.', detail: 'HDPE', value: 41, unit: 'kg' },
  { rank: 7, name: 'Vikram N.', detail: 'PP', value: 36, unit: 'kg' },
  { rank: 8, name: 'Shreya B.', detail: 'PET', value: 31, unit: 'kg' },
  { rank: 9, name: 'Arjun T.', detail: 'LDPE & PP', value: 27, unit: 'kg' },
  { rank: 10, name: 'Kavya D.', detail: 'PET', value: 22, unit: 'kg' },
];

// Sample NGO causes for donating points (no money / no cash)
export const SAMPLE_NGO_CAUSES = [
  {
    id: 'cause-beach-cleanup',
    titleKey: 'rewards_cause_beach_title',
    descKey: 'rewards_cause_beach_desc',
  },
  {
    id: 'cause-school-bins',
    titleKey: 'rewards_cause_school_title',
    descKey: 'rewards_cause_school_desc',
  },
  {
    id: 'cause-ghost-nets',
    titleKey: 'rewards_cause_nets_title',
    descKey: 'rewards_cause_nets_desc',
  },
];

export const DONATION_AMOUNTS = [100, 250, 500];

export const INITIAL_DONATIONS = [
  {
    id: 'DON-001',
    causeId: 'cause-beach-cleanup',
    causeTitle: 'Panambur & Tannirbhavi Beach Cleanup Drive (Sample)',
    points: 100,
    date: '2026-07-08',
  },
];

