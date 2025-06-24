import mongoose from "mongoose";

declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

global.mongooseConnection = global.mongooseConnection || {
  conn: null,
  promise: null,
};

async function dbConnect() {
  if (global.mongooseConnection.conn) {
    return global.mongooseConnection.conn;
  }

  if (!global.mongooseConnection.promise) {
    global.mongooseConnection.promise = mongoose.connect(process.env.MONGODB_URI!);
  }

  global.mongooseConnection.conn = await global.mongooseConnection.promise;
  return global.mongooseConnection.conn;
}

export default dbConnect;
