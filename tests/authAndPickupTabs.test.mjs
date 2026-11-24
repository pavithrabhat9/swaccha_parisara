import test from 'node:test';
import assert from 'node:assert/strict';
import { storageAdapter } from '../src/services/storageAdapter.js';
import { authApi } from '../src/services/authApi.js';
import { resolvePickupTab } from '../src/utils/pickupStatusUtils.js';
import { normalizeIdentifier, validateIdentifier, validatePassword } from '../src/utils/authUtils.js';

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

test('authUtils validates phone/email identifiers and passwords cleanly', () => {
  assert.equal(normalizeIdentifier('  +91 98451 12233 '), '9845112233');
  assert.equal(normalizeIdentifier('  Asha@Example.COM '), 'asha@example.com');
  assert.equal(validateIdentifier('9845112233').valid, true);
  assert.equal(validateIdentifier('asha@example.com').valid, true);
  assert.equal(validateIdentifier('12345').valid, false);
  assert.equal(validateIdentifier('not-an-email').valid, false);
  assert.equal(validatePassword('secret1').valid, true);
  assert.equal(validatePassword('12345').valid, false);
});

test('authApi supports sign up, credential login, duplicate check, and password reset', async () => {
  const reg = await authApi.registerAccount({
    name: 'Asha Kamath',
    phone: '9845112233',
    email: 'asha@example.com',
    locality: 'Kadri',
    password: 'password123',
  });
  assert.equal(reg.success, true);
  assert.equal(reg.user.name, 'Asha Kamath');
  assert.equal(reg.user.accountType, 'individual');

  // Duplicate phone or email rejected
  const dup = await authApi.registerAccount({
    name: 'Other Person',
    phone: '9845112233',
    locality: 'Bejai',
    password: 'password123',
  });
  assert.equal(dup.success, false);
  assert.equal(dup.error, 'auth_account_exists');

  // Login succeeds with phone or email + correct password
  const byPhone = await authApi.authenticateAccount('9845112233', 'password123');
  assert.equal(byPhone.success, true);
  assert.equal(byPhone.user.name, 'Asha Kamath');

  const byEmail = await authApi.authenticateAccount('ASHA@example.com', 'password123');
  assert.equal(byEmail.success, true);

  // Wrong password rejected
  const wrongPw = await authApi.authenticateAccount('9845112233', 'wrongpass');
  assert.equal(wrongPw.success, false);
  assert.equal(wrongPw.error, 'auth_invalid_credentials');

  // Password reset updates credentials
  const reset = await authApi.resetPassword('asha@example.com', 'newpass456');
  assert.equal(reset.success, true);

  const oldPw = await authApi.authenticateAccount('9845112233', 'password123');
  assert.equal(oldPw.success, false);

  const newPw = await authApi.authenticateAccount('9845112233', 'newpass456');
  assert.equal(newPw.success, true);
});

