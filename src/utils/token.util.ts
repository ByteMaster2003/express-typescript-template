import httpStatus from "http-status";
import { sign as SignToken, verify as VerifyToken, SignOptions } from "jsonwebtoken";

import { AppConfig } from "@/config";
import { cacheService } from "@/services";
import { CustomJwtpayload } from "@/types";
import { generateMD5Hash, ApiError } from "@/utils";

/**
 * Signs an access token for a given user.
 *
 * @param {string} userId - The user's unique identifier (email).
 * @param {Object} [payload={}] - Additional claims to include in the token.
 * @returns {string} A signed access token.
 *
 * @throws {Error} If an error occurs while signing the token.
 *
 * @description
 * This function generates a signed access token using a secret key from `AppConfig.AUTH.ACCESS_TOKEN_SECRET`.
 * The token is issued with:
 * - `expiresIn`: 1 hour
 * - `issuer`: "auth service"
 * - `audience`: userId (email)
 *
 * Once generated, the token is cached using `authenticationCache.putSync` with a hashed key.
 * If an error occurs, it is logged and an `ApiError` with HTTP 500 status is thrown.
 */
const signAccessToken = (userId: string, payload: object = {}): string => {
  const secret = AppConfig.AUTH.ACCESS_TOKEN_SECRET;
  const options: SignOptions = {
    expiresIn: "1h",
    issuer: "auth service",
    audience: userId
  };

  const token = SignToken(payload, secret, options);
  const cacheKey = generateMD5Hash(`${userId}_access_token`);
  cacheService.auth.putSync(cacheKey, token);

  return token;
};

/**
 * Signs a refresh token for a given user.
 *
 * @param {string} userId - The user's unique identifier (email).
 * @param {Object} [payload={}] - Additional claims to include in the token.
 * @returns {string} A signed refresh token.
 *
 * @throws {ApiError} If an error occurs while signing the token.
 *
 * @description
 * This function generates a signed refresh token using a secret key from `AppConfig.AUTH.REFRESH_TOKEN_SECRET`.
 * The token is issued with:
 * - `expiresIn`: 30 days
 * - `issuer`: "auth service"
 * - `audience`: userId (email)
 *
 * Once generated, the token is cached using `authenticationCache.putSync` with a hashed key.
 * If an error occurs, it is logged and an `ApiError` with HTTP 500 status is thrown.
 */
const signRefreshToken = (userId: string, payload: object = {}): string => {
  const secret = AppConfig.AUTH.REFRESH_TOKEN_SECRET;
  const options: SignOptions = {
    expiresIn: "30d",
    issuer: "auth service",
    audience: userId
  };

  const token = SignToken(payload, secret, options);
  const cacheKey = generateMD5Hash(`${userId}_refresh_token`);
  cacheService.auth.putSync(cacheKey, token);

  return token;
};

/**
 * Verifies an access token and checks its validity against the cache.
 *
 * @param {string} accessToken - The access token to verify.
 * @returns {CustomJwtpayload} A decoded token payload if verification is successful.
 *
 * @throws {ApiError} If the token is expired, invalid, or verification fails.
 *
 * @description
 * This function verifies the given access token using the secret key from `AppConfig.AUTH.ACCESS_TOKEN_SECRET`.
 * If the token is expired, an `ApiError` with HTTP 401 (Unauthorized) and message `"Expired signature"` is thrown.
 * If verification fails for other reasons, an `ApiError` with HTTP 500 (Internal Server Error) is thrown.
 *
 * Once verified, the function retrieves the email from the token payload and checks if the token matches the cached one.
 * If the token does not match the cached token, an `ApiError` with HTTP 401 (Unauthorized) is thrown.
 */
const verifyAccessToken = (accessToken: string): CustomJwtpayload => {
  const payload: CustomJwtpayload = VerifyToken(
    accessToken,
    AppConfig.AUTH.ACCESS_TOKEN_SECRET
  ) as CustomJwtpayload;

  const { id } = payload as CustomJwtpayload;
  const cacheKey = generateMD5Hash(`${id}_access_token`);

  const cachedAccessToken = cacheService.auth.getSync(cacheKey);
  if (accessToken !== cachedAccessToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid access token!");
  }

  return payload;
};

/**
 * Verifies a refresh token and checks its validity against the cache.
 *
 * @param {string} refreshToken - The refresh token to verify.
 * @returns {CustomJwtpayload} A decoded token payload if verification is successful.
 *
 * @throws {ApiError} If the token is invalid, expired, or does not match the cached token.
 *
 * @description
 * This function verifies the provided refresh token using the secret key from `AppConfig.AUTH.REFRESH_TOKEN_SECRET`.
 * If verification fails, an `ApiError` with HTTP 500 (Internal Server Error) is thrown.
 *
 * Once verified, the function retrieves the `email` from the token payload and checks if the token matches the cached one.
 * If the token does not match the cached token, an `ApiError` with HTTP 401 (Unauthorized) is thrown.
 */
const verifyRefreshToken = (refreshToken: string): CustomJwtpayload => {
  const payload: CustomJwtpayload = VerifyToken(
    refreshToken,
    AppConfig.AUTH.REFRESH_TOKEN_SECRET
  ) as CustomJwtpayload;

  const { id } = payload;
  const cacheKey = generateMD5Hash(`${id}_refresh_token`);

  const cachedRefreshToken = cacheService.auth.getSync(cacheKey);
  if (refreshToken !== cachedRefreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token!");
  }

  return payload;
};

export default {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
