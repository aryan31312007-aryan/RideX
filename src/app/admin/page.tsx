"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { db } from "@/utils/firebase";
import { ref, onValue, set, get, push } from "firebase/database";
import RealMap from "@/components/maps/RealMap";
import { ShieldCheck, Users, Car, Zap, FileText, CheckCircle2, DollarSign, Send, Plus, RefreshCw, BarChart2 } from "lucide-react";

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  type: "ride" | "delivery";
  status: string;
  pickup: { address: string; lat: number; lng: number };
  drop: { address: string; lat: number; lng: number };
  price: number;
  vehicleType: string;
  createdAt: string;
}

interface DriverInfo {
  uid: string;
  name: string;
  status: "online" | "offline";
  rating: number;
  earnings: number;
  activeOrderId: string;
  vehicleId: string;
  documentVerified: boolean;
  phone?: string;
  location?: { lat: number; lng: number };
  documents?: {
    dl: string;
    rc: string;
  };
}

interface PricingRule {
  id: string;
  name: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  type: string;
}

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useFirebase();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<DriverInfo[]>([]);
  const [pricingRules, setPricingRules] = useState<Record<string, PricingRule>>({});
  
  // Forms & Selection states
  const [activeTab, setActiveTab] = useState<"orders" | "drivers" | "pricing" | "vehicles" | "notifications">("orders");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // New vehicle addon state
  const [newVehicle, setNewVehicle] = useState({ type: "car", plate: "", model: "", driverId: "" });
  const [vehicleSuccess, setVehicleSuccess] = useState(false);

  // Loading indicator
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Sync active orders
    const ordersRef = ref(db, "orders");
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrders(Object.values(snapshot.val()));
      } else {
        setOrders([]);
      }
    });

    // Sync drivers list
    const driversRef = ref(db, "drivers");
    const unsubscribeDrivers = onValue(driversRef, (snapshot) => {
      if (snapshot.exists()) {
        setDrivers(Object.values(snapshot.val()));
      } else {
        setDrivers([]);
      }
    });

    // Sync pricing rules
    const rulesRef = ref(db, "pricing_rules");
    const unsubscribeRules = onValue(rulesRef, (snapshot) => {
      if (snapshot.exists()) {
        setPricingRules(snapshot.val());
      }
    });

    setLoading(false);

    return () => {
      unsubscribeOrders();
      unsubscribeDrivers();
      unsubscribeRules();
    };
  }, [user, authLoading, router]);

  // Pricing rule adjust updates
  const handleUpdatePriceRule = async (type: string, field: string, val: number) => {
    try {
      await set(ref(db, `pricing_rules/${type}/${field}`), val);
    } catch (err) {
      console.error("Failed to update pricing rule:", err);
    }
  };

  // Driver Verificator approvals
  const handleVerifyDriver = async (driverUid: string) => {
    try {
      await set(ref(db, `drivers/${driverUid}/documentVerified`), true);
    } catch (err) {
      console.error(err);
    }
  };

  // Broadcast dispatch
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;
    try {
      const notifyRef = ref(db, "notifications");
      const newNotifyRef = push(notifyRef);
      await set(newNotifyRef, {
        id: newNotifyRef.key,
        title: broadcastTitle,
        body: broadcastBody,
        createdAt: new Date().toISOString()
      });
      setBroadcastSuccess(true);
      setBroadcastTitle("");
      setBroadcastBody("");
      setTimeout(() => setBroadcastSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // New vehicle addon submit
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.plate || !newVehicle.model) return;
    try {
      const vehId = `veh_${Date.now()}`;
      await set(ref(db, `vehicles/${vehId}`), {
        id: vehId,
        type: newVehicle.type,
        plateNumber: newVehicle.plate,
        model: newVehicle.model,
        driverId: newVehicle.driverId || "d1"
      });

      // Update target driver attached vehicle
      if (newVehicle.driverId) {
        await set(ref(db, `drivers/${newVehicle.driverId}/vehicleId`), vehId);
      }

      setVehicleSuccess(true);
      setNewVehicle({ type: "car", plate: "", model: "", driverId: "" });
      setTimeout(() => setVehicleSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="w-full min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate platform totals
  const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.price, 0);
  const activeCount = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
  const pendingDocsDrivers = drivers.filter((d) => d.documents && !d.documentVerified);

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-12 px-6 md:px-12 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Admin Command Center</h1>
            <p className="text-xs text-gray-400 mt-1">Unified operations command. Monitor dispatches, verify credentials, adjust pricing.</p>
          </div>
        </div>

        {/* Global Statistics metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-5 rounded-2xl border border-white/5">
            <DollarSign className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Platform Revenue</span>
            <span className="text-xl font-extrabold text-white mt-1 block">₹{totalRevenue.toFixed(2)}</span>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/5">
            <Zap className="w-5 h-5 text-primary mb-2" />
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Active Dispatches</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{activeCount} Orders</span>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/5">
            <Users className="w-5 h-5 text-yellow-500 mb-2" />
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Driver Network</span>
            <span className="text-xl font-extrabold text-white mt-1 block">
              {drivers.filter((d) => d.status === "online").length} Online
            </span>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/5 animate-pulse">
            <ShieldCheck className="w-5 h-5 text-red-400 mb-2" />
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Credentials Awaiting Audit</span>
            <span className="text-xl font-extrabold text-red-400 mt-1 block">{pendingDocsDrivers.length} Pending</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls tabs panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-card rounded-2xl border border-white/5 p-2 flex gap-1">
              {[
                { tab: "orders", label: "Orders" },
                { tab: "drivers", label: "Verification" },
                { tab: "pricing", label: "Fares" },
                { tab: "vehicles", label: "Vehicles" },
                { tab: "notifications", label: "Broadcast" }
              ].map((btn) => (
                <button
                  key={btn.tab}
                  onClick={() => setActiveTab(btn.tab as any)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    activeTab === btn.tab ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Sub Tab Contents */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl min-h-[380px] flex flex-col gap-4">
              
              {/* TAB 1: Live Orders list */}
              {activeTab === "orders" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white mb-2">Live Shipments list</h3>
                  {orders.length === 0 ? (
                    <p className="text-xs text-gray-500 py-10 text-center">No orders created yet on the system.</p>
                  ) : (
                    <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
                      {orders.slice(0, 10).map((ord) => (
                        <div key={ord.id} className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-xs flex justify-between items-center">
                          <div className="text-left max-w-[200px]">
                            <p className="font-bold text-white truncate">{ord.customerName}</p>
                            <p className="text-gray-400 truncate mt-0.5">{ord.pickup.address} → {ord.drop.address}</p>
                          </div>
                          <div className="text-right shrink-0 flex flex-col gap-1 items-end">
                            <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded uppercase font-bold">
                              {ord.status}
                            </span>
                            <span className="font-bold text-white">₹{ord.price.toFixed(0)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Driver Verificator */}
              {activeTab === "drivers" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white mb-2">Driver Document Verificator</h3>
                  {pendingDocsDrivers.length === 0 ? (
                    <div className="text-center py-12 text-xs text-gray-500">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 animate-bounce" />
                      All registered drivers are fully verified. No pending uploads.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1">
                      {pendingDocsDrivers.map((drv) => (
                        <div key={drv.uid} className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs flex flex-col gap-3 text-left">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="font-bold text-white">{drv.name}</span>
                            <span className="text-[10px] text-yellow-500 font-bold uppercase">Awaiting Audit</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
                            <div>
                              <p className="font-semibold uppercase text-gray-500">License DL</p>
                              <p className="text-white mt-0.5 font-mono">{drv.documents?.dl}</p>
                            </div>
                            <div>
                              <p className="font-semibold uppercase text-gray-500">Vehicle RC</p>
                              <p className="text-white mt-0.5 font-mono">{drv.documents?.rc}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleVerifyDriver(drv.uid)}
                            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer"
                          >
                            Approve Credentials
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Pricing Control */}
              {activeTab === "pricing" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white mb-2">Pricing Rules dashboard</h3>
                  <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1">
                    {Object.values(pricingRules).map((rule) => (
                      <div key={rule.id} className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs text-left flex flex-col gap-3">
                        <div className="font-bold text-white border-b border-white/5 pb-1.5 capitalize">
                          {rule.name} (Tier: {rule.id})
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-semibold uppercase">Base (₹)</label>
                            <input
                              type="number"
                              value={rule.baseFare}
                              onChange={(e) => handleUpdatePriceRule(rule.id, "baseFare", parseFloat(e.target.value))}
                              className="px-2 py-1 bg-gray-900 border border-white/10 rounded text-white font-bold text-center focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-semibold uppercase">Per KM (₹)</label>
                            <input
                              type="number"
                              value={rule.perKmRate}
                              onChange={(e) => handleUpdatePriceRule(rule.id, "perKmRate", parseFloat(e.target.value))}
                              className="px-2 py-1 bg-gray-900 border border-white/10 rounded text-white font-bold text-center focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-semibold uppercase">Per Min (₹)</label>
                            <input
                              type="number"
                              value={rule.perMinuteRate}
                              onChange={(e) => handleUpdatePriceRule(rule.id, "perMinuteRate", parseFloat(e.target.value))}
                              className="px-2 py-1 bg-gray-900 border border-white/10 rounded text-white font-bold text-center focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Vehicle Addon */}
              {activeTab === "vehicles" && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-white mb-1">New Vehicle Addon</h3>
                  
                  {vehicleSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Vehicle successfully registered!
                    </div>
                  )}

                  <form onSubmit={handleAddVehicle} className="flex flex-col gap-3 text-xs text-left">
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-400 font-bold uppercase text-[9px]">Vehicle Category</label>
                      <select
                        value={newVehicle.type}
                        onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                        className="px-3 py-2.5 rounded-xl glass-input text-white text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="bike" className="bg-gray-950">Bike Taxi / Moto</option>
                        <option value="car" className="bg-gray-950">Executive Sedan</option>
                        <option value="truck" className="bg-gray-950">Cargo Delivery Truck</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-gray-400 font-bold uppercase text-[9px]">License Plate Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DL-3C-AS-7777"
                        value={newVehicle.plate}
                        onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                        className="px-3 py-2.5 rounded-xl glass-input text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-gray-400 font-bold uppercase text-[9px]">Manufacturer & Model</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Suzuki Dzire"
                        value={newVehicle.model}
                        onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                        className="px-3 py-2.5 rounded-xl glass-input text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-gray-400 font-bold uppercase text-[9px]">Assign Driver Partner</label>
                      <select
                        value={newVehicle.driverId}
                        onChange={(e) => setNewVehicle({ ...newVehicle, driverId: e.target.value })}
                        className="px-3 py-2.5 rounded-xl glass-input text-white focus:outline-none cursor-pointer"
                      >
                        <option value="" className="bg-gray-950">Unassigned (Default)</option>
                        {drivers.map((drv) => (
                          <option key={drv.uid} value={drv.uid} className="bg-gray-950">
                            {drv.name} ({drv.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Vehicle Tier
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: Broadcast */}
              {activeTab === "notifications" && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-white mb-1">Global Notification Broadcaster</h3>
                  
                  {broadcastSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Broadcast successfully dispatched to Firebase!
                    </div>
                  )}

                  <form onSubmit={handleBroadcast} className="flex flex-col gap-4 text-xs text-left">
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-400 font-bold uppercase text-[9px]">Message Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Monsoon Traffic Alert"
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        className="px-3 py-2.5 rounded-xl glass-input text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-gray-400 font-bold uppercase text-[9px]">Body Message Content</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Type alert content to push to clients..."
                        value={broadcastBody}
                        onChange={(e) => setBroadcastBody(e.target.value)}
                        className="px-3 py-2.5 rounded-xl glass-input text-white focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Dispatch Alert
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

          {/* Real Fleet Map — all live driver positions */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="flex-grow min-h-[420px] lg:min-h-0 relative h-full">
              <RealMap
                drivers={drivers.map((d) => {
                  // Stable fallback: derive a deterministic offset from UID chars
                  const seed = d.uid.charCodeAt(0) / 255;
                  return {
                    uid: d.uid,
                    name: d.name,
                    location: d.location ?? {
                      lat: 28.6139 + seed * 0.08 - 0.04,
                      lng: 77.2090 + seed * 0.08 - 0.04,
                    },
                    type: (d.vehicleId?.includes("bike")
                      ? "bike"
                      : d.vehicleId?.includes("truck")
                      ? "truck"
                      : "car") as "bike" | "car" | "truck",
                    status: d.status,
                  };
                })}
                interactive={false}
                zoom={12}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
