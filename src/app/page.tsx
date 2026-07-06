"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bike, Car, Navigation, Zap, Shield, MapPin, ArrowRight, Star, Clock,
  Heart, ShieldAlert, CheckCircle, ChevronRight, Sliders, Award, DollarSign,
  Smartphone, Activity, Compass, Users, CheckCircle2, Map
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebase } from "@/context/FirebaseContext";
import CinematicCityCanvas from "@/components/layout/CinematicCityCanvas";

export default function LandingPage() {
  const { user, profile } = useFirebase();

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

  // Sub-services configurations for all categories
  const subServices = {
    bike: [
      { id: "scooty", name: "Electric Scooty", base: 15, perKm: 5 },
      { id: "normal_bike", name: "Normal Commuter Bike", base: 20, perKm: 6.5 },
      { id: "super_bike", name: "Super Bike (Sport)", base: 45, perKm: 12 },
      { id: "heavy_bike", name: "Heavy Cruiser Bike", base: 35, perKm: 9.5 }
    ],
    auto: [
      { id: "e_auto", name: "Electric Auto", base: 30, perKm: 8 },
      { id: "cng_auto", name: "CNG Auto", base: 35, perKm: 9 },
      { id: "shared_auto", name: "Shared Route Auto", base: 15, perKm: 4 }
    ],
    cab: [
      { id: "mini_cab", name: "Mini Hatchback Cab", base: 55, perKm: 12 },
      { id: "sedan_cab", name: "Sedan Comfort Cab", base: 75, perKm: 15 },
      { id: "suv_cab", name: "Spacious SUV Cab", base: 110, perKm: 20 }
    ],
    premium: [
      { id: "premium_sedan", name: "Premium Sedan (Audi/BMW)", base: 150, perKm: 28 },
      { id: "tesla_ev", name: "Tesla Prime EV SUV", base: 130, perKm: 24 },
      { id: "luxury_limo", name: "Luxury Limousine Chauffeur", base: 300, perKm: 50 }
    ],
    parcel: [
      { id: "doc_courier", name: "Instant Document Courier", base: 40, perKm: 8 },
      { id: "box_express", name: "Medium Box Express", base: 60, perKm: 12 },
      { id: "heavy_cargo", name: "Heavy Box Cargo", base: 120, perKm: 18 }
    ],
    food: [
      { id: "meal_delivery", name: "Express Meal Delivery", base: 25, perKm: 5 },
      { id: "grocery_express", name: "Fresh Grocery Delivery", base: 30, perKm: 6 },
      { id: "store_pickup", name: "Store Package Pickup", base: 35, perKm: 7 }
    ],
    mini_truck: [
      { id: "tata_ace", name: "Tata Ace (Mini Truck)", base: 180, perKm: 22 },
      { id: "e_loader", name: "E-Loader Box Truck", base: 150, perKm: 18 }
    ],
    pickup: [
      { id: "mahindra_pickup", name: "Mahindra Pickup Truck", base: 220, perKm: 25 },
      { id: "flatbed", name: "Open Flatbed Tow Truck", base: 350, perKm: 35 }
    ],
    tempo: [
      { id: "force_tempo", name: "Force Tempo (Large Load)", base: 280, perKm: 30 },
      { id: "box_container", name: "Closed Box Container", base: 400, perKm: 40 }
    ]
  };

  // State management for booking card
  const [pickup, setPickup] = useState("Connaught Place, New Delhi");
  const [drop, setDrop] = useState("Indira Gandhi Airport, Delhi");
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof subServices>("cab");
  const [selectedSubService, setSelectedSubService] = useState<string>("mini_cab");
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"ride" | "delivery" | "transport">("ride");

  const changeCategory = (cat: keyof typeof subServices) => {
    setSelectedCategory(cat);
    const defaults: Record<string, string> = {
      bike: "scooty",
      auto: "e_auto",
      cab: "mini_cab",
      premium: "premium_sedan",
      parcel: "doc_courier",
      food: "meal_delivery",
      mini_truck: "tata_ace",
      pickup: "mahindra_pickup",
      tempo: "force_tempo"
    };
    setSelectedSubService(defaults[cat]);
  };

  // State for Live Map simulation inside smartphone mock
  const [simProgress, setSimProgress] = useState(0.35);
  const [simPlaying, setSimPlaying] = useState(true);
  const simInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (simPlaying) {
      simInterval.current = setInterval(() => {
        setSimProgress((p) => {
          if (p >= 0.98) return 0.05;
          return p + 0.005;
        });
      }, 80);
    } else {
      if (simInterval.current) clearInterval(simInterval.current);
    }
    return () => {
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, [simPlaying]);

  const getCoordinatesAlongRoute = (t: number) => {
    const p0 = { x: 40, y: 240 };
    const p1 = { x: 120, y: 40 };
    const p2 = { x: 200, y: 160 };

    const mt = 1 - t;
    const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
    const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;

    return { x, y };
  };

  const currentVehiclePos = getCoordinatesAlongRoute(simProgress);

  const getFareValue = () => {
    const list = subServices[selectedCategory] || [];
    const item = list.find((s) => s.id === selectedSubService) || list[0] || { base: 50, perKm: 10 };
    return item.base + (14 * item.perKm) + 15;
  };

  const handleBookRide = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingLoading(true);
    setTimeout(() => {
      setIsBookingLoading(false);
      setShowBookingModal(true);
    }, 1200);
  };

  const [sosStatus, setSosStatus] = useState<"idle" | "triggered">("idle");
  const handleSOS = () => {
    setSosStatus("triggered");
    setTimeout(() => setSosStatus("idle"), 3000);
    window.dispatchEvent(new CustomEvent("open-sos-modal"));
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen relative font-sans overflow-x-hidden">

      {/* ================= HERO SECTION (LIGHT REFERENCE) ================= */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden py-16 px-6 md:px-12 w-full bg-gradient-to-b from-white to-[#f8fafc] border-b border-slate-100">
        {/* Ambient background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full relative z-10">

          {/* Left Column: Heading, Subheading, Badges */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-20">
            <h1 className="text-4xl md:text-[56px] font-black tracking-tight text-slate-900 leading-[1.1]">
              Your Ride. Your City.<br />
              <span className="text-[#fbbf24]">Ridex Karo. Aage Bado.</span>
            </h1>

            <p className="text-base md:text-lg text-slate-500 max-w-xl leading-relaxed font-semibold">
              Book rides, delivery & transport in seconds.<br className="hidden sm:inline" />
              Safe, reliable & affordable – always!
            </p>

            {/* Badges row */}
            <div className="flex flex-wrap gap-3 mt-2">
              {[
                { label: "Verified Drivers", icon: <Shield className="w-4.5 h-4.5 text-[#fbbf24] fill-[#fbbf24]/10" /> },
                { label: "Live Tracking", icon: <Navigation className="w-4.5 h-4.5 text-[#fbbf24] rotate-45" /> },
                { label: "Transparent Pricing", icon: <DollarSign className="w-4.5 h-4.5 text-[#fbbf24]" /> },
                { label: "24x7 Support", icon: <Clock className="w-4.5 h-4.5 text-[#fbbf24]" /> }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/50 shadow-sm text-xs font-bold text-slate-700">
                  {badge.icon}
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Reference Booking Card */}
          <div className="lg:col-span-5 w-full relative z-20">
            <div className="w-full max-w-md ml-auto bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-xl flex flex-col gap-6 text-left">

              {/* Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                {[
                  { id: "ride", label: "Ride", icon: <Car className="w-4 h-4" /> },
                  { id: "delivery", label: "Delivery", icon: <Activity className="w-4 h-4" /> },
                  { id: "transport", label: "Transport", icon: <Sliders className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      if (tab.id === "ride") changeCategory("cab");
                      else if (tab.id === "delivery") changeCategory("parcel");
                      else if (tab.id === "transport") changeCategory("mini_truck");
                    }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id
                        ? "bg-white text-slate-900 shadow-sm border border-slate-100"
                        : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sub-Category selection row */}
              {activeTab === "ride" && (
                <div className="flex gap-2 justify-between">
                  {[
                    { id: "cab", label: "Car", icon: <Car className="w-3.5 h-3.5" /> },
                    { id: "bike", label: "Bike", icon: <Bike className="w-3.5 h-3.5" /> },
                    { id: "auto", label: "Auto", icon: <Compass className="w-3.5 h-3.5" /> },
                    { id: "premium", label: "Premium", icon: <Zap className="w-3.5 h-3.5" /> }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => changeCategory(cat.id as any)}
                      className={`flex-1 py-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${selectedCategory === cat.id
                          ? "bg-amber-50 border-[#fbbf24] text-amber-700 font-extrabold"
                          : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "delivery" && (
                <div className="flex gap-2">
                  {[
                    { id: "parcel", label: "Parcel Courier", icon: <Activity className="w-3.5 h-3.5" /> },
                    { id: "food", label: "Food Delivery", icon: <Heart className="w-3.5 h-3.5" /> }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => changeCategory(cat.id as any)}
                      className={`flex-1 py-2.5 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedCategory === cat.id
                          ? "bg-amber-50 border-[#fbbf24] text-amber-700 font-extrabold"
                          : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "transport" && (
                <div className="flex gap-2">
                  {[
                    { id: "mini_truck", label: "Mini Truck", icon: <Sliders className="w-3.5 h-3.5" /> },
                    { id: "pickup", label: "Pickup Loader", icon: <Navigation className="w-3.5 h-3.5 rotate-45" /> },
                    { id: "tempo", label: "Large Tempo", icon: <Users className="w-3.5 h-3.5" /> }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => changeCategory(cat.id as any)}
                      className={`flex-1 py-2.5 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${selectedCategory === cat.id
                          ? "bg-amber-50 border-[#fbbf24] text-amber-700 font-extrabold"
                          : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleBookRide} className="flex flex-col gap-4">
                {/* Pickup Location */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pickup Location</label>
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute left-3 top-4 border-2 border-white" />
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#fbbf24] text-xs text-slate-800 transition-all font-semibold"
                      placeholder="Enter pickup location"
                      required
                    />
                    <button type="button" className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                      <Navigation className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                </div>

                {/* Drop Location */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Drop Location</label>
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute left-3 top-4 border-2 border-white" />
                    <input
                      type="text"
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                      className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#fbbf24] text-xs text-slate-800 transition-all font-semibold"
                      placeholder="Enter drop location"
                      required
                    />
                    <button type="button" className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-lg">
                      +
                    </button>
                  </div>
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Vehicle Type</label>
                    <select
                      value={selectedSubService}
                      onChange={(e) => setSelectedSubService(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none text-xs text-slate-800 font-bold"
                    >
                      {(subServices[selectedCategory] || []).map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Payment</label>
                    <select
                      className="w-full px-3 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none text-xs text-slate-800 font-bold"
                    >
                      <option>RIDEX Wallet</option>
                      <option>Credit / Debit Card</option>
                      <option>UPI / Net Banking</option>
                      <option>Cash</option>
                    </select>
                  </div>
                </div>

                {/* Estimate Fare */}
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Estimated Fare</span>
                    <span className="text-lg font-black text-slate-800">₹{getFareValue().toFixed(2)}</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-full">
                    ✓ Fares Locked
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isBookingLoading}
                  className="w-full py-3.5 rounded-xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-900 font-extrabold text-xs flex items-center justify-between px-5 transition-all shadow-md shadow-[#fbbf24]/20 cursor-pointer disabled:opacity-85"
                >
                  {isBookingLoading ? (
                    <span>Allocating Ride...</span>
                  ) : (
                    <>
                      <span>Book Ride</span>
                      <ArrowRight className="w-4 h-4 text-slate-900" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Center overlay background car illustration (scaled up to look good and be easily visible) */}
        <div className="absolute inset-x-0 bottom-0 top-[20%] z-0 flex justify-center items-center pointer-events-none opacity-90 -translate-x-[5%]">
          <img
            src="/ridex_hero_car.png"
            alt="RIDEX Premium Sedan"
            className="w-full max-w-5xl object-contain object-bottom translate-y-[10%]"
          />
        </div>
      </section>

      {/* ================= CHOOSE YOUR SERVICE GRID ================= */}
      <section id="categories" className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-left">Choose Your Service</h2>
          <Link href="/services" className="text-xs font-bold text-[#fbbf24] hover:text-[#f59e0b] flex items-center gap-0.5">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Bike", desc: "Fast & Affordable", icon: <Bike className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50/50", tab: "ride", type: "bike" },
            { title: "Auto", desc: "Quick & Easy", icon: <Compass className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50/50", tab: "ride", type: "auto" },
            { title: "Cab", desc: "Comfort Rides", icon: <Car className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50/50", tab: "ride", type: "cab" },
            { title: "Premium", desc: "Luxury Rides", icon: <Zap className="w-6 h-6 text-amber-600 animate-pulse" />, bg: "bg-amber-50/50", tab: "ride", type: "premium" },
            { title: "Parcel", desc: "Send Anything", icon: <Activity className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50/50", tab: "delivery", type: "parcel" },
            { title: "Food", desc: "Food Delivery", icon: <Heart className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50/50", tab: "delivery", type: "food" },
            { title: "Mini Truck", desc: "For Small Load", icon: <Sliders className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50/50", tab: "transport", type: "mini_truck" },
            { title: "Pickup", desc: "Move Anything", icon: <Navigation className="w-6 h-6 text-amber-600 rotate-45" />, bg: "bg-amber-50/50", tab: "transport", type: "pickup" },
            { title: "Tempo", desc: "For Large Load", icon: <Users className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50/50", tab: "transport", type: "tempo" },
          ].map((service, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveTab(service.tab as any);
                changeCategory(service.type as any);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between hover:shadow-md hover:border-[#fbbf24]/30 transition-all group cursor-pointer text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${service.bg} transition-transform group-hover:scale-105 duration-300`}>
                  {service.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">{service.title}</h4>
                  <p className="text-xs text-slate-450 font-medium mt-0.5">{service.desc}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#fbbf24] group-hover:text-slate-900 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DYNAMIC DISPATCH SIMULATION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full border-t border-slate-100 relative">
        <div className="flex flex-col gap-3 mb-10 text-left">
          <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">Experience the AI Network</span>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Autonomous Dispatch Simulator</h2>
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed font-semibold">
            See the RideX neural dispatcher at work. Vikram Solanki's Tesla and cargo logistics vehicles traverse Delhi NCR green expressways with biometrics tracking, latency logs, and automated corridor optimization.
          </p>
        </div>

        <div className="w-full h-[550px] rounded-[32px] overflow-hidden border border-slate-200/60 relative shadow-xl bg-slate-900">
          <CinematicCityCanvas />
        </div>
      </section>

      {/* ================= SAFETY YOU CAN TRUST ================= */}
      <section id="safety" className="max-w-7xl mx-auto px-6 py-20 w-full border-t border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-left">Safety You Can Trust</h2>
          <Link href="/safety" className="text-xs font-bold text-[#fbbf24] hover:text-[#f59e0b] flex items-center gap-0.5">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Circular icons row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-12">
          {[
            { label: "SOS Emergency", name: "SOS", icon: <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />, bg: "bg-red-50" },
            { label: "Live Location", name: "Live Location", icon: <MapPin className="w-6 h-6 text-emerald-500" />, bg: "bg-emerald-50" },
            { label: "Driver Verification", name: "Driver Verification", icon: <Users className="w-6 h-6 text-blue-500" />, bg: "bg-blue-50" },
            { label: "Ride Insurance", name: "Ride Insurance", icon: <Shield className="w-6 h-6 text-indigo-500" />, bg: "bg-indigo-50" },
            { label: "Women Safety Mode", name: "Women Safety Mode", icon: <Heart className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center gap-3 cursor-pointer group"
              onClick={item.name === "SOS" ? handleSOS : undefined}
            >
              <div className={`w-14 h-14 rounded-full ${item.bg} flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-all shadow-sm`}>
                {item.icon}
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{item.name}</span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Platform Card */}
        <div className="w-full bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative shadow-sm">
          {/* Image on the left (where RIDEX is printed on the car - scaled up for visibility) */}
          <div className="md:col-span-5 flex justify-center relative">
            <img
              src="/ridex_safety_banner.png"
              alt="Safety Platform Banner"
              className="w-full max-w-[420px] md:max-w-full object-contain transition-transform duration-300 hover:scale-[1.03]"
            />
          </div>
          {/* Text content on the right */}
          <div className="md:col-span-7 flex flex-col gap-4 text-left relative z-10">
            <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">RIDEX SAFETY</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
              India's Safer Rides Platform
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-lg font-semibold">
              Your safety is our highest priority. We use verified drivers, live tracking algorithms, and instant emergency alerts to secure every single trip.
            </p>
            <button
              type="button"
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold w-fit mt-2 transition-all cursor-pointer shadow-sm"
            >
              Know More
            </button>
          </div>
        </div>
      </section>

      {/* ================= APP PROMOTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-slate-100">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <h3 className="text-3xl md:text-4.5xl font-black text-slate-800 tracking-tight leading-tight">
            Ridex App is better <br />
            on the go!
          </h3>

          <ul className="flex flex-col gap-3">
            {[
              "Faster Bookings",
              "Exclusive Offers",
              "Real-time Tracking",
              "Easy Payments"
            ].map((bullet, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                {bullet}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 mt-2">
            <button className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl transition-all cursor-pointer shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 466 511.98">
                <g fillRule="nonzero">
                  <path fill="#EA4335" d="M199.9 237.8 1.4 470.17c7.22 24.57 30.16 41.81 55.8 41.81 11.16 0 20.93-2.79 29.3-8.37l244.16-139.46L199.9 237.8z" />
                  <path fill="#FBBC04" d="m433.91 205.1-104.65-60-111.61 110.22 113.01 108.83 104.64-58.6c18.14-9.77 30.7-29.3 30.7-50.23-1.4-20.93-13.95-40.46-32.09-50.22z" />
                  <path fill="#34A853" d="M199.42 273.45 329.27 145.1 87.9 8.37C79.53 2.79 68.36 0 57.2 0 30.7 0 6.98 18.14 1.4 41.86l198.02 231.59z" />
                  <path fill="#4285F4" d="M1.39 41.86C0 46.04 0 51.63 0 57.2v397.64c0 5.57 0 9.76 1.4 15.34l216.27-214.86L1.39 41.86z" />
                </g>
              </svg>
              <div className="text-left leading-none">
                <span className="text-[8px] block text-slate-400 uppercase font-mono">Get it on</span>
                <span className="text-xs font-bold block mt-1">Google Play</span>
              </div>
            </button>

            <button className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl transition-all cursor-pointer shadow-md">
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.94-1.39" />
              </svg>
              <div className="text-left leading-none">
                <span className="text-[8px] block text-slate-400 uppercase font-mono">Download on the</span>
                <span className="text-xs font-bold block mt-1">App Store</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Smartphone mockup rendering Live Tracking Map */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="w-[300px] h-[580px] bg-slate-900 rounded-[48px] p-3 shadow-2xl relative border-[5px] border-slate-800">
            {/* Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-slate-800 rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
            </div>

            {/* Simulated Map Screen */}
            <div className="w-full h-full bg-[#fafaff] rounded-[38px] overflow-hidden relative border border-slate-950/20 flex flex-col justify-between pt-8">

              {/* Telemetry status bar */}
              <div className="p-3 bg-white border-b border-slate-100 flex justify-between items-center z-10 relative">
                <div className="text-left">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#fbbf24] block">Tracking</span>
                  <span className="text-[10px] font-bold text-slate-800">Trip RIDEX-2026</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-slate-800 flex items-center gap-0.5">
                    <Clock className="w-3 h-3 text-[#fbbf24] animate-pulse" /> 3.5 Mins
                  </span>
                </div>
              </div>

              {/* Live SVG Map */}
              <div className="flex-1 bg-slate-50 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 240 320">
                  <path d="M 0,40 L 240,40 M 0,120 L 240,120 M 0,200 L 240,200 M 0,280 L 240,280 M 60,0 L 60,320 M 140,0 L 140,320 M 200,0 L 200,320" stroke="#e2e8f0" strokeWidth="1" />

                  {/* Route path */}
                  <path d="M 40,240 Q 120,40 200,160" fill="transparent" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 40,240 Q 120,40 200,160" fill="transparent" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 7" />

                  {/* Pickup & Drop markers */}
                  <circle cx="40" cy="240" r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="200" cy="160" r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />

                  {/* Car dot moving */}
                  <g transform={`translate(${currentVehiclePos.x}, ${currentVehiclePos.y})`}>
                    <circle cx="0" cy="0" r="7" fill="#fbbf24" stroke="#fff" strokeWidth="1.5" className="shadow-md" />
                    <circle cx="0" cy="0" r="12" fill="transparent" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1" className="animate-ping" />
                  </g>
                </svg>

                {/* Map telemetry overlay control */}
                <button
                  type="button"
                  onClick={() => setSimPlaying(!simPlaying)}
                  className="absolute bottom-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-100 text-[9px] font-bold text-slate-700 shadow-sm flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {simPlaying ? "PAUSE SIM" : "PLAY SIM"}
                </button>
              </div>

              {/* Bottom Sheet info inside phone */}
              <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                    VS
                  </div>
                  <div className="flex-grow min-w-0 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-800 truncate">Vikram Solanki</span>
                      <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded">★ 4.9</span>
                    </div>
                    <span className="text-[8px] text-slate-400 block">Toyota Camry · DL-1CA-8832</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS & FEATURES ROW ================= */}
      <section className="w-full bg-white border-y border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: "1M+", label: "Happy Users", icon: <Users className="w-5 h-5 text-[#fbbf24] mx-auto mb-1" /> },
              { stat: "50K+", label: "Verified Drivers", icon: <CheckCircle className="w-5 h-5 text-[#fbbf24] mx-auto mb-1" /> },
              { stat: "10M+", label: "Rides Completed", icon: <Navigation className="w-5 h-5 text-[#fbbf24] rotate-45 mx-auto mb-1" /> },
              { stat: "200+", label: "Cities Covered", icon: <Compass className="w-5 h-5 text-[#fbbf24] mx-auto mb-1" /> },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                {stat.icon}
                <span className="text-2xl font-black text-slate-800">{stat.stat}</span>
                <span className="text-xs text-slate-450 font-bold">{stat.label}</span>
              </div>
            ))}
          </div>

          <hr className="border-slate-100" />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { title: "No Hidden Charges", desc: "What you see is what you pay", icon: <DollarSign className="w-5 h-5 text-[#fbbf24]" /> },
              { title: "Clean & Safe Rides", desc: "Well maintained vehicles", icon: <Shield className="w-5 h-5 text-[#fbbf24]" /> },
              { title: "Top Rated Drivers", desc: "Trained & professional", icon: <Star className="w-5 h-5 text-[#fbbf24] fill-[#fbbf24]" /> },
              { title: "24x7 Customer Support", desc: "We're always here to help", icon: <Clock className="w-5 h-5 text-[#fbbf24]" /> },
            ].map((prop, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 h-fit">
                  {prop.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">{prop.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REVIEWS & REFERRAL DUAL GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: What Our Customers Say */}
        <div className="lg:col-span-8 flex flex-col gap-6 text-left">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">What Our Customers Say</h2>
            <Link href="/reviews" className="text-xs font-bold text-[#fbbf24] hover:text-[#f59e0b] flex items-center gap-0.5">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Great Service", review: "Very safe rides and polite drivers.", stars: 5 },
              { name: "On Time Always", review: "Ridex is my go-to app for daily travel.", stars: 5 },
              { name: "Very Affordable", review: "Best prices and no hidden charges.", stars: 5 },
            ].map((rev, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative text-left"
              >
                <div>
                  <div className="flex items-center gap-0.5 text-[#fbbf24] mb-3">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">{rev.name}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-semibold">{rev.review}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Refer & Earn card */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          {/* gift box decorative image */}
          <div className="absolute right-3 bottom-3 w-32 h-32 pointer-events-none z-0">
            <img
              src="/ridex_refer_gift.png"
              alt="Gift box with coins"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-2 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 w-fit">Referral Reward</span>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight mt-1">
              Refer & Earn
            </h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-[200px]">
              Refer your friends & earn RIDEX Cash for your next trip!
            </p>
          </div>

          <div className="relative z-10 mt-6 text-left">
            <button
              type="button"
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3.5 rounded-xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-900 text-xs font-bold transition-all shadow-md shadow-[#fbbf24]/10 cursor-pointer animate-pulse"
            >
              Refer Now
            </button>
          </div>
        </div>
      </section>

      {/* Booking confirmation modal popup */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            {/* Card modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl relative z-10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Action Initiated!</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Your request has been successfully dispatched. Enjoy the new RIDEX mobility platform!
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 py-3 rounded-xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-900 text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-[#fbbf24]/10"
                >
                  Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SOS Trigger popup */}
      <AnimatePresence>
        {sosStatus === "triggered" && (
          <div className="fixed top-6 right-6 z-50">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="bg-red-500 border border-red-650 text-white font-bold text-xs px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <ShieldAlert className="w-5 h-5 text-white animate-bounce" />
              <div className="text-left">
                <span className="font-extrabold block">SOS ALERT TRIGGERED</span>
                <span className="text-[10px] text-red-100 block font-normal mt-0.5">Contacting emergency dispatch services...</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
