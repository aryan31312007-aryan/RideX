"use client";

import React, { useState } from "react";
import { db } from "@/utils/firebase";
import { ref, push, set } from "firebase/database";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
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
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-20 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16">
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary uppercase w-fit mx-auto">
          Get in Touch
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          Contact Support & Sales
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          Have a question about corporate billing integration or custom API dispatches? Submit a ticket and our engineering team will get back to you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
        {/* Contact Info */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <div className="glass-card p-6 rounded-2xl border border-white/5 flex gap-4 items-start">
            <div className="bg-primary/20 p-3 rounded-xl border border-primary/30 text-primary shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Email Inquiry</h4>
              <p className="text-xs text-gray-400">support@ridex.io</p>
              <p className="text-xs text-gray-400 mt-0.5">sales@ridex.io</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 flex gap-4 items-start">
            <div className="bg-yellow-500/20 p-3 rounded-xl border border-yellow-500/30 text-yellow-500 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Phone Helpline</h4>
              <p className="text-xs text-gray-400">+1 (800) 555-RIDEX</p>
              <p className="text-xs text-gray-400 mt-0.5">Mon - Fri, 9am - 6pm EST</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 flex gap-4 items-start">
            <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30 text-emerald-500 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Global Headquarters</h4>
              <p className="text-xs text-gray-400">
                100 Pine Street, Suite 1200<br />
                San Francisco, CA 94111
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 w-full">
          <div className="w-full glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
                <h3 className="text-2xl font-bold text-white">Inquiry Submitted!</h3>
                <p className="text-xs text-gray-400 max-w-sm">
                  Thank you for contacting RIDEX. Our technical operators have logged your request to Firebase and will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold mt-4 transition-all"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400">YOUR NAME</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tony Stark"
                      className="px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tony@stark.com"
                      className="px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400">SUBJECT</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Fleet API access integration"
                    className="px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400">MESSAGE</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write details about your operational scope or support inquiry here..."
                    className="px-4 py-3 rounded-xl glass-input text-sm text-white focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
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
