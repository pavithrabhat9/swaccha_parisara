import { pickupApi } from './pickupApi';
import { reportApi } from './reportApi';
import { businessApi } from './businessApi';
import { rewardsApi } from './rewardsApi';
import { notificationApi } from './notificationApi';
import { learnApi } from './learnApi';
import { storageAdapter } from './storageAdapter';
import { devControls } from './devControls';
import {
  buildContributionSummary,
  buildUpcomingPickups,
  isNewContributor,
} from '../utils/homeUtils';

/**
 * Home screen orchestration service.
 * Aggregates `pickupApi`, `rewardsApi` (single source of truth for points), `reportApi`,
 * `businessApi`, `notificationApi`, and `learnApi` (isolated so a Learn error does not break Home).
 */
export const homeApi = {
  getOverview: async () => {
    await devControls.applyServiceSimulation('home', 180);
    const userKey = storageAdapter.getCurrentUserKey();

    const [pickups, balance, reports, business, notifications] = await Promise.all([
      pickupApi.getPickups(),
      rewardsApi.getBalance(),
      reportApi.getReports(),
      businessApi.getSubscription(),
      notificationApi.list(),
    ]);

    let learn;
    let learnError = false;
    try {
      learn = await learnApi.getHighlights();
    } catch {
      learnError = true;
      learn = [];
    }

    const summary = buildContributionSummary({
      pickups,
      reports,
      points: balance.points,
      userKey,
    });
    const isNewUser = isNewContributor(summary);

    return {
      summary,
      upcoming: buildUpcomingPickups({ pickups, business, dropOffs: [] }),
      notifications,
      learn,
      learnError,
      isNewUser,
    };
  },

  markNotificationsRead: async (ids) => {
    return notificationApi.markRead(ids);
  },

  deleteNotification: async (id) => {
    return notificationApi.deleteNotification(id);
  },

  resolveNotificationTarget: async (notif) => {
    if (!notif) return { path: null, missing: false };
    if (notif.type === 'points') {
      return { path: '/rewards', missing: false };
    }
    if (notif.type === 'pickup') {
      if (notif.targetId) {
        const existing = await pickupApi.getPickupById(notif.targetId);
        if (!existing || existing.status === 'Cancelled') {
          return { path: '/pickup?tab=home', missing: true };
        }
        return {
          path: `/pickup?tab=home&pickupId=${encodeURIComponent(notif.targetId)}`,
          missing: false,
        };
      }
      return { path: '/pickup?tab=home', missing: false };
    }
    if (notif.type === 'report') {
      if (notif.targetId) {
        const existing = await reportApi.getReportById(notif.targetId);
        if (!existing) {
          return { path: '/map', missing: true };
        }
        return {
          path: `/map?report=${encodeURIComponent(notif.targetId)}`,
          missing: false,
        };
      }
      return { path: '/map', missing: false };
    }
    return { path: null, missing: false };
  },
};
