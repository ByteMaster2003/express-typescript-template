import mongoose, { connect, Mongoose, ConnectOptions } from "mongoose";

import { Logger } from "../config";

let connection: Mongoose | null = null;
const options: ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  retryReads: true,
  bufferCommands: false,
  connectTimeoutMS: 10000
};

const ConnectDB = async (MONGO_URI: string) => {
  if (connection == null) {
    connection = await connect(MONGO_URI, options).catch((err) => {
      if (err.code === "ETIMEDOUT") {
        Logger.error("Connection timed out! %s", err.message);
      } else {
        Logger.error("Connection error: %s", err.message);
      }
      return null;
    });
    Logger.info("Database connection established.");
  }

  return connection;
};

if (mongoose.connection) {
  mongoose.connection.on("error", (err) => {
    Logger.error("Connection error: %s", err.message);
    process.exit(1);
  });
}

export { ConnectDB };
