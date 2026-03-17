import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma';

let cachedRateLimit: number | null = null;
let lastFetched: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getDynamicRateLimit = async () => {
  const now = Date.now();
  if (cachedRateLimit !== null && now - lastFetched < CACHE_TTL) {
    return cachedRateLimit;
  }

  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'api_rate_limit' },
    });

    if (setting?.value) {
      cachedRateLimit = parseInt(setting.value, 10) || 1000;
    } else {
      cachedRateLimit = 1000; // Default
    }
    lastFetched = now;
    return cachedRateLimit;
  } catch (error) {
    console.error('Failed to fetch api_rate_limit from DB:', error);
    return cachedRateLimit || 1000;
  }
};

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: async () => {
    return await getDynamicRateLimit();
  },
  message: {
    success: false,
    message: 'Too many requests, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Key by IP or User ID if available
  keyGenerator: (req) => {
    return (req.user as any)?.id || req.ip;
  },
});
