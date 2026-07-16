"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bike, Car, Navigation, Zap, Shield, MapPin, ArrowRight, Star, Clock,
  Heart, ShieldAlert, CheckCircle, ChevronRight, Sliders, DollarSign,
  Smartphone, Activity, Compass, Users, CheckCircle2, Map, Bell, HelpCircle,
  QrCode, ArrowUpRight, Wallet, History, X, Plus, AlertCircle, Play, Pause, ChevronDown, Check,
  User, Send, Landmark, RefreshCw, BarChart2, Briefcase, Award, ArrowDownLeft, CreditCard, Tv, ZapOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebase } from "@/context/FirebaseContext";
import CinematicCityCanvas from "@/components/layout/CinematicCityCanvas";

// TypeScript interface for dynamic transactions ledger
interface Transaction {
  id: string;
  type: "credit" | "debit";
  title: string;
  desc: string;
  amount: number;
  date: string;
  status: "Success" | "Failed" | "Pending";
  category: "ride" | "wallet" | "transfer" | "utility" | "investment";
}

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

  // Sub-services configurations for transport grids
  const subServices = {
    bike: [
      { id: "scooty", name: "Electric Scooty", base: 15, perKm: 5 },
      { id: "normal_bike", name: "Normal Commuter Bike", base: 20, perKm: 6.5 },
      { id: "super_bike", name: "Super Bike (Sport)", base: 45, perKm: 12 }
    ],
    auto: [
      { id: "e_auto", name: "Electric Auto", base: 30, perKm: 8 },
      { id: "cng_auto", name: "CNG Auto", base: 35, perKm: 9 }
    ],
    cab: [
      { id: "mini_cab", name: "Mini Hatchback Cab", base: 55, perKm: 12 },
      { id: "sedan_cab", name: "Sedan Comfort Cab", base: 75, perKm: 15 },
      { id: "suv_cab", name: "Spacious SUV Cab", base: 110, perKm: 20 }
    ],
    premium: [
      { id: "premium_sedan", name: "Premium Sedan", base: 150, perKm: 28 },
      { id: "tesla_ev", name: "Tesla Prime EV SUV", base: 130, perKm: 24 }
    ],
    parcel: [
      { id: "doc_courier", name: "Instant Doc Courier", base: 40, perKm: 8 },
      { id: "box_express", name: "Medium Box Express", base: 60, perKm: 12 }
    ],
    food: [
      { id: "meal_delivery", name: "Express Meal Delivery", base: 25, perKm: 5 },
      { id: "grocery_express", name: "Fresh Grocery", base: 30, perKm: 6 }
    ],
    mini_truck: [
      { id: "tata_ace", name: "Tata Ace (Mini Truck)", base: 180, perKm: 22 }
    ],
    pickup: [
      { id: "mahindra_pickup", name: "Mahindra Pickup", base: 220, perKm: 25 }
    ],
    tempo: [
      { id: "force_tempo", name: "Force Tempo", base: 280, perKm: 30 }
    ]
  };

  // State Management for Screen & Wealth Portals (FinTech switch)
  const [activeScreen, setActiveScreen] = useState<"home" | "services" | "wealth" | "history">("home");
  
  // Wallet & Bank Balances
  const [balance, setBalance] = useState(240);
  const [bankBalance, setBankBalance] = useState(15430);
  const [goldBalance, setGoldBalance] = useState(0.5); // grams
  const [goldValue, setGoldValue] = useState(3750); // ₹ value at 7500 per gram

  // User input states for booking flow
  const [pickup, setPickup] = useState("Connaught Place, New Delhi");
  const [drop, setDrop] = useState("Indira Gandhi Airport, Delhi");
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof subServices>("cab");
  const [selectedSubService, setSelectedSubService] = useState<string>("mini_cab");
  const [paymentSource, setPaymentSource] = useState<"wallet" | "bank">("wallet");
  
  // Modals & Sheets toggles
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [tripStatus, setTripStatus] = useState<"idle" | "booking" | "active">("idle");
  const [sosStatus, setSosStatus] = useState<"idle" | "triggered">("idle");

  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("500");
  const [showWalletActions, setShowWalletActions] = useState(false);
  const [mockAlert, setMockAlert] = useState<string | null>(null);

  // Fintech specific transfers & bills states
  const [showFintechDrawer, setShowFintechDrawer] = useState(false);
  const [fintechDrawerType, setFintechDrawerType] = useState<"contact" | "upi" | "balance" | "recharge" | "gold">("contact");
  const [transferTarget, setTransferTarget] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedUtility, setSelectedUtility] = useState<"mobile" | "dth" | "electricity" | "rent">("mobile");
  
  // Dynamic Transaction Ledger State
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "TXN5832", type: "debit", title: "Mini Cab Booking", desc: "Connaught Place to IGI Airport", amount: 195, date: "Today, 11:20 AM", status: "Success", category: "ride" },
    { id: "TXN5691", type: "credit", title: "Wallet Loaded", desc: "UPI top-up via GPay", amount: 500, date: "Yesterday, 3:15 PM", status: "Success", category: "wallet" },
    { id: "TXN5412", type: "debit", title: "Mobile Recharge", desc: "Jio Prepaid +91 98765 43210", amount: 299, date: "14 Jul, 09:30 AM", status: "Success", category: "utility" },
    { id: "TXN5002", type: "credit", title: "Gold Investment Refund", desc: "PhonePe Wealth Brokerage", amount: 1500, date: "12 Jul, 04:10 PM", status: "Success", category: "investment" }
  ]);

  // Live Map Simulation for Transit Tracking
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

  // Prepend new transactions helper
  const logTransaction = (type: "credit" | "debit", title: string, desc: string, amount: number, category: Transaction["category"]) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTxn: Transaction = {
      id: "TXN" + Math.floor(1000 + Math.random() * 9000),
      type,
      title,
      desc,
      amount,
      date: "Today, " + timeStr,
      status: "Success",
      category
    };
    setTransactions((prev) => [newTxn, ...prev]);
  };

  // Multi-modal Booking Triggers
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
    const fare = getFareValue();
    
    // Check balance
    if (paymentSource === "wallet" && balance < fare) {
      setMockAlert("Insufficient wallet balance! Please add money or choose Bank Account.");
      setTimeout(() => setMockAlert(null), 3500);
      return;
    }
    if (paymentSource === "bank" && bankBalance < fare) {
      setMockAlert("Insufficient bank account balance!");
      setTimeout(() => setMockAlert(null), 3500);
      return;
    }

    setIsBookingLoading(true);
    setTimeout(() => {
      setIsBookingLoading(false);
      setIsBookingOpen(false);
      setTripStatus("active");

      // Deduct balance & log
      if (paymentSource === "wallet") {
        setBalance((b) => Math.max(0, b - fare));
        logTransaction("debit", `${selectedCategory.toUpperCase()} Ride Booked`, `${pickup} to ${drop}`, fare, "ride");
      } else {
        setBankBalance((b) => Math.max(0, b - fare));
        logTransaction("debit", `${selectedCategory.toUpperCase()} Ride Booked`, `${pickup} to ${drop} (SBI Bank)`, fare, "ride");
      }
    }, 1500);
  };

  const handleSOS = () => {
    setSosStatus("triggered");
    setTimeout(() => setSosStatus("idle"), 3000);
    window.dispatchEvent(new CustomEvent("open-sos-modal"));
  };

  const openMockPage = (title: string) => {
    setMockAlert(`Navigating to ${title}. Redirected in simulation.`);
    setTimeout(() => setMockAlert(null), 3000);
  };

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amountToAdd);
    if (!isNaN(parsed) && parsed > 0) {
      if (bankBalance < parsed) {
        setMockAlert("Insufficient Bank balance to top-up wallet!");
        setTimeout(() => setMockAlert(null), 3000);
        return;
      }
      setBalance((b) => b + parsed);
      setBankBalance((b) => b - parsed);
      setShowAddMoneyModal(false);
      logTransaction("credit", "Loaded Wallet", "Transferred from SBI bank", parsed, "wallet");
      setMockAlert(`Successfully added ₹${parsed} to your Wallet!`);
      setTimeout(() => setMockAlert(null), 3000);
    }
  };

  // Fintech Action Triggers
  const openFintechAction = (type: typeof fintechDrawerType, utility?: typeof selectedUtility) => {
    setFintechDrawerType(type);
    if (utility) setSelectedUtility(utility);
    setTransferAmount("");
    setTransferTarget("");
    setShowFintechDrawer(true);
  };

  const handleFintechTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) return;

    if (fintechDrawerType === "contact" || fintechDrawerType === "upi") {
      // Check bank balance
      if (bankBalance < amt) {
        setMockAlert("Insufficient bank account balance!");
        setTimeout(() => setMockAlert(null), 3000);
        return;
      }
      setBankBalance((b) => b - amt);
      logTransaction(
        "debit",
        fintechDrawerType === "contact" ? `Sent to contact` : `Paid to UPI ID`,
        transferTarget,
        amt,
        "transfer"
      );
      setShowFintechDrawer(false);
      setMockAlert(`Successfully transferred ₹${amt}!`);
      setTimeout(() => setMockAlert(null), 3000);
    } 
    else if (fintechDrawerType === "recharge") {
      // Pay via Bank Account
      if (bankBalance < amt) {
        setMockAlert("Insufficient bank account balance!");
        setTimeout(() => setMockAlert(null), 3000);
        return;
      }
      setBankBalance((b) => b - amt);
      logTransaction("debit", `${selectedUtility.toUpperCase()} Payment`, `A/C Number: ${transferTarget}`, amt, "utility");
      setShowFintechDrawer(false);
      setMockAlert(`Successfully paid ₹${amt} utility bill!`);
      setTimeout(() => setMockAlert(null), 3000);
    }
    else if (fintechDrawerType === "gold") {
      // Buy gold
      if (bankBalance < amt) {
        setMockAlert("Insufficient bank balance to buy Gold!");
        setTimeout(() => setMockAlert(null), 3000);
        return;
      }
      const grams = amt / 7500;
      setBankBalance((b) => b - amt);
      setGoldBalance((g) => g + grams);
      setGoldValue((v) => v + amt);
      logTransaction("debit", "Bought Gold", `Added ${grams.toFixed(4)}g at ₹7,500/g`, amt, "investment");
      setShowFintechDrawer(false);
      setMockAlert(`Successfully bought ${grams.toFixed(4)} grams of Gold!`);
      setTimeout(() => setMockAlert(null), 3000);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen relative font-sans overflow-x-hidden flex flex-col justify-center">
      {/* Decorative gradient blur rings */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none hidden lg:block" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-amber-100/40 rounded-full blur-[100px] pointer-events-none hidden lg:block" />

      {/* Main Container Wrapper */}
      <div className="max-w-7xl mx-auto w-full min-h-[92vh] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 px-4 md:px-10 z-10 relative">
        
        {/* ================= LEFT SIDE: PRESENTATION (DESKTOP) ================= */}
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
            PhonePe Inspired <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#a855f7]">
              FinTech & Transit Super-App
            </span>
          </h1>

          <p className="text-base text-slate-500 max-w-lg leading-relaxed font-semibold">
            Experience our upgraded mobile simulator. Manage bank transactions, pay utilities, invest in wealth assets, book multi-modal cabs, and check dynamic history logs.
          </p>

          {/* Live Dispatch Corridor Panel */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-5 shadow-md flex flex-col gap-4 mt-1">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] animate-pulse" />
                Autonomous Corridor Dispatch
              </span>
              <span className="text-[10px] font-bold text-[#7c3aed]">AI Grid Simulator</span>
            </div>
            <div className="w-full h-[220px] rounded-2xl overflow-hidden relative shadow-inner bg-slate-900 border border-slate-950/20">
              <CinematicCityCanvas />
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: SMARTPHONE SIMULATOR (FULL SCREEN ON MOBILE) ================= */}
        <div className="col-span-1 lg:col-span-6 flex justify-center items-center w-full">
          {/* Outer smartphone frame bezel */}
          <div className="w-full max-w-[410px] bg-slate-950 lg:rounded-[48px] lg:p-3 lg:shadow-[0_20px_50px_rgba(109,40,217,0.18)] lg:border-[8px] lg:border-slate-900 relative aspect-[9/19] flex flex-col overflow-hidden">
            
            {/* Screen Inner Wrapper */}
            <div className="flex-grow bg-white text-slate-800 flex flex-col justify-between relative overflow-y-auto scrollbar-none lg:rounded-[38px] max-h-full">
              
              {/* MOCK ALERT NOTIFICATION DRAWER */}
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

              {/* PHONEPE STYLED APPMOBILE HEADER */}
              <div className="px-4 py-3 flex justify-between items-center bg-[#7c3aed] text-white sticky top-0 z-35 border-b border-purple-700/20 shadow-md">
                <div className="flex items-center gap-2.5 text-left">
                  {/* Circle profile logo */}
                  <div
                    onClick={() => openMockPage("Profile Account")}
                    className="w-8.5 h-8.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center font-black text-xs cursor-pointer active:scale-95 transition-all text-purple-100"
                  >
                    VS
                  </div>
                  {/* Location Selector */}
                  <div
                    onClick={() => openMockPage("Location Picker")}
                    className="flex flex-col cursor-pointer active:scale-95 select-none"
                  >
                    <span className="text-[8px] uppercase tracking-widest text-purple-200 font-bold flex items-center gap-0.5">
                      Your Location ▾
                    </span>
                    <span className="text-[10.5px] font-black text-white truncate max-w-[130px]">
                      Connaught Place, Delhi
                    </span>
                  </div>
                </div>

                {/* Header Icons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowQRScanner(true)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer active:scale-90"
                    aria-label="Scanner"
                  >
                    <QrCode className="w-4.5 h-4.5 text-white" />
                  </button>
                  <button
                    onClick={() => openMockPage("Alert Notifications")}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer active:scale-90 relative"
                    aria-label="Notifications"
                  >
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#fbbf24] rounded-full" />
                    <Bell className="w-4.5 h-4.5 text-white" />
                  </button>
                  <button
                    onClick={() => openMockPage("PhonePe Help Desk")}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer active:scale-90"
                    aria-label="Help"
                  >
                    <HelpCircle className="w-4.5 h-4.5 text-white" />
                  </button>
                </div>
              </div>

              {/* DYNAMIC VIEWPORTS SWITCH */}
              <div className="flex-1 overflow-y-auto scrollbar-none pb-18 bg-slate-50/50">
                
                {/* ================= SCREEN 1: HOME PAGE ================= */}
                {activeScreen === "home" && (
                  <div className="flex flex-col gap-3.5">
                    
                    {/* Banners Carousel */}
                    <div className="px-3 pt-3">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-4 text-white relative overflow-hidden flex justify-between items-center min-h-[125px] shadow-sm">
                        <div className="flex flex-col gap-1.5 max-w-[60%] text-left z-10">
                          <span className="text-[9px] font-black tracking-widest text-purple-200 uppercase">SUPER COMMUTE SALE</span>
                          <h3 className="text-xs md:text-sm font-black leading-tight">
                            Your City. Your Ride. <br />
                            Book cabs & recharges in seconds!
                          </h3>
                          <button
                            onClick={() => openBookingFlow("cab")}
                            className="bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-950 px-3 py-1.5 rounded-full text-[9px] font-black w-fit mt-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                          >
                            Commute Now
                          </button>
                        </div>
                        <div className="absolute right-0 bottom-0 top-0 w-[40%] flex items-end justify-end pointer-events-none select-none z-0">
                          <img
                            src="/ridex_hero_car.png"
                            alt="Super App Car"
                            className="object-contain max-h-[85%] translate-y-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PHONEPE CARD 1: TRANSFER MONEY */}
                    <div className="px-3">
                      <div className="bg-white border border-slate-100 rounded-3xl p-3.5 shadow-sm text-left">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-3">Transfer Money</span>
                        
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => openFintechAction("contact")}
                            className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shadow-inner">
                              <User className="w-5.5 h-5.5" />
                            </div>
                            <span className="text-[9px] font-black text-slate-700 text-center leading-tight">To Mobile Number</span>
                          </button>

                          <button
                            onClick={() => openFintechAction("upi")}
                            className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shadow-inner">
                              <Landmark className="w-5.5 h-5.5" />
                            </div>
                            <span className="text-[9px] font-black text-slate-700 text-center leading-tight">To Bank / UPI ID</span>
                          </button>

                          <button
                            onClick={() => openMockPage("To Self Account")}
                            className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shadow-inner">
                              <RefreshCw className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black text-slate-700 text-center leading-tight">To Self Account</span>
                          </button>

                          <button
                            onClick={() => openFintechAction("balance")}
                            className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shadow-inner">
                              <Wallet className="w-5.5 h-5.5" />
                            </div>
                            <span className="text-[9px] font-black text-slate-700 text-center leading-tight">Check Balance</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* PHONEPE CARD 2: RECHARGE & PAY BILLS */}
                    <div className="px-3">
                      <div className="bg-white border border-slate-100 rounded-3xl p-3.5 shadow-sm text-left">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-3">Recharge & Pay Bills</span>
                        
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => openFintechAction("recharge", "mobile")}
                            className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-650 flex items-center justify-center shadow-inner">
                              <Smartphone className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black text-slate-700 text-center leading-tight">Mobile Recharge</span>
                          </button>

                          <button
                            onClick={() => openFintechAction("recharge", "dth")}
                            className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner">
                              <Tv className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black text-slate-700 text-center leading-tight">DTH</span>
                          </button>

                          <button
                            onClick={() => openFintechAction("recharge", "electricity")}
                            className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center shadow-inner">
                              <Zap className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black text-slate-700 text-center leading-tight">Electricity</span>
                          </button>

                          <button
                            onClick={() => openFintechAction("recharge", "rent")}
                            className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-650 flex items-center justify-center shadow-inner">
                              <CreditCard className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black text-slate-700 text-center leading-tight">Rent Payment</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BOOK YOUR RIDE Mobility Panel */}
                    <div className="px-3 text-left">
                      <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Book Your Ride</span>
                        <button onClick={() => setActiveScreen("services")} className="text-[9px] font-extrabold text-[#7c3aed] hover:underline cursor-pointer">View All</button>
                      </div>
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { name: "Bike Commute", image: "🛵", cat: "bike" },
                          { name: "Auto Dispatch", image: "🛺", cat: "auto" },
                          { name: "Cab Services", image: "🚗", cat: "cab" },
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
                            <span className="text-[9px] font-black text-slate-800 tracking-tight mt-0.5 truncate text-center w-full">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* TRANSPORT & LOGISTICS Panel */}
                    <div className="px-3 text-left">
                      <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Logistics & Cargo</span>
                        <button onClick={() => setActiveScreen("services")} className="text-[9px] font-extrabold text-[#7c3aed] hover:underline cursor-pointer">View All</button>
                      </div>
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { name: "Send Parcel", image: "📦", cat: "parcel" },
                          { name: "City Courier", image: "🛵💨", cat: "parcel" },
                          { name: "Mini Truck", image: "🛻", cat: "mini_truck" },
                          { name: "Cargo Tempo", image: "🚛", cat: "tempo" }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => openBookingFlow(item.cat as any)}
                            className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col items-center gap-1 shadow-sm transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                          >
                            <div className="text-xl h-10 w-full flex items-center justify-center bg-slate-50 rounded-xl">
                              {item.image}
                            </div>
                            <span className="text-[9px] font-black text-slate-800 tracking-tight mt-0.5 truncate text-center w-full">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* WALLET PROMO BANNER */}
                    <div className="px-3 text-left">
                      <div className="bg-gradient-to-r from-slate-900 to-purple-950 rounded-3xl p-4 text-white flex justify-between items-center relative overflow-hidden shadow-sm">
                        <div className="flex flex-col gap-1.5 z-10 max-w-[65%]">
                          <span className="text-[9px] font-black text-purple-300 uppercase tracking-widest">RIDEX WALLET PAY</span>
                          <span className="text-xs font-black">Add money instantly from Bank & get 10% cashback.</span>
                          <button
                            onClick={() => setShowAddMoneyModal(true)}
                            className="bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-950 px-3.5 py-1 rounded-full text-[9px] font-black w-fit mt-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                          >
                            Load Wallet →
                          </button>
                        </div>
                        <div className="w-[30%] flex justify-end items-center select-none z-10">
                          <img
                            src="/ridex_refer_gift.png"
                            alt="Wallet Gift Coins"
                            className="w-16 h-16 object-contain scale-[1.25] translate-y-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* TRAVEL & STAY Grid */}
                    <div className="px-3 text-left">
                      <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Travel & Stay Booking</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { name: "Flights", image: "✈️" },
                          { name: "Buses", image: "🚌" },
                          { name: "Trains", image: "🚆" },
                          { name: "Hotels", image: "🏨" }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => openMockPage(item.name)}
                            className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col items-center gap-1 shadow-sm transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                          >
                            <div className="text-xl h-10 w-full flex items-center justify-center bg-slate-50 rounded-xl">
                              {item.image}
                            </div>
                            <span className="text-[9px] font-black text-slate-800 tracking-tight mt-0.5 truncate text-center w-full">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Offers, Rewards & Ads */}
                    <div className="px-3 text-left mb-2">
                      <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Offers & Vouchers</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { name: "Offer Zone", image: "🎁" },
                          { name: "Brand Vouchers", image: "🎫" },
                          { name: "Google Play", image: "🧩" },
                          { name: "Subscriptions", image: "📺" }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => openMockPage(item.name)}
                            className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col items-center gap-1 shadow-sm transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
                          >
                            <div className="text-xl h-10 w-full flex items-center justify-center bg-slate-50 rounded-xl">
                              {item.image}
                            </div>
                            <span className="text-[9px] font-black text-slate-800 tracking-tight mt-0.5 truncate text-center w-full">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ================= SCREEN 2: ALL SERVICES TAB ================= */}
                {activeScreen === "services" && (
                  <div className="p-3.5 flex flex-col gap-4 text-left">
                    <h3 className="text-sm font-black text-slate-900 tracking-tight border-b border-slate-100 pb-2">All App Services</h3>
                    
                    {/* section: payments */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider">Banking & Transfers</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: "Send to Contact", icon: <User className="w-5.5 h-5.5 text-purple-600" />, action: "contact" },
                          { name: "Send to UPI/Bank", icon: <Landmark className="w-5.5 h-5.5 text-purple-600" />, action: "upi" },
                          { name: "Check Bank Balance", icon: <Wallet className="w-5.5 h-5.5 text-purple-600" />, action: "balance" }
                        ].map((s, i) => (
                          <button
                            key={i}
                            onClick={() => openFintechAction(s.action as any)}
                            className="bg-white border border-slate-100 p-2.5 rounded-2xl shadow-sm/50 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            {s.icon}
                            <span className="text-[9px] font-black text-slate-700 text-center leading-tight">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* section: recharges */}
                    <div className="flex flex-col gap-2 mt-1">
                      <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider">Recharge & Utilities</span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { name: "Mobile", icon: <Smartphone className="w-4.5 h-4.5 text-blue-500" />, key: "mobile" },
                          { name: "DTH", icon: <Tv className="w-4.5 h-4.5 text-orange-500" />, key: "dth" },
                          { name: "Electricity", icon: <Zap className="w-4.5 h-4.5 text-yellow-500" />, key: "electricity" },
                          { name: "Rent", icon: <CreditCard className="w-4.5 h-4.5 text-emerald-500" />, key: "rent" }
                        ].map((s, i) => (
                          <button
                            key={i}
                            onClick={() => openFintechAction("recharge", s.key as any)}
                            className="bg-white border border-slate-100 p-2 rounded-2xl shadow-sm/50 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            {s.icon}
                            <span className="text-[8.5px] font-black text-slate-700 text-center leading-none">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* section: ride comm */}
                    <div className="flex flex-col gap-2 mt-1">
                      <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider">Cab & Bike Transit</span>
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { name: "Bike Commute", image: "🛵", cat: "bike" },
                          { name: "CNG Auto", image: "🛺", cat: "auto" },
                          { name: "Sedan Cab", image: "🚗", cat: "cab" },
                          { name: "Premium Sedan", image: "👑🚗", cat: "premium" }
                        ].map((s, i) => (
                          <button
                            key={i}
                            onClick={() => openBookingFlow(s.cat as any)}
                            className="bg-white border border-slate-100 p-2 rounded-2xl shadow-sm/50 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <span className="text-xl">{s.image}</span>
                            <span className="text-[8.5px] font-black text-slate-700 text-center leading-none">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* section: logistics */}
                    <div className="flex flex-col gap-2 mt-1">
                      <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider">Instant Cargo Courier</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: "Instant Parcel", image: "📦", cat: "parcel" },
                          { name: "Mini Truck", image: "🛻", cat: "mini_truck" },
                          { name: "Cargo Tempo", image: "🚛", cat: "tempo" }
                        ].map((s, i) => (
                          <button
                            key={i}
                            onClick={() => openBookingFlow(s.cat as any)}
                            className="bg-white border border-slate-100 p-2.5 rounded-2xl shadow-sm/50 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <span className="text-xl">{s.image}</span>
                            <span className="text-[9px] font-black text-slate-700 text-center leading-tight">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= SCREEN 3: WEALTH & INVESTMENTS ================= */}
                {activeScreen === "wealth" && (
                  <div className="p-3.5 flex flex-col gap-4 text-left">
                    
                    {/* Header summary */}
                    <div className="bg-gradient-to-br from-indigo-900 to-[#7c3aed] rounded-3xl p-4.5 text-white shadow-sm flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-purple-200 font-bold">Total Portfolio Value</span>
                        <span className="text-2xl font-black mt-1">₹{(bankBalance + goldValue + 12000).toLocaleString("en-IN")}</span>
                        <span className="text-[8px] text-emerald-400 font-extrabold mt-1">▲ +8.4% (All time returns)</span>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Interactive Assets: Gold Vault */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🪙</span>
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-900">24K Digital Gold</span>
                            <span className="text-[8px] text-slate-400 font-bold">Accumulated Weight</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 block">{goldBalance.toFixed(4)} grams</span>
                          <span className="text-[10px] font-black text-amber-600 block mt-0.5">Value: ₹{goldValue.toFixed(0)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 border-t border-slate-50 pt-3 mt-1">
                        <button
                          onClick={() => openFintechAction("gold")}
                          className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-[10px] font-black text-center transition-all cursor-pointer active:scale-95 shadow-sm"
                        >
                          Buy 24K Gold
                        </button>
                        <button
                          onClick={() => openMockPage("Sell Gold")}
                          className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 rounded-xl text-[10px] font-black text-center transition-all cursor-pointer active:scale-95"
                        >
                          Sell Gold
                        </button>
                      </div>
                    </div>

                    {/* Mutual Funds Performance */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-3.5 shadow-sm text-left">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-2.5">Top Mutual Funds</span>
                      <div className="flex flex-col gap-2.5">
                        {[
                          { name: "RideX Aggressive Growth Fund", rate: "▲ +22.4%", desc: "Equity Direct Growth", icon: "📊" },
                          { name: "SBI Bluechip Top-50 direct", rate: "▲ +16.8%", desc: "Large Cap Direct Fund", icon: "📈" }
                        ].map((fund, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-sm">{fund.icon}</div>
                              <div className="flex flex-col">
                                <span className="text-[9.5px] font-black text-slate-800 leading-tight">{fund.name}</span>
                                <span className="text-[7.5px] text-slate-400 font-bold mt-0.5">{fund.desc}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-emerald-600">{fund.rate}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Integrated Share.Market widget */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-3.5 shadow-sm text-left">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Share.Market Live Stocks</span>
                        <button
                          onClick={() => openMockPage("share.market stocks portfolio")}
                          className="text-[9px] font-extrabold text-[#7c3aed] hover:underline"
                        >
                          Portfolio
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* SBI Stock Card */}
                        <div className="border border-slate-100 rounded-2xl p-2.5 flex flex-col gap-1 shadow-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[8px] font-bold">S</div>
                            <span className="text-[8px] font-black text-slate-900 truncate">State Bank of India</span>
                          </div>
                          <div className="flex flex-col leading-none mt-1">
                            <span className="text-[10.5px] font-black text-slate-950">₹1,015.40</span>
                            <span className="text-[6.5px] text-slate-400 mt-0.5 font-bold">Prev close</span>
                          </div>
                          <svg className="w-full h-6 text-emerald-500 mt-1" viewBox="0 0 100 30" fill="none">
                            <path d="M 0,25 Q 15,10 30,22 T 60,12 T 90,8 T 100,2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          </svg>
                        </div>

                        {/* Vi Stock Card */}
                        <div className="border border-slate-100 rounded-2xl p-2.5 flex flex-col gap-1 shadow-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px] font-bold">V</div>
                            <span className="text-[8px] font-black text-slate-900 truncate">Vodafone Idea Ltd.</span>
                          </div>
                          <div className="flex flex-col leading-none mt-1">
                            <span className="text-[10.5px] font-black text-slate-950">₹13.83</span>
                            <span className="text-[6.5px] text-slate-400 mt-0.5 font-bold">Prev close</span>
                          </div>
                          <svg className="w-full h-6 text-emerald-500 mt-1" viewBox="0 0 100 30" fill="none">
                            <path d="M 0,22 Q 25,25 50,15 T 100,2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* ================= SCREEN 4: TRANSACTION HISTORY LEDGER ================= */}
                {activeScreen === "history" && (
                  <div className="p-3.5 flex flex-col gap-3.5 text-left h-full">
                    <h3 className="text-sm font-black text-slate-900 tracking-tight border-b border-slate-100 pb-2">Transactions History</h3>
                    
                    {transactions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2 my-auto">
                        <span className="text-3xl">📭</span>
                        <span className="text-xs font-bold">No transactions found!</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 overflow-y-auto max-h-[460px] pr-0.5">
                        {transactions.map((txn) => {
                          const isDebit = txn.type === "debit";
                          return (
                            <div
                              key={txn.id}
                              className="bg-white border border-slate-100 rounded-2xl p-3 flex justify-between items-center shadow-sm"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {/* Category Icon */}
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${isDebit ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}>
                                  {txn.category === "ride" && "🚗"}
                                  {txn.category === "wallet" && "💳"}
                                  {txn.category === "transfer" && "👤"}
                                  {txn.category === "utility" && "🔌"}
                                  {txn.category === "investment" && "🪙"}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[10px] font-black text-slate-900 truncate leading-tight">{txn.title}</span>
                                  <span className="text-[8px] text-slate-400 font-extrabold truncate mt-0.5">{txn.desc}</span>
                                  <span className="text-[7.5px] text-slate-400 mt-1">{txn.date} · {txn.id}</span>
                                </div>
                              </div>

                              <div className="text-right shrink-0 flex flex-col items-end">
                                <span className={`text-[11px] font-black ${isDebit ? "text-slate-800" : "text-emerald-600"}`}>
                                  {isDebit ? "-" : "+"}₹{txn.amount.toFixed(0)}
                                </span>
                                <span className="text-[7px] font-extrabold text-emerald-650 bg-emerald-50/50 border border-emerald-100 rounded px-1.5 mt-1 leading-none py-0.5 uppercase">
                                  {txn.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* BOTTOM PHONEPE ICON-TABS NAVIGATION BAR */}
              <div className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-100 px-3 py-2 flex justify-between items-center z-40">
                {[
                  { id: "home", name: "Home", icon: "🏠" },
                  { id: "services", name: "Services", icon: "🎛️" },
                  { id: "scan", name: "Scan", icon: "QR" },
                  { id: "wealth", name: "Wealth", icon: "🪙" },
                  { id: "history", name: "History", icon: "🕒" }
                ].map((tab, idx) => {
                  if (tab.id === "scan") {
                    return (
                      <button
                        key={idx}
                        onClick={() => setShowQRScanner(true)}
                        className="w-12 h-12 rounded-full bg-[#7c3aed] text-white flex items-center justify-center shadow-lg shadow-purple-600/25 -translate-y-4 border-4 border-white transition-all hover:scale-105 active:scale-95 cursor-pointer z-50 animate-pulse"
                        aria-label="Scan QR"
                      >
                        <QrCode className="w-5.5 h-5.5 text-white" />
                      </button>
                    );
                  }

                  const isActive = activeScreen === tab.id && tripStatus !== "active";
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setTripStatus("idle");
                        setActiveScreen(tab.id as any);
                      }}
                      className={`flex flex-col items-center flex-1 gap-0.5 cursor-pointer transition-all active:scale-95 ${isActive ? "text-[#7c3aed] font-blackScale" : "text-slate-400 hover:text-slate-650"}`}
                    >
                      <span className="text-[14px] leading-none">{tab.icon}</span>
                      <span className="text-[8.5px] tracking-tight">{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* ================= INTERACTIVE OVERLAYS & BOTTOM DRAWER SHEETS ================= */}

              {/* 1. Send Money & Utility Recharge Drawer Sheet */}
              <AnimatePresence>
                {showFintechDrawer && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowFintechDrawer(false)}
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
                        <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                          {fintechDrawerType === "contact" && "Transfer to Mobile"}
                          {fintechDrawerType === "upi" && "Send to UPI / Bank"}
                          {fintechDrawerType === "recharge" && `Pay ${selectedUtility.toUpperCase()} Bill`}
                          {fintechDrawerType === "gold" && "Buy 24K Digital Gold"}
                        </span>
                        <button
                          onClick={() => setShowFintechDrawer(false)}
                          className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleFintechTransfer} className="flex flex-col gap-3.5">
                        {/* Target Inputs based on transaction type */}
                        {fintechDrawerType === "contact" && (
                          <div className="flex flex-col gap-1 text-left">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Mobile Number</label>
                            <input
                              type="tel"
                              value={transferTarget}
                              onChange={(e) => setTransferTarget(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-black focus:bg-white focus:outline-none focus:border-[#7c3aed]"
                              placeholder="Enter 10-digit number"
                              required
                            />
                          </div>
                        )}

                        {fintechDrawerType === "upi" && (
                          <div className="flex flex-col gap-1 text-left">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">UPI ID or A/C Number</label>
                            <input
                              type="text"
                              value={transferTarget}
                              onChange={(e) => setTransferTarget(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-black focus:bg-white focus:outline-none focus:border-[#7c3aed]"
                              placeholder="e.g. name@upi or Bank A/C"
                              required
                            />
                          </div>
                        )}

                        {fintechDrawerType === "recharge" && (
                          <div className="flex flex-col gap-1 text-left">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                              {selectedUtility === "mobile" ? "Mobile Number" : "Account / Consumer Number"}
                            </label>
                            <input
                              type="text"
                              value={transferTarget}
                              onChange={(e) => setTransferTarget(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-black focus:bg-white focus:outline-none focus:border-[#7c3aed]"
                              placeholder="Enter account / number details"
                              required
                            />
                          </div>
                        )}

                        {fintechDrawerType === "gold" && (
                          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-800 font-bold mb-1">
                            Live buy rate: <span className="font-extrabold text-[#7c3aed]">₹7,500/gram</span> (Inclusive of 3% GST).
                          </div>
                        )}

                        {/* Amount Input */}
                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                            {fintechDrawerType === "gold" ? "Amount to Invest (₹)" : "Amount (₹)"}
                          </label>
                          <input
                            type="number"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-black focus:bg-white focus:outline-none focus:border-[#7c3aed]"
                            placeholder="Enter amount in ₹"
                            required
                          />
                        </div>

                        {/* Presets */}
                        <div className="flex gap-2">
                          {["100", "500", "1000", "2000"].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setTransferAmount(preset)}
                              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-black transition-colors cursor-pointer ${transferAmount === preset ? "bg-[#7c3aed] border-[#7c3aed] text-white" : "bg-slate-50 border-slate-100 text-slate-650 hover:bg-slate-100"}`}
                            >
                              +₹{preset}
                            </button>
                          ))}
                        </div>

                        {/* Payment Selection Banner */}
                        {fintechDrawerType !== "gold" && (
                          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex justify-between items-center text-xs mt-1">
                            <span className="font-bold text-slate-600">Paying from:</span>
                            <span className="font-extrabold text-[#7c3aed]">SBI Account (₹{bankBalance})</span>
                          </div>
                        )}

                        {/* Submit */}
                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-xs mt-2 transition-all shadow-md shadow-purple-600/25 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>
                            {fintechDrawerType === "gold" ? "Buy Gold Now" : "Proceed to Pay"}
                          </span>
                        </button>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* 2. Check Balance Detailed sheet */}
              <AnimatePresence>
                {showFintechDrawer && fintechDrawerType === "balance" && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowFintechDrawer(false)}
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
                        <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Account Balances</span>
                        <button
                          onClick={() => setShowFintechDrawer(false)}
                          className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {/* SBI Bank Balance */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center shadow-inner">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">S</div>
                            <div className="flex flex-col leading-none">
                              <span className="text-xs font-black text-slate-800">State Bank of India</span>
                              <span className="text-[8px] text-slate-400 font-bold mt-1">A/C ······ 3921 (Primary)</span>
                            </div>
                          </div>
                          <span className="text-sm font-black text-slate-900">₹{bankBalance.toLocaleString("en-IN")}</span>
                        </div>

                        {/* RideX Wallet Balance */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center shadow-inner">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#7c3aed] flex items-center justify-center font-black">W</div>
                            <div className="flex flex-col leading-none">
                              <span className="text-xs font-black text-slate-800">RideX Wallet</span>
                              <span className="text-[8px] text-slate-400 font-bold mt-1">Virtual credits ledger</span>
                            </div>
                          </div>
                          <span className="text-sm font-black text-slate-900">₹{balance.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setShowFintechDrawer(false);
                          setShowAddMoneyModal(true);
                        }}
                        className="w-full py-3.5 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-xs mt-4 transition-all shadow-md shadow-purple-600/20 text-center cursor-pointer active:scale-95"
                      >
                        Top-up Wallet from Bank
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* 3. Category Booking Sheet Drawer */}
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

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Vehicle Type</label>
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
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Pay From</label>
                            <select
                              value={paymentSource}
                              onChange={(e) => setPaymentSource(e.target.value as any)}
                              className="w-full px-2.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-black focus:bg-white focus:outline-none focus:border-[#7c3aed]"
                            >
                              <option value="wallet">Wallet (₹{balance})</option>
                              <option value="bank">SBI Account (₹{bankBalance})</option>
                            </select>
                          </div>
                        </div>

                        {/* Estimations lock */}
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

              {/* 4. Live Transit Tracking Screen (Vikram Camry) */}
              <AnimatePresence>
                {tripStatus === "active" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#fafaff] z-42 flex flex-col justify-between pt-0"
                  >
                    {/* Live Tracking Header */}
                    <div className="p-3 bg-[#7c3aed] text-white flex justify-between items-center relative z-10 text-left">
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-wider text-purple-200 block">Transit Active</span>
                        <span className="text-[10px] font-black">Trip RIDEX-2026</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-200 animate-pulse" /> 3.5 Mins
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

              {/* 5. Add Money Wallet Overlay Sheet */}
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

                        {/* Pay from bank summary */}
                        <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-650">Top-up Source:</span>
                          <span className="font-extrabold text-[#7c3aed]">SBI A/C (₹{bankBalance})</span>
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

              {/* 6. Scanner Simulation Overlay */}
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
                        className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-6 my-auto">
                      {/* Scanning Box */}
                      <div className="w-48 h-48 border-2 border-dashed border-[#fbbf24] rounded-3xl relative flex items-center justify-center bg-slate-900/40 shadow-2xl">
                        {/* Scanning green line */}
                        <div className="absolute inset-x-2 h-0.5 bg-emerald-500 top-2 animate-bounce shadow-[0_0_10px_#10b981]" />
                        <QrCode className="w-24 h-24 text-slate-750 animate-pulse" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold max-w-[200px] text-center leading-relaxed">
                        Point the camera frame at any RideX or PhonePe QR code at auto, cab, or logistics hubs.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowQRScanner(false);
                        setBalance((b) => b + 50);
                        logTransaction("credit", "Scan QR Received", "Mock Scan Code Reward", 50, "wallet");
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

              {/* 7. Global SOS Trigger Overlay */}
              <AnimatePresence>
                {sosStatus === "triggered" && (
                  <div className="absolute top-12 right-4 z-50">
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
