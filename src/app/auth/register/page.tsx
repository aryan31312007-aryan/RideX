"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebase, UserRole } from "@/context/FirebaseContext";
import { Mail, User, Phone, Lock, Navigation, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const { login } = useFirebase();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set page-level light mode background override
  useEffect(() => {
    const body = document.body;
    const prevBg = body.style.backgroundColor;
    const prevColor = body.style.color;
    
    body.style.backgroundColor = "#fafaff";
    body.style.color = "#0f172a";
    
    const html = document.documentElement;
    const hasDark = html.classList.contains("dark");
    if (hasDark) {
      html.classList.remove("dark");
    }

    return () => {
      body.style.backgroundColor = prevBg;
      body.style.color = prevColor;
      if (hasDark) {
        html.classList.add("dark");
      }
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !name.trim()) {
      setError("Please fill in email and name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address (e.g., name@company.com).");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await login(cleanEmail, role, name, phone);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fafaff] py-20 px-6 flex justify-center items-center relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/40 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/30 blur-[120px] pointer-events-none -z-10" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-20" />

      <div className="w-full max-w-md glass-card-light p-8 rounded-3xl border border-slate-200/80 shadow-xl relative z-10">
        <div className="text-center flex flex-col items-center gap-2 mb-8">
          <div className="bg-purple-100 p-2.5 rounded-2xl border border-purple-200/50 text-purple-600">
            <Navigation className="w-6 h-6 rotate-45" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mt-2">Create Account</h2>
          <p className="text-xs text-slate-500">Join the RIDEX logistics ecosystem</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-55 border border-red-100 text-red-500 rounded-xl text-xs text-left font-semibold flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4 text-left">
          {/* Role selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">REGISTERING AS</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 rounded-xl glass-input-light bg-white text-sm text-slate-800 focus:outline-none cursor-pointer border border-slate-200/80"
            >
              <option value="customer" className="text-slate-850">Customer Client</option>
              <option value="driver" className="text-slate-850">Driver Partner</option>
              <option value="corporate" className="text-slate-850">Corporate Partner</option>
            </select>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tony@stark.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input-light text-sm text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">FULL NAME</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tony Stark"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input-light text-sm text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PHONE NUMBER</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input-light text-sm text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm mt-3 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-purple-500/10"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-purple-600 hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
