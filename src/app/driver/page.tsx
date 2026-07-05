"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { db } from "@/utils/firebase";
import { ref, onValue, set, get } from "firebase/database";
import RealMap from "@/components/maps/RealMap";
import { Navigation, ShieldCheck, DollarSign, Star, FileText, CheckCircle, ToggleLeft, ToggleRight, Play, X, User, Sparkles } from "lucide-react";

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  type: "ride" | "delivery";
  status: "pending" | "assigned" | "accepted" | "pickup_complete" | "in_transit" | "delivered" | "cancelled";
  pickup: { address: string; lat: number; lng: number };
  drop: { address: string; lat: number; lng: number };
  price: number;
  parcelType?: string;
  vehicleType: string;
  createdAt: string;
  packageNotes?: string;
  route?: Array<{ lat: number; lng: number }>;
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
  documents?: {
    dl: string;
    rc: string;
  };
}

export default function DriverPortal() {
  const { user, profile, loading: authLoading } = useFirebase();
  const router = useRouter();

  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Document mock states
  const [dlFile, setDlFile] = useState("");
  const [rcFile, setRcFile] = useState("");
  const [docsSubmitted, setDocsSubmitted] = useState(false);

  // Keep track of active order unsubscribe function using a ref
  const activeOrderUnsubscribeRef = useRef<(() => void) | null>(null);

  // Set page-level styling reset to sleek premium light-mode default
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
    };
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Subscribe to driver profile
    const driverRef = ref(db, `drivers/${user.uid}`);
    const unsubscribeDriver = onValue(driverRef, (snapshot) => {
      if (snapshot.exists()) {
        const dData = snapshot.val() as DriverInfo;
        setDriver(dData);

        // Fetch/Subscribe to active order if any
        if (dData.activeOrderId) {
          // Unsubscribe from previous listener if activeOrderId changed
          if (activeOrderUnsubscribeRef.current) {
            activeOrderUnsubscribeRef.current();
            activeOrderUnsubscribeRef.current = null;
          }
          
          const ordRef = ref(db, `orders/${dData.activeOrderId}`);
          activeOrderUnsubscribeRef.current = onValue(ordRef, (ordSnap) => {
            if (ordSnap.exists()) {
              setActiveOrder(ordSnap.val() as Order);
            } else {
              setActiveOrder(null);
            }
          });
        } else {
          if (activeOrderUnsubscribeRef.current) {
            activeOrderUnsubscribeRef.current();
            activeOrderUnsubscribeRef.current = null;
          }
          setActiveOrder(null);
        }
      } else {
        // Create initial driver profile if empty
        const initialDriver: DriverInfo = {
          uid: user.uid,
          name: profile?.name || "Driver Partner",
          status: "online",
          rating: 5.0,
          earnings: 0,
          activeOrderId: "",
          vehicleId: "v1",
          documentVerified: true
        };
        set(ref(db, `drivers/${user.uid}`), initialDriver);
        setDriver(initialDriver);
      }
      setLoading(false);
    });

    // Subscribe to pending dispatch orders
    const ordersRef = ref(db, "orders");
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const all = Object.values(snapshot.val()) as Order[];
        // Filter for pending orders matching vehicle scale
        const pending = all.filter((ord) => ord.status === "pending");
        setNewOrders(pending);
      } else {
        setNewOrders([]);
      }
    });

    return () => {
      unsubscribeDriver();
      unsubscribeOrders();
      if (activeOrderUnsubscribeRef.current) {
        activeOrderUnsubscribeRef.current();
      }
    };
  }, [user, authLoading, router, profile]);

  // Online / Offline Toggle
  const toggleOnlineStatus = async () => {
    if (!driver || !user) return;
    const newStatus = driver.status === "online" ? "offline" : "online";
    await set(ref(db, `drivers/${user.uid}/status`), newStatus);
  };

  // Accept Dispatch
  const handleAcceptOrder = async (orderId: string) => {
    if (!user || !driver) return;
    try {
      // 1. Set order driverId and status to accepted
      await set(ref(db, `orders/${orderId}/driverId`), user.uid);
      await set(ref(db, `orders/${orderId}/status`), "accepted");
      
      // 2. Set driver activeOrderId
      await set(ref(db, `drivers/${user.uid}/activeOrderId`), orderId);
    } catch (err) {
      console.error(err);
    }
  };

  // Reject Dispatch (just ignore/remove from localized popup)
  const handleRejectOrder = (orderId: string) => {
    setNewOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  // Transit Workflow steps
  const advanceWorkflow = async () => {
    if (!activeOrder || !driver || !user) return;
    
    let nextStatus: Order["status"] = "accepted";
    if (activeOrder.status === "accepted") nextStatus = "pickup_complete";
    else if (activeOrder.status === "pickup_complete") nextStatus = "in_transit";
    else if (activeOrder.status === "in_transit") {
      nextStatus = "delivered";
      // Update earnings
      const newEarnings = (driver.earnings || 0) + activeOrder.price;
      await set(ref(db, `drivers/${user.uid}/earnings`), newEarnings);
      // Clear activeOrderId
      await set(ref(db, `drivers/${user.uid}/activeOrderId`), "");
    }

    if (nextStatus !== "delivered") {
      await set(ref(db, `orders/${activeOrder.id}/status`), nextStatus);
    } else {
      await set(ref(db, `orders/${activeOrder.id}/status`), "delivered");
      setActiveOrder(null);
    }
  };

  // Doc mock upload
  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !dlFile || !rcFile) return;
    try {
      await set(ref(db, `drivers/${user.uid}/documents`), {
        dl: dlFile,
        rc: rcFile
      });
      await set(ref(db, `drivers/${user.uid}/documentVerified`), false); // Needs Admin verify
      setDocsSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] py-12 px-6 md:px-12 text-left relative overflow-hidden text-slate-800">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#fbbf24]/5 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#6366f1]/5 blur-[120px] pointer-events-none -z-10" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-20" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
              Driver Portal
              {driver?.documentVerified ? (
                <ShieldCheck className="w-6 h-6 text-emerald-600 fill-emerald-100/30" />
              ) : (
                <span className="text-[10px] bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 px-2.5 py-0.5 rounded-full font-bold font-mono">
                  Pending Verification
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Hello, {driver?.name}. Synchronize coordinates and accept jobs.</p>
          </div>

          <button
            onClick={toggleOnlineStatus}
            className={`px-5 py-2.5 rounded-xl border flex items-center gap-2 font-semibold text-xs cursor-pointer transition-all ${
              driver?.status === "online"
                ? "bg-emerald-50 border-emerald-200/80 text-emerald-700 shadow-sm"
                : "bg-rose-50 border-rose-200/80 text-rose-700 shadow-sm"
            }`}
          >
            {driver?.status === "online" ? (
              <>
                <ToggleRight className="w-5 h-5 text-emerald-600" />
                ONLINE (Accepting Jobs)
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5 text-rose-500" />
                OFFLINE (Unavailable)
              </>
            )}
          </button>
        </div>

        {/* Dispatch Order Popups (Dynamic Notifications) */}
        {driver?.status === "online" && !driver?.activeOrderId && newOrders.length > 0 && (
          <div className="w-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg shadow-[#fbbf24]/5">
            <div>
              <span className="text-[9px] bg-[#fbbf24] text-slate-950 px-2 py-0.5 rounded font-extrabold font-mono tracking-wider flex items-center gap-1 w-fit">
                <Sparkles className="w-3 h-3 text-slate-950 animate-spin" /> NEW DISPATCH SIGNALED
              </span>
              <h4 className="text-base font-bold text-slate-800 mt-2">
                Order Delivery Request from {newOrders[0].customerName}
              </h4>
              <p className="text-xs text-slate-505 mt-0.5">Route: {newOrders[0].pickup.address} to {newOrders[0].drop.address}</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => handleAcceptOrder(newOrders[0].id)}
                className="flex-1 md:flex-none px-6 py-2.5 bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-[#fbbf24]/10"
              >
                Accept Order (Fare: ₹{newOrders[0].price.toFixed(0)})
              </button>
              <button
                onClick={() => handleRejectOrder(newOrders[0].id)}
                className="px-4 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Driver Stats & Verification checklist */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Active Job Panel */}
            {activeOrder ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-md flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-600 uppercase">Current Active Route</span>
                  <span className="text-[10px] font-mono text-slate-400">ID: #{activeOrder.id.slice(0, 8).toUpperCase()}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs flex flex-col gap-2">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">PICKUP FROM:</p>
                  <p className="text-slate-800 truncate font-semibold mb-2">{activeOrder.pickup.address}</p>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">DELIVER TO:</p>
                  <p className="text-slate-800 truncate font-semibold">{activeOrder.drop.address}</p>
                  {activeOrder.packageNotes && (
                    <p className="text-[#fbbf24] mt-1 italic font-medium">Notes: {activeOrder.packageNotes}</p>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block">STATUS</span>
                    <p className="text-slate-800 font-extrabold capitalize text-sm mt-0.5">{activeOrder.status.replace("_", " ")}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block">EARNING FARE</span>
                    <p className="text-slate-800 font-extrabold text-sm mt-0.5">₹{activeOrder.price.toFixed(2)}</p>
                  </div>
                </div>

                <button
                  onClick={advanceWorkflow}
                  className="w-full py-3.5 rounded-xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-900 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#fbbf24]/10"
                >
                  <Play className="w-3.5 h-3.5 text-slate-900" />
                  {activeOrder.status === "accepted" && "Start Pickup Complete"}
                  {activeOrder.status === "pickup_complete" && "Set in Transit"}
                  {activeOrder.status === "in_transit" && "Complete Delivery (Credit Fare)"}
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 text-center flex flex-col items-center gap-3 py-10 shadow-sm">
                <Navigation className="w-8 h-8 text-slate-400 rotate-45" />
                <h4 className="text-sm font-bold text-slate-850">No Active Job</h4>
                <p className="text-xs text-slate-505 max-w-xs leading-relaxed font-semibold">
                  Toggle online status and wait for dispatch notifications to accept courier deliveries or passenger rides.
                </p>
              </div>
            )}

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <DollarSign className="w-5 h-5 text-emerald-600 mb-2" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Earnings</span>
                <span className="text-2xl font-extrabold text-slate-850 mt-1 block">
                  ₹{driver?.earnings ? driver.earnings.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <Star className="w-5 h-5 text-yellow-500 mb-2" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Driver Rating</span>
                <span className="text-2xl font-extrabold text-slate-850 mt-1 block">
                  {driver?.rating ? driver.rating.toFixed(1) : "5.0"} ★
                </span>
              </div>
            </div>

            {/* Document Upload Center */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 flex flex-col gap-4 text-left shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
                <FileText className="w-4 h-4 text-purple-650" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Document Upload Center</span>
              </div>

              {docsSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs flex flex-col gap-1.5 font-semibold">
                  <p>✓ Documents submitted for verification!</p>
                  <p className="text-[10px] text-slate-500">An Admin operator will audit your credentials shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleDocSubmit} className="flex flex-col gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-505 font-semibold uppercase">Driver License Number (Mock)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DL-1234-987654"
                      value={dlFile}
                      onChange={(e) => setDlFile(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-505 font-semibold uppercase">Vehicle Registration RC (Mock)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MH-12-CD-5678"
                      value={rcFile}
                      onChange={(e) => setRcFile(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-xl font-bold text-slate-700 transition-all cursor-pointer shadow-sm text-xs"
                  >
                    Submit for Verification
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Real Driver Map */}
          <div className="lg:col-span-7 h-full flex flex-col text-slate-850">
            <div className="flex-grow min-h-[420px] lg:min-h-0 relative h-full rounded-[32px] overflow-hidden border border-slate-200/60 shadow-sm bg-slate-100">
              <RealMap
                pickup={activeOrder?.pickup}
                drop={activeOrder?.drop}
                activeRoute={activeOrder?.route}
                interactive={false}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
