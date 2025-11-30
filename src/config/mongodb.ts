import { MongoClient, Db, Collection } from 'mongodb';

// MongoDB configuration
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://bannu102305_db_user:jB9c7Db3iQj7FNLT@cluster0.dldxlpr.mongodb.net/?appName=Cluster0';
const DB_NAME = import.meta.env.VITE_MONGODB_DB_NAME || 'school_bus_tracking';

// MongoDB client instance
let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Connect to MongoDB
 */
export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    db = client.db(DB_NAME);

    console.log('✅ Connected to MongoDB Atlas');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Get MongoDB database instance
 */
export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongoDB() first.');
  }
  return db;
}

/**
 * Get a collection from the database
 */
export function getCollection<T = any>(collectionName: string): Collection<T> {
  const database = getDatabase();
  return database.collection<T>(collectionName);
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

// Collection names
export const Collections = {
  ADMINS: 'admins',
  DRIVERS: 'drivers',
  PARENTS: 'parents',
  STUDENTS: 'students',
  VEHICLES: 'vehicles',
  ROUTES: 'routes',
  STOPS: 'stops',
  GPS_LOGS: 'gps_logs',
  TRIPS: 'trips',
} as const;

// Initialize connection on module load (for server-side)
if (typeof window === 'undefined') {
  connectToMongoDB().catch(console.error);
}

export default {
  connectToMongoDB,
  getDatabase,
  getCollection,
  closeMongoDB,
  Collections,
};
