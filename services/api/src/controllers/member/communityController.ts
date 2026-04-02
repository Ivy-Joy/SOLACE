//services/api/controllers/member/communityController.ts
import type { Request, Response } from "express";
import Member from "../../models/Member";
import LiveSession from "../../models/LiveSession";
import ClassPost from "../../models/ClassPost";
import ClassChatMessage from "../../models/ClassChatMessage";
import { canAccessCommunity, isAdult } from "../../utils/memberAccess";

function iso(value?: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function serializeMember(member: any) {
  return {
    id: member._id.toString(),
    fullName: member.fullName,
    phone: member.phone,
    dob: iso(member.dob ?? null),
    status: member.status ?? "pending",
    profileStatus: member.profileStatus ?? "locked",
    visibilityScope: member.visibilityScope ?? "private",
    preferredClass: member.preferredClass ?? null,
    roles: member.roles ?? [],
    points: member.points ?? 0,
    tags: member.tags ?? [],
    age: member.dob ? Math.floor((Date.now() - new Date(member.dob).getTime()) / 31557600000) : null,
    isAdult: isAdult(member),
  };
}

export async function getDashboard(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) return res.status(401).json({ message: "Unauthorized" });

    const member = await Member.findById(memberId).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });

    const serialized = serializeMember(member);
    const classKey = member.preferredClass ?? "unassigned";
    const adultAccess = canAccessCommunity(member);

    const liveSessions = adultAccess
      ? await LiveSession.find({
          classKey,
          status: { $in: ["scheduled", "live"] },
          startsAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24) },
        })
          .sort({ startsAt: 1 })
          .limit(6)
          .lean()
      : [];

    const posts = adultAccess
      ? await ClassPost.find({
          classKey,
          status: "published",
          audience: "class",
        })
          .sort({ pinned: -1, createdAt: -1 })
          .limit(6)
          .lean()
      : [];

    return res.json({
      profile: serialized,
      access: {
        canUseCommunity: adultAccess,
        canJoinLiveSessions: adultAccess,
        canPost: adultAccess,
        canChat: adultAccess,
      },
      cards: [
        {
          title: "Class",
          value: member.preferredClass?.toUpperCase() ?? "UNASSIGNED",
          hint: "Assigned by backend DOB rules",
        },
        {
          title: "Profile",
          value: member.profileStatus ?? "locked",
          hint: "Visibility is server controlled",
        },
        {
          title: "Visibility",
          value: member.visibilityScope ?? "private",
          hint: "Private by default",
        },
        {
          title: "Points",
          value: String(member.points ?? 0),
          hint: "Activity and participation",
        },
      ],
      liveSessions: liveSessions.map((s: any) => ({
        id: s._id.toString(),
        title: s.title,
        description: s.description ?? null,
        classKey: s.classKey,
        adultOnly: Boolean(s.adultOnly),
        status: s.status,
        startsAt: iso(s.startsAt ?? null),
        endsAt: iso(s.endsAt ?? null),
        meetingUrl: s.meetingUrl ?? null,
        roomCode: s.roomCode ?? null,
        coverImage: s.coverImage ?? null,
        allowChat: Boolean(s.allowChat),
      })),
      posts: posts.map((p: any) => ({
        id: p._id.toString(),
        title: p.title,
        body: p.body,
        pinned: Boolean(p.pinned),
        classKey: p.classKey,
        createdAt: iso(p.createdAt ?? null),
        authorMemberId: p.authorMemberId.toString(),
      })),
      nextAction:
        adultAccess ? "Explore your class space and live sessions." : "Profile is private until adult review completes.",
    });
  } catch (err) {
    console.error("getDashboard error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function listLiveSessions(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) return res.status(401).json({ message: "Unauthorized" });

    const member = await Member.findById(memberId).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (!canAccessCommunity(member)) {
      return res.status(403).json({ message: "Adult-only access required" });
    }

    const classKey = member.preferredClass ?? "unassigned";
    const sessions = await LiveSession.find({ classKey, status: { $in: ["scheduled", "live", "ended"] } })
      .sort({ startsAt: -1 })
      .limit(20)
      .lean();

    return res.json({
      items: sessions.map((s: any) => ({
        id: s._id.toString(),
        title: s.title,
        description: s.description ?? null,
        classKey: s.classKey,
        status: s.status,
        startsAt: iso(s.startsAt ?? null),
        endsAt: iso(s.endsAt ?? null),
        meetingUrl: s.meetingUrl ?? null,
        roomCode: s.roomCode ?? null,
        adultOnly: Boolean(s.adultOnly),
        allowChat: Boolean(s.allowChat),
        coverImage: s.coverImage ?? null,
      })),
    });
  } catch (err) {
    console.error("listLiveSessions error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getLiveSessionById(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) return res.status(401).json({ message: "Unauthorized" });

    const member = await Member.findById(memberId).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (!canAccessCommunity(member)) {
      return res.status(403).json({ message: "Adult-only access required" });
    }

    const session = await LiveSession.findById(req.params.id).lean();
    if (!session) return res.status(404).json({ message: "Live session not found" });

    if (session.classKey !== member.preferredClass) {
      return res.status(403).json({ message: "This session is not for your class" });
    }

    return res.json({
      id: session._id.toString(),
      title: session.title,
      description: session.description ?? null,
      classKey: session.classKey,
      status: session.status,
      startsAt: iso(session.startsAt ?? null),
      endsAt: iso(session.endsAt ?? null),
      meetingUrl: session.meetingUrl ?? null,
      roomCode: session.roomCode ?? null,
      adultOnly: Boolean(session.adultOnly),
      allowChat: Boolean(session.allowChat),
      coverImage: session.coverImage ?? null,
      maxParticipants: session.maxParticipants ?? null,
    });
  } catch (err) {
    console.error("getLiveSessionById error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function joinLiveSession(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) return res.status(401).json({ message: "Unauthorized" });

    const member = await Member.findById(memberId).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (!canAccessCommunity(member)) {
      return res.status(403).json({ message: "Adult-only access required" });
    }

    const session = await LiveSession.findById(req.params.id).lean();
    if (!session) return res.status(404).json({ message: "Live session not found" });

    if (session.classKey !== member.preferredClass) {
      return res.status(403).json({ message: "This session is not for your class" });
    }

    return res.json({
      ok: true,
      sessionId: session._id.toString(),
      roomCode: session.roomCode ?? null,
      meetingUrl: session.meetingUrl ?? null,
      mode: session.meetingUrl ? "external" : "internal",
    });
  } catch (err) {
    console.error("joinLiveSession error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function listClassPosts(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) return res.status(401).json({ message: "Unauthorized" });

    const member = await Member.findById(memberId).lean();
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (!canAccessCommunity(member)) {
      return res.status(403).json({ message: "Adult-only access required" });
    }

    const classKey = req.params.classKey as "vuka" | "ropes" | "teens" | "mph" | "young";
    if (classKey !== member.preferredClass) {
      return res.status(403).json({ message: "Class access denied" });
    }

    const posts = await ClassPost.find({ classKey, status: "published" })
      .sort({ pinned: -1, createdAt: -1 })
      .limit(30)
      .lean();

    return res.json({
      items: posts.map((p: any) => ({
        id: p._id.toString(),
        classKey: p.classKey,
        title: p.title,
        body: p.body,
        pinned: Boolean(p.pinned),
        createdAt: iso(p.createdAt ?? null),
        likesCount: p.likes?.length ?? 0,
        authorMemberId: p.authorMemberId.toString(),
      })),
    });
  } catch (err) {
    console.error("listClassPosts error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createClassPost(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) return res.status(401).json({ message: "Unauthorized" });

    const member = await Member.findById(memberId).lean();
    if (!member || !canAccessCommunity(member)) {
      return res.status(403).json({ message: "Adult-only access required" });
    }

    const classKey = req.params.classKey as "vuka" | "ropes" | "teens" | "mph" | "young";
    if (classKey !== member.preferredClass) {
      return res.status(403).json({ message: "Class access denied" });
    }

    const { title, body } = req.body as { title?: string; body?: string };
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const post = await ClassPost.create({
      classKey,
      authorMemberId: member._id,
      title: title.trim(),
      body: body.trim(),
      audience: "class",
      status: "published",
    });

    return res.status(201).json({
      ok: true,
      item: {
        id: post._id.toString(),
        classKey: post.classKey,
        title: post.title,
        body: post.body,
        pinned: Boolean(post.pinned),
        createdAt: iso(post.createdAt ?? null),
      },
    });
  } catch (err) {
    console.error("createClassPost error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function listClassChat(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) return res.status(401).json({ message: "Unauthorized" });

    const member = await Member.findById(memberId).lean();
    if (!member || !canAccessCommunity(member)) {
      return res.status(403).json({ message: "Adult-only access required" });
    }

    const classKey = req.params.classKey as "vuka" | "ropes" | "teens" | "mph" | "young";
    if (classKey !== member.preferredClass) {
      return res.status(403).json({ message: "Class access denied" });
    }

    const messages = await ClassChatMessage.find({ classKey, deleted: false })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({
      items: messages.reverse().map((m: any) => ({
        id: m._id.toString(),
        classKey: m.classKey,
        liveSessionId: m.liveSessionId ? m.liveSessionId.toString() : null,
        senderMemberId: m.senderMemberId.toString(),
        message: m.message,
        kind: m.kind ?? "text",
        createdAt: iso(m.createdAt ?? null),
      })),
    });
  } catch (err) {
    console.error("listClassChat error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function sendClassChat(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) return res.status(401).json({ message: "Unauthorized" });

    const member = await Member.findById(memberId).lean();
    if (!member || !canAccessCommunity(member)) {
      return res.status(403).json({ message: "Adult-only access required" });
    }

    const classKey = req.params.classKey as "vuka" | "ropes" | "teens" | "mph" | "young";
    if (classKey !== member.preferredClass) {
      return res.status(403).json({ message: "Class access denied" });
    }

    const { message, liveSessionId } = req.body as { message?: string; liveSessionId?: string };
    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const saved = await ClassChatMessage.create({
      classKey,
      liveSessionId: liveSessionId ?? null,
      senderMemberId: member._id,
      message: message.trim(),
      kind: "text",
    });

    return res.status(201).json({
      ok: true,
      item: {
        id: saved._id.toString(),
        classKey: saved.classKey,
        liveSessionId: saved.liveSessionId ? saved.liveSessionId.toString() : null,
        senderMemberId: saved.senderMemberId.toString(),
        message: saved.message,
        messageType: saved.messageType,
        createdAt: iso(saved.createdAt ?? null),
      },
    });
  } catch (err) {
    console.error("sendClassChat error", err);
    return res.status(500).json({ message: "Server error" });
  }
}