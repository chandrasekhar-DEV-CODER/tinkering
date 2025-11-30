-- ============================================
-- IMMEDIATE FIX FOR VEHICLE CREATION ERROR
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- Then click "RUN" to apply the fix

-- Add INSERT, UPDATE, DELETE policies for transport_vehicles
CREATE POLICY "Anyone can insert vehicles" ON transport_vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update vehicles" ON transport_vehicles FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete vehicles" ON transport_vehicles FOR DELETE USING (true);

-- Add policies for drivers_auth
CREATE POLICY "Anyone can insert drivers" ON drivers_auth FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update drivers" ON drivers_auth FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete drivers" ON drivers_auth FOR DELETE USING (true);

-- Add policies for parents_auth
CREATE POLICY "Anyone can insert parents" ON parents_auth FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update parents" ON parents_auth FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete parents" ON parents_auth FOR DELETE USING (true);

-- Add policies for students_auth
CREATE POLICY "Anyone can insert students" ON students_auth FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update students" ON students_auth FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete students" ON students_auth FOR DELETE USING (true);

-- Add policies for gps_tracking_logs
CREATE POLICY "Anyone can insert GPS logs" ON gps_tracking_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update GPS logs" ON gps_tracking_logs FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete GPS logs" ON gps_tracking_logs FOR DELETE USING (true);

-- Add policies for admins
CREATE POLICY "Anyone can insert admins" ON admins FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update admins" ON admins FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete admins" ON admins FOR DELETE USING (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
