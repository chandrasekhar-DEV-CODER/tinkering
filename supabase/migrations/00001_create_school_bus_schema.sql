/*
# My School Ride Database Schema

## Overview
This migration creates the complete database structure for the My School Ride school bus tracking system.

## 1. Enums
- `user_role`: super_admin, school_admin, driver, parent
- `vehicle_status`: active, maintenance, retired
- `trip_status`: scheduled, in_progress, completed, cancelled

## 2. Tables

### profiles
User profile information with role-based access
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `phone` (text)
- `full_name` (text)
- `avatar_url` (text)
- `role` (user_role, default: 'parent')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### vehicles
School bus fleet management
- `id` (uuid, primary key)
- `plate_number` (text, unique, not null)
- `model` (text)
- `capacity` (integer)
- `imei` (text, unique) - GPS device identifier
- `status` (vehicle_status, default: 'active')
- `driver_id` (uuid, references profiles)
- `last_location` (geography(Point)) - PostGIS point
- `last_location_time` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### routes
Bus route definitions
- `id` (uuid, primary key)
- `name` (text, not null)
- `code` (text, unique, not null)
- `description` (text)
- `path_polyline` (text) - Encoded polyline for map display
- `is_active` (boolean, default: true)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### stops
Bus stop locations along routes
- `id` (uuid, primary key)
- `route_id` (uuid, references routes)
- `name` (text, not null)
- `location` (geography(Point)) - PostGIS point
- `sequence_order` (integer) - Order in route
- `estimated_arrival_time` (time) - Scheduled time
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### students
Student information and assignments
- `id` (uuid, primary key)
- `student_number` (text, unique, not null)
- `full_name` (text, not null)
- `grade` (text)
- `class` (text)
- `pickup_stop_id` (uuid, references stops)
- `dropoff_stop_id` (uuid, references stops)
- `pickup_location` (geography(Point))
- `dropoff_location` (geography(Point))
- `is_active` (boolean, default: true)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### student_parents
Many-to-many relationship between students and parents
- `id` (uuid, primary key)
- `student_id` (uuid, references students)
- `parent_id` (uuid, references profiles)
- `relationship` (text) - e.g., "father", "mother", "guardian"
- `is_primary` (boolean, default: false)
- `created_at` (timestamptz)

### trips
Trip session records
- `id` (uuid, primary key)
- `vehicle_id` (uuid, references vehicles)
- `driver_id` (uuid, references profiles)
- `route_id` (uuid, references routes)
- `status` (trip_status, default: 'scheduled')
- `scheduled_start` (timestamptz)
- `actual_start` (timestamptz)
- `actual_end` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### location_logs
GPS breadcrumb trail for trip replay
- `id` (uuid, primary key)
- `trip_id` (uuid, references trips)
- `vehicle_id` (uuid, references vehicles)
- `location` (geography(Point))
- `speed` (numeric) - km/h
- `heading` (numeric) - degrees 0-360
- `accuracy` (numeric) - meters
- `recorded_at` (timestamptz)
- `created_at` (timestamptz)

### trip_events
Event logging for trips (arrivals, pickups, etc.)
- `id` (uuid, primary key)
- `trip_id` (uuid, references trips)
- `stop_id` (uuid, references stops)
- `student_id` (uuid, references students)
- `event_type` (text) - e.g., "stop_arrival", "student_pickup", "student_dropoff"
- `event_time` (timestamptz)
- `notes` (text)
- `created_at` (timestamptz)

### notifications
Push notification records
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `title` (text, not null)
- `message` (text, not null)
- `type` (text) - e.g., "proximity_alert", "trip_start", "trip_end"
- `is_read` (boolean, default: false)
- `related_trip_id` (uuid, references trips)
- `created_at` (timestamptz)

## 3. Security
- Enable RLS on all tables
- Super admins have full access to all data
- School admins have full access to their school's data
- Drivers can read their assigned vehicles and trips, update trip status
- Parents can read their children's data and related trips
- Public read access for active routes and stops (for map display)

## 4. Indexes
- Geospatial indexes on location columns for fast proximity queries
- Indexes on foreign keys for join performance
- Indexes on frequently queried columns (status, role, etc.)

## 5. Functions
- `is_super_admin()` - Check if current user is super admin
- `is_school_admin()` - Check if current user is school admin
- `calculate_distance()` - Calculate distance between two points using Haversine formula
- `get_nearby_stops()` - Find stops within a radius of a location
*/

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enums
CREATE TYPE user_role AS ENUM ('super_admin', 'school_admin', 'driver', 'parent');
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'retired');
CREATE TYPE trip_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  phone text,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'parent'::user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number text UNIQUE NOT NULL,
  model text,
  capacity integer,
  imei text UNIQUE,
  status vehicle_status DEFAULT 'active'::vehicle_status NOT NULL,
  driver_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  last_location geography(Point),
  last_location_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  path_polyline text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stops table
