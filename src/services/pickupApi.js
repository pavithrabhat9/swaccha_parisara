import { buildSeedPickups, mockUserProfile, QUANTITY_TIERS } from '../data/mockPickups';
import { PICKUP_STATUS_STEPS } from '../utils/pickupStatusUtils';
import { getCompletedPickupWeightKg } from '../utils/homeUtils';
import { storageAdapter, STORAGE_KEYS, DEMO_USER_KEY } from './storageAdapter';
import { notificationApi } from './notificationApi';
import { devControls, registerAdvancePickupHandler } from './devControls';

function resolveTierForQuantity(quantityLabel = '') {
  const q = String(quantityLabel).toLowerCase();
  if (q.includes('small')) return QUANTITY_TIERS[0];
  if (q.includes('large')) return QUANTITY_TIERS[2];
  return QUANTITY_TIERS[1];
}

function readStoredPickups() {
  const userKey = storageAdapter.getCurrentUserKey();
  const scopedKey = storageAdapter.scopedKey(STORAGE_KEYS.PICKUPS);
  const stored = storageAdapter.get(scopedKey, null);
  if (Array.isArray(stored)) return stored;

  // Fallback to legacy unscoped key if present for the demo user
  if (userKey === DEMO_USER_KEY) {
    const legacy = storageAdapter.get(STORAGE_KEYS.PICKUPS, null);
    if (Array.isArray(legacy)) {
      storageAdapter.set(scopedKey, legacy);
      return legacy;
    }
    const seeded = buildSeedPickups();
    storageAdapter.set(scopedKey, seeded);
    return seeded;
  }

  return [];
}

function writeStoredPickups(pickups) {
  const scopedKey = storageAdapter.scopedKey(STORAGE_KEYS.PICKUPS);
  return storageAdapter.set(scopedKey, pickups);
}

export const pickupApi = {
  getPickups: async () => {
    await devControls.applyServiceSimulation('pickups', 140);
    return readStoredPickups();
  },

  getPickupById: async (pickupId) => {
    if (!pickupId) return null;
    const list = readStoredPickups();
    return list.find((p) => p.id === pickupId) || null;
  },

  savePickups: async (pickups) => {
    return writeStoredPickups(pickups);
  },

  getProfile: async () => {
    await devControls.applyServiceSimulation('pickups', 100);
    const userKey = storageAdapter.getCurrentUserKey();
    const scopedKey = storageAdapter.scopedKey(STORAGE_KEYS.PROFILE);
    const stored = storageAdapter.get(scopedKey, null);
    if (stored && typeof stored === 'object') return stored;

    if (userKey === DEMO_USER_KEY) {
      const legacy = storageAdapter.get(STORAGE_KEYS.PROFILE, null);
      if (legacy && typeof legacy === 'object') return legacy;
      return { ...mockUserProfile };
    }

    const sessionUser = storageAdapter.get(STORAGE_KEYS.AUTH_SESSION, null);
    return {
      name: sessionUser?.name || '',
      phone: sessionUser?.phone || '',
      locality: sessionUser?.locality || 'Kadri',
      points: 0,
      totalKgDiverted: 0,
    };
  },

  saveProfile: async (profile) => {
    const scopedKey = storageAdapter.scopedKey(STORAGE_KEYS.PROFILE);
    return storageAdapter.set(scopedKey, profile);
  },

  cancelPickup: async (pickupId) => {
    await devControls.applyServiceSimulation('pickups', 120);
    const list = readStoredPickups();
    const next = list.map((p) =>
      p.id === pickupId ? { ...p, status: 'Cancelled' } : p
    );
    return writeStoredPickups(next);
  },

  reschedulePickup: async (pickupId, { date, timeWindow } = {}) => {
    await devControls.applyServiceSimulation('pickups', 120);
    const list = readStoredPickups();
    const next = list.map((p) =>
      p.id === pickupId
        ? {
            ...p,
            status: p.status === 'Cancelled' ? 'Scheduled' : p.status,
            ...(date ? { date } : {}),
            ...(timeWindow ? { timeWindow } : {}),
          }
        : p
    );
    return writeStoredPickups(next);
  },

  /**
   * Advances a pickup one step along `Requested -> Scheduled -> On the way -> Completed`.
   * When transitioning to `Completed`, weighs the bag (`weightKg`), credits `pointsEarned`,
   * and emits a notification if enabled in Profile preferences.
   */
  advancePickupStatus: async (pickupId) => {
    const list = readStoredPickups();
    const target = list.find((p) => p.id === pickupId);
    if (!target) return null;

    const currentIndex = PICKUP_STATUS_STEPS.indexOf(target.status);
    if (currentIndex === -1 || currentIndex >= PICKUP_STATUS_STEPS.length - 1) {
      return target;
    }

    const nextStatus = PICKUP_STATUS_STEPS[currentIndex + 1];
    const tier = resolveTierForQuantity(target.quantity);
    const isCompleting = nextStatus === 'Completed';

    const updatedPickup = {
      ...target,
      status: nextStatus,
      ...(isCompleting
        ? {
            weightKg: target.weightKg || tier.weightKg,
            pointsEarned: target.pointsEarned || tier.points,
          }
        : {}),
    };

    const nextList = list.map((p) => (p.id === pickupId ? updatedPickup : p));
    writeStoredPickups(nextList);

    if (isCompleting) {
      const totalKg = nextList
        .filter((p) => p.status === 'Completed')
        .reduce((sum, p) => sum + getCompletedPickupWeightKg(p), 0);
      const profile = await pickupApi.getProfile();
      await pickupApi.saveProfile({
        ...profile,
        totalKgDiverted: Math.round(totalKg * 10) / 10,
      });

      await notificationApi.createNotification({
        type: 'points',
        targetId: updatedPickup.id,
        title: `${updatedPickup.pointsEarned} points credited`,
        body: `Your ${updatedPickup.quantity} from ${updatedPickup.locality || 'Kadri'} was weighed at ${updatedPickup.weightKg} kg. Thank you for recycling!`,
      });
    } else {
      await notificationApi.createNotification({
        type: 'pickup',
        targetId: updatedPickup.id,
        title: `Pickup ${nextStatus.toLowerCase()}`,
        body: `Your ${updatedPickup.quantity} pickup in ${updatedPickup.locality || 'Kadri'} is now ${nextStatus}.`,
      });
    }

    return updatedPickup;
  },
};

registerAdvancePickupHandler((pickupId) => pickupApi.advancePickupStatus(pickupId));
