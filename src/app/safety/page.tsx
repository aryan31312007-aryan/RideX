"use client";

import React, { useEffect } from "react";
import { Shield, ShieldAlert, Heart, MapPin, Users } from "lucide-react";

export default function SafetyPage() {
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

  const safetyFeatures = [
    { title: "24/7 SOS Emergency", desc: "Instant alert dispatch to active response centers with one tap.", icon: <ShieldAlert className="w-6 h-6 text-red-500" />, bg: "bg-red-50" },
    { title: "Live Location Share", desc: "Share real-time coordinates with emergency contacts inside any web browser.", icon: <MapPin className="w-6 h-6 text-emerald-500" />, bg: "bg-emerald-50" },
    { title: "Driver Verification", desc: "Strict biometric identification, physical checks, and verification registry.", icon: <Users className="w-6 h-6 text-blue-500" />, bg: "bg-blue-50" },
    { title: "Active Ride Insurance", desc: "Comprehensive trip insurance cover policies for security in every kilometer.", icon: <Shield className="w-6 h-6 text-indigo-500" />, bg: "bg-indigo-50" },
    { title: "Women Safety Mode", desc: "Option to select exclusively top-rated verified safe drivers for absolute trust.", icon: <Heart className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#fafaff] py-20 px-6 md:px-12 flex flex-col items-center relative overflow-hidden text-left">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-100/30 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-100/20 blur-[120px] pointer-events-none -z-10" />
      
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-20" />

      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16 relative z-10 mx-auto">
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 uppercase w-fit mx-auto shadow-sm">
          Absolute Trust
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none">
          Safeguarding Every Kilometre
        </h1>
        <p className="text-sm md:text-base text-slate-505 max-w-2xl mx-auto leading-relaxed font-semibold">
          Discover our multi-layered safety features, biometric checking systems, and live GPS dispatch support.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative z-10">
        {safetyFeatures.map((item, idx) => (
          <div
            key={idx}
            className="glass-card-light p-8 rounded-[32px] border border-slate-200/50 flex flex-col gap-4 text-left bg-white/70 shadow-md hover:scale-[1.01] transition-transform duration-200"
          >
            <div className={`p-4 rounded-2xl ${item.bg} w-fit`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-855 tracking-tight">{item.title}</h3>
            <p className="text-xs text-slate-455 leading-relaxed font-semibold">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
