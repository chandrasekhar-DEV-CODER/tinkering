# My School Ride MVP System Specification

## 1. Website Name
My School Ride - School Bus Tracking Management System (MVP Version)

## 2. Website Description
A comprehensive school bus management platform providing unified login portal supporting four user roles: administrators, drivers, students, and parents. Core capabilities include: complete vehicle, driver, student, and parent management by administrators; real-time GPS location reporting by drivers; live bus tracking for students and parents; push notification alerts; visual route management; and real-time hourly active vehicle analytics.

## 3. Core Functional Modules

### 3.1 Unified Login System
- **Unified Login Portal**: All user types (administrators, drivers, students, parents) access the system through a single login page
- **Role Selection Mechanism**: Login page provides dropdown menu or button group for users to select their role before entering credentials
- **Role Verification**: System validates username and password against the corresponding database table based on selected role
- **Admin-Specific Route**: Accessing `/adminherelogin` automatically redirects to login page with admin role pre-selected
- **Pre-configured Super Admin Account**:
  - Username: `chandrasekharadmin`
  - Password: `chandrasekharadmin1023@@`
- JWT authentication and session management
- **Universal Credential System**: All user accounts (administrators, drivers, students, parents) are created with custom username and password credentials set during account creation

### 3.2 Administrator Module (Phase 1: Operational Data Management)
\n#### 3.2.1 Vehicle Management (CRUD)\n- **Add Vehicle**: Vehicle ID, license plate, model, capacity, route name (e.g., 'Route 4- North Campus')
- **View Vehicle List**: Display using shadcn/ui Data Tables component with search and filter capabilities
- **Edit Vehicle Information**: Implement seamless editing via Dialog/Sheet components
- **Deactivate/Delete Vehicle Records**\n- **Route Assignment**: Assign text-based route names to each vehicle (MVP simplified approach)
- **Admin-Exclusive Management**: All vehicle data management operations must be performed exclusively through the admin dashboard interface

#### 3.2.2 Driver Management (CRUD)
- **Add Driver Feature**:
  - **Driver Information Form**: Capture all necessary driver details including:\n    - Full name
    - Contact phone number
    - Email address\n    - License number
    - **User ID** (custom username field - admin enters desired username)
    - **Password** (custom password field - admin sets initial password)
    - Assigned vehicle (vehicle_id association)
    - Emergency contact information
  - **Manual Credential Entry**:
    - Admin manually enters desired username in'User ID' field
    - Admin manually enters initial password in 'Password' field\n    - System validates username uniqueness across all user tables before account creation
    - System validates password meets complexity requirements (minimum 8 characters, mix of uppercase, lowercase, numbers, special characters)
    - Display validation errors inline if username already exists or password is weak
    - Store credentials securely in the `drivers` table with proper encryption
  - **Credential Display**: Show entered credentials to admin after successful creation with copy-to-clipboard functionality
- **View Driver List**: Display using shadcn/ui Data Tables component with account credentials (masked, with reveal option for admin)
- **Driver Search Functionality**:
  - Dedicated search bar positioned above the driver list table
  - Real-time search capability filtering by: driver name, username, email, phone number, license number, or assigned vehicle
  - Search results update dynamically as user types
  - Clear search button to reset filters
  - Search bar styling consistent with overall design theme
- **Edit Driver Information**: Implement via Dialog/Sheet components, allow updating driver details, reassigning vehicles, and resetting passwords
- **Deactivate/Delete Driver Accounts**: System validates that driver has no active trips before deactivation
- **Vehicle Association**: Must specify vehicle_id when creating driver to establish relationship link
- **Admin-Exclusive Management**: All driver account creation and management operations must be performed exclusively through the admin dashboard interface

#### 3.2.3 Student Management (CRUD) - Enhanced
- **Add Student Feature**:
  - **Student Information Form**: Capture all necessary student details including:
    - Full name
    - Student ID number
    - **User ID** (custom username field - admin enters desired username)
    - **Password** (custom password field - admin sets initial password)
    - Grade level
    - Pickup/drop-off point coordinates
    - Emergency contact information
    - Assigned bus/route information
  - **Manual Credential Entry**:
    - Admin manually enters desired username in 'User ID' field
    - Admin manually enters initial password in 'Password' field
    - System validates username uniqueness across all user tables\n    - System validates password complexity requirements\n    - Display validation errors inline if username exists or password is weak
    - Store credentials securely in the `students` table with proper encryption
  - **Linked Parent Profile Creation** (Mandatory):
    - During student addition process, capture parent/guardian details as part of the same workflow:\n      - Parent/guardian full name
      - **User ID** (custom username field - admin enters desired username for parent)
      - **Password** (custom password field - admin sets initial password for parent)
      - Contact phone number
      - Email address\n      - Relationship to student (father/mother/guardian)
      - Secondary contact (optional)
      - Home address
    - System validates parent username uniqueness across all user tables
    - System validates parent password complexity requirements
    - Automatically link parent account to the newly created student record via foreign key relationship
    - Display both student and parent credentials to admin after successful creation in a consolidated view
    - Store parent credentials securely in the `parents` table\n    - **Atomic Transaction**: Student and parent account creation must be executed as a single atomic transaction to ensure data integrity
  - **Data Integrity Enforcement**:
    - Parent account creation is mandatory when adding a student (cannot create student without parent)
    - System validates that parent account remains linked to at least one active student\n    - Prevent orphaned parent accounts through database constraints
    - Transaction rollback if either student or parent account creation fails
