"use client";

import React, { useEffect } from "react";
import { Compass, Users, Heart, Target, MapPin } from "lucide-react";

export default function AboutPage() {
  // Page-level Light Mode override
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

  return (
    <div className="w-full min-h-screen bg-[#fafaff] py-20 px-6 md:px-12 flex flex-col items-center relative overflow-hidden text-left">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/30 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-100/20 blur-[120px] pointer-events-none -z-10" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-20" />

      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16 relative z-10">
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 uppercase w-fit mx-auto shadow-sm">
          Company Vision
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-none">
          Our Mission: Accelerate Transportation
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          We are building the open platform for next-generation cargo dispatching, automated ride sharing, and drone logistics ecosystems.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16 relative z-10">
        {[
          {
            title: "Open Technology",
            desc: "Built on high-fidelity open APIs, real-time databases, and responsive Canvas rendering to keep dispatch latency near-zero.",
            icon: <Compass className="w-6 h-6 text-purple-600" />
          },
          {
            title: "Driver-First Focus",
            desc: "Ensuring fair earnings, detailed dashboard checklists, strict document verification, and direct digital payouts.",
            icon: <Users className="w-6 h-6 text-indigo-600" />
          },
          {
            title: "SLA Commitment",
            desc: "99.9% logistics uptime guarantees with continuous fallback routing models and instant automatic dispatch queues.",
            icon: <Target className="w-6 h-6 text-emerald-600" />
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className="glass-card-light p-8 rounded-3xl border border-slate-200/60 flex flex-col gap-4 text-left bg-white/60 shadow-md hover:scale-[1.01] transition-transform duration-200"
          >
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/50 w-fit">
              {item.icon}
            </div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
