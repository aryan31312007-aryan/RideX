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
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Business Solutions", href: "/business" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Help Center", href: "/help" },
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const isHome = pathname === "/";

  // Dynamic style variables based on active path
  const navBg = isHome 
    ? "glass-panel-light border-b border-slate-200/50" 
    : "glass-panel border-b border-white/5";
    
  const logoText = isHome
    ? "text-slate-800"
    : "text-white";
    
  const logoIconBg = isHome
    ? "bg-purple-100 border-purple-200/80 group-hover:border-purple-300/80"
    : "bg-primary/20 border-primary/30 group-hover:border-primary/60";

  const logoIcon = isHome ? "text-purple-600" : "text-primary";
    
  const linkText = (isActive: boolean) => {
    if (isHome) {
      return isActive ? "text-purple-600 font-semibold" : "text-slate-600 hover:text-slate-900";
    }
    return isActive ? "text-primary" : "text-gray-300 hover:text-white";
  };
  
  const indicatorColor = isHome ? "bg-purple-600" : "bg-primary";
  
  const actionBtn = isHome
    ? "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20";
    
  const registerBtn = isHome
    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20"
    : "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20";
    
  const signInText = isHome
    ? "text-slate-600 hover:text-slate-900"
    : "text-gray-300 hover:text-white";
    
  const mobileMenuBtn = isHome
    ? "text-slate-600 hover:text-slate-900 border border-slate-200/60 bg-slate-50"
    : "text-gray-300 hover:text-white border border-white/5 bg-white/5";
    
  const dropdownBg = isHome
    ? "bg-white border border-slate-200/80 shadow-2xl text-slate-800"
    : "bg-gray-950 border border-white/10 shadow-2xl text-white";

  const dropdownItem = isHome
    ? "text-slate-600 hover:text-purple-700 hover:bg-purple-50/50"
    : "text-gray-300 hover:text-white hover:bg-white/5";

  const dropdownHeader = isHome
    ? "border-slate-100 text-slate-500"
    : "border-white/5 text-gray-400";

  const dividerStyle = isHome ? "border-slate-100" : "border-white/5";

  const profileBadgeBg = isHome
    ? "bg-purple-100 border-purple-200 text-purple-700 font-bold"
    : "bg-primary/20 border-primary/30 text-primary font-bold";

  return (
    <nav className={`sticky top-0 z-50 w-full py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 ${navBg}`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className={`p-2 rounded-xl border transition-all duration-300 ${logoIconBg}`}>
          <Navigation className={`w-6 h-6 rotate-45 group-hover:rotate-90 transition-transform duration-500 ${logoIcon}`} />
        </div>
        <span className={`text-2xl font-bold tracking-tight flex items-center gap-1 ${logoText}`}>
          RIDE<span className={isHome ? "text-purple-600 font-extrabold" : "text-primary font-extrabold"}>X</span>
          <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border ${
            isHome 
              ? "bg-purple-50 text-purple-600 border-purple-200" 
              : "bg-primary/20 text-primary border-primary/30"
          }`}>
            v1
          </span>
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
                      <Sparkles className={`w-4 h-4 ${isHome ? "text-purple-600" : "text-primary"}`} />
                      Customer Dashboard
                    </Link>

                    <Link
                      href="/driver"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${dropdownItem}`}
                    >
                      <Navigation className="w-4 h-4 text-yellow-500" />
                      Driver Portal
                    </Link>

                    <Link
                      href="/corporate"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${dropdownItem}`}
                    >
                      <UserIcon className="w-4 h-4 text-green-500" />
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
          <>
            <Link
              href="/auth/login"
              className={`text-sm px-4 py-2 transition-all ${signInText}`}
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className={`text-sm font-semibold px-5 py-2.5 rounded-xl border border-transparent hover:scale-[1.02] active:scale-[0.98] transition-all ${registerBtn}`}
            >
              Register
            </Link>
          </>
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
            className={`absolute top-full left-0 right-0 border-b lg:hidden flex flex-col p-6 gap-4 z-50 ${isHome ? "glass-panel-light" : "glass-panel"}`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-2 text-base transition-colors ${
                  pathname === link.href 
                    ? isHome ? "text-purple-600 font-bold" : "text-primary font-bold" 
                    : isHome ? "text-slate-600 hover:text-slate-900" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className={`my-2 ${dividerStyle}`} />

            {user && profile ? (
              <div className="flex flex-col gap-3">
                <div className={`flex items-center gap-3 py-2 px-3 rounded-xl border ${
                  isHome ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${profileBadgeBg}`}>
                    {profile.name[0]}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isHome ? "text-slate-800" : "text-white"}`}>{profile.name}</p>
                    <p className={`text-xs capitalize ${isHome ? "text-slate-500" : "text-gray-400"}`}>{profile.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`py-2.5 rounded-lg border transition-all ${
                      isHome ? "border-slate-200 text-slate-700 hover:bg-slate-50" : "border-white/10 text-white hover:bg-white/5"
                    }`}
                  >
                    Customer App
                  </Link>
                  <Link
                    href="/driver"
                    onClick={() => setIsOpen(false)}
                    className={`py-2.5 rounded-lg border transition-all ${
                      isHome ? "border-slate-200 text-slate-700 hover:bg-slate-50" : "border-white/10 text-white hover:bg-white/5"
                    }`}
                  >
                    Driver Portal
                  </Link>
                  <Link
                    href="/corporate"
                    onClick={() => setIsOpen(false)}
                    className={`py-2.5 rounded-lg border transition-all ${
                      isHome ? "border-slate-200 text-slate-700 hover:bg-slate-50" : "border-white/10 text-white hover:bg-white/5"
                    }`}
                  >
                    Corporate App
                  </Link>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/20 text-center transition-all mt-2 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className={`w-full py-3 rounded-xl border text-center transition-all ${
                    isHome ? "border-slate-200 text-slate-700 hover:bg-slate-50" : "border-white/10 text-white hover:bg-white/5"
                  }`}
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
