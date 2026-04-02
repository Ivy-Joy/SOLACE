import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type MemberJwtPayload = jwt.JwtPayload & {
  sub?: string;
  memberId?: string;
  phone?: string;
  fullName?: string;
};

declare global {
  namespace Express {
    interface Request {
      memberAuth?: {
        memberId: string;
        phone?: string;
        fullName?: string;
      };
    }
  }
}

export function requireMemberJwt(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.get("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : req.get("x-member-token");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const secret = process.env.MEMBER_JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Missing MEMBER_JWT_SECRET" });
    }

    const decoded = jwt.verify(token, secret) as MemberJwtPayload;
    const memberId = decoded.memberId ?? decoded.sub;

    if (!memberId) {
      return res.status(401).json({ message: "Invalid token" });
    }

     const memberAuth: NonNullable<Request["memberAuth"]> = { memberId };

    if (typeof decoded.phone === "string") {
      memberAuth.phone = decoded.phone;
    }

    if (typeof decoded.fullName === "string") {
      memberAuth.fullName = decoded.fullName;
    }

    req.memberAuth = memberAuth;

    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}