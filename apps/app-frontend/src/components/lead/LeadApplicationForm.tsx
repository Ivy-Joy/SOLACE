"use client"

import { useState } from "react"
import api from "@/src/lib/api"

type Referee = {
  name: string
  phone?: string
}

type LeadApplicationFormData = {
  fullName?: string
  phone?: string
  email?: string
  testimony?: string
  priorService?: string
  referees?: Referee[]
}

export default function LeadApplicationForm() {

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<LeadApplicationFormData>({
    referees: [{ name: "", phone: "" }]
  })

  function updateForm(values: Partial<LeadApplicationFormData>) {
    setForm(prev => ({ ...prev, ...values }))
  }

  function nextStep() {
    setStep(prev => prev + 1)
  }

  function prevStep() {
    setStep(prev => prev - 1)
  }

  async function submitFinal() {
    try {
      setLoading(true)

      await api.post("/lead-applications", form)

      alert("Application submitted. A reviewer will contact you.")

      setForm({ referees: [{ name: "", phone: "" }] })
      setStep(1)

    } catch {
      alert("Failed to submit application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl bg-white/5 p-6 rounded space-y-4">

      <div className="text-sm text-white/60">
        Step {step} / 3
      </div>

      {step === 1 && (
        <div className="space-y-3">

          <h3 className="font-semibold">Personal</h3>

          <input
            placeholder="Full name"
            className="input"
            value={form.fullName || ""}
            onChange={e => updateForm({ fullName: e.target.value })}
          />

          <input
            placeholder="Phone"
            className="input"
            value={form.phone || ""}
            onChange={e => updateForm({ phone: e.target.value })}
          />

          <input
            placeholder="Email"
            className="input"
            value={form.email || ""}
            onChange={e => updateForm({ email: e.target.value })}
          />

          <button
            onClick={nextStep}
            className="bg-[var(--gs-gold)] px-4 py-2 rounded"
          >
            Next
          </button>

        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">

          <h3 className="font-semibold">Spiritual Story</h3>

          <textarea
            placeholder="Testimony"
            className="input h-28"
            value={form.testimony || ""}
            onChange={e => updateForm({ testimony: e.target.value })}
          />

          <input
            placeholder="Prior service (brief)"
            className="input"
            value={form.priorService || ""}
            onChange={e => updateForm({ priorService: e.target.value })}
          />

          <div className="flex gap-2">

            <button
              onClick={prevStep}
              className="px-3 py-2 border rounded"
            >
              Back
            </button>

            <button
              onClick={nextStep}
              className="px-3 py-2 bg-[var(--gs-gold)] rounded"
            >
              Next
            </button>

          </div>

        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">

          <h3 className="font-semibold">Referee</h3>

          <input
            placeholder="Referee name"
            className="input"
            value={form.referees?.[0]?.name || ""}
            onChange={e =>
              updateForm({
                referees: [{ ...form.referees?.[0], name: e.target.value }]
              })
            }
          />

          <input
            placeholder="Referee phone"
            className="input"
            value={form.referees?.[0]?.phone || ""}
            onChange={e =>
              updateForm({
                referees: [{ 
                    ...(form.referees?.[0] || { name:"", phone:""}), 
                    phone: e.target.value 
                }]
              })
            }
          />

          <div className="flex gap-2">

            <button
              onClick={prevStep}
              className="px-3 py-2 border rounded"
            >
              Back
            </button>

            <button
              onClick={submitFinal}
              disabled={loading}
              className="px-3 py-2 bg-[var(--gs-gold)] rounded"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

          </div>

        </div>
      )}

    </div>
  )
}