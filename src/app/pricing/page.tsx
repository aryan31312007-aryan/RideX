"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Bike, Car, Truck, Check, HelpCircle, Zap } from "lucide-react";

export default function PricingPage() {
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

  const tiers = [
    {
      title: "Bike Taxi / Moto",
      icon: <Bike className="w-8 h-8 text-amber-600" />,
      base: "₹30",
      perKm: "₹8 / km",
      time: "₹1.5 / min",
      badge: "Fastest Choice",
      features: [
        "Single passenger ride",
        "Small courier dispatch",
        "Traffic filtering speed",
        "Live tracking link share"
      ]
    },
    {
      title: "Premium Sedan / EV",
      icon: <Car className="w-8 h-8 text-amber-600" />,
      base: "₹80",
      perKm: "₹15 / km",
      time: "₹3.0 / min",
      badge: "Most Popular",
      features: [
        "Up to 4 passengers",
        "Autonomous-assisted EVs",
        "Verified elite drivers",
        "Medium parcel support"
      ],
      popular: true
    },
    {
      title: "Cargo Truck / Delivery",
      icon: <Truck className="w-8 h-8 text-amber-600" />,
      base: "₹150",
      perKm: "₹25 / km",
      time: "₹5.0 / min",
      badge: "Heavy Logistics",
      features: [
        "Up to 1.5 Tons cargo",
        "Loading & unloading help",
        "Corporate bulk invoicing",
        "Scheduled deliveries"
      ]
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
          Fares & Packages
        </span>
        <h1 className="text-3xl md:text-5.5xl font-black text-slate-900 tracking-tight leading-tight">
          Transparent, Simple Pricing.
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold">
          No hidden fees or lock-in contracts. We calculate fares dynamically based on target fleet tier rates, direct distance coordinates, and estimated trip duration.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-16 relative z-10">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`bg-white p-8 rounded-[32px] border flex flex-col gap-6 text-left relative transition-all duration-300 ${
              tier.popular ? "border-[#fbbf24] shadow-lg" : "border-slate-100 shadow-sm hover:shadow-md"
            }`}
          >
            {tier.popular && (
              <span className="absolute top-4 right-6 text-[9px] font-black text-slate-950 bg-[#fbbf24] px-3.5 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </span>
            )}
            <div className="flex items-center gap-4">
              <div className={`p-3.5 rounded-2xl border ${
                tier.popular ? "bg-[#fbbf24]/10 border-[#fbbf24]/20" : "bg-slate-50 border-slate-100"
              }`}>
                {tier.icon}
              </div>
              <div>
                <span className="text-[9px] text-[#fbbf24] font-bold uppercase tracking-wider">{tier.badge}</span>
                <h3 className="text-lg font-extrabold text-slate-800 mt-0.5">{tier.title}</h3>
              </div>
            </div>

            <div className="border-b border-slate-100 pb-4 mt-2">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">BASE FARE</p>
              <p className="text-4xl font-black text-slate-900 mt-1">{tier.base}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Per KM</p>
                <p className="text-slate-800 font-extrabold text-sm mt-0.5">{tier.perKm}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Per Minute</p>
                <p className="text-slate-800 font-extrabold text-sm mt-0.5">{tier.time}</p>
              </div>
            </div>

            <ul className="flex flex-col gap-3 my-4">
              {tier.features.map((feat, fidx) => (
                <li key={fidx} className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <Link
              href="/auth/register"
              className={`w-full py-4 rounded-xl text-center text-xs font-extrabold transition-all mt-auto shadow-sm ${
                tier.popular
                  ? "bg-[#fbbf24] text-slate-900 hover:bg-[#e5ae20]"
                  : "bg-slate-50 border border-slate-200/60 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Get Started Estimate
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
