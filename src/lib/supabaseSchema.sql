-- ============================================
-- SWACCHA PARISARA - Database Schema
-- Civic Waste Reporting Platform
-- Supabase PostgreSQL + PostGIS
-- ============================================

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- MLA Profiles
CREATE TABLE IF NOT EXISTS mla_profiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  party VARCHAR(100) NOT NULL,
  municipality VARCHAR(255) NOT NULL
);

-- MP Profiles (same MP for all)
CREATE TABLE IF NOT EXISTS mp_profiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  party VARCHAR(100) NOT NULL
);

-- Wards with PostGIS geometry
CREATE TABLE IF NOT EXISTS wards (
  id SERIAL PRIMARY KEY,
  ward_name VARCHAR(255) NOT NULL,
  ward_no VARCHAR(50) NOT NULL,
  town_code VARCHAR(50),
  kgis_ward_id INTEGER,
  kgis_ward_code VARCHAR(100),
  lgd_ward_code INTEGER,
  area_hectares DECIMAL(15,5),
  geom GEOMETRY(POLYGON, 4326),
  mla_id INTEGER REFERENCES mla_profiles(id),
  mp_id INTEGER REFERENCES mp_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spatial index
CREATE INDEX IF NOT EXISTS idx_wards_geom ON wards USING GIST (geom);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  lat_public DECIMAL(10,8),
  lng_public DECIMAL(11,8),
  ward_id INTEGER REFERENCES wards(id),
  photo_url TEXT,
  landmark_description VARCHAR(200),
  waste_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'unresolved' CHECK (status IN ('resolved', 'unresolved')),
  resolved_at TIMESTAMPTZ,
  reported_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for spatial queries on complaints
CREATE INDEX IF NOT EXISTS idx_complaints_ward ON complaints(ward_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to find ward by point coordinates
CREATE OR REPLACE FUNCTION find_ward_by_location(
  p_lat DECIMAL,
  p_lng DECIMAL
)
RETURNS TABLE (
  ward_id INTEGER,
  ward_name VARCHAR,
  ward_no VARCHAR,
  town_code VARCHAR,
  mla_name VARCHAR,
  mla_party VARCHAR,
  mp_name VARCHAR,
  mp_party VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.ward_name,
    w.ward_no,
    w.town_code,
    mla.name,
    mla.party,
    mp.name,
    mp.party
  FROM wards w
  LEFT JOIN mla_profiles mla ON w.mla_id = mla.id
  LEFT JOIN mp_profiles mp ON w.mp_id = mp.id
  WHERE ST_Contains(w.geom, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326))
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby complaints
CREATE OR REPLACE FUNCTION get_nearby_complaints(
  p_lat DECIMAL,
  p_lng DECIMAL,
  p_distance_meters DECIMAL DEFAULT 1000
)
RETURNS TABLE (
  id UUID,
  lat_public DECIMAL,
  lng_public DECIMAL,
  ward_name VARCHAR,
  waste_type VARCHAR,
  status VARCHAR,
  created_at TIMESTAMPTZ,
  landmark_description VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.lat_public,
    c.lng_public,
    w.ward_name,
    c.waste_type,
    c.status,
    c.created_at,
    c.landmark_description
  FROM complaints c
  JOIN wards w ON c.ward_id = w.id
  WHERE ST_DWithin(
    w.geom,
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326),
    p_distance_meters / 111319.9 -- approximate conversion degrees to meters
  )
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INSERT INITIAL DATA
-- ============================================

-- Insert MP (same for all wards)
INSERT INTO mp_profiles (name, party) 
SELECT 'Capt. Brijesh Chowta', 'BJP'
WHERE NOT EXISTS (SELECT 1 FROM mp_profiles WHERE name = 'Capt. Brijesh Chowta');

-- Insert MLAs
INSERT INTO mla_profiles (name, party, municipality) VALUES
('Y. Bharath Shetty', 'BJP', 'Mangaluru MCC North'),
('D. Vedavyas Kamath', 'BJP', 'Mangaluru MCC South'),
('U. T. Khader', 'INC', 'Ullal CMC'),
('Ashokakumar Rai', 'INC', 'Puttur CMC'),
('Umanatha A. Kotian', 'BJP', 'Moodabidri TMC'),
('U. Rajesh Naik', 'BJP', 'Bantwal TMC')
ON CONFLICT DO NOTHING;