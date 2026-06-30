"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { 
  Bike, Car, Zap, Heart, Sliders, Activity, Compass, Users, Navigation, ChevronRight
} from "lucide-react";

export default function ServicesPage() {
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

  const services = [
    { title: "Bike Rides", desc: "Scooty, Normal commuter, Super sport, and heavy cruiser bikes. Fast & Affordable.", icon: <Bike className="w-6 h-6 text-yellow-600" />, bg: "bg-yellow-50/50" },
    { title: "Smart Auto", desc: "CNG, Electric, and shared route autos. Quick & Easy local commute.", icon: <Compass className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50/50" },
    { title: "Comfort Cab", desc: "Mini hatchbacks, spacious sedans, and SUV cabs for family travels.", icon: <Car className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50/50" },
    { title: "Premium VIP", desc: "Luxury electric sedans, Audi/BMW limousines, and Tesla EV SUVs.", icon: <Zap className="w-6 h-6 text-purple-600" />, bg: "bg-purple-50/50" },
    { title: "Parcel Courier", desc: "Instant documents, medium box express, and large cargo parcel delivery.", icon: <Activity className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-50/50" },
    { title: "Food Delivery", desc: "Quick hot meal express delivery and fresh grocery store delivery.", icon: <Heart className="w-6 h-6 text-red-600" />, bg: "bg-red-50/50" },
    { title: "Mini Truck", desc: "Tata Ace and E-loader box trucks for moving medium loads locally.", icon: <Sliders className="w-6 h-6 text-orange-600" />, bg: "bg-orange-50/50" },
    { title: "Pickup Truck", desc: "Mahindra loaders and open flatbeds for towing and large equipment moving.", icon: <Navigation className="w-6 h-6 text-indigo-600 rotate-45" />, bg: "bg-indigo-50/50" },
    { title: "Tempo", desc: "Force cargo tempos and fully closed shipping containers for heavy shifting.", icon: <Users className="w-6 h-6 text-teal-600" />, bg: "bg-teal-50/50" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#fafaff] py-20 px-6 md:px-12 flex flex-col items-center relative overflow-hidden text-left">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-100/30 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-100/20 blur-[120px] pointer-events-none -z-10" />
      
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-20" />

      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16 relative z-10 mx-auto">
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 uppercase w-fit mx-auto shadow-sm">
          Core Services
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none">
          Explore Our Mobility Fleet
        </h1>
        <p className="text-sm md:text-base text-slate-505 max-w-2xl mx-auto leading-relaxed font-semibold">
          From electric micro-mobility to large container logistics, select from our tailored fleet options.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full relative z-10">
        {services.map((feat, idx) => (
          <div
            key={idx}
            className="glass-card-light p-8 rounded-[32px] border border-slate-200/50 flex flex-col gap-4 text-left bg-white/70 shadow-md hover:scale-[1.01] transition-transform duration-200"
          >
            <div className={`p-4 rounded-2xl ${feat.bg} w-fit`}>
              {feat.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-850 tracking-tight">{feat.title}</h3>
            <p className="text-xs text-slate-450 leading-relaxed font-semibold">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
