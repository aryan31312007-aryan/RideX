"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bike, Car, Navigation, Zap, Shield, MapPin, ArrowRight, Star, Clock,
  Heart, ShieldAlert, CheckCircle, ChevronRight, Sliders, DollarSign,
  Smartphone, Activity, Compass, Users, CheckCircle2, Map, Bell, HelpCircle,
  QrCode, ArrowUpRight, Wallet, History, X, Plus, AlertCircle, Play, Pause, ChevronDown, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebase } from "@/context/FirebaseContext";
import CinematicCityCanvas from "@/components/layout/CinematicCityCanvas";

export default function LandingPage() {
  const { user, profile } = useFirebase();

  // Reset page-level background to clean light/purple branding
  useEffect(() => {
    const body = document.body;
    const prevBg = body.style.backgroundColor;
    const prevColor = body.style.color;

    body.style.backgroundColor = "#f8fafc";
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

  // Sub-services configurations
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
      { id: "premium_sedan", name: "Premium Sedan", base: 150, perKm: 28 },
      { id: "tesla_ev", name: "Tesla Prime EV SUV", base: 130, perKm: 24 },
      { id: "luxury_limo", name: "Luxury Limousine", base: 300, perKm: 50 }
    ],
    parcel: [
      { id: "doc_courier", name: "Instant Doc Courier", base: 40, perKm: 8 },
      { id: "box_express", name: "Medium Box Express", base: 60, perKm: 12 },
      { id: "heavy_cargo", name: "Heavy Box Cargo", base: 120, perKm: 18 }
    ],
    food: [
      { id: "meal_delivery", name: "Express Meal Delivery", base: 25, perKm: 5 },
      { id: "grocery_express", name: "Fresh Grocery", base: 30, perKm: 6 }
    ],
    mini_truck: [
      { id: "tata_ace", name: "Tata Ace (Mini Truck)", base: 180, perKm: 22 },
      { id: "e_loader", name: "E-Loader Box Truck", base: 150, perKm: 18 }
    ],
    pickup: [
      { id: "mahindra_pickup", name: "Mahindra Pickup", base: 220, perKm: 25 }
    ],
    tempo: [
      { id: "force_tempo", name: "Force Tempo", base: 280, perKm: 30 }
    ]
  };

  // State Management
  const [balance, setBalance] = useState(240);
  const [pickup, setPickup] = useState("Connaught Place, New Delhi");
  const [drop, setDrop] = useState("Indira Gandhi Airport, Delhi");
  
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof subServices>("cab");
  const [selectedSubService, setSelectedSubService] = useState<string>("mini_cab");
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [tripStatus, setTripStatus] = useState<"idle" | "booking" | "active">("idle");
  const [sosStatus, setSosStatus] = useState<"idle" | "triggered">("idle");

  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("500");
  const [showWalletActions, setShowWalletActions] = useState(false);
  const [mockAlert, setMockAlert] = useState<string | null>(null);

  // Live Map Simulation (Vikram Solanki camry reference)
  const [simProgress, setSimProgress] = useState(0.35);
  const [simPlaying, setSimPlaying] = useState(true);
  const simInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (simPlaying && tripStatus === "active") {
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
  }, [simPlaying, tripStatus]);

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

  // Triggers
  const openBookingFlow = (cat: keyof typeof subServices) => {
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
    setIsBookingOpen(true);
  };

  const handleBookRide = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingLoading(true);
    setTimeout(() => {
      setIsBookingLoading(false);
      setIsBookingOpen(false);
      setTripStatus("active");
      const fare = getFareValue();
      setBalance((b) => Math.max(0, b - fare));
    }, 1500);
  };

  const handleSOS = () => {
    setSosStatus("triggered");
    setTimeout(() => setSosStatus("idle"), 3000);
    window.dispatchEvent(new CustomEvent("open-sos-modal"));
  };

  const openMockPage = (title: string) => {
    setMockAlert(`Navigating to ${title}. In MVP, this redirects to customer portals.`);
    setTimeout(() => setMockAlert(null), 3000);
  };

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amountToAdd);
    if (!isNaN(parsed) && parsed > 0) {
      setBalance((b) => b + parsed);
      setShowAddMoneyModal(false);
      setMockAlert(`Successfully added ₹${parsed} to your Wallet!`);
      setTimeout(() => setMockAlert(null), 3000);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen relative font-sans overflow-x-hidden flex flex-col justify-center">
      {/* Background Decorative Gradient Circles on Desktop */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none hidden lg:block" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-amber-100/40 rounded-full blur-[100px] pointer-events-none hidden lg:block" />

      {/* Main Dual Wrapper */}
      <div className="max-w-7xl mx-auto w-full min-h-[92vh] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 px-4 md:px-10 z-10 relative">
        
        {/* ================= LEFT PRESENTATION GRID (DESKTOP ONLY) ================= */}
        <div className="hidden lg:flex lg:col-span-6 flex-col gap-6 text-left pr-6">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-[#fbbf24] flex items-center justify-center text-slate-950 font-black text-base shadow-sm">
              R
            </span>
            <span className="text-xl font-black tracking-tight text-slate-900">
              RIDE<span className="text-[#7c3aed] font-extrabold">X</span>
            </span>
          </div>

          <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Your City. Your Ride. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#a855f7]">
              Travel, Transport & More.
            </span>
          </h1>

          <p className="text-base text-slate-550 max-w-lg leading-relaxed font-semibold">
            India's next-gen multi-modal platform. Hail quick cabs, local autos, instant delivery, or book regional stays. Fully responsive simulator preview.
          </p>

          {/* Mini Dispatch Analytics Visual Panel */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-5 shadow-md flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Dispatch Simulator
              </span>
              <span className="text-[10px] font-bold text-[#7c3aed]">Corridor Tracking</span>
            </div>
            <div className="w-full h-[230px] rounded-2xl overflow-hidden relative shadow-inner bg-slate-900 border border-slate-950/20">
              <CinematicCityCanvas />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              { label: "Verified Drivers", desc: "Safety first standards" },
              { label: "AI Corridor Dispatch", desc: "Autonomous mapping matching" }
            ].map((b, i) => (
              <div key={i} className="flex gap-2.5 items-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-xs font-bold text-slate-800">
                <span className="text-purple-600">✓</span>
                <div className="flex flex-col">
                  <span>{b.label}</span>
                  <span className="text-[9px] text-slate-400 font-medium">{b.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT MOBILE SIMULATOR VIEW (FULL SCREEN ON MOBILE) ================= */}
        <div className="col-span-1 lg:col-span-6 flex justify-center items-center w-full">
          {/* Bezel frame container for desktop */}
          <div className="w-full max-w-[410px] bg-slate-950 lg:rounded-[48px] lg:p-3 lg:shadow-[0_20px_50px_rgba(109,40,217,0.18)] lg:border-[8px] lg:border-slate-900 relative aspect-[9/19] flex flex-col overflow-hidden">
            
            {/* Simulated App Screen */}
            <div className="flex-grow bg-white text-slate-800 flex flex-col justify-between relative overflow-y-auto scrollbar-none lg:rounded-[38px] max-h-full">
              
              {/* MOCK PAGE ALERTS */}
              <AnimatePresence>
                {mockAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 inset-x-4 bg-slate-900 text-white font-bold text-[10px] py-2.5 px-4 rounded-xl shadow-lg z-50 text-center flex items-center justify-center gap-2 border border-slate-800"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-ping" />
                    {mockAlert}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* APP HEADER */}
              <div className="px-4 py-2.5 flex justify-between items-center bg-white sticky top-0 z-30 border-b border-slate-50 shadow-sm/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-lg bg-[#fbbf24] flex items-center justify-center text-slate-950 font-black text-sm">
                    R
                  </span>
                  <span className="text-base font-black tracking-tight text-slate-900">RIDEX</span>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Balance Dropdown Pill */}
                  <div className="relative">
                    <button
                      onClick={() => setShowWalletActions(!showWalletActions)}
                      className="bg-[#7c3aed]/5 border border-[#7c3aed]/10 rounded-full px-3 py-1 flex items-center gap-1 shadow-sm text-[11px] font-black text-[#7c3aed] transition-all hover:bg-[#7c3aed]/10 active:scale-95 cursor-pointer"
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[9px]">₹</span>
                      <span>₹{balance.toFixed(0)}</span>
                      <ChevronDown className={`w-3 h-3 text-[#7c3aed] transition-transform ${showWalletActions ? "rotate-180" : ""}`} />
                    </button>

                    {/* Balance actions dropdown inside the screen */}
                    <AnimatePresence>
                      {showWalletActions && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowWalletActions(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50 text-left"
                          >
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 block px-2 py-1 font-bold">RideX Wallet</span>
                            <button
                              onClick={() => {
                                setShowWalletActions(false);
                                setShowAddMoneyModal(true);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-[10px] font-black text-slate-700 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-purple-600" /> Add Money
                            </button>
                            <button
                              onClick={() => {
                                setShowWalletActions(false);
                                openMockPage("Transactions");
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-[10px] font-black text-slate-700 transition-colors cursor-pointer"
                            >
                              <History className="w-3.5 h-3.5 text-purple-600" /> History
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bell Notifications */}
                  <button
                    onClick={() => openMockPage("Notifications")}
                    className="relative p-1 rounded-full hover:bg-slate-50 transition-colors active:scale-90 cursor-pointer"
                  >
                    <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#7c3aed] rounded-full border border-white" />
                    <Bell className="w-4.5 h-4.5 text-slate-800" />
                  </button>

                  {/* Help */}
                  <Link
                    href="/help"
                    className="p-1 rounded-full hover:bg-slate-50 transition-colors active:scale-90 cursor-pointer"
                  >
                    <HelpCircle className="w-4.5 h-4.5 text-slate-800" />
                  </Link>
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 overflow-y-auto scrollbar-none pb-20">
                
                {/* banner slider carousel */}
                <div className="px-4 py-2 mt-2">
                  <div className="bg-gradient-to-r from-purple-500/5 to-purple-600/10 rounded-3xl p-5 border border-purple-100/40 shadow-sm relative overflow-hidden flex justify-between items-center min-h-[140px]">
                    <div className="flex flex-col gap-2 max-w-[55%] text-left z-10">
                      <h3 className="text-xs md:text-sm font-extrabold text-slate-800 leading-tight">
                        Your City. Your Ride. <br />
                        <span className="text-[#7c3aed]">Travel, Transport</span> & More <br />
                        All in one app.
                      </h3>
                      <button
                        onClick={() => openBookingFlow("cab")}
                        className="bg-[#7c3aed] text-white px-3.5 py-1.5 rounded-full text-[9px] font-black w-fit mt-1 shadow-md shadow-purple-600/15 hover:bg-[#6d28d9] transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book Now</span>
                        <span>→</span>
                      </button>
                    </div>
                    
                    <div className="absolute right-0 bottom-0 top-0 w-[45%] flex items-end justify-end pointer-events-none z-0">
                      <div className="relative w-full h-full flex items-end justify-end p-2 select-none">
                        {/* path vector line */}
                        <svg className="absolute inset-0 w-full h-full text-[#7c3aed]/25" viewBox="0 0 100 100" fill="none">
                          <path d="M 0,80 Q 40,20 80,60 T 100,50" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 4" fill="none" />
                          <circle cx="80" cy="60" r="3.5" fill="#7c3aed" />
                        </svg>
                        <img
                          src="/ridex_hero_car.png"
                          alt="Banner Car"
                          className="object-contain max-h-[82%] relative z-10 translate-y-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Slider indicators */}
                  <div className="flex justify-center gap-1 mt-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] transition-all" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  </div>
                </div>

                {/* Book Your Ride Grid */}
                <div className="px-4 py-2.5 text-left">
                  <div className="flex justify-between items-center mb-2.5">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Book Your Ride</h4>
                    <button onClick={() => openMockPage("Bookings")} className="text-[9px] font-extrabold text-[#7c3aed] hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { name: "Bike", image: "🛵", cat: "bike" },
                      { name: "Auto", image: "🛺", cat: "auto" },
                      { name: "Cab", image: "🚗", cat: "cab" },
                      { name: "E-Rikshaw", image: "🔋🛺", cat: "auto" }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => openBookingFlow(item.cat as any)}
                        className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col items-center gap-1 shadow-sm transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                      >
                        <div className="text-xl h-10 w-full flex items-center justify-center bg-slate-50 rounded-xl">
                          {item.image}
                        </div>
                        <span className="text-[9px] font-black text-slate-800 tracking-tight mt-0.5 truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transport & Delivery Grid */}
                <div className="px-4 py-2.5 text-left">
                  <div className="flex justify-between items-center mb-2.5">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Transport & Delivery</h4>
                    <button onClick={() => openMockPage("Delivery")} className="text-[9px] font-extrabold text-[#7c3aed] hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { name: "Parcel", image: "📦", cat: "parcel" },
                      { name: "Courier", image: "🛵💨", cat: "parcel" },
                      { name: "Mini Truck", image: "🛻", cat: "mini_truck" },
                      { name: "Tempo", image: "🚛", cat: "tempo" }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => openBookingFlow(item.cat as any)}
                        className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col items-center gap-1 shadow-sm transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                      >
                        <div className="text-xl h-10 w-full flex items-center justify-center bg-slate-50 rounded-xl">
                          {item.image}
                        </div>
                        <span className="text-[9px] font-black text-slate-800 tracking-tight mt-0.5 truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travel & Stay Grid */}
                <div className="px-4 py-2.5 text-left">
                  <div className="flex justify-between items-center mb-2.5">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Travel & Stay</h4>
                    <button onClick={() => openMockPage("Travel")} className="text-[9px] font-extrabold text-[#7c3aed] hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { name: "Flight", image: "✈️" },
                      { name: "Bus", image: "🚌" },
                      { name: "Train", image: "🚆" },
                      { name: "Hotel", image: "🏨" }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => openMockPage(item.name)}
                        className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col items-center gap-1 shadow-sm transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                      >
                        <div className="text-xl h-10 w-full flex items-center justify-center bg-slate-50 rounded-xl">
                          {item.image}
                        </div>
                        <span className="text-[9px] font-black text-slate-800 tracking-tight mt-0.5 truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Security trust badge strip */}
                <div className="px-4 py-2">
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex justify-between items-center gap-1">
                    {[
                      { label: "Live Tracking", desc: "Real-time", icon: "📍" },
                      { label: "Verified Drivers", desc: "Safety First", icon: "🛡️" },
                      { label: "Secure Payment", desc: "100% Safe", icon: "🔒" },
                      { label: "24x7 Support", desc: "We're Here", icon: "📞" }
                    ].map((badge, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center flex-1">
                        <span className="text-[13px]">{badge.icon}</span>
                        <span className="text-[8px] font-black text-slate-900 mt-1 leading-none">{badge.label}</span>
                        <span className="text-[6.5px] font-bold text-slate-400 mt-0.5 leading-none">{badge.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Offers & Rewards Grid */}
                <div className="px-4 py-2.5 text-left">
                  <div className="flex justify-between items-center mb-2.5">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Offers & Rewards</h4>
                    <button onClick={() => openMockPage("Offers")} className="text-[9px] font-extrabold text-[#7c3aed] hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { name: "Offer Zone", image: "🎁" },
                      { name: "Brand Vouchers", image: "🎫" },
                      { name: "Subscriptions", image: "📺" },
                      { name: "Google Play", image: "🧩" }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => openMockPage(item.name)}
                        className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col items-center gap-1 shadow-sm transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                      >
                        <div className="text-xl h-10 w-full flex items-center justify-center bg-slate-50 rounded-xl">
                          {item.image}
                        </div>
                        <span className="text-[9px] font-black text-slate-800 tracking-tight mt-0.5 truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stocks Widget Grid */}
                <div className="px-4 py-2.5 text-left">
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-3.5 flex flex-col gap-3 shadow-sm">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-extrabold text-slate-800 leading-tight">Looking for stocks or ETFs? Find both on</span>
                        <span className="text-xs font-black text-[#7c3aed] mt-0.5">share.market</span>
                      </div>
                      <button
                        onClick={() => openMockPage("share.market")}
                        className="bg-[#7c3aed] text-white px-3 py-1.5 rounded-full text-[9px] font-black hover:bg-[#6d28d9] transition-all active:scale-95 shrink-0 cursor-pointer"
                      >
                        Explore Share.Market →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* SBI Stock Card */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-2.5 flex flex-col gap-1.5 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4.5 h-4.5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[9px] font-bold">S</div>
                          <div className="flex flex-col leading-none">
                            <span className="text-[9px] font-black text-slate-900">State Bank of India</span>
                          </div>
                        </div>
                        <div className="flex flex-col leading-none mt-1">
                          <span className="text-xs font-black text-slate-950">₹1,015.40</span>
                          <span className="text-[7px] text-slate-400 mt-1 font-bold">Previous closing price</span>
                        </div>
                        {/* Mini graph SVG */}
                        <svg className="w-full h-7 text-emerald-500 mt-1.5" viewBox="0 0 100 30" fill="none">
                          <path d="M 0,25 Q 15,10 30,22 T 60,12 T 90,8 T 100,2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                      </div>

                      {/* Vi Stock Card */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-2.5 flex flex-col gap-1.5 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4.5 h-4.5 rounded-full bg-red-650 text-white flex items-center justify-center text-[9px] font-bold">V</div>
                          <div className="flex flex-col leading-none">
                            <span className="text-[9px] font-black text-slate-900">Vodafone Idea Ltd.</span>
                          </div>
                        </div>
                        <div className="flex flex-col leading-none mt-1">
                          <span className="text-xs font-black text-slate-950">₹13.83</span>
                          <span className="text-[7px] text-slate-400 mt-1 font-bold">Previous closing price</span>
                        </div>
                        {/* Mini graph SVG */}
                        <svg className="w-full h-7 text-emerald-500 mt-1.5" viewBox="0 0 100 30" fill="none">
                          <path d="M 0,22 Q 25,25 50,15 T 100,2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIDEX Wallet Promo banner */}
                <div className="px-4 py-2.5 text-left">
                  <div className="bg-gradient-to-r from-[#1e1b4b] to-[#3b0764] rounded-3xl p-4 text-white flex justify-between items-center relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/15 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex flex-col gap-1.5 z-10 max-w-[65%]">
                      <span className="text-[11px] font-black tracking-wide text-purple-200">RIDEX Wallet</span>
                      <p className="text-[9px] font-bold text-purple-100 leading-tight">Add money & get exciting cashback</p>
                      <button
                        onClick={() => setShowAddMoneyModal(true)}
                        className="bg-[#fbbf24] text-slate-950 px-3 py-1 rounded-full text-[9px] font-black w-fit mt-1 shadow-sm hover:bg-[#e5ae20] transition-all active:scale-95 cursor-pointer"
                      >
                        Add Money →
                      </button>
                    </div>

                    <div className="w-[30%] flex justify-end items-center relative z-10 select-none">
                      <img
                        src="/ridex_refer_gift.png"
                        alt="Wallet Coins decoration"
                        className="w-16 h-16 object-contain scale-[1.25] translate-y-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="px-4 py-2">
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: "Scan & Pay", icon: "🔲", action: "scan" },
                      { name: "Send Money", icon: "⬆️", action: "send" },
                      { name: "Check Balance", icon: "₹", action: "balance" },
                      { name: "History", icon: "🕒", action: "history" }
                    ].map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (act.action === "scan") setShowQRScanner(true);
                          else if (act.action === "balance" || act.action === "send") setShowWalletActions(true);
                          else openMockPage(act.name);
                        }}
                        className="bg-slate-50 border border-slate-100 rounded-2xl py-2 px-1 flex flex-col items-center gap-1 shadow-sm transition-all hover:bg-slate-100 active:scale-95 cursor-pointer"
                      >
                        <span className="text-sm font-bold text-purple-700">{act.icon}</span>
                        <span className="text-[8px] font-black text-slate-700 text-center truncate w-full">{act.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Need help row */}
                <div className="px-4 py-2.5">
                  <div className="bg-purple-50/40 rounded-2xl p-3 border border-purple-100/50 flex justify-between items-center text-left">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🎧</span>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-800">Need Help?</span>
                        <span className="text-[7.5px] text-slate-450 mt-0.5 font-bold">We're here for you 24x7</span>
                      </div>
                    </div>
                    <Link
                      href="/help"
                      className="bg-[#7c3aed] text-white px-3.5 py-1 rounded-full text-[9px] font-black hover:bg-[#6d28d9] transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span>Help & Support</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

              </div>

              {/* BOTTOM NAVIGATION BAR */}
              <div className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-100 px-3 py-2 flex justify-between items-center z-40">
                {[
                  { name: "Home", icon: "🏠", active: tripStatus !== "active" },
                  { name: "Services", icon: "🎛️", link: "/services" },
                  { name: "Scan", icon: "QR", action: "scan" },
                  { name: "Offers", icon: "🏷️", link: "/pricing" },
                  { name: "Account", icon: "👤", link: "/profile" }
                ].map((tab, idx) => {
                  if (tab.name === "Scan") {
                    return (
                      <button
                        key={idx}
                        onClick={() => setShowQRScanner(true)}
                        className="w-12 h-12 rounded-full bg-[#7c3aed] text-white flex items-center justify-center shadow-lg shadow-purple-600/25 -translate-y-4 border-4 border-white transition-all hover:scale-105 active:scale-95 cursor-pointer z-50"
                      >
                        <QrCode className="w-5.5 h-5.5 text-white" />
                      </button>
                    );
                  }

                  const isActive = tab.name === "Home" && tripStatus === "idle";
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (tab.name === "Home") {
                          setTripStatus("idle");
                        } else if (tab.link) {
                          window.location.href = tab.link;
                        }
                      }}
                      className={`flex flex-col items-center flex-1 gap-0.5 cursor-pointer transition-all active:scale-95 ${isActive ? "text-[#7c3aed]" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      <span className="text-[14px] leading-none">{tab.icon}</span>
                      <span className="text-[9px] font-black tracking-tight">{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* ================= MODAL SHEETS & INTERACTIVE OVERLAYS ================= */}

              {/* 1. Category Booking Sheet Drawer */}
              <AnimatePresence>
                {isBookingOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsBookingOpen(false)}
                      className="absolute inset-0 bg-black/60 z-45"
                    />
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 220 }}
                      className="absolute bottom-0 inset-x-0 bg-white rounded-t-[32px] p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-slate-100 z-50 text-left"
                    >
                      <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4">
                        <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                          Book {selectedCategory.toUpperCase()}
                        </span>
                        <button
                          onClick={() => setIsBookingOpen(false)}
                          className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleBookRide} className="flex flex-col gap-3">
                        {/* Pickup */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Pickup Location</label>
                          <div className="relative">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute left-3 top-3.5" />
                            <input
                              type="text"
                              value={pickup}
                              onChange={(e) => setPickup(e.target.value)}
                              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-none focus:border-[#7c3aed]"
                              required
                            />
                          </div>
                        </div>

                        {/* Drop */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Drop Location</label>
                          <div className="relative">
                            <span className="w-2 h-2 rounded-full bg-red-500 absolute left-3 top-3.5" />
                            <input
                              type="text"
                              value={drop}
                              onChange={(e) => setDrop(e.target.value)}
                              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-none focus:border-[#7c3aed]"
                              required
                            />
                          </div>
                        </div>

                        {/* Option Details dropdown */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Type</label>
                            <select
                              value={selectedSubService}
                              onChange={(e) => setSelectedSubService(e.target.value)}
                              className="w-full px-2.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-black focus:bg-white focus:outline-none focus:border-[#7c3aed]"
                            >
                              {(subServices[selectedCategory] || []).map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                  {sub.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Payment</label>
                            <select className="w-full px-2.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-black focus:bg-white focus:outline-none focus:border-[#7c3aed]">
                              <option>RIDEX Wallet (₹{balance.toFixed(0)})</option>
                              <option>UPI / Net Banking</option>
                              <option>Cash</option>
                            </select>
                          </div>
                        </div>

                        {/* Rent Fare estimation lock */}
                        <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100/50 flex justify-between items-center text-xs mt-1">
                          <div className="flex flex-col leading-none">
                            <span className="text-[8px] uppercase tracking-wider text-slate-405 font-bold">Estimated Fare</span>
                            <span className="text-base font-black text-slate-800 mt-1">₹{getFareValue().toFixed(2)}</span>
                          </div>
                          <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-full">
                            ✓ Rate Locked
                          </span>
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={isBookingLoading}
                          className="w-full py-3.5 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-xs mt-2 transition-all shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
                        >
                          {isBookingLoading ? (
                            <span>Requesting Ride...</span>
                          ) : (
                            <>
                              <span>Book {selectedCategory.toUpperCase()}</span>
                              <ArrowRight className="w-4 h-4 text-white" />
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* 2. Live Transit Tracking Screen (Vikram Camry) */}
              <AnimatePresence>
                {tripStatus === "active" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#fafaff] z-42 flex flex-col justify-between pt-0"
                  >
                    {/* Live Tracking Header */}
                    <div className="p-3 bg-white border-b border-slate-100 flex justify-between items-center relative z-10 text-left">
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-wider text-[#7c3aed] block">Transit Active</span>
                        <span className="text-[10px] font-black text-slate-800">Trip RIDEX-2026</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#7c3aed] animate-pulse" /> 3.5 Mins
                        </span>
                      </div>
                    </div>

                    {/* SVG Map visualizer */}
                    <div className="flex-grow bg-slate-50 relative overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 240 320">
                        <path d="M 0,40 L 240,40 M 0,120 L 240,120 M 0,200 L 240,200 M 0,280 L 240,280 M 60,0 L 60,320 M 140,0 L 140,320 M 200,0 L 200,320" stroke="#f1f5f9" strokeWidth="1" />
                        
                        {/* route path vector line */}
                        <path d="M 40,240 Q 120,40 200,160" fill="transparent" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
                        <path d="M 40,240 Q 120,40 200,160" fill="transparent" stroke="#7c3aed" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="5 7" />

                        {/* pickup & drop dots */}
                        <circle cx="40" cy="240" r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                        <circle cx="200" cy="160" r="5" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />

                        {/* moving vehicle dot */}
                        <g transform={`translate(${currentVehiclePos.x}, ${currentVehiclePos.y})`}>
                          <circle cx="0" cy="0" r="7" fill="#fbbf24" stroke="#fff" strokeWidth="1.5" className="shadow-md" />
                          <circle cx="0" cy="0" r="12" fill="transparent" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1.5" className="animate-ping" />
                        </g>
                      </svg>

                      {/* control overlay */}
                      <button
                        onClick={() => setSimPlaying(!simPlaying)}
                        className="absolute bottom-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-100 text-[9px] font-black text-slate-700 shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {simPlaying ? "PAUSE SIM" : "PLAY SIM"}
                      </button>
                    </div>

                    {/* Driver details card */}
                    <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center font-black text-xs text-[#7c3aed]">
                          VS
                        </div>
                        <div className="flex-grow min-w-0 text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-800 truncate">Vikram Solanki</span>
                            <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1 py-0.2 rounded">★ 4.9</span>
                          </div>
                          <span className="text-[8px] text-slate-400 block mt-0.5">Toyota Camry · DL-1CA-8832</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSOS}
                          className="flex-1 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-[10px] font-black tracking-wide cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                        >
                          ⚠️ TRIGGER SOS
                        </button>
                        <button
                          onClick={() => setTripStatus("idle")}
                          className="flex-grow py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black cursor-pointer active:scale-95 transition-all text-center"
                        >
                          Back to Home
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3. Add Money Wallet Overlay Sheet */}
              <AnimatePresence>
                {showAddMoneyModal && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowAddMoneyModal(false)}
                      className="absolute inset-0 bg-black/60 z-45"
                    />
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 220 }}
                      className="absolute bottom-0 inset-x-0 bg-white rounded-t-[32px] p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-slate-100 z-50 text-left"
                    >
                      <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-4">
                        <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Add Wallet Balance</span>
                        <button
                          onClick={() => setShowAddMoneyModal(false)}
                          className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleAddMoney} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Amount (₹)</label>
                          <input
                            type="number"
                            value={amountToAdd}
                            onChange={(e) => setAmountToAdd(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-base font-black focus:bg-white focus:outline-none focus:border-[#7c3aed]"
                            placeholder="Enter amount"
                            required
                          />
                        </div>

                        <div className="flex gap-2">
                          {["100", "200", "500", "1000"].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setAmountToAdd(preset)}
                              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-black transition-colors cursor-pointer ${amountToAdd === preset ? "bg-[#7c3aed] border-[#7c3aed] text-white" : "bg-slate-50 border-slate-100 text-slate-650 hover:bg-slate-100"}`}
                            >
                              +₹{preset}
                            </button>
                          ))}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-xs mt-1 shadow-md shadow-purple-600/25 cursor-pointer active:scale-95 transition-all"
                        >
                          Add Instantly
                        </button>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* 4. Scanner Simulation Overlay */}
              <AnimatePresence>
                {showQRScanner && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-6 text-white"
                  >
                    <div className="flex justify-between items-center text-left">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-300">RideX Scan & Pay</span>
                      <button
                        onClick={() => setShowQRScanner(false)}
                        className="p-1 rounded-full bg-slate-905 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-6 my-auto">
                      {/* Scanning Box */}
                      <div className="w-48 h-48 border-2 border-dashed border-[#fbbf24] rounded-3xl relative flex items-center justify-center bg-slate-900/40 shadow-2xl">
                        {/* Scanning green line */}
                        <div className="absolute inset-x-2 h-0.5 bg-emerald-500 top-2 animate-bounce shadow-[0_0_10px_#10b981]" />
                        <QrCode className="w-24 h-24 text-slate-700 animate-pulse" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold max-w-[200px] text-center leading-relaxed">
                        Point the camera frame at any RideX QR code on auto, cab, or logistics hubs.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowQRScanner(false);
                        setBalance((b) => b + 50);
                        setMockAlert("Simulated QR scan completed! Reward +₹50 added.");
                        setTimeout(() => setMockAlert(null), 3000);
                      }}
                      className="w-full py-3 rounded-2xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-950 text-xs font-black active:scale-95 transition-all shadow-md shadow-[#fbbf24]/10 cursor-pointer"
                    >
                      Trigger Mock Scan Success
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 5. Global SOS Trigger Overlay */}
              <AnimatePresence>
                {sosStatus === "triggered" && (
                  <div className="absolute top-10 right-4 z-50">
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      className="bg-red-500 border border-red-650 text-white font-bold text-[10px] px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5"
                    >
                      <ShieldAlert className="w-4.5 h-4.5 text-white animate-bounce" />
                      <div className="text-left">
                        <span className="font-extrabold block">SOS SYSTEM ACTIVE</span>
                        <span className="text-[8px] text-red-100 block font-normal mt-0.5">Emergency coordinates broadcasted.</span>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
