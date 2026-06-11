"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { db } from "@/utils/firebase";
import { ref, push, set, onValue } from "firebase/database";
import RealMap from "@/components/maps/RealMap";
import { Navigation, Bike, Car, Truck, Pin, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";

interface Point {
  lat: number;
  lng: number;
}

interface PricingRule {
  id: string;
  name: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  type: string;
}

export default function CreateOrder() {
  const { user, profile, loading: authLoading } = useFirebase();
  const router = useRouter();

  // Pricing rules from Firebase
  const [pricingRules, setPricingRules] = useState<Record<string, PricingRule>>({
    bike: { id: "bike", name: "Moto Ride", baseFare: 30, perKmRate: 8, perMinuteRate: 1.5, type: "bike" },
    car: { id: "car", name: "Premium Sedan", baseFare: 80, perKmRate: 15, perMinuteRate: 3.0, type: "car" },
    truck: { id: "truck", name: "Cargo Truck", baseFare: 150, perKmRate: 25, perMinuteRate: 5.0, type: "truck" }
  });

  const [activeSelection, setActiveSelection] = useState<"pickup" | "drop">("pickup");
  const [pickup, setPickup] = useState<Point | undefined>(undefined);
  const [pickupAddress, setPickupAddress] = useState("");
  const [drop, setDrop] = useState<Point | undefined>(undefined);
  const [dropAddress, setDropAddress] = useState("");

  const [vehicleType, setVehicleType] = useState<"bike" | "car" | "truck">("car");
  const [parcelType, setParcelType] = useState("document");
  const [packageNotes, setPackageNotes] = useState("");
  const [orderType, setOrderType] = useState<"ride" | "delivery">("delivery");

  const [distance, setDistance] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const [booking, setBooking] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Sync pricing rules from Firebase
  useEffect(() => {
    const rulesRef = ref(db, "pricing_rules");
    const unsubscribe = onValue(rulesRef, (snapshot) => {
      if (snapshot.exists()) {
        setPricingRules(snapshot.val());
      }
    });
    return () => unsubscribe();
  }, []);

  // Haversine formula — real-world distance between two GPS coordinates
  const haversineKm = (a: Point, b: Point) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const s =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  };

  // Compute distance and price when real coords change
  useEffect(() => {
    if (pickup && drop) {
      const calculatedKm = haversineKm(pickup, drop);
      setDistance(calculatedKm);

      const rules = pricingRules[vehicleType];
      if (rules) {
        const estDurationMin = calculatedKm * 2.5;
        const estPrice = rules.baseFare + calculatedKm * rules.perKmRate + estDurationMin * rules.perMinuteRate;
        setPrice(estPrice);
      }
    } else {
      setDistance(0);
      setPrice(0);
    }
  }, [pickup, drop, vehicleType, pricingRules]);

  // Handle map click
  const handleMapClick = (coords: Point, address: string) => {
    if (activeSelection === "pickup") {
      setPickup(coords);
      setPickupAddress(address);
      setActiveSelection("drop"); // auto switch to drop
    } else {
      setDrop(coords);
      setDropAddress(address);
    }
  };

  // Submit Order booking
  const handleBookOrder = async () => {
    if (!user || !pickup || !drop) return;
    setBooking(true);
    try {
      const ordersRef = ref(db, "orders");
      const newOrderRef = push(ordersRef);
      const orderId = newOrderRef.key || `order_${Date.now()}`;

      // Fetch REAL road route from OSRM and store it with the order
      let routePoints: Point[] = [];
      try {
        const osrmUrl =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}` +
          `?overview=full&geometries=geojson&steps=false`;
        const osrmRes = await fetch(osrmUrl);
        const osrmData = await osrmRes.json();
        if (osrmData.code === "Ok" && osrmData.routes?.length) {
          routePoints = (osrmData.routes[0].geometry.coordinates as [number, number][]).map(
            ([lng, lat]) => ({ lat, lng })
          );
        }
      } catch {
        // Fallback if OSRM unreachable
      }

      // If OSRM failed, use curved approximation
      if (routePoints.length < 2) {
        for (let i = 0; i <= 12; i++) {
          const t = i / 12;
          const curve = Math.sin(t * Math.PI) * 0.004;
          routePoints.push({
            lat: pickup.lat + (drop.lat - pickup.lat) * t + curve,
            lng: pickup.lng + (drop.lng - pickup.lng) * t,
          });
        }
      }

      // Use OSRM road distance if available (more accurate than haversine)
      const roadDistanceKm = haversineKm(pickup, drop);

      const orderData = {
        id: orderId,
        customerId: user.uid,
        customerName: profile?.name || user.email?.split("@")[0].toUpperCase(),
        type: orderType,
        status: "pending",
        pickup: { address: pickupAddress, ...pickup },
        drop: { address: dropAddress, ...drop },
        price: price,
        vehicleType: vehicleType,
        ...(orderType === "delivery" && { parcelType }),
        packageNotes: packageNotes,
        createdAt: new Date().toISOString(),
        route: routePoints,
        distanceKm: roadDistanceKm,
        paymentStatus: "pending",
        paymentMethod: "cod",
      };

      await set(ref(db, `orders/${orderId}`), orderData);
      
      setSuccessMsg("Booking Successful! Redirecting to tracking center...");
      setTimeout(() => {
        router.push(`/dashboard/track?id=${orderId}`);
      }, 2000);
    } catch (error) {
      console.error("Failed to write booking order:", error);
      setBooking(false);
    }
  };

  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-12 px-6 md:px-12 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Booking parameters Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-5">
            <h2 className="text-xl font-extrabold text-white">Create Shipment / Ride</h2>
            
            {successMsg && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {successMsg}
              </div>
            )}

            {/* Selector: Ride or Parcel */}
            <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/5 text-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setOrderType("delivery")}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  orderType === "delivery" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Parcel Delivery
              </button>
              <button
                type="button"
                onClick={() => setOrderType("ride")}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  orderType === "ride" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Bike / Taxi Ride
              </button>
            </div>

            {/* Coordinates Selector */}
            <div className="flex flex-col gap-4 border-l-2 border-dashed border-primary/30 pl-4 relative ml-2">
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Pickup Location</label>
                <input
                  type="text"
                  readOnly
                  placeholder="Tap map to set pickup point"
                  value={pickupAddress}
                  onClick={() => setActiveSelection("pickup")}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs text-white focus:outline-none cursor-pointer ${
                    activeSelection === "pickup" ? "border-primary bg-primary/5" : "glass-input"
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Drop-off Destination</label>
                <input
                  type="text"
                  readOnly
                  placeholder="Tap map to set drop point"
                  value={dropAddress}
                  onClick={() => setActiveSelection("drop")}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs text-white focus:outline-none cursor-pointer ${
                    activeSelection === "drop" ? "border-primary bg-primary/5" : "glass-input"
                  }`}
                />
              </div>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase block mb-2">Transport Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: "bike", name: "Moto Ride", icon: <Bike className="w-4 h-4 text-primary" /> },
                  { type: "car", name: "Executive Cab", icon: <Car className="w-4 h-4 text-yellow-500" /> },
                  { type: "truck", name: "Logistics Truck", icon: <Truck className="w-4 h-4 text-green-500" /> }
                ].map((veh) => (
                  <button
                    key={veh.type}
                    type="button"
                    onClick={() => setVehicleType(veh.type as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                      vehicleType === veh.type
                        ? "bg-white/5 border-primary text-white"
                        : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {veh.icon}
                    <span className="text-[10px] font-bold mt-2">{veh.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cargo options if Delivery */}
            {orderType === "delivery" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-semibold uppercase">Parcel Class</label>
                  <select
                    value={parcelType}
                    onChange={(e) => setParcelType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="document" className="bg-gray-950">Documents / Letter</option>
                    <option value="food" className="bg-gray-950">Prepared Meals / Food</option>
                    <option value="electronics" className="bg-gray-950">Delicate Electronics</option>
                    <option value="apparel" className="bg-gray-950">Clothes / Boxed items</option>
                    <option value="heavy" className="bg-gray-950">Bulk / Heavy Freight</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-semibold uppercase">Package Notes</label>
                  <input
                    type="text"
                    value={packageNotes}
                    onChange={(e) => setPackageNotes(e.target.value)}
                    placeholder="Fragile, ring bell etc"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Calculations Summary */}
            {pickup && drop && (
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Distance:</span>
                  <span className="text-white font-bold">{distance.toFixed(1)} KM</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1">
                  <span className="text-gray-400 text-sm font-semibold">Calculated Fare:</span>
                  <span className="text-white font-extrabold text-lg">₹{price.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={booking || !pickup || !drop}
              onClick={handleBookOrder}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {booking ? "Creating Manifest..." : "Confirm Booking"}
              <ArrowRight className="w-4 h-4" />
            </button>

            {!pickup && (
              <p className="text-[10px] text-yellow-500/80 flex items-center gap-1.5 justify-center">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Tap the visual city mesh to indicate the pickup coordinate.
              </p>
            )}
          </div>
        </div>

        {/* Real Interactive Map */}
        <div className="lg:col-span-7 h-full flex flex-col">
          <div className="flex-grow min-h-[420px] lg:min-h-0 relative h-full">
            <RealMap
              pickup={pickup}
              drop={drop}
              onMapClick={handleMapClick}
              interactive={true}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
