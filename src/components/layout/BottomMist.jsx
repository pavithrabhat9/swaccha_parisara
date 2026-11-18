import React from 'react';

/**
 * Soft misty fade just above the mobile bottom bar.
 * A gradient from transparent to the page background, with a backdrop blur that is strongest
 * at the bottom (masked so it fades in smoothly). Never blocks taps (pointer-events: none).
 * Falls back to the gradient alone when backdrop-filter is unsupported (see .bottom-mist in index.css).
 * Mobile only: the desktop layout has no bottom bar.
 *
 * Add it to any tab: <BottomMist />, and leave ~160px of bottom padding so the last card scrolls clear.
 */
export default function BottomMist({ className = '' }) {
  return <div aria-hidden="true" className={`bottom-mist md:hidden ${className}`} />;
}

