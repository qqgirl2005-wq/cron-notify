import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// dev 模式熱更新會重新載入模組，把連線存在 global 上避免重複建立連線
const globalForMongoose = globalThis as unknown as {
  mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};
globalForMongoose.mongooseCache = cache;

export async function connectToDatabase() {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI 環境變數未設定");
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
