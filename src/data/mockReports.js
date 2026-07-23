// Mock plastic waste reports spread across Dakshina Kannada district
// Each location uses real place names and coordinates for authenticity
// Reports at the same location are grouped with reportCount for heat-map intensity

const WASTE_TYPES = ['PET Bottles', 'Mixed Plastic', 'Beach/Coastal Debris', 'Packaging Waste', 'Other'];
const STATUSES = ['Reported', 'Being Reviewed', 'Cleared'];

// Helper to generate dates within the last 60 days
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

let _nextId = 1;
function makeId() {
  return `RPT-${String(_nextId++).padStart(4, '0')}`;
}

export const WASTE_TYPE_OPTIONS = WASTE_TYPES;
export const STATUS_OPTIONS = STATUSES;

export const initialMockReports = [
  // === COASTAL HOTSPOTS (high density) ===
  {
    id: makeId(),
    lat: 12.9362,
    lng: 74.7935,
    placeName: 'Panambur Beach',
    wasteType: 'PET Bottles',
    note: 'Large accumulation of water bottles near the food stall area after the weekend crowd.',
    photoUrl: 'https://picsum.photos/seed/panambur1/400/300',
    reportCount: 12,
    daysSinceFirst: 34,
    status: 'Being Reviewed',
    createdAt: daysAgo(34),
  },
  {
    id: makeId(),
    lat: 12.9370,
    lng: 74.7928,
    placeName: 'Panambur Beach (North End)',
    wasteType: 'Beach/Coastal Debris',
    note: 'Fishing nets and plastic floats washed ashore after monsoon winds.',
    photoUrl: 'https://picsum.photos/seed/panambur2/400/300',
    reportCount: 8,
    daysSinceFirst: 21,
    status: 'Reported',
    createdAt: daysAgo(21),
  },
  {
    id: makeId(),
    lat: 12.9085,
    lng: 74.7878,
    placeName: 'Tannirbhavi Beach',
    wasteType: 'Mixed Plastic',
    note: 'Scattered plastic bags and packaging along the shoreline, especially near the boat jetty.',
    photoUrl: 'https://picsum.photos/seed/tannirbhavi/400/300',
    reportCount: 9,
    daysSinceFirst: 28,
    status: 'Being Reviewed',
    createdAt: daysAgo(28),
  },
  {
    id: makeId(),
    lat: 12.7842,
    lng: 74.8807,
    placeName: 'Someshwara Beach',
    wasteType: 'Beach/Coastal Debris',
    note: 'Plastic waste from temple offerings and prasadam wrappers accumulating near the rocks.',
    photoUrl: 'https://picsum.photos/seed/someshwara/400/300',
    reportCount: 6,
    daysSinceFirst: 18,
    status: 'Reported',
    createdAt: daysAgo(18),
  },

  // === MANGALURU CITY WARDS (medium density) ===
  {
    id: makeId(),
    lat: 12.8898,
    lng: 74.8401,
    placeName: 'Bejai, Mangaluru',
    wasteType: 'Packaging Waste',
    note: 'Multi-layer chip packets and tetra paks dumped behind the apartment complex near Bejai Church.',
    photoUrl: 'https://picsum.photos/seed/bejai/400/300',
    reportCount: 5,
    daysSinceFirst: 15,
    status: 'Being Reviewed',
    createdAt: daysAgo(15),
  },
  {
    id: makeId(),
    lat: 12.8980,
    lng: 74.8556,
    placeName: 'Kadri, Mangaluru',
    wasteType: 'PET Bottles',
    note: 'Bottles and plastic cups near Kadri Park entrance. Overflowing from the waste bin area.',
    photoUrl: 'https://picsum.photos/seed/kadri/400/300',
    reportCount: 4,
    daysSinceFirst: 12,
    status: 'Cleared',
    createdAt: daysAgo(12),
  },
  {
    id: makeId(),
    lat: 12.8755,
    lng: 74.8430,
    placeName: 'Kankanady, Mangaluru',
    wasteType: 'Mixed Plastic',
    note: 'Mixed plastic waste piling up near the bus stop. Includes carry bags and food containers.',
    photoUrl: 'https://picsum.photos/seed/kankanady/400/300',
    reportCount: 7,
    daysSinceFirst: 22,
    status: 'Reported',
    createdAt: daysAgo(22),
  },
  {
    id: makeId(),
    lat: 12.8670,
    lng: 74.8320,
    placeName: 'Bunder, Mangaluru',
    wasteType: 'Other',
    note: 'Discarded packaging and styrofoam containers from the fish market area.',
    photoUrl: 'https://picsum.photos/seed/bunder/400/300',
    reportCount: 10,
    daysSinceFirst: 40,
    status: 'Being Reviewed',
    createdAt: daysAgo(40),
  },

  // === TRANSPORT HUBS ===
  {
    id: makeId(),
    lat: 12.8697,
    lng: 74.8430,
    placeName: 'Mangaluru Central Railway Station',
    wasteType: 'PET Bottles',
    note: 'Water bottles and snack packaging on the platform. Bins are full and overflowing.',
    photoUrl: 'https://picsum.photos/seed/central-stn/400/300',
    reportCount: 6,
    daysSinceFirst: 25,
    status: 'Being Reviewed',
    createdAt: daysAgo(25),
  },
  {
    id: makeId(),
    lat: 12.8745,
    lng: 74.8480,
    placeName: 'Mangaluru Junction',
    wasteType: 'Packaging Waste',
    note: 'Food delivery packaging and plastic bags scattered around the auto stand.',
    photoUrl: 'https://picsum.photos/seed/junction/400/300',
    reportCount: 3,
    daysSinceFirst: 8,
    status: 'Reported',
    createdAt: daysAgo(8),
  },

  // === SURROUNDING TOWNS ===
  {
    id: makeId(),
    lat: 12.8052,
    lng: 74.7640,
    placeName: 'Ullal Beach Road',
    wasteType: 'Beach/Coastal Debris',
    note: 'Plastic waste entangled in fishing nets along the Ullal coastline near the bridge.',
    photoUrl: 'https://picsum.photos/seed/ullal/400/300',
    reportCount: 5,
    daysSinceFirst: 30,
    status: 'Reported',
    createdAt: daysAgo(30),
  },
  {
    id: makeId(),
    lat: 13.0070,
    lng: 74.7940,
    placeName: 'Surathkal, NITK Road',
    wasteType: 'PET Bottles',
    note: 'Plastic bottles and cups littered near the bus stop outside NITK gate.',
    photoUrl: 'https://picsum.photos/seed/surathkal/400/300',
    reportCount: 3,
    daysSinceFirst: 10,
    status: 'Cleared',
    createdAt: daysAgo(10),
  },
  {
    id: makeId(),
    lat: 12.9050,
    lng: 75.0025,
    placeName: 'Bantwal Town Market',
    wasteType: 'Packaging Waste',
    note: 'Vegetable packaging and carry bags accumulating behind the weekly market area.',
    photoUrl: 'https://picsum.photos/seed/bantwal/400/300',
    reportCount: 4,
    daysSinceFirst: 14,
    status: 'Being Reviewed',
    createdAt: daysAgo(14),
  },
  {
    id: makeId(),
    lat: 12.7620,
    lng: 75.2035,
    placeName: 'Puttur Bus Stand',
    wasteType: 'Mixed Plastic',
    note: 'Mixed plastic waste around the bus stand. Carry bags and food wrappers everywhere.',
    photoUrl: 'https://picsum.photos/seed/puttur/400/300',
    reportCount: 3,
    daysSinceFirst: 9,
    status: 'Reported',
    createdAt: daysAgo(9),
  },

  // === ADDITIONAL SPREAD ===
  {
    id: makeId(),
    lat: 12.9089,
    lng: 74.8536,
    placeName: 'Mangaluru Town Hall Area',
    wasteType: 'Other',
    note: 'Event waste — plastic banners, cups, and plates from a recent public event.',
    photoUrl: 'https://picsum.photos/seed/townhall/400/300',
    reportCount: 2,
    daysSinceFirst: 5,
    status: 'Reported',
    createdAt: daysAgo(5),
  },
  {
    id: makeId(),
    lat: 12.8564,
    lng: 74.8363,
    placeName: 'Mangaladevi Temple Area',
    wasteType: 'Packaging Waste',
    note: 'Prasadam packaging, plastic pouches, and flower wrapping waste near the temple entrance.',
    photoUrl: 'https://picsum.photos/seed/mangaladevi/400/300',
    reportCount: 4,
    daysSinceFirst: 16,
    status: 'Being Reviewed',
    createdAt: daysAgo(16),
  },
  {
    id: makeId(),
    lat: 12.9195,
    lng: 74.8345,
    placeName: 'Lalbagh, Mangaluru',
    wasteType: 'PET Bottles',
    note: 'Bottles and wrappers around the street food vendor area on Lalbagh main road.',
    photoUrl: 'https://picsum.photos/seed/lalbagh/400/300',
    reportCount: 2,
    daysSinceFirst: 7,
    status: 'Reported',
    createdAt: daysAgo(7),
  },
  {
    id: makeId(),
    lat: 12.9500,
    lng: 74.8960,
    placeName: 'Moodabidri Jain Temples',
    wasteType: 'Packaging Waste',
    note: 'Tourist-generated packaging waste near the Thousand Pillars Basadi entrance.',
    photoUrl: 'https://picsum.photos/seed/moodabidri/400/300',
    reportCount: 2,
    daysSinceFirst: 11,
    status: 'Cleared',
    createdAt: daysAgo(11),
  },
  {
    id: makeId(),
    lat: 12.8950,
    lng: 74.8682,
    placeName: 'Pumpwell Circle, Mangaluru',
    wasteType: 'Mixed Plastic',
    note: 'Plastic waste dumped near the storm drain. Includes bottles, bags, and food trays.',
    photoUrl: 'https://picsum.photos/seed/pumpwell/400/300',
    reportCount: 6,
    daysSinceFirst: 19,
    status: 'Reported',
    createdAt: daysAgo(19),
  },
  {
    id: makeId(),
    lat: 12.8832,
    lng: 74.8495,
    placeName: 'Hampankatta, Mangaluru',
    wasteType: 'PET Bottles',
    note: 'Plastic bottle accumulation near the city centre market. Bins overflowing by afternoon.',
    photoUrl: 'https://picsum.photos/seed/hampankatta/400/300',
    reportCount: 8,
    daysSinceFirst: 26,
    status: 'Being Reviewed',
    createdAt: daysAgo(26),
  },
];

// Generate a simple unique ID for new reports
let _runtimeId = 100;
export function generateReportId() {
  return `RPT-${String(_runtimeId++).padStart(4, '0')}`;
}
