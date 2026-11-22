import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGreetingKey,
  getFirstName,
  getInitials,
  getTodayIst,
  isCurrentMonthIst,
  buildContributionSummary,
  buildUpcomingPickups,
  isNewContributor,
} from '../src/utils/homeUtils.js';
import { formatShortDate } from '../src/utils/dateUtils.js';

test('getGreetingKey evaluates hours in Asia/Kolkata (UTC+05:30)', () => {
  // 03:00 UTC = 08:30 IST -> morning
  assert.equal(getGreetingKey(new Date('2026-11-22T03:00:00.000Z')), 'home_greeting_morning');
  // 06:29 UTC = 11:59 IST -> morning
  assert.equal(getGreetingKey(new Date('2026-11-22T06:29:00.000Z')), 'home_greeting_morning');
  // 06:30 UTC = 12:00 IST -> afternoon
  assert.equal(getGreetingKey(new Date('2026-11-22T06:30:00.000Z')), 'home_greeting_afternoon');
  // 11:29 UTC = 16:59 IST -> afternoon
  assert.equal(getGreetingKey(new Date('2026-11-22T11:29:00.000Z')), 'home_greeting_afternoon');
  // 11:30 UTC = 17:00 IST -> evening
  assert.equal(getGreetingKey(new Date('2026-11-22T11:30:00.000Z')), 'home_greeting_evening');
  // 22:00 UTC = 03:30 IST next day -> evening (before 5am)
  assert.equal(getGreetingKey(new Date('2026-11-22T22:00:00.000Z')), 'home_greeting_evening');
});

test('getFirstName extracts first name and falls back gracefully when missing', () => {
  assert.equal(getFirstName('Priya Shetty'), 'Priya');
  assert.equal(getFirstName('  Aarav  '), 'Aarav');
  assert.equal(getFirstName('', 'Resident'), 'Resident');
  assert.equal(getFirstName(null, 'Resident'), 'Resident');
  assert.equal(getFirstName('   ', 'Resident'), 'Resident');
  const longName = 'Venkatanarasimharajuvaripeta Subramanyam';
  assert.equal(getFirstName(longName), 'Venkatanarasimharajuvaripeta');
});

test('getInitials handles empty, single, and multi-word names', () => {
  assert.equal(getInitials('Priya Shetty'), 'PS');
  assert.equal(getInitials('Ravi'), 'R');
  assert.equal(getInitials(''), '?');
  assert.equal(getInitials(null), '?');
});

test('getTodayIst and isCurrentMonthIst respect Asia/Kolkata calendar boundaries', () => {
  // 2026-10-31T20:00:00.000Z is 2026-11-01 01:30:00 IST (November in India!)
  const nov1Ist = new Date('2026-10-31T20:00:00.000Z');
  assert.equal(getTodayIst(nov1Ist), '2026-11-01');
  assert.equal(isCurrentMonthIst('2026-11-01', nov1Ist), true);
  assert.equal(isCurrentMonthIst('2026-11-15', nov1Ist), true);
  assert.equal(isCurrentMonthIst('2026-10-31', nov1Ist), false);
});

test('buildContributionSummary derives totals purely from completed weighed pickups and reports', () => {
  const now = new Date('2026-11-22T07:00:00.000Z');
  const pickups = [
    { id: 'PU-1', status: 'Completed', weightKg: 3.4, pointsEarned: 250, date: '2026-11-20' },
    { id: 'PU-2', status: 'Completed', weightKg: 3.0, pointsEarned: 120, date: '2026-11-12' },
    { id: 'PU-3', status: 'Completed', weightKg: 45.6, pointsEarned: 870, date: '2026-10-15' },
    { id: 'PU-4', status: 'Scheduled', weightKg: null, pointsEarned: null, date: '2026-11-24' },
    { id: 'PU-5', status: 'Requested', weightKg: 5, pointsEarned: null, date: '2026-11-25' },
    { id: 'PU-6', status: 'Cancelled', weightKg: 10, pointsEarned: 200, date: '2026-11-10' },
  ];
  const reports = [
    { id: 'RPT-0002' },
    { id: 'RPT-0005' },
    { id: 'RPT-0006' },
    { id: 'RPT-0001' }, // not user's
  ];

  const summary = buildContributionSummary({
    pickups,
    reports,
    points: 1240,
    now,
  });

  assert.equal(summary.totalKg, 52);
  assert.equal(summary.pickupsCompleted, 3);
  assert.equal(summary.reportsMade, 3);
  assert.equal(summary.kgThisMonth, 6.4);
  assert.equal(summary.points, 1240);
  assert.equal(isNewContributor(summary), false);
});

test('buildContributionSummary returns 0s and isNewContributor=true for new user', () => {
  const summary = buildContributionSummary({
    pickups: [],
    reports: [],
    points: 0,
    now: new Date('2026-11-22T07:00:00.000Z'),
  });
  assert.equal(summary.totalKg, 0);
  assert.equal(summary.pickupsCompleted, 0);
  assert.equal(summary.reportsMade, 0);
  assert.equal(summary.kgThisMonth, 0);
  assert.equal(summary.points, 0);
  assert.equal(isNewContributor(summary), true);
});

test('buildUpcomingPickups filters out completed, cancelled, and past missed pickups and sorts by date', () => {
  const now = new Date('2026-11-22T07:00:00.000Z'); // 2026-11-22 IST
  const pickups = [
    { id: 'PU-PAST-MISSED', status: 'Scheduled', date: '2026-11-19', quantity: 'Small Bag', locality: 'Kadri' },
    { id: 'PU-COMPLETED', status: 'Completed', date: '2026-11-25', quantity: 'Large Bag', locality: 'Kadri' },
    { id: 'PU-CANCELLED', status: 'Cancelled', date: '2026-11-25', quantity: 'Medium Bag', locality: 'Kadri' },
    { id: 'PU-LATER', status: 'Requested', date: '2026-11-25', quantity: 'Small Bag', locality: 'Bejai' },
    { id: 'PU-SOONER', status: 'Scheduled', date: '2026-11-23', quantity: 'Medium Bag', locality: 'Kadri' },
  ];

  const upcoming = buildUpcomingPickups({ pickups, business: null, dropOffs: [], now });
  assert.equal(upcoming.length, 2);
  assert.equal(upcoming[0].id, 'PU-SOONER');
  assert.equal(upcoming[1].id, 'PU-LATER');
});

test('formatShortDate formats dates using Intl for the active language (en and kn)', () => {
  const enStr = formatShortDate('2026-11-22', 'en');
  const knStr = formatShortDate('2026-11-22', 'kn');
  assert.ok(enStr.includes('22') && enStr.includes('2026'));
  assert.ok(knStr.includes('22') && knStr.includes('2026'));
});
