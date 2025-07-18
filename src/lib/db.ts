import { MongoClient, ServerApiVersion, Collection } from "mongodb";

// Connection URI placeholder - should be replaced with environment variable in production
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect();
}

export default clientPromise;

/**
 * Helper function to get a database instance
 */
export async function getDatabase(dbName: string = "ml_portfolio") {
  const client = await clientPromise;
  return client.db(dbName);
}

/**
 * Helper function to get a collection instance
 */
export async function getCollection(collectionName: string, dbName: string = "ml_portfolio") {
  const db = await getDatabase(dbName);
  return db.collection(collectionName);
}

/**
 * Collections cache to avoid repeated lookups
 */
const collectionsCache: Record<string, Collection> = {};

/**
 * Get a collection with caching for better performance
 */
export async function getCachedCollection(collectionName: string, dbName: string = "ml_portfolio") {
  const cacheKey = `${dbName}:${collectionName}`;
  
  if (!collectionsCache[cacheKey]) {
    collectionsCache[cacheKey] = await getCollection(collectionName, dbName);
  }
  
  return collectionsCache[cacheKey];
}

/**
 * Check if the database connection is working
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection successful");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
}