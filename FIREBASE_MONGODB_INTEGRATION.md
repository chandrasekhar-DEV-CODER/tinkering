# Firebase + MongoDB Integration Guide

## 🎯 Overview

This document explains the integration of **Firebase** (Authentication + Analytics + Realtime) and **MongoDB Atlas** (Database) into the My School Ride system.

---

## 📦 What's Been Set Up

### 1. Firebase Configuration
**File:** `/src/config/firebase.ts`

**Services Initialized:**
- ✅ Firebase Authentication
- ✅ Firestore Database (for realtime features)
- ✅ Realtime Database (for GPS tracking)
- ✅ Analytics

**Features:**
- Environment variable support
- Emulator support for local development
- Automatic initialization

### 2. MongoDB Configuration
**File:** `/src/config/mongodb.ts`

**Features:**
- Connection pooling (5-10 connections)
- Auto-reconnection
- Collection helpers
- Type-safe collection access

**Collections:**
- `admins` - Administrator accounts
- `drivers` - Driver accounts with GPS tracking
- `parents` - Parent accounts
- `students` - Student profiles
- `vehicles` - School bus fleet
- `routes` - Bus routes
- `stops` - Bus stops
- `gps_logs` - GPS tracking history
- `trips` - Trip sessions

### 3. Environment Variables
**File:** `.env`

**Added:**
```env
# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...

# MongoDB
VITE_MONGODB_URI=mongodb+srv://...
VITE_MONGODB_DB_NAME=school_bus_tracking
```

---

## 🚀 Next Steps

### Step 1: Install Dependencies

**IMPORTANT:** Run this command to install Firebase and MongoDB packages:

```bash
cd /workspace/app-7wscx5suxq0x

# Install Firebase SDK
npm install firebase

# Install MongoDB driver  
npm install mongodb
```

**Expected time:** 5-10 minutes

### Step 2: Firebase Setup

#### A. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **bus-arriving**
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. (Optional) Enable **Anonymous** for guest access

#### B. Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode**
4. Select region (e.g., `us-central1`)

#### C. Set Security Rules
Copy and paste these rules in **Firestore Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.role == 'admin';
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Admin-only collections
    match /admins/{document} {
      allow read, write: if isAdmin();
    }
    
    match /drivers/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /parents/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /students/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Public read, admin write
    match /vehicles/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /routes/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /stops/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // GPS logs - drivers can write their own
    match /gps_logs/{document} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
    
    // Trips
    match /trips/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

#### D. Enable Realtime Database
1. Go to **Realtime Database**
2. Click **Create Database**
3. Choose **United States** or your preferred location
4. Start in **Locked mode**

**Realtime Database Rules:**
```json
{
  "rules": {
    "gps_tracking": {
      "$driverId": {
        ".read": true,
        ".write": "$driverId === auth.uid || root.child('admins').child(auth.uid).exists()"
      }
    },
    "active_vehicles": {
      ".read": true,
      ".write": "root.child('admins').child(auth.uid).exists()"
    }
  }
}
```

### Step 3: MongoDB Atlas Setup

#### A. Create Database
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select cluster: **Cluster0**
3. Click **Browse Collections**
4. Click **Create Database**
   - Database name: `school_bus_tracking`
   - Collection name: `admins`

#### B. Create Collections
Click **Create Collection** for each:
- `drivers`
- `parents`
- `students`
- `vehicles`
- `routes`
- `stops`
- `gps_logs`
- `trips`

#### C. Create Indexes

Click on **Indexes** tab for each collection and create:

**admins:**
```javascript
{ "username": 1 } // unique
{ "email": 1 } // unique
```

**drivers:**
```javascript
{ "username": 1 } // unique
{ "email": 1 } // unique
{ "current_location": "2dsphere" } // geospatial
{ "vehicle_id": 1 }
```

**parents:**
```javascript
{ "username": 1 } // unique
{ "email": 1 } // unique
```

**students:**
```javascript
{ "student_id": 1 } // unique
{ "parent_id": 1 }
{ "vehicle_id": 1 }
```

**vehicles:**
```javascript
{ "vehicle_id": 1 } // unique
{ "registration_number": 1 } // unique
```

**routes:**
```javascript
{ "route_code": 1 } // unique
```

**stops:**
```javascript
{ "route_id": 1 }
{ "location": "2dsphere" } // geospatial
```

**gps_logs:**
```javascript
{ "driver_id": 1, "timestamp": -1 }
{ "location": "2dsphere" } // geospatial
{ "timestamp": -1 }
```

**trips:**
```javascript
{ "driver_id": 1, "start_time": -1 }
{ "route_id": 1 }
{ "status": 1 }
```

#### D. Configure Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. For development: Choose **Allow Access from Anywhere** (0.0.0.0/0)
4. For production: Add specific IP addresses

#### E. Verify Database User
1. Go to **Database Access**
2. Verify user: `bannu102305_db_user`
3. Ensure permissions: **Read and write to any database**

### Step 4: Create Initial Admin Account

You'll need to create the first admin account using Firebase Console:

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - Email: `chandrasekharadmin@schooltransport.com`
   - Password: `chandrasekharadmin1023@@`
