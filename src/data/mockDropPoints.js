// STUB: sample trash-bank drop-off centers around Dakshina Kannada.
// Names, hours and distances are illustrative only. Distances are sample km from Mangaluru city centre.
// Replace with a backend query (e.g. Supabase) later; keep the same field names.

export const MOCK_DROP_POINTS = [
  {
    id: 'dp-bejai',
    name: 'Bejai Recycling Hub',
    area: 'Bejai, Mangaluru',
    address: 'Near Bejai Church, Bejai, Mangaluru',
    lat: 12.8898,
    lng: 74.8401,
    distanceKm: 2.4,
    opensAt: '09:00',
    closesAt: '18:00',
    closedDays: [0], // 0 = Sunday
  },
  {
    id: 'dp-kadri',
    name: 'Kadri Community Trash Bank',
    area: 'Kadri, Mangaluru',
    address: 'Kadri Park Road, Kadri, Mangaluru',
    lat: 12.898,
    lng: 74.8556,
    distanceKm: 3.2,
    opensAt: '08:30',
    closesAt: '17:30',
    closedDays: [0],
  },
  {
    id: 'dp-ullal',
    name: 'Ullal Beach Collection Point',
    area: 'Ullal, Mangaluru',
    address: 'Ullal Beach Road, Ullal',
    lat: 12.804,
    lng: 74.845,
    distanceKm: 12.3,
    opensAt: '10:00',
    closesAt: '16:30',
    closedDays: [0, 1], // closed Sunday and Monday
  },
  {
    id: 'dp-surathkal',
    name: 'Surathkal Plastic Drop Point',
    area: 'Surathkal',
    address: 'Market Road, Surathkal',
    lat: 13.0105,
    lng: 74.7942,
    distanceKm: 14.1,
    opensAt: '09:00',
    closesAt: '17:00',
    closedDays: [0],
  },
  {
    id: 'dp-moodabidri',
    name: 'Moodabidri Eco Centre',
    area: 'Moodabidri',
    address: 'Bus Stand Road, Moodabidri',
    lat: 13.0681,
    lng: 74.999,
    distanceKm: 34.5,
    opensAt: '09:30',
    closesAt: '17:00',
    closedDays: [0],
  },
  {
    id: 'dp-udupi',
    name: 'Udupi City Trash Bank',
    area: 'Udupi',
    address: 'Service Bus Stand Road, Udupi',
    lat: 13.3409,
    lng: 74.7421,
    distanceKm: 56.0,
    opensAt: '09:00',
    closesAt: '18:00',
    closedDays: [],
  },
];

// STUB: sample drop-off history for the signed-in user.
export const MOCK_DROP_OFF_HISTORY = [
  { id: 'DO-003', dropPointId: 'dp-kadri', date: '2026-07-19', kg: null, points: null, status: 'Awaiting weigh-in' },
  { id: 'DO-001', dropPointId: 'dp-kadri', date: '2026-07-12', kg: 3.4, points: 120, status: 'Credited' },
  { id: 'DO-002', dropPointId: 'dp-bejai', date: '2026-07-04', kg: 1.8, points: 50, status: 'Credited' },
];

