/**
 * Editorial data for the "Know Your Plastic" (/learn/plastic-types) guide.
 * Original copy written for Dakshina Kannada households; article body remains English-only
 * while UI chrome and labels are localized through i18n keys.
 */

export const PLASTIC_TYPES_GUIDE = {
  readTimeMinutes: 5,
  subtitle: 'A practical guide to the 1 to 7 resin codes stamped on everyday bottles, tubs, bags, and wrappers.',
  introParagraphs: [
    'Not all plastic is made the same way. Each polymer melts at a different temperature and has different chemical properties, so mixing incompatible types inside a single recycling batch lowers material quality and can cause an entire load to be rejected.',
    'Checking the small code stamped underneath a bottle or container before putting it in your dry-plastic bag helps Dakshina Kannada collectors sort faster, keep clean material in circulation, and send less waste to landfills and coastal drains.',
  ],
  backgroundSection: {
    body: 'Most plastic containers carry a small triangle of three chasing arrows with a number from 1 to 7 inside. This is the Resin Identification Code, introduced so manufacturers and recyclers can tell which base polymer an item is made from.',
    note: 'The triangle symbol identifies the plastic type; it does not mean the item is accepted for recycling.',
  },
  types: [
    {
      code: 1,
      slug: 'pet',
      abbreviation: 'PET',
      fullName: 'Polyethylene Terephthalate',
      status: 'widely',
      imagePath: '/images/learn/plastic-types/pet.jpg',
      imageAlt: 'Clean clear PET drinking water bottles and transparent food jars prepared for dry recycling',
      whatItIs:
        'PET is a clear, lightweight, and strong plastic commonly used for single-serve beverages and pantry jars. It holds carbonation well and keeps moisture out, making it one of the easiest polymers to clean, shred, and spin into new bottles or polyester fibre.',
      examples: [
        'Packaged drinking water bottles',
        'Soft drink and juice bottles',
        'Clear cooking oil bottles',
        'Peanut butter, pickle, and spice jars',
      ],
      recyclabilityExplanation:
        'Widely recycled across India when empty, clean, and dry, with steady demand from bottle-to-bottle and textile recyclers.',
      tip: 'Empty completely, give a quick rinse, remove the cap, and crush the bottle flat so it takes less room in your pickup bag.',
    },
    {
      code: 2,
      slug: 'hdpe',
      abbreviation: 'HDPE',
      fullName: 'High-Density Polyethylene',
      status: 'widely',
      imagePath: '/images/learn/plastic-types/hdpe.jpg',
      imageAlt: 'Sturdy opaque HDPE milk bottles, shampoo containers, and household detergent cans',
      whatItIs:
        'HDPE is a thicker, opaque, and durable plastic that stands up well to moisture, sunlight, and household cleaning liquids. Because it stays stable over repeated heating cycles, recyclers can turn it into sturdy pipes, crates, buckets, and new detergent bottles.',
      examples: [
        'Shampoo, conditioner, and body-wash bottles',
        'Liquid detergent and floor-cleaner cans',
        'Thick milk jugs and curd pails',
        'Household storage bins and sturdy mugs',
      ],
      recyclabilityExplanation:
        'Widely recycled and prized by local recovery units for its strength and reliable resale value.',
      tip: 'Drain leftover soap or oil completely, rinse once, and let the container dry upside down before storing it for collection.',
    },
    {
      code: 3,
      slug: 'pvc',
      abbreviation: 'PVC',
      fullName: 'Polyvinyl Chloride',
      status: 'rarely',
      imagePath: '/images/learn/plastic-types/pvc.jpg',
      imageAlt: 'PVC plumbing pipe offcuts, clear cling film roll, and rigid blister packaging',
      whatItIs:
        'PVC comes in both rigid and flexible forms, from plumbing pipes to thin food wraps and stiff clear blister packs. It contains chlorine and often includes chemical stabilisers or softeners that make it difficult and hazardous to reprocess alongside household packaging.',
      examples: [
        'Plumbing pipes and electrical conduit offcuts',
        'Kitchen cling film and stretch wrap',
        'Rigid blister packs for batteries or hardware',
        'Shower curtains and synthetic raincoats',
      ],
      recyclabilityExplanation:
        'Rarely accepted in standard household recycling because chlorine contaminates other plastic batches and requires specialised processing.',
      tip: 'Never burn PVC in backyard or open waste piles — burning it releases toxic dioxin fumes. Keep it out of regular dry-plastic bags.',
    },
    {
      code: 4,
      slug: 'ldpe',
      abbreviation: 'LDPE',
      fullName: 'Low-Density Polyethylene',
      status: 'sometimes',
      imagePath: '/images/learn/plastic-types/ldpe.jpg',
      imageAlt: 'Clean dry LDPE carry bags, bread wrappers, and flexible squeeze bottles',
      whatItIs:
        'LDPE is a soft, flexible, and slightly stretchy plastic used for thin bags, wraps, and squeezable kitchen bottles. While chemically similar to HDPE, thin films easily jam sorting machinery unless collected separately and kept completely free of food residue.',
      examples: [
        'Soft grocery carry bags and bread bags',
        'Milk pouches and frozen-food sleeves',
        'Squeeze bottles for ketchup or honey',
        'Bubble wrap and parcel mailer films',
      ],
      recyclabilityExplanation:
        'Limited recycling availability; thin film and pouches can only be recovered when washed, fully dried, and bundled apart from rigid bottles.',
      tip: 'Cut open milk pouches, rinse out every trace of dairy, dry completely, and bundle clean films together inside one dry bag.',
    },
    {
      code: 5,
      slug: 'pp',
      abbreviation: 'PP',
      fullName: 'Polypropylene',
      status: 'sometimes',
      imagePath: '/images/learn/plastic-types/pp.jpg',
      imageAlt: 'Polypropylene bottle caps, curd and ice-cream tubs, and reusable takeaway containers',
      whatItIs:
        'PP is a tough, heat-resistant plastic with a slightly waxy finish that handles hot foods and liquids without warping. It is common in kitchen tubs, bottle caps, and takeaway boxes, and is steadily gaining acceptance at dry-waste recovery facilities.',
      examples: [
        'Bottle caps and flip-top lids',
        'Curd, ghee, and ice-cream tubs',
        'Rigid restaurant takeaway boxes',
        'Drinking straws and medicine syrup caps',
      ],
      recyclabilityExplanation:
        'Increasingly recycled as more sorting centres add PP lines, especially for clean rigid tubs and separated bottle caps.',
      tip: 'Wash off oil or curry stains from takeaway tubs and store small bottle caps together in a clean jar or pouch so they do not get lost during sorting.',
    },
    {
      code: 6,
      slug: 'ps',
      abbreviation: 'PS',
      fullName: 'Polystyrene',
      status: 'rarely',
      imagePath: '/images/learn/plastic-types/ps.jpg',
      imageAlt: 'Polystyrene foam cups, takeaway trays, and disposable plastic cutlery',
      whatItIs:
        'Polystyrene appears as airy white foam (commonly called thermocol) or brittle clear disposable ware. Foam is mostly trapped air by volume, making it costly to transport, quick to crumble into coastal microplastics, and uneconomical for standard recyclers to process.',
      examples: [
        'Foam tea cups and takeaway food clamshells',
        'Thermocol appliance packing blocks',
        'Brittle disposable spoons, forks, and plates',
        'Clear rigid bakery trays',
      ],
      recyclabilityExplanation:
        'Rarely recycled in municipal or doorstep dry-waste streams due to low material density, food contamination, and fragile breakage.',
      tip: 'Avoid foam cups and single-use cutlery where possible — carry a steel tumbler or reusable box, and never crumble thermocol into loose beads outdoors.',
    },
    {
      code: 7,
      slug: 'other',
      abbreviation: 'OTHER',
      fullName: 'Mixed, Multilayer & Other Plastics',
      status: 'rarely',
      imagePath: '/images/learn/plastic-types/other.jpg',
      imageAlt: 'Multilayer snack wrappers, large polycarbonate water cans, and mixed plastic items',
      whatItIs:
        'Code 7 is a catch-all group covering polycarbonate, nylon, acrylic, some plant-based bioplastics, and multilayer packaging that fuses plastic with aluminium foil or paper. Because the bonded layers cannot be separated easily, standard recycling plants cannot process them.',
      examples: [
        'Chip packets, biscuit wrappers, and spice sachets',
        '20-litre polycarbonate water dispenser cans',
        'Laminated juice cartons and coffee pouches',
        'Sunglasses frames and small appliance casings',
      ],
      recyclabilityExplanation:
        'Generally not recycled through regular collection; multilayer wrappers require specialised co-processing rather than standard melting.',
      tip: 'Keep multilayer snack wrappers clean and dry in a separate pouch if your local drive collects them, and choose refill packs or loose staples when available.',
    },
  ],
  finalConsiderations: {
    intro:
      'Sorting resin codes makes a real difference, and a few simple habits at home keep even more plastic out of Dakshina Kannada drains and beaches.',
    points: [
      {
        title: 'Reduce and reuse first',
        body: 'Carry a cloth bag and refillable bottle, and reuse sturdy PET jars or PP tubs at home before recycling them.',
      },
      {
        title: 'Rinse and dry every item',
        body: 'Even a spoonful of milk, oil, or curry can spoil an entire sack of clean dry plastic and attract pests during storage.',
      },
      {
        title: 'Keep plastic types separate',
        body: 'Store rigid bottles apart from thin bags and small bottle caps so collectors can weigh and sort your handover cleanly.',
      },
      {
        title: 'Never burn plastic waste',
        body: 'Open burning of any plastic — especially PVC and multilayer pouches — releases toxic fumes and ash into neighbourhood air and soil.',
      },
    ],
  },
  relatedGuides: [
    {
      id: 'g-prepare',
      title: 'How to prepare plastic for pickup',
      summary: 'Rinse, remove caps and labels, dry thoroughly, and pack for doorstep collection.',
      to: '/learn?guide=g-prepare',
      readMinutes: 2,
    },
    {
      id: 'g-confused',
      title: 'Commonly confused plastics',
      summary: 'Chip packets, Tetra Pak cartons, black trays, and what "biodegradable" labels really mean.',
      to: '/learn?guide=g-confused',
      readMinutes: 3,
    },
    {
      id: 'g-coast',
      title: 'Plastic on our coast',
      summary: 'Beach bottles, temple packaging, and fishing gear across Dakshina Kannada.',
      to: '/learn?guide=g-coast',
      readMinutes: 3,
    },
  ],
};

