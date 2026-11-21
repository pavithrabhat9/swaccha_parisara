import { delay } from '../utils/asyncUtils';
import { storageAdapter, STORAGE_KEYS } from './storageAdapter';

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
  const parsed = storageAdapter.get(STORAGE_KEYS.ADDRESSES, null);
  return Array.isArray(parsed) ? parsed : null;
};

const writeStoredAddresses = (list) => {
  return storageAdapter.set(STORAGE_KEYS.ADDRESSES, list);
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
