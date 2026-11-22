import { delay } from '../utils/asyncUtils';
import { storageAdapter, STORAGE_KEYS, DEMO_USER_KEY } from './storageAdapter';

let simulationConfig = {
  fail: false, // false | true | 'home' | 'pickups' | 'rewards' | 'notifications' | 'learn'
  delayMs: null, // null uses default service delay; 0 skips delay in tests
};

let advancePickupHandler = null;

export function registerAdvancePickupHandler(fn) {
  advancePickupHandler = fn;
}

const isNodeTest =
  typeof globalThis !== 'undefined' && Boolean(globalThis.process?.env?.NODE_TEST_CONTEXT);

export const devControls = {
  setSimulation(next = {}) {
    simulationConfig = { ...simulationConfig, ...next };
    return simulationConfig;
  },

  getSimulation() {
    return { ...simulationConfig };
  },

  async applyServiceSimulation(serviceName, defaultDelayMs = 150) {
    const ms =
      typeof simulationConfig.delayMs === 'number'
        ? simulationConfig.delayMs
        : isNodeTest
          ? 0
          : defaultDelayMs;

    if (ms > 0) {
      await delay(ms);
    }

    if (
      simulationConfig.fail === true ||
      simulationConfig.fail === 'all' ||
      simulationConfig.fail === serviceName
    ) {
      throw new Error(`Simulated ${serviceName} service failure`);
    }
  },

  /**
   * Resets demo data back to fresh relative-dated Dakshina Kannada seed state.
   */
  async resetDemoData() {
    const user = storageAdapter.get(STORAGE_KEYS.AUTH_SESSION, {
      name: 'Priya Shetty',
      phone: DEMO_USER_KEY,
      locality: 'Kadri',
      accountType: 'individual',
      provider: 'phone',
    });
    const onboardingSeen = storageAdapter.getRaw(STORAGE_KEYS.ONBOARDING_SEEN, '1');
    storageAdapter.clear();
    storageAdapter.setRaw(STORAGE_KEYS.ONBOARDING_SEEN, onboardingSeen || '1');
    if (user) {
      storageAdapter.set(STORAGE_KEYS.AUTH_SESSION, user);
    }
    return true;
  },

  /**
   * Developer helper to advance a pickup's lifecycle (`Requested -> Scheduled -> On the way -> Completed`).
   */
  async advancePickupStatus(pickupId) {
    if (!advancePickupHandler) {
      throw new Error('pickupApi handler not registered');
    }
    return advancePickupHandler(pickupId);
  },

  resetSeed() {
    return this.resetDemoData();
  },

  resetAllData() {
    return this.resetDemoData();
  },

  simulateError(target = true) {
    return this.setSimulation({ fail: target });
  },

  simulateSlow(ms = 1200) {
    return this.setSimulation({ delayMs: ms });
  },
};

// Expose on `window.__swachhaDev` ONLY in dev builds or when VITE_ENABLE_DEV_CONTROLS === 'true'
try {
  const isDevBuild =
    (typeof import.meta !== 'undefined' &&
      (import.meta.env?.DEV || import.meta.env?.VITE_ENABLE_DEV_CONTROLS === 'true')) ||
    isNodeTest;

  if (isDevBuild && typeof window !== 'undefined') {
    window.__swachhaDev = devControls;
  }
} catch {
  // Ignore environment check in non-Vite contexts
}
