"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebase, UserRole } from "@/context/FirebaseContext";
import { Mail, Phone, Lock, Navigation, ShieldCheck, User, Truck, HelpCircle } from "lucide-react";

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
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-20 px-6 flex justify-center items-center relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative">
        <div className="text-center flex flex-col items-center gap-2 mb-8">
          <div className="bg-primary/20 p-2.5 rounded-2xl border border-primary/30 text-primary">
            <Navigation className="w-6 h-6 rotate-45" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">Welcome Back</h2>
          <p className="text-xs text-gray-400">Sign in to orchestrate rides & parcel dispatches</p>
        </div>

        {/* Quick Autofill Tabs */}
        <div className="mb-6">
          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2 text-left">
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
                className={`py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  role === btn.type
                    ? "bg-primary/20 border-primary text-white"
                    : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs text-left font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 font-semibold uppercase">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tony@stark.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Name Optional input (for quick creation) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 font-semibold uppercase">FULL NAME (OPTIONAL)</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Additional attributes depending on selection */}
          {role === "corporate" && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-[10px] text-gray-400 font-semibold uppercase">COMPANY NAME</label>
              <div className="relative">
                <Truck className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Stark Logistics Inc."
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {role === "customer" && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-[10px] text-gray-400 font-semibold uppercase">PHONE NUMBER</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" /> Secure Sandbox Session
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">Forgot Password?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm mt-3 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Authenticating..." : `Access as ${role.toUpperCase()}`}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-400">
          New to RideX?{" "}
          <Link href="/auth/register" className="text-primary hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
