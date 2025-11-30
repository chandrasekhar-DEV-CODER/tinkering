# 🚀 My School Ride - Complete Setup Guide

## Overview

This is the complete setup guide for the My School Ride enterprise-grade school bus tracking system. The system uses:

- **Firebase** - Authentication & Real-time updates
- **MongoDB Atlas** - Database with geospatial support
- **Mapbox** - Live GPS tracking maps
- **React + TypeScript** - Frontend framework
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or pnpm package manager
- ✅ Firebase project created
- ✅ MongoDB Atlas cluster created
- ✅ Mapbox account with API token
- ✅ Git installed (optional)

---

## 🎯 Quick Start (30 Minutes)

### Step 1: Install Dependencies (5 minutes)

```bash
cd /workspace/app-7wscx5suxq0x

# Option A: Use the installation script
./install-firebase-mongodb.sh

# Option B: Manual installation
npm install firebase mongodb mapbox-gl react-map-gl @types/mapbox-gl @turf/turf
```

### Step 2: Verify Environment Variables (2 minutes)

Check `.env` file contains all required credentials:

```env
# Firebase
VITE_FIREBASE_API_KEY=AIzaSyCZ-JXz25NjJ65YZLbT_qwz6LueyEnt_04
VITE_FIREBASE_AUTH_DOMAIN=bus-arriving.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bus-arriving
VITE_FIREBASE_STORAGE_BUCKET=bus-arriving.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1067452562244
VITE_FIREBASE_APP_ID=1:1067452562244:web:c2e807dcc97e997704b511
VITE_FIREBASE_MEASUREMENT_ID=G-L6RY0RZ0QP

# MongoDB
VITE_MONGODB_URI=mongodb+srv://bannu102305_db_user:jB9c7Db3iQj7FNLT@cluster0.dldxlpr.mongodb.net/?appName=Cluster0
VITE_MONGODB_DB_NAME=school_bus_tracking

# Mapbox
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoia2FydGhpazAzNjkiLCJhIjoiY21nZXU2YjIxMDFlOTJqcjRmaXZzMDFpYSJ9.xQWX7u_F44C3-4sFhuibIg
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/dark-v11
```

### Step 3: Configure Firebase (10 minutes)

1. **Enable Authentication:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: **bus-arriving**
   - Navigate to **Authentication** → **Sign-in method**
   - Enable **Email/Password**

2. **Create Firestore Database:**
   - Go to **Firestore Database**
   - Click **Create database**
   - Choose **Production mode**
   - Select region (e.g., `us-central1`)

3. **Create Realtime Database:**
   - Go to **Realtime Database**
   - Click **Create Database**
   - Choose **United States**
   - Start in **Locked mode**

4. **Set Security Rules:**
   - See `FIREBASE_MONGODB_INTEGRATION.md` for complete rules

### Step 4: Configure MongoDB (8 minutes)

1. **Create Database:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Select cluster: **Cluster0**
   - Click **Browse Collections** → **Create Database**
   - Database name: `school_bus_tracking`
   - First collection: `admins`

2. **Create Collections:**
   - `drivers`
   - `parents`
   - `students`
   - `vehicles`
   - `routes`
   - `stops`
   - `gps_logs`
   - `trips`

3. **Create Indexes:**
   - See `FIREBASE_MONGODB_INTEGRATION.md` for index definitions

4. **Configure Network Access:**
   - Go to **Network Access**
   - Add IP: **0.0.0.0/0** (for development)

### Step 5: Create Admin Account (5 minutes)

1. **Firebase Console:**
   - Go to **Authentication** → **Users**
   - Click **Add user**
   - Email: `chandrasekharadmin@schooltransport.com`
   - Password: `chandrasekharadmin1023@@`
   - Copy the User UID

2. **Add Custom Claim** (using Firebase Admin SDK or Functions):
   ```javascript
   admin.auth().setCustomUserClaims(uid, { 
     role: 'admin',
     username: 'chandrasekharadmin'
   });
   ```

3. **Add to MongoDB:**
   ```javascript
   db.admins.insertOne({
     firebase_uid: "USER_UID_HERE",
     username: "chandrasekharadmin",
     email: "chandrasekharadmin@schooltransport.com",
     full_name: "Universal Administrator",
     role: "admin",
     is_active: true,
     created_at: new Date(),
     updated_at: new Date()
   });
   ```

### Step 6: Run the Application

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 📁 Project Structure

```
/workspace/app-7wscx5suxq0x/
├── src/
│   ├── config/
│   │   ├── firebase.ts          # Firebase configuration
│   │   ├── mongodb.ts           # MongoDB connection
│   │   └── mapbox.ts            # Mapbox settings
│   ├── components/
│   │   ├── common/              # Shared components
│   │   └── ui/                  # shadcn/ui components
│   ├── pages/
│   │   ├── admin/               # Admin pages
│   │   ├── driver/              # Driver pages
│   │   └── tracking/            # Tracking pages
│   ├── db/
│   │   ├── supabase.ts          # Legacy Supabase (to be migrated)
│   │   └── authApi.ts           # API layer
│   ├── types/
│   │   └── types.ts             # TypeScript types
│   └── utils/
│       └── accountGenerator.ts  # Account utilities
├── supabase/
│   └── migrations/              # Database migrations (legacy)
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── Documentation files...
```

