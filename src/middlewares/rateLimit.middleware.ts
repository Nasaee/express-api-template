import rateLimit from 'express-rate-limit';

// Rate limit configuration
const rateLimitMiddleware = (maxRequest: number, inMinutes: number) => {
  return rateLimit({
    windowMs: inMinutes * 60 * 1000, // Convert minutes to milliseconds
    max: maxRequest, // Limit each IP to maxRequest requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
};

export { rateLimitMiddleware };
