import { delay } from '../utils/asyncUtils';

const ADDRESSES_STORAGE_KEY = 'swachha_addresses';

const DEFAULT_SAMPLE_ADDRESSES = [
  {
    id: 'addr-default-1',
    label: 'Home (Sample)',
    line: 'Flat 204, Green View Apartments, Kadri Temple Road',
    locality: 'Kadri',
    isDefault: true,
  },
  {
    id: 'addr-default-2',
    label: 'Parents House (Sample)',
    line: '14, Church Cross Road, Bejai',
    locality: 'Bejai',
    isDefault: false,
  },
];

const readStoredAddresses = () => {
  try {
    const raw = localStorage.getItem(ADDRESSES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore storage read errors
  }
  return null;
};

const writeStoredAddresses = (list) => {
  try {
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage write errors
  }
  return list;
};

/**
 * Saved addresses service (async mock for future Supabase replacement).
 */
export const addressesApi = {
  getAddresses: async (fallbackLocality = 'Kadri') => {
    await delay(150);
    const existing = readStoredAddresses();
    if (existing) return existing;

    const seeded = DEFAULT_SAMPLE_ADDRESSES.map((a, idx) =>
      idx === 0 ? { ...a, locality: fallbackLocality || a.locality } : { ...a }
    );
    return writeStoredAddresses(seeded);
  },

  saveAddresses: async (addresses) => {
    await delay(100);
    return writeStoredAddresses(addresses);
  },
};