4. Click **Add user**
5. Copy the **User UID**

6. Add custom claim (use Firebase Admin SDK or Functions):
```javascript
admin.auth().setCustomUserClaims(uid, { 
  role: 'admin',
  username: 'chandrasekharadmin'
});
```

7. Add admin document to MongoDB:
```javascript
db.admins.insertOne({
  firebase_uid: "USER_UID_FROM_STEP_5",
  username: "chandrasekharadmin",
  email: "chandrasekharadmin@schooltransport.com",
  full_name: "Universal Administrator",
  role: "admin",
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
});
```

---

## 🔄 Migration Strategy

### Current State
- ✅ Supabase configuration exists (legacy)
- ✅ Firebase configuration created
- ✅ MongoDB configuration created
- ⏳ API layer still uses Supabase
- ⏳ Authentication still uses Supabase

### Migration Options

#### Option 1: Gradual Migration (Recommended)
Keep both systems running and migrate feature by feature:

1. **Phase 1:** Set up Firebase + MongoDB (DONE ✅)
2. **Phase 2:** Migrate authentication to Firebase
3. **Phase 3:** Migrate database operations to MongoDB
4. **Phase 4:** Migrate realtime features to Firebase Realtime DB
5. **Phase 5:** Remove Supabase dependencies

**Pros:**
- Lower risk
- Can test each feature independently
- Easy rollback

**Cons:**
- Longer migration time
- Maintain two systems temporarily

#### Option 2: Complete Migration
Replace all Supabase code with Firebase + MongoDB at once:

1. Update authentication layer
2. Update database API layer
3. Update realtime subscriptions
4. Test everything
5. Deploy

**Pros:**
- Faster completion
- Clean codebase

**Cons:**
- Higher risk
- More testing required
- Harder to rollback

### Recommended Approach

**Use Option 1 (Gradual Migration)** with this order:

1. ✅ **Setup** (COMPLETED)
   - Firebase config
   - MongoDB config
   - Environment variables

2. **Authentication Migration** (Next)
   - Create Firebase auth service
   - Update login/logout
   - Update AuthContext
   - Test authentication flow

3. **Database Migration**
   - Create MongoDB models
   - Update API layer
   - Migrate CRUD operations
   - Test data operations

4. **Realtime Migration**
   - Update GPS tracking
   - Update live map
   - Test realtime updates

5. **Cleanup**
   - Remove Supabase dependencies
   - Update documentation
   - Final testing

---

## 📝 Code Examples

### Using Firebase Authentication

```typescript
import { auth } from '@/config/firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword 
} from 'firebase/auth';

// Login
async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get custom claims (role)
    const idTokenResult = await user.getIdTokenResult();
    const role = idTokenResult.claims.role;
    
    return { user, role };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Logout
async function logout() {
  await signOut(auth);
}

// Create user
async function createUser(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}
```

### Using MongoDB

```typescript
import { getCollection, Collections } from '@/config/mongodb';

// Get vehicles
async function getVehicles() {
  const collection = getCollection(Collections.VEHICLES);
  const vehicles = await collection.find({ is_active: true }).toArray();
  return vehicles;
}

// Create vehicle
async function createVehicle(vehicleData: any) {
  const collection = getCollection(Collections.VEHICLES);
  const result = await collection.insertOne({
    ...vehicleData,
    created_at: new Date(),
    updated_at: new Date()
  });
  return result;
}

// Update vehicle
async function updateVehicle(vehicleId: string, updates: any) {
  const collection = getCollection(Collections.VEHICLES);
  const result = await collection.updateOne(
    { vehicle_id: vehicleId },
    { 
      $set: {
        ...updates,
        updated_at: new Date()
      }
    }
  );
  return result;
}

// Delete vehicle
async function deleteVehicle(vehicleId: string) {
  const collection = getCollection(Collections.VEHICLES);
  const result = await collection.deleteOne({ vehicle_id: vehicleId });
  return result;
}
```

### Using Firebase Realtime Database for GPS Tracking

```typescript
import { realtimeDb } from '@/config/firebase';
import { ref, set, onValue, off } from 'firebase/database';

// Update driver location
async function updateDriverLocation(driverId: string, location: any) {
  const locationRef = ref(realtimeDb, `gps_tracking/${driverId}`);
  await set(locationRef, {
    latitude: location.latitude,
    longitude: location.longitude,
    speed: location.speed,
    heading: location.heading,
    timestamp: Date.now()
  });
}

// Subscribe to driver location updates
function subscribeToDriverLocation(driverId: string, callback: (location: any) => void) {
  const locationRef = ref(realtimeDb, `gps_tracking/${driverId}`);
  
  onValue(locationRef, (snapshot) => {
    const location = snapshot.val();
    callback(location);
  });
  
  // Return unsubscribe function
  return () => off(locationRef);
}

// Subscribe to all active vehicles
function subscribeToActiveVehicles(callback: (vehicles: any) => void) {
  const vehiclesRef = ref(realtimeDb, 'active_vehicles');
  
  onValue(vehiclesRef, (snapshot) => {
    const vehicles = snapshot.val();
    callback(vehicles);
  });
  
  return () => off(vehiclesRef);
}
```

