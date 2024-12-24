import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from '../db/redisClient';

export const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 100, // Number of requests
  duration: 60 * 15, // Per 15 minutes
});

export const redisRateLimiterMiddleware = (req: any, res: any, next: any) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({
        error: 'Too many requests, please try again later.',
      });
    });
};
