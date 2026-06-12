"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Bike, Car, Navigation, Zap, Shield, MapPin, ArrowRight, Star, Clock, 
  Heart, ShieldAlert, CheckCircle, ChevronRight, Sliders, Award, DollarSign, 
  Smartphone, Activity, Compass, Users, Sparkles, AlertCircle, Share2, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interface for simulated route points
interface MapPoint {
  x: number;
  y: number;
  label?: string;
}

export default function LandingPage() {
  // 1. Page-level Light Mode override
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

  // 2. State management for booking card
  const [pickup, setPickup] = useState("Aerocity Hub, Terminal 3");
  const [drop, setDrop] = useState("Cyber City Phase II, Block C");
  const [vehicleType, setVehicleType] = useState<"bike" | "auto" | "mini" | "rentals" | "ev">("ev");
  const [distance, setDistance] = useState<number>(14);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // 3. Pricing rates & categories details
  const vehicleCategories = {
    bike: {
      name: "Electric Bike",
      base: 20,
      perKm: 6.5,
      eta: "2 mins away",
      description: "Futuristic zero-emission electric bikes. Beat traffic, ride solo.",
      bg: "bg-purple-50 border-purple-100",
      accent: "text-purple-600",
      icon: <Bike className="w-5 h-5" />
    },
    auto: {
      name: "Smart Auto",
      base: 35,
      perKm: 9.0,
      eta: "3 mins away",
      description: "Comfortable smart electric three-wheelers with transparent fares.",
      bg: "bg-indigo-50 border-indigo-100",
      accent: "text-indigo-600",
      icon: <Compass className="w-5 h-5" />
    },
    mini: {
      name: "Mini Cab",
      base: 60,
      perKm: 12.0,
      eta: "5 mins away",
      description: "Compact city hatchbacks with highly trained local navigators.",
      bg: "bg-blue-50 border-blue-100",
      accent: "text-blue-600",
      icon: <Car className="w-5 h-5" />
    },
    rentals: {
      name: "RideX Hourly",
      base: 180,
      perKm: 16.0,
      eta: "Immediate pickup",
      description: "Keep the car and driver with you as long as you need, hourly rates.",
      bg: "bg-emerald-50 border-emerald-100",
      accent: "text-emerald-600",
      icon: <Sliders className="w-5 h-5" />
    },
    ev: {
      name: "Prime EV SUV",
      base: 80,
      perKm: 14.5,
      eta: "4 mins away",
      description: "Premium autonomous-assisted electric SUVs. Luxury seating & sound.",
      bg: "bg-fuchsia-50 border-fuchsia-100",
      accent: "text-purple-600",
      icon: <Zap className="w-5 h-5 text-purple-600" />
    }
  };

  const calculateEstimate = () => {
    const selected = vehicleCategories[vehicleType];
    const durationMin = distance * 2.2; 
    const timeFare = durationMin * 1.5; 
    return selected.base + (distance * selected.perKm) + timeFare;
  };

  const handleBookRide = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingLoading(true);
    setTimeout(() => {
      setIsBookingLoading(false);
      setBookingSuccess(true);
      setShowBookingModal(true);
    }, 1200);
  };

  // 4. State for AI Routing Section
  const [activeRouteType, setActiveRouteType] = useState<"fastest" | "eco" | "scenic">("fastest");
  
  // 5. State for Live Tracking Section
  const [simProgress, setSimProgress] = useState(0.35);
  const [simPlaying, setSimPlaying] = useState(true);
  const simInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (simPlaying) {
      simInterval.current = setInterval(() => {
        setSimProgress((p) => {
          if (p >= 0.98) return 0.05; // Loop route simulation
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

  // 6. State for Driver Salary Calculator
  const [driverHours, setDriverHours] = useState(8);
  const [driverDays, setDriverDays] = useState(24);
  const hourlyRate = 285; // Indian Rupees per hour net average

  // 7. State for Safety SOS Demo
  const [sosStatus, setSosStatus] = useState<"idle" | "triggered">("idle");
  const handleSOS = () => {
    setSosStatus("triggered");
    setTimeout(() => setSosStatus("idle"), 4000);
  };

  // 8. State for Testimonials slider
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      name: "Tanya Sharma",
      age: 22,
      role: "Digital Nomad & Designer",
      quote: "RideX feels like it was designed by Apple but runs with Uber's utility. The Prime EV cabins are clean, smell premium, and booking is purely friction-free.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      location: "New Delhi"
    },
    {
      name: "Kabir Mehta",
      age: 25,
      role: "Product Associate",
      quote: "The electric bike service is a life saver in Cyber City traffic. Half the cost, twice the speed, and the UI is incredibly refreshing. It's the only app I use now.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      location: "Gurugram"
    },
    {
      name: "Rohan Kapoor",
      age: 28,
      role: "Founder, Zenith Studios",
      quote: "I use RideX Hourly for my client shoots. The drivers are professional, the ride tracking link sharing is perfect for my coordinators, and their AI dynamic pricing actually feels fair.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      location: "Noida"
    }
  ];

  // Map route calculations for Custom Light Canvas Map
  const getCoordinatesAlongRoute = (t: number) => {
    // 4-point bezier curve simulating road layout
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

  return (
    <div className="bg-[#fafaff] text-slate-900 min-h-screen relative font-sans overflow-x-hidden">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-100/40 to-blue-50/20 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] left-[-200px] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-50/50 to-indigo-100/40 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-purple-100/30 blur-[150px] pointer-events-none -z-10" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-20" />

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Side Content */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 w-fit"
          >
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="text-[11px] font-semibold text-purple-700 tracking-wider uppercase">
              Next-Gen Autonomous Assisted Fleet
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
          >
            Future Mobility for <br />
            <span className="text-gradient-purple-blue">Everyday Life</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed"
          >
            Unified urban transit made luxurious. Book rapid electric bike-taxis, hail premium self-navigating EVs, or schedule customizable rentals on a single, emotionally engaging platform.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 mt-2"
          >
            <a 
              href="#book-now"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-500/20"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#categories"
              className="px-8 py-4 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold transition-all hover:border-slate-300"
            >
              Explore Fleet
            </a>
          </motion.div>

          {/* Micro Stat pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-6 mt-6 pt-6 border-t border-slate-200/60"
          >
            <div>
              <p className="text-2xl font-bold text-slate-900">4.9★</p>
              <p className="text-xs text-slate-500">App Store Rating</p>
            </div>
            <div className="border-l border-slate-200/80 pl-6">
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-xs text-slate-500">Electric Vehicles</p>
            </div>
            <div className="border-l border-slate-200/80 pl-6">
              <p className="text-2xl font-bold text-slate-900">&lt;5 min</p>
              <p className="text-xs text-slate-500">Average Pickup ETA</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side Card & Map widgets */}
        <div id="book-now" className="lg:col-span-5 w-full flex flex-col gap-6 relative">
          {/* Main Booking Interface Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-xl relative"
          >
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded bg-purple-50 border border-purple-100 text-[10px] font-bold text-purple-600 uppercase">
              <Zap className="w-3.5 h-3.5 animate-bounce text-purple-600" /> AI Pricing Locked
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-purple-600 rotate-45" />
              Quick Dispatch
            </h3>

            <form onSubmit={handleBookRide} className="flex flex-col gap-4">
              {/* Pickup location input */}
              <div className="relative">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Pickup Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-purple-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-purple-500 text-sm text-slate-800 transition-all font-medium"
                    placeholder="Enter pickup point"
                    required
                  />
                </div>
              </div>

              {/* Drop location input */}
              <div className="relative">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Drop Destination</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-indigo-500 text-sm text-slate-800 transition-all font-medium"
                    placeholder="Enter drop destination"
                    required
                  />
                </div>
              </div>

              {/* Vehicle categories selector grid (5 types) */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Select Ride Type</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.keys(vehicleCategories) as Array<keyof typeof vehicleCategories>).map((key) => {
                    const cat = vehicleCategories[key];
                    const isSelected = vehicleType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setVehicleType(key)}
                        className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/25"
                            : "bg-slate-50 border-slate-200/60 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
                        }`}
                      >
                        <span className="mb-1">{cat.icon}</span>
                        <span className="text-[9px] font-bold tracking-tight text-center truncate w-full uppercase">{key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Distance adjustment slider */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                  <span>ESTIMATED TRIP LENGTH</span>
                  <span className="text-purple-600 font-bold">{distance} KM</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="45"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Estimated Pricing details */}
              <div className="p-3 bg-slate-50/80 border border-slate-200/50 rounded-xl mt-1 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Estimated Fare</p>
                  <p className="text-xl font-bold text-slate-900">
                    ₹{calculateEstimate().toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {vehicleCategories[vehicleType].eta}
                  </p>
                  <p className="text-[10px] text-slate-500">Incl. local road tolls</p>
                </div>
              </div>

              {/* Book CTA */}
              <button
                type="submit"
                disabled={isBookingLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/10 text-sm disabled:opacity-85"
              >
                {isBookingLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    Synchronizing Ride Dispatch...
                  </>
                ) : (
                  <>
                    Reserve Smart Ride <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Floating Map Preview Bubble (SVG Canvas) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full h-[140px] bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-lg p-2.5 relative flex items-center"
          >
            {/* Embedded Live Map Canvas */}
            <div className="w-full h-full relative rounded-xl overflow-hidden bg-slate-100">
              <svg className="w-full h-full" viewBox="0 0 300 120">
                {/* Simulated background street grid */}
                <path d="M 0,20 L 300,20 M 0,60 L 300,60 M 0,100 L 300,100 M 40,0 L 40,120 M 120,0 L 120,120 M 200,0 L 200,120 M 280,0 L 280,120" stroke="#e2e8f0" strokeWidth="1" />
                
                {/* Main routing road curvature */}
                <path d="M 30,80 Q 120,30 200,90 T 270,40" fill="transparent" stroke="#ddd" strokeWidth="6" strokeLinecap="round" />
                {/* Active path indicator (purple glow) */}
                <path d="M 30,80 Q 120,30 200,90 T 270,40" fill="transparent" stroke="#8b5cf6" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="6 8" className="animate-[pulse_2s_infinite]" />

                {/* Pickup marker */}
                <circle cx="30" cy="80" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                <circle cx="30" cy="80" r="12" fill="transparent" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1.5" className="animate-ping" />
                
                {/* Drop marker */}
                <circle cx="270" cy="40" r="6" fill="#ec4899" stroke="#fff" strokeWidth="1.5" />
                <circle cx="270" cy="40" r="12" fill="transparent" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="1.5" className="animate-ping" />

                {/* Simulated Vehicle marker moving along path */}
                <g transform={`translate(${currentVehiclePos.x}, ${currentVehiclePos.y / 1.7 + 10})`}>
                  <circle cx="0" cy="0" r="7" fill="#8b5cf6" stroke="#fff" strokeWidth="2" className="glow-purple shadow-lg" />
                  <circle cx="0" cy="0" r="12" fill="transparent" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" className="animate-ping" />
                </g>
              </svg>

              {/* Overlay telemetry info */}
              <div className="absolute top-2 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border border-slate-200/50 text-[9px] font-bold text-slate-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Fleet Tracking simulation
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= TRUSTED BRANDS SECTION ================= */}
      <section className="w-full bg-[#f8fafc]/50 border-y border-slate-200/60 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase text-center">
            Pioneering the Next Standard of Mobility Alongside Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-55">
            {["Tesla", "Apple", "Uber", "Stripe", "Linear", "Rapido"].map((brand) => (
              <span 
                key={brand} 
                className="text-lg md:text-xl font-bold tracking-tight text-slate-600 hover:text-purple-600 hover:opacity-100 transition-all duration-300 cursor-default font-mono uppercase"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RIDE CATEGORIES SECTION ================= */}
      <section id="categories" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">Your Personalized Fleet</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for every journey
          </h3>
          <p className="text-sm text-slate-500 mt-3">
            Choose from five luxury, eco-friendly categories tailored for traffic levels, group size, and comfort preferences.
          </p>
        </div>

        {/* 5 columns Grid of Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {(Object.keys(vehicleCategories) as Array<keyof typeof vehicleCategories>).map((key, idx) => {
            const cat = vehicleCategories[key];
            const rateEst = cat.base + (10 * cat.perKm); // based on typical 10km trip
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => {
                  setVehicleType(key);
                  const el = document.getElementById("book-now");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="glass-card-light p-6 rounded-3xl cursor-pointer flex flex-col justify-between h-full relative overflow-hidden group"
              >
                {/* Pastel design accent card backgrounds */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] opacity-45 -z-10 transition-transform group-hover:scale-125 ${
                  key === "bike" ? "bg-purple-200" :
                  key === "auto" ? "bg-indigo-200" :
                  key === "mini" ? "bg-blue-200" :
                  key === "rentals" ? "bg-emerald-200" : "bg-fuchsia-200"
                }`} />

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl border ${
                      key === "bike" ? "bg-purple-100 border-purple-200 text-purple-700" :
                      key === "auto" ? "bg-indigo-100 border-indigo-200 text-indigo-700" :
                      key === "mini" ? "bg-blue-100 border-blue-200 text-blue-700" :
                      key === "rentals" ? "bg-emerald-100 border-emerald-200 text-emerald-700" :
                      "bg-fuchsia-100 border-fuchsia-200 text-purple-700"
                    }`}>
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-full">
                      {cat.eta}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-purple-600 transition-colors uppercase">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">10KM Estimate</span>
                    <span className="text-base font-bold text-slate-800">₹{rateEst.toFixed(0)}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= AI SMART BOOKING SECTION ================= */}
      <section className="w-full bg-[#f6f6fc]/40 border-y border-slate-200/50 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 w-fit">
              <Activity className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                Autonomous Route Optimizer
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
              AI Route Selection & <br />
              Price Prediction
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              RideX neural networks calculate millisecond road routing based on predictive municipal traffic, local events, weather indices, and energy-grid load factors to offer custom route preferences.
            </p>

            {/* Simulated Route Selection controls */}
            <div className="flex flex-col gap-3 mt-2">
              {[
                { type: "fastest", label: "Fastest Autonomous Path", time: "14 mins", desc: "Optimized for speed. Avoids arterial blockages.", labelClass: "bg-purple-50 text-purple-700 border-purple-100" },
                { type: "eco", label: "Eco-Friendly Mode", time: "18 mins", desc: "Low carbon acceleration path. Saves ~0.8kg CO2.", labelClass: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                { type: "scenic", label: "Low Traffic Scenic Drive", time: "22 mins", desc: "Greenest corridor, smooth speeds, zero toll costs.", labelClass: "bg-blue-50 text-blue-700 border-blue-100" },
              ].map((opt) => (
                <div 
                  key={opt.type}
                  onClick={() => setActiveRouteType(opt.type as any)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    activeRouteType === opt.type
                      ? "bg-white border-purple-500 shadow-md shadow-purple-500/5"
                      : "bg-white/50 border-slate-200/80 hover:bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${opt.labelClass}`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-1">{opt.desc}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-800">{opt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Custom Interactive Map Rendering & Predictor Graph */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Main Light Map Route Canvas */}
            <div className="w-full h-[320px] bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden p-3 relative">
              <div className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                
                {/* SVG Route Visualization Map Grid */}
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  {/* Grid Lines */}
                  <g stroke="#f1f5f9" strokeWidth="1">
                    <path d="M 0,50 L 400,50 M 0,100 L 400,100 M 0,150 L 400,150 M 0,200 L 400,200 M 0,250 L 400,250" />
                    <path d="M 50,0 L 50,400 M 100,0 L 100,400 M 150,0 L 150,400 M 200,0 L 200,400 M 250,0 L 250,400 M 300,0 L 300,400 M 350,0 L 350,400" />
                  </g>

                  {/* Rivers / Parks */}
                  <rect x="220" y="30" width="80" height="50" rx="10" fill="rgba(16, 185, 129, 0.05)" />
                  <path d="M 0,120 Q 150,140 220,100 T 400,160" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="12" strokeLinecap="round" />

                  {/* Roads */}
                  <path d="M 40,220 L 360,220 M 60,60 L 60,260 M 340,60 L 340,260" fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />

                  {/* Alternate routes based on selected tab */}
                  {/* Eco-Friendly curve */}
                  <path 
                    d="M 60,220 Q 160,110 240,260 T 340,140" 
                    fill="none" 
                    stroke={activeRouteType === "eco" ? "#10b981" : "#e2e8f0"} 
                    strokeWidth={activeRouteType === "eco" ? "4.5" : "3.5"} 
                    strokeLinecap="round" 
                    className="transition-all duration-300"
                  />
                  {/* Scenic Route */}
                  <path 
                    d="M 60,220 C 130,300 240,60 340,140" 
                    fill="none" 
                    stroke={activeRouteType === "scenic" ? "#3b82f6" : "#e2e8f0"} 
                    strokeWidth={activeRouteType === "scenic" ? "4.5" : "3.5"} 
                    strokeLinecap="round" 
                    className="transition-all duration-300"
                  />
                  {/* Fastest Route */}
                  <path 
                    d="M 60,220 C 130,130 220,190 340,140" 
                    fill="none" 
                    stroke={activeRouteType === "fastest" ? "#8b5cf6" : "#e2e8f0"} 
                    strokeWidth={activeRouteType === "fastest" ? "4.5" : "3.5"} 
                    strokeLinecap="round" 
                    className="transition-all duration-300"
                  />

                  {/* Pins */}
                  <circle cx="60" cy="220" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="340" cy="140" r="5" fill="#ec4899" stroke="#fff" strokeWidth="1.5" />
                  
                  {/* Labels */}
                  <text x="60" y="205" fontSize="8" fontWeight="bold" fill="#3b82f6" textAnchor="middle">PICKUP</text>
                  <text x="340" y="125" fontSize="8" fontWeight="bold" fill="#ec4899" textAnchor="middle">DESTINATION</text>

                </svg>

                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur border border-slate-200/50 py-1.5 px-3 rounded-xl text-[10px] text-slate-500 font-semibold shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" /> Active route optimization path visible
                </div>
              </div>
            </div>

            {/* Price prediction chart (demonstrating dynamic rates over next 6 hours) */}
            <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Predictive Pricing Model</h4>
                  <h5 className="text-base font-bold text-slate-800 tracking-tight">Dynamic cost variation forecast</h5>
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-2 py-0.5">
                  Peak hour prediction model
                </span>
              </div>

              {/* Dynamic SVG pricing graph */}
              <div className="w-full h-[80px] bg-slate-50/50 border border-slate-100 rounded-2xl relative p-1">
                <svg className="w-full h-full" viewBox="0 0 350 70" preserveAspectRatio="none">
                  {/* Grid Lines horizontal */}
                  <line x1="0" y1="20" x2="350" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="45" x2="350" y2="45" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Custom pricing prediction line graph */}
                  <path 
                    d="M 0,45 Q 60,10 110,50 T 220,15 T 350,55" 
                    fill="none" 
                    stroke="url(#purpleGrad)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />
                  {/* Shaded gradient area */}
                  <path 
                    d="M 0,45 Q 60,10 110,50 T 220,15 T 350,55 L 350,70 L 0,70 Z" 
                    fill="url(#purpleGlowArea)" 
                    opacity="0.08" 
                  />

                  {/* Gradients declaration */}
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <linearGradient id="purpleGlowArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Highlighting markers for peak times */}
                  <circle cx="70" cy="20" r="4.5" fill="#8b5cf6" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="215" cy="15" r="4.5" fill="#ec4899" stroke="#fff" strokeWidth="1.5" />
                </svg>

                {/* X Axis time labels */}
                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2.5 mt-1">
                  <span>14:00 (Base)</span>
                  <span>16:00 (Peak 1.3x)</span>
                  <span>18:00 (Base)</span>
                  <span>20:00 (Peak 1.5x)</span>
                  <span>22:00 (Settle)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= LIVE RIDE TRACKING SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column Mock Mobile phone */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="w-[310px] h-[610px] bg-slate-900 rounded-[50px] p-3 shadow-2xl relative border-[5px] border-slate-800">
            {/* Dynamic notch overlay */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-800 rounded-full z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-950" />
            </div>

            {/* Main Simulated App Screen interface */}
            <div className="w-full h-full bg-[#fafaff] rounded-[40px] overflow-hidden relative border border-slate-950/20 flex flex-col justify-between">
              
              {/* Header inside simulated screen */}
              <div className="p-4 pt-10 bg-white border-b border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-purple-600 block">En Route</span>
                  <span className="text-xs font-bold text-slate-800">Trip RIDEX-8893</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-500 animate-pulse" /> 4.2 Mins Left
                  </span>
                </div>
              </div>

              {/* Map visual section */}
              <div className="flex-1 bg-slate-100 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 250 320">
                  {/* Simulated map route */}
                  <path d="M 30,150 L 300,150 M 30,80 Q 90,30 180,240 T 230,100" fill="transparent" stroke="#ddd" strokeWidth="5" strokeLinecap="round" />
                  <path d="M 30,80 Q 90,30 180,240 T 230,100" fill="transparent" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 7" />

                  {/* Pickup and Destination markers */}
                  <circle cx="30" cy="80" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="215" cy="140" r="5" fill="#ec4899" stroke="#fff" strokeWidth="1.5" />

                  {/* Animated vehicle point */}
                  <g transform={`translate(${currentVehiclePos.x / 1.15}, ${currentVehiclePos.y / 1.6 + 40})`}>
                    <circle cx="0" cy="0" r="7.5" fill="#a855f7" stroke="#fff" strokeWidth="1.5" className="glow-purple shadow-md" />
                    <circle cx="0" cy="0" r="14" fill="transparent" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1.2" className="animate-ping" />
                  </g>
                </svg>

                {/* Tracking controls on phone screen */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/50 shadow-md">
                  <span className="text-[10px] text-slate-500 font-semibold">Active simulation</span>
                  <button 
                    onClick={() => setSimPlaying(!simPlaying)}
                    className="px-2.5 py-1 text-[9px] font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all rounded"
                  >
                    {simPlaying ? "PAUSE SIM" : "PLAY SIM"}
                  </button>
                </div>
              </div>

              {/* Bottom Sheet Card on simulated phone screen */}
              <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
                {/* Driver information */}
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                    alt="Driver avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-100"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Vikram Solanki</span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 flex items-center gap-0.5">
                        ★ 4.9
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Electric SUV · HR-55-E-9032</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-slate-500" /> Share Trip
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-red-50 border border-red-100 text-[11px] font-bold text-red-500 hover:bg-red-100/60 transition-all flex items-center justify-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> SOS Alert
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column Content details */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 w-fit">
            <Smartphone className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              Millisecond Telemetry Sync
            </span>
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Live Ride Tracking & <br />
            Instant Route Guardian
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            Never guess where your ride is. Share your realtime location coordinates with family in one click, view active speeds, and monitor automated detours via the RideX Route Guardian.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            {[
              {
                title: "Live GPS Sync",
                desc: "Sub-second refresh rates ensure visual alignment of driver location map dots.",
                icon: <Navigation className="w-5 h-5 text-purple-600 rotate-45" />
              },
              {
                title: "Security Link Share",
                desc: "Send unique live tracking link nodes to family. Operates inside any browser.",
                icon: <Share2 className="w-5 h-5 text-indigo-600" />
              },
              {
                title: "Safety Corridor Alarm",
                desc: "Alerts triggers automatically if vehicles deviate from planned directions.",
                icon: <ShieldAlert className="w-5 h-5 text-blue-600" />
              },
              {
                title: "EV Carbon Savings Counter",
                desc: "Watch estimated carbon reductions accumulate in real-time during your active trip.",
                icon: <Zap className="w-5 h-5 text-emerald-600" />
              }
            ].map((feat) => (
              <div key={feat.title} className="flex gap-4">
                <div className="p-3 bg-white border border-slate-200/60 rounded-2xl h-fit shadow-sm">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">{feat.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ================= SAFETY FEATURES SECTION ================= */}
      <section className="w-full bg-[#f8fafc]/40 border-y border-slate-200/60 py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">Absolute Security</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Safety features designed for trust
            </h3>
            <p className="text-sm text-slate-500 mt-3">
              We leverage military-grade cryptography, verified driver networks, and live guardian AI loops to secure every kilometer.
            </p>
          </div>

          {/* Safety Features Grid (SOS Demo and highlights) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Interactive SOS widget */}
            <div className="lg:col-span-5 w-full bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 relative">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase animate-pulse">
                Interactive SOS Demo
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-2">Simulate Safety SOS</h4>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Click the button below to test how our platform dispatches safety signals to local emergency support networks.
              </p>

              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <AnimatePresence mode="wait">
                  {sosStatus === "idle" ? (
                    <motion.button
                      key="sos-idle"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95 }}
                      onClick={handleSOS}
                      className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs shadow-lg shadow-red-500/30 flex items-center justify-center border-4 border-red-200 cursor-pointer hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                    >
                      Hold SOS
                    </motion.button>
                  ) : (
                    <motion.div
                      key="sos-triggered"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center animate-bounce">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-800 block">SOS SIGNAL SENT</span>
                        <span className="text-[10px] text-slate-500">Dispatching safety coordinators to your GPS location...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Safety Highlights details */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Verified Drivers",
                  desc: "Multi-layered biometric checks, identity mapping, and background safety reviews on all drivers.",
                  icon: <CheckCircle className="w-5 h-5 text-purple-600" />
                },
                {
                  title: "AI Route Guardian",
                  desc: "Our neural network detects unusual stationary states or route alterations automatically.",
                  icon: <Activity className="w-5 h-5 text-indigo-600" />
                },
                {
                  title: "Masked Contact Details",
                  desc: "Full voice call encryption. Your personal cell numbers are never visible to the driver.",
                  icon: <Smartphone className="w-5 h-5 text-blue-600" />
                },
                {
                  title: "24/7 Command Support",
                  desc: "Dedicated internal safety desk monitors active warnings and alerts local emergency responders.",
                  icon: <Shield className="w-5 h-5 text-emerald-600" />
                }
              ].map((item) => (
                <div key={item.title} className="bg-white/80 p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-2">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ================= DRIVER BENEFITS SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column content details */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 w-fit">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              Pioneering Partner Ecosystem
            </span>
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Drive With Pride. <br />
            Earn With Transparency.
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            We value the partner network. RideX offers industry-best commission slabs, instant digital payouts, medical coverage benefits, and zero-commission introductory weeks for all new electric vehicle drivers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {[
              "0% Commission Introductory Promo",
              "Instant Daily Digital Cashouts",
              "Accidental & Family Health Cover",
              "Flexible Custom Hours & Slabs"
            ].map((p) => (
              <div key={p} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-700">{p}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <Link 
              href="/driver"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/10 hover:scale-[1.01] transition-all"
            >
              Apply as Driver Partner
            </Link>
            <a 
              href="#driver-calc"
              className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Earnings Calculator
            </a>
          </div>
        </div>

        {/* Right Column Income calculator widget */}
        <div id="driver-calc" className="lg:col-span-5 w-full bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 relative">
          <div className="absolute top-4 right-4 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase">
            Income Calculator
          </div>
          
          <h4 className="text-base font-bold text-slate-800 mb-2">Estimate Your Earnings</h4>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Drag the parameters below to calculate potential monthly income Net earnings after basic commission fees.
          </p>

          <div className="flex flex-col gap-5">
            {/* Hours worked per day */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                <span>HOURS PER DAY</span>
                <span className="text-purple-600 font-bold">{driverHours} Hrs</span>
              </div>
              <input
                type="range"
                min="4"
                max="14"
                value={driverHours}
                onChange={(e) => setDriverHours(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Days worked per month */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                <span>DAYS PER MONTH</span>
                <span className="text-purple-600 font-bold">{driverDays} Days</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                value={driverDays}
                onChange={(e) => setDriverDays(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            <hr className="border-slate-100" />

            {/* Output Net calculation */}
            <div className="p-4 bg-purple-50/50 border border-purple-100/50 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Net Est. Monthly Payout</span>
                <span className="text-2xl font-extrabold text-slate-800">
                  ₹{(driverHours * driverDays * hourlyRate).toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-emerald-600 block uppercase">Net Net Fuel Saving</span>
                <span className="text-xs font-bold text-emerald-600">EV Fleet Benefit</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ================= APP DOWNLOAD CTA SECTION ================= */}
      <section className="w-full bg-gradient-to-tr from-purple-50/40 via-indigo-50/20 to-blue-50/40 border-y border-slate-200/50 py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column downloads detail */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Ready to move? <br />
              <span className="text-gradient-purple-blue">Download the App Now.</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              Access AI smart dispatching, custom route profiles, direct safety links, and dynamic carbon calculators right in your hand. Available free for iOS and Android devices.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <button className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl border border-slate-800 shadow-md hover:scale-[1.01] active:scale-98 transition-all cursor-pointer">
                <Smartphone className="w-6 h-6 text-white" />
                <div className="text-left">
                  <span className="text-[9px] block text-slate-400 uppercase font-mono">Download on</span>
                  <span className="text-xs font-bold block">Apple App Store</span>
                </div>
              </button>

              <button className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl border border-slate-800 shadow-md hover:scale-[1.01] active:scale-98 transition-all cursor-pointer">
                <Zap className="w-6 h-6 text-yellow-400" />
                <div className="text-left">
                  <span className="text-[9px] block text-slate-400 uppercase font-mono">Download on</span>
                  <span className="text-xs font-bold block">Google Play Store</span>
                </div>
              </button>
            </div>

            <div className="flex gap-6 mt-4">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> iOS 16+ verified
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Android 11+ verified
              </span>
            </div>
          </div>

          {/* Right Column App UI Preview Frame */}
          <div className="lg:col-span-5 flex justify-center w-full relative">
            
            {/* Background design glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none -z-10 animate-pulse" />

            <div className="w-[260px] h-[480px] bg-slate-900 rounded-[40px] p-2.5 border-4 border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
              {/* Device Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-20" />

              {/* Simulated UI Screen App onboarding */}
              <div className="w-full h-full bg-[#fafaff] rounded-[30px] overflow-hidden p-6 flex flex-col justify-between pt-10">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 bg-purple-100 rounded-lg border border-purple-200">
                    <Navigation className="w-4 h-4 text-purple-600 rotate-45" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 tracking-tight">RIDE<span className="text-purple-600">X</span></span>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center border border-purple-200">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-800 leading-tight">Move through the city.</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1">Get verified EV SUV cabs and smart bike rentals at transparent AI optimized rates.</p>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-purple-500/10">
                    Get Verification Code <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-[8px] text-slate-400 uppercase font-mono block">By signing up you agree to Terms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3">Community Voices</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by modern commuters
          </h3>
          <p className="text-sm text-slate-500 mt-3">
            Read experience reports from early adopters of the RideX premium smart mobility ecosystem.
          </p>
        </div>

        {/* Carousel / Slider testimonials card layout */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-card-light p-8 rounded-[32px] border border-slate-200/80 shadow-md relative min-h-[220px] flex flex-col justify-between">
            <span className="text-6xl font-extrabold text-purple-100 absolute top-4 left-6 pointer-events-none -z-10">“</span>
            
            <p className="text-sm md:text-base text-slate-700 italic leading-relaxed z-10 relative">
              {testimonials[activeTestimonial].quote}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <img 
                  src={testimonials[activeTestimonial].avatar} 
                  alt={testimonials[activeTestimonial].name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {testimonials[activeTestimonial].name}, {testimonials[activeTestimonial].age}
                  </h4>
                  <span className="text-[10px] text-slate-500 block">
                    {testimonials[activeTestimonial].role} · {testimonials[activeTestimonial].location}
                  </span>
                </div>
              </div>

              {/* Star reviews rating */}
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial slider navigation dots */}
          <div className="flex justify-center gap-2.5 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  activeTestimonial === index 
                    ? "bg-purple-600 w-6" 
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= STICKY MOBILE DOCK shortcut ================= */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/80 rounded-full px-5 py-2.5 flex items-center gap-5 z-40 lg:hidden">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Active fare locked</span>
        </div>
        <button 
          onClick={() => {
            const el = document.getElementById("book-now");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-4 py-2 bg-purple-600 text-white font-extrabold text-[10px] uppercase rounded-full shadow-md shadow-purple-500/20"
        >
          Book Now
        </button>
      </div>

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
              <h3 className="text-lg font-bold text-slate-800 mb-1">Ride Reserved Successfully!</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Your dispatch route is synchronized. A Prime {vehicleCategories[vehicleType].name} has been assigned to your pickup point at {pickup}.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-left mb-6 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Driver Partner: Vikram S.</span>
                  <span className="text-[10px] text-slate-500">Tesla Model Y · HR-55-E-9032</span>
                </div>
                <span className="text-purple-600 font-extrabold">ETA: 4 Mins</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-purple-500/10"
                >
                  Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

