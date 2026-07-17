import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../lib/AppContext';

export default function FilterBar() {
  const { statusFilter, setStatusFilter, allComplaints } = useApp();
  const { t } = useTranslation();

  const counts = useMemo(() => {
    const total = allComplaints.length;
    const resolved = allComplaints.filter(c => c.status === 'resolved').length;
    const unresolved = allComplaints.filter(c => c.status === 'unresolved').length;
    return { total, resolved, unresolved };
  }, [allComplaints]);

  const pills = [
    { key: 'all', label: t('all'), count: counts.total },
    { key: 'resolved', label: t('resolved'), count: counts.resolved },
    { key: 'unresolved', label: t('unresolved'), count: counts.unresolved },
  ];

  return (
    <div className="filter-bar">
      {pills.map(p => (
        <button
          key={p.key}
          className={`filter-pill ${statusFilter === p.key ? 'active' : ''}`}
          onClick={() => setStatusFilter(p.key)}
          aria-pressed={statusFilter === p.key}
        >
          {p.label}
          <span className="count-badge">{p.count}</span>
        </button>
      ))}
    </div>
  );
}