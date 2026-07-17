import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../lib/AppContext';

export default function StatusFilterDropdown() {
  const { statusFilter, setStatusFilter, allComplaints } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const counts = React.useMemo(() => {
    const total = allComplaints.length;
    const resolved = allComplaints.filter(c => c.status === 'resolved').length;
    const unresolved = allComplaints.filter(c => c.status === 'unresolved').length;
    return { total, resolved, unresolved };
  }, [allComplaints]);

  const options = [
    { key: 'all', label: 'All', count: counts.total },
    { key: 'unresolved', label: 'Unresolved', count: counts.unresolved },
    { key: 'resolved', label: 'Resolved', count: counts.resolved },
  ];

  const selectedLabel = options.find(o => o.key === statusFilter)?.label || 'All';

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="status-filter-dropdown" ref={dropdownRef}>
      <button
        className="status-filter-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="status-filter-label">{selectedLabel}</span>
        <svg
          className={`status-filter-chevron ${isOpen ? 'open' : ''}`}
          width="10" height="6" viewBox="0 0 10 6" fill="none"
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <ul className="status-filter-menu" role="listbox" aria-label="Filter complaints">
          {options.map(opt => {
            const isSelected = statusFilter === opt.key;
            return (
              <li
                key={opt.key}
                role="option"
                aria-selected={isSelected}
                className={`status-filter-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setStatusFilter(opt.key);
                  setIsOpen(false);
                }}
              >
                {isSelected && (
                  <svg className="status-filter-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                <span className="status-filter-option-text">{opt.label}</span>
                <span className={`status-filter-option-count ${isSelected ? 'selected' : ''}`}>{opt.count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}