// Pure keyword matcher and hardcoded Q&A knowledge base for the Ask Chatbot.
// Wording is aligned with the Learn page, Pickup page, and Points system.

export const FALLBACK_REPLY = "I don't have that information.";

export const SUGGESTED_QUESTION_ITEMS = [
  { id: 'q1', labelKey: 'ask_q1', query: 'Can I recycle PET bottles?' },
  { id: 'q2', labelKey: 'ask_q2', query: 'What do the numbers on plastic mean?' },
  { id: 'q3', labelKey: 'ask_q3', query: "Why can't chip packets be recycled?" },
  { id: 'q4', labelKey: 'ask_q4', query: 'How does home pickup work?' },
  { id: 'q5', labelKey: 'ask_q5', query: 'How do I earn points?' },
];

export const QA_ENTRIES = [
  {
    id: 'pet-bottles',
    keywords: ['pet', 'pete', '#1', 'code 1', 'water bottle', 'water bottles', 'soft drink', 'bottles', 'cooking oil'],
    answer:
      'Yes! PET / PETE (#1) — such as water bottles, soft drink bottles, and cooking oil containers — is the most widely recycled plastic worldwide. Rinse and crush the bottle before putting it in your dry recycling bag.',
  },
  {
    id: 'plastic-numbers',
    keywords: ['number', 'numbers', 'code', 'codes', 'resin', 'symbol', 'triangle', '1 to 7', 'types of plastic', 'what do the numbers'],
    answer:
      'The numbers #1 to #7 inside the triangle show the plastic resin type:\n• #1 PET (bottles) & #2 HDPE (milk/shampoo jugs): Widely recyclable.\n• #5 PP (yogurt cups, bottle caps, takeout tubs): Increasingly recyclable.\n• #4 LDPE (grocery/bread bags): Limited recycling.\n• #3 PVC (pipes), #6 PS (Styrofoam), & #7 Other (mixed/multi-layer): Not recyclable through standard curbside collection.',
  },
  {
    id: 'chip-packets',
    keywords: ['chip', 'chips', 'packet', 'packets', 'wrapper', 'wrappers', 'multi-layer', 'multilayer', 'shiny', 'snack'],
    answer:
      'Shiny chip packets and snack wrappers look like simple plastic, but they are multi-layer packaging made of bonded layers of foil, plastic, and adhesive. Standard recycling machinery cannot separate these layers, so they are not recyclable through standard channels.',
  },
  {
    id: 'home-pickup',
    keywords: ['home pickup', 'pickup', 'pick up', 'collection', 'doorstep', 'schedule', 'how does home pickup work', 'bag size', 'time window'],
    answer:
      'To schedule a free doorstep pickup, open the Pickup tab, sign in with your phone number, and choose your bag size (Small ~1–2 kg, Medium ~3–5 kg, or Large ~6–10 kg), your locality in Dakshina Kannada, and your preferred window (This Week or Next Week). Our collection vehicle batches nearby requests and notifies you before arrival.',
  },
  {
    id: 'earn-points',
    keywords: ['point', 'points', 'earn', 'reward', 'rewards', 'badge', 'badges', 'tier', 'tiers', 'silver', 'gold', 'bronze', 'champion'],
    answer:
      'You earn points for every verified home pickup of dry segregated plastic: +50 pts for a Small Bag (~1–2 kg), +120 pts for a Medium Bag (~3–5 kg), and +250 pts for a Large Bag (~6–10 kg). As your points grow, you unlock recycler tiers from Eco Starter (0+) and Bronze (300+) to Silver (1,000+), Gold (2,500+), and Eco Champion (5,000+).',
  },
  {
    id: 'hdpe',
    keywords: ['hdpe', '#2', 'code 2', 'milk jug', 'shampoo', 'detergent'],
    answer:
      'HDPE (#2 — High-Density Polyethylene) is used for milk jugs, shampoo bottles, and detergent containers. It is one of the safest and most commonly recycled plastics—rinse and dry it before adding to your pickup bag.',
  },
  {
    id: 'pvc',
    keywords: ['pvc', '#3', 'code 3', 'pipe', 'pipes', 'blister', 'chlorine'],
    answer:
      'PVC (#3 — Polyvinyl Chloride) is used in pipes, window frames, and blister packaging. It requires special handling and is rarely recycled curbside. Never burn PVC as it releases toxic chlorine fumes.',
  },
  {
    id: 'ldpe',
    keywords: ['ldpe', '#4', 'code 4', 'grocery bag', 'bread bag', 'shrink wrap', 'carry bag'],
    answer:
      'LDPE (#4 — Low-Density Polyethylene) includes grocery bags, bread bags, and shrink wrap. It has limited recyclability in standard curbside collection—keep bags clean and dry or return them to specialized collection points.',
  },
  {
    id: 'pp',
    keywords: ['pp', '#5', 'code 5', 'polypropylene', 'yogurt', 'bottle cap', 'takeout'],
    answer:
      'PP (#5 — Polypropylene) is found in yogurt cups, bottle caps, and sturdy takeout containers. It is recyclable—rinse off food residue and check for the #5 symbol before placing it in your dry waste bag.',
  },
  {
    id: 'styrofoam',
    keywords: ['ps', '#6', 'code 6', 'polystyrene', 'styrofoam', 'foam', 'thermocol', 'peanuts'],
    answer:
      'PS (#6 — Polystyrene / Styrofoam), such as foam cups and packing peanuts, is not commonly recyclable and breaks into microplastics easily. Avoid single-use foam products whenever possible.',
  },
  {
    id: 'tetra-pak',
    keywords: ['tetra', 'tetrapak', 'carton', 'juice carton', 'milk carton'],
    answer:
      'Juice cartons (Tetra Pak) are made of 3 bonded materials: paper, plastic, and aluminium. While technically recyclable at specialized facilities, most local Dakshina Kannada recyclers cannot process them.',
  },
  {
    id: 'black-plastic',
    keywords: ['black plastic', 'black tray', 'carbon dye'],
    answer:
      'Black plastic trays are coloured with carbon dye, making them invisible to near-infrared sorting sensors in recycling plants. As a result, they usually end up as landfill waste.',
  },
  {
    id: 'biodegradable',
    keywords: ['biodegradable', 'compostable', 'bioplastic'],
    answer:
      'Most "biodegradable" bags only break down in 60°C+ industrial composters. In nature or coastal waters, they fragment into microplastics just like regular plastic—treat them as regular plastic waste.',
  },
  {
    id: 'report-waste',
    keywords: ['report', 'reporting', 'spot', 'map', 'hotspot', 'beach', 'panambur', 'tannirbhavi', 'ghost net', 'temple'],
    answer:
      'You can report dumped plastic waste anonymously from the Map screen using the "+ Report" button. Add a photo, confirm the GPS pin, choose the waste type (e.g., PET Bottles, Beach/Coastal Debris, Packaging Waste), and submit.',
  },
  {
    id: 'business-pickup',
    keywords: ['business', 'shop', 'restaurant', 'office', 'commercial', 'recurring'],
    answer:
      'Shops, restaurants, and offices in Dakshina Kannada can set up recurring Weekly, Bi-weekly, or Monthly plastic waste pickups via the "For Businesses" section on the Learn or Profile page.',
  },
];

/**
 * Pure keyword matcher. Returns the best-matching Q&A answer or the exact fallback string.
 */
export function matchQuestionToAnswer(rawQuery) {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return FALLBACK_REPLY;
  }

  const normalized = rawQuery
    .toLowerCase()
    .replace(/[?.,!'"()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return FALLBACK_REPLY;
  }

  let bestEntry = null;
  let bestScore = 0;

  for (const entry of QA_ENTRIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      const target = kw.toLowerCase();
      if (normalized === target) {
        score += 10;
      } else if (target.includes(' ') && normalized.includes(target)) {
        score += 5;
      } else {
        const words = normalized.split(' ');
        if (words.includes(target)) {
          score += 3;
        } else if (target.length >= 4 && normalized.includes(target)) {
          score += 2;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestScore > 0 && bestEntry ? bestEntry.answer : FALLBACK_REPLY;
}

