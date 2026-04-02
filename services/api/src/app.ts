// services/api/src/app.ts
import express, { type Express, type Request, type Response } from "express";

import cors from "cors";
import type { CorsOptions } from "cors";

import morgan from "morgan";
import "express-async-errors";

// Route Imports
import authRouter from "./routes/auth/auth";
import membersRouter from "./routes/auth/members";
import verifyRouter from "./routes/auth/verify";
import consentRoutes from "./routes/auth/consent";
//import applicationsRouter from "./routes/leadApplications";
import publicLeadRoutes from "./routes/public/leads";
import adminLeadRoutes from "./routes/admin/leads";
import adminRouter from "./routes/admin";
import buddyRouter from "./routes/buddy";
import metricsRouter from "./routes/metrics";
import prayerRouter from "./routes/prayerRequests";

import { createPaymentIntent } from "./controllers/public/donationController";

// Middleware Imports
import { errorHandler } from "./middleware/errorHandler";

const app: Express = express();

/*const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return cb(null, true);

    const allowed = ["http://127.0.0.1:3000"];
    return cb(null, allowed.includes(origin));
  },
  credentials: true,
};*/

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
// --- Standard Middleware ---
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// --- Routes ---
app.use("/api/auth", authRouter);
app.use("/api/members", membersRouter);
app.use("/api/verify", verifyRouter);
app.use("/api/consent", consentRoutes);
//app.use("/api/lead-applications", applicationsRouter);
// Public routes (No protection)
app.use("/api/public/leads", publicLeadRoutes);
app.post("/api/public/donate/create-intent", createPaymentIntent); 

app.use("/api/admin", adminRouter);
app.use("/api/buddy", buddyRouter);
app.use("/api/prayer-requests", prayerRouter);
app.use("/api/admin/metrics", metricsRouter);

// --- Health Check ---
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Error Handling ---
// Note: Must be placed AFTER all routes
app.use(errorHandler);

export default app;