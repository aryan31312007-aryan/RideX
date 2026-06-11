"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navigation, Bike, Car, Truck, Zap, Shield, MapPin, ArrowRight, Star, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [vehicleType, setVehicleType] = useState<"bike" | "car" | "truck">("car");
  const [distance, setDistance] = useState<number>(12); // km

  // Dynamic pricing estimator math
  const rates = {
    bike: { base: 30, perKm: 8, timeMin: 1.5, text: "Best for quick single rides & small parcels" },
    car: { base: 80, perKm: 15, timeMin: 3.0, text: "Spacious sedans with premium drivers" },
    truck: { base: 150, perKm: 25, timeMin: 5.0, text: "For cargo, furniture, and bulk logistics" }
  };

  const calculateEstimate = () => {
    const selected = rates[vehicleType];
    const durationMin = distance * 2.5; // assumption: 2.5 mins per km
    return selected.base + (distance * selected.perKm) + (durationMin * selected.timeMin);
  };

  const portalGateways = [
    {
      title: "Passenger & Delivery Client",
      desc: "Book bike taxis, hire premium sedans, or send instant parcels with real-time tracking.",
      link: "/dashboard",
      icon: <Car className="w-6 h-6 text-primary" />,
      color: "border-primary/20 hover:border-primary/50"
    },
    {
      title: "Driver Network Portal",
      desc: "Go online, accept logistics dispatch, view earnings checklist, and check verified status.",
      link: "/driver",
      icon: <Navigation className="w-6 h-6 text-yellow-500" />,
      color: "border-yellow-500/20 hover:border-yellow-500/50"
    },
    {
      title: "Corporate Logistics",
      desc: "Manage company accounts, batch upload bulk orders, access monthly invoicing.",
      link: "/business",
      icon: <Truck className="w-6 h-6 text-green-500" />,
      color: "border-green-500/20 hover:border-green-500/50"
    },
    {
      title: "Admin Dispatch Command",
      desc: "Live map dispatching, driver verification dashboard, adjust dynamic pricing rates.",
      link: "/admin",
      icon: <Zap className="w-6 h-6 text-red-500" />,
      color: "border-red-500/20 hover:border-red-500/50"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg relative overflow-hidden flex flex-col items-center">
      {/* Decorative radial gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit">
            <SparklesIcon className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary tracking-wider uppercase">
              AI-Powered Logistics Engine
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen Mobility & <br />
            <span className="text-gradient">Instant Delivery</span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">
            RIDEX is a unified startup transportation platform. Request instant bike taxis, schedule premium executive cabs, or dispatch package couriers—synchronized in real time.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              href="/auth/register"
              className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/30"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/features"
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all"
            >
              Learn Architecture
            </Link>
          </div>
        </div>

        {/* Dynamic Calculator Overlay */}
        <div className="lg:col-span-5 w-full">
          <div className="w-full glass-card p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Dynamic Fare Estimator
            </h3>

            {/* Vehicle selection */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { type: "bike", name: "Bike Taxi", icon: <Bike className="w-4 h-4" /> },
                { type: "car", name: "Cab / Ride", icon: <Car className="w-4 h-4" /> },
                { type: "truck", name: "Delivery", icon: <Truck className="w-4 h-4" /> }
              ].map((veh) => (
                <button
                  key={veh.type}
                  onClick={() => setVehicleType(veh.type as any)}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all cursor-pointer ${
                    vehicleType === veh.type
                      ? "bg-primary/20 border-primary text-white"
                      : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {veh.icon}
                  <span className="text-xs font-semibold mt-2">{veh.name}</span>
                </button>
              ))}
            </div>

            {/* Rate helper */}
            <p className="text-xs text-gray-400 mb-6 bg-white/5 p-3 rounded-lg border border-white/5">
              {rates[vehicleType].text}
            </p>

            {/* Distance slider */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                <span>ESTIMATED DISTANCE</span>
                <span className="text-primary font-bold">{distance} KM</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <hr className="border-white/5 mb-6" />

            {/* Fare Summary */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">ESTIMATED FARE</p>
                <p className="text-3xl font-extrabold text-white">
                  ₹{calculateEstimate().toFixed(2)}
                </p>
              </div>
              <Link
                href="/dashboard/create"
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gateway Portals Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2">
          Unified Platform Access
        </h2>
        <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto mb-12">
          RIDEX connects customers, independent drivers, admin dispatches, and corporate logistics under one centralized panel.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portalGateways.map((gate) => (
            <Link
              key={gate.title}
              href={gate.link}
              className={`w-full glass-card p-6 rounded-2xl border text-left flex flex-col gap-4 transition-all cursor-pointer ${gate.color}`}
            >
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 w-fit">
                {gate.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{gate.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed flex-grow">{gate.desc}</p>
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold mt-2 hover:underline">
                Explore Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full border-t border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { metric: "1.2M+", label: "Deliveries Dispatched" },
            { metric: "24/7", label: "Automated Routing" },
            { metric: "4.8★", label: "Fleet Customer Rating" },
            { metric: "99.9%", label: "Live SLA Compliance" }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-3xl md:text-5xl font-extrabold text-white text-gradient">{stat.metric}</span>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Sparkle helper icon
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.071 4.929L18.5 8.5L17.929 4.929L14.357 4.357L17.929 3.786L18.5 0.214L19.071 3.786L22.643 4.357L19.071 4.929Z"
      />
    </svg>
  );
}
