"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { ref, push, set } from "firebase/database";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  // Page-level Light Mode override
  useEffect(() => {
    const body = document.body;
    const prevBg = body.style.backgroundColor;
    const prevColor = body.style.color;
    
    body.style.backgroundColor = "#fafaff";
    body.style.color = "#0f172a";
    
    const html = document.documentElement;
    const hasDark = html.classList.contains("dark");
    if (hasDark) {
      html.classList.remove("dark");
    }

    return () => {
      body.style.backgroundColor = prevBg;
      body.style.color = prevColor;
      if (hasDark) {
        html.classList.add("dark");
      }
    };
  }, []);

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    try {
      const contactsRef = ref(db, "contacts");
      const newContactRef = push(contactsRef);
      await set(newContactRef, {
        ...formData,
        timestamp: new Date().toISOString()
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact inquiry:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fafaff] py-20 px-6 md:px-12 flex flex-col items-center relative overflow-hidden text-left">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/30 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-100/20 blur-[120px] pointer-events-none -z-10" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-20" />

      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16 relative z-10">
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 uppercase w-fit mx-auto shadow-sm">
          Get in Touch
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-none">
          Contact Support & Sales
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Have a question about corporate billing integration or custom API dispatches? Submit a ticket and our engineering team will get back to you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 w-full relative z-10">
        {/* Contact Info */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <div className="glass-card-light p-6 rounded-3xl border border-slate-200/60 flex gap-4 items-start bg-white/60 shadow-md">
            <div className="bg-purple-100 p-3.5 rounded-2xl border border-purple-200 text-purple-600 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 mb-1">Email Inquiry</h4>
              <p className="text-xs text-slate-500 font-semibold">support@ridex.io</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">sales@ridex.io</p>
            </div>
          </div>

          <div className="glass-card-light p-6 rounded-3xl border border-slate-200/60 flex gap-4 items-start bg-white/60 shadow-md">
            <div className="bg-blue-100 p-3.5 rounded-2xl border border-blue-200 text-blue-600 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 mb-1">Phone Helpline</h4>
              <p className="text-xs text-slate-500 font-semibold">+1 (800) 555-RIDEX</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Mon - Fri, 9am - 6pm EST</p>
            </div>
          </div>

          <div className="glass-card-light p-6 rounded-3xl border border-slate-200/60 flex gap-4 items-start bg-white/60 shadow-md">
            <div className="bg-emerald-100 p-3.5 rounded-2xl border border-emerald-200 text-emerald-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 mb-1">Global Headquarters</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                100 Pine Street, Suite 1200<br />
                San Francisco, CA 94111
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 w-full">
          <div className="w-full glass-card-light p-8 rounded-3xl border border-slate-200/80 shadow-xl bg-white/70 backdrop-blur-xl">
            {submitted ? (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
                <h3 className="text-2xl font-bold text-slate-800">Inquiry Submitted!</h3>
                <p className="text-xs text-slate-500 font-semibold max-w-sm leading-relaxed">
                  Thank you for contacting RIDEX. Our technical operators have logged your request to Firebase and will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold mt-4 transition-all shadow-md shadow-purple-500/10 cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tony Stark"
                      className="px-4 py-3 rounded-xl glass-input-light text-xs text-slate-800 focus:outline-none border border-slate-200/80 bg-white font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tony@stark.com"
                      className="px-4 py-3 rounded-xl glass-input-light text-xs text-slate-800 focus:outline-none border border-slate-200/80 bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Fleet API access integration"
                    className="px-4 py-3 rounded-xl glass-input-light text-xs text-slate-800 focus:outline-none border border-slate-200/80 bg-white font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write details about your operational scope or support inquiry here..."
                    className="px-4 py-3 rounded-xl glass-input-light text-xs text-slate-800 focus:outline-none resize-none border border-slate-200/80 bg-white font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-purple-500/10"
                >
                  {loading ? "Sending..." : "Submit Inquiry"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
