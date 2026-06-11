"use client";

import React from "react";
import { Sparkles, Map, Navigation, Shield, DollarSign, Database, Brain, Globe, Cpu } from "lucide-react";

export default function FeaturesPage() {
  const coreFeatures = [
    {
      title: "Real-time Vehicle Tracking",
      desc: "Live sub-second position updates utilizing Firebase Realtime Database. Tracks coordinates and renders moving vectors on canvas.",
      icon: <Navigation className="w-6 h-6 text-primary rotate-45" />
    },
    {
      title: "AI Route Optimization",
      desc: "Computes optimal navigation paths between coordinates. Built with custom simulation routing layers for instant ETA updates.",
      icon: <Brain className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Multi-Role Core Architecture",
      desc: "Switch instantly between Customer, Driver, Admin, and Corporate dashboard modules. Handshake workflows are synchronized in real time.",
      icon: <Cpu className="w-6 h-6 text-yellow-500" />
    },
    {
      title: "Dynamic Surge Pricing",
      desc: "Control fares dynamically based on vehicle type parameters (Bike, Car, Truck), distance, and base rate configuration in the Admin controls.",
      icon: <DollarSign className="w-6 h-6 text-emerald-500" />
    },
    {
      title: "Corporate Cargo & Billing",
      desc: "Tailored dashboard for businesses to upload multiple orders simultaneously, manage company balances, and access monthly invoices.",
      icon: <Database className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Strict Identity Document Uploads",
      desc: "Security audit trails for drivers. Upload credentials and verify drivers instantly through the admin control suite.",
      icon: <Shield className="w-6 h-6 text-red-500" />
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-20 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16">
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary uppercase w-fit mx-auto">
          Technical Capabilities
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          Designed for Scale. Built for Speed.
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          Explore the premium architecture that drives the RIDEX mobility and logistics engine. We use a lightning-fast client interface backed by Firebase Realtime sync.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {coreFeatures.map((feat, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-4 text-left"
          >
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 w-fit">
              {feat.icon}
            </div>
            <h3 className="text-lg font-bold text-white">{feat.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
