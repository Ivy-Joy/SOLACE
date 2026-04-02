"use client";

import React, { useState } from "react";
import { registerForClass } from "@/src/lib/solaceclasses"; // Now exported

interface ModalProps {
  open: boolean;
  onClose: () => void;
  classKey: string;
}

export default function ClassRegisterModal({ open, onClose, classKey }: ModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await registerForClass({ name: "User", email: "test@test.com", classKey });
    setLoading(false);
    onClose(); // Fixed: Ensure this is a call, not just an expression
  };

  if (!open) return null;

  return (
    /* z-100 is canonical */
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-4xl overflow-hidden shadow-2xl">
        {/* bg-linear-to-r is the new canonical for gradients */}
        <div className="bg-linear-to-r from-black to-gray-800 p-8 text-white">
          <h2 className="text-2xl font-serif italic">Enroll for {classKey.toUpperCase()}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full p-4 border border-gray-100 rounded-3xl" /* rounded-3xl is canonical */
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 border border-gray-100 rounded-3xl" 
          />
          <button 
            disabled={loading}
            className="w-full py-4 bg-[#C6A15A] text-black font-black uppercase tracking-widest rounded-3xl hover:bg-black hover:text-white transition-all"
          >
            {loading ? "Processing..." : "Confirm Intake"}
          </button>
        </form>
      </div>
    </div>
  );
}