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
 * Learn highlights for the Home carousel.
 * Articles reuse the existing Learn content and images; the videos are sample entries.
 * `videoUrl` is optional: without it the player shows a "Video coming soon" state.
 * Category ids: plastic | segregation | local.
 */
export const LEARN_HIGHLIGHTS = [
  { id: 'a-pet', kind: 'article', category: 'plastic', title: 'PET bottles: rinse, crush, recycle', imageUrl: byCode(1).imageUrl, minutes: 2 },
  { id: 'v-sort', kind: 'video', category: 'plastic', title: 'How to sort PP and HDPE at home', imageUrl: byCode(5).imageUrl, minutes: 3, duration: '2:40', videoUrl: null },
  { id: 'a-chips', kind: 'article', category: 'segregation', title: 'Why chip packets are not recyclable', imageUrl: confused('chip-packets').imageUrl, minutes: 2 },
  { id: 'v-black', kind: 'video', category: 'segregation', title: 'Black plastic trays: where do they go?', imageUrl: confused('black-plastic').imageUrl, minutes: 3, duration: '3:15', videoUrl: null },
  { id: 'a-beach', kind: 'article', category: 'local', title: 'Beach tourism and the PET bottle problem', imageUrl: coastal('beach-tourism').imageUrl, minutes: 3 },
  { id: 'v-nets', kind: 'video', category: 'local', title: 'Ghost nets: cleanup with local fishers', imageUrl: coastal('fishing-plastic').imageUrl, minutes: 4, duration: '4:05', videoUrl: null },
  { id: 'a-hdpe', kind: 'article', category: 'plastic', title: 'HDPE: one of the safest plastics to recycle', imageUrl: byCode(2).imageUrl, minutes: 2 },
  { id: 'a-tetra', kind: 'article', category: 'segregation', title: 'Juice cartons: recyclable, but not locally', imageUrl: confused('tetra-pak').imageUrl, minutes: 3 },
];

