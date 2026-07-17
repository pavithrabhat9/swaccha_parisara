import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

// Load persisted complaints from localStorage
function loadLocalComplaints() {
  try {
    const stored = localStorage.getItem('swaccha_complaints');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalComplaints(complaints) {
  try {
    localStorage.setItem('swaccha_complaints', JSON.stringify(complaints));
  } catch {}
}

export function AppProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null);
  const [currentWard, setCurrentWard] = useState(null);
  const [currentPoliticians, setCurrentPoliticians] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  // allComplaints stores ALL complaints, never filtered — this is the source of truth
  const [allComplaints, setAllComplaints] = useState(() => loadLocalComplaints());
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('map');
  const [showReportModal, setShowReportModal] = useState(false);
  const [wards, setWards] = useState([]);
  const [wardsLoading, setWardsLoading] = useState(true);
  const [dbAvailable, setDbAvailable] = useState(null); // null = unknown, true/false
  const dbCheckedRef = useRef(false);
  const fetchOnceRef = useRef(false); // Ensure we only fetch once on mount

  // Compute displayed complaints from allComplaints + statusFilter (never refetches)
  const displayedComplaints = useMemo(() => {
    if (statusFilter === 'all') return allComplaints;
    return allComplaints.filter(c => c.status === statusFilter);
  }, [allComplaints, statusFilter]);

  // Check if Supabase tables exist
  const checkDatabase = useCallback(async () => {
    if (dbCheckedRef.current) return;
    dbCheckedRef.current = true;
    
    try {
      const { error } = await supabase.from('complaints').select('id', { count: 'exact', head: true });
      if (error) {
        console.warn('Supabase complaints table not available:', error.message);
        setDbAvailable(false);
      } else {
        setDbAvailable(true);
      }
    } catch {
      setDbAvailable(false);
    }
  }, []);

  // Add complaint locally when Supabase is unavailable
  const addLocalComplaint = useCallback((complaintData) => {
    const newComplaint = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      reported_at: new Date().toISOString(),
      lat_public: complaintData.lat_public || userLocation?.lat || 12.91,
      lng_public: complaintData.lng_public || userLocation?.lng || 74.86,
      ward_id: complaintData.ward_id || currentWard?.ward_id || null,
      photo_url: complaintData.photo_url || '',
      landmark_description: complaintData.landmark_description || '',
      waste_type: complaintData.waste_type || '',
      status: 'unresolved',
      resolved_at: null,
      wards: currentWard ? { ward_name: currentWard.ward_name, ward_no: currentWard.ward_no } : null
    };
    
    setAllComplaints(prev => {
      const updated = [newComplaint, ...prev];
      saveLocalComplaints(updated);
      return updated;
    });
    
    return newComplaint;
  }, [userLocation, currentWard]);

  // Fetch wards from GeoJSON
  const fetchWards = useCallback(async () => {
    try {
      setWardsLoading(true);
      
      // Try Supabase first
      const { data, error } = await supabase
        .from('wards')
        .select('id, ward_name, ward_no, town_code');
      
      if (error || !data?.length) {
        // Fallback to GeoJSON
        const geoData = window.__WARD_GEOJSON__ || { features: [] };
        if (!window.__WARD_GEOJSON__) {
          try {
            const res = await fetch('/dakshina-kannada-wards.geojson');
            const gd = await res.json();
            window.__WARD_GEOJSON__ = gd;
            geoData.features = gd.features;
          } catch {}
        }
        
        const localWards = geoData.features.map((f, idx) => ({
          id: idx + 1,
          ward_name: f.properties.ward_name || '',
          ward_no: f.properties.ward_no || '',
          town_code: f.properties.town_code || '',
          kgis_ward_id: f.properties.KGISWardID,
          complaintCount: 0
        }));
        setWards(localWards);
      } else {
        setWards(data.map(w => ({ ...w, complaintCount: 0 })));
      }
    } catch (err) {
      console.error('Error fetching wards:', err);
    } finally {
      setWardsLoading(false);
    }
  }, []);

  // Update complaint counts on wards based on all complaints (not filtered)
  useEffect(() => {
    if (wards.length > 0 && allComplaints.length > 0) {
      setWards(prev => prev.map(w => {
        const count = allComplaints.filter(c => {
          if (c.ward_id && w.id) return c.ward_id === w.id || c.ward_id === w.kgis_ward_id;
          if (c.wards?.ward_name) return c.wards.ward_name === w.ward_name;
          return false;
        }).length;
        return { ...w, complaintCount: count };
      }));
    }
  }, [allComplaints, wards.length]);

  // Find ward by user location
  const findWardByLocation = useCallback(async (lat, lng) => {
    setLocationLoading(true);
    setLocationError(null);
    
    try {
      // Try Supabase PostGIS
      const { data, error } = await supabase
        .rpc('find_ward_by_location', { p_lat: lat, p_lng: lng });
      
      if (error || !data?.length) {
        // Fallback: use local GeoJSON point-in-polygon
        const geoData = window.__WARD_GEOJSON__ || { features: [] };
        let foundWard = null;
        
        for (const feature of geoData.features) {
          const coords = feature.geometry?.coordinates?.[0];
          if (coords && isPointInPolygon(lng, lat, coords)) {
            foundWard = {
              ward_id: feature.properties.KGISWardID || feature.properties.ward_no,
              ward_name: feature.properties.ward_name || '',
              ward_no: feature.properties.ward_no || '',
              town_code: feature.properties.town_code || '',
            };
            break;
          }
        }
        
        if (foundWard) {
          setCurrentWard(foundWard);
          // Map politicians based on town code — now includes photo URLs
          const politicianMap = {
            '2401': { mla: 'U. Rajesh Naik', party: 'BJP', mlaPhotoUrl: 'https://dknozcgsywiqvnzikffw.supabase.co/storage/v1/object/sign/politician-photos/U-Rajesh-Naik.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMDViYjk5Yy0yNjhlLTQzNmQtOTc1NS03NTJlMTY1NWYwYTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwb2xpdGljaWFuLXBob3Rvcy9VLVJhamVzaC1OYWlrLmpwZyIsImlhdCI6MTc4MDIwMTU5OCwiZXhwIjoxODExNzM3NTk4fQ.aUJ5vv1uUL_hn-Emdc-m7l6bxxJoCln3wjcsgNS4lK8' },   // Bantwal TMC
            '2404': { mla: 'Umanatha A. Kotian', party: 'BJP', mlaPhotoUrl: 'https://dknozcgsywiqvnzikffw.supabase.co/storage/v1/object/sign/politician-photos/Umanath-Kotian.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMDViYjk5Yy0yNjhlLTQzNmQtOTc1NS03NTJlMTY1NWYwYTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwb2xpdGljaWFuLXBob3Rvcy9VbWFuYXRoLUtvdGlhbi5qcGVnIiwiaWF0IjoxNzgwMjAxNjAyLCJleHAiOjE4MTE3Mzc2MDJ9._CuJPsNKgl0OInrQkL9ViGYe_iQKiwKNTNkrR0Rowcc' }, // Moodabidri TMC
          };
          const pol = politicianMap[foundWard.town_code];
          setCurrentPoliticians({
            mla_name: pol?.mla || '',
            mla_party: pol?.party || '',
            mla_photoUrl: pol?.mlaPhotoUrl || '',
            mp_name: 'Capt. Brijesh Chowta',
            mp_party: 'BJP',
            mp_photoUrl: 'https://dknozcgsywiqvnzikffw.supabase.co/storage/v1/object/sign/politician-photos/Captain-Brijesh-Chowta.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMDViYjk5Yy0yNjhlLTQzNmQtOTc1NS03NTJlMTY1NWYwYTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwb2xpdGljaWFuLXBob3Rvcy9DYXB0YWluLUJyaWplc2gtQ2hvd3RhLmpwZyIsImlhdCI6MTc4MDIwMTU5MiwiZXhwIjoxODExNzM3NTkyfQ.4kQ_KoNk3QOqfaBN__fzY_n2aVEn6ZuwAJ0cFGqMfUk'
          });
        } else {
          setLocationError('Your location is outside any ward boundary.');
        }
      } else {
        setCurrentWard(data[0]);
        setCurrentPoliticians({
          mla_name: data[0].mla_name || '',
          mla_party: data[0].mla_party || '',
          mla_photoUrl: data[0].mla_photoUrl || '',
          mp_name: data[0].mp_name || 'Capt. Brijesh Chowta',
          mp_party: data[0].mp_party || 'BJP',
          mp_photoUrl: data[0].mp_photoUrl || 'https://dknozcgsywiqvnzikffw.supabase.co/storage/v1/object/sign/politician-photos/Captain-Brijesh-Chowta.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMDViYjk5Yy0yNjhlLTQzNmQtOTc1NS03NTJlMTY1NWYwYTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwb2xpdGljaWFuLXBob3Rvcy9DYXB0YWluLUJyaWplc2gtQ2hvd3RhLmpwZyIsImlhdCI6MTc4MDIwMTU5MiwiZXhwIjoxODExNzM3NTkyfQ.4kQ_KoNk3QOqfaBN__fzY_n2aVEn6ZuwAJ0cFGqMfUk'
        });
      }
    } catch (err) {
      console.error('Location query error:', err);
      setLocationError('Could not determine your ward. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  }, []);

  // Detect current location -> ward -> politicians (called when FAB is clicked)
  const detectLocationAndWard = useCallback(async () => {
    // If we already have ward data, return it
    if (currentWard && currentPoliticians) {
      return { ward: currentWard, politicians: currentPoliticians };
    }

    setLocationLoading(true);
    setLocationError(null);

    try {
      let lat, lng;

      if (userLocation) {
        lat = userLocation.lat;
        lng = userLocation.lng;
      } else {
        // Try geolocation again
        const pos = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          });
        });

        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
      }

      await findWardByLocation(lat, lng);
      setLocationLoading(false);
    } catch (err) {
      console.error('Detection error:', err);
      setLocationLoading(false);

      // Fallback to default DK coordinates
      const defaultLoc = { lat: 12.91, lng: 74.86 };
      if (!userLocation) setUserLocation(defaultLoc);
      await findWardByLocation(defaultLoc.lat, defaultLoc.lng);
      setLocationError('Using approximate location. Please enable GPS for better accuracy.');
    }
  }, [userLocation, currentWard, currentPoliticians, findWardByLocation]);

  // Fetch ALL complaints from Supabase + merge with local (NO filter — fetches everything)
  const fetchAllComplaints = useCallback(async () => {
    try {
      const localComplaints = loadLocalComplaints();
      
      // Try fetching from Supabase — no filter, get ALL complaints
      const { data, error } = await supabase
        .from('complaints')
        .select('*, wards(ward_name, ward_no)')
        .order('created_at', { ascending: false });
      
      if (!error && data?.length) {
        // Merge: take local complaints first (newest), then add remote ones not already in local
        const localIds = new Set(localComplaints.map(c => c.id));
        const merged = [...localComplaints];
        
        for (const remote of data) {
          if (!localIds.has(remote.id)) {
            merged.push(remote);
          }
        }
        
        setAllComplaints(merged);
        saveLocalComplaints(merged);
      } else {
        // Use only local data
        setAllComplaints(localComplaints);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  }, []);

  // Get user location
  const getUserLocation = useCallback(() => {
    setLocationLoading(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported by browser');
      setLocationError('Geolocation not supported by your browser. Using default location.');
      const defaultLoc = { lat: 12.91, lng: 74.86 };
      setUserLocation(defaultLoc);
      findWardByLocation(defaultLoc.lat, defaultLoc.lng);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location obtained:', latitude, longitude);
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationError(null);
        await findWardByLocation(latitude, longitude);
      },
      (err) => {
        console.error('Geolocation error:', err.message);
        const defaultLoc = { lat: 12.91, lng: 74.86 };
        setUserLocation(defaultLoc);
        
        let errorMsg = 'Location access denied. ';
        if (err.code === 1) errorMsg += 'Please allow location access in your browser settings.';
        else if (err.code === 2) errorMsg += 'Location is unavailable. Using default location.';
        else if (err.code === 3) errorMsg += 'Location request timed out. Using default location.';
        else errorMsg += 'Using default location.';
        
        setLocationError(errorMsg);
        // Still try to find a ward for the default DK location
        findWardByLocation(defaultLoc.lat, defaultLoc.lng);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 300000 // Allow 5 min cached location
      }
    );
  }, [findWardByLocation]);

  // Reference to track if GeoJSON is loaded
  const geojsonReadyRef = useRef(false);

  // Preload GeoJSON before anything else
  useEffect(() => {
    async function preloadGeoJSON() {
      if (window.__WARD_GEOJSON__?.features?.length) {
        geojsonReadyRef.current = true;
        return;
      }
      try {
        const res = await fetch('/dakshina-kannada-wards.geojson');
        if (res.ok) {
          const gd = await res.json();
          window.__WARD_GEOJSON__ = gd;
          geojsonReadyRef.current = true;
          console.log('GeoJSON loaded:', gd.features?.length, 'wards');
        }
      } catch (err) {
        console.warn('Failed to preload GeoJSON:', err);
      }
    }
    preloadGeoJSON();
  }, []);

  // Initial load — fetch ALL complaints ONCE on mount, wait for GeoJSON then get location
  useEffect(() => {
    checkDatabase();
    fetchWards();
    
    // Fetch all complaints once on mount (not on filter change)
    if (!fetchOnceRef.current) {
      fetchOnceRef.current = true;
      fetchAllComplaints();
    }
    
    // Wait a moment for GeoJSON to load, then try location
    const timer = setTimeout(() => {
      getUserLocation();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [checkDatabase, fetchWards, getUserLocation, fetchAllComplaints]);

  // Persist allComplaints whenever they change
  useEffect(() => {
    saveLocalComplaints(allComplaints);
  }, [allComplaints]);

  const value = {
    userLocation,
    currentWard,
    currentPoliticians,
    locationLoading,
    locationError,
    // complaints = displayed/filtered complaints (backward compatible for most consumers)
    complaints: displayedComplaints,
    // allComplaints = ALL complaints (for counts in FilterBar, etc.)
    allComplaints,
    statusFilter,
    setStatusFilter,
    activeTab,
    setActiveTab,
    showReportModal,
    setShowReportModal,
    wards,
    wardsLoading,
    dbAvailable,
    findWardByLocation,
    getUserLocation,
    detectLocationAndWard,
    fetchComplaints: fetchAllComplaints, // renamed but exposed as fetchComplaints for compatibility
    addLocalComplaint,
    setCurrentWard,
    setCurrentPoliticians,
    setComplaints: setAllComplaints // exposed for any external setter usage
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Point-in-polygon (ray casting)
function isPointInPolygon(px, py, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}