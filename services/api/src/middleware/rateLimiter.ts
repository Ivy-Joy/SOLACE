import rateLimit from "express-rate-limit"

export const prayerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many prayer submissions. Please try later."
})