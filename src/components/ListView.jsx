import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../lib/AppContext';

const ITEMS_PER_PAGE = 10;

export default function ListView() {
  const { complaints, statusFilter, allComplaints, wards } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedWardId, setExpandedWardId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const expandedRef = useRef(null);

  // Reset page when filter or expanded ward changes
  useEffect(() => { setCurrentPage(1); }, [statusFilter, expandedWardId]);

  // Scroll expanded section into view
  useEffect(() => {
    if (expandedWardId && expandedRef.current) {
      setTimeout(() => {
        expandedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [expandedWardId]);

  const filteredComplaints = useMemo(() =>
    statusFilter === 'all' ? complaints : complaints.filter(c => c.status === statusFilter)
  , [complaints, statusFilter]);

  const filteredWards = useMemo(() => {
    let w = wards;
    if (searchTerm) w = w.filter(w => w.ward_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return w.map(ward => ({
      ...ward,
      complaintCount: allComplaints.filter(c => {
        // Filter by status first
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        // Then filter by ward
        if (c.ward_id && ward.id) return c.ward_id === ward.id || c.ward_id === ward.kgis_ward_id;
        if (c.wards?.ward_name) return c.wards.ward_name === ward.ward_name;
        return false;
      }).length
    }));
  }, [wards, allComplaints, statusFilter, searchTerm]);

  const getWardComplaints = (ward) => {
    return filteredComplaints.filter(c => {
      if (c.ward_id && ward.id) return c.ward_id === ward.id || c.ward_id === ward.kgis_ward_id;
      if (c.wards?.ward_name) return c.wards.ward_name === ward.ward_name;
      return false;
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const toggleWard = (ward) => {
    if (expandedWardId === (ward.id || ward.kgis_ward_id)) {
      setExpandedWardId(null);
    } else {
      setExpandedWardId(ward.id || ward.kgis_ward_id);
    }
  };

  return (
    <div className="list-container">
      <input
        type="text"
        className="list-search"
        placeholder="Search wards by name\u2026"
        value={searchTerm}
        onChange={(e) => { setSearchTerm(e.target.value); setExpandedWardId(null); }}
      />

      {filteredWards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">{searchTerm ? 'No wards found' : 'Loading wards\u2026'}</div>
        </div>
      ) : (
        filteredWards.map((ward) => {
          const isExpanded = expandedWardId === (ward.id || ward.kgis_ward_id);
          const wardComplaints = isExpanded ? getWardComplaints(ward) : [];
          const wardTotalPages = Math.ceil(wardComplaints.length / ITEMS_PER_PAGE);
          const paginatedComplaints = wardComplaints.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
          );

          return (
            <div key={ward.id || ward.kgis_ward_id || ward.ward_name} style={{ marginBottom: '8px' }}>
              {/* Ward Card */}
              <div
                className="ward-list-item"
                onClick={() => toggleWard(ward)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ...(isExpanded ? {
                    borderColor: '#009B4D',
                    background: '#FAFFF8',
                    boxShadow: '0 2px 8px rgba(0,155,77,0.1)',
                  } : {})
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ward-list-name">{ward.ward_name}</div>
                    <div className="ward-list-meta">Ward No: {ward.ward_no}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {ward.complaintCount > 0 && (
                      <span className="ward-complaint-count">{ward.complaintCount}</span>
                    )}
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      style={{
                        transition: 'transform 0.3s ease',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        flexShrink: 0,
                      }}
                    >
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke={isExpanded ? '#009B4D' : '#C7C7CC'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Section */}
              <div ref={isExpanded ? expandedRef : null} style={{
                maxHeight: isExpanded ? '2000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), margin 0.35s ease, opacity 0.3s ease',
                marginTop: isExpanded ? '4px' : '0',
                marginBottom: isExpanded ? '12px' : '0',
                opacity: isExpanded ? 1 : 0,
              }}>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E5E5EA',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  {/* Ward info header inside expanded */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    marginBottom: '14px', paddingBottom: '12px',
                    borderBottom: '1px solid #F2F2F7'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', margin: '0 0 2px' }}>
                        {ward.ward_name}
                      </h3>
                      <span style={{ fontSize: '12px', color: '#8E8E93', fontWeight: 500 }}>
                        Ward No. {ward.ward_no} &middot; {wardComplaints.length} complaint{wardComplaints.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedWardId(null); }}
                      style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        border: 'none', background: '#F2F2F7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: '14px', color: '#8E8E93', flexShrink: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Complaints */}
                  {paginatedComplaints.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#8E8E93', marginBottom: '2px' }}>
                        No complaints yet
                      </div>
                      <div style={{ fontSize: '12px', color: '#C7C7CC' }}>
                        {statusFilter !== 'all'
                          ? `No ${statusFilter} complaints in this ward.`
                          : 'Be the first to report an issue in this ward.'}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {paginatedComplaints.map((complaint) => (
                          <div key={complaint.id} style={{
                            background: '#FAFAFA', borderRadius: '10px', padding: '12px',
                            borderLeft: `3px solid ${complaint.status === 'resolved' ? '#2E7D32' : '#DC3545'}`,
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1E' }}>
                                {complaint.waste_type}
                              </span>
                              <span className={`status-badge ${complaint.status}`}>
                                {complaint.status}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#8E8E93', lineHeight: 1.5 }}>
                              <span style={{ fontWeight: 500, color: '#48484A' }}>Location:</span>{' '}
                              {complaint.landmark_description || 'N/A'}
                              <br />
                              <span style={{ fontWeight: 500, color: '#48484A' }}>Date:</span>{' '}
                              {formatDate(complaint.created_at)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {wardTotalPages > 1 && (
                        <div className="pagination" style={{ padding: '14px 0 0' }}>
                          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
                          {Array.from({ length: Math.min(wardTotalPages, 5) }, (_, i) => {
                            const n = i + 1;
                            return <button key={n} className={currentPage === n ? 'active' : ''} onClick={() => setCurrentPage(n)}>{n}</button>;
                          })}
                          {wardTotalPages > 5 && <span style={{ color: 'var(--text-tertiary)' }}>...</span>}
                          <button disabled={currentPage === wardTotalPages} onClick={() => setCurrentPage(p => Math.min(wardTotalPages, p + 1))}>Next</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}