"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, Phone, MapPin, Copy, Check, X, 
  AlertTriangle, BellRing, Info, ShieldCheck, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Helpline {
  name: string;
  number: string;
  desc: string;
  category: "General" | "Security" | "Medical" | "Support";
}

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [dispatching, setDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("Locating standard coordinate reference...");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"location" | "sos" | "both">("both");

  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // Listen to global open event (e.g. from Navbar trigger)
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      const initialTab = customEvent.detail?.tab || "both";
      setActiveTab(initialTab);
      setIsOpen(true);
    };
    window.addEventListener("open-sos-modal", handleOpen);
    return () => window.removeEventListener("open-sos-modal", handleOpen);
  }, []);

  // Fetch coordinates on modal open
  useEffect(() => {
    if (isOpen) {
      fetchLocation();
    } else {
      // Reset dispatch state when modal closes
      cancelDispatch();
    }
  }, [isOpen]);

  // Countdown timer handler
  useEffect(() => {
    if (dispatching && countdown > 0) {
      countdownInterval.current = setTimeout(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setDispatching(false);
            setDispatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownInterval.current) clearTimeout(countdownInterval.current);
    };
  }, [dispatching, countdown]);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setCoords({ lat: 28.6304, lng: 77.2177 }); // Default to New Delhi reference
      setLocationName("Connaught Place, New Delhi (Default Reference)");
      return;
    }

    setGpsLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocationName(`GPS Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setGpsLoading(false);
      },
      (error) => {
        console.error("GPS fetching error:", error);
        let errorMsg = "Unable to retrieve precise location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location access denied. Using reference coordinates.";
        }
        setLocationError(errorMsg);
        // Fallback reference coordinates
        setCoords({ lat: 28.6304, lng: 77.2177 });
        setLocationName("Connaught Place, New Delhi (Default Reference)");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const startDispatch = () => {
    setCountdown(5);
    setDispatching(true);
    setDispatched(false);
  };

  function cancelDispatch() {
    setDispatching(false);
    if (countdownInterval.current) clearTimeout(countdownInterval.current);
    setCountdown(5);
  }

  const copyLocationLink = () => {
    if (!coords) return;
    const shareUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const helplines: Helpline[] = [
    { name: "Emergency Services (General)", number: "112", desc: "Unified national emergency number", category: "General" },
    { name: "Police Department", number: "100", desc: "Law enforcement & public security dispatcher", category: "Security" },
    { name: "Ambulance / Medical Response", number: "102", desc: "First-responder medical help & paramedic dispatch", category: "Medical" },
    { name: "Fire & Rescue Control", number: "101", desc: "Fire safety and rescue operational services", category: "Security" },
    { name: "Women's Safety Helpline", number: "1091", desc: "Immediate defense and safety support line for women", category: "Support" },
    { name: "Road Accident Helpline", number: "1073", desc: "Highway and local traffic accident response registry", category: "Support" },
    { name: "RIDEX Direct Safety Desk", number: "+1 (800) 743-3972", desc: "24/7 internal crisis team for active RideX dispatch routes", category: "General" }
  ];

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Emergency SOS button"
        >
          {/* Pulsing ring outline */}
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30 pointer-events-none" />
          
          <ShieldAlert className="w-8 h-8 group-hover:rotate-6 transition-transform" />
          
          <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-md shadow-md border border-slate-800 whitespace-nowrap">
            EMERGENCY SOS
          </span>
        </motion.button>
      </div>

      {/* SOS Modal Dialog Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!dispatching) setIsOpen(false);
              }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Modal Content container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden text-slate-800 flex flex-col max-h-[85vh] z-10"
            >
              {/* Emergency Header */}
              <div className="bg-red-50 border-b border-red-100 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-md">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">SOS EMERGENCY DESPATCH</h2>
                    <p className="text-xs text-red-600 font-bold uppercase tracking-wider">RideX safety monitoring active</p>
                  </div>
                </div>
                {!dispatching && (
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-50 border-b border-slate-100 shrink-0">
                {[
                  { id: "location" as const, label: "Live Location" },
                  { id: "sos" as const, label: "SOS Dispatch" },
                  { id: "both" as const, label: "Both (Combined)" }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`py-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer text-center ${
                      activeTab === t.id
                        ? "bg-white border border-slate-200/80 text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Scrollable Container */}
              <div className="overflow-y-auto p-6 space-y-6 flex-grow">
                {/* Simulated Dispatch Control Center */}
                {(activeTab === "sos" || activeTab === "both") && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center">
                    {!dispatching && !dispatched && (
                      <>
                        <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center mb-3">
                          <BellRing className="w-8 h-8 text-red-600 animate-bounce" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 mb-1">Trigger Auto-Dispatch Command</h3>
                        <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed font-medium">
                          Alert local emergency dispatch and nearby patrol. This will share your exact coordinates.
                        </p>
                        <button
                          onClick={startDispatch}
                          className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-98 transition-all text-white rounded-xl font-extrabold tracking-wide shadow-md shadow-red-500/10 hover:shadow-red-500/20 cursor-pointer text-sm"
                        >
                          ACTIVATE SOS DISPATCH
                        </button>
                      </>
                    )}

                    {dispatching && (
                      <div className="w-full flex flex-col items-center py-4">
                        {/* Countdown Visualizer */}
                        <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-red-100 mb-4 bg-red-50">
                          <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
                          <span className="text-4xl font-black text-red-600">{countdown}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1">DISPATCHING SOS SIGNAL</h3>
                        <p className="text-xs text-slate-500 max-w-xs mb-4 leading-relaxed font-medium">
                          Sharing GPS tracking links with public safety centers in {countdown} seconds...
                        </p>
                        <button
                          onClick={cancelDispatch}
                          className="py-2.5 px-6 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          CANCEL EMERGENCY SIGNAL
                        </button>
                      </div>
                    )}

                    {dispatched && (
                      <div className="w-full flex flex-col items-center py-2">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-3">
                          <ShieldCheck className="w-9 h-9 text-emerald-600" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1">SOS DISPATCH SENT</h3>
                        <p className="text-xs text-slate-500 max-w-xs mb-4 leading-relaxed font-semibold">
                          Emergency responders and nearby safety patrol vehicles have been notified with coordinates. Keep line clear.
                        </p>
                        <div className="flex gap-2.5 w-full">
                          <button
                            onClick={startDispatch}
                            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            Trigger Again
                          </button>
                          <button
                            onClick={() => setDispatched(false)}
                            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            Clear Alert State
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Location Sharing Card */}
                {(activeTab === "location" || activeTab === "both") && (
                  <div className="border border-slate-150 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <MapPin className="w-4 h-4 text-red-500" />
                        My Safety Geolocation
                      </span>
                      <button
                        onClick={fetchLocation}
                        disabled={gpsLoading}
                        className="text-[10px] font-bold text-slate-400 hover:text-[#fbbf24] flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer uppercase"
                      >
                        <RefreshCw className={`w-3 h-3 ${gpsLoading ? "animate-spin" : ""}`} />
                        Refresh GPS
                      </button>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 text-left border border-slate-100">
                      {gpsLoading ? (
                        <div className="flex items-center gap-2 py-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-ping" />
                          <span className="text-[11px] text-slate-400 font-medium">Acquiring satellite signals...</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-[11px] font-bold text-slate-800 break-all select-all font-mono leading-tight">
                            {locationName}
                          </p>
                          {coords && (
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">
                              Accuracy: GPS verified within active browser boundaries.
                            </p>
                          )}
                          {locationError && (
                            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              {locationError}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {coords && (
                      <button
                        onClick={copyLocationLink}
                        className="w-full flex items-center justify-center gap-1.5 py-2 border border-slate-200 hover:border-slate-300 text-[11px] font-bold rounded-xl text-slate-600 transition-all hover:bg-slate-50 cursor-pointer shadow-sm"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>COPIED SAFETY TRACKING LINK!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>COPY MAP COORDINATES LINK</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Helpline Directory */}
                {(activeTab === "sos" || activeTab === "both") && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#fbbf24]" />
                      Public Safety Helplines
                    </h3>

                    <div className="grid grid-cols-1 gap-2.5">
                      {helplines.map((help, idx) => (
                        <a
                          key={idx}
                          href={`tel:${help.number}`}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-red-200 bg-white hover:bg-red-50/20 shadow-sm transition-all group cursor-pointer"
                        >
                          <div className="flex flex-col gap-0.5 max-w-[75%]">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-none mb-0.5">
                              {help.category} Help
                            </span>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                              {help.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">
                              {help.desc}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl py-1.5 px-3 group-hover:bg-red-600 group-hover:border-red-700 group-hover:text-white transition-all shadow-sm">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-xs font-black tracking-tight">{help.number}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Advisory */}
                {(activeTab === "sos" || activeTab === "both") && (
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-3 text-left">
                    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-amber-800">Public Security Information</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold mt-0.5">
                        These resources operate 24/7 to safeguard the general public. In case of localized physical danger or emergency distress, trigger the dispatch or place direct voice calls.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer info banner */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                <span>Estd. Public Rescue Network</span>
                <span>Active 24x7 Support</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
