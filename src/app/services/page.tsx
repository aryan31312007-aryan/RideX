"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { 
  Bike, Car, Zap, Heart, Sliders, Activity, Compass, Users, Navigation, ChevronRight
} from "lucide-react";

export default function ServicesPage() {
  // Page-level styling reset to sleek premium dark-mode default
  useEffect(() => {
    const body = document.body;
    const prevBg = body.style.backgroundColor;
    const prevColor = body.style.color;
    
    body.style.backgroundColor = "#030712";
    body.style.color = "#f3f4f6";
    
    const html = document.documentElement;
    const hasDark = html.classList.contains("dark");
    if (!hasDark) {
      html.classList.add("dark");
    }

    return () => {
      body.style.backgroundColor = prevBg;
      body.style.color = prevColor;
    };
  }, []);

  const services = [
    { title: "Bike Rides", desc: "Scooty, Normal commuter, Super sport, and heavy cruiser bikes. Fast & Affordable.", icon: <Bike className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10" },
    { title: "Smart Auto", desc: "CNG, Electric, and shared route autos. Quick & Easy local commute.", icon: <Compass className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10" },
    { title: "Comfort Cab", desc: "Mini hatchbacks, spacious sedans, and SUV cabs for family travels.", icon: <Car className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10" },
    { title: "Premium VIP", desc: "Luxury electric sedans, Audi/BMW limousines, and Tesla EV SUVs.", icon: <Zap className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10" },
    { title: "Parcel Courier", desc: "Instant documents, medium box express, and large cargo parcel delivery.", icon: <Activity className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10" },
    { title: "Food Delivery", desc: "Quick hot meal express delivery and fresh grocery store delivery.", icon: <Heart className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10" },
    { title: "Mini Truck", desc: "Tata Ace and E-loader box trucks for moving medium loads locally.", icon: <Sliders className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10" },
    { title: "Pickup Truck", desc: "Mahindra loaders and open flatbeds for towing and large equipment moving.", icon: <Navigation className="w-6 h-6 text-[#fbbf24] rotate-45" />, bg: "bg-[#fbbf24]/10" },
    { title: "Tempo", desc: "Force cargo tempos and fully closed shipping containers for heavy shifting.", icon: <Users className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#030712] py-24 px-6 md:px-12 flex flex-col items-center relative overflow-hidden text-left">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#fbbf24]/5 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#6366f1]/5 blur-[120px] pointer-events-none -z-10" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-20" />

      <div className="max-w-4xl text-center flex flex-col gap-5 mb-16 relative z-10 mx-auto">
        <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#fbbf24] w-fit mx-auto shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          Core Services
        </span>
        <h1 className="text-3xl md:text-5.5xl font-black text-white tracking-tight leading-tight">
          Explore Our Mobility Fleet
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-semibold">
          From electric micro-mobility to large container logistics, select from our tailored fleet options.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full relative z-10">
        {services.map((feat, idx) => (
          <div
            key={idx}
            className="glass-card p-8 rounded-[32px] border border-white/5 flex flex-col gap-4 text-left bg-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-[#fbbf24]/20 shadow-md"
          >
            <div className={`p-4 rounded-2xl ${feat.bg} w-fit`}>
              {feat.icon}
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{feat.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
