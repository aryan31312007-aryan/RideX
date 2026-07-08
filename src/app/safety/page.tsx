"use client";

import React, { useEffect } from "react";
import { Shield, ShieldAlert, Heart, MapPin, Users, Zap } from "lucide-react";

export default function SafetyPage() {
  // Page-level styling reset to clean light-mode reference image layout
  useEffect(() => {
    const body = document.body;
    const prevBg = body.style.backgroundColor;
    const prevColor = body.style.color;
    
    body.style.backgroundColor = "#ffffff";
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

  const safetyFeatures = [
    { title: "24/7 SOS Emergency", desc: "Instant alert dispatch to active response centers with one tap.", icon: <ShieldAlert className="w-6 h-6 text-red-500" />, bg: "bg-red-50 border-red-100" },
    { title: "Live Location Share", desc: "Share real-time coordinates with emergency contacts inside any web browser.", icon: <MapPin className="w-6 h-6 text-emerald-500" />, bg: "bg-emerald-50 border-emerald-100" },
    { title: "Driver Verification", desc: "Strict biometric identification, physical checks, and verification registry.", icon: <Users className="w-6 h-6 text-blue-500" />, bg: "bg-blue-50 border-blue-100" },
    { title: "Active Ride Insurance", desc: "Comprehensive trip insurance cover policies for security in every kilometer.", icon: <Shield className="w-6 h-6 text-indigo-500" />, bg: "bg-indigo-50 border-indigo-100" },
    { title: "Women Safety Mode", desc: "Option to select exclusively top-rated verified safe drivers for absolute trust.", icon: <Heart className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50 border-purple-100" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] py-24 px-6 md:px-12 flex flex-col items-center relative overflow-hidden text-left text-slate-850">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#fbbf24]/5 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#6366f1]/5 blur-[120px] pointer-events-none -z-10" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-20" />

      <div className="max-w-4xl text-center flex flex-col gap-5 mb-16 relative z-10 mx-auto">
        <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/60 text-xs font-bold text-[#fbbf24] w-fit mx-auto shadow-sm">
          <Zap className="w-3.5 h-3.5 fill-[#fbbf24]/10" />
          Absolute Trust
        </span>
        <h1 className="text-3xl md:text-5.5xl font-black text-slate-900 tracking-tight leading-tight">
          Safeguarding Every Kilometre
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold">
          Discover our multi-layered safety features, biometric checking systems, and live GPS dispatch support.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative z-10">
        {safetyFeatures.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[32px] border border-slate-100 flex flex-col gap-4 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#fbbf24]/30"
          >
            <div className={`p-4 rounded-2xl ${item.bg} w-fit border`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
