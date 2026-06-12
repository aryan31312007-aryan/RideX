"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { db } from "@/utils/firebase";
import { ref, onValue } from "firebase/database";
import { Plus, Clock, MapPin, CheckCircle2, ShoppingBag, Eye, RefreshCw, Sparkles, Navigation } from "lucide-react";

interface Order {
  id: string;
  customerId: string;
  type: "ride" | "delivery";
  status: "pending" | "assigned" | "accepted" | "pickup_complete" | "in_transit" | "delivered" | "cancelled";
  pickup: { address: string; lat: number; lng: number };
  drop: { address: string; lat: number; lng: number };
  price: number;
  parcelType?: string;
  vehicleType: string;
  createdAt: string;
  driverId?: string;
}

export default function CustomerDashboard() {
  const { user, profile, loading: authLoading } = useFirebase();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Set page-level light mode background override
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

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Subscribe to Firebase RTDB /orders
    const ordersRef = ref(db, "orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allOrders = Object.values(data) as Order[];
        // Filter by current logged-in customer
        const customerOrders = allOrders
          .filter((ord) => ord.customerId === user.uid)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(customerOrders);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="w-full min-h-screen bg-[#fafaff] flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-mono">Synchronizing shipments from Firebase...</p>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter((ord) => !["delivered", "cancelled"].includes(ord.status));
  const pastOrders = orders.filter((ord) => ["delivered", "cancelled"].includes(ord.status));

  const getStatusBadge = (status: string) => {
    const badges: Record<string, React.ReactNode> = {
      pending: <span className="text-[9px] px-2 py-0.5 bg-amber-50 border border-amber-200/80 text-amber-700 rounded font-bold uppercase">Pending</span>,
      assigned: <span className="text-[9px] px-2 py-0.5 bg-purple-50 border border-purple-200/80 text-purple-700 rounded font-bold uppercase">Assigned</span>,
      accepted: <span className="text-[9px] px-2 py-0.5 bg-indigo-50 border border-indigo-200/80 text-indigo-700 rounded font-bold uppercase">Accepted</span>,
      pickup_complete: <span className="text-[9px] px-2 py-0.5 bg-blue-50 border border-blue-200/80 text-blue-700 rounded font-bold uppercase">Pickup Completed</span>,
      in_transit: <span className="text-[9px] px-2 py-0.5 bg-sky-50 border border-sky-200/80 text-sky-700 rounded font-bold uppercase">In Transit</span>,
      delivered: <span className="text-[9px] px-2 py-0.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 rounded font-bold uppercase">Delivered</span>,
      cancelled: <span className="text-[9px] px-2 py-0.5 bg-rose-50 border border-rose-200/80 text-rose-600 rounded font-bold uppercase">Cancelled</span>,
    };
    return badges[status] || <span className="text-xs text-slate-500 font-medium">{status}</span>;
  };

  return (
    <div className="w-full min-h-screen bg-[#fafaff] py-12 px-6 md:px-12 relative overflow-hidden">
      {/* Ambient decorative glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/30 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-100/20 blur-[120px] pointer-events-none -z-10" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-20" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Customer Console</h1>
            <p className="text-xs text-slate-500 mt-1">Hello, {profile?.name}. Schedule transport, manage parcels and map routes.</p>
          </div>
          <Link
            href="/dashboard/create"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Book Ride / Parcel
          </Link>
        </div>

        {/* Active Shipments Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" /> Active Logistics Dispatch
          </h2>
          {activeOrders.length === 0 ? (
            <div className="glass-card-light p-8 rounded-2xl border border-slate-200/60 text-center flex flex-col items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">No Active Shipments</p>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                You have no orders currently in transit. Click the booking button to schedule your next dispatch.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOrders.map((order) => (
                <div key={order.id} className="glass-card-light p-6 rounded-2xl border border-slate-200/60 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-400">ORDER: #{order.id.slice(0, 8).toUpperCase()}</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex flex-col gap-3 text-left my-2">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-bold text-slate-450 uppercase text-[9px] tracking-wider">PICKUP</p>
                        <p className="text-slate-700 truncate max-w-[200px] font-medium">{order.pickup.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-bold text-slate-455 uppercase text-[9px] tracking-wider">DROP</p>
                        <p className="text-slate-700 truncate max-w-[200px] font-medium">{order.drop.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[9px] uppercase tracking-wider">Est. Fare</span>
                      <p className="font-bold text-slate-800 text-base">₹{order.price.toFixed(2)}</p>
                    </div>
                    <Link
                      href={`/dashboard/track?id=${order.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/50 text-slate-700 font-semibold flex items-center gap-1.5 transition-all text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Live Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historical Shipments */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dispatch History
          </h2>
          {pastOrders.length === 0 ? (
            <div className="glass-card-light p-6 rounded-2xl border border-slate-200/60 text-center text-slate-400 text-xs py-10">
              No historical delivery operations found.
            </div>
          ) : (
            <div className="glass-panel-light rounded-2xl border border-slate-200/80 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-4 text-[10px] tracking-widest">Order ID</th>
                    <th className="p-4 text-[10px] tracking-widest">Locations</th>
                    <th className="p-4 text-[10px] tracking-widest">Type</th>
                    <th className="p-4 text-[10px] tracking-widest">Price</th>
                    <th className="p-4 text-[10px] tracking-widest">Status</th>
                    <th className="p-4 text-[10px] tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {pastOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono text-slate-400">#{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="p-4 max-w-[200px]">
                        <p className="text-slate-800 truncate font-semibold">To: {order.drop.address}</p>
                        <p className="text-slate-500 truncate text-[10px]">From: {order.pickup.address}</p>
                      </td>
                      <td className="p-4 capitalize">{order.vehicleType}</td>
                      <td className="p-4 font-bold text-slate-800">₹{order.price.toFixed(2)}</td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4">
                        <Link
                          href={`/dashboard/track?id=${order.id}`}
                          className="text-purple-600 hover:underline font-bold"
                        >
                          View Receipt
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