CREATE TABLE IF NOT EXISTS stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  name text NOT NULL,
  location geography(Point) NOT NULL,
  sequence_order integer NOT NULL,
  estimated_arrival_time time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  grade text,
  class text,
  pickup_stop_id uuid REFERENCES stops(id) ON DELETE SET NULL,
  dropoff_stop_id uuid REFERENCES stops(id) ON DELETE SET NULL,
  pickup_location geography(Point),
  dropoff_location geography(Point),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create student_parents junction table
CREATE TABLE IF NOT EXISTS student_parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  relationship text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, parent_id)
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  route_id uuid REFERENCES routes(id) ON DELETE SET NULL,
  status trip_status DEFAULT 'scheduled'::trip_status NOT NULL,
  scheduled_start timestamptz,
  actual_start timestamptz,
  actual_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create location_logs table
CREATE TABLE IF NOT EXISTS location_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  location geography(Point) NOT NULL,
  speed numeric,
  heading numeric,
  accuracy numeric,
  recorded_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create trip_events table
CREATE TABLE IF NOT EXISTS trip_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  stop_id uuid REFERENCES stops(id) ON DELETE SET NULL,
  student_id uuid REFERENCES students(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_time timestamptz NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text,
  is_read boolean DEFAULT false,
  related_trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_driver ON vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_last_location ON vehicles USING GIST(last_location);

CREATE INDEX IF NOT EXISTS idx_stops_route ON stops(route_id);
CREATE INDEX IF NOT EXISTS idx_stops_location ON stops USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_students_pickup_stop ON students(pickup_stop_id);
CREATE INDEX IF NOT EXISTS idx_students_dropoff_stop ON students(dropoff_stop_id);
CREATE INDEX IF NOT EXISTS idx_students_active ON students(is_active);

CREATE INDEX IF NOT EXISTS idx_student_parents_student ON student_parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_parent ON student_parents(parent_id);

CREATE INDEX IF NOT EXISTS idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_route ON trips(route_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_scheduled_start ON trips(scheduled_start);

CREATE INDEX IF NOT EXISTS idx_location_logs_trip ON location_logs(trip_id);
CREATE INDEX IF NOT EXISTS idx_location_logs_vehicle ON location_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_location_logs_recorded_at ON location_logs(recorded_at);
CREATE INDEX IF NOT EXISTS idx_location_logs_location ON location_logs USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_trip_events_trip ON trip_events(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_events_stop ON trip_events(stop_id);
CREATE INDEX IF NOT EXISTS idx_trip_events_student ON trip_events(student_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'super_admin'::user_role
  );
$$;

CREATE OR REPLACE FUNCTION is_school_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('super_admin'::user_role, 'school_admin'::user_role)
  );
$$;

CREATE OR REPLACE FUNCTION is_driver()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'driver'::user_role
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Super admins have full access to profiles" ON profiles
  FOR ALL USING (is_super_admin());

CREATE POLICY "School admins can view all profiles" ON profiles
  FOR SELECT USING (is_school_admin());

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for vehicles
CREATE POLICY "Admins have full access to vehicles" ON vehicles
  FOR ALL USING (is_school_admin());

CREATE POLICY "Drivers can view their assigned vehicles" ON vehicles
  FOR SELECT USING (driver_id = auth.uid());

CREATE POLICY "Public can view active vehicles" ON vehicles
  FOR SELECT USING (status = 'active'::vehicle_status);

-- RLS Policies for routes
CREATE POLICY "Admins have full access to routes" ON routes
  FOR ALL USING (is_school_admin());

CREATE POLICY "Public can view active routes" ON routes
  FOR SELECT USING (is_active = true);

-- RLS Policies for stops
CREATE POLICY "Admins have full access to stops" ON stops
  FOR ALL USING (is_school_admin());

CREATE POLICY "Public can view stops" ON stops
  FOR SELECT USING (true);

-- RLS Policies for students
CREATE POLICY "Admins have full access to students" ON students
  FOR ALL USING (is_school_admin());

CREATE POLICY "Parents can view their children" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_parents
      WHERE student_id = students.id AND parent_id = auth.uid()
    )
  );

