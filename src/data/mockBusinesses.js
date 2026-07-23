// Mock business data for the Industry/Business Collaboration feature
// 3 businesses with different cadences for demo variety

export const CADENCE_OPTIONS = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'biweekly', label: 'Bi-weekly' },
  { id: 'weekly', label: 'Weekly' },
];

export const VOLUME_OPTIONS = [
  { id: 'small', label: 'Small (under 10 kg)' },
  { id: 'medium', label: 'Medium (10-50 kg)' },
  { id: 'large', label: 'Large (50-200 kg)' },
  { id: 'industrial', label: 'Industrial (200+ kg)' },
];

export const mockBusinesses = [
  {
    id: 'BIZ-001',
    name: 'Mangalore Fish Market Association',
    address: 'Bunder Road, Old Port, Mangaluru',
    contactPerson: 'Rajesh Kumar',
    phone: '9845012345',
    cadence: 'weekly',
    preferredDate: 'Every Monday',
    volumeEstimate: 'large',
    nextPickup: '2026-07-28',
    isPaused: false,
    history: [
      { date: '2026-07-21', status: 'Completed' },
      { date: '2026-07-14', status: 'Completed' },
      { date: '2026-07-07', status: 'Skipped' },
      { date: '2026-06-30', status: 'Completed' },
    ],
  },
  {
    id: 'BIZ-002',
    name: 'Ideal Ice Cream Factory Outlet',
    address: 'Hampankatta, Mangaluru',
    contactPerson: 'Suresh Kamath',
    phone: '9876098765',
    cadence: 'biweekly',
    preferredDate: '1st and 15th',
    volumeEstimate: 'medium',
    nextPickup: '2026-08-01',
    isPaused: false,
    history: [
      { date: '2026-07-15', status: 'Completed' },
      { date: '2026-07-01', status: 'Completed' },
      { date: '2026-06-15', status: 'Completed' },
    ],
  },
  {
    id: 'BIZ-003',
    name: 'Sri Krishna Prasadam Packaging',
    address: 'Kudroli Temple Road, Mangaluru',
    contactPerson: 'Deepa Rao',
    phone: '9012345678',
    cadence: 'monthly',
    preferredDate: '1st of every month',
    volumeEstimate: 'industrial',
    nextPickup: '2026-08-01',
    isPaused: true,
    history: [
      { date: '2026-07-01', status: 'Skipped' },
      { date: '2026-06-01', status: 'Completed' },
      { date: '2026-05-01', status: 'Completed' },
    ],
  },
];
