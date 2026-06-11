"use client";

import React from "react";
import { Compass, Users, Heart, Target, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-20 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16">
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary uppercase w-fit mx-auto">
          Company Vision
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          Our Mission: Accelerate Transportation
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          We are building the open platform for next-generation cargo dispatching, automated ride sharing, and drone logistics ecosystems.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
        {[
          {
            title: "Open Technology",
            desc: "Built on high-fidelity open APIs, real-time databases, and responsive Canvas rendering to keep dispatch latency near-zero.",
            icon: <Compass className="w-6 h-6 text-primary" />
          },
          {
            title: "Driver-First Focus",
            desc: "Ensuring fair earnings, detailed dashboard checklists, strict document verification, and direct digital payouts.",
            icon: <Users className="w-6 h-6 text-yellow-500" />
          },
          {
            title: "SLA Commitment",
            desc: "99.9% logistics uptime guarantees with continuous fallback routing models and instant automatic dispatch queues.",
            icon: <Target className="w-6 h-6 text-emerald-500" />
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col gap-4 text-left"
          >
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 w-fit">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-white">{item.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
