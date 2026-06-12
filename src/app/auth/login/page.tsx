"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebase, UserRole } from "@/context/FirebaseContext";
import { Mail, Phone, Lock, Navigation, User, Truck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { login, profile, user } = useFirebase();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Email address is required.");
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
      const userProfile = await login(cleanEmail, role, name, phone, company);
      // Redirect based on role
      if (userProfile.role === "admin") {
        router.push("/admin");
      } else if (userProfile.role === "driver") {
        router.push("/driver");
      } else if (userProfile.role === "corporate") {
        router.push("/corporate");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Check your network or credentials.");
    } finally {
      setLoading(false);
    }
  };

  const autofillUser = (type: UserRole) => {
    setRole(type);
    if (type === "admin") {
      setEmail("admin@ridex.io");
      setName("Admin Operator");
    } else if (type === "driver") {
      setEmail("driver.amit@ridex.io");
      setName("Amit Kumar");
      setPhone("+91 9999999901");
    } else if (type === "corporate") {
      setEmail("logistics@stark.com");
      setName("Pepper Potts");
      setCompany("Stark Industries");
    } else {
      setEmail("client.user@gmail.com");
      setName("John Doe");
      setPhone("+91 9876543210");
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
          <h2 className="text-2xl font-extrabold text-slate-800 mt-2">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to orchestrate rides & parcel dispatches</p>
        </div>

        {/* Quick Autofill Tabs */}
        <div className="mb-6">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2 text-left">
            Select Role to Access Dashboard
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { type: "customer", label: "Client" },
              { type: "driver", label: "Driver" },
              { type: "corporate", label: "Corp" },
              { type: "admin", label: "Admin" }
            ].map((btn) => (
              <button
                key={btn.type}
                type="button"
                onClick={() => autofillUser(btn.type as UserRole)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  role === btn.type
                    ? "bg-purple-100 border-purple-200 text-purple-700 font-bold shadow-sm"
                    : "bg-slate-50 border-slate-200/50 text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs text-left font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
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

          {/* Name Optional input (for quick creation) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">FULL NAME (OPTIONAL)</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input-light text-sm text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Additional attributes depending on selection */}
          {role === "corporate" && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">COMPANY NAME</label>
              <div className="relative">
                <Truck className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Stark Logistics Inc."
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input-light text-sm text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          {role === "customer" && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
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
          )}

          <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" /> Secure Sandbox Session
            </span>
            <span className="hover:text-purple-600 transition-colors cursor-pointer font-medium">Forgot Password?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm mt-3 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-purple-500/10"
          >
            {loading ? "Authenticating..." : `Access as ${role.toUpperCase()}`}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          New to RideX?{" "}
          <Link href="/auth/register" className="text-purple-600 hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
