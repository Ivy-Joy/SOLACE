// apps/app-frontend/src/lib/auth.ts
export function isAdminLoggedIn(){
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("admin_token");
}
export function logoutAdmin(){
  localStorage.removeItem("admin_token");
  location.href = "/admin/login";
}

// lib/auth.ts
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET required');

export function signAdminToken(admin) {
  return jwt.sign({ sub: admin._id, role: admin.role, perms: admin.permissions }, JWT_SECRET, { expiresIn: '8h' });
}

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse, requiredRole?: string, requiredPerm?: string) {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload: any = jwt.verify(auth, JWT_SECRET);
    const admin = await Admin.findById(payload.sub);
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });
    if (requiredRole && admin.role !== requiredRole) return res.status(403).json({ error: 'Forbidden' });
    if (requiredPerm && !(admin.permissions || []).includes(requiredPerm)) return res.status(403).json({ error: 'Forbidden' });
    // attach
    (req as any).admin = admin;
    return null;
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}