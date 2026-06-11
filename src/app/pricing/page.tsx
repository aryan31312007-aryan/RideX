"use client";

import React from "react";
import Link from "next/link";
import { Bike, Car, Truck, Check, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const tiers = [
    {
      title: "Bike Taxi / Moto",
      icon: <Bike className="w-8 h-8 text-primary" />,
      base: "₹30",
      perKm: "₹8 / km",
      time: "₹1.5 / min",
      badge: "Fastest Choice",
      features: [
        "Single passenger ride",
        "Small document courier",
        "Traffic filtering speed",
        "Live tracking link share"
      ]
    },
    {
      title: "Premium Sedan / Cab",
      icon: <Car className="w-8 h-8 text-yellow-500" />,
      base: "₹80",
      perKm: "₹15 / km",
      time: "₹3.0 / min",
      badge: "Most Popular",
      features: [
        "Up to 4 passengers",
        "Air-conditioned sedans",
        "Verified elite drivers",
        "Medium parcel support"
      ],
      popular: true
    },
    {
      title: "Cargo Truck / Delivery",
      icon: <Truck className="w-8 h-8 text-green-500" />,
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
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-20 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16">
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary uppercase w-fit mx-auto">
          Fares & Packages
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          Transparent, Simple Pricing.
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          No hidden fees or locked contracts. We calculate fares based on the target vehicle tier rates, direct distance, and estimated duration.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-16">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`glass-card p-8 rounded-3xl border flex flex-col gap-6 text-left relative ${
              tier.popular ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-white/5"
            }`}
          >
            {tier.popular && (
              <span className="absolute top-4 right-6 text-[10px] font-bold text-white bg-primary px-3 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </span>
            )}
            <div className="flex items-center gap-4">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                {tier.icon}
              </div>
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{tier.badge}</span>
                <h3 className="text-xl font-bold text-white">{tier.title}</h3>
              </div>
            </div>

            <div className="border-b border-white/5 pb-4 mt-2">
              <p className="text-gray-400 text-xs font-semibold">BASE FARE</p>
              <p className="text-4xl font-extrabold text-white mt-1">{tier.base}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-500 font-semibold uppercase">Per KM</p>
                <p className="text-white font-bold text-sm mt-0.5">{tier.perKm}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold uppercase">Per Minute</p>
                <p className="text-white font-bold text-sm mt-0.5">{tier.time}</p>
              </div>
            </div>

            <ul className="flex flex-col gap-3 my-4">
              {tier.features.map((feat, fidx) => (
                <li key={fidx} className="flex items-center gap-2.5 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard/create"
              className={`w-full py-3 rounded-xl text-center text-xs font-semibold transition-all mt-auto ${
                tier.popular
                  ? "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20"
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
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
