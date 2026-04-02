//apss/app-frontend/src/components/admin/AdminAuthForm.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import api from "@/src/lib/api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const bootstrapSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bootstrapToken: z.string().min(10, "Bootstrap token is required"),
});

type LoginValues = z.infer<typeof loginSchema>;
type BootstrapValues = z.infer<typeof bootstrapSchema>;

type LoginResponse = {
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

type BootstrapResponse = {
  ok: boolean;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export default function AdminAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "bootstrap">("login");
  const [serverError, setServerError] = useState<string | null>(null);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const bootstrapForm = useForm<BootstrapValues>({
    resolver: zodResolver(bootstrapSchema),
    mode: "onTouched",
  });

  /*const inputStyles =
    "w-full bg-[#F9F7F2] border border-gray-200 px-4 py-3 rounded-2xl text-sm outline-none focus:border-black";*/
    const inputStyles =
    "w-full bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 px-5 py-3 rounded-xl text-sm outline-none transition-all " +
    "focus:border-[var(--gs-gold)] focus:ring-2 focus:ring-[rgba(224,190,83,0.25)]";

  async function onLoginSubmit(values: LoginValues) {
    setServerError(null);
    try {
      const res = await api.post<LoginResponse>("/auth/login", values);
      localStorage.setItem("admin_token", res.token);
      router.push("/admin");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    }
  }

  async function onBootstrapSubmit(values: BootstrapValues) {
    setServerError(null);
    try {
      const res = await api.post<BootstrapResponse>("/auth/bootstrap", values);
      if (res.ok) {
        setMode("login");
        bootstrapForm.reset();
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Bootstrap failed");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl space-y-6">
        <h1 className="text-2xl font-serif italic font-bold text-center text-gray-900">
            SOLACE Admin
        </h1>
        <p className="text-center text-sm text-gray-500">
            Secure access portal
        </p>
      <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
        <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
            mode === "login"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
        >
            Login
        </button>

        <button
            type="button"
            onClick={() => setMode("bootstrap")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
            mode === "bootstrap"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
        >
            Bootstrap
        </button>
    </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      {mode === "login" ? (
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <div>
            <input
              {...loginForm.register("email")}
              placeholder="Admin email"
              className={inputStyles}
            />
            {loginForm.formState.errors.email && (
              <p className="text-xs text-red-600 mt-1">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...loginForm.register("password")}
              type="password"
              placeholder="Password"
              className={inputStyles}
            />
            {loginForm.formState.errors.password && (
              <p className="text-xs text-red-600 mt-1">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          {/* <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-2xl font-semibold"
          >
            Login
          </button> */}
          <button
            type="submit"
            className="w-full bg-[var(--gs-dark)] text-white py-3 rounded-xl font-semibold tracking-wide transition hover:opacity-90 active:scale-[0.98]"
          >
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={bootstrapForm.handleSubmit(onBootstrapSubmit)} className="space-y-4">
          <div>
            <input
              {...bootstrapForm.register("name")}
              placeholder="Admin name"
              className={inputStyles}
            />
            {bootstrapForm.formState.errors.name && (
              <p className="text-xs text-red-600 mt-1">{bootstrapForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              {...bootstrapForm.register("email")}
              placeholder="Admin email"
              className={inputStyles}
            />
            {bootstrapForm.formState.errors.email && (
              <p className="text-xs text-red-600 mt-1">{bootstrapForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...bootstrapForm.register("password")}
              type="password"
              placeholder="Password"
              className={inputStyles}
            />
            {bootstrapForm.formState.errors.password && (
              <p className="text-xs text-red-600 mt-1">{bootstrapForm.formState.errors.password.message}</p>
            )}
          </div>

          <div>
            <input
              {...bootstrapForm.register("bootstrapToken")}
              placeholder="Bootstrap token"
              className={inputStyles}
            />
            {bootstrapForm.formState.errors.bootstrapToken && (
              <p className="text-xs text-red-600 mt-1">{bootstrapForm.formState.errors.bootstrapToken.message}</p>
            )}
          </div>

          {/* <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-2xl font-semibold"
          >
            Create Admin
          </button> */}
          <button
            type="submit"
            className="w-full bg-[var(--gs-gold)] text-black py-3 rounded-xl font-semibold tracking-wide transition hover:opacity-90 active:scale-[0.98]"
          >
            Create Admin
          </button>
        </form>
      )}
    </div>
  );
}