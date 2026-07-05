"use client";

import React, { useEffect } from "react";
import { Compass, Users, Heart, Target, MapPin, Zap } from "lucide-react";

export default function AboutPage() {
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
    };
  }, []);

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
          Company Vision
        </span>
        <h1 className="text-3xl md:text-5.5xl font-black text-slate-900 tracking-tight leading-tight">
          Our Mission: Accelerate Transportation
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold">
          We are building the open platform for next-generation cargo dispatching, automated ride sharing, and drone logistics ecosystems.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16 relative z-10">
        {[
          {
            title: "Open Technology",
            desc: "Built on high-fidelity open APIs, real-time databases, and responsive Canvas rendering to keep dispatch latency near-zero.",
            icon: <Compass className="w-6 h-6 text-amber-600" />,
            glow: "hover:border-[#fbbf24]/30"
          },
          {
            title: "Driver-First Focus",
            desc: "Ensuring fair earnings, detailed dashboard checklists, strict document verification, and direct digital payouts.",
            icon: <Users className="w-6 h-6 text-amber-600" />,
            glow: "hover:border-[#fbbf24]/30"
          },
          {
            title: "SLA Commitment",
            desc: "99.9% logistics uptime guarantees with continuous fallback routing models and instant automatic dispatch queues.",
            icon: <Target className="w-6 h-6 text-amber-600" />,
            glow: "hover:border-[#fbbf24]/30"
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className={`bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left transition-all duration-300 hover:shadow-md hover:bg-slate-50/50 ${item.glow}`}
          >
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-100/50 w-fit">
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
