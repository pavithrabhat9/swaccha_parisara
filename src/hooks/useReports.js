import { useState, useCallback, useEffect } from 'react';
import { initialMockReports, generateReportId } from '../data/mockReports';

const STORAGE_KEY = 'swachha_reports';

function loadReports() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return [...initialMockReports];
}

function saveReports(reports) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch { /* ignore */ }
}

/**
 * Custom hook for managing plastic waste reports.
 * Wraps mock data with simulated loading delay.
 * Designed so the data-fetching layer can later be swapped for real API calls.
 */
export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ wasteType: 'All', status: 'All' });

  // Initial load with simulated delay for skeleton states
  useEffect(() => {
    const timer = setTimeout(() => {
      setReports(loadReports());
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Persist whenever reports change
  useEffect(() => {
    if (!loading && reports.length > 0) {
      saveReports(reports);
    }
  }, [reports, loading]);

  // Add a new report
  const addReport = useCallback((reportData) => {
    const newReport = {
      id: generateReportId(),
      lat: reportData.lat || 12.9141,
      lng: reportData.lng || 74.8560,
      placeName: reportData.placeName || 'Unknown Location',
      wasteType: reportData.wasteType || 'Other',
      note: reportData.note || '',
      photoUrl: reportData.photoUrl || 'https://picsum.photos/seed/newreport/400/300',
      reportCount: 1,
      daysSinceFirst: 0,
      status: 'Reported',
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  }, []);

  // Filter reports
  const filteredReports = reports.filter(r => {
    if (filters.wasteType !== 'All' && r.wasteType !== filters.wasteType) return false;
    if (filters.status !== 'All' && r.status !== filters.status) return false;
    return true;
  });

  return {
    reports,
    filteredReports,
    loading,
    filters,
    setFilters,
    addReport,
  };
}
