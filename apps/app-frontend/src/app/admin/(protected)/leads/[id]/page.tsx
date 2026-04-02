//apps/app-frontend/src/app/admin/(protected)/leads/[id]/page.tsx
//list/search/filter leads
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/src/lib/api";
import AdminModuleLayout from "@/src/components/admin/shared/AdminModuleLayout";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";
import { Send, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import type { LeadRow } from "@/src/lib/adminTypes";

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lead, setLead] = useState<LeadRow | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadLead() {
      try {
        const res = await api.get<LeadRow>(`/admin/leads/${id}`);
        setLead(res);
        setNotes(res.vettingNotes || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLead();
  }, [id]);

  async function handleUpdateStatus(newStatus: string) {
    setSubmitting(true);
    try {
      await api.patch(`/admin/leads/${id}/status`, {
        status: newStatus,
        notes: notes
      });
      alert(`Application ${newStatus} successfully.`);
      router.push("/admin/leads");
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState label="Fetching application details..." />;
  if (!lead) return <div>Lead not found.</div>;

  return (
    <AdminModuleLayout
      title={lead.fullName}
      description={`Reviewing application for ${lead.preferredClass}`}
      backHref="/admin/leads"
      backLabel="Back to Leads"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Lead Information */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-gold" /> Application Content
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Email</label>
                <p className="text-slate-900">{lead.email}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Phone</label>
                <p className="text-slate-900">{lead.phone || "Not provided"}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t border-slate-100 pt-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Desired Service Area</label>
                  <p className="text-slate-900 font-medium capitalize">{lead.serviceArea}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Church Support Needed</label>
                  <p className="text-slate-900 font-medium capitalize">{lead.churchSupport || "None requested"}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Heart for Solace / Testimony</label>
                <p className="mt-2 text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl italic">
                  &quot;{lead.testimony || "No testimony provided."}&quot;
                </p>
              </div>
            </div>
          </section>

          {/* ADMIN NOTES BOX */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4 block">Internal Vetting Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-37.5 rounded-2xl border border-slate-200 p-4 outline-none focus:border-gold transition-all"
              placeholder="Add notes about the interview or screening process..."
            />
          </section>
        </div>

        {/* RIGHT COLUMN: Actions */}
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="font-bold mb-4">Current Status</h4>
            <StatusBadge status={lead.status} />
            
            <div className="mt-8 space-y-3">
              <button 
                disabled={submitting}
                onClick={() => handleUpdateStatus("approved")}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                <CheckCircle size={18} /> Approve Lead
              </button>
              
              <button 
                disabled={submitting}
                onClick={() => handleUpdateStatus("rejected")}
                className="w-full flex items-center justify-center gap-3 bg-rose-600 text-white py-4 rounded-2xl font-bold hover:bg-rose-700 transition-all disabled:opacity-50"
              >
                <XCircle size={18} /> Reject Lead
              </button>

              <button 
                disabled={submitting}
                onClick={() => handleUpdateStatus("screening")}
                className="w-full flex items-center justify-center gap-3 border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <Send size={18} /> Move to Screening
              </button>
            </div>
          </section>
        </div>

      </div>
    </AdminModuleLayout>
  );
}