---

## 🗂️ Documentation Files

### Setup & Installation
1. **COMPLETE_SETUP_GUIDE.md** (this file) - Complete setup guide
2. **INSTALLATION_STEPS.md** - Detailed installation steps
3. **install-firebase-mongodb.sh** - Automated installation script

### Integration Guides
4. **FIREBASE_MONGODB_INTEGRATION.md** - Firebase & MongoDB integration
5. **MAPBOX_INTEGRATION.md** - Mapbox map integration
6. **README_FIREBASE_MONGODB.md** - Quick start guide

### Migration & Debugging
7. **MIGRATION_PLAN.md** - Supabase to Firebase/MongoDB migration
8. **DEBUGGING_GUIDE.md** - Troubleshooting guide
9. **QUICK_FIX_SUMMARY.md** - Quick fixes for common issues
10. **APPLY_FIX_INSTRUCTIONS.md** - Database fix instructions

### System Documentation
11. **ADMIN_SYSTEM_SPECIFICATION.md** - Admin system specs
12. **COMPLETE_SYSTEM_SUMMARY.md** - Full system overview

---

## 🔧 Configuration Files

### Firebase Configuration
**File:** `src/config/firebase.ts`

**Services:**
- Firebase Authentication
- Firestore Database
- Realtime Database
- Analytics

**Features:**
- Environment variable support
- Emulator support
- Auto-initialization

### MongoDB Configuration
**File:** `src/config/mongodb.ts`

**Features:**
- Connection pooling
- Auto-reconnection
- Collection helpers
- Type-safe access

**Collections:**
- admins, drivers, parents, students
- vehicles, routes, stops
- gps_logs, trips

### Mapbox Configuration
**File:** `src/config/mapbox.ts`

**Features:**
- Dark theme map (cyber-dark aesthetic)
- GPS tracking settings
- Geofencing (1km radius)
- Distance/bearing calculations
- Vehicle marker animations

---

## 🎨 Design System

### Color Scheme (Cyber-Dark)
```css
--background: #0f172a      /* Deep slate blue */
--card: #1e293b            /* Dark gray blue */
--primary: #10b981         /* Neon green */
--destructive: #ef4444     /* Alert red */
--border: #475569          /* Slate gray */
```

### Typography
- Font: Inter (system font stack)
- Headings: Bold, large sizes
- Body: Regular, readable sizes

### Components
- Rounded corners: xl (0.75rem)
- Shadows: Multi-layer effects
- Borders: Thin lines with dark tones
- Animations: Framer Motion transitions

---

## 🚀 Features

### User Management
- ✅ Multi-role system (Admin, Driver, Parent, Student)
- ✅ Automatic account generation
- ✅ Credential display with copy-to-clipboard
- ✅ Role-based access control (RBAC)

### Vehicle Management
- ✅ Fleet tracking
- ✅ Vehicle assignment to drivers
- ✅ Status monitoring (Active, Maintenance, Retired)
- ✅ Last known location

### GPS Tracking
- ✅ Real-time location updates (10-second interval)
- ✅ Speed and heading tracking
- ✅ GPS breadcrumb trail
- ✅ Geofencing with 1km radius
- ✅ Automatic notifications

### Live Map
- ✅ Mapbox dark theme
- ✅ Vehicle markers with rotation
- ✅ Pulse animation for moving vehicles
- ✅ Route visualization
- ✅ Bus stop markers
- ✅ Real-time updates via Firebase

### Student Management
- ✅ Student profiles
- ✅ Parent linking
- ✅ Vehicle assignment
- ✅ Pickup/dropoff locations
- ✅ Attendance tracking

### Route Management
- ✅ Route planning
- ✅ Stop configuration
- ✅ ETA calculations
- ✅ Route optimization

### Analytics Dashboard
- ✅ Total vehicles count
- ✅ Active trips monitoring
- ✅ Alert notifications
- ✅ Maintenance tracking
- ✅ Activity trends

---

## 🔐 Security

### Firebase Security
- ✅ Custom claims for roles
- ✅ Firestore security rules
- ✅ Realtime Database rules
- ✅ Email/password authentication

### MongoDB Security
- ✅ Authenticated connections
- ✅ Network access restrictions
- ✅ User permissions
- ✅ Encryption at rest

### Application Security
- ✅ Input validation
- ✅ XSS protection
- ✅ CSRF protection
- ✅ HTTPS in production

---

## 📊 Performance

### Optimization Strategies
- Connection pooling (MongoDB)
- Geospatial indexes
- Pagination for large datasets
- Lazy loading components
- Code splitting
- Image optimization

