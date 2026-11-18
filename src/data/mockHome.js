import { plasticTypes, commonlyConfused, localCoastalContent } from './learnContent';

// STUB: sample inbox. Replace with a notifications endpoint later.
// `hoursAgo` is turned into a real timestamp when the data is loaded.
export const MOCK_NOTIFICATIONS = [
  {
    id: 'n-pickup-scheduled',
    type: 'pickup',
    title: 'Pickup scheduled',
    body: 'Your Medium Bag pickup in Kadri is scheduled. Keep the plastic clean and dry.',
    hoursAgo: 2,
    unread: true,
  },
  {
    id: 'n-points-credited',
    type: 'points',
    title: '250 points credited',
    body: 'Your Large Bag from Kadri was weighed at 8.2 kg. Thank you for recycling!',
    hoursAgo: 20,
    unread: true,
  },
  {
    id: 'n-report-reviewed',
    type: 'report',
    title: 'Report status updated',
    body: 'Your report at Panambur Beach (PET Bottles) is now Being Reviewed.',
    hoursAgo: 30,
    unread: true,
  },
  {
    id: 'n-report-cleared',
    type: 'report',
    title: 'Spot cleared',
    body: 'The waste spot you reported near Kadri Park was marked Cleared.',
    hoursAgo: 72,
    unread: false,
  },
  {
    id: 'n-pickup-reminder',
    type: 'pickup',
    title: 'Pickup reminder',
    body: 'Rinse bottles and remove caps before the collector arrives.',
    hoursAgo: 96,
    unread: false,
  },
];

const byCode = (code) => plasticTypes.find(p => p.code === code);
const confused = (id) => commonlyConfused.find(c => c.id === id);
const coastal = (id) => localCoastalContent.find(c => c.id === id);

/**
 * Quick guides for the Home Learn section (6 cards: 4 guides + 2 short videos).
 * Reuses existing Learn content & images.
 * Category ids: plastic | segregation | local.
 */
export const LEARN_HIGHLIGHTS = [
  {
    id: 'g-prepare',
    kind: 'article',
    category: 'segregation',
    title: 'How to prepare plastic for pickup (rinse, remove caps and labels, dry, keep separate)',
    imageUrl: byCode(1).imageUrl,
    minutes: 2,
  },
  {
    id: 'g-confused',
    kind: 'article',
    category: 'segregation',
    title: 'Commonly confused plastics (chip packets, black plastic, "biodegradable" labels)',
    imageUrl: confused('chip-packets').imageUrl,
    minutes: 3,
  },
  {
    id: 'g-points',
    kind: 'article',
    category: 'plastic',
    title: 'How points work',
    imageUrl: byCode(2).imageUrl,
    minutes: 2,
  },
  {
    id: 'g-coast',
    kind: 'article',
    category: 'local',
    title: 'Plastic on our coast (beach bottles, temple packaging, fishing nets)',
    imageUrl: coastal('beach-tourism').imageUrl,
    minutes: 3,
  },
  {
    id: 'v-sort',
    kind: 'video',
    category: 'plastic',
    title: 'How to sort PP and HDPE at home',
    imageUrl: byCode(5).imageUrl,
    minutes: 3,
    duration: '2:40',
    videoUrl: null,
  },
  {
    id: 'v-nets',
    kind: 'video',
    category: 'local',
    title: 'Ghost nets: cleanup with local fishers',
    imageUrl: coastal('fishing-plastic').imageUrl,
    minutes: 4,
    duration: '4:05',
    videoUrl: null,
  },
];
