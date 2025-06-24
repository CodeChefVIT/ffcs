import mongoose from "mongoose";

declare global {
  let mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose.mongooseConnection) {
  globalWithMongoose.mongooseConnection = { conn: null, promise: null };
}

async function dbConnect() {
  if (globalWithMongoose.mongooseConnection.conn) {
    return globalWithMongoose.mongooseConnection.conn;
  }

  if (!globalWithMongoose.mongooseConnection.promise) {
    globalWithMongoose.mongooseConnection.promise = mongoose.connect(process.env.MONGODB_URI!);
  }

  globalWithMongoose.mongooseConnection.conn = await globalWithMongoose.mongooseConnection.promise;
  return globalWithMongoose.mongooseConnection.conn;
}

export default dbConnect;
