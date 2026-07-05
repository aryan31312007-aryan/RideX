"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Bike, Car, Navigation, Zap, Shield, MapPin, ArrowRight, Star, Clock, 
  Heart, ShieldAlert, CheckCircle, ChevronRight, Sliders, Award, DollarSign, 
  Smartphone, Activity, Compass, Users, Map, Cpu, CheckCircle2, Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebase } from "@/context/FirebaseContext";
import CinematicCityCanvas from "@/components/layout/CinematicCityCanvas";

export default function LandingPage() {
  const { user, profile } = useFirebase();

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
  const [activeTab, setActiveTab] = useState<"ride" | "delivery" | "transport" | "drive">("ride");

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
    const p0 = { x: 30, y: 150 };
    const p1 = { x: 90, y: 50 };
    const p2 = { x: 190, y: 250 };
    const p3 = { x: 260, y: 90 };

    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    const x = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
    const y = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;

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

  // State for SOS Alert simulation
  const [sosStatus, setSosStatus] = useState<"idle" | "triggered">("idle");
  const handleSOS = () => {
    setSosStatus("triggered");
    setTimeout(() => setSosStatus("idle"), 3000);
  };

  return (
    <div className="bg-[#030712] text-gray-100 min-h-screen relative font-sans overflow-x-hidden">
      
      {/* ================= HERO SECTION (CINEMATIC) ================= */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden py-20 px-6 md:px-12 w-full border-b border-white/5">
        {/* Glow ambient background rings */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#fbbf24]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] rounded-full bg-[#6366f1]/5 blur-[100px] pointer-events-none" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10">
          
          {/* Left Column: Premium Pitch */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-20">
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#fbbf24] w-fit shadow-md">
              <Zap className="w-3.5 h-3.5 fill-[#fbbf24]/20 animate-pulse" />
              Autonomous AI-Grid Operations Live
            </span>
            
            <h1 className="text-4xl md:text-6.5xl font-black tracking-tight text-white leading-[1.1]">
              Your Ride. Your City.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] text-gradient-gold">
                Ridex Karo. Aage Bado.
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-medium">
              Experience the next-gen urban mobility. Request rides, dispatch regional cargo packages, and track vehicles across a smart autonomous corridor. Safest, fastest, and transparent.
            </p>

            {/* Badges row */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mt-4">
              {[
                { label: "Verified Drivers", icon: <Shield className="w-4 h-4 text-[#fbbf24]" /> },
                { label: "Live Telemetry", icon: <Navigation className="w-4 h-4 text-[#fbbf24] rotate-45" /> },
                { label: "No Hidden Costs", icon: <DollarSign className="w-4 h-4 text-[#fbbf24]" /> },
                { label: "24x7 Assistance", icon: <Clock className="w-4 h-4 text-[#fbbf24]" /> }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/5 shadow-inner text-xs font-bold text-gray-300">
                  {badge.icon}
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Booking / Driver Tabs Widget */}
          <div className="lg:col-span-5 w-full relative z-20">
            <div className="w-full max-w-md ml-auto glass-card p-6 md:p-8 rounded-[32px] border border-white/10 shadow-2xl flex flex-col gap-6 text-left bg-gray-900/50 backdrop-blur-xl">
              
              {/* Tab Selector */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 rounded-2xl border border-white/5">
                {[
                  { id: "ride", label: "Ride", icon: <Car className="w-4 h-4" /> },
                  { id: "delivery", label: "Deliver", icon: <Activity className="w-4 h-4" /> },
                  { id: "transport", label: "Cargo", icon: <Bike className="w-4 h-4" /> },
                  { id: "drive", label: "Drive", icon: <Users className="w-4 h-4" /> }
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
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-[#fbbf24] text-slate-950 shadow-md font-extrabold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Animate Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab !== "drive" ? (
                  <motion.div
                    key="booking-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-5"
                  >
                    {/* Sub-Category selection row */}
                    {activeTab === "ride" && (
                      <div className="flex gap-2 justify-between">
                        {[
                          { id: "cab", label: "Car", icon: <Car className="w-3.5 h-3.5" /> },
                          { id: "bike", label: "Bike", icon: <Bike className="w-3.5 h-3.5" /> },
                          { id: "auto", label: "Auto", icon: <Compass className="w-3.5 h-3.5" /> },
                          { id: "premium", label: "VIP", icon: <Zap className="w-3.5 h-3.5" /> }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => changeCategory(cat.id as any)}
                            className={`flex-1 py-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                              selectedCategory === cat.id
                                ? "bg-[#fbbf24]/10 border-[#fbbf24]/50 text-[#fbbf24]"
                                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
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
                          { id: "parcel", label: "Courier Parcel", icon: <Activity className="w-3.5 h-3.5" /> },
                          { id: "food", label: "Express Food", icon: <Heart className="w-3.5 h-3.5" /> }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => changeCategory(cat.id as any)}
                            className={`flex-1 py-2 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              selectedCategory === cat.id
                                ? "bg-[#fbbf24]/10 border-[#fbbf24]/50 text-[#fbbf24]"
                                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
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
                          { id: "tempo", label: "Tempo Shifter", icon: <Users className="w-3.5 h-3.5" /> }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => changeCategory(cat.id as any)}
                            className={`flex-1 py-2.5 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              selectedCategory === cat.id
                                ? "bg-[#fbbf24]/10 border-[#fbbf24]/50 text-[#fbbf24]"
                                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {cat.icon}
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Booking Form Inputs */}
                    <form onSubmit={handleBookRide} className="flex flex-col gap-4">
                      {/* Pickup */}
                      <div className="flex flex-col gap-1 text-left">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pickup Location</label>
                        <div className="relative">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute left-3 top-3.5 border border-white/15" />
                          <input
                            type="text"
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            className="w-full pl-9 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white focus:outline-none focus:border-[#fbbf24] transition-all font-semibold"
                            placeholder="Enter pickup address"
                            required
                          />
                        </div>
                      </div>

                      {/* Dropoff */}
                      <div className="flex flex-col gap-1 text-left">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Drop Location</label>
                        <div className="relative">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute left-3 top-3.5 border border-white/15" />
                          <input
                            type="text"
                            value={drop}
                            onChange={(e) => setDrop(e.target.value)}
                            className="w-full pl-9 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white focus:outline-none focus:border-[#fbbf24] transition-all font-semibold"
                            placeholder="Enter destination address"
                            required
                          />
                        </div>
                      </div>

                      {/* Type and Payment dropdowns */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Fleet Class</label>
                          <select
                            value={selectedSubService}
                            onChange={(e) => setSelectedSubService(e.target.value)}
                            className="w-full px-3 py-3 rounded-xl border border-white/10 bg-[#0f172a] text-xs text-white font-bold focus:outline-none focus:border-[#fbbf24]"
                          >
                            {(subServices[selectedCategory] || []).map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Payment</label>
                          <select
                            className="w-full px-3 py-3 rounded-xl border border-white/10 bg-[#0f172a] text-xs text-white font-bold focus:outline-none focus:border-[#fbbf24]"
                          >
                            <option>RIDEX Wallet</option>
                            <option>Credit / Debit</option>
                            <option>UPI instant</option>
                            <option>Cash hand</option>
                          </select>
                        </div>
                      </div>

                      {/* Fare Calculation */}
                      <div className="p-4 rounded-2xl bg-[#fbbf24]/5 border border-[#fbbf24]/10 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Surge-Locked Fare</span>
                          <span className="text-xl font-black text-[#fbbf24]">₹{getFareValue().toFixed(2)}</span>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          ✓ Rate Locked
                        </span>
                      </div>

                      {/* Book button */}
                      <button
                        type="submit"
                        disabled={isBookingLoading}
                        className="w-full py-4 rounded-xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-955 font-extrabold text-xs flex items-center justify-between px-6 transition-all shadow-lg shadow-[#fbbf24]/20 cursor-pointer disabled:opacity-80"
                      >
                        {isBookingLoading ? (
                          <span>Scanning Local Fleet vectors...</span>
                        ) : (
                          <>
                            <span>Dispatch Request</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="driver-portal-info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-5 text-left"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Drive & Earn on the AI corridor</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                        Get matched with logistics manifest orders, employee pickups, or local on-demand requests. Keep 100% of tips, get instant bank deposits, and enjoy flexible schedules.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      {[
                        "Zero commission for the first 30 days",
                        "Weekly safety bonus & insurance covers",
                        "Automated biometrics clearance registration"
                      ].map((text, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-300 font-semibold">
                          <CheckCircle2 className="w-4.5 h-4.5 text-[#fbbf24]" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-2">
                      <Link
                        href="/auth/register"
                        className="flex-1 py-3.5 rounded-xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-950 font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#fbbf24]/10"
                      >
                        Sign Up to Drive <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/driver"
                        className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs text-center transition-all"
                      >
                        Driver Portal
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

        {/* Center overlay background car shadow */}
        <div className="absolute inset-x-0 bottom-0 top-[30%] z-0 flex justify-center items-center pointer-events-none opacity-40">
          <img 
            src="/ridex_hero_car.png" 
            alt="RIDEX Premium Sedan" 
            className="w-full max-w-4xl object-contain object-bottom translate-y-[20%]"
          />
        </div>
      </section>

      {/* ================= CHOOSE YOUR SERVICE GRID ================= */}
      <section id="categories" className="max-w-7xl mx-auto px-6 py-20 w-full relative">
        <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#fbbf24]/2 opacity-10 blur-[80px] pointer-events-none" />
        
        <div className="flex justify-between items-end mb-12">
          <div className="text-left flex flex-col gap-2">
            <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">Multi-role logistics</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Choose Your Service</h2>
          </div>
          <Link href="/services" className="text-xs font-bold text-[#fbbf24] hover:text-[#e5ae20] flex items-center gap-0.5 border-b border-[#fbbf24]/30 pb-0.5">
            View all categories <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Bike Taxi", desc: "Scooty, commuter & sport models", icon: <Bike className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10", tab: "ride", type: "bike" },
            { title: "Smart Auto", desc: "Electric and CNG local transport", icon: <Compass className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10", tab: "ride", type: "auto" },
            { title: "Comfort Cab", desc: "Sedans and spacious family hatchbacks", icon: <Car className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10", tab: "ride", type: "cab" },
            { title: "Premium VIP", desc: "Luxury Audi, BMW & Tesla EVs", icon: <Zap className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10", tab: "ride", type: "premium" },
            { title: "Parcel Courier", desc: "Instant documents & package delivery", icon: <Activity className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10", tab: "delivery", type: "parcel" },
            { title: "Express Food", desc: "Fresh groceries & restaurant meals", icon: <Heart className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10", tab: "delivery", type: "food" },
            { title: "Mini Truck Loader", desc: "Tata Ace loaders for local shifts", icon: <Sliders className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10", tab: "transport", type: "mini_truck" },
            { title: "Pickup Flatbed", desc: "Heavy flatbeds & open haulers", icon: <Navigation className="w-6 h-6 text-[#fbbf24] rotate-45" />, bg: "bg-[#fbbf24]/10", tab: "transport", type: "pickup" },
            { title: "Closed Tempo", desc: "Sealed container cargo shifting", icon: <Users className="w-6 h-6 text-[#fbbf24]" />, bg: "bg-[#fbbf24]/10", tab: "transport", type: "tempo" },
          ].map((service, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setActiveTab(service.tab as any);
                changeCategory(service.type as any);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="glass-card border border-white/5 rounded-3xl p-6 flex items-center justify-between hover:border-[#fbbf24]/20 hover:bg-white/5 transition-all group cursor-pointer text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`p-4.5 rounded-2xl ${service.bg} transition-transform group-hover:scale-105 duration-300`}>
                  {service.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {service.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium mt-1">{service.desc}</p>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#fbbf24] group-hover:text-slate-900 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CINEMATIC CITY CORRIDOR SIMULATION SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full border-t border-white/5 relative">
        <div className="flex flex-col gap-3 mb-10 text-left">
          <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">Experience the AI Network</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Autonomous Dispatch Simulator</h2>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            See the RideX neural dispatcher at work. Vikram Solanki's Tesla and cargo logistics vehicles traverse Delhi NCR green expressways with biometrics tracking, latency logs, and automated corridor optimization.
          </p>
        </div>
        
        <div className="w-full h-[550px] rounded-[32px] overflow-hidden border border-white/10 relative shadow-2xl">
          <CinematicCityCanvas />
        </div>
      </section>

      {/* ================= SAFETY YOU CAN TRUST ================= */}
      <section id="safety" className="max-w-7xl mx-auto px-6 py-20 w-full border-t border-white/5">
        <div className="flex justify-between items-end mb-12">
          <div className="text-left flex flex-col gap-2">
            <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">RideX Guardianship</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Safety You Can Trust</h2>
          </div>
          <Link href="/safety" className="text-xs font-bold text-[#fbbf24] hover:text-[#e5ae20] flex items-center gap-0.5 border-b border-[#fbbf24]/30 pb-0.5">
            Safety framework <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Circular icons row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-16">
          {[
            { label: "SOS Emergency", name: "SOS", icon: <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />, bg: "bg-red-500/10 border-red-500/20" },
            { label: "Live Location Share", name: "Live Route", icon: <MapPin className="w-6 h-6 text-emerald-400" />, bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Driver Biometrics", name: "Identified Profile", icon: <Users className="w-6 h-6 text-blue-400" />, bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Trip Insurance", name: "Comprehensive Cover", icon: <Shield className="w-6 h-6 text-indigo-400" />, bg: "bg-indigo-500/10 border-indigo-500/20" },
            { label: "Women Safety Mode", name: "Preferred Matching", icon: <Heart className="w-6 h-6 text-purple-400" />, bg: "bg-purple-500/10 border-purple-500/20" },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center text-center gap-3.5 cursor-pointer group"
              onClick={item.name === "SOS" ? handleSOS : undefined}
            >
              <div className={`w-16 h-16 rounded-full ${item.bg} flex items-center justify-center border group-hover:scale-105 transition-all shadow-lg`}>
                {item.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">{item.name}</span>
                <span className="text-xs font-bold text-white">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Platform Card */}
        <div className="w-full glass-card border border-white/5 rounded-[40px] p-8 md:p-12 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative shadow-2xl bg-gray-900/40">
          <div className="md:col-span-7 flex flex-col gap-5 text-left relative z-10">
            <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">RIDEX GUARDIAN SPHERE</span>
            <h3 className="text-3xl font-extrabold text-white leading-tight">
              India's Safer Mobility Infrastructure
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-lg font-medium">
              We verify driver biometrics, background checks, and vehicle diagnostics in real-time. In addition, our automated server loops track route deviations and trigger immediate responses.
            </p>
            <button 
              type="button"
              onClick={() => setShowBookingModal(true)} 
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-slate-950 text-xs font-bold w-fit mt-2 transition-all cursor-pointer shadow-md"
            >
              Know More
            </button>
          </div>
          <div className="md:col-span-5 flex justify-center relative">
            <img 
              src="/ridex_safety_banner.png" 
              alt="Safety Platform Banner" 
              className="w-full max-w-xs object-contain filter drop-shadow-[0_15px_30px_rgba(251,191,36,0.15)]"
            />
          </div>
        </div>
      </section>

      {/* ================= APP PROMOTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center border-t border-white/5">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider">Mobile Application</span>
          <h3 className="text-3xl md:text-4.5xl font-extrabold text-white tracking-tight leading-tight">
            RideX App is better <br />
            on the go!
          </h3>
          
          <ul className="flex flex-col gap-3.5">
            {[
              "Instant AI Driver Dispatches",
              "Exclusive Wallet Cashback Rewards",
              "Sub-second Live Coordinate Tracking",
              "One-click SOS Emergency Beacon"
            ].map((bullet, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-2xl border border-white/10 transition-all cursor-pointer">
              <svg className="w-5 h-5 fill-current text-[#fbbf24]" viewBox="0 0 24 24">
                <path d="M5 3c-.28 0-.5.22-.5.5v17c0 .28.22.5.5.5.15 0 .28-.06.38-.16l9.62-9.62-9.62-9.62c-.1-.1-.23-.16-.38-.16zM16 11.25l-2.25 2.25 2.25 2.25c.41-.41.41-1.09 0-1.5l-1.5-1.5 1.5-1.5zm.75.75c0 .28-.11.53-.3.72l-2.28 2.28c-.39.39-1.02.39-1.41 0l-2.28-2.28c-.39-.39-.39-1.02 0-1.41l2.28-2.28c.39-.39 1.02-.39 1.41 0l2.28 2.28c.19.19.3.44.3.72z" />
              </svg>
              <div className="text-left leading-none">
                <span className="text-[8px] block text-gray-400 uppercase font-mono">Get it on</span>
                <span className="text-xs font-bold block mt-1">Google Play</span>
              </div>
            </button>

            <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-2xl border border-white/10 transition-all cursor-pointer">
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.94-1.39" />
              </svg>
              <div className="text-left leading-none">
                <span className="text-[8px] block text-gray-400 uppercase font-mono">Download on the</span>
                <span className="text-xs font-bold block mt-1">App Store</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Smartphone mockup rendering Live Tracking Map */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="w-[310px] h-[600px] bg-slate-950 rounded-[52px] p-3.5 shadow-2xl relative border-[6px] border-slate-800">
            {/* Notch */}
            <div className="absolute top-5.5 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
            </div>

            {/* Simulated Map Screen */}
            <div className="w-full h-full bg-[#0c101d] rounded-[38px] overflow-hidden relative border border-white/5 flex flex-col justify-between pt-8">
              
              {/* Telemetry status bar */}
              <div className="p-4.5 bg-gray-900 border-b border-white/5 flex justify-between items-center z-10 relative">
                <div className="text-left">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#fbbf24] block">GPS Tracking</span>
                  <span className="text-[10px] font-bold text-white">Trip RIDEX-2026</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-[#fbbf24] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 animate-pulse" /> 3.5 Mins
                  </span>
                </div>
              </div>

              {/* Live SVG Map */}
              <div className="flex-1 bg-slate-950 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 240 320">
                  {/* Grid overlay lines */}
                  <path d="M 0,40 L 240,40 M 0,120 L 240,120 M 0,200 L 240,200 M 0,280 L 240,280 M 60,0 L 60,320 M 140,0 L 140,320 M 200,0 L 200,320" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  
                  {/* Route path */}
                  <path d="M 40,240 Q 120,40 200,160" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 40,240 Q 120,40 200,160" fill="transparent" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 8" />

                  {/* Pickup & Drop markers */}
                  <circle cx="40" cy="240" r="6" fill="#10b981" stroke="#000" strokeWidth="2" />
                  <circle cx="200" cy="160" r="6" fill="#f43f5e" stroke="#000" strokeWidth="2" />

                  {/* Car dot moving */}
                  <g transform={`translate(${currentVehiclePos.x * 0.7 + 10}, ${currentVehiclePos.y * 0.8 + 40})`}>
                    <circle cx="0" cy="0" r="7" fill="#fbbf24" stroke="#000" strokeWidth="1.5" className="shadow-lg" />
                    <circle cx="0" cy="0" r="14" fill="transparent" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="1" className="animate-ping" />
                  </g>
                </svg>

                {/* Map telemetry overlay control */}
                <button 
                  type="button"
                  onClick={() => setSimPlaying(!simPlaying)}
                  className="absolute bottom-3 left-3 px-3 py-1.5 bg-[#0f172a]/90 backdrop-blur-md rounded-xl border border-white/10 text-[9px] font-bold text-gray-300 shadow-sm flex items-center gap-1.5 hover:text-white"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {simPlaying ? "PAUSE SIM" : "PLAY SIM"}
                </button>
              </div>

              {/* Bottom Sheet info inside phone */}
              <div className="p-4 bg-gray-900 border-t border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/30 flex items-center justify-center font-bold text-xs text-[#fbbf24]">
                    VS
                  </div>
                  <div className="flex-grow min-w-0 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white truncate">Vikram Solanki</span>
                      <span className="text-[9px] font-bold text-[#fbbf24] bg-[#fbbf24]/10 px-1.5 py-0.2 rounded border border-[#fbbf24]/20">★ 4.95</span>
                    </div>
                    <span className="text-[8px] text-gray-400 block font-mono">Toyota Camry · DL-1CA-8832</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS & FEATURES ROW ================= */}
      <section className="w-full bg-gray-900/30 border-y border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "1M+", label: "Happy Users", icon: <Users className="w-5 h-5 text-[#fbbf24] mx-auto mb-1.5" /> },
              { stat: "50K+", label: "Verified Drivers", icon: <CheckCircle className="w-5 h-5 text-[#fbbf24] mx-auto mb-1.5" /> },
              { stat: "10M+", label: "Rides Completed", icon: <Navigation className="w-5 h-5 text-[#fbbf24] rotate-45 mx-auto mb-1.5" /> },
              { stat: "200+", label: "Cities Covered", icon: <Compass className="w-5 h-5 text-[#fbbf24] mx-auto mb-1.5" /> },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                {stat.icon}
                <span className="text-3xl font-black text-white">{stat.stat}</span>
                <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">{stat.label}</span>
              </div>
            ))}
          </div>

          <hr className="border-white/5" />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              { title: "No Surge Traps", desc: "Estimated pricing holds transparently", icon: <DollarSign className="w-5 h-5 text-[#fbbf24]" /> },
              { title: "Clean Diagnostics", desc: "Safety checks on vehicles weekly", icon: <Shield className="w-5 h-5 text-[#fbbf24]" /> },
              { title: "SLA Elite Drivers", desc: "Consistently rated 4.85+ drivers", icon: <Star className="w-5 h-5 text-[#fbbf24] fill-[#fbbf24]" /> },
              { title: "Instant Assistance", desc: "Automated chatbot and phone logs", icon: <Clock className="w-5 h-5 text-[#fbbf24]" /> },
            ].map((prop, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 h-fit shrink-0">
                  {prop.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{prop.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REVIEWS & REFERRAL DUAL GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: What Our Customers Say */}
        <div className="lg:col-span-8 flex flex-col gap-6 text-left">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider block mb-1">User Testimonials</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">What Our Customers Say</h2>
            </div>
            <Link href="/reviews" className="text-xs font-bold text-[#fbbf24] hover:text-[#e5ae20] flex items-center gap-0.5 border-b border-[#fbbf24]/30 pb-0.5">
              Read reviews <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Great Service", review: "Outstanding safety. The telemetry matches perfectly and driver Vikram was incredibly professional.", stars: 5 },
              { name: "On Time Always", review: "RideX is a next-gen commuter necessity. Price estimates lock accurately without random spikes.", stars: 5 },
              { name: "Very Affordable", review: "Best courier dispatch interface. Batch manifests import works like a breeze for corporate fleet.", stars: 5 },
            ].map((rev, idx) => (
              <div 
                key={idx}
                className="glass-card border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-md relative text-left"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-0.5 text-[#fbbf24]">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">{rev.review}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Refer & Earn card */}
        <div className="lg:col-span-4 bg-gray-900/40 border border-white/5 rounded-[40px] p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          {/* Decorative radial spotlight */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#fbbf24]/5 blur-2xl pointer-events-none" />
          
          <div className="absolute right-3 bottom-3 w-32 h-32 pointer-events-none z-0 opacity-20">
            <img 
              src="/ridex_refer_gift.png" 
              alt="Gift box with coins" 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-3 text-left">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#fbbf24] bg-[#fbbf24]/10 px-2.5 py-1 rounded border border-[#fbbf24]/20 w-fit">Referral Program</span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight leading-tight mt-1">
              Refer & Earn
            </h3>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-[220px]">
              Invite your colleagues or friends and earn RIDEX Wallet Credits instantly on their first transit complete!
            </p>
          </div>

          <div className="relative z-10 mt-8 text-left">
            <button 
              type="button"
              onClick={() => setShowBookingModal(true)} 
              className="px-6 py-3.5 rounded-xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-950 text-xs font-bold transition-all shadow-md shadow-[#fbbf24]/10 cursor-pointer"
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
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            {/* Card modal */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-gray-900 rounded-[32px] p-8 border border-white/10 shadow-2xl relative z-10 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-5 shadow-lg">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Action Dispatch Success!</h3>
              
              <p className="text-xs text-gray-400 mb-6 leading-relaxed font-semibold">
                Your parameters have been logged and broadcasted to active drivers in the Delhi Grid area.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 py-3.5 rounded-xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-950 text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-[#fbbf24]/10"
                >
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
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
              className="bg-red-500 border border-red-650 text-white font-bold text-xs px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
            >
              <ShieldAlert className="w-5 h-5 text-white animate-bounce" />
              <div className="text-left">
                <span className="font-extrabold block">SOS EMERGENCY ACTION BEACON</span>
                <span className="text-[10px] text-red-150 block font-normal mt-0.5">Pushing coordinates to local dispatch and response teams...</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
