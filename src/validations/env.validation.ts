import z from "zod";

const schemaObject = {
  PORT: z.string().optional(),
  NODE_ENV: z.string().optional(),
  MONGO_URI: z.string({ required_error: "MONGO_URI is required!" }),
  ACCESS_TOKEN_SECRET: z.string({ required_error: "ACCESS_TOKEN_SECRET is required!" }),
  REFRESH_TOKEN_SECRET: z.string({ required_error: "REFRESH_TOKEN_SECRET is required!" }),
  HASH_SECRET: z.string({ required_error: "HASH_SECRET is required!" }),
  OTP_SECRET: z.string({ required_error: "OTP_SECRET is required!" })
};

export const envSchema = z.object(schemaObject);
