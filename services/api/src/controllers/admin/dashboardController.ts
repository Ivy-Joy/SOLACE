// services/api/src/controllers/admin/dashboardController.ts

import type { Request, Response } from "express";
import { subDays, format } from "date-fns";

import Member from "../../models/Member";
import PrayerRequest from "../../models/PrayerRequest";
import LeadApplication from "../../models/LeadApplication";
import ConsentRecord from "../../models/ConsentRecord";
import BuddyAssignment from "../../models/BuddyAssignment";
import Event from "../../models/events/Event";
import AuditLog from "../../models/AuditLog";

import MemberJourney from "../../models/MemberJourney";
// optional (only counts, NOT logic)
import ClassChatMessage from "../../models/ClassChatMessage";
import LiveSession from "../../models/LiveSession";
import CounsellingCase from "../../models/CounsellingCase";
import Donation from "../../models/DonationRecord";

export async function getDashboardMetrics(req: Request, res: Response) {
  try {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 6);
    const thirtyDaysAgo = subDays(now, 29);

    // -------------------------------
    // TOTALS
    // -------------------------------
    const [
      membersTotal,
      verifiedPhoneCount,
      pendingMembers,
      approvedMembers,
      rejectedMembers,
      archivedMembers,

      prayerTotal,
      answeredPrayers,
      hiddenPrayers,
      escalatedPrayers,

      leadTotal,
      pendingConsents,
      buddyAssignments,
      eventsTotal,
      auditToday,
      classEnrollments,

      counsellingCases,
      donorRecords,
      liveSessions,
      chatMessages,
    ] = await Promise.all([
      Member.countDocuments(),
      Member.countDocuments({ phoneVerified: true }),
      Member.countDocuments({ status: "pending" }),
      Member.countDocuments({ status: "approved" }),
      Member.countDocuments({ status: "rejected" }),
      Member.countDocuments({ status: "archived" }),

      PrayerRequest.countDocuments(),
      PrayerRequest.countDocuments({ answered: true }),
      PrayerRequest.countDocuments({ hidden: true }),
      PrayerRequest.countDocuments({ escalated: true }),

      LeadApplication.countDocuments(),
      ConsentRecord.countDocuments({ status: "pending" }),
      BuddyAssignment.countDocuments(),
      Event.countDocuments(),
      AuditLog.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Member.countDocuments({ preferredClass: { $ne: null } }),

      CounsellingCase.countDocuments(),
      Donation.countDocuments(),
      LiveSession.countDocuments(),
      ClassChatMessage.countDocuments(),
    ]);

    // -------------------------------
    // SERIES (7 DAYS)
    // -------------------------------
    const daySeries = Array.from({ length: 7 }).map((_, i) =>
      format(subDays(now, 6 - i), "yyyy-MM-dd")
    );

    const signupsRaw = await Member.aggregate<{ _id: string; count: number }>([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const prayersRaw = await PrayerRequest.aggregate<{ _id: string; count: number }>([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const chatRaw = await ClassChatMessage.aggregate<{ _id: string; count: number }>([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const toMap = (arr: { _id: string; count: number }[]) =>
      new Map(arr.map((d) => [d._id, d.count]));

    const signupMap = toMap(signupsRaw);
    const prayerMap = toMap(prayersRaw);
    const chatMap = toMap(chatRaw);

    const signups7d = daySeries.map((d) => ({
      label: d,
      value: signupMap.get(d) ?? 0,
    }));

    const prayers7d = daySeries.map((d) => ({
      label: d,
      value: prayerMap.get(d) ?? 0,
    }));

    const chatActivity7d = daySeries.map((d) => ({
      label: d,
      value: chatMap.get(d) ?? 0,
    }));

    // MEMBER JOURNEY FUNNEL
const journeyRaw = await Member.aggregate<{ _id: string; count: number }>([
  {
    $group: {
      _id: { $ifNull: ["$spiritualStage", "seeker"] },
      count: { $sum: 1 },
    },
  },
]);

const journeyFunnel = {
  seeker: 0,
  newcomer: 0,
  believer: 0,
  foundation: 0,
  serve: 0,
  leader: 0,
  paused: 0,
};

journeyRaw.forEach((j) => {
  const key = j._id as keyof typeof journeyFunnel;
  if (key in journeyFunnel) {
    journeyFunnel[key] = j.count;
  }
});

    // -------------------------------
    // CLASS DISTRIBUTION
    // -------------------------------
    const byClassRaw = await Member.aggregate<{
      _id: string;
      count: number;
    }>([
      { $match: { preferredClass: { $ne: null } } },
      {
        $group: {
          _id: "$preferredClass",
          count: { $sum: 1 },
        },
      },
    ]);

    const byClass = byClassRaw.map((c) => ({
      key: c._id,
      label: c._id,
      count: c.count,
    }));

    // -------------------------------
    // INSIGHTS
    // -------------------------------
    /*const journeyFunnelRaw = await Member.aggregate([
      {
        $group: {
          _id: "$spiritualStage",
          count: { $sum: 1 },
        },
      },
    ]);

    const journeyFunnel = {
      seeker: 0,
      newcomer: 0,
      believer: 0,
      foundation: 0,
      serve: 0,
      leader: 0,
      paused: 0,
    } as Record<string, number>;

    journeyFunnelRaw.forEach((j) => {
      if (j._id) journeyFunnel[j._id] = j.count;
    });*/

    const counsellingRaw = await CounsellingCase.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const counselling = {
      urgent: 0,
      normal: 0,
      open: 0,
      triaged: 0,
      assigned: 0,
      resolved: 0,
      closed: 0,
    } as Record<string, number>;

    counsellingRaw.forEach((c) => {
      if (c._id) counselling[c._id] = c.count;
    });

    const givingAgg = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          giftCount: { $sum: 1 },
        },
      },
    ]);

    const giving = {
      retained: 0,
      lapsed: 0,
      totalAmount: givingAgg[0]?.totalAmount ?? 0,
      giftCount: givingAgg[0]?.giftCount ?? 0,
      retentionRate: 0,
    };

    // -------------------------------
    // RECENT
    // -------------------------------
    const recentMembersRaw = await Member.find().lean();

const recentMembers = recentMembersRaw.map((m: any) => ({
  id: m._id.toString(),
  fullName: m.fullName,
  phone: m.phone,
  email: m.email ?? null,
  preferredClass: m.preferredClass ?? null,
  phoneVerified: m.phoneVerified,
  status: m.status,
  parentalRequired: m.parentalRequired,
  parentalGiven: m.parentalGiven,
  createdAt: m.createdAt?.toISOString() ?? null,
}));

    const recentPrayers = await PrayerRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentLeads = await LeadApplication.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentAuditRaw = await AuditLog.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .lean();

const recentAudit = recentAuditRaw.map((log: any) => ({
  id: log._id.toString(),
  action: log.action,
  status: log.status,
  targetType: log.targetType ?? null,
  createdAt: log.createdAt ? log.createdAt.toISOString() : null,
}));
    // -------------------------------
    // RESPONSE
    // -------------------------------
    res.json({
      totals: {
        membersTotal,
        verifiedPhoneCount,
        pendingMembers,
        approvedMembers,
        rejectedMembers,
        archivedMembers,

        prayerTotal,
        answeredPrayers,
        hiddenPrayers,
        escalatedPrayers,

        leadTotal,
        pendingConsents,
        buddyAssignments,
        eventsTotal,
        auditToday,
        classEnrollments,

        counsellingCases,
        donorRecords,
        liveSessions,
        chatMessages,
      },

      series: {
        signups7d,
        prayers7d,
      },

      byClass,

      insights: {
        journeyFunnel,
        counselling,
        giving,
        engagement: {
          liveSessions,
          chatMessages,
        },
        visibility: [], // handled in policies controller now
        chatActivity7d,
      },

      recent: {
        members: recentMembers,
        prayers: recentPrayers,
        leads: recentLeads,
        audit: recentAudit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard metrics" });
  }
}