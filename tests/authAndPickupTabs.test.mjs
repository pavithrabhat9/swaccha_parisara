import test from 'node:test';
import assert from 'node:assert/strict';
import { storageAdapter } from '../src/services/storageAdapter.js';
import { authApi } from '../src/services/authApi.js';
import { resolvePickupTab } from '../src/utils/pickupStatusUtils.js';

test.beforeEach(() => {
  storageAdapter.clear();
});

test('authApi persists guest skip choice, clears it on login/signup, and clears it on sign out', async () => {
  assert.equal(await authApi.getGuestMode(), false);

  await authApi.setGuestMode(true);
  assert.equal(await authApi.getGuestMode(), true);

  // Logging in / signing up clears guest mode
  await authApi.saveUser({
    name: 'Priya Shetty',
    phone: '9876543210',
    locality: 'Kadri',
    accountType: 'individual',
    provider: 'phone',
  });
  assert.equal(await authApi.getGuestMode(), false);
  assert.equal((await authApi.getUser())?.name, 'Priya Shetty');

  // Signing out removes session AND explicitly clears guest mode even if it was set (so user goes to /auth, not guest mode)
  await authApi.setGuestMode(true);
  await authApi.removeUser();
  assert.equal(await authApi.getUser(), null);
  assert.equal(await authApi.getGuestMode(), false);
});

test('resolvePickupTab supports home and business and falls back to home for removed trash-bank or unknown values', () => {
  assert.equal(resolvePickupTab('home'), 'home');
  assert.equal(resolvePickupTab('business'), 'business');
  assert.equal(resolvePickupTab('trash-bank'), 'home');
  assert.equal(resolvePickupTab('unknown'), 'home');
  assert.equal(resolvePickupTab(''), 'home');
  assert.equal(resolvePickupTab(null), 'home');
  assert.equal(resolvePickupTab(undefined), 'home');
});

