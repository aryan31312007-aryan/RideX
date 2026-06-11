"use client";

import React from "react";
import Link from "next/link";
import { Navigation, Twitter, Facebook, Instagram, Linkedin, GitBranch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-950 border-t border-white/5 py-12 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
              <Navigation className="w-5 h-5 text-primary rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              RIDE<span className="text-primary">X</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            AI-driven delivery, logistics, mobility, and future transportation ecosystem.
          </p>
          <div className="flex items-center gap-4 text-gray-400 mt-2">
            <Twitter className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            <Facebook className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            <Instagram className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            <Linkedin className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Portals */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Services</h4>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            Customer Booking
          </Link>
          <Link href="/driver" className="text-sm text-gray-400 hover:text-white transition-colors">
            Driver Portal
          </Link>
          <Link href="/corporate" className="text-sm text-gray-400 hover:text-white transition-colors">
            Corporate Logistics
          </Link>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
            Admin Panel
          </Link>
        </div>

        {/* Platform links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h4>
          <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/features" className="text-sm text-gray-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
            Pricing Plans
          </Link>
          <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
            Contact Support
          </Link>
        </div>

        {/* Newsletter subscription */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Stay Updated</h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-1">
            Subscribe to our newsletter for route analytics and fleet reports.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="name@company.com"
              className="flex-1 px-3 py-2 text-xs rounded-lg glass-input text-white focus:outline-none"
            />
            <button className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg transition-all cursor-pointer">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <div>
          &copy; {new Date().getFullYear()} RIDEX Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-2 text-gray-600 font-mono">
          <GitBranch className="w-3.5 h-3.5" />
          <span>v1.0.0-MVP (Firebase Engine)</span>
        </div>
        <div className="flex gap-6">
          <span className="hover:text-gray-300 transition-colors cursor-pointer">Terms of Service</span>
          <span className="hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-gray-300 transition-colors cursor-pointer">Sitemap</span>
        </div>
      </div>
    </footer>
  );
}
