export type UserRole = 'super_admin' | 'school_admin' | 'driver' | 'parent';
export type VehicleStatus = 'active' | 'maintenance' | 'retired';
export type TripStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  plate_number: string;
  model: string | null;
  capacity: number | null;
  imei: string | null;
  status: VehicleStatus;
  driver_id: string | null;
  last_location: string | null;
  last_location_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  name: string;
  code: string;
  description: string | null;
  path_polyline: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stop {
  id: string;
  route_id: string | null;
  name: string;
  location: string;
  sequence_order: number;
  estimated_arrival_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  student_number: string;
  full_name: string;
  grade: string | null;
  class: string | null;
  pickup_stop_id: string | null;
  dropoff_stop_id: string | null;
  pickup_location: string | null;
  dropoff_location: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentParent {
  id: string;
  student_id: string;
  parent_id: string;
  relationship: string | null;
  is_primary: boolean;
  created_at: string;
}

export interface Trip {
  id: string;
  vehicle_id: string | null;
  driver_id: string | null;
  route_id: string | null;
  status: TripStatus;
  scheduled_start: string | null;
  actual_start: string | null;
  actual_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocationLog {
  id: string;
  trip_id: string | null;
  vehicle_id: string | null;
  location: string;
  speed: number | null;
  heading: number | null;
  accuracy: number | null;
  recorded_at: string;
  created_at: string;
}

export interface TripEvent {
  id: string;
  trip_id: string | null;
  stop_id: string | null;
  student_id: string | null;
  event_type: string;
  event_time: string;
  notes: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: string | null;
  is_read: boolean;
  related_trip_id: string | null;
  created_at: string;
}

export interface VehicleWithDriver extends Vehicle {
  driver?: Profile | null;
}

export interface TripWithDetails extends Trip {
  vehicle?: Vehicle | null;
  driver?: Profile | null;
  route?: Route | null;
}

export interface StudentWithDetails extends Student {
  pickup_stop?: Stop | null;
  dropoff_stop?: Stop | null;
  parents?: Profile[];
}

export interface StopWithRoute extends Stop {
  route?: Route | null;
}

export interface LocationPoint {
  lat: number;
  lng: number;
}

export interface DashboardStats {
  total_vehicles: number;
  active_trips: number;
  total_alerts: number;
  maintenance_vehicles: number;
  total_students: number;
  total_routes: number;
}

export interface ActivityLog {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  user?: string;
}
