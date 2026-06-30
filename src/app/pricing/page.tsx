"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Bike, Car, Truck, Check, HelpCircle } from "lucide-react";

export default function PricingPage() {
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

  const tiers = [
    {
      title: "Bike Taxi / Moto",
      icon: <Bike className="w-8 h-8 text-purple-650" />,
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
      icon: <Car className="w-8 h-8 text-indigo-600" />,
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
      icon: <Truck className="w-8 h-8 text-emerald-600" />,
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
    <div className="w-full min-h-screen bg-[#fafaff] py-20 px-6 md:px-12 flex flex-col items-center relative overflow-hidden text-left">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/30 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-100/20 blur-[120px] pointer-events-none -z-10" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-20" />

      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16 relative z-10">
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 uppercase w-fit mx-auto shadow-sm">
          Fares & Packages
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-none">
          Transparent, Simple Pricing.
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          No hidden fees or lock-in contracts. We calculate fares dynamically based on target fleet tier rates, direct distance coordinates, and estimated trip duration.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-16 relative z-10">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`glass-card-light p-8 rounded-3xl border flex flex-col gap-6 text-left relative bg-white/60 backdrop-blur-xl ${
              tier.popular ? "border-purple-500 bg-white/90 shadow-lg ring-1 ring-purple-500/20" : "border-slate-200/60 shadow-md"
            }`}
          >
            {tier.popular && (
              <span className="absolute top-4 right-6 text-[9px] font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </span>
            )}
            <div className="flex items-center gap-4">
              <div className={`p-3.5 rounded-2xl border ${
                tier.popular ? "bg-purple-50 border-purple-100" : "bg-slate-50 border-slate-200/50"
              }`}>
                {tier.icon}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{tier.badge}</span>
                <h3 className="text-lg font-extrabold text-slate-800 mt-0.5">{tier.title}</h3>
              </div>
            </div>

            <div className="border-b border-slate-200/60 pb-4 mt-2">
              <p className="text-slate-450 text-[10px] font-bold uppercase tracking-wider">BASE FARE</p>
              <p className="text-4xl font-black text-slate-800 mt-1">{tier.base}</p>
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
                <li key={fidx} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <Link
              href="/auth/register"
              className={`w-full py-3.5 rounded-xl text-center text-xs font-bold transition-all mt-auto shadow-sm ${
                tier.popular
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25"
                  : "bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50"
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
