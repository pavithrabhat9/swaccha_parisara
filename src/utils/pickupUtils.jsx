import React from 'react';
import { BagSmallIcon, BagMediumIcon, BagLargeIcon } from '../components/ui/Icons';

export function getBagDetails(quantity) {
  const q = quantity?.toLowerCase() || '';
  if (q.includes('small')) return { icon: <BagSmallIcon className="w-5 h-5" />, label: 'Small Bag', weight: '~1–2 kg' };
  if (q.includes('large')) return { icon: <BagLargeIcon className="w-5 h-5" />, label: 'Large Bag', weight: '~6–10 kg' };
  return { icon: <BagMediumIcon className="w-5 h-5" />, label: 'Medium Bag', weight: '~3–5 kg' };
}
