import React from 'react';
import { cn } from '../../utils/cn';

/**
 * SectionHeader — title + optional description and trailing action.
 * Never places an eyebrow/kicker above a heading per craft-floor guidelines.
 */
export default function SectionHeader({ title, description, action, className = '', as: Tag = 'h2' }) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {title && <Tag className="text-heading md:text-title font-bold text-ink text-balance">{title}</Tag>}
        {description && <p className="text-body-sm text-muted text-pretty mt-1 max-w-xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
