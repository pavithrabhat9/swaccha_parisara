import React from 'react';

/**
 * SectionHeader — eyebrow + title + optional description and trailing action.
 * Used instead of plain uppercase labels to give sections real hierarchy.
 */
export default function SectionHeader({ eyebrow, title, description, action, className = '', as: Tag = 'h2' }) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-micro font-bold uppercase text-primary mb-1.5">{eyebrow}</p>
        )}
        {title && <Tag className="text-heading md:text-title text-ink">{title}</Tag>}
        {description && <p className="text-body-sm text-muted mt-1 max-w-xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

