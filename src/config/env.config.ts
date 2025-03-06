import { join } from "path";

import { config as envConfig } from "dotenv";
import { ZodError } from "zod";

import { envSchema } from "@/validations";

const envFilePath = join(__dirname, "./../../.env");
envConfig({ path: envFilePath });

let Vars = null;
try {
  Vars = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    const errorMessage = error.errors.map((err) => err.message).join(", ");
    throw new Error(`env error: ${errorMessage}`);
  }
  throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
}

const AppConfig = {
  NODE_ENV: Vars.NODE_ENV || "development",
  PORT: Vars.PORT || 8080,
  MONGO_URI: Vars.MONGO_URI,
  AUTH: {
    ACCESS_TOKEN_SECRET: Vars.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: Vars.REFRESH_TOKEN_SECRET,
    HASH_SECRET: Vars.HASH_SECRET,
    OTP_SECRET: Vars.OTP_SECRET,
    MAX_AGE: {
      ACCESS_TOKEN: 60 * 60 * 1000,
      REFRESH_TOKEN: 30 * 24 * 60 * 60 * 1000
    }
  }
};

export { AppConfig };
