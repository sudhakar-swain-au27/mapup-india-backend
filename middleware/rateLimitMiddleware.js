import rateLimit from 'express-rate-limit';
/**
 * @constant limiter - Middleware to limit the number of requests from a single IP
 * @property {number} windowMs - Time frame for rate limiting (in milliseconds)
 * @property {number} max - Maximum number of requests allowed per windowMs
 * @property {Object} message - Response message for exceeded request limit
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});
