import test from 'node:test';
import assert from 'node:assert/strict';
import { storageAdapter, STORAGE_KEYS } from '../src/services/storageAdapter.js';
import { authApi } from '../src/services/authApi.js';
import { pickupApi } from '../src/services/pickupApi.js';
import { rewardsApi } from '../src/services/rewardsApi.js';
import { notificationApi } from '../src/services/notificationApi.js';
import { preferencesApi } from '../src/services/preferencesApi.js';
import { learnApi } from '../src/services/learnApi.js';
import { homeApi } from '../src/services/homeApi.js';
import { devControls } from '../src/services/devControls.js';

const DEMO_USER = {
  name: 'Priya Shetty',
  phone: '9876543210',
  locality: 'Kadri',
  accountType: 'individual',
  provider: 'phone',
};

const SECOND_USER = {
  name: 'Rohan Kamath',
  phone: '9900112233',
  locality: 'Bejai',
  accountType: 'individual',
  provider: 'phone',
};

test.beforeEach(async () => {
  storageAdapter.clear();
  devControls.setSimulation({ fail: false, delayMs: 0 });
});

test('returning demo user (9876543210) seeds 52 kg total, 6.4 kg this month, 1240 pts, and upcoming pickups', async () => {
  await authApi.saveUser(DEMO_USER);
  const overview = await homeApi.getOverview();

  assert.equal(overview.isNewUser, false);
  assert.equal(overview.summary.totalKg, 52);
  assert.equal(overview.summary.pickupsCompleted, 5);
  assert.equal(overview.summary.reportsMade, 3);
  assert.equal(overview.summary.kgThisMonth, 6.4);
  assert.equal(overview.summary.points, 1240);
  assert.equal(overview.upcoming.length, 2);
  assert.equal(overview.notifications.filter(n => n.unread).length, 3);
});

test('signing out then signing in as another user isolates data completely (0 kg, 0 pts, 0 notifications)', async () => {
  await authApi.saveUser(DEMO_USER);
  const firstOverview = await homeApi.getOverview();
  assert.equal(firstOverview.summary.totalKg, 52);

  await authApi.removeUser();
  await authApi.saveUser(SECOND_USER);

  const secondOverview = await homeApi.getOverview();
  assert.equal(secondOverview.isNewUser, true);
  assert.equal(secondOverview.summary.totalKg, 0);
  assert.equal(secondOverview.summary.pickupsCompleted, 0);
  assert.equal(secondOverview.summary.reportsMade, 0);
  assert.equal(secondOverview.summary.kgThisMonth, 0);
  assert.equal(secondOverview.summary.points, 0);
  assert.equal(secondOverview.upcoming.length, 0);
  assert.equal(secondOverview.notifications.length, 0);
});

test('rewardsApi is single source of truth for points and matches Home summary points after donation or pickup completion', async () => {
  await authApi.saveUser(DEMO_USER);

  const initialBalance = await rewardsApi.getBalance();
  const initialHome = await homeApi.getOverview();
  assert.equal(initialBalance.points, 1240);
  assert.equal(initialHome.summary.points, 1240);

  // Donate 100 points
  await rewardsApi.saveDonation({
    id: 'DON-TEST-1',
    causeId: 'cause-beach-cleanup',
    causeTitle: 'Beach Cleanup',
    points: 100,
    date: '2026-11-22',
  });

  const afterDonationBalance = await rewardsApi.getBalance();
  const afterDonationHome = await homeApi.getOverview();
  assert.equal(afterDonationBalance.points, 1140);
  assert.equal(afterDonationHome.summary.points, 1140);

  // Advance PU-006 (Scheduled -> On the way -> Completed, Medium Bag = +120 pts, +4 kg)
  await devControls.advancePickupStatus('PU-006'); // -> On the way
  const midHome = await homeApi.getOverview();
  assert.equal(midHome.summary.points, 1140); // Pending/On-the-way never awards points!

  await devControls.advancePickupStatus('PU-006'); // -> Completed
  const finalBalance = await rewardsApi.getBalance();
  const finalHome = await homeApi.getOverview();
  assert.equal(finalBalance.points, 1260);
  assert.equal(finalHome.summary.points, 1260);
  assert.equal(finalHome.summary.totalKg, 56);
});

