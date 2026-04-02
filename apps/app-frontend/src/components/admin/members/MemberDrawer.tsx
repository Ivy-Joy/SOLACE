"use client";

import { X } from "lucide-react";
import type { MemberDetail } from "@/src/lib/adminTypes";
import StatusBadge from "../shared/StatusBadge";

type Props = {
  member: MemberDetail | null;
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onArchive: () => void;
  onUpdateTags: (tags: string[]) => void;
};

export default function MemberDrawer({
  member,
  open,
  onClose,
  onApprove,
  onReject,
  onArchive,
}: Props) {
  const tagsText = member?.tags.join(", ") ?? "";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-xl transform border-l border-gray-200 bg-white transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Member</p>
              <h2 className="mt-1 text-2xl font-black text-gray-900">{member?.fullName ?? "Loading..."}</h2>
            </div>
            <button onClick={onClose} className="rounded-2xl border border-gray-200 p-2">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {member ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={member.status} />
                  <StatusBadge status={member.phoneVerified ? "verified" : "unverified"} />
                  <StatusBadge status={member.parentalConsent?.given ? "consented" : "consent_pending"} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Info label="Phone" value={member.phone} />
                  <Info label="Email" value={member.email ?? "—"} />
                  <Info label="Class" value={member.preferredClass ?? "—"} />
                  <Info label="Points" value={String(member.points)} />
                  <Info label="Country" value={member.country ?? "—"} />
                  <Info label="City" value={member.city ?? "—"} />
                  <Info label="Area" value={member.area ?? "—"} />
                  <Info label="DOB" value={member.dob ?? "—"} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Tags</p>
                  <p className="mt-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                    {tagsText || "No tags"}
                  </p>
                </div>

                <div className="space-y-2">
                  <button onClick={onApprove} className="w-full rounded-2xl bg-[var(--gs-dark)] px-4 py-3 text-sm font-semibold text-white">
                    Approve
                  </button>
                  <button onClick={onReject} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
                    Reject
                  </button>
                  <button onClick={onArchive} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
                    Archive
                  </button>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Parental consent</p>
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                    {JSON.stringify(member.parentalConsent, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">Select a member to view details.</div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}