import { BADGES, getBadgeForPoints } from '../data/mockPickups';

/**
 * Tier + progress to the next tier for a points balance.
 * Tiers come from BADGES (Eco Starter ... Eco Champion).
 */
export function getTierProgress(points = 0) {
  const tier = getBadgeForPoints(points);
  const index = BADGES.findIndex(b => b.id === tier.id);
  const nextTier = index !== -1 && index < BADGES.length - 1 ? BADGES[index + 1] : null;

  if (!nextTier) {
    return { tier, nextTier: null, progressPercent: 100, pointsToNext: 0, targetPoints: tier.minPoints };
  }

  const span = nextTier.minPoints - tier.minPoints;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((points - tier.minPoints) / span) * 100)));
  return {
    tier,
    nextTier,
    progressPercent,
    pointsToNext: Math.max(0, nextTier.minPoints - points),
    targetPoints: nextTier.minPoints,
  };
}

/** Privacy-friendly display name for leaderboards: "Priya Shetty" -> "Priya S." */
export function formatDisplayName(fullName = '') {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

