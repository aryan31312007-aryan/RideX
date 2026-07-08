"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { Menu, X, User as UserIcon, LogOut, ChevronDown, ShieldAlert, Sparkles, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, profile, logout } = useFirebase();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Rides", href: "/#booking-section" },
    { name: "Delivery", href: "/#categories" },
    { name: "Transport", href: "/#categories" },
    { name: "Safety", href: "/#safety" },
    { name: "About Us", href: "/about" },
    { name: "Support", href: "/help" },
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const triggerSOS = () => {
    window.dispatchEvent(new CustomEvent("open-sos-modal"));
  };

  const isHome = pathname === "/";

  // Dynamic style variables based on active path (standardized to premium clean light theme)
  const navBg = "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm";
  const logoText = "text-slate-900";
  const logoIconBg = "bg-amber-100 border-amber-200/80 group-hover:border-amber-300/80";
  const logoIcon = "text-amber-500";
  const linkText = (isActive: boolean) => isActive ? "text-amber-500 font-semibold" : "text-slate-600 hover:text-slate-900";
  const indicatorColor = "bg-[#fbbf24]";
  const actionBtn = "bg-slate-50 border border-slate-200/60 text-slate-700 hover:bg-slate-100 hover:border-slate-300 shadow-sm";
  const registerBtn = "bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-900 font-bold shadow-sm shadow-[#fbbf24]/10";
  const signInText = "text-slate-600 hover:text-slate-900";
  const mobileMenuBtn = "text-slate-600 hover:text-slate-900 border border-slate-200/60 bg-slate-50";
  const dropdownBg = "bg-white border border-slate-200/80 shadow-2xl text-slate-800";
  const dropdownItem = "text-slate-600 hover:text-slate-900 hover:bg-slate-50";
  const dropdownHeader = "border-slate-100 text-slate-500";
  const dividerStyle = "border-slate-100";
  const profileBadgeBg = "bg-amber-100 border-amber-200 text-amber-800 font-bold";

  return (
    <nav className={`sticky top-0 z-50 w-full py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 ${navBg}`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <svg className="w-8 h-8 text-[#fbbf24]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 20H55C70 20 80 30 80 42.5C80 55 70 65 55 65H40V85H20V20ZM40 37V48H55C58 48 60 46 60 42.5C60 39 58 37 55 37H40Z" fill="currentColor" />
          <path d="M50 55L75 85H55L35 60H50Z" fill="currentColor" />
        </svg>
        <span className={`text-2xl font-black tracking-tight flex items-center gap-0.5 ${logoText}`}>
          RIDE<span className="text-[#fbbf24] font-extrabold">X</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-8 font-medium">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-1 text-sm transition-colors duration-200 ${linkText(isActive)}`}
            >
              {link.name}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${indicatorColor}`}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="hidden lg:flex items-center gap-4">
        <button
          onClick={triggerSOS}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span>SOS EMERGENCY</span>
        </button>

        {user && profile ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${actionBtn}`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] ${profileBadgeBg}`}>
                {profile.name[0]}
              </div>
              <span className="max-w-[120px] truncate">{profile.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 mt-2 w-56 rounded-2xl p-2 z-20 ${dropdownBg}`}
                  >
                    <div className={`px-3 py-2 border-b mb-1.5 ${dropdownHeader}`}>
                      <p className="text-[10px] uppercase font-mono tracking-wider">Logged in as</p>
                      <p className="text-sm font-semibold capitalize">{profile.role}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${dropdownItem}`}
                    >
                      <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                      Customer Dashboard
                    </Link>

                    <Link
                      href="/driver"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${dropdownItem}`}
                    >
                      <Navigation className="w-4 h-4 text-[#fbbf24]" />
                      Driver Portal
                    </Link>

                    <Link
                      href="/corporate"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${dropdownItem}`}
                    >
                      <UserIcon className="w-4 h-4 text-emerald-500" />
                      Corporate Solutions
                    </Link>

                    <hr className={`my-1.5 ${dividerStyle}`} />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white cursor-pointer">
              <svg className="w-4.5 h-4.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <Link
              href="/auth/login"
              className={`text-sm font-medium px-4 py-2 transition-all ${signInText}`}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className={`text-sm font-bold px-5 py-2.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all ${registerBtn}`}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden p-2 rounded-xl ${mobileMenuBtn}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`absolute top-full left-0 right-0 border-b lg:hidden flex flex-col p-6 gap-4 z-50 ${navBg}`}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                triggerSOS();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md shadow-red-600/10 active:scale-95 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span>EMERGENCY SOS DIRECTORY</span>
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-2 text-base transition-colors ${
                  pathname === link.href 
                    ? "text-[#fbbf24] font-bold" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className={`my-2 ${dividerStyle}`} />

            {user && profile ? (
              <div className="flex flex-col gap-3 text-left">
                <div className="flex items-center gap-3 py-2 px-3 rounded-xl border border-slate-200/80 bg-slate-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${profileBadgeBg}`}>
                    {profile.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{profile.name}</p>
                    <p className="text-xs capitalize text-slate-500">{profile.role}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200/60 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all font-semibold"
                  >
                    <Sparkles className="w-4 h-4 text-[#fbbf24] shrink-0" />
                    <span>Customer Dashboard</span>
                  </Link>
                  <Link
                    href="/driver"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200/60 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all font-semibold"
                  >
                    <Navigation className="w-4 h-4 text-[#fbbf24] shrink-0" />
                    <span>Driver Portal</span>
                  </Link>
                  <Link
                    href="/corporate"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200/60 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all font-semibold"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Corporate Solutions</span>
                  </Link>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full py-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-center transition-all mt-2 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-center transition-all font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className={`w-full py-3 rounded-xl font-semibold text-center transition-all ${registerBtn}`}
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
