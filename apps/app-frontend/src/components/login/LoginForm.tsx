// apps/app-frontend/src/components/login/LoginForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/src/lib/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or phone number").refine((val) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = /^\+[1-9]\d{1,14}$/.test(val);
    return isEmail || isPhone;
  }, {
    message: "Enter a valid email or phone (e.g., +254...)",
  }),
  admissionNumber: z.string().min(3, "Admission number is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await api.post("/auth/login", {
        username: data.identifier,
        password: data.admissionNumber,
      });
      
      router.push("/dashboard");
    } catch (err: unknown) {
      // Safely handle the unknown error type
      const errorMessage = err instanceof Error ? err.message : "Invalid credentials. Please check your admission number.";
      alert(errorMessage);
    }
  };

  const inputStyles = "w-full bg-[#F9F7F2] border border-gray-100 px-5 py-4 rounded-2xl text-sm text-dark placeholder:text-gray-400 focus:border-gold focus:ring-0 transition-all outline-none";

  return (
    <motion.form 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <input 
            {...register("identifier")} 
            placeholder="Phone (+254...) or Email" 
            className={inputStyles} 
          />
          {errors.identifier && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase ml-2">{errors.identifier.message}</p>}
        </div>

        <div>
          <input 
            {...register("admissionNumber")} 
            type="password" 
            placeholder="Admission Number" 
            className={inputStyles} 
          />
          {errors.admissionNumber && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase ml-2">{errors.admissionNumber.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-dark text-white hover:bg-gold hover:text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? "Authenticating..." : "Enter Solace"}
      </button>

      <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-6">
        Secure Access for SOLACE Students
      </p>
    </motion.form>
  );
}