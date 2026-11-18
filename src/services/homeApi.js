import { pickupApi } from './pickupApi';
import { reportApi } from './reportApi';
import { businessApi } from './businessApi';
import { MOCK_NOTIFICATIONS, LEARN_HIGHLIGHTS } from '../data/mockHome';
import {
  buildContributionSummary,
  buildUpcomingPickups,
  isNewContributor,
} from '../utils/homeUtils';
import { delay } from '../utils/asyncUtils';

const NOTIFICATIONS_READ_KEY = 'swachha_notifications_read';

// STUB: sample figure for "kg this month" until a backend aggregate exists.
const SAMPLE_KG_THIS_MONTH = 6.4;

const readReadIds = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_READ_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
};

/**
 * Home screen data.
 * Reuses the existing pickup, report and business services and adds sample notifications
 * and Learn highlights. Swap the bodies for backend calls later; the shapes stay the same.
 */
export const homeApi = {
  getOverview: async () => {
    await delay(300);

    const [pickups, profile, reports, business] = await Promise.all([
      pickupApi.getPickups(),
      pickupApi.getProfile(),
      reportApi.getReports(),
      businessApi.getSubscription(),
    ]);

    const base = buildContributionSummary({ pickups, profile, reports });
    const isNewUser = isNewContributor(base);
    const summary = { ...base, kgThisMonth: isNewUser ? 0 : SAMPLE_KG_THIS_MONTH };

    // Brand-new users have nothing in their inbox yet
    const readIds = readReadIds();
    const notifications = isNewUser
      ? []
      : MOCK_NOTIFICATIONS.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          createdAt: new Date(Date.now() - n.hoursAgo * 3600 * 1000).toISOString(),
          unread: n.unread && !readIds.has(n.id),
        }));

    return {
      summary,
      // Planned trash-bank drop-offs cannot be scheduled in the app yet, so none are passed in
      upcoming: buildUpcomingPickups({ pickups, business, dropOffs: [] }),
      notifications,
      learn: LEARN_HIGHLIGHTS.map(item => ({ ...item })),
      isNewUser,
    };
  },

  markNotificationsRead: async (ids) => {
    const readIds = readReadIds();
    ids.forEach(id => readIds.add(id));
    try {
      localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify([...readIds]));
    } catch {
      // ignore storage errors
    }
  },
};

