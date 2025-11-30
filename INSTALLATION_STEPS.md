# Installation Steps for Firebase + MongoDB Integration

## Prerequisites
- Node.js installed
- npm or pnpm installed
- Firebase project created
- MongoDB Atlas cluster created

## Step 1: Install Dependencies

Run these commands in your terminal:

```bash
cd /workspace/app-7wscx5suxq0x

# Install Firebase SDK
npm install firebase

# Install MongoDB driver
npm install mongodb

# Optional: Install Firebase CLI globally
npm install -g firebase-tools
```

## Step 2: Update Environment Variables

Create or update `.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCZ-JXz25NjJ65YZLbT_qwz6LueyEnt_04
VITE_FIREBASE_AUTH_DOMAIN=bus-arriving.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bus-arriving
VITE_FIREBASE_STORAGE_BUCKET=bus-arriving.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1067452562244
VITE_FIREBASE_APP_ID=1:1067452562244:web:c2e807dcc97e997704b511
VITE_FIREBASE_MEASUREMENT_ID=G-L6RY0RZ0QP

# MongoDB Configuration
VITE_MONGODB_URI=mongodb+srv://bannu102305_db_user:jB9c7Db3iQj7FNLT@cluster0.dldxlpr.mongodb.net/?appName=Cluster0
VITE_MONGODB_DB_NAME=school_bus_tracking

# App Configuration
VITE_APP_ID=school-bus-app
VITE_API_ENV=production
```

## Step 3: Firebase Setup

### Enable Authentication Methods
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: `bus-arriving`
3. Go to **Authentication** → **Sign-in method**
4. Enable:
   - ✅ Email/Password
   - ✅ Anonymous (optional for guest access)

### Set up Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode**
4. Select region closest to your users

### Configure Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow admins full access
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Public read for vehicles and routes
    match /vehicles/{vehicleId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /routes/{routeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 4: MongoDB Atlas Setup

### Create Database and Collections
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Select cluster: `Cluster0`
3. Click **Browse Collections**
4. Create database: `school_bus_tracking`
5. Create collections:
   - `admins`
   - `drivers`
   - `parents`
   - `students`
   - `vehicles`
   - `routes`
   - `stops`
   - `gps_logs`
   - `trips`

### Create Indexes

Run these commands in MongoDB Shell:

```javascript
// Geospatial index for GPS tracking
db.gps_logs.createIndex({ location: "2dsphere" });
db.drivers.createIndex({ current_location: "2dsphere" });

// Unique indexes
db.admins.createIndex({ username: 1 }, { unique: true });
db.drivers.createIndex({ username: 1 }, { unique: true });
db.parents.createIndex({ username: 1 }, { unique: true });
db.students.createIndex({ student_id: 1 }, { unique: true });
db.vehicles.createIndex({ vehicle_id: 1 }, { unique: true });
db.vehicles.createIndex({ registration_number: 1 }, { unique: true });

// Performance indexes
db.students.createIndex({ parent_id: 1 });
db.gps_logs.createIndex({ driver_id: 1, timestamp: -1 });
db.trips.createIndex({ driver_id: 1, start_time: -1 });
```

### Configure Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. Choose **Allow Access from Anywhere** (0.0.0.0/0) for development
4. For production, add specific IP addresses

### Configure Database User
1. Go to **Database Access**
2. Verify user: `bannu102305_db_user` exists
3. Ensure it has **Read and write to any database** permission

## Step 5: Test Connections

### Test Firebase Connection
```javascript
// In browser console
import { auth } from './src/config/firebase';
console.log('Firebase Auth:', auth);
```

### Test MongoDB Connection
```javascript
// Create a test API endpoint
fetch('/api/test-mongodb')
  .then(res => res.json())
  .then(data => console.log('MongoDB connected:', data));
```

## Step 6: Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

## Step 7: Create Initial Admin Account

Use Firebase Console to create the first admin:

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Email: `admin@schooltransport.com`
4. Password: `Admin@123456`
5. After creation, add custom claim:

```javascript
// In Firebase Console → Functions or using Admin SDK
admin.auth().setCustomUserClaims(uid, { role: 'admin' });
```

Or use the provided script:

```bash
node scripts/create-admin.js
```

## Troubleshooting

### Firebase Connection Issues
- Verify API key in `.env`
- Check Firebase project settings
- Ensure authentication methods are enabled

### MongoDB Connection Issues
- Verify connection string
- Check network access settings
- Verify database user permissions
- Test connection with MongoDB Compass

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Update packages: `npm update`

## Next Steps

After installation:
1. ✅ Test authentication (login/logout)
2. ✅ Test vehicle CRUD operations
3. ✅ Test GPS tracking
4. ✅ Test realtime updates
5. ✅ Deploy to production

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Firebase Console logs
3. Check MongoDB Atlas logs
4. Review `DEBUGGING_GUIDE.md`

---

**Status:** Ready for installation
**Estimated Time:** 30-45 minutes
