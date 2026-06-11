"use client";

import React from "react";
import Link from "next/link";
import { Navigation, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-20 px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-md glass-card p-10 rounded-3xl border border-white/10 shadow-2xl text-center flex flex-col items-center gap-6">
        <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 text-red-500">
          <AlertTriangle className="w-10 h-10 animate-bounce" />
        </div>
        <div>
          <h1 className="text-6xl font-extrabold text-white font-mono tracking-tight text-gradient">404</h1>
          <h2 className="text-xl font-bold text-white mt-2">Coordinates Out of Bounds</h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            The requested grid sector does not exist on our navigation matrix. Return to head office for active dispatch.
          </p>
        </div>

        <Link
          href="/"
          className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold w-full transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
        >
          <Navigation className="w-4 h-4 rotate-45" /> Return to Headquarters
        </Link>
      </div>
    </div>
  );
}
