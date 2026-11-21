import React from 'react';
import { BagSmallIcon, BagMediumIcon, BagLargeIcon } from '../components/ui/Icons';

export function getBagDetails(quantity) {
  const q = quantity?.toLowerCase() || '';
  if (q.includes('small')) return { icon: <BagSmallIcon className="size-5" />, label: 'Small Load', weight: '1–2 kg' };
  if (q.includes('large')) return { icon: <BagLargeIcon className="size-5" />, label: 'Large Load', weight: '6–10 kg' };
  return { icon: <BagMediumIcon className="size-5" />, label: 'Standard Load', weight: '3–5 kg' };
}