### Monitoring
- Firebase Performance Monitoring
- MongoDB Atlas Performance Advisor
- Browser DevTools profiling
- Network request monitoring

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Admin login
- [ ] Driver login
- [ ] Parent login
- [ ] Student login
- [ ] Logout
- [ ] Session persistence

**Vehicle Management:**
- [ ] Create vehicle
- [ ] Edit vehicle
- [ ] Delete vehicle
- [ ] Assign to driver
- [ ] View vehicle list

**Driver Management:**
- [ ] Create driver
- [ ] View credentials
- [ ] Assign vehicle
- [ ] Edit driver info
- [ ] Delete driver

**Student/Parent Management:**
- [ ] Create student with parent
- [ ] View both credentials
- [ ] Edit student info
- [ ] Edit parent info
- [ ] Delete student
- [ ] Parent deletion protection

**GPS Tracking:**
- [ ] Start tracking
- [ ] Location updates
- [ ] Speed calculation
- [ ] Stop tracking
- [ ] View GPS logs

**Live Map:**
- [ ] Map loads
- [ ] Vehicle markers appear
- [ ] Real-time updates
- [ ] Route visualization
- [ ] Geofence display

---

## 🐛 Troubleshooting

### Common Issues

**1. npm install fails**
- Solution: Clear cache: `npm cache clean --force`
- Solution: Delete node_modules and reinstall

**2. Firebase connection error**
- Check API key in `.env`
- Verify project settings in Firebase Console
- Check browser console for errors

**3. MongoDB connection timeout**
- Verify network access settings
- Check IP whitelist
- Verify connection string

**4. Map not loading**
- Check Mapbox token
- Verify `mapbox-gl.css` is imported
- Ensure map container has height

**5. Vehicle creation fails**
- Apply RLS policy fix (see `QUICK_FIX_SUMMARY.md`)
- Check Supabase connection
- Verify table permissions

---

## 📞 Support

### Getting Help

1. **Check Documentation:**
   - Read relevant guide for your issue
   - Check troubleshooting sections

2. **Check Logs:**
   - Browser console (F12)
   - Firebase Console logs
   - MongoDB Atlas logs

3. **Verify Configuration:**
   - Environment variables
   - API keys and tokens
   - Network access settings

4. **Test Connections:**
   - Firebase authentication
   - MongoDB connection
   - Mapbox API

---

## ✅ Setup Checklist

### Installation
- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured

### Firebase Setup
- [ ] Project created
- [ ] Email/Password auth enabled
- [ ] Firestore database created
- [ ] Realtime database created
- [ ] Security rules configured

### MongoDB Setup
- [ ] Cluster created
- [ ] Database created
- [ ] Collections created
- [ ] Indexes created
- [ ] Network access configured

### Mapbox Setup
- [ ] Account created
- [ ] API token obtained
- [ ] Token added to `.env`

### Initial Data
- [ ] Admin account created in Firebase
- [ ] Admin custom claim added
- [ ] Admin document in MongoDB

### Testing
- [ ] Application runs (`npm run dev`)
- [ ] Admin can login
- [ ] Can create vehicles
- [ ] Can create drivers
- [ ] Can create students
- [ ] GPS tracking works
- [ ] Map displays correctly

---

## 🎯 Next Steps

After completing setup:

1. **Test Core Features:**
   - Login/logout
   - CRUD operations
   - GPS tracking
   - Real-time updates

2. **Customize:**
   - Update branding
   - Adjust colors
   - Modify layouts
   - Add custom features

3. **Deploy:**
   - Build for production
   - Configure hosting
   - Set up CI/CD
   - Monitor performance

4. **Maintain:**
   - Regular backups
   - Security updates
   - Performance monitoring
   - User feedback

---

## 📚 Additional Resources

### Official Documentation
- [Firebase Docs](https://firebase.google.com/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mapbox Docs](https://docs.mapbox.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Tutorials
- Firebase Authentication
- MongoDB Geospatial Queries
- Mapbox GL JS Examples
- React Best Practices

---

## 🎉 Success!

If you've completed all steps, you should now have:

- ✅ Fully configured development environment
- ✅ Firebase authentication working
- ✅ MongoDB database connected
- ✅ Mapbox maps displaying
- ✅ Admin account created
- ✅ Application running locally

**Congratulations! You're ready to start developing! 🚀**

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-30  
**Status:** Complete Setup Guide ✅  
**Estimated Setup Time:** 30-45 minutes

---

## 📝 Quick Reference

### Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

### URLs
- Development: `http://localhost:5173`
- Admin Login: `/adminherelogin`
- User Login: `/login`
- Admin Dashboard: `/admin/dashboard`
- Live Tracking: `/tracking/live`

### Default Credentials
- Username: `chandrasekharadmin`
- Password: `chandrasekharadmin1023@@`

---

**Happy Coding! 🎉**
