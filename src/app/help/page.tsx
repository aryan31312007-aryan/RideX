"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  q: string;
  a: string;
}

export default function HelpPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      q: "How does the AI routing optimization perform estimations?",
      a: "RIDEX leverages city coordinate boundaries and speed index profiles to compute optimal paths. Fares are calculated dynamically based on baseline pricing rules fetched directly from the database, accounting for distance metrics and transit time estimators."
    },
    {
      q: "Can customers cancel a package delivery order?",
      a: "Yes. Customers can select their order in the dashboard and trigger a cancellation at any stage prior to 'Pickup Complete'. Once in transit, cancellation rights require admin authorization."
    },
    {
      q: "How can drivers get verified on the platform?",
      a: "Drivers can register, switch to the Driver Portal, and navigate to the credentials tab to upload identity documents (Driver License, vehicle RC). Once uploaded, administrators can review and verify files via the 'Driver Verificator' tool inside the Admin Control Center."
    },
    {
      q: "How do we modify baseline pricing scales?",
      a: "Dynamic fare baseline coefficients (base fare, per-km rate, per-minute rate) can be tweaked on-the-fly inside the Admin Dashboard under 'Pricing Rules'. Any adjustments sync instantly to all active client calculators."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-20 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-4xl text-center flex flex-col gap-4 mb-16">
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary uppercase w-fit mx-auto">
          FAQ Documentation
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          Help Center & Operations
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          Need assistance navigating the RIDEX platform or configuring dispatch options? Browse our frequently answered inquiries.
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveIndex(isOpen ? null : idx)}
                className="w-full flex justify-between items-center p-6 text-left text-sm md:text-base font-bold text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-gray-400 leading-relaxed border-t border-white/5 bg-white/[0.02]">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
