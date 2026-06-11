"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebase, UserRole } from "@/context/FirebaseContext";
import { Mail, User, Phone, Lock, Navigation } from "lucide-react";

export default function RegisterPage() {
  const { login } = useFirebase();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setError("Please fill in email and name.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email, role, name, phone);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register account.");
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-extrabold text-white mt-2">Create Account</h2>
          <p className="text-xs text-gray-400">Join the RIDEX logistics ecosystem</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs text-left font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4 text-left">
          {/* Role selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 font-semibold uppercase">REGISTERING AS</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value="customer" className="bg-gray-950">Customer Client</option>
              <option value="driver" className="bg-gray-950">Driver Partner</option>
              <option value="corporate" className="bg-gray-950">Corporate Partner</option>
            </select>
          </div>

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

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 font-semibold uppercase">FULL NAME</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tony Stark"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm mt-3 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
