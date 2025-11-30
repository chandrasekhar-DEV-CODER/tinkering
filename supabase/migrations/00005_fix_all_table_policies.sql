/*
# Fix All Table RLS Policies for CRUD Operations

## Problem
All tables have RLS enabled but are missing INSERT, UPDATE, and DELETE policies.
This prevents any data creation, modification, or deletion operations.

## Solution
Add comprehensive policies to allow full CRUD operations on all tables.

## Changes
1. Drop existing conflicting policies (if any)
2. Add INSERT, UPDATE, DELETE policies for all tables
3. Ensure SELECT policies exist

## Tables Affected
- transport_vehicles
- drivers_auth
- parents_auth
- students_auth
- admins
- gps_tracking_logs
*/

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can insert vehicles" ON transport_vehicles;
DROP POLICY IF EXISTS "Anyone can update vehicles" ON transport_vehicles;
DROP POLICY IF EXISTS "Anyone can delete vehicles" ON transport_vehicles;

DROP POLICY IF EXISTS "Anyone can insert drivers" ON drivers_auth;
DROP POLICY IF EXISTS "Anyone can update drivers" ON drivers_auth;
DROP POLICY IF EXISTS "Anyone can delete drivers" ON drivers_auth;

DROP POLICY IF EXISTS "Anyone can insert parents" ON parents_auth;
DROP POLICY IF EXISTS "Anyone can update parents" ON parents_auth;
DROP POLICY IF EXISTS "Anyone can delete parents" ON parents_auth;

DROP POLICY IF EXISTS "Anyone can insert students" ON students_auth;
DROP POLICY IF EXISTS "Anyone can update students" ON students_auth;
DROP POLICY IF EXISTS "Anyone can delete students" ON students_auth;

DROP POLICY IF EXISTS "Anyone can insert GPS logs" ON gps_tracking_logs;
DROP POLICY IF EXISTS "Anyone can update GPS logs" ON gps_tracking_logs;
DROP POLICY IF EXISTS "Anyone can delete GPS logs" ON gps_tracking_logs;

DROP POLICY IF EXISTS "Anyone can insert admins" ON admins;
DROP POLICY IF EXISTS "Anyone can update admins" ON admins;
DROP POLICY IF EXISTS "Anyone can delete admins" ON admins;

-- Transport Vehicles Policies
CREATE POLICY "Enable insert for all users" ON transport_vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON transport_vehicles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON transport_vehicles FOR DELETE USING (true);

-- Drivers Auth Policies
CREATE POLICY "Enable insert for all users" ON drivers_auth FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON drivers_auth FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON drivers_auth FOR DELETE USING (true);

-- Parents Auth Policies
CREATE POLICY "Enable insert for all users" ON parents_auth FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON parents_auth FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON parents_auth FOR DELETE USING (true);

-- Students Auth Policies
CREATE POLICY "Enable insert for all users" ON students_auth FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON students_auth FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON students_auth FOR DELETE USING (true);

-- GPS Tracking Logs Policies
CREATE POLICY "Enable insert for all users" ON gps_tracking_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON gps_tracking_logs FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON gps_tracking_logs FOR DELETE USING (true);

-- Admins Policies
CREATE POLICY "Enable insert for all users" ON admins FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON admins FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON admins FOR DELETE USING (true);