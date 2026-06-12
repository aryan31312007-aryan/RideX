"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navigation, Twitter, Facebook, Instagram, Linkedin, GitBranch } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Dynamic styling styles
  const footerBg = isHome 
    ? "bg-slate-50 border-t border-slate-200/60 text-slate-700" 
    : "bg-gray-950 border-t border-white/5 text-gray-400";
    
  const headingColor = isHome ? "text-slate-900 font-bold" : "text-white font-semibold";
  const textColor = isHome ? "text-slate-500" : "text-gray-400";
  const linkHoverColor = isHome ? "text-slate-600 hover:text-purple-600" : "text-gray-400 hover:text-white";
  const iconColor = isHome ? "text-slate-400 hover:text-purple-600" : "text-gray-400 hover:text-white";
  
  const logoText = isHome ? "text-slate-800" : "text-white";
  const logoIconBg = isHome 
    ? "bg-purple-100 border-purple-200/50" 
    : "bg-primary/20 border-primary/30";
  const logoIconColor = isHome ? "text-purple-600" : "text-primary";
  
  const bottomBorder = isHome ? "border-slate-200/60" : "border-white/5";
  const bottomText = isHome ? "text-slate-400" : "text-gray-500";
  const bottomHover = isHome ? "hover:text-purple-600 text-slate-400" : "hover:text-gray-300 text-gray-500";

  return (
    <footer className={`w-full py-12 px-6 md:px-12 mt-auto transition-all duration-300 ${footerBg}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl border ${logoIconBg}`}>
              <Navigation className={`w-5 h-5 rotate-45 ${logoIconColor}`} />
            </div>
            <span className={`text-xl font-bold tracking-tight ${logoText}`}>
              RIDE<span className={isHome ? "text-purple-600 font-extrabold" : "text-primary"}>X</span>
            </span>
          </div>
          <p className={`text-sm leading-relaxed max-w-xs ${textColor}`}>
            AI-driven delivery, logistics, mobility, and future transportation ecosystem.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Twitter className={`w-4 h-4 transition-colors cursor-pointer ${iconColor}`} />
            <Facebook className={`w-4 h-4 transition-colors cursor-pointer ${iconColor}`} />
            <Instagram className={`w-4 h-4 transition-colors cursor-pointer ${iconColor}`} />
            <Linkedin className={`w-4 h-4 transition-colors cursor-pointer ${iconColor}`} />
          </div>
        </div>

        {/* Portals */}
        <div className="flex flex-col gap-3">
          <h4 className={`text-sm tracking-wider uppercase ${headingColor}`}>Services</h4>
          <Link href="/dashboard" className={`text-sm transition-colors ${linkHoverColor}`}>
            Customer Booking
          </Link>
          <Link href="/driver" className={`text-sm transition-colors ${linkHoverColor}`}>
            Driver Portal
          </Link>
          <Link href="/corporate" className={`text-sm transition-colors ${linkHoverColor}`}>
            Corporate Logistics
          </Link>
          <Link href="/admin" className={`text-sm transition-colors ${linkHoverColor}`}>
            Admin Panel
          </Link>
        </div>

        {/* Platform links */}
        <div className="flex flex-col gap-3">
          <h4 className={`text-sm tracking-wider uppercase ${headingColor}`}>Company</h4>
          <Link href="/about" className={`text-sm transition-colors ${linkHoverColor}`}>
            About Us
          </Link>
          <Link href="/features" className={`text-sm transition-colors ${linkHoverColor}`}>
            Features
          </Link>
          <Link href="/pricing" className={`text-sm transition-colors ${linkHoverColor}`}>
            Pricing Plans
          </Link>
          <Link href="/contact" className={`text-sm transition-colors ${linkHoverColor}`}>
            Contact Support
          </Link>
        </div>

        {/* Newsletter subscription */}
        <div className="flex flex-col gap-3">
          <h4 className={`text-sm tracking-wider uppercase ${headingColor}`}>Stay Updated</h4>
          <p className={`text-xs leading-relaxed mb-1 ${textColor}`}>
            Subscribe to our newsletter for route analytics and fleet reports.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="name@company.com"
              className={`flex-1 px-3 py-2 text-xs focus:outline-none ${
                isHome ? "glass-input-light bg-white" : "glass-input text-white"
              }`}
            />
            <button className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isHome 
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700" 
                : "bg-primary hover:bg-primary-hover text-white"
            }`}>
              Join
            </button>
          </div>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs ${bottomBorder} ${bottomText}`}>
        <div>
          &copy; {new Date().getFullYear()} RIDEX Inc. All rights reserved.
        </div>
        <div className={`flex items-center gap-2 font-mono ${isHome ? "text-slate-400" : "text-gray-600"}`}>
          <GitBranch className="w-3.5 h-3.5" />
          <span>v1.0.0-MVP (Firebase Engine)</span>
        </div>
        <div className="flex gap-6">
          <span className={`transition-colors cursor-pointer ${bottomHover}`}>Terms of Service</span>
          <span className={`transition-colors cursor-pointer ${bottomHover}`}>Privacy Policy</span>
          <span className={`transition-colors cursor-pointer ${bottomHover}`}>Sitemap</span>
        </div>
      </div>
    </footer>
  );
}
