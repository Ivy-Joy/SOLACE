//services/api/src/middleware/requireAdmin.ts
//import { Request, Response, NextFunction } from "express";
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import Admin, { type AdminRole } from "../models/Admin";

type AdminTokenPayload = JwtPayload & {
  adminId: string;
  email?: string;
  role?: AdminRole;
};

function isAdminTokenPayload(payload: string | JwtPayload): payload is AdminTokenPayload {
  if (typeof payload === "string") return false;
  return typeof payload.adminId === "string";
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing auth" });
    }

    const token = auth.slice("Bearer ".length).trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET is missing" });
    }

    const decoded = jwt.verify(token, secret);
    if (!isAdminTokenPayload(decoded)) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}