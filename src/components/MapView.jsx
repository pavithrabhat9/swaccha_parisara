import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../lib/AppContext';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createMarkerIcon(color, size = 22) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px; 
      height: ${size}px; 
      background: ${color}; 
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25), 0 0 0 2px ${color}44;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2 - 4]
  });
}

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div style="
    width: 18px; 
    height: 18px; 
    background: #2196F3; 
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(33,150,243,0.25);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

function MapController({ wardGeojson }) {
  const map = useMap();
  useEffect(() => {
    if (wardGeojson) {
      try {
        const geoLayer = L.geoJSON(wardGeojson);
        const bounds = geoLayer.getBounds();
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
      } catch {}
    }
  }, [map, wardGeojson]);
  return null;
}

export default function MapView() {
  const { userLocation, complaints, statusFilter, currentWard } = useApp();
  const [wardGeojson, setWardGeojson] = useState(null);

  useEffect(() => {
    const geoData = window.__WARD_GEOJSON__;
    if (geoData) {
      setWardGeojson(geoData);
    } else {
      fetch('/dakshina-kannada-wards.geojson')
        .then(res => res.json())
        .then(data => {
          window.__WARD_GEOJSON__ = data;
          setWardGeojson(data);
        })
        .catch(() => {});
    }
  }, []);

  const filteredComplaints = complaints.filter(c =>
    statusFilter === 'all' || c.status === statusFilter
  );

  const wardStyle = {
    fillColor: '#009B4D',
    weight: 1,
    opacity: 0.6,
    color: '#007A3D',
    fillOpacity: 0.08
  };

  const highlightWardStyle = {
    fillColor: '#009B4D',
    weight: 2,
    opacity: 1,
    color: '#009B4D',
    fillOpacity: 0.18
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(`
        <div style="font-family: -apple-system, sans-serif; font-size: 13px;">
          <strong style="color: #009B4D;">${feature.properties.ward_name}</strong><br/>
          <span style="color: #808080;">Ward No: ${feature.properties.ward_no}</span>
        </div>
      `);
    }
  };

  const defaultCenter = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [12.91, 74.86];

  return (
    <div className="map-container">
      <MapContainer
          center={defaultCenter}
          zoom={11}
          scrollWheelZoom={true}
          zoomControl={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {wardGeojson && (
            <GeoJSON
              data={wardGeojson}
              style={(feature) => {
                if (currentWard && feature.properties.KGISWardID === currentWard.ward_id) {
                  return highlightWardStyle;
                }
                return wardStyle;
              }}
              onEachFeature={onEachFeature}
            />
          )}

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
          )}

          {filteredComplaints.map(complaint => (
            <Marker
              key={complaint.id}
              position={[complaint.lat_public, complaint.lng_public]}
              icon={createMarkerIcon(
                complaint.status === 'resolved' ? '#2E7D32' : '#DC3545',
                18
              )}
            >
              <Popup>
                <div style={{ fontFamily: '-apple-system, sans-serif', fontSize: '13px', minWidth: '140px' }}>
                  <strong style={{ fontSize: '14px' }}>{complaint.waste_type}</strong><br/>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: complaint.status === 'resolved' ? '#E8F5E9' : '#FFF5F5',
                    color: complaint.status === 'resolved' ? '#2E7D32' : '#DC3545',
                    marginTop: '4px'
                  }}>
                    {complaint.status}
                  </span><br/>
                  <span style={{ color: '#808080', marginTop: '4px', display: 'block' }}>
                    {complaint.wards?.ward_name || 'Unknown ward'}
                  </span>
                  <span style={{ color: '#A0A0A0', fontSize: '11px' }}>
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          <MapController wardGeojson={wardGeojson} />
      </MapContainer>
    </div>
  );
}
