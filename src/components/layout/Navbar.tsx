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

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-primary/20 p-2 rounded-xl border border-primary/30 group-hover:border-primary/60 transition-all duration-300">
          <Navigation className="w-6 h-6 text-primary rotate-45 group-hover:rotate-90 transition-transform duration-500" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
          RIDE<span className="text-primary font-extrabold">X</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
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
              className={`relative py-1 text-sm transition-colors duration-200 ${
                isActive ? "text-primary" : "text-gray-300 hover:text-white"
              }`}
            >
              {link.name}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[11px] font-bold text-primary">
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
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-gray-950 p-2 shadow-2xl z-20"
                  >
                    <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                      <p className="text-xs text-gray-400 font-mono">LOGGED IN AS</p>
                      <p className="text-sm font-semibold text-white capitalize">{profile.role}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                      Customer Dashboard
                    </Link>

                    <Link
                      href="/driver"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Navigation className="w-4 h-4 text-yellow-500" />
                      Driver Portal
                    </Link>

                    <Link
                      href="/corporate"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <UserIcon className="w-4 h-4 text-green-500" />
                      Corporate Solutions
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      Admin Dashboard
                    </Link>

                    <hr className="border-white/5 my-1.5" />

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
              className="text-sm text-gray-300 hover:text-white px-4 py-2 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-5 py-2.5 rounded-xl border border-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-gray-300 hover:text-white p-2 rounded-xl border border-white/5 bg-white/5"
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
            className="absolute top-full left-0 right-0 glass-panel border-b border-white/5 lg:hidden flex flex-col p-6 gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-2 text-base transition-colors ${
                  pathname === link.href ? "text-primary font-bold" : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-white/5 my-2" />

            {user && profile ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {profile.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{profile.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5"
                  >
                    Customer App
                  </Link>
                  <Link
                    href="/driver"
                    onClick={() => setIsOpen(false)}
                    className="py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5"
                  >
                    Driver Portal
                  </Link>
                  <Link
                    href="/corporate"
                    onClick={() => setIsOpen(false)}
                    className="py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5"
                  >
                    Corporate App
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5"
                  >
                    Admin Control
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
                  className="w-full py-3 rounded-xl border border-white/10 text-white text-center hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-center hover:bg-primary-hover transition-all"
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
