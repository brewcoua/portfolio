import mongoose from "mongoose";
import { env } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const globalCache = globalThis.mongooseConnection ?? {
  conn: null as typeof mongoose | null,
  promise: null as Promise<typeof mongoose> | null,
};

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    const uri = `mongodb+srv://${encodeURIComponent(env.MONGO_USER)}:${encodeURIComponent(
      env.MONGO_PASSWORD,
    )}@${env.MONGO_CLUSTER}/${env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

    mongoose.set("strictQuery", true);
    globalCache.promise = mongoose.connect(uri, {
      dbName: env.MONGO_DB_NAME,
    });
  }

  globalCache.conn = await globalCache.promise;

  globalThis.mongooseConnection = globalCache;

  return globalCache.conn;
}

