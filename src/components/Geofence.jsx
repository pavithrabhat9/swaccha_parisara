import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/AppContext';
import pointInPolygon from 'point-in-polygon';
import { useTranslation } from 'react-i18next';

const Geofence = ({ children }) => {
  const { t } = useTranslation();
  const { userLocation, locationError, detectLocationAndWard } = useApp();
  const [isWithinBounds, setIsWithinBounds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [districtBoundary, setDistrictBoundary] = useState(null);

  useEffect(() => {
    fetch('/dakshina-kannada-wards.geojson')
      .then(response => response.json())
      .then(data => {
        const polygons = [];
        data.features.forEach(feature => {
          if (feature.geometry.type === 'Polygon') {
            polygons.push(feature.geometry.coordinates[0]);
          } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(polygon => {
              polygons.push(polygon[0]);
            });
          }
        });
        setDistrictBoundary(polygons);
      });
  }, []);

  useEffect(() => {
    if (!districtBoundary) return;

    if (locationError) {
      setIsWithinBounds(false);
      setLoading(false);
      return;
    }

    if (userLocation) {
      const { lat, lng } = userLocation;
      const isInside = districtBoundary.some(polygon => pointInPolygon([lng, lat], polygon));
      setIsWithinBounds(isInside);
      setLoading(false);
    }
  }, [userLocation, locationError, districtBoundary]);

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (!isWithinBounds) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        zIndex: 9999
      }}>
        <h2>{t('serviceAreaRestriction')}</h2>
        <p>{t('serviceAreaRestrictionMessage')}</p>
        <button onClick={detectLocationAndWard}>{t('allowLocation')}</button>
      </div>
    );
  }

  return children;
};

export default Geofence;