"use client";

import React, { useEffect } from "react";
import { Sparkles, Map, Navigation, Shield, DollarSign, Database, Brain, Globe, Cpu } from "lucide-react";

export default function FeaturesPage() {
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

  const coreFeatures = [
    {
      title: "Real-time Vehicle Tracking",
      desc: "Live sub-second position updates utilizing Firebase Realtime Database. Tracks coordinates and renders moving vectors on canvas.",
      icon: <Navigation className="w-6 h-6 text-purple-600 rotate-45" />
    },
    {
      title: "AI Route Optimization",
      desc: "Computes optimal navigation paths between coordinates. Built with custom simulation routing layers for instant ETA updates.",
      icon: <Brain className="w-6 h-6 text-indigo-600" />
    },
    {
      title: "Multi-Role Core Architecture",
      desc: "Switch instantly between Customer, Driver, Admin, and Corporate dashboard modules. Handshake workflows are synchronized in real time.",
      icon: <Cpu className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Dynamic Surge Pricing",
      desc: "Control fares dynamically based on vehicle type parameters (Bike, Car, Truck), distance, and base rate configuration in the Admin controls.",
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Corporate Cargo & Billing",
      desc: "Tailored dashboard for businesses to upload multiple orders simultaneously, manage company balances, and access monthly invoices.",
      icon: <Database className="w-6 h-6 text-fuchsia-600" />
    },
    {
      title: "Strict Identity Document Uploads",
      desc: "Security audit trails for drivers. Upload credentials and verify drivers instantly through the admin control suite.",
      icon: <Shield className="w-6 h-6 text-rose-600" />
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#fafaff] py-20 px-6 md:px-12 flex flex-col items-center relative overflow-hidden text-left">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/30 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-100/20 blur-[120px] pointer-events-none -z-10" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-20" />

      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16 relative z-10">
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 uppercase w-fit mx-auto shadow-sm">
          Technical Capabilities
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-none">
          Designed for Scale. Built for Speed.
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Explore the premium architecture that drives the RIDEX mobility and logistics engine. We use a lightning-fast client interface backed by Firebase Realtime sync.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full relative z-10">
        {coreFeatures.map((feat, idx) => (
          <div
            key={idx}
            className="glass-card-light p-6 rounded-3xl border border-slate-200/60 flex flex-col gap-4 text-left bg-white/60 shadow-md hover:scale-[1.01] transition-transform duration-200"
          >
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/50 w-fit">
              {feat.icon}
            </div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">{feat.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
