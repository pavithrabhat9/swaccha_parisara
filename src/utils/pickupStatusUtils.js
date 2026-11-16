/** Pickup lifecycle shown as a status line. */
export const PICKUP_STATUS_STEPS = ['Requested', 'Scheduled', 'On the way', 'Completed'];

/** i18n keys for the status line labels. */
export const STATUS_LABEL_KEYS = {
  Requested: 'requested',
  Scheduled: 'scheduled',
  'On the way': 'on_the_way',
  Completed: 'completed',
};

const ACTIVE_STATUSES = ['Requested', 'Scheduled', 'On the way'];
const PRIORITY = { 'On the way': 3, Scheduled: 2, Requested: 1 };

export const isActivePickupStatus = (status) => ACTIVE_STATUSES.includes(status);

export const getStatusStepIndex = (status) => PICKUP_STATUS_STEPS.indexOf(status);

/** The pickup to feature: furthest along first, then the most recent. */
export function getActivePickup(pickups = []) {
  const active = pickups.filter(p => isActivePickupStatus(p.status));
  active.sort(
    (a, b) =>
      (PRIORITY[b.status] || 0) - (PRIORITY[a.status] || 0) ||
      String(b.date).localeCompare(String(a.date))
  );
  return active[0] || null;
}