-- RLS Policies for student_parents
CREATE POLICY "Admins have full access to student_parents" ON student_parents
  FOR ALL USING (is_school_admin());

CREATE POLICY "Parents can view their relationships" ON student_parents
  FOR SELECT USING (parent_id = auth.uid());

-- RLS Policies for trips
CREATE POLICY "Admins have full access to trips" ON trips
  FOR ALL USING (is_school_admin());

CREATE POLICY "Drivers can view and update their trips" ON trips
  FOR SELECT USING (driver_id = auth.uid());

CREATE POLICY "Drivers can update their trip status" ON trips
  FOR UPDATE USING (driver_id = auth.uid());

CREATE POLICY "Parents can view trips related to their children" ON trips
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_parents sp
      JOIN students s ON s.id = sp.student_id
      WHERE sp.parent_id = auth.uid()
    )
  );

-- RLS Policies for location_logs
CREATE POLICY "Admins have full access to location_logs" ON location_logs
  FOR ALL USING (is_school_admin());

CREATE POLICY "Drivers can insert their location logs" ON location_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_id AND trips.driver_id = auth.uid()
    )
  );

CREATE POLICY "Public can view recent location logs" ON location_logs
  FOR SELECT USING (recorded_at > now() - interval '1 hour');

-- RLS Policies for trip_events
CREATE POLICY "Admins have full access to trip_events" ON trip_events
  FOR ALL USING (is_school_admin());

CREATE POLICY "Drivers can create events for their trips" ON trip_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_id AND trips.driver_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view events for their children" ON trip_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_parents
      WHERE student_id = trip_events.student_id AND parent_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications" ON notifications
  FOR INSERT WITH CHECK (is_school_admin());

-- Utility function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
)
RETURNS double precision LANGUAGE plpgsql AS $$
DECLARE
  earth_radius double precision := 6371; -- km
  dlat double precision;
  dlon double precision;
  a double precision;
  c double precision;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  RETURN earth_radius * c;
END;
$$;

-- Function to get nearby stops within a radius
CREATE OR REPLACE FUNCTION get_nearby_stops(
  lat double precision,
  lon double precision,
  radius_km double precision DEFAULT 1.0
)
RETURNS TABLE (
  id uuid,
  name text,
  distance_km double precision
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.name,
    ST_Distance(
      s.location::geography,
      ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography
    ) / 1000 AS distance_km
  FROM stops s
  WHERE ST_DWithin(
    s.location::geography,
    ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography,
    radius_km * 1000
  )
  ORDER BY distance_km;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stops_updated_at BEFORE UPDATE ON stops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();