- **View Student List**: Display using shadcn/ui Data Tables component showing:\n  - Student name and ID
  - Grade level
  - Associated parent information\n  - Account credentials (masked, with reveal option for admin)
  - Account status (active/inactive)
  - Assigned bus/route\n- **Student Search Functionality**:
  - Dedicated search bar positioned above the student list table
  - Real-time search capability filtering by: student name, student ID number, username, grade level, parent name, or assigned bus\n  - Search results update dynamically as user types
  - Clear search button to reset filters
  - Search bar styling consistent with overall design theme
- **Edit Student Information**: Update student details, modify parent associations, and reset passwords if needed
- **Deactivate/Delete Student Records**: \n  - When deactivating a student, system prompts admin to handle associated parent account
  - Option to deactivate parent if no other students are linked\n  - Maintain data integrity through cascading rules
  - Require admin confirmation before deactivation
- **Admin-Exclusive Management**: All student and parent account creation, modification, and deactivation operations must be performed exclusively through the admin dashboard interface. No direct database access or external tools are permitted for these operations.

#### 3.2.4 Parent Management (CRUD) - Enhanced
- **View Parent List**: Display using shadcn/ui Data Tables component showing:
  - Parent name and contact details
  - Associated student(s) with their names and IDs
  - Account status (active/inactive)
  - Login credentials (masked, with reveal option for admin)
  - Relationship to student(s)\n- **Parent Search Functionality**:
  - Dedicated search bar positioned above the parent list table
  - Real-time search capability filtering by: parent name, username, email, phone number, or associated student name
  - Search results update dynamically as user types
  - Clear search button to reset filters
  - Search bar styling consistent with overall design theme
- **Edit Parent Information**: \n  - Update contact details (phone, email, address)
  - Modify student associations (link/unlink students)
  - Update relationship information\n  - Cannot modify username (read-only)
  - Can reset password (admin enters new password)
- **Deactivate/Delete Parent Accounts**:
  - System prevents deletion if parent has active linked students
  - Provide warning message listing all linked students
  - Require explicit admin confirmation before deactivation
  - Maintain audit trail of deactivation actions
- **Manual Parent Addition** (Special Cases Only):
  - Allow admin to manually add parent accounts for edge cases (e.g., guardian changes, multiple guardians)
  - Require linking to at least one existing student during creation
  - Admin manually enters User ID and Password for the parent
  - Follow same credential validation process\n  - Display generated credentials immediately with copy functionality
- **Parent-Student Relationship Management**:
  - Support one-to-many relationships (one parent linked to multiple students)
  - Visual relationship tree in the dashboard
  - Bulk operations for managing multiple student associations
- **Admin-Exclusive Management**: All parent account management operations must be performed exclusively through the admin dashboard interface\n
#### 3.2.5 Route and Stop Management (CRUD)
- **Route Drawing Tool**: Use mapbox-gl-draw plugin to create routes by clicking on the map
- **Stop Marking**: Mark pickup/drop-off stop coordinates along the route with descriptive labels
- **Route Saving**: Store routes as polyline string format in the database
- **Route Editing**: Support modification of existing routes and stop locations
- **Route Assignment**: Associate routes with specific vehicles and update vehicle records accordingly
- **Route Deletion**: Validate that no active vehicles are assigned before allowing route deletion
- **Admin-Exclusive Route Configuration**: All route definitions, modifications, and deletions must be performed exclusively through the admin dashboard interface. Drivers, students, and parents have read-only access to route information relevant to their assignments.

