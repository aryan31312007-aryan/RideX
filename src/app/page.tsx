"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Bike, Car, Navigation, Zap, Shield, MapPin, ArrowRight, Star, Clock, 
  Heart, ShieldAlert, CheckCircle, ChevronRight, Sliders, Award, DollarSign, 
  Smartphone, Activity, Compass, Users, Sparkles, AlertCircle, Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebase } from "@/context/FirebaseContext";

export default function LandingPage() {
  const { user, profile } = useFirebase();

  // Page-level styling reset
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

  // State management for booking card
  const [pickup, setPickup] = useState("Connaught Place, New Delhi");
  const [drop, setDrop] = useState("Indira Gandhi Airport, Delhi");
  const [vehicleType, setVehicleType] = useState<"bike" | "auto" | "mini" | "rentals" | "ev">("mini");
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"ride" | "delivery" | "transport">("ride");

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
    <div className="bg-[#fafaff] text-slate-800 min-h-screen relative font-sans overflow-x-hidden">
      
      {/* ================= HERO SECTION (CINEMATIC) ================= */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden py-16 px-6 md:px-12 w-full bg-gradient-to-b from-[#fafaff] to-white border-b border-slate-100">
        {/* Ambient background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full relative z-10">
          {/* Left Column: Heading, Subheading, Badges */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-20">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Your Ride. Your City.<br />
              <span className="text-[#eab308]">Ridex Karo. Aage Bado.</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-500 max-w-xl leading-relaxed font-medium">
              Book rides, delivery & transport in seconds.<br className="hidden sm:inline" />
              Safe, reliable & affordable – always!
            </p>

            {/* Badges row */}
            <div className="flex flex-wrap gap-3 mt-2">
              {[
                { label: "Verified Drivers", icon: <Shield className="w-4.5 h-4.5 text-[#eab308]" /> },
                { label: "Live Tracking", icon: <Navigation className="w-4.5 h-4.5 text-[#eab308] rotate-45" /> },
                { label: "Transparent Pricing", icon: <DollarSign className="w-4.5 h-4.5 text-[#eab308]" /> },
                { label: "24x7 Support", icon: <Clock className="w-4.5 h-4.5 text-[#eab308]" /> }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-xs font-bold text-slate-700">
                  {badge.icon}
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Booking Card */}
          <div className="lg:col-span-5 w-full relative z-20">
            <div className="w-full max-w-md ml-auto bg-white p-6 rounded-3xl border border-slate-100 shadow-xl flex flex-col gap-5 text-left">
              {/* Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                {[
                  { id: "ride", label: "Ride", icon: <Car className="w-4 h-4" /> },
                  { id: "delivery", label: "Delivery", icon: <Activity className="w-4 h-4" /> },
                  { id: "transport", label: "Transport", icon: <Bike className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-white text-slate-800 shadow-sm border border-slate-100"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleBookRide} className="flex flex-col gap-4">
                {/* Pickup Location */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Pickup Location</label>
                  <div className="relative">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute left-3.5 top-4 border-2 border-white" />
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#fbbf24] text-xs text-slate-800 transition-all font-semibold"
                      placeholder="Enter pickup location"
                      required
                    />
                    <button type="button" className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-650">
                      <Navigation className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                </div>

                {/* Drop Location */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Drop Location</label>
                  <div className="relative">
                    <span className="w-2 h-2 rounded-full bg-red-500 absolute left-3.5 top-4 border-2 border-white" />
                    <input
                      type="text"
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                      className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#fbbf24] text-xs text-slate-800 transition-all font-semibold"
                      placeholder="Enter drop location"
                      required
                    />
                    <button type="button" className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-650 font-bold text-lg">
                      +
                    </button>
                  </div>
                </div>

                {/* Two Column details: Vehicle type & Payment */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as any)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none text-xs text-slate-800 font-semibold"
                    >
                      <option value="mini">Mini</option>
                      <option value="bike">Bike</option>
                      <option value="auto">Auto</option>
                      <option value="ev">Prime EV</option>
                      <option value="rentals">Rentals</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Payment</label>
                    <select
                      className="w-full px-3 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none text-xs text-slate-800 font-semibold"
                    >
                      <option>RIDEX Wallet</option>
                      <option>Credit / Debit Card</option>
                      <option>UPI / Net Banking</option>
                      <option>Cash</option>
                    </select>
                  </div>
                </div>

                {/* Book Ride Button */}
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
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Center centerpiece car illustration overlay */}
        <div className="absolute inset-x-0 bottom-0 top-[20%] z-0 flex justify-center items-center pointer-events-none opacity-90">
          <img 
            src="/ridex_hero_car.png" 
            alt="RIDEX Premium Sedan" 
            className="w-full max-w-4xl object-contain object-bottom translate-y-[10%]"
          />
        </div>
      </section>

      {/* ================= CHOOSE YOUR SERVICE GRID ================= */}
      <section id="categories" className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Choose Your Service</h2>
          </div>
          <Link href="/services" className="text-xs font-bold text-[#eab308] hover:text-[#d97706] flex items-center gap-0.5">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Bike", desc: "Fast & Affordable", icon: <Bike className="w-6 h-6 text-yellow-600" />, bg: "bg-yellow-50/50", tab: "ride", type: "bike" },
            { title: "Auto", desc: "Quick & Easy", icon: <Compass className="w-6 h-6 text-amber-600" />, bg: "bg-amber-50/50", tab: "ride", type: "auto" },
            { title: "Cab", desc: "Comfort Rides", icon: <Car className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50/50", tab: "ride", type: "mini" },
            { title: "Premium", desc: "Luxury Rides", icon: <Zap className="w-6 h-6 text-purple-600" />, bg: "bg-purple-50/50", tab: "ride", type: "ev" },
            { title: "Parcel", desc: "Send Anything", icon: <Activity className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-50/50", tab: "delivery", type: "mini" },
            { title: "Food", desc: "Food Delivery", icon: <Heart className="w-6 h-6 text-red-600" />, bg: "bg-red-50/50", tab: "delivery", type: "mini" },
            { title: "Mini Truck", desc: "For Small Load", icon: <Sliders className="w-6 h-6 text-orange-600" />, bg: "bg-orange-50/50", tab: "transport", type: "mini" },
            { title: "Pickup", desc: "Move Anything", icon: <Navigation className="w-6 h-6 text-indigo-600 rotate-45" />, bg: "bg-indigo-50/50", tab: "transport", type: "mini" },
            { title: "Tempo", desc: "For Large Load", icon: <Users className="w-6 h-6 text-teal-600" />, bg: "bg-teal-50/50", tab: "transport", type: "mini" },
          ].map((service, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setActiveTab(service.tab as any);
                setVehicleType(service.type as any);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${service.bg} transition-transform group-hover:scale-105 duration-300`}>
                  {service.icon}
                </div>
                <div className="text-left">
                  <h4 className="text-base font-bold text-slate-800">{service.title}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{service.desc}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#fbbf24] group-hover:text-slate-900 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SAFETY YOU CAN TRUST ================= */}
      <section id="safety" className="max-w-7xl mx-auto px-6 py-16 w-full border-t border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Safety You Can Trust</h2>
          </div>
          <Link href="/safety" className="text-xs font-bold text-[#eab308] hover:text-[#d97706] flex items-center gap-0.5">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Circular icons row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-12">
          {[
            { label: "SOS Emergency", name: "SOS", icon: <ShieldAlert className="w-6 h-6 text-red-500" />, bg: "bg-red-50" },
            { label: "Live Location", name: "Live Location", icon: <MapPin className="w-6 h-6 text-emerald-500" />, bg: "bg-emerald-50" },
            { label: "Driver Verification", name: "Driver Verification", icon: <Users className="w-6 h-6 text-blue-500" />, bg: "bg-blue-50" },
            { label: "Ride Insurance", name: "Ride Insurance", icon: <Shield className="w-6 h-6 text-indigo-500" />, bg: "bg-indigo-50" },
            { label: "Women Safety Mode", name: "Women Safety Mode", icon: <Heart className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50" },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center text-center gap-2.5 cursor-pointer group"
              onClick={item.name === "SOS" ? handleSOS : undefined}
            >
              <div className={`w-14 h-14 rounded-full ${item.bg} flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-all shadow-sm`}>
                {item.icon}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{item.name}</span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Platform Card */}
        <div className="w-full bg-white border border-slate-100 rounded-[32px] p-8 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative shadow-sm">
          <div className="md:col-span-7 flex flex-col gap-4 text-left relative z-10">
            <span className="text-xs font-bold text-[#eab308] uppercase tracking-wider">RIDEX SAFETY</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
              India's Safer Rides Platform
            </h3>
            <p className="text-sm text-slate-455 leading-relaxed max-w-md font-medium">
              Your safety is our highest priority. We use verified drivers, live tracking algorithms, and instant emergency alerts to secure every single trip.
            </p>
            <button 
              onClick={() => setShowBookingModal(true)} 
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold w-fit mt-2 transition-all cursor-pointer"
            >
              Know More
            </button>
          </div>
          <div className="md:col-span-5 flex justify-center relative">
            <img 
              src="/ridex_safety_banner.png" 
              alt="Safety Platform Banner" 
              className="w-full max-w-xs object-contain"
            />
          </div>
        </div>
      </section>

      {/* ================= APP PROMOTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-slate-100">
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
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
              <li key={idx} className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                {bullet}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 mt-2">
            <button className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-950 transition-all cursor-pointer">
              <svg className="w-5 h-5 fill-current text-[#fbbf24]" viewBox="0 0 24 24">
                <path d="M5 3c-.28 0-.5.22-.5.5v17c0 .28.22.5.5.5.15 0 .28-.06.38-.16l9.62-9.62-9.62-9.62c-.1-.1-.23-.16-.38-.16zM16 11.25l-2.25 2.25 2.25 2.25c.41-.41.41-1.09 0-1.5l-1.5-1.5 1.5-1.5zm.75.75c0 .28-.11.53-.3.72l-2.28 2.28c-.39.39-1.02.39-1.41 0l-2.28-2.28c-.39-.39-.39-1.02 0-1.41l2.28-2.28c.39-.39 1.02-.39 1.41 0l2.28 2.28c.19.19.3.44.3.72z" />
              </svg>
              <div className="text-left leading-none">
                <span className="text-[8px] block text-slate-400 uppercase font-mono">Get it on</span>
                <span className="text-xs font-bold block mt-0.5">Google Play</span>
              </div>
            </button>

            <button className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-950 transition-all cursor-pointer">
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.94-1.39" />
              </svg>
              <div className="text-left leading-none">
                <span className="text-[8px] block text-slate-400 uppercase font-mono">Download on the</span>
                <span className="text-xs font-bold block mt-0.5">App Store</span>
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
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#eab308] block">Tracking</span>
                  <span className="text-[10px] font-bold text-slate-800">Trip RIDEX-2026</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-slate-800 flex items-center gap-0.5">
                    <Clock className="w-3 h-3 text-[#eab308] animate-pulse" /> 3.5 Mins
                  </span>
                </div>
              </div>

              {/* Live SVG Map */}
              <div className="flex-1 bg-slate-100 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 240 320">
                  <path d="M 0,40 L 240,40 M 0,120 L 240,120 M 0,200 L 240,200 M 0,280 L 240,280 M 60,0 L 60,320 M 140,0 L 140,320 M 200,0 L 200,320" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Route path */}
                  <path d="M 40,240 Q 120,40 200,160" fill="transparent" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 40,240 Q 120,40 200,160" fill="transparent" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 7" />

                  {/* Pickup & Drop markers */}
                  <circle cx="40" cy="240" r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="200" cy="160" r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />

                  {/* Car dot moving */}
                  <g transform={`translate(${currentVehiclePos.x * 0.7 + 10}, ${currentVehiclePos.y * 0.8 + 40})`}>
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
      <section className="w-full bg-[#f8fafc] border-y border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: "1M+", label: "Happy Users", icon: <Users className="w-5 h-5 text-[#eab308] mx-auto mb-1" /> },
              { stat: "50K+", label: "Verified Drivers", icon: <CheckCircle className="w-5 h-5 text-[#eab308] mx-auto mb-1" /> },
              { stat: "10M+", label: "Rides Completed", icon: <Navigation className="w-5 h-5 text-[#eab308] rotate-45 mx-auto mb-1" /> },
              { stat: "200+", label: "Cities Covered", icon: <Compass className="w-5 h-5 text-[#eab308] mx-auto mb-1" /> },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                {stat.icon}
                <span className="text-2xl font-black text-slate-800">{stat.stat}</span>
                <span className="text-xs text-slate-450 font-bold">{stat.label}</span>
              </div>
            ))}
          </div>

          <hr className="border-slate-200/50" />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { title: "No Hidden Charges", desc: "What you see is what you pay", icon: <DollarSign className="w-5 h-5 text-[#eab308]" /> },
              { title: "Clean & Safe Rides", desc: "Well maintained vehicles", icon: <Shield className="w-5 h-5 text-[#eab308]" /> },
              { title: "Top Rated Drivers", desc: "Trained & professional", icon: <Star className="w-5 h-5 text-[#eab308] fill-[#eab308]" /> },
              { title: "24x7 Customer Support", desc: "We're always here to help", icon: <Clock className="w-5 h-5 text-[#eab308]" /> },
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
            <Link href="/reviews" className="text-xs font-bold text-[#eab308] hover:text-[#d97706] flex items-center gap-0.5">
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
          {/* Blue gift box decorative image */}
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
              className="px-6 py-3 rounded-xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-900 text-xs font-bold transition-all shadow-md shadow-[#fbbf24]/10 cursor-pointer"
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
              className="bg-red-500 border border-red-600 text-white font-bold text-xs px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3"
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
