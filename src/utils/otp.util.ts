import crypto from "node:crypto";

import bcrypt from "bcryptjs";

import { AppConfig } from "@/config";
import { cacheService } from "@/services";
import { generateMD5Hash } from "@/utils";

const generate = async (userId: string) => {
  if (!AppConfig.AUTH.OTP_SECRET) {
    throw new Error("OTP_SECRET not found!");
  }

  const secret = AppConfig.AUTH.OTP_SECRET;

  const randomBytes = crypto.randomBytes(3);
  const timestamp = Date.now();
  const bufferData = Buffer.concat([
    randomBytes,
    Buffer.from(userId.toString()),
    Buffer.from(timestamp.toString())
  ]);

  const hash = crypto.createHash("sha256");
  const combinedHash = hash.update(bufferData);
  const updatedHash = combinedHash.update(secret);
  const finalHash = updatedHash.digest("hex");

  const OTP = parseInt(finalHash, 16) % 1000000;
  const OTPString = OTP.toString().padEnd(6, "0");
  const hashedOTP = bcrypt.hashSync(OTPString, 10);
  cacheService.otp.putSync(generateMD5Hash(`${userId}_otp`), hashedOTP);

  return OTPString;
};

const compare = async (otp: number, userId: string) => {
  const cachedOtp = cacheService.otp.getSync(generateMD5Hash(`${userId}_otp`));
  if (!cachedOtp) {
    return false;
  }
  return bcrypt.compareSync(otp.toString(), cachedOtp);
};

export default { generate, compare };