#### 3.2.6 Real-time Monitoring Map
- **Global Vehicle View**: Display real-time locations of all online vehicles on the admin dashboard map
- **Vehicle Status Indicators**: Differentiate vehicle states (moving/stopped/offline) using distinct colors or icons
- **Vehicle Details View**: Click map markers to view detailed vehicle information, assigned driver, and current route
- **Real-time Data Updates**: Receive vehicle location updates via Socket.io and refresh map display automatically
- **Historical Playback**: Access last 24 hours of vehicle trajectory data for review and analysis
\n#### 3.2.7 Hourly Active Vehicles Analytics Dashboard
- **Real-time Active Vehicle Counter**:
  - Display current number of active vehicles (vehicles with active trips in progress)
  - Prominent card widget positioned at top of admin dashboard
  - Large numeric display with neon green accent color (#10b981)
  - Auto-refresh every 30 seconds via Socket.io real-time updates
  - Visual indicator showing increase/decrease compared to previous hour
- **Hourly Activity Chart**:
  - Line chart displaying active vehicle count for the current day (24-hour period)
  - X-axis: Hours (00:00 to 23:00)\n  - Y-axis: Number of active vehicles
  - Data points updated in real-time as vehicles start/stop trips
  - Chart library: Recharts or Chart.js with dark theme styling
  - Hover tooltips showing exact vehicle count and hour
  - Color scheme: Neon green line (#10b981) on dark background (#1a1a1a)
- **Active Vehicle List Panel**:
  - Collapsible side panel showing currently active vehicles
  - Display vehicle ID, driver name, route name, trip start time\n  - Real-time status updates (moving/stopped)\n  - Click to highlight vehicle on map
  - Sort by trip duration or vehicle ID
- **Historical Comparison**:
  - Compare current day's hourly activity with previous day
  - Display percentage change in activity levels
  - Weekly average active vehicles metric
- **Data Calculation Logic**:
  - Active vehicle defined as: vehicle with trip status = 'active' in current hour
  - Query `gps_logs` table grouped by hour with vehicle_id count
  - Cache hourly aggregates for performance optimization
  - Real-time updates via Socket.io event: `admin:hourly_stats_update`

#### 3.2.8 Role-Based Access Control (RBAC) - Enhanced
- **Supabase RLS (Row Level Security) Policies**:
  - **Administrator Role**:
    - Full CRUD permissions on all tables (vehicles, drivers, students, parents, routes)\n    - Exclusive access to user account creation with manual credential entry for all user types
    - Exclusive access to route configuration and management
    - Ability to view and manage all system data across all modules
    - Access to audit logs and system reports
    - Exclusive access to credential reveal functionality
    - Ability to reset passwords for all user types
    - Full access to hourly active vehicle analytics and historical data
  - **Driver Role**:
    - READ-only access to assigned vehicle information
    - READ-only access to assigned route information
    - UPDATE permission only for own GPS location data and trip status
    - READ-only access to own account profile\n    - No access to student/parent personal information
    - No access to other drivers' data
    - No access to analytics dashboard
  - **Student Role**:
    - READ-only access to own profile information
    - READ-only access to assigned bus real-time location
    - READ-only access to assigned route and stop information
    - No access to other students' data
    - No access to driver or parent account details
    - No access to analytics dashboard
  - **Parent Role**:
    - READ-only access to linked student(s) information
    - READ-only access to assigned bus real-time location for linked students
    - READ-only access to route and stop information for linked students
    - No access to other families' data
    - No access to driver account details
    - No access to analytics dashboard
- **Data Integrity Enforcement**:
  - Database-level foreign key constraints ensure parent accounts cannot exist without linked students
  - Cascading rules prevent orphaned records
  - Transaction-based operations ensure atomic creation of student-parent pairs
  - Check constraints validate data consistency before commits
- **Administrative Privilege Segregation**:
  - All user account management functions accessible only through admin dashboard
  - No direct database access required for routine operations
  - Audit logging for all administrative actions (user creation, modifications, deletions, credential access)
  - Session timeout and re-authentication for sensitive operations
  - IP whitelisting option for admin access (optional security enhancement)

#### 3.2.9 Credential Management System
- **Manual Credential Entry Interface**:
  - Form fields for 'User ID' (username) and 'Password' in all user creation forms
  - Real-time validation feedback for username uniqueness
  - Password strength indicator showing complexity requirements
  - Inline error messages for validation failures
  - Clear labeling of required fields
- **Credential Display Interface**:
  - Modal dialog displaying entered credentials after successful account creation
  - Copy-to-clipboard functionality for both username and password
  - Print-friendly format for physical credential distribution
  - Warning message about credential security
  - Option to send credentials via email (optional feature)
- **Credential Management Features**:
  - Admin ability to view masked credentials in user lists
  - Reveal functionality with audit logging
  - Password reset capability where admin enters new password
  - Bulk credential export for backup purposes (encrypted format)
  - Credential expiration and forced password change policies (optional)
\n### 3.3 Driver Module (Phase 3: Driver Dashboard - The Publisher)

#### 3.3.1 Driver Control Panel (Web Version)
- **Status Display**: Show current online/offline status\n- **Trip Control Buttons**:
  - START TRIP: Begin tracking, button in emerald green (#10b981)
  - STOP TRIP: Stop tracking, button in red (#ef4444)
  - Button styling: Large size (py-6text-2xl), rounded design with shadow effects
- **Real-time Location Display**: Show current latitude/longitude coordinates (4 decimal places)
- **Vehicle Information Display**: Show assigned vehicle information and current route details
- **Speed and Direction Display**: Show current driving speed and heading
- **Profile Access**: View own account information (read-only)
\n#### 3.3.2 Real-time Tracking Functionality
- **GPS Data Collection**:
  - Use `navigator.geolocation.watchPosition` API (preferred over getCurrentPosition)
  - Collected data: latitude, longitude, heading, speed\n  - Configuration parameters: enableHighAccuracy: true, timeout: 5000, maximumAge: 0
- **Data Throttling Mechanism**: Update database every 5-10 seconds (avoid excessive writes)
- **Location Data Upload**: Send real-time data to backend via Socket.io
- **Background Persistence**: Maintain location updates even when app is in background
\n#### 3.3.3 GPS Reporting Logic (Socket.io Implementation)
- Driver client sends location data via `socket.emit('driver:ping', payload)`
- Payload includes: busId, lat, lng, speed, heading, timestamp, tripStatus
- Backend receives and broadcasts to all clients subscribed to that vehicle
- Backend updates hourly active vehicle statistics when trip status changes
\n### 3.4 Student and Parent Module (Phase 4: Parent/Student View - The Subscriber)

#### 3.4.1 Real-time Map Tracking (Phase 2: Map Integration)
- **Map Engine**: React-Leaflet + CartoDB Dark Matter Tiles
- **Visual Style**: Cyber-dark theme with neon green markers
- **Core Features**:
  - Automatically load map interface after login
  - Display real-time location of bus assigned to the student
  - Vehicle markers use neon green pulse animation effect
  - Vehicle markers automatically move with GPS data updates
  - Display vehicle movement trajectory\n  - Smooth animation transitions: Use CSS transitions to interpolate between coordinate points for sliding effect instead of teleportation
  - Display pulse animation when vehicle is moving (triggered when speed > 0)
\n#### 3.4.2 Location Information Display
- Student pickup/drop-off point markers\n- Distance between current bus location and pickup point
- Estimated Time of Arrival (ETA)
- Automatic map refresh mechanism (via Socket.io real-time subscription)
- Route information display (read-only)

#### 3.4.3 Real-time Data Subscription
- Subscribe to vehicle location updates using Socket.io
- Filter relevant vehicle data by busId\n- No manual page refresh needed, data automatically pushed\n- Use hashmap data structure for efficient multi-vehicle state management: `{ busId: { lat, lng, speed, heading } }`

#### 3.4.4 Geofencing and Push Notifications (Phase 5: Advanced)
- **Distance Calculation**: Use Haversine formula to calculate distance between bus and student pickup point
- **Arrival Alert**: Trigger push notification when distance< 500meters:'Bus is arriving soon!'
- **Push Notification Implementation** (Mobile):
  - Use expo-notifications library
  - Automatically request push permissions\n  - Obtain FCM Token and upload to backend
  - Configure notification handlers: shouldShowAlert, shouldPlaySound, shouldSetBadge
  - Listen for notification receipt events and log to console
- **Trigger Logic**: Real-time monitoring of location changes with automatic detection\n
### 3.5 Development and Testing Tools

#### 3.5.1 GPS Simulator (simulateBus.js)
- **Purpose**: Simulate bus traveling along preset routes for development testing
- **Execution**: `node scripts/simulateBus.js <busId>`
- **Features**:
  - Connect to backend via Socket.io client
  - Simulate driver authentication process
  - Send GPS coordinates in loop following preset route array
  - Send location updates every 3 seconds
  - Include simulated speed (45km/h) and heading (90 degrees) data
  - Simulate trip start/stop events for testing hourly analytics
- **Route Configuration**: Support custom MOCK_ROUTE array or polyline decoder

## 4. Technical Architecture

### 4.1 Database Design - Enhanced Schema
- **Independent User Table Structure**:
  - `admins` table: Administrator account information (id, username, password_hash, email, created_at, last_login)
  - `drivers` table: Driver accounts and detailed information (id, username, password_hash, name, email, phone, license_number, vehicle_id foreign key, fcmToken, created_at, created_by_admin_id, status)
  - `students` table: Student profiles (id, username, password_hash, student_id_number, name, grade, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, emergency_contact, bus_id, created_at, created_by_admin_id, status)
  - `parents` table: Parent accounts (id, username, password_hash, name, email, phone, address, relationship, student_id foreign key with NOT NULL constraint, fcmToken, created_at, created_by_admin_id, status)
  - `vehicles` table: Vehicle information (id, vehicle_id_number, license_plate, model, capacity, route_name, status, created_at)\n  - `routes` table: Route information (id, route_name, polyline_string, stops_json, assigned_vehicle_id, created_at, updated_at)
  - `gps_logs` table: Driver real-time location records (id, driver_id, vehicle_id, latitude, longitude, heading, speed, timestamp)\n  - `trips` table: Trip records (id, vehicle_id, driver_id, trip_status enum('active', 'completed', 'cancelled'), start_time, end_time, created_at)\n  - `hourly_vehicle_stats` table: Aggregated hourly statistics (id, date, hour, active_vehicle_count, created_at, updated_at)
  - `audit_logs` table: Administrative action logging (id, admin_id, action_type, target_table, target_id, action_details, ip_address, timestamp)

- **Database Constraints**:
  - Foreign key constraint: `parents.student_id` references `students.id` with ON DELETE RESTRICT
  - Foreign key constraint: `drivers.vehicle_id` references `vehicles.id` with ON DELETE SET NULL
  - Foreign key constraint: `students.bus_id` references `vehicles.id` with ON DELETE SET NULL
  - Foreign key constraint: `trips.vehicle_id` references `vehicles.id` with ON DELETE CASCADE
  - Foreign key constraint: `trips.driver_id` references `drivers.id` with ON DELETE CASCADE
  - Unique constraint on usernames across all user tables (enforced via unique index)
  - Check constraint ensuring parent accounts have at least one linked student
  - Check constraint on password complexity requirements (minimum 8 characters, mixed case, numbers, special characters)
  - Check constraint on trip_status enum values
  - Index on frequently queried fields (username, student_id_number, vehicle_id, timestamp)
  - Composite index on (date, hour) in hourly_vehicle_stats table for efficient querying

### 4.2 Backend Technology Stack
- Supabase (replacing traditional Node.js + MongoDB approach)
- Supabase Auth (JWT authentication with role-based claims)
- Socket.io (WebSocket real-time communication, replacing Supabase Realtime)
- RESTful API auto-generation\n- Row Level Security (RLS) permission control
- GeofenceService (geofencing distance calculation service)
- Push Notification Service (push notification service, integrated with FCM)
- **Credential Validation Service**: Username uniqueness checker and password complexity validator
- **Audit Logging Service**: Track all administrative actions for compliance and security with IP tracking
- **Transaction Management Service**: Ensure atomic operations for student-parent creation
- **Analytics Service**: Calculate and aggregate hourly active vehicle statistics with caching
- **Real-time Stats Broadcaster**: Socket.io service broadcasting hourly statistics updates to admin clients

### 4.3 Frontend Technology Stack
\n#### Admin Dashboard:\n- React (Vite build)\n- Tailwind CSS\n- shadcn/ui component library (Data Tables, Dialog, Sheet, Toast, Form components, Card components)
- Socket.io Client (real-time communication)
- react-map-gl or React-Leaflet (map components)
- mapbox-gl-draw (route drawing plugin)
- Recharts or Chart.js (for hourly activity charts)
- **Enhanced Student/Parent Management UI**:
  - Multi-step form wizard for student addition with parent details
  - Manual credential entry fields with real-time validation
  - Password strength indicator component
  - Credential display modal with copy-to-clipboard functionality
  - Parent-student relationship visualization (tree view or graph)
  - Bulk import capability (optional future enhancement)
  - Credential management interface with reveal/mask toggle
  - Audit log viewer component
  - **Dedicated search bars for driver, student, and parent list pages with real-time filtering**
  - **Hourly active vehicles analytics dashboard with real-time charts and statistics**

#### Driver Portal (Web Version):
- React (Vite build)
- Tailwind CSS
- Socket.io Client\n- Geolocation API (browser native)
- Responsive design supporting mobile browser access
\n#### Student/Parent Portal (Mobile):
- React Native + Expo\n- expo-notifications (push notifications)
- React-Leaflet or react-native-maps\n- Socket.io Client
- Geolocation API
\n#### Map Component Dependencies:
```bash\nnpm install leaflet react-leaflet\nnpm install -D @types/leaflet\nnpm install mapbox-gl @mapbox/mapbox-gl-draw
npm install socket.io-client
npm install recharts
npm install expo-notifications (mobile)\n```

#### Global CSS Configuration (src/index.css):
```css
@import'leaflet/dist/leaflet.css';
\n.leaflet-container {
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  z-index: 0;
}\n```

### 4.4 Core API Endpoints - Enhanced
- `POST /api/auth/login`: Unified login interface (requires role parameter)
- `POST /api/gps/update`: Driver GPS location reporting (via Socket.io)
- `GET /api/gps/latest/:driverId`: Get latest location for specified driver
- `GET /api/admin/vehicles`: Admin retrieve vehicle list
- `POST /api/admin/vehicles`: Admin add vehicle\n- `PUT /api/admin/vehicles/:id`: Admin update vehicle
- `DELETE /api/admin/vehicles/:id`: Admin delete vehicle
- **`POST /api/admin/drivers`**: Admin add driver with manual credential entry (validates username uniqueness and password complexity)
- **`GET /api/admin/drivers`**: Admin retrieve driver list with optional search query parameter
- **`PUT /api/admin/drivers/:id`**: Admin update driver information
- **`DELETE /api/admin/drivers/:id`**: Admin deactivate driver
- **`POST /api/admin/students`**: Admin add student with manual credential entry and linked parent (atomic transaction, validates both usernames and passwords)
- **`GET /api/admin/students`**: Admin retrieve student list with parent associations and optional search query parameter
- **`PUT /api/admin/students/:id`**: Admin update student information
- **`DELETE /api/admin/students/:id`**: Admin deactivate student (with parent handling logic)
- **`GET /api/admin/parents`**: Admin retrieve parent list with student associations and optional search query parameter
- **`PUT /api/admin/parents/:id`**: Admin update parent information
- **`DELETE /api/admin/parents/:id`**: Admin deactivate parent (with validation)
- **`POST /api/admin/parents`**: Admin manually add parent (special cases)\n- `POST /api/routes`: Create route (receive polyline string)\n- `GET /api/routes/:id`: Get route details
- `PUT /api/routes/:id`: Update route
- `DELETE /api/routes/:id`: Delete route (with validation)
- `POST /api/users/update-fcm`: Update user FCM Token
- **`GET /api/admin/audit-logs`**: Retrieve administrative action logs with filtering
- **`POST /api/admin/credentials/reveal`**: Reveal masked credentials (with audit logging)
- **`POST /api/admin/credentials/reset-password`**: Reset user password (admin enters new password)
- **`POST /api/admin/validate-username`**: Check username uniqueness across all user tables
- **`POST /api/admin/validate-password`**: Validate password complexity requirements
- **`GET /api/admin/analytics/hourly-active`**: Get hourly active vehicle statistics for current day
- **`GET /api/admin/analytics/current-active`**: Get current number of active vehicles in real-time
- **`GET /api/admin/analytics/hourly-comparison`**: Compare current day with previous day hourly activity
- **`GET /api/admin/analytics/active-vehicles-list`**: Get list of currently active vehicles with details
- `POST /api/trips/start`: Driver starts a trip (updates trip status to 'active')
- `POST /api/trips/stop`: Driver stops a trip (updates trip status to 'completed')\n\n### 4.5 Socket.io Event Definitions

#### Driver Events:\n- `driver:auth`: Driver authentication (send token and busId)
- `driver:ping`: Send location update (busId, lat, lng, speed, heading, timestamp, tripStatus)
- `driver:trip_start`: Notify trip start event
- `driver:trip_stop`: Notify trip stop event\n\n#### Admin Events:
- `admin:all_buses_update`: Receive all vehicle location updates
- `admin:hourly_stats_update`: Receive real-time hourly active vehicle statistics updates
- `admin:active_count_update`: Receive current active vehicle count updates
\n#### Parent/Student Events:
- `parent:subscribe`: Subscribe to specific vehicle location\n- `bus:location_update`: Receive subscribed vehicle location updates
\n### 4.6 LiveMap Component Implementation (src/components/map/LiveMap.jsx)

#### Component Configuration:
- Map tiles: CartoDB Dark Matter (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`)
- Custom markers: Create neon green pulse icons using `L.divIcon`
- Tailwind animation classes: `animate-ping`, `shadow-green-400`
- Default center point: [17.3850, 78.4867] (Hyderabad example)
- Default zoom level: 13
\n#### Component Interface:
```typescript
interface VehicleLocation {
  id: string;\n  name: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  status: 'moving' | 'stopped' | 'offline';
}\n
interface LiveMapProps {
  center?: [number, number];
  zoom?: number;
  vehicles?: VehicleLocation[];
}\n```

#### State Management:
- Store vehicle states using hashmap structure: `{ busId: { lat, lng, speed, heading, tripStatus } }`
- Dynamically update via Socket.io listening to `admin:all_buses_update` event
- Vehicle markers show/hide pulse animation based on speed value
\n#### Usage Example:
```typescript
import LiveMap from '@/components/map/LiveMap';

const DashboardPage = () => {
  const [buses, setBuses] = useState({});
  const { socket } = useSocket();
\n  useEffect(() => {\n    if (!socket) return;
    socket.on('admin:all_buses_update', (data) => {
      setBuses(prev => ({
        ...prev,
        [data.busId]: data\n      }));
    });
    return () => socket.off('admin:all_buses_update');
  }, [socket]);
\n  return (
    <div className='h-screen'>
      <LiveMap \n        center={[17.3850, 78.4867]} 
        zoom={13} \n        vehicles={Object.values(buses)} 
      />
    </div>
  );
};
```

### 4.7 Push Notification Implementation (mobile/hooks/useNotifications.ts)

#### Feature Configuration:
- Use expo-notifications library\n- Configure notification handler: show notifications when app is open, play sound, do not set badge
- Automatically request push permissions
- Obtain Expo Push Token (FCM Token)\n- Listen for notification receipt events

#### Integration Steps:
1. Call `useNotifications()` hook after user login
2. Upload obtained FCM Token to backend: `axios.post('/api/users/update-fcm', { fcmToken: token })`
3. Backend sends push via FCM to corresponding users when geofence is triggered

### 4.8 Hourly Analytics Component Implementation (src/components/analytics/HourlyActiveVehicles.jsx)
\n#### Component Structure:
- **Active Vehicle Counter Card**:
  - Large numeric display showing current active vehicle count
  - Trend indicator (up/down arrow with percentage change)
  - Real-time updates via Socket.io
  - Styling: Neon green accent on dark background

- **Hourly Activity Chart**:
  - Line chart component using Recharts library
  - X-axis: 24hours (00:00 to 23:00)
  - Y-axis: Active vehicle count
  - Responsive design with dark theme
  - Tooltip showing exact values on hover
  - Grid lines with subtle styling

- **Active Vehicles List Panel**:
  - Collapsible side panel component
  - Real-time list of active vehicles\n  - Vehicle card showing: ID, driver name, route, trip duration
  - Click handler to highlight vehicle on map
  - Sort and filter options
\n#### Component Interface:
```typescript
interface HourlyStats {
  hour: number;
  activeCount: number;
}\n
interface ActiveVehicle {
  vehicleId: string;
  driverName: string;
  routeName: string;
  tripStartTime: string;
  status: 'moving' | 'stopped';
}
\ninterface HourlyActiveVehiclesProps {
  onVehicleClick?: (vehicleId: string) => void;
}\n```

#### State Management:
```typescript
const [currentActive, setCurrentActive] = useState(0);
const [hourlyData, setHourlyData] = useState<HourlyStats[]>([]);
const [activeVehicles, setActiveVehicles] = useState<ActiveVehicle[]>([]);
const [previousHourCount, setPreviousHourCount] = useState(0);
\nuseEffect(() => {
  if (!socket) return;
  \n  socket.on('admin:active_count_update', (data) => {
    setCurrentActive(data.count);
  });
  
  socket.on('admin:hourly_stats_update', (data) => {
    setHourlyData(data.hourlyStats);
  });
  
  return () => {
    socket.off('admin:active_count_update');\n    socket.off('admin:hourly_stats_update');\n  };
}, [socket]);
```

#### Usage Example:
```typescript
import HourlyActiveVehicles from '@/components/analytics/HourlyActiveVehicles';

const AdminDashboard = () => {\n  const handleVehicleClick = (vehicleId: string) => {
    // Highlight vehicle on map
    mapRef.current?.flyTo(vehicleLocations[vehicleId]);
  };

  return (
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-8'>
        <LiveMap vehicles={buses} />
      </div>
      <div className='col-span-4'>
        <HourlyActiveVehicles onVehicleClick={handleVehicleClick} />
      </div>
    </div>
  );\n};
```
\n##5. Real-time Tracking Implementation

### 5.1 Driver Side (Data Publisher)
- Use `navigator.geolocation.watchPosition` to obtain location\n- Send location data via Socket.io every 3-5 seconds
- Included fields: busId, latitude, longitude, speed, heading, timestamp, tripStatus
- Support both web and mobile platforms
- Update trip status when starting/stopping trips

### 5.2 Server Side (Socket.io + Supabase)
- Receive driver location data and store in `gps_logs` table
- Real-time broadcast to subscribed clients via Socket.io
- Execute geofencing calculations (GeofenceService)
- Trigger push notifications (when distance< 500meters)
- Location data retention policy: Keep last 24 hours of trajectory for historical playback
- **Analytics Processing**:
  - Monitor trip start/stop events
  - Update `trips` table with current trip status
  - Calculate active vehicle count in real-time
  - Aggregate hourly statistics and store in `hourly_vehicle_stats` table
  - Broadcast statistics updates via Socket.io to admin clients
  - Cache current active count for performance optimization

### 5.3 Student/Parent Side (Data Subscriber)
- Establish Socket.io connection and subscribe to specific vehicle\n- Listen for `bus:location_update` events
- Receive latest location and update map markers
- Use CSS transitions for smooth movement animations
- Receive push notification alerts\n\n### 5.4 Admin Side (Global Monitoring)
- Establish Socket.io connection\n- Listen for `admin:all_buses_update` events
- Real-time update of all vehicle locations
- Use hashmap for efficient multi-vehicle state management
- **Analytics Monitoring**:
  - Listen for `admin:hourly_stats_update` events
  - Listen for `admin:active_count_update` events
  - Update analytics dashboard in real-time
  - Display hourly activity charts with live data
  - Show current active vehicle count with trend indicators

### 5.5 Performance Optimization
- GPS data throttled storage (3-10 second intervals to avoid database overload)
- Socket.io room mechanism (broadcast by vehicle ID grouping)
- Geospatial indexing for optimized query performance
- Frontend marker interpolation animation (reduce visual jumping)
- Use hashmap instead of array traversal for improved update efficiency
- **Analytics Optimization**:
  - Cache hourly aggregates in memory (Redis or in-memory cache)
  - Batch update hourly statistics every 5 minutes
  - Use database triggers for automatic trip status updates
  - Implement efficient SQL queries with proper indexing
  - Lazy load historical data on demand

## 6. Development Phase Planning

### Phase 1: Operational Data Management (Priority: High, Complexity: Low-Medium)
- Implement admin CRUD interfaces for all user types
- Use shadcn/ui Data Tables and Dialog components
- Configure Supabase RLS permission policies
- **Implement enhanced student/parent management with manual credential entry**
- **Develop credential entry forms with real-time validation (username uniqueness, password strength)**
- **Implement credential display UI with copy-to-clipboard**
- **Implement audit logging for all administrative actions**
- **Develop driver account management with manual credential entry**
- **Implement atomic transaction handling for student-parent creation**
- **Build password strength indicator component**
- **Implement dedicated search bars for driver, student, and parent list pages with real-time filtering functionality**
\n### Phase 2: Map Integration (Priority: High, Complexity: Medium)\n- Integrate React-Leaflet and CartoDB Dark Matter\n- Create LiveMap component\n- Implement neon green pulse markers\n- Integrate mapbox-gl-draw route drawing tool
- Implement admin-exclusive route management interface
\n### Phase 3: Driver Location Logic (Priority: Medium, Complexity: High)
- Implement Geolocation API calls
- Configure data throttling mechanism
- Complete GPS data reporting logic (Socket.io)
- Develop driver web control panel interface
- Implement trip start/stop functionality

### Phase 4: Realtime Subscriptions (Priority: Medium, Complexity: High)
- Configure Socket.io server and client
- Implement event subscription logic
- Add smooth animation transitions
- Develop GPS simulator testing tool
\n### Phase 5: Geofencing & Push Notifications (Priority: Optional, Complexity: Medium)
- Implement Haversine distance calculation (GeofenceService)
- Integrate expo-notifications\n- Configure FCM push service
- Implement arrival alert functionality
- Configure Toast notification component

### Phase 6: Route Management (Priority: Medium, Complexity: Medium)
- Develop route drawing interface (RouteBuilder.jsx)
- Implement stop marking functionality
- Complete route-vehicle association logic
- Implement route deletion with validation

### Phase 7: Analytics Dashboard (Priority: High, Complexity: Medium)
- **Implement trips table and trip status tracking**
- **Develop Analytics Service for calculating hourly statistics**
- **Create hourly_vehicle_stats table with proper indexing**
- **Build HourlyActiveVehicles component with Recharts integration**
- **Implement real-time Socket.io events for analytics updates**
- **Develop active vehicle counter card with trend indicators**
- **Create hourly activity line chart with dark theme styling**
- **Build active vehicles list panel with click-to-highlight functionality**
- **Implement caching mechanism for performance optimization**
- **Add historical comparison features (day-over-day, weekly averages)**
- **Integrate analytics dashboard into admin layout**
- **Test real-time updates with GPS simulator**

## 7. Testing and Deployment Process

### 7.1 Development Testing Process
1. **Start GPS Simulator**: `node scripts/simulateBus.js bus_001`
2. **Open Driver Control Panel**: Access `http://192.168.1.x:3000/driver` in mobile browser (use local IP)
3. **Open Admin Dashboard**: Access real-time monitoring map in desktop browser
4. **Verify Data Flow**: Confirm map markers move with simulator or real GPS
5. **Test Student/Parent Creation**: Verify manual credential entry with validation and parent linking
6. **Test Driver Creation**: Verify manual credential entry with validation\n7. **Test RBAC**: Verify role-based access restrictions work correctly across all endpoints
8. **Test Credential Management**: Verify reveal/mask functionality and audit logging
9. **Test Route Management**: Verify admin-exclusive route configuration\n10. **Test Username Uniqueness**: Attempt to create duplicate usernames across different user types
11. **Test Password Validation**: Attempt to create accounts with weak passwords
12. **Test Search Functionality**: Verify search bars on driver, student, and parent pages filter results correctly in real-time
13. **Test Analytics Dashboard**:
    - Start multiple simulated trips
    - Verify active vehicle count updates in real-time\n    - Verify hourly chart displays correct data
    - Stop trips and verify count decreases\n    - Test active vehicles list panel functionality
    - Verify click-to-highlight on map works
    - Test historical comparison features
    - Verify Socket.io events fire correctly

### 7.2 Key Verification Points
- Socket.io connection status
- GPS data reporting frequency
- Map marker smooth movement effect
- Push notification trigger timing
- Multi-vehicle concurrent tracking performance
- **Student-parent account creation atomicity**
- **Driver account creation with manual credential entry**
- **Username uniqueness validation across all user tables**
- **Password complexity validation**
- **Real-time validation feedback in forms**
- **RBAC policy enforcement across all endpoints**
- **Audit logging accuracy and completeness**
- **Transaction rollback on failure scenarios**
- **Search bar functionality and performance on driver, student, and parent list pages**
- **Analytics Dashboard Verification**:
  - Real-time active vehicle count accuracy
  - Hourly chart data accuracy and updates
  - Active vehicles list real-time updates
  - Trip status tracking correctness
  - Socket.io event broadcasting reliability
  - Chart rendering performance with large datasets
  - Cache invalidation and refresh logic
  - Historical data aggregation accuracy

### 7.3 Deployment Checklist
- Generate Google Maps custom style JSON (mapStyle.json) to match Cyber-Dark theme
- Configure production Socket.io server address
- Set FCM server key\n- Configure Supabase production environment variables
- Enable HTTPS (required for push notifications and geolocation)
- **Verify RLS policies are active in production**
- **Test credential validation service under load**
- **Configure audit log retention policy**
- **Set up database backup and recovery procedures**
- **Configure session timeout and security headers**
- **Test all RBAC policies in production environment**
- **Verify username uniqueness constraints are enforced**
- **Test password complexity validation in production**
- **Analytics Deployment**:
  - Verify hourly_vehicle_stats table is created with proper indexes
  - Test Analytics Service performance under load
  - Configure caching layer (Redis or in-memory)
  - Set up database triggers for trip status updates
  - Verify Socket.io analytics events work in production
  - Test chart rendering performance\n  - Configure data retention policy for historical statistics
  - Set up monitoring and alerting for analytics service

## 8. Security and Performance\n- Password encryption storage (Supabase Auth built-in bcrypt)
- JWT token expiration mechanism with refresh token support
- CORS cross-origin configuration
- Request rate limiting protection
- GPS data throttled storage (3-10 second intervals)
- Geospatial indexing for optimized query performance
- Supabase RLS row-level security policies
- Socket.io room isolation mechanism
- FCM Token secure storage and updates
- **Real-time username uniqueness validation to prevent duplicates**
- **Password complexity enforcement (minimum 8 characters, mixed case, numbers, special characters)**
- **Audit logging for all administrative actions with IP tracking**
- **Database transaction management for atomic student-parent creation**
- **Input validation and sanitization for all user-generated content**
- **SQL injection prevention through parameterized queries**
- **XSS protection through content security policies**
- **Session management with secure cookies (httpOnly, secure, sameSite)**
- **Credential reveal audit trail with timestamp and admin identification**
- **Form validation on both client and server side**
- **Unique index constraints on username fields across all user tables**
- **Search query sanitization to prevent injection attacks**
- **Analytics Performance**:
  - Efficient SQL queries with composite indexes on (date, hour)\n  - Caching layer for frequently accessed statistics
  - Batch processing for hourly aggregations
  - Database connection pooling
  - Query result pagination for large datasets
  - Lazy loading for historical data
  - Optimized Socket.io event payload sizes
  - Frontend chart data memoization

## 9. Website Design Style\n- **Theme Positioning**: Cyber-dark style with neon green accents, emphasizing technology and futurism
- **Color Scheme**:
  - Main background: #1a1a1a (deep black)
  - Card background: #ffffff (pure white, admin dashboard)
  - Primary color: #3b82f6 (tech blue)
  - Neon green: #10b981 (emerald, for map markers, emphasis elements, START button, analytics highlights)
  - Warning/stop button: #ef4444 (red)\n  - Border color: #e2e8f0 (light gray)
  - Success state: #10b981 (emerald green)
  - Error state: #ef4444 (red)
  - Validation error: #ef4444 (red for error messages)
  - Validation success: #10b981 (green for valid inputs)
  - Chart colors: Neon green (#10b981) for primary data, gradient fills for area charts
- **Visual Details**:
  - Map markers: Neon green pulse animation (animate-ping) with shadow effects (shadow-green-400), pulse displays when vehicle is moving
  - Border radius: Medium rounded (0.5rem), large buttons use rounded-xl
  - Shadows: Subtle card shadows, buttons use shadow-lg for enhanced depth
  - Buttons: Flat design with slight lift effect on hover, driver control panel buttons use large size design (py-6text-2xl)
  - Map: CartoDB Dark Matter dark basemap, clear marker icons, vehicle markers with directional indicators and speed status
  - Tables: Zebra-striped rows, hover highlighting, sortable columns\n  - Status indicators: Use colors to distinguish online/offline status (ON AIR in emerald green, OFFLINE in gray)
  - **Form elements**: Clear field labels, inline validation feedback with color-coded messages, success/error states with appropriate color coding
  - **Password strength indicator**: Visual bar showing password strength (weak/medium/strong) with color progression (red/yellow/green)
  - **Credential display**: Monospace font for usernames/passwords, masked by default with reveal toggle
  - **Multi-step forms**: Progress bar with step indicators, clear navigation buttons
  - **Validation messages**: Inline error messages below input fields, real-time feedback as user types
  - **Search bars**: Positioned prominently above data tables, with search icon, placeholder text, and clear button; styled with subtle border and focus state highlighting
  - **Analytics Cards**: Large numeric displays with neon green accents, trend indicators with up/down arrows, subtle gradient backgrounds
  - **Charts**: Dark theme with neon green lines, subtle grid lines, hover tooltips with detailed information, smooth animations
  - **Active Vehicle List**: Card-based layout with vehicle status indicators, click-to-highlight interaction, smooth transitions
- **Layout Approach**:
  - Admin dashboard: Sidebar navigation + main content area with breadcrumb navigation
  - Driver control panel: Full-screen vertical center layout, large button design for mobile operation convenience
  - Mobile/parent portal: Full-screen map view + bottom status bar
  - Forms: Vertical arrangement with clear field labels and inline validation
  - Responsive design adapted for desktop and mobile devices
  - **Multi-step forms**: Progress indicators for student/parent creation workflow with step validation
  - **Modal dialogs**: Centered overlay with backdrop blur, clear action buttons\n  - **Data tables**: Pagination, search, filter, and sort capabilities with responsive column hiding
  - **Form validation**: Real-time feedback with color-coded borders (red for errors, green for valid inputs)
  - **Search interface**: Dedicated search bars positioned above driver, student, and parent list tables with consistent styling and real-time filtering
  - **Analytics Dashboard Layout**:
    - Top row: Active vehicle counter card (prominent placement)
    - Middle section: Hourly activity chart (full width)
    - Side panel: Active vehicles list (collapsible)\n    - Grid-based responsive layout (12-column system)
    - Smooth transitions between different views
    - Mobile-optimized stacked layout for smaller screens