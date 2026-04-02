//apps/app-frontend/src/components/discipleship/DiscipleshipForm.tsx
"use client";

import React, { useState } from "react";
import { ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function DiscipleshipForm() {
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cohort: "",
    helpArea: "",
    otp: ""
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mock Verification Logic
  const handleSendOtp = async () => {
    if (!formData.phone) return;
    setVerifying(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setOtpSent(true);
    setVerifying(false);
  };

  const handleVerifyOtp = async () => {
    setVerifying(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsVerified(true);
    setVerifying(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Submitted Data:", formData);

    // Clear Inputs
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      cohort: "",
      helpArea: "",
      otp: ""
    });
    setOtpSent(false);
    setIsVerified(false);
    setLoading(false);
    
    alert("Application submitted successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
          <input 
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            type="text" 
            placeholder="John Doe"
            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-zinc-900 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C6A15A] transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
          <input 
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email" 
            placeholder="john@example.com"
            className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-zinc-900 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C6A15A] transition-all"
          />
        </div>
      </div>

      {/* Phone Verification Section */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
        <div className="flex gap-2">
          <input 
            required
            disabled={isVerified}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel" 
            placeholder="+254..."
            className="flex-1 bg-gray-50 border border-gray-100 px-4 py-3 text-zinc-900 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C6A15A] transition-all disabled:opacity-50"
          />
          {!isVerified && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={verifying || !formData.phone}
              className="px-4 py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all disabled:bg-gray-200"
            >
              {verifying && !otpSent ? <Loader2 className="animate-spin" size={14} /> : "Verify"}
            </button>
          )}
          {isVerified && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-600 rounded-xl border border-green-100">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase">Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* OTP Input (Conditional) */}
      {otpSent && !isVerified && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Enter OTP</label>
          <div className="flex gap-2">
            <input 
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              type="text" 
              maxLength={6}
              placeholder="000000"
              className="flex-1 bg-zinc-50 border border-[#C6A15A]/30 px-4 py-3 text-zinc-900 rounded-xl text-sm tracking-[0.5em] font-mono focus:outline-none focus:ring-1 focus:ring-[#C6A15A]"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={verifying || formData.otp.length < 4}
              className="px-6 py-3 bg-[#C6A15A] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#b08d4a] transition-all"
            >
              {verifying ? <Loader2 className="animate-spin" size={14} /> : "Confirm"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Preferred Cohort Schedule</label>
        <select 
          required
          name="cohort"
          value={formData.cohort}
          onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C6A15A] transition-all appearance-none text-gray-600"
        >
          <option value="">Select a schedule...</option>
          <option value="weekday">Weekday Evenings</option>
          <option value="weekend">Weekends</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Where do you need help most?</label>
        <textarea 
          required
          name="helpArea"
          value={formData.helpArea}
          onChange={handleChange}
          rows={3}
          placeholder="Specific areas where you'd like guidance..."
          className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-zinc-900 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C6A15A] transition-all resize-none"
        />
      </div>

      <button 
        type="submit"
        disabled={loading || !isVerified}
        className="w-full bg-black text-white py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : (
          <>
            Commit to the Journey
            <ArrowRight size={16} />
          </>
        )}
      </button>
      
      {!isVerified && (
        <p className="text-[9px] text-[#C6A15A] text-center font-bold uppercase tracking-widest">
          Verify your phone to unlock registration
        </p>
      )}
    </form>
  );
}