test('notificationApi supports markRead, markAllRead, deleteNotification, and respects Profile notification toggles', async () => {
  await authApi.saveUser(DEMO_USER);

  const initialList = await notificationApi.list();
  assert.equal(initialList.length, 5);
  assert.equal(await notificationApi.getUnreadCount(), 3);

  // Mark one read (including rapid double call)
  await Promise.all([
    notificationApi.markRead('n-pickup-scheduled'),
    notificationApi.markRead('n-pickup-scheduled'),
  ]);
  assert.equal(await notificationApi.getUnreadCount(), 2);

  // Delete one notification (including rapid double call)
  await Promise.all([
    notificationApi.deleteNotification('n-points-credited'),
    notificationApi.deleteNotification('n-points-credited'),
  ]);
  const afterDelete = await notificationApi.list();
  assert.equal(afterDelete.length, 4);
  assert.equal(afterDelete.some(n => n.id === 'n-points-credited'), false);
  assert.equal(await notificationApi.getUnreadCount(), 1);

  // Disable reportStatus toggle in Profile preferences -> hides report notifications & blocks new ones
  await preferencesApi.savePreferences({ pickupUpdates: true, reportStatus: false, ngoNews: false });
  const filteredByPrefs = await notificationApi.list();
  assert.equal(filteredByPrefs.some(n => n.type === 'report'), false);

  const blocked = await notificationApi.createNotification({
    type: 'report',
    title: 'Should be blocked',
    body: 'Report status is disabled',
  });
  assert.equal(blocked, null);

  // Mark all read
  await notificationApi.markAllRead();
  assert.equal(await notificationApi.getUnreadCount(), 0);
});

test('pickupApi cancelPickup removes pickup from Home upcoming list immediately', async () => {
  await authApi.saveUser(DEMO_USER);
  const before = await homeApi.getOverview();
  assert.equal(before.upcoming.some(p => p.id === 'PU-006'), true);

  await pickupApi.cancelPickup('PU-006');
  const after = await homeApi.getOverview();
  assert.equal(after.upcoming.some(p => p.id === 'PU-006'), false);
});

test('corrupted stored data falls back safely and Learn failure does not break the rest of Home', async () => {
  await authApi.saveUser(DEMO_USER);
  // Corrupt raw storage entry
  storageAdapter.setRaw(`${STORAGE_KEYS.PICKUPS}:9876543210`, '{not-valid-json');

  // Simulate Learn service failure only
  devControls.setSimulation({ fail: 'learn', delayMs: 0 });

  const overview = await homeApi.getOverview();
  assert.equal(overview.summary.totalKg, 52);
  assert.equal(overview.upcoming.length, 2);
  assert.equal(overview.learnError, true);
  assert.deepEqual(overview.learn, []);

  // Reset demo data restores clean state
  devControls.setSimulation({ fail: false, delayMs: 0 });
  await devControls.resetDemoData();
  const restored = await homeApi.getOverview();
  assert.equal(restored.learnError, false);
  assert.equal(restored.learn.length, 6);
});

test('homeApi.resolveNotificationTarget routes valid and missing/deleted targets safely without crashing', async () => {
  await authApi.saveUser(DEMO_USER);

  const validPickup = await homeApi.resolveNotificationTarget({
    type: 'pickup',
    targetId: 'PU-006',
  });
  assert.deepEqual(validPickup, {
    path: '/pickup?tab=home&pickupId=PU-006',
    missing: false,
  });

  await pickupApi.cancelPickup('PU-006');
  const cancelledPickup = await homeApi.resolveNotificationTarget({
    type: 'pickup',
    targetId: 'PU-006',
  });
  assert.deepEqual(cancelledPickup, {
    path: '/pickup?tab=home',
    missing: true,
  });

  const missingReport = await homeApi.resolveNotificationTarget({
    type: 'report',
    targetId: 'RPT-NON-EXISTENT',
  });
  assert.deepEqual(missingReport, {
    path: '/map',
    missing: true,
  });

  const pointsTarget = await homeApi.resolveNotificationTarget({
    type: 'points',
  });
  assert.deepEqual(pointsTarget, {
    path: '/rewards',
    missing: false,
  });
});