---

## 🧪 Testing

### Test Firebase Connection

```typescript
// In browser console or test file
import { auth } from './src/config/firebase';

console.log('Firebase Auth:', auth);
console.log('Current User:', auth.currentUser);
```

### Test MongoDB Connection

```typescript
import { connectToMongoDB, getCollection, Collections } from './src/config/mongodb';

// Test connection
await connectToMongoDB();

// Test query
const vehicles = await getCollection(Collections.VEHICLES).find().limit(5).toArray();
console.log('Vehicles:', vehicles);
```

### Test Authentication Flow

1. Create test user in Firebase Console
2. Try logging in with test credentials
3. Verify user object and custom claims
4. Test logout

### Test Database Operations

1. Create a test vehicle
2. Read vehicles list
3. Update vehicle
4. Delete vehicle
5. Verify in MongoDB Atlas

---

## 🔒 Security Best Practices

### Firebase Security
1. ✅ Use environment variables for API keys
2. ✅ Implement proper Firestore security rules
3. ✅ Use custom claims for role-based access
4. ✅ Enable App Check for production
5. ✅ Implement rate limiting

### MongoDB Security
1. ✅ Use connection string with authentication
2. ✅ Restrict network access by IP
3. ✅ Use read-only users where appropriate
4. ✅ Enable MongoDB Atlas encryption
5. ✅ Regular backup schedule

### Application Security
1. ✅ Validate all user inputs
2. ✅ Sanitize data before database operations
3. ✅ Use HTTPS in production
4. ✅ Implement CORS properly
5. ✅ Regular security audits

---

## 📊 Performance Optimization

### Firebase
- Use Firebase Hosting for static assets
- Enable Firebase Performance Monitoring
- Implement proper indexing in Firestore
- Use Firebase Realtime Database for frequently updated data

### MongoDB
- Create appropriate indexes (especially geospatial)
- Use connection pooling
- Implement pagination for large datasets
- Use aggregation pipelines for complex queries
- Enable MongoDB Atlas Performance Advisor

---

## 🐛 Troubleshooting

### Firebase Issues

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Check `.env` file has correct `VITE_FIREBASE_API_KEY`
- Verify API key in Firebase Console

**Error: "Firebase: Error (auth/network-request-failed)"**
- Check internet connection
- Verify Firebase project is active
- Check browser console for CORS errors

**Error: "Firebase: Error (auth/user-not-found)"**
- User doesn't exist in Firebase Authentication
- Create user in Firebase Console first

### MongoDB Issues

**Error: "MongoServerError: bad auth"**
- Verify username and password in connection string
- Check Database Access permissions in MongoDB Atlas

**Error: "MongoServerError: connection timeout"**
- Check Network Access settings
- Verify IP address is whitelisted
- Check firewall settings

**Error: "Database not initialized"**
- Call `connectToMongoDB()` before using database
- Check if connection string is correct

---

## 📚 Additional Resources

### Firebase Documentation
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)
- [Realtime Database](https://firebase.google.com/docs/database)
- [Firebase Analytics](https://firebase.google.com/docs/analytics)

### MongoDB Documentation
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [Geospatial Queries](https://docs.mongodb.com/manual/geospatial-queries/)
- [Indexes](https://docs.mongodb.com/manual/indexes/)

### Related Files
- `INSTALLATION_STEPS.md` - Detailed installation guide
- `MIGRATION_PLAN.md` - Migration strategy
- `DEBUGGING_GUIDE.md` - Debugging tips
- `src/config/firebase.ts` - Firebase configuration
- `src/config/mongodb.ts` - MongoDB configuration

---

## ✅ Checklist

### Setup Phase
- [x] Create Firebase configuration file
- [x] Create MongoDB configuration file
- [x] Update environment variables
- [ ] Install Firebase SDK (`npm install firebase`)
- [ ] Install MongoDB driver (`npm install mongodb`)

### Firebase Setup
- [ ] Enable Email/Password authentication
- [ ] Create Firestore database
- [ ] Set Firestore security rules
- [ ] Create Realtime Database
- [ ] Set Realtime Database rules
- [ ] Create first admin user

### MongoDB Setup
- [ ] Create database: `school_bus_tracking`
- [ ] Create all collections
- [ ] Create indexes
- [ ] Configure network access
- [ ] Verify database user permissions
- [ ] Insert initial admin document

### Testing
- [ ] Test Firebase authentication
- [ ] Test MongoDB connection
- [ ] Test CRUD operations
- [ ] Test GPS tracking
- [ ] Test realtime updates

### Migration (Future)
- [ ] Migrate authentication layer
- [ ] Migrate database API layer
- [ ] Migrate realtime features
- [ ] Remove Supabase dependencies
- [ ] Update documentation

---

**Status:** Configuration Complete ✅  
**Next Step:** Install dependencies (`npm install firebase mongodb`)  
**Estimated Time:** 30-45 minutes for complete setup

---

**Last Updated:** 2025-11-30  
**Version:** 1.0.0
