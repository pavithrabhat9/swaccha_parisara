# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: residents of Dakshina Kannada (Mangaluru, Udupi region) using mid-range phones, often outdoors and on patchy mobile data, who want to report plastic waste or request a pickup quickly. Secondary: businesses with recurring plastic waste, NGOs, and municipal officials. Languages: English and Kannada (Tulu, Konkani, Beary shown as coming soon).

## Product Purpose
Swachha Parisara is a PWA for reporting plastic waste on a map, requesting home pickups or trash-bank drop-offs, earning recycling points, and learning correct segregation. Success: a resident completes a report or pickup request in under a minute, and sees visible local impact.

## Positioning
A civic plastic-waste utility grounded in Dakshina Kannada: local drop points, Kannada-first copy, resin-code segregation guidance and a shared community map. A generic recycling app cannot claim this local operational truth.

## Operating Context
Used standing outdoors next to waste, one-handed, in sun, on slow data. Offline and slow-network fallbacks, camera/location permission fallbacks and sample (mock) data are factual parts of the product today.

## Capabilities and Constraints
Routes: /home, /map, /report, /pickup (home pickup, trash bank, business), /rewards, /profile, /learn, /learn/plastic-types, /business, /auth, /privacy, /terms. Stack: React 19, Vite, Tailwind CSS 4, react-i18next, Leaflet. All data is mock. Rewards are points only (no cash/payment). AI photo classification is a mock and never awards points.

## Brand Commitments
Name "Swachha Parisara", English plus Kannada, current features and routes are binding. All visual identity (palette, type, logo mark, illustration) is explicitly free to change (user confirmed).

## Evidence on Hand
No real testimonials, official statistics, or partner logos exist; none may be fabricated. All figures in the UI are sample data and must stay labelled as such.

## Product Principles
1. Fast and legible outdoors beats decorative.
2. Credibility first: precise, calm, trustworthy, as a public service should be.
3. Kannada and English are equal citizens in layout and type.
4. Every flow has a working offline, error and permission-denied path.
5. Never claim impact, money, or approval the product does not deliver.

## Accessibility & Inclusion
WCAG AA contrast, 44px touch targets, reduced-motion support, Kannada script rendering with a proper Kannada-capable typeface, usable on low-end devices.

