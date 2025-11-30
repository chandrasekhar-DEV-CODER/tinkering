# 🚀 My School Ride - Firebase + MongoDB Integration

## Quick Start

### 1. Install Dependencies (5 minutes)

**Option A: Run the installation script**
```bash
./install-firebase-mongodb.sh
```

**Option B: Manual installation**
```bash
npm install firebase mongodb
```

### 2. Configure Firebase (15 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **bus-arriving**
3. Enable **Email/Password** authentication
4. Create **Firestore Database**
5. Create **Realtime Database**
6. Set security rules (see `FIREBASE_MONGODB_INTEGRATION.md`)

### 3. Configure MongoDB (10 minutes)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select cluster: **Cluster0**
3. Create database: **school_bus_tracking**
4. Create collections (see list below)
5. Create indexes (see `FIREBASE_MONGODB_INTEGRATION.md`)
6. Configure network access (allow your IP)

### 4. Create Admin Account (5 minutes)

1. Firebase Console → Authentication → Add user
   - Email: `chandrasekharadmin@schooltransport.com`
   - Password: `chandrasekharadmin1023@@`
2. Add custom claim: `{ role: 'admin' }`
3. Add admin document to MongoDB `admins` collection

### 5. Test the Application

```bash
npm run dev
```

Visit: `http://localhost:5173/adminherelogin`

---

## 📁 Files Created

### Configuration Files
- ✅ `src/config/firebase.ts` - Firebase initialization
- ✅ `src/config/mongodb.ts` - MongoDB connection
- ✅ `.env` - Environment variables (updated)

### Documentation Files
- ✅ `FIREBASE_MONGODB_INTEGRATION.md` - Complete integration guide
- ✅ `INSTALLATION_STEPS.md` - Detailed installation steps
- ✅ `MIGRATION_PLAN.md` - Migration strategy
- ✅ `README_FIREBASE_MONGODB.md` - This file

### Scripts
- ✅ `install-firebase-mongodb.sh` - Automated installation script

---

## 🗄️ MongoDB Collections

Create these collections in MongoDB Atlas:

1. **admins** - Administrator accounts
2. **drivers** - Driver accounts with GPS tracking
3. **parents** - Parent accounts
4. **students** - Student profiles
5. **vehicles** - School bus fleet
6. **routes** - Bus routes
7. **stops** - Bus stops
8. **gps_logs** - GPS tracking history
9. **trips** - Trip sessions

---

## 🔑 Environment Variables

Already configured in `.env`:

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
```

---

## 📚 Documentation

### For Setup
1. **INSTALLATION_STEPS.md** - Step-by-step installation guide
2. **FIREBASE_MONGODB_INTEGRATION.md** - Complete integration documentation

### For Development
3. **MIGRATION_PLAN.md** - Strategy for migrating from Supabase
4. **DEBUGGING_GUIDE.md** - Troubleshooting tips

### For Reference
5. **ADMIN_SYSTEM_SPECIFICATION.md** - Admin system documentation
6. **COMPLETE_SYSTEM_SUMMARY.md** - Full system overview

---

## ⚡ Quick Commands

```bash
# Install dependencies
npm install firebase mongodb

# Or use the script
./install-firebase-mongodb.sh

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

---

## 🎯 Current Status

### ✅ Completed
- [x] Firebase configuration file created
- [x] MongoDB configuration file created
- [x] Environment variables updated
- [x] Documentation created
- [x] Installation script created

### ⏳ Pending (Your Action Required)
- [ ] Install Firebase SDK: `npm install firebase`
- [ ] Install MongoDB driver: `npm install mongodb`
- [ ] Enable Firebase Authentication
- [ ] Create Firestore database
- [ ] Create MongoDB collections
- [ ] Create indexes in MongoDB
- [ ] Create initial admin account
- [ ] Test authentication flow

### 🔄 Future (Optional)
- [ ] Migrate authentication from Supabase to Firebase
- [ ] Migrate database operations from Supabase to MongoDB
- [ ] Migrate realtime features to Firebase Realtime DB
- [ ] Remove Supabase dependencies

---

## 🆘 Need Help?

### Common Issues

**Q: npm install is taking too long**
- A: This is normal for Firebase SDK (large package). Wait 5-10 minutes.

**Q: Firebase authentication not working**
- A: Make sure you enabled Email/Password in Firebase Console

**Q: MongoDB connection failed**
- A: Check network access settings in MongoDB Atlas
- A: Verify your IP is whitelisted

**Q: Can't create admin account**
- A: Create user in Firebase Console first, then add to MongoDB

### Get Support

1. Check `DEBUGGING_GUIDE.md` for troubleshooting
2. Check `FIREBASE_MONGODB_INTEGRATION.md` for detailed docs
3. Check browser console for error messages
4. Check Firebase Console logs
5. Check MongoDB Atlas logs

---

## 🎉 Success Indicators

After setup, you should be able to:
- ✅ Login with admin credentials
- ✅ See admin dashboard
- ✅ Create vehicles, drivers, students
- ✅ View GPS tracking on map
- ✅ See realtime updates

---

## 📞 Contact

For questions or issues:
- Check documentation files
- Review Firebase Console logs
- Review MongoDB Atlas logs
- Check browser console

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-30  
**Status:** Ready for Installation ✅

---

## 🚦 Next Steps

1. **Run:** `npm install firebase mongodb`
2. **Read:** `FIREBASE_MONGODB_INTEGRATION.md`
3. **Setup:** Firebase Authentication
4. **Setup:** MongoDB Collections
5. **Create:** Admin account
6. **Test:** Login and features

**Estimated Total Time:** 30-45 minutes

Good luck! 🎉
