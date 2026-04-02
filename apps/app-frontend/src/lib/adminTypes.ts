//apps/app-frontend/src/lib/adminTypes.ts
export type AdminMetricTotals = {
  membersTotal: number;
  verifiedPhoneCount: number;
  pendingMembers: number;
  approvedMembers: number;
  rejectedMembers: number;
  archivedMembers: number;

  prayerTotal: number;
  answeredPrayers: number;
  hiddenPrayers: number;
  escalatedPrayers: number;

  leadTotal: number;
  pendingConsents: number;
  buddyAssignments: number;
  eventsTotal: number;
  auditToday: number;
  classEnrollments: number;

  counsellingCases: number;
  donorRecords: number;
  liveSessions: number;
  chatMessages: number;
};

export type DashboardSeriesPoint = {
  label: string;
  value: number;
};

export type DashboardVisibilityPolicy = {
  id: string;
  classKey: string;
  visibilityScope: string;
  adultOnlyLiveSessions: boolean;
  allowClassPosts: boolean;
  allowClassChat: boolean;
  allowPeerDiscovery: boolean;
  moderationEnabled: boolean;
  updatedAt: string | null;
};

export type DashboardResponse = {
  totals: AdminMetricTotals;
  series: {
    signups7d: DashboardSeriesPoint[];
    prayers7d: DashboardSeriesPoint[];
  };
  byClass: { key: string; label: string; count: number }[];
  insights: {
    journeyFunnel: Record<
      "seeker" | "newcomer" | "believer" | "foundation" | "serve" | "leader" | "paused",
      number
    >;
    counselling: Record<
      "urgent" | "normal" | "open" | "triaged" | "assigned" | "resolved" | "closed",
      number
    >;
    giving: {
      retained: number;
      lapsed: number;
      totalAmount: number;
      giftCount: number;
      retentionRate: number;
    };
    engagement: {
      liveSessions: number;
      chatMessages: number;
    };
    visibility: DashboardVisibilityPolicy[];
    chatActivity7d: DashboardSeriesPoint[];
  };
  recent: {
    members: MemberRow[];
    prayers: PrayerRow[];
    leads: LeadRow[];
    audit: AuditRow[];
  };
};

export type MemberRow = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  preferredClass: string | null;
  phoneVerified: boolean;
  status: string;
  parentalRequired: boolean;
  parentalGiven: boolean;
  createdAt: string | null;
};

export type MemberDetail = MemberRow & {
  roles: string[];
  tags: string[];
  points: number;
  dob: string | null;
  country: string | null;
  city: string | null;
  area: string | null;
  source: string | null;
  parentalConsent: {
    required: boolean;
    given: boolean;
    parentName: string | null;
    parentPhone: string | null;
    parentEmail: string | null;
    submittedAt: string | null;
    verifiedAt: string | null;
  } | null;
  updatedAt: string | null;
};

export type PrayerRow = {
  id: string;
  title: string;
  text: string;
  excerpt: string;
  anonymous: boolean;
  answered: boolean;
  hidden: boolean;
  escalated: boolean;
  prayersCount: number;
  answerText: string | null;
  createdAt: string | null;
  answeredAt: string | null;
};

export type PrayerDetail = PrayerRow & {
  escalatedNote: string | null;
  moderatedAt: string | null;
  moderationAction: string | null;
  moderationNote: string | null;
};

export type LeadRow = {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  preferredClass: string | null;
  serviceArea: string | null;
  churchSupport: string | null;
  testimony: string | null;
  vettingNotes: string | null;
  status: string;
  spiritualStage: string | null;
  createdAt: string | null;
};

export type LeadDetail = LeadRow & {
  roles: string[];
  tags: string[];
  points: number;
  dob: string | null;
  country: string | null;
  city: string | null;
  area: string | null;
  source: string | null;
  parentalConsent: {
    required: boolean;
    given: boolean;
    parentName: string | null;
    parentPhone: string | null;
    parentEmail: string | null;
    submittedAt: string | null;
    verifiedAt: string | null;
  } | null;
  updatedAt: string | null;
  vettingNotes: string | null;
  decisionAt: string | null;
};

export type AuditRow = {
  id: string;
  action: string;
  status: "success" | "failure";
  targetType: string | null;
  createdAt: string | null;
};

export type EnrollmentRow = {
  id: string;
  memberId: string;
  classKey: "vuka" | "ropes" | "teens" | "mph" | "young" | string;
  cohortType: string | null;
  cohortDate: string | null;
  status: string;
  decisionReason: string | null;
  ageAtApplication: number | null;
  profileLocked: boolean;
  visibilityScope: "private" | "class" | "leaders" | string;
  appliedAt: string | null;
  reviewedAt: string | null;
  parentConsentRequired: boolean;
  parentConsentGiven: boolean;
};

export type JourneyRow = {
  id: string;
  memberId: string;
  stage: "seeker" | "newcomer" | "believer" | "foundation" | "serve" | "leader" | "paused" | string;
  progressScore: number;
  nextStep: string | null;
  lastMilestone: string | null;
  updatedAt: string | null;
};

export type JourneyDetail = JourneyRow & {
  notes: string | null;
  updatedByAdminId: string | null;
};

export type CounsellingRow = {
  id: string;
  memberId: string;
  urgency: "urgent" | "non_urgent" | string;
  category: string;
  status: "triaged" | "assigned" | "resolved" | "closed" | string;
  summary: string;
  details: string | null;
  assignedToAdminId: string | null;
  followUpAt: string | null;
  createdAt: string | null;
  triagedAt: string | null;
  resolvedAt: string | null;
};

export type CounsellingDetail = CounsellingRow;

export type LiveSessionRow = {
  id: string;
  title: string;
  classKey: string | null;
  adultOnly: boolean;
  status: string | null;
  startsAt: string | null;
  endsAt: string | null;
  allowChat: boolean;
  meetingUrl: string | null;
};

export type PolicyRow = DashboardVisibilityPolicy;

export type ChatMessageRow = {
  id: string;
  classKey: "vuka" | "ropes" | "teens" | "mph" | "young" | string;
  liveSessionId: string | null;
  senderName: string;
  senderRole: "member" | "leader" | "admin" | string;
  message: string;
  messageType: "text" | "system" | "announcement" | "moderation" | string;
  hidden: boolean;
  isDeleted: boolean;
  moderationReason: string | null;
  createdAt: string | null;
};

export type PagedResponse<T> = {
  items: T[];
  page?: number;
  limit?: number;
  total?: number;
};