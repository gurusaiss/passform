interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipMap.entries()) {
    if (now > entry.resetTime) {
      ipMap.delete(ip);
    }
  }
}, 60000);

if (typeof cleanupInterval.unref === "function") {
  cleanupInterval.unref();
}

export function checkRateLimit(
  ip: string,
  limit = 10,
  windowMs = 60000
): { isAllowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetTime) {
    ipMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      isAllowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (entry.count >= limit) {
    return {
      isAllowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count += 1;
  return {
    isAllowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}
