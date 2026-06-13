import mongoose from 'mongoose';

// ─── Connection cache for serverless environments (Vercel) ───────────────────
// Vercel spins up a new function instance per request. Without caching,
// every request creates a NEW MongoDB connection → "Too many connections" error.
// This module-level cache persists across invocations within the same warm instance.
let cachedConn = null;
let cachedPromise = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  // ─── Strict guard: fail fast if MONGO_URI is missing ───
  if (!mongoUri || mongoUri.trim() === '') {
    console.error('\n❌ FATAL: MONGO_URI is not defined in environment variables.');
    console.error('   → For local dev: create .env.local with MONGO_URI=mongodb+srv://...');
    console.error('   → For Vercel:    add MONGO_URI in Project Settings → Environment Variables\n');
    throw new Error('MONGO_URI is not defined');
  }

  // ─── Return cached connection if already connected ───
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  // ─── Return pending promise if connection is in progress ───
  if (cachedPromise) {
    return cachedPromise;
  }

  // Mask password in logs for security
  const maskedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log('\n🔍 MongoDB Connection Attempt:');
  console.log(`   URI: ${maskedUri}`);

  cachedPromise = mongoose.connect(mongoUri, {
    // Connection pool — max 10 concurrent connections
    maxPoolSize: 10,
    minPoolSize: 2,
    // Serverless-friendly: don't buffer commands if not connected
    bufferCommands: false,
    // Timeouts
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  }).then((conn) => {
    console.log(`\n✅ MongoDB Connected!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Pool size: ${conn.connection.options?.maxPoolSize || 10}`);
    cachedConn = conn;
    cachedPromise = null;
    return conn;
  }).catch((error) => {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}\n`);
    cachedPromise = null;
    throw error;
  });

  return cachedPromise;
};

export default connectDB;
