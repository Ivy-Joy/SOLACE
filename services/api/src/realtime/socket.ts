//server socket support for chat
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Member from "../models/Member";
import { canAccessCommunity } from "../utils/memberAccess";

export function attachSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.toString().replace(/^Bearer\s+/i, "");

      if (!token) return next(new Error("Unauthorized"));

      const secret = process.env.MEMBER_JWT_SECRET;
      if (!secret) return next(new Error("Server misconfigured"));

      const decoded = jwt.verify(token, secret) as { memberId?: string; sub?: string };
      const memberId = decoded.memberId ?? decoded.sub;
      if (!memberId) return next(new Error("Unauthorized"));

      const member = await Member.findById(memberId).lean();
      if (!member) return next(new Error("Unauthorized"));

      socket.data.member = member;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const member = socket.data.member;
    const adultAccess = canAccessCommunity(member);

    socket.on("join-class", ({ classKey }) => {
      if (!adultAccess) return;
      if (member.preferredClass !== classKey) return;
      socket.join(`class:${classKey}`);
    });

    socket.on("join-session", ({ sessionId, classKey }) => {
      if (!adultAccess) return;
      if (member.preferredClass !== classKey) return;
      socket.join(`session:${sessionId}`);
    });

    socket.on("disconnect", () => {});
  });

  return io;
}