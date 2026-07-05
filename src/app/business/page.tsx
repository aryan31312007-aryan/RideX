"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Truck, Briefcase, FileText, BarChart3, Users, Zap, CheckCircle2 } from "lucide-react";

export default function BusinessPage() {
  const corpBenefits = [
    {
      title: "Shared Corporate Billing",
      desc: "Consolidate your staff logistics under a single credit account. Review trip sheets, manage employee limits, and pay monthly invoices.",
      icon: <FileText className="w-5 h-5 text-[#fbbf24]" />
    },
    {
      title: "Bulk Order Upload",
      desc: "Import spreadsheets containing hundreds of delivery destinations. Our batch dispatching engine instantly schedules drivers.",
      icon: <Zap className="w-5 h-5 text-[#fbbf24]" />
    },
    {
      title: "Employee Roster Management",
      desc: "Add or remove personnel, view their dispatch records, and restrict delivery budgets directly from the corporate portal.",
      icon: <Users className="w-5 h-5 text-[#fbbf24]" />
    },
    {
      title: "Logistics Analytics",
      desc: "Export real-time audit trails, delivery times, peak hours performance, and spend reports to CSV/PDF.",
      icon: <BarChart3 className="w-5 h-5 text-[#fbbf24]" />
    }
  ];

  // Set page-level styling reset to sleek premium dark-mode default
  useEffect(() => {
    const body = document.body;
    const prevBg = body.style.backgroundColor;
    const prevColor = body.style.color;
    
    body.style.backgroundColor = "#030712";
    body.style.color = "#f3f4f6";
    
    const html = document.documentElement;
    const hasDark = html.classList.contains("dark");
    if (!hasDark) {
      html.classList.add("dark");
    }

    return () => {
      body.style.backgroundColor = prevBg;
      body.style.color = prevColor;
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#030712] py-24 px-6 md:px-12 flex flex-col items-center relative overflow-hidden">
      {/* Decorative ambient background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#fbbf24]/5 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#6366f1]/5 blur-[120px] pointer-events-none -z-10" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-20" />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full mb-16 relative z-10">
        <div className="lg:col-span-7 text-left flex flex-col gap-6">
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#fbbf24] w-fit tracking-wider">
            RIDEX FOR BUSINESS
          </span>
          <h1 className="text-3xl md:text-5.5xl font-black text-white leading-tight tracking-tight">
            Streamline Your Fleet & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]">Corporate Deliveries</span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-xl">
            Empower your operations team to orchestrate regional delivery dispatch, optimize routes, and manage employee rides under a central business account.
          </p>

          <div className="flex flex-col gap-3.5 mt-2">
            {[
              "Bulk orders creation through spreadsheet uploads",
              "Consolidated monthly credit invoicing",
              "Real-time driver assignment maps & verification status"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-gray-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#fbbf24] shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <Link
              href="/auth/register"
              className="px-6 py-4 rounded-xl bg-[#fbbf24] hover:bg-[#e5ae20] text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-[#fbbf24]/10 hover:scale-[1.01]"
            >
              Register Corporate Account
            </Link>
            <Link
              href="/contact"
              className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Corporate dashboard mockup banner */}
        <div className="lg:col-span-5 w-full">
          <div className="w-full glass-card p-6 rounded-[32px] border border-white/5 flex flex-col gap-4 shadow-2xl relative overflow-hidden bg-white/5 backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#fbbf24]/5 blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#fbbf24]" />
                <span className="text-sm font-bold text-white">Logistics Overview</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/25 font-bold uppercase tracking-wider">
                Active Account
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Credit Balance</p>
                <p className="text-xl font-bold text-[#fbbf24] mt-1">₹25,450.00</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Employee Limit</p>
                <p className="text-xl font-bold text-white mt-1">15 Active</p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left flex flex-col gap-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Recent Bulk Dispatch</p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-semibold">manifest_June_11.csv</span>
                <span className="text-[#fbbf24] font-extrabold">120 Dispatched</span>
              </div>
            </div>
            
            <Link
              href="/corporate"
              className="w-full text-center py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all mt-2"
            >
              Test Corporate Panel
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full pt-12 border-t border-white/5 relative z-10">
        {corpBenefits.map((benefit, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-4 text-left bg-white/5"
          >
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 w-fit">
              {benefit.icon}
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">{benefit.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
