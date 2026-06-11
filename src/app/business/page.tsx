"use client";

import React from "react";
import Link from "next/link";
import { Truck, Briefcase, FileText, BarChart3, Users, Zap, CheckCircle2 } from "lucide-react";

export default function BusinessPage() {
  const corpBenefits = [
    {
      title: "Shared Corporate Billing",
      desc: "Consolidate your staff logistics under a single credit account. Review trip sheets, manage employee limits, and pay monthly invoices.",
      icon: <FileText className="w-5 h-5 text-primary" />
    },
    {
      title: "Bulk Order Upload",
      desc: "Import spreadsheets containing hundreds of delivery destinations. Our batch dispatching engine instantly schedules drivers.",
      icon: <Zap className="w-5 h-5 text-yellow-500" />
    },
    {
      title: "Employee Roster Management",
      desc: "Add or remove personnel, view their dispatch records, and restrict delivery budgets directly from the corporate portal.",
      icon: <Users className="w-5 h-5 text-green-500" />
    },
    {
      title: "Logistics Analytics",
      desc: "Export real-time audit trails, delivery times, peak hours performance, and spend reports to CSV/PDF.",
      icon: <BarChart3 className="w-5 h-5 text-blue-500" />
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-20 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full mb-16">
        <div className="lg:col-span-7 text-left flex flex-col gap-6">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary uppercase w-fit">
            RIDEX FOR BUSINESS
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Streamline Your Fleet & <br />
            <span className="text-gradient">Corporate Deliveries</span>
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
              <div key={idx} className="flex items-center gap-3 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <Link
              href="/auth/register"
              className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all shadow-lg shadow-primary/20"
            >
              Register Corporate Account
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-sm transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Corporate dashboard mockup banner */}
        <div className="lg:col-span-5 w-full">
          <div className="w-full glass-card p-6 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-white">Logistics Overview</span>
              </div>
              <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">
                Active Account
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Credit Balance</p>
                <p className="text-xl font-bold text-white mt-1">₹25,450.00</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Employee Limit</p>
                <p className="text-xl font-bold text-white mt-1">15 Active</p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-left flex flex-col gap-2">
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Recent Bulk Dispatch</p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300">manifest_June_11.csv</span>
                <span className="text-primary font-bold">120 Dispatched</span>
              </div>
            </div>
            
            <Link
              href="/corporate"
              className="w-full text-center py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-all mt-2"
            >
              Test Corporate Panel
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full pt-12 border-t border-white/5">
        {corpBenefits.map((benefit, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col gap-4 text-left"
          >
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 w-fit">
              {benefit.icon}
            </div>
            <h3 className="text-base font-bold text-white">{benefit.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
