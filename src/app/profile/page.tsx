"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { User, Phone, Briefcase, Mail, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ProfileSettings() {
  const { user, profile, updateProfile, loading: authLoading } = useFirebase();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setCompanyName(profile.companyName || "");
    }
  }, [user, profile, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateProfile({
        name,
        phone,
        companyName: profile?.role === "corporate" ? companyName : undefined
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-20 px-6 flex justify-center items-center">
      <div className="w-full max-w-lg glass-card p-8 rounded-3xl border border-white/10 shadow-2xl text-left relative">
        <div className="border-b border-white/5 pb-4 mb-6">
          <h2 className="text-xl font-extrabold text-white">Profile Settings</h2>
          <p className="text-xs text-gray-400 mt-1">Manage credentials, operational parameters, and roles.</p>
        </div>

        {success && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
            Profile changes successfully saved to Firebase.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          
          {/* Email read only */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 font-bold uppercase text-[9px]">Registered Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                readOnly
                value={profile?.email || ""}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-500 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 font-bold uppercase text-[9px]">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 font-bold uppercase text-[9px]">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Corporate field if corporate role */}
          {profile?.role === "corporate" && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-gray-400 font-bold uppercase text-[9px]">Company Name</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Role badge */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 mt-2 flex justify-between items-center">
            <div>
              <p className="text-gray-500 font-semibold uppercase text-[9px]">Account Role</p>
              <p className="text-white font-extrabold capitalize text-sm mt-0.5">{profile?.role}</p>
            </div>
            <span className="text-[10px] text-yellow-500 font-bold bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
              Live Session
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm mt-3 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
