import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

type RateLimiterTypes = {
  windowMs?: number;
  max?: number;
};

/**
 * Creates a rate limiter middleware for Express.
 *
 * @param {Object} options - Configuration options for the rate limiter.
 * @param {number} [options.windowMs=900000] - Time window in milliseconds for rate limiting (default: 15 minutes).
 * @param {number} [options.max=1000] - Maximum number of requests allowed within the time window (default: 100).
 * @returns {RateLimitRequestHandler} RateLimitRequestHandler - The rate limiter middleware.
 */
export const rateLimiter = ({
  windowMs = 60 * 60 * 1000,
  max = 100
}: RateLimiterTypes): RateLimitRequestHandler =>
  rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests: false
  });
