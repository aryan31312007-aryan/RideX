"use client";

import React, { useEffect } from "react";
import { Sparkles, Map, Navigation, Shield, DollarSign, Database, Brain, Globe, Cpu, Zap } from "lucide-react";

export default function FeaturesPage() {
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

  const coreFeatures = [
    {
      title: "Real-time Vehicle Tracking",
      desc: "Live sub-second position updates utilizing Firebase Realtime Database. Tracks coordinates and renders moving vectors on canvas.",
      icon: <Navigation className="w-6 h-6 text-amber-600 rotate-45" />
    },
    {
      title: "AI Route Optimization",
      desc: "Computes optimal navigation paths between coordinates. Built with custom simulation routing layers for instant ETA updates.",
      icon: <Brain className="w-6 h-6 text-amber-600" />
    },
    {
      title: "Multi-Role Core Architecture",
      desc: "Switch instantly between Customer, Driver, Admin, and Corporate dashboard modules. Handshake workflows are synchronized in real time.",
      icon: <Cpu className="w-6 h-6 text-amber-600" />
    },
    {
      title: "Dynamic Surge Pricing",
      desc: "Control fares dynamically based on vehicle type parameters (Bike, Car, Truck), distance, and base rate configuration in the Admin controls.",
      icon: <DollarSign className="w-6 h-6 text-amber-600" />
    },
    {
      title: "Corporate Cargo & Billing",
      desc: "Tailored dashboard for businesses to upload multiple orders simultaneously, manage company balances, and access monthly invoices.",
      icon: <Database className="w-6 h-6 text-amber-600" />
    },
    {
      title: "Strict Identity Document Uploads",
      desc: "Security audit trails for drivers. Upload credentials and verify drivers instantly through the admin control suite.",
      icon: <Shield className="w-6 h-6 text-amber-600" />
    }
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
          Technical Capabilities
        </span>
        <h1 className="text-3xl md:text-5.5xl font-black text-slate-900 tracking-tight leading-tight">
          Designed for Scale. Built for Speed.
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold">
          Explore the premium architecture that drives the RIDEX mobility and logistics engine. We use a lightning-fast client interface backed by Firebase Realtime sync.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full relative z-10">
        {coreFeatures.map((feat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col gap-4 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#fbbf24]/30"
          >
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-100/50 w-fit">
              {feat.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">{feat.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
