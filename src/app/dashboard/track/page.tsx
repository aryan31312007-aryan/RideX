"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { db } from "@/utils/firebase";
import { ref, onValue, set, get } from "firebase/database";
import RealMap from "@/components/maps/RealMap";
import { ChevronLeft, FileText, Printer, Navigation, Play, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Point {
  lat: number;
  lng: number;
}

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
  driverId?: string;
  packageNotes?: string;
  route?: Point[];
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [simulationActive, setSimulationActive] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const orderRef = ref(db, `orders/${orderId}`);
    const unsubscribe = onValue(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setOrder(data);
        
        // Match mock visual progress to order status
        if (data.status === "pending") setProgress(0);
        else if (data.status === "accepted") setProgress(0.25);
        else if (data.status === "pickup_complete") setProgress(0.5);
        else if (data.status === "in_transit") setProgress(0.75);
        else if (data.status === "delivered") setProgress(1);
      } else {
        setOrder(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  // Simulated live drive loop
  useEffect(() => {
    if (!simulationActive || !order || !orderId) return;

    let currentVal = progress;
    const interval = setInterval(async () => {
      currentVal += 0.05;
      if (currentVal >= 1) {
        currentVal = 1;
        setSimulationActive(false);
        clearInterval(interval);
        
        // Update Firebase to delivered
        await set(ref(db, `orders/${orderId}/status`), "delivered");
      } else {
        setProgress(currentVal);
        
        // Update statuses incrementally
        let newStatus: Order["status"] = "accepted";
        if (currentVal > 0.3 && currentVal <= 0.6) newStatus = "pickup_complete";
        else if (currentVal > 0.6 && currentVal < 0.98) newStatus = "in_transit";
        
        if (order.status !== newStatus) {
          await set(ref(db, `orders/${orderId}/status`), newStatus);
        }
      }
    }, 800);

    return () => clearInterval(interval);
  }, [simulationActive, order, orderId, progress]);

  // Cancel booking
  const handleCancelOrder = async () => {
    if (!orderId) return;
    try {
      await set(ref(db, `orders/${orderId}/status`), "cancelled");
    } catch (err) {
      console.error(err);
    }
  };

  const startSimulation = () => {
    setProgress(0);
    setSimulationActive(true);
  };

  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full min-h-screen bg-gray-950 py-20 px-6 text-center flex flex-col items-center gap-4">
        <h3 className="text-xl font-bold text-white">Order Not Found</h3>
        <p className="text-xs text-gray-400">The requested shipment ID does not exist in Firebase.</p>
        <Link href="/dashboard" className="px-6 py-2 bg-primary rounded-xl text-xs font-semibold text-white">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Back Link */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Status Tracker and Invoice */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left print:col-span-12 print:w-full">
            
            {/* Live Progress Card */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary tracking-wide uppercase">Shipment Status</span>
                <span className="text-xs font-mono text-gray-400">#{order.id.slice(0, 8)}</span>
              </div>

              {/* Status Stepper */}
              <div className="flex flex-col gap-4 pl-3 relative border-l border-white/10 ml-1.5 my-2">
                {[
                  { key: "pending", label: "Order Created" },
                  { key: "accepted", label: "Driver Assigned" },
                  { key: "pickup_complete", label: "Pickup Complete" },
                  { key: "in_transit", label: "In Transit" },
                  { key: "delivered", label: "Delivered Successfully" }
                ].map((step, idx) => {
                  const stepOrder = ["pending", "assigned", "accepted", "pickup_complete", "in_transit", "delivered", "cancelled"];
                  const isCancelled = order.status === "cancelled";
                  
                  // Check if this step is reached
                  const targetIdx = stepOrder.indexOf(order.status);
                  const stepIdx = stepOrder.indexOf(step.key);
                  const isCompleted = isCancelled ? false : stepIdx <= targetIdx;
                  
                  return (
                    <div key={step.key} className="flex items-center gap-3 relative">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-primary border-primary text-white"
                          : isCancelled && step.key === "pending"
                          ? "bg-red-500 border-red-500 text-white"
                          : "bg-gray-900 border-white/10"
                      }`}>
                        {isCompleted && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className={`text-xs font-semibold ${
                        isCompleted ? "text-white" : isCancelled ? "text-red-400 line-through" : "text-gray-400"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Demo Simulator Controller */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-3 print:hidden">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Dev Simulator Sandbox</p>
                <div className="flex gap-2">
                  <button
                    onClick={startSimulation}
                    disabled={simulationActive || order.status === "delivered" || order.status === "cancelled"}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Transit Simulation
                  </button>
                  
                  {order.status !== "delivered" && order.status !== "cancelled" && (
                    <button
                      onClick={handleCancelOrder}
                      className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Receipt Invoice Card */}
            <div id="invoice-receipt" className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4 bg-gray-900">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">RIDEX TAX INVOICE</span>
                </div>
                <button
                  onClick={printInvoice}
                  className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-gray-300 print:hidden cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[10px]">Client Name</p>
                  <p className="text-white font-bold mt-0.5">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[10px]">Date Issued</p>
                  <p className="text-white font-bold mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 uppercase font-semibold text-[10px]">Pickup Location</p>
                  <p className="text-white truncate font-medium mt-0.5">{order.pickup.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 uppercase font-semibold text-[10px]">Drop Destination</p>
                  <p className="text-white truncate font-medium mt-0.5">{order.drop.address}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[10px]">Vehicle Tier</p>
                  <p className="text-white capitalize font-bold mt-0.5">{order.vehicleType}</p>
                </div>
                {order.parcelType && (
                  <div>
                    <p className="text-gray-400 uppercase font-semibold text-[10px]">Parcel Class</p>
                    <p className="text-white capitalize font-bold mt-0.5">{order.parcelType}</p>
                  </div>
                )}
              </div>

              <hr className="border-white/5" />

              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="text-gray-400 uppercase font-semibold text-[10px]">Payment Status</p>
                  <p className="text-emerald-400 font-bold uppercase mt-0.5">Paid via COD</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 uppercase font-semibold text-[10px]">Grand Total</p>
                  <p className="text-white font-extrabold text-lg">₹{order.price.toFixed(2)}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Real Tracking Map */}
          <div className="lg:col-span-7 h-full flex flex-col print:hidden">
            <div className="flex-grow min-h-[420px] lg:min-h-0 relative h-full">
              <RealMap
                pickup={order.pickup}
                drop={order.drop}
                activeRoute={order.route}
                progress={progress}
                interactive={false}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function TrackOrder() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
