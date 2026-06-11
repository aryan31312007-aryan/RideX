"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { db } from "@/utils/firebase";
import { ref, onValue, get } from "firebase/database";
import { Plus, Clock, MapPin, CheckCircle2, AlertCircle, ShoppingBag, Eye, RefreshCw, XCircle } from "lucide-react";

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
      <div className="w-full min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 font-mono">Synchronizing shipments from Firebase...</p>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter((ord) => !["delivered", "cancelled"].includes(ord.status));
  const pastOrders = orders.filter((ord) => ["delivered", "cancelled"].includes(ord.status));

  const getStatusBadge = (status: string) => {
    const badges: Record<string, JSX.Element> = {
      pending: <span className="text-[10px] px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded font-bold uppercase">Pending</span>,
      assigned: <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded font-bold uppercase">Assigned</span>,
      accepted: <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded font-bold uppercase">Accepted</span>,
      pickup_complete: <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded font-bold uppercase">Pickup Completed</span>,
      in_transit: <span className="text-[10px] px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-500 rounded font-bold uppercase">In Transit</span>,
      delivered: <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded font-bold uppercase">Delivered</span>,
      cancelled: <span className="text-[10px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded font-bold uppercase">Cancelled</span>,
    };
    return badges[status] || <span className="text-xs text-gray-400">{status}</span>;
  };

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Customer Console</h1>
            <p className="text-xs text-gray-400 mt-1">Hello, {profile?.name}. Schedule transport, manage parcels and map routes.</p>
          </div>
          <Link
            href="/dashboard/create"
            className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Book Ride / Parcel
          </Link>
        </div>

        {/* Active Shipments Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Active Logistics Dispatch
          </h2>
          {activeOrders.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl border border-white/5 text-center flex flex-col items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-gray-500" />
              <p className="text-sm font-semibold text-white">No Active Shipments</p>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                You have no orders currently in transit. Click the booking button to schedule your next dispatch.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOrders.map((order) => (
                <div key={order.id} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-400">ORDER: #{order.id.slice(0, 8)}</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex flex-col gap-3 text-left my-2">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-semibold text-gray-400">PICKUP</p>
                        <p className="text-white truncate max-w-[200px]">{order.pickup.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-semibold text-gray-400">DROP</p>
                        <p className="text-white truncate max-w-[200px]">{order.drop.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-gray-400">Est. Fare</span>
                      <p className="font-bold text-white text-base">₹{order.price.toFixed(2)}</p>
                    </div>
                    <Link
                      href={`/dashboard/track?id=${order.id}`}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold flex items-center gap-1.5 transition-all"
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
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dispatch History
          </h2>
          {pastOrders.length === 0 ? (
            <div className="glass-card p-6 rounded-2xl border border-white/5 text-center text-gray-500 text-xs py-10">
              No historical delivery operations found.
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Locations</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pastOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 font-mono text-gray-400">#{order.id.slice(0, 8)}</td>
                      <td className="p-4 max-w-[200px]">
                        <p className="text-white truncate font-semibold">To: {order.drop.address}</p>
                        <p className="text-gray-400 truncate">From: {order.pickup.address}</p>
                      </td>
                      <td className="p-4 capitalize">{order.vehicleType}</td>
                      <td className="p-4 font-bold text-white">₹{order.price.toFixed(2)}</td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4">
                        <Link
                          href={`/dashboard/track?id=${order.id}`}
                          className="text-primary hover:underline font-bold"
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
