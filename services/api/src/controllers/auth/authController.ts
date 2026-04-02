// services/api/src/controllers/auth/authController.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import Admin, { type AdminRole } from "../../models/Admin";

type BootstrapBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: AdminRole;
  permissions?: string[];
  bootstrapToken?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing");
  return secret;
}

function signAdminToken(admin: {
  _id: { toString(): string };
  email: string;
  role: AdminRole;
}) {
  return jwt.sign(
    { adminId: admin._id.toString(), email: admin.email, role: admin.role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "14d" }
  );
}

export async function bootstrapAdmin(req: Request, res: Response) {
  try {
    const body = req.body as BootstrapBody;

    const bootstrapToken = body.bootstrapToken;
    const expectedToken = process.env.ADMIN_TOKEN;

    if (!expectedToken) {
      return res.status(500).json({ message: "ADMIN_TOKEN is missing" });
    }

    if (!bootstrapToken || bootstrapToken !== expectedToken) {
      return res.status(401).json({ message: "Invalid bootstrap token" });
    }

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const role = body.role ?? "admin";
    const permissions = Array.isArray(body.permissions) ? body.permissions : [];

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await Admin.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      name,
      email,
      passwordHash,
      role,
      permissions,
    });

    return res.status(201).json({
      ok: true,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("bootstrapAdmin error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function loginAdmin(req: Request, res: Response) {
  try {
    const body = req.body as LoginBody;
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const admin = await Admin.findOne({ email }).select("+passwordHash");
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signAdminToken(admin);

    return res.json({
      token,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("loginAdmin error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function me(req: Request, res: Response) {
  if (!req.admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.json({
    admin: {
      id: req.admin._id.toString(),
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      permissions: req.admin.permissions,
    },
  });
}