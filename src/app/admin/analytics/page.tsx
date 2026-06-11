"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { db } from "@/utils/firebase";
import { ref, onValue } from "firebase/database";
import { BarChart2, TrendingUp, Calendar, ArrowLeft, Clock, ShieldCheck } from "lucide-react";

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  type: string;
  status: string;
  price: number;
  createdAt: string;
}

export default function AnalyticsScreens() {
  const { user, profile, loading: authLoading } = useFirebase();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || profile?.role !== "admin") {
      router.push("/auth/login");
      return;
    }

    const ordersRef = ref(db, "orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrders(Object.values(snapshot.val()));
      }
    });

    return () => unsubscribe();
  }, [user, profile, authLoading, router]);

  // Compute metrics
  const deliveredOrders = orders.filter((o) => o.status === "delivered");
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.price, 0);
  const successRate = orders.length > 0 ? (deliveredOrders.length / orders.length) * 100 : 100;
  
  // Weekly chart data simulation
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const revenueByDay = [1200, 2400, 1800, 3100, 4800, 3600, totalRevenue > 0 ? totalRevenue % 5000 : 2500];

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-12 px-6 md:px-12 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Back Link */}
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Title */}
        <div className="border-b border-white/5 pb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <BarChart2 className="w-8 h-8 text-primary" />
            Operations Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-1">Platform performance summaries, volume distribution, and SLA statistics.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Gross Revenues</span>
            <span className="text-2xl font-extrabold text-white">₹{totalRevenue.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-400">+14.2% from last week</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-2">
            <ShieldCheck className="w-5 h-5 text-primary mb-1" />
            <span className="text-[10px] text-gray-400 font-bold uppercase block">SLA Compliance Rate</span>
            <span className="text-2xl font-extrabold text-white">{successRate.toFixed(1)}%</span>
            <span className="text-[10px] text-gray-400">Target goal: &gt;95%</span>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-2">
            <Clock className="w-5 h-5 text-yellow-500 mb-1" />
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Operations Dispatched</span>
            <span className="text-2xl font-extrabold text-white">{orders.length} Deliveries</span>
            <span className="text-[10px] text-gray-400">Across all vehicle categories</span>
          </div>
        </div>

        {/* Custom SVG Revenue Chart */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Daily Operations Volume (INR)
          </h3>
          
          <div className="w-full h-64 flex items-end justify-between gap-4 pt-8">
            {revenueByDay.map((val, idx) => {
              const maxVal = Math.max(...revenueByDay, 5000);
              const pct = (val / maxVal) * 85; // cap height at 85%
              
              return (
                <div key={idx} className="flex-grow flex flex-col items-center gap-2.5 h-full justify-end">
                  <span className="text-[10px] text-primary font-bold">₹{val.toFixed(0)}</span>
                  <div
                    style={{ height: `${pct}%` }}
                    className="w-full bg-gradient-to-t from-primary/30 to-primary rounded-t-lg border-t border-primary-hover shadow-lg shadow-primary/10 transition-all duration-500 hover:opacity-80"
                  />
                  <span className="text-xs text-gray-400 font-mono mt-1">{daysOfWeek